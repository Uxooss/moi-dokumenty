Add-Type -AssemblyName System.Drawing

function Resize-Image {
    param(
        [System.Drawing.Image]$src,
        [int]$width,
        [int]$height,
        [string]$destPath
    )
    $bmp = New-Object System.Drawing.Bitmap($width, $height)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    $g.DrawImage($src, 0, 0, $width, $height)
    $bmp.Save($destPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $g.Dispose()
    $bmp.Dispose()
}

function Create-Ico {
    param(
        [int[]]$sizes,
        [string]$sourcePath,
        [string]$icoPath
    )
    $src = [System.Drawing.Image]::FromFile($sourcePath)
    $pngStreams = @()
    
    foreach ($size in $sizes) {
        $bmp = New-Object System.Drawing.Bitmap($size, $size)
        $g = [System.Drawing.Graphics]::FromImage($bmp)
        $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
        $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
        $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
        $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
        $g.DrawImage($src, 0, 0, $size, $size)
        $ms = New-Object System.IO.MemoryStream
        $bmp.Save($ms, [System.Drawing.Imaging.ImageFormat]::Png)
        $pngStreams += @{ Size = $size; Bytes = $ms.ToArray() }
        $g.Dispose()
        $bmp.Dispose()
        $ms.Dispose()
    }
    $src.Dispose()

    $fs = [System.IO.File]::Create($icoPath)
    $bw = New-Object System.IO.BinaryWriter($fs)

    # ICONDIR
    $bw.Write([uint16]0)
    $bw.Write([uint16]1)
    $bw.Write([uint16]$pngStreams.Count)

    $offset = 6 + ($pngStreams.Count * 16)
    foreach ($item in $pngStreams) {
        $w = if ($item.Size -ge 256) { [byte]0 } else { [byte]$item.Size }
        $h = if ($item.Size -ge 256) { [byte]0 } else { [byte]$item.Size }
        $bw.Write($w)
        $bw.Write($h)
        $bw.Write([byte]0)
        $bw.Write([byte]0)
        $bw.Write([uint16]1)
        $bw.Write([uint16]32)
        $bw.Write([uint32]$item.Bytes.Length)
        $bw.Write([uint32]$offset)
        $offset += $item.Bytes.Length
    }

    foreach ($item in $pngStreams) {
        $bw.Write($item.Bytes)
    }

    $bw.Close()
    $fs.Close()
}

$inputImg = (Resolve-Path "assets\icons\concept-a-luxury-vault.jpg").Path
$src = [System.Drawing.Image]::FromFile($inputImg)
Resize-Image $src 512 512 "assets\icons\icon-512.png"
Resize-Image $src 256 256 "assets\icons\icon-256.png"
Resize-Image $src 192 192 "assets\icons\icon-192.png"
Resize-Image $src 128 128 "assets\icons\icon-128.png"
Resize-Image $src 64 64 "assets\icons\icon-64.png"
Resize-Image $src 32 32 "assets\icons\icon-32.png"
Resize-Image $src 16 16 "assets\icons\icon-16.png"
$src.Dispose()

Create-Ico @(256, 128, 64, 48, 32, 16) $inputImg "assets\icons\icon.ico"
Create-Ico @(32, 16) $inputImg "assets\icons\favicon.ico"

if (-not (Test-Path "build")) {
    New-Item -ItemType Directory -Path "build" | Out-Null
}
Copy-Item "assets\icons\icon.ico" "build\icon.ico" -Force
Copy-Item "assets\icons\icon-512.png" "icon.png" -Force

Write-Host "All icons generated successfully!"

/* pdfthumb.js — PDF thumbnail generation using PDF.js
 * Initialised lazily on first use.
 * Exported as window.PdfThumb
 */
(function(){
  "use strict";
  let _ready = false;
  let _initPromise = null;

  async function init(){
    if (_ready) return true;
    if (_initPromise) return _initPromise;
    _initPromise = (async () => {
      try {
        const pdfjsLib = window.pdfjsLib;
        if (!pdfjsLib) return false;
        /* Build a blob: URL from the worker file so it works under
         * file:// protocol without CORS issues.                    */
        try {
          const resp = await fetch("./pdf.worker.min.js");
          if (resp.ok) {
            const blob = await resp.blob();
            pdfjsLib.GlobalWorkerOptions.workerSrc = URL.createObjectURL(blob);
          } else {
            pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.min.js";
          }
        } catch(_) {
          pdfjsLib.GlobalWorkerOptions.workerSrc = "./pdf.worker.min.js";
        }
        _ready = true;
        return true;
      } catch(e) {
        console.warn("PdfThumb: init failed", e);
        return false;
      }
    })();
    return _initPromise;
  }

  /**
   * Generate a JPEG thumbnail blob from the first page of a PDF blob.
   * Returns null on any failure (graceful degradation).
   */
  async function generate(pdfBlob, scale){
    scale = scale || 0.6;
    const ok = await init();
    if (!ok) return null;
    try {
      const arrayBuffer = await pdfBlob.arrayBuffer();
      const loadingTask = window.pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) });
      const pdf = await loadingTask.promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: scale });
      const canvas = document.createElement("canvas");
      canvas.width  = viewport.width;
      canvas.height = viewport.height;
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport: viewport }).promise;
      return await new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.88));
    } catch(e) {
      console.warn("PdfThumb: render failed", e);
      return null;
    }
  }

  window.PdfThumb = { init: init, generate: generate };
})();

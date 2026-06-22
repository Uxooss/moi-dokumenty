(function(){
  "use strict";

  /* ===================== IndexedDB ===================== */
  const DB_NAME = "DocVaultDB", DB_VERSION = 1;
  let dbPromise = null;
  function openDB(){
    if(dbPromise) return dbPromise;
    dbPromise = new Promise((res,rej)=>{
      const r = indexedDB.open(DB_NAME, DB_VERSION);
      r.onupgradeneeded = e => {
        const db = e.target.result;
        if(!db.objectStoreNames.contains("documents")) db.createObjectStore("documents",{keyPath:"id",autoIncrement:true});
        if(!db.objectStoreNames.contains("settings"))  db.createObjectStore("settings", {keyPath:"key"});
      };
      r.onsuccess = e => res(e.target.result);
      r.onerror   = e => rej(e.target.error);
    });
    return dbPromise;
  }
  async function getStore(n,m){ const db=await openDB(); return db.transaction(n,m||"readonly").objectStore(n); }
  async function dbGetAll(n){ const s=await getStore(n); return new Promise((res,rej)=>{const r=s.getAll();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}); }
  async function dbPut(n,v){ const s=await getStore(n,"readwrite"); return new Promise((res,rej)=>{const r=s.put(v);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);}); }
  async function dbDelete(n,k){ const s=await getStore(n,"readwrite"); return new Promise((res,rej)=>{const r=s.delete(k);r.onsuccess=()=>res();r.onerror=()=>rej(r.error);}); }
  async function dbClear(n){ const s=await getStore(n,"readwrite"); return new Promise((res,rej)=>{const r=s.clear();r.onsuccess=()=>res();r.onerror=()=>rej(r.error);}); }

  /* ===================== State ===================== */
  const state = {
    docs:[], settings:{warnDays:30}, viewMode:"tile",
    filters:{scope:"active",status:"all",tags:new Set(),search:""}, sort:"expiry-asc",
    editingId:null, formFiles:[], confirmDuplicate:false,
  };
  let formTags = [];
  const urlCache = new WeakMap();
  const STATUS_DEFS = [
    {key:"all",label:"Усі"},{key:"valid",label:"Дійсні"},
    {key:"soon",label:"Спливають"},{key:"expired",label:"Прострочені"},{key:"none",label:"Безстрокові"},
  ];
  const ALLOWED_TYPES = ["application/pdf","image/jpeg","image/jpg","image/png"];

  /* ===================== DOM ===================== */
  const $ = id => document.getElementById(id);
  const searchInput=$("searchInput"), statusFiltersEl=$("statusFilters"), statusFilterGroup=$("statusFilterGroup"),
    tagFiltersEl=$("tagFilters"), sortSelect=$("sortSelect"), resetFiltersBtn=$("resetFiltersBtn"),
    cardsGrid=$("cardsGrid"), resultsCount=$("resultsCount"), emptyState=$("emptyState"),
    emptyAddBtn=$("emptyAddBtn"), alertBanner=$("alertBanner"), addBtn=$("addBtn"),
    settingsBtn=$("settingsBtn"), backupBtn=$("backupBtn"), reportBtn=$("reportBtn"),
    calendarBtn=$("calendarBtn"), lockBtn=$("lockBtn"), toastContainer=$("toastContainer"),
    scopeActiveBtn=$("scopeActiveBtn"), scopeArchiveBtn=$("scopeArchiveBtn"),
    scopeActiveCount=$("scopeActiveCount"), scopeArchiveCount=$("scopeArchiveCount");
  const editModal=$("editModal"), docForm=$("docForm"), modalTitle=$("modalTitle"),
    nameUaInput=$("nameUaInput"), nameEnInput=$("nameEnInput"), numberInput=$("numberInput"),
    tagsInput=$("tagsInput"), tagsChips=$("tagsChips"), tagSuggestions=$("tagSuggestions"),
    issueDateInput=$("issueDateInput"), expiryDateInput=$("expiryDateInput"), noExpiryCheckbox=$("noExpiryCheckbox"),
    notesInput=$("notesInput"), fileInput=$("fileInput"), attachList=$("attachList"),
    deleteDocBtn=$("deleteDocBtn"), archiveActionBtn=$("archiveActionBtn"),
    issueDateError=$("issueDateError"), expiryDateError=$("expiryDateError"), dropZone=$("dropZone");
  const settingsModal=$("settingsModal"), warnDaysInput=$("warnDaysInput"),
    saveSettingsBtn=$("saveSettingsBtn"), clearAllBtn=$("clearAllBtn"),
    pinStatusNote=$("pinStatusNote"), setPinBtn=$("setPinBtn"), removePinBtn=$("removePinBtn");
  const backupModal=$("backupModal"), exportBtn=$("exportBtn"),
    importBtn=$("importBtn"), importFileInput=$("importFileInput");
  const pinOverlay=$("pinOverlay"), pinTitle=$("pinTitle"), pinSubtitle=$("pinSubtitle"),
    pinDots=$("pinDots"), pinError=$("pinError"), pinSkipBtn=$("pinSkipBtn");
  const pinSetupModal=$("pinSetupModal"), pinInput1=$("pinInput1"), pinInput2=$("pinInput2"),
    confirmPinBtn=$("confirmPinBtn"), pinSetupError=$("pinSetupError");

  /* ===================== Utilities ===================== */
  function esc(s){ if(!s) return ""; return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
  function fmtDate(iso){ if(!iso) return ""; const p=iso.split("-"); return p.length===3?`${p[2]}.${p[1]}.${p[0]}`:iso; }
  function daysBetween(s){ const t=new Date(); t.setHours(0,0,0,0); return Math.round((new Date(s+"T00:00:00")-t)/86400000); }
  function pluralUk(n,f){ const a=n%10,b=n%100; if(a===1&&b!==11)return f[0]; if(a>=2&&a<=4&&(b<12||b>14))return f[1]; return f[2]; }

  function getDocStatus(doc){
    if(doc.noExpiry||!doc.expiryDate) return {key:"none",daysLeft:null};
    const d=daysBetween(doc.expiryDate);
    if(d<0) return {key:"expired",daysLeft:d};
    if(d<=state.settings.warnDays) return {key:"soon",daysLeft:d};
    return {key:"valid",daysLeft:d};
  }
  function stampText(doc){
    const s=getDocStatus(doc);
    if(s.key==="none") return "∞";
    if(s.key==="expired") return "ПРО-СТРО-ЧЕНО";
    if(s.key==="soon") return s.daysLeft===0?"СЬОГО-ДНІ":s.daysLeft===1?"1 ДЕНЬ":`${s.daysLeft} ДН.`;
    return "ДІЙСНИЙ";
  }

  function blobURL(blob){ if(!blob) return null; if(urlCache.has(blob)) return urlCache.get(blob); const u=URL.createObjectURL(blob); urlCache.set(blob,u); return u; }
  function getPreviewInfo(doc, large){
    const c=doc.files&&doc.files[0]; if(!c) return {kind:"none"};
    if(c.thumb) return {kind:"img",url:blobURL(c.thumb)};
    if(c.type&&c.type.startsWith("image/")) return {kind:"img",url:blobURL(c.blob)};
    if(c.type==="application/pdf") return large?{kind:"pdf-live",url:blobURL(c.blob)}:{kind:"pdf-icon"};
    return {kind:"none"};
  }

  function showToast(msg,type){
    const el=document.createElement("div"); el.className="toast toast-"+(type||"info"); el.textContent=msg;
    toastContainer.appendChild(el); requestAnimationFrame(()=>el.classList.add("show"));
    setTimeout(()=>{el.classList.remove("show");setTimeout(()=>el.remove(),300);},3800);
  }
  function showModal(m){ m.classList.remove("hidden"); document.body.style.overflow="hidden"; }
  function closeModal(m){ m.classList.add("hidden"); document.body.style.overflow=""; }
  document.querySelectorAll("[data-close-modal]").forEach(b=>b.addEventListener("click",()=>closeModal($(b.getAttribute("data-close-modal")))));
  document.querySelectorAll(".modal-overlay").forEach(o=>o.addEventListener("click",e=>{if(e.target===o)closeModal(o);}));
  document.addEventListener("keydown",e=>{ if(e.key==="Escape"&&pinOverlay.classList.contains("hidden")) document.querySelectorAll(".modal-overlay:not(.hidden)").forEach(closeModal); });

  /* ===================== base64 ↔ Blob ===================== */
  function blobToDataURL(b){ return new Promise((res,rej)=>{const r=new FileReader();r.onloadend=()=>res(r.result);r.onerror=rej;r.readAsDataURL(b);}); }
  async function dataURLToBlob(u){ return (await fetch(u)).blob(); }

  /* ===================== PIN system ===================== */
  let pinBuffer = "";
  let pinAttempts = 0, pinLockUntil = 0;
  const PIN_MAX_ATTEMPTS = 5;

  async function sha256(text){
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b=>b.toString(16).padStart(2,"0")).join("");
  }
  async function getPINHash(){ const rows=await dbGetAll("settings"); const r=rows.find(x=>x.key==="pinHash"); return r?r.value:null; }

  function updatePinDots(){
    pinDots.querySelectorAll(".pd").forEach((d,i)=>{d.classList.toggle("filled",i<pinBuffer.length);d.classList.remove("error");});
  }
  function shakePinDots(){
    pinDots.querySelectorAll(".pd").forEach(d=>d.classList.add("error"));
    pinError.classList.remove("hidden");
    setTimeout(()=>pinDots.querySelectorAll(".pd").forEach(d=>d.classList.remove("error")),600);
  }
  async function tryUnlock(){
    if(Date.now()<pinLockUntil){
      const s=Math.ceil((pinLockUntil-Date.now())/1000);
      pinError.textContent=`Зачекайте ${s} с.`; pinError.classList.remove("hidden");
      pinBuffer=""; updatePinDots(); return;
    }
    const hash=await getPINHash();
    if(!hash){ closePINOverlay(); return; }
    if(await sha256(pinBuffer)===hash){
      pinAttempts=0; pinBuffer=""; updatePinDots(); closePINOverlay();
    } else {
      pinAttempts++;
      if(pinAttempts>=PIN_MAX_ATTEMPTS){ pinLockUntil=Date.now()+30000; pinAttempts=0; pinError.textContent="Занадто багато спроб. Зачекайте 30 с."; }
      else { pinError.textContent=`Неправильний PIN (${PIN_MAX_ATTEMPTS-pinAttempts} залишилось)`; }
      shakePinDots(); pinBuffer=""; updatePinDots();
    }
  }
  function openPINOverlay(){
    pinBuffer=""; updatePinDots(); pinError.classList.add("hidden");
    pinTitle.textContent="Введіть PIN-код"; pinSubtitle.textContent="для доступу до архіву";
    pinSkipBtn.classList.add("hidden");
    pinOverlay.classList.remove("hidden"); document.body.style.overflow="hidden";
  }
  function closePINOverlay(){ pinOverlay.classList.add("hidden"); document.body.style.overflow=""; }

  pinOverlay.addEventListener("click",async e=>{
    const k=e.target.getAttribute("data-k"); if(!k) return;
    if(k==="clear"){ if(pinBuffer.length) pinBuffer=pinBuffer.slice(0,-1); updatePinDots(); return; }
    if(k==="ok"){ if(pinBuffer.length===4) await tryUnlock(); return; }
    if(pinBuffer.length<4){ pinBuffer+=k; updatePinDots(); if(pinBuffer.length===4) await tryUnlock(); }
  });
  document.addEventListener("keydown",async e=>{
    if(pinOverlay.classList.contains("hidden")) return;
    if(e.key>="0"&&e.key<="9"&&pinBuffer.length<4){ pinBuffer+=e.key; updatePinDots(); if(pinBuffer.length===4) await tryUnlock(); }
    else if(e.key==="Backspace"&&pinBuffer.length){ pinBuffer=pinBuffer.slice(0,-1); updatePinDots(); }
    else if(e.key==="Enter"&&pinBuffer.length===4) await tryUnlock();
  });
  pinSkipBtn.addEventListener("click",()=>closePINOverlay());
  lockBtn.addEventListener("click",()=>openPINOverlay());

  function updatePINUI(hasPin){
    pinStatusNote.textContent=hasPin?"PIN-код встановлено ✓":"PIN-код не встановлено";
    setPinBtn.textContent=hasPin?"Змінити PIN":"Встановити PIN";
    removePinBtn.classList.toggle("hidden",!hasPin);
    lockBtn.classList.toggle("hidden",!hasPin);
  }
  async function initPIN(){ const h=await getPINHash(); if(h) openPINOverlay(); updatePINUI(!!h); }

  setPinBtn.addEventListener("click",()=>{
    pinInput1.value=""; pinInput2.value=""; pinSetupError.classList.add("hidden");
    showModal(pinSetupModal);
  });
  removePinBtn.addEventListener("click",async()=>{
    await dbDelete("settings","pinHash"); updatePINUI(false); showToast("PIN-код видалено","success");
  });
  confirmPinBtn.addEventListener("click",async()=>{
    const p1=pinInput1.value.trim(), p2=pinInput2.value.trim();
    if(p1.length!==4||!/^\d{4}$/.test(p1)||p1!==p2){ pinSetupError.classList.remove("hidden"); return; }
    await dbPut("settings",{key:"pinHash",value:await sha256(p1)});
    closeModal(pinSetupModal); updatePINUI(true); showToast("PIN-код встановлено","success");
  });

  /* ===================== Data load & seeding ===================== */
  async function loadSettings(){
    const rows=await dbGetAll("settings");
    state.settings.warnDays=(rows.find(r=>r.key==="warnDays")||{value:30}).value;
    state.viewMode=(rows.find(r=>r.key==="viewMode")||{value:"tile"}).value;
  }
  async function loadDocs(){ state.docs=await dbGetAll("documents"); }
  async function maybeSeed(){
    const rows=await dbGetAll("settings");
    if(rows.find(r=>r.key==="seeded_v1")) return;
    const seed=window.SEED_DOCS;
    if(!seed||!seed.length){ await dbPut("settings",{key:"seeded_v1",value:true}); return; }
    showToast("Завантажуються початкові документи…","info");
    for(const sd of seed){
      const files=[];
      for(const f of sd.files){
        const blob=await dataURLToBlob(`data:${f.type};base64,${f.base64}`);
        const thumb=f.thumbB64?await dataURLToBlob(`data:image/jpeg;base64,${f.thumbB64}`):null;
        files.push({name:f.name,type:f.type,blob,thumb});
      }
      await dbPut("documents",{
        nameUa:sd.nameUa,nameEn:sd.nameEn,number:sd.number,tags:(sd.tags||[]).slice(),
        issueDate:sd.issueDate,expiryDate:sd.expiryDate,noExpiry:sd.noExpiry,notes:sd.notes||"",
        files,archived:false,createdAt:Date.now(),updatedAt:Date.now(),
      });
    }
    await dbPut("settings",{key:"seeded_v1",value:true});
    showToast(`Додано ${seed.length} ${pluralUk(seed.length,["документ","документи","документів"])} із початкового архіву`,"success");
  }

  /* ===================== Filtering / sorting ===================== */
  function getFilteredDocs(){
    let list=state.docs.filter(d=>!!d.archived===(state.filters.scope==="archive"));
    if(state.filters.scope==="active"&&state.filters.status!=="all") list=list.filter(d=>getDocStatus(d).key===state.filters.status);
    if(state.filters.tags.size) list=list.filter(d=>(d.tags||[]).some(t=>state.filters.tags.has(t)));
    if(state.filters.search.trim()){
      const q=state.filters.search.trim().toLowerCase();
      list=list.filter(d=>(d.nameUa||"").toLowerCase().includes(q)||(d.nameEn||"").toLowerCase().includes(q)||
        (d.number||"").toLowerCase().includes(q)||(d.tags||[]).some(t=>t.toLowerCase().includes(q))||
        fmtDate(d.issueDate).includes(q)||fmtDate(d.expiryDate).includes(q)||
        (d.issueDate||"").includes(q)||(d.expiryDate||"").includes(q));
    }
    list.sort((a,b)=>{
      if(state.sort==="expiry-asc"){ const da=(a.noExpiry||!a.expiryDate)?Infinity:daysBetween(a.expiryDate); const db=(b.noExpiry||!b.expiryDate)?Infinity:daysBetween(b.expiryDate); return da-db; }
      if(state.sort==="name-asc") return (a.nameUa||"").localeCompare(b.nameUa||"","uk");
      if(state.sort==="added-desc") return (b.createdAt||0)-(a.createdAt||0);
      return 0;
    });
    return list;
  }

  /* ===================== Sidebar ===================== */
  function renderSidebar(){
    const active=state.docs.filter(d=>!d.archived), arch=state.docs.filter(d=>d.archived);
    scopeActiveCount.textContent=active.length; scopeArchiveCount.textContent=arch.length;
    scopeActiveBtn.classList.toggle("active",state.filters.scope==="active");
    scopeArchiveBtn.classList.toggle("active",state.filters.scope==="archive");
    statusFilterGroup.classList.toggle("hidden",state.filters.scope==="archive");
    const counts={all:active.length,valid:0,soon:0,expired:0,none:0};
    active.forEach(d=>{counts[getDocStatus(d).key]++;});
    statusFiltersEl.innerHTML=STATUS_DEFS.map(s=>`<button class="filter-pill${state.filters.status===s.key?" active":""}" data-status="${s.key}"><span class="dot dot-${s.key}"></span>${s.label}<span class="count">${counts[s.key]}</span></button>`).join("");
    const allTags=new Set(); state.docs.forEach(d=>(d.tags||[]).forEach(t=>allTags.add(t)));
    const sorted=[...allTags].sort((a,b)=>a.localeCompare(b,"uk"));
    tagFiltersEl.innerHTML=sorted.length?sorted.map(t=>`<button class="tag-pill-btn${state.filters.tags.has(t)?" active":""}" data-tag="${esc(t)}">${esc(t)}</button>`).join(""):'<p class="muted-note">Тегів ще немає</p>';
    tagSuggestions.innerHTML=sorted.map(t=>`<option value="${esc(t)}">`).join("");
  }

  /* ===================== Card templates ===================== */
  function thumbHtml(doc,large){
    const info=getPreviewInfo(doc,large);
    if(info.kind==="img") return `<img src="${info.url}" alt="">`;
    if(info.kind==="pdf-live") return `<iframe src="${info.url}#toolbar=0&navpanes=0&view=FitH" loading="lazy"></iframe>`;
    if(info.kind==="pdf-icon") return `<div class="doc-thumb-placeholder"><span class="ph-icon">PDF</span></div>`;
    return `<div class="doc-thumb-placeholder"><span class="ph-icon">—</span></div>`;
  }
  function archCtlHtml(doc){
    const s=getDocStatus(doc);
    if(doc.archived) return `<button class="unarchive-btn" data-unarchive="${doc.id}">↺ з архіву</button>`;
    if(s.key==="expired") return `<button class="archive-btn" data-archive="${doc.id}">🗄 архів</button>`;
    return "";
  }
  function mkMeta(doc){ return doc.expiryDate?`<span>до ${fmtDate(doc.expiryDate)}</span>`:doc.noExpiry?`<span>безстроково</span>`:""; }
  function mkTags(doc){ return (doc.tags||[]).length?`<div class="card-tags">${doc.tags.map(t=>`<span class="tag-pill">${esc(t)}</span>`).join("")}</div>`:""; }

  function cardTile(doc){
    const s=getDocStatus(doc), fc=(doc.files||[]).length;
    return `<article class="doc-card status-${s.key}${doc.archived?" is-archived":""}" data-id="${doc.id}" tabindex="0">
      <div class="doc-thumb">${thumbHtml(doc,false)}<div class="thumb-stamp stamp-${s.key}">${stampText(doc)}</div>${archCtlHtml(doc)}${fc>1?`<span class="file-count-badge">${fc} ${pluralUk(fc,["файл","файли","файлів"])}</span>`:""}</div>
      <div class="card-body"><div class="card-titles"><h3>${esc(doc.nameUa)}</h3>${doc.nameEn?`<p class="card-name-en">${esc(doc.nameEn)}</p>`:""}</div>${doc.number?`<p class="card-number">№ ${esc(doc.number)}</p>`:""}<div class="card-meta">${mkMeta(doc)}</div>${mkTags(doc)}</div>
    </article>`;
  }
  function cardLarge(doc){
    const s=getDocStatus(doc), fc=(doc.files||[]).length;
    return `<article class="doc-card status-${s.key}${doc.archived?" is-archived":""}" data-id="${doc.id}" tabindex="0">
      <div class="doc-thumb">${thumbHtml(doc,true)}<div class="thumb-stamp stamp-${s.key}">${stampText(doc)}</div>${archCtlHtml(doc)}${fc>1?`<span class="file-count-badge">${fc} ${pluralUk(fc,["файл","файли","файлів"])}</span>`:""}</div>
      <div class="card-body"><div class="card-titles"><h3>${esc(doc.nameUa)}</h3>${doc.nameEn?`<p class="card-name-en">${esc(doc.nameEn)}</p>`:""}</div>${doc.number?`<p class="card-number">№ ${esc(doc.number)}</p>`:""}<div class="card-meta">${mkMeta(doc)}</div>${mkTags(doc)}</div>
    </article>`;
  }
  function cardRow(doc){
    const s=getDocStatus(doc), info=getPreviewInfo(doc,false);
    const thumb=info.kind==="img"?`<img src="${info.url}" alt="">`:`<div class="ph-icon">${info.kind==="pdf-icon"?"PDF":"—"}</div>`;
    const dateText=doc.expiryDate?fmtDate(doc.expiryDate):doc.noExpiry?"безстроково":"—";
    const archBtn=doc.archived?`<button class="row-unarchive-btn" data-unarchive="${doc.id}">↺ з архіву</button>`:s.key==="expired"?`<button class="row-archive-btn" data-archive="${doc.id}">🗄 архів</button>`:"";
    return `<article class="doc-row status-${s.key}${doc.archived?" is-archived":""}" data-id="${doc.id}" tabindex="0">
      <div class="row-thumb">${thumb}</div>
      <div class="row-titles"><h3>${esc(doc.nameUa)}</h3>${doc.nameEn?`<p>${esc(doc.nameEn)}</p>`:""}</div>
      <div class="row-number">${doc.number?"№ "+esc(doc.number):""}</div>
      <div class="row-tags">${(doc.tags||[]).slice(0,3).map(t=>`<span class="tag-pill">${esc(t)}</span>`).join("")}</div>
      <div class="row-date">${dateText}</div>
      <div class="row-actions">${archBtn}<div class="row-stamp stamp-${s.key}">${stampText(doc)}</div></div>
    </article>`;
  }

  /* ===================== Render ===================== */
  function renderCards(){
    const list=getFilteredDocs();
    resultsCount.textContent=`${list.length} ${pluralUk(list.length,["документ","документи","документів"])}`;
    document.querySelectorAll(".view-btn").forEach(b=>b.classList.toggle("active",b.getAttribute("data-view")===state.viewMode));
    if(!state.docs.length){
      cardsGrid.innerHTML=""; cardsGrid.className="cards-grid";
      emptyState.classList.remove("hidden"); emptyState.querySelector(".empty-state-text").textContent="Тут поки порожньо.";
      emptyAddBtn.classList.remove("hidden"); resultsCount.textContent=""; return;
    }
    if(!list.length){
      cardsGrid.innerHTML=""; cardsGrid.className="cards-grid";
      emptyState.classList.remove("hidden");
      emptyState.querySelector(".empty-state-text").textContent=state.filters.scope==="archive"?"В архіві поки нічого немає.":"Нічого не знайдено.";
      emptyAddBtn.classList.add("hidden"); return;
    }
    emptyState.classList.add("hidden");
    if(state.viewMode==="list"){ cardsGrid.className="cards-list"; cardsGrid.innerHTML=list.map(cardRow).join(""); }
    else if(state.viewMode==="large"){ cardsGrid.className="cards-grid mode-large"; cardsGrid.innerHTML=list.map(cardLarge).join(""); }
    else { cardsGrid.className="cards-grid"; cardsGrid.innerHTML=list.map(cardTile).join(""); }
  }
  function renderAlertBanner(){
    const urgent=state.docs.filter(d=>!d.archived&&["soon","expired"].includes(getDocStatus(d).key));
    if(!urgent.length){ alertBanner.classList.add("hidden"); alertBanner.innerHTML=""; return; }
    urgent.sort((a,b)=>getDocStatus(a).daysLeft-getDocStatus(b).daysLeft);
    const exp=urgent.filter(d=>getDocStatus(d).key==="expired").length, soon=urgent.length-exp;
    let det=""; if(exp) det+=`${exp} ${pluralUk(exp,["прострочений","прострочені","прострочених"])}`; if(exp&&soon) det+=" · "; if(soon) det+=`${soon} ${pluralUk(soon,["спливає","спливають","спливають"])} найближчим часом`;
    const chips=urgent.slice(0,5).map(d=>`<button class="alert-chip" data-open="${d.id}">${esc(d.nameUa)} · ${stampText(d)}</button>`).join("");
    alertBanner.classList.remove("hidden");
    alertBanner.innerHTML=`<div class="alert-icon">⚠</div><div class="alert-text"><strong>${urgent.length} ${pluralUk(urgent.length,["документ потребує","документи потребують","документів потребують"])} уваги</strong><span>${det}</span></div><div class="alert-chips">${chips}${urgent.length>5?`<span class="alert-more">+${urgent.length-5}</span>`:""}</div>`;
  }
  function renderAll(){ renderSidebar(); renderCards(); renderAlertBanner(); }

  /* ===================== Tag chips (form) ===================== */
  function renderFormTags(){
    tagsChips.innerHTML=formTags.map((t,i)=>`<span class="chip">${esc(t)}<button type="button" data-remove-tag="${i}">×</button></span>`).join("");
  }
  tagsChips.addEventListener("click",e=>{ const i=e.target.getAttribute("data-remove-tag"); if(i!==null){formTags.splice(+i,1);renderFormTags();} });
  tagsInput.addEventListener("keydown",e=>{
    if(e.key==="Enter"||e.key===","){ e.preventDefault(); const v=tagsInput.value.trim().replace(/,$/,""); if(v&&!formTags.includes(v)){formTags.push(v);renderFormTags();} tagsInput.value=""; }
    else if(e.key==="Backspace"&&!tagsInput.value&&formTags.length){formTags.pop();renderFormTags();}
  });

  /* ===================== PDF thumbnail generation ===================== */
  async function generateThumb(entry){
    if(entry.type!=="application/pdf"||entry.thumb) return;
    try{ const t=await window.PdfThumb.generate(entry.blob,0.55); if(t) entry.thumb=t; }
    catch(e){ console.warn("thumb gen failed",e); }
  }

  /* ===================== Attach list & drag-drop ===================== */
  async function addFiles(fileList){
    for(const f of Array.from(fileList)){
      if(!ALLOWED_TYPES.includes(f.type)){ showToast(`«${f.name}» пропущено: підтримуються PDF, JPG, PNG`,"error"); continue; }
      if(f.size>25*1024*1024){ showToast(`«${f.name}» завеликий (макс. 25 МБ)`,"error"); continue; }
      const entry={name:f.name,type:f.type,blob:f,thumb:null};
      state.formFiles.push(entry);
      generateThumb(entry).then(()=>renderAttachList());
    }
    renderAttachList();
  }
  fileInput.addEventListener("change",async()=>{ await addFiles(fileInput.files); fileInput.value=""; });
  dropZone.addEventListener("dragover",e=>{ e.preventDefault(); dropZone.classList.add("drag-over"); });
  dropZone.addEventListener("dragleave",e=>{ if(!dropZone.contains(e.relatedTarget)) dropZone.classList.remove("drag-over"); });
  dropZone.addEventListener("drop",async e=>{ e.preventDefault(); dropZone.classList.remove("drag-over"); await addFiles(e.dataTransfer.files); });

  function renderAttachList(){
    if(!state.formFiles.length){ attachList.innerHTML='<p class="muted-note">Файлів ще не додано</p>'; return; }
    attachList.innerHTML=state.formFiles.map((f,i)=>{
      const url=blobURL(f.thumb||f.blob);
      const thumb=(f.thumb||f.type.startsWith("image/"))?`<img class="attach-thumb" src="${url}" alt="">`:`<div class="attach-thumb-ph">${f.type==="application/pdf"?"PDF":"?"}</div>`;
      return `<div class="attach-row${i===0?" is-cover":""}">
        ${thumb}<div class="attach-meta"><span class="attach-name">${esc(f.name)}</span>${i===0?'<span class="attach-cover-tag">обкладинка</span>':""}</div>
        <div class="attach-actions">${i!==0?`<button type="button" data-cover="${i}">обкладинка</button>`:""}<button type="button" data-view-file="${i}">👁</button><button type="button" class="remove-btn" data-remove-file="${i}">✕</button></div>
      </div>`;
    }).join("");
  }
  attachList.addEventListener("click",e=>{
    const ci=e.target.getAttribute("data-cover"), vi=e.target.getAttribute("data-view-file"), ri=e.target.getAttribute("data-remove-file");
    if(ci!==null){ const x=+ci; const[it]=state.formFiles.splice(x,1); state.formFiles.unshift(it); renderAttachList(); }
    else if(vi!==null){ const f=state.formFiles[+vi]; if(f) window.open(blobURL(f.blob),"_blank"); }
    else if(ri!==null){ state.formFiles.splice(+ri,1); renderAttachList(); }
  });

  /* ===================== Date validation ===================== */
  function clearDateErrors(){ [issueDateError,expiryDateError].forEach(e=>e.classList.add("hidden")); [issueDateInput,expiryDateInput].forEach(i=>i.classList.remove("error-field")); }
  function validateDates(issueVal,expiryVal,noExpiry){
    clearDateErrors(); let ok=true;
    function badYear(v){ const y=parseInt(v.substring(0,4)); return y<1980||y>2099; }
    if(issueVal&&badYear(issueVal)){ issueDateInput.classList.add("error-field"); issueDateError.textContent="Рік має бути між 1980 та 2099"; issueDateError.classList.remove("hidden"); ok=false; }
    if(!noExpiry&&expiryVal){
      if(badYear(expiryVal)){ expiryDateInput.classList.add("error-field"); expiryDateError.textContent="Рік має бути між 1980 та 2099"; expiryDateError.classList.remove("hidden"); ok=false; }
      else if(issueVal&&expiryVal<issueVal){ expiryDateInput.classList.add("error-field"); expiryDateError.textContent="Дата закінчення раніше дати видачі"; expiryDateError.classList.remove("hidden"); ok=false; }
    }
    return ok;
  }

  /* ===================== Add / Edit modal ===================== */
  function openAddModal(){
    state.editingId=null; state.confirmDuplicate=false; docForm.reset(); formTags=[]; state.formFiles=[];
    renderFormTags(); renderAttachList(); clearDateErrors();
    modalTitle.textContent="Новий документ"; deleteDocBtn.classList.add("hidden"); archiveActionBtn.classList.add("hidden");
    expiryDateInput.disabled=false; showModal(editModal); nameUaInput.focus();
  }
  function openEditModal(doc){
    state.editingId=doc.id; state.confirmDuplicate=false;
    nameUaInput.value=doc.nameUa||""; nameEnInput.value=doc.nameEn||""; numberInput.value=doc.number||"";
    issueDateInput.value=doc.issueDate||""; noExpiryCheckbox.checked=!!doc.noExpiry;
    expiryDateInput.value=doc.expiryDate||""; expiryDateInput.disabled=!!doc.noExpiry;
    notesInput.value=doc.notes||""; formTags=(doc.tags||[]).slice(); renderFormTags(); clearDateErrors();
    state.formFiles=(doc.files||[]).map(f=>({name:f.name,type:f.type,blob:f.blob,thumb:f.thumb||null})); renderAttachList();
    modalTitle.textContent="Документ"; deleteDocBtn.classList.remove("hidden"); deleteDocBtn.textContent="Видалити документ"; deleteDocBtn.classList.remove("armed");
    const s=getDocStatus(doc);
    if(doc.archived){archiveActionBtn.textContent="Повернути з архіву";archiveActionBtn.classList.remove("hidden");}
    else if(s.key==="expired"){archiveActionBtn.textContent="Архівувати";archiveActionBtn.classList.remove("hidden");}
    else{archiveActionBtn.classList.add("hidden");}
    showModal(editModal);
  }
  archiveActionBtn.addEventListener("click",async()=>{ const d=state.docs.find(x=>x.id===state.editingId); if(!d) return; d.archived?await unarchiveDoc(d.id):await archiveDoc(d.id); closeModal(editModal); });
  noExpiryCheckbox.addEventListener("change",()=>{ expiryDateInput.disabled=noExpiryCheckbox.checked; if(noExpiryCheckbox.checked) expiryDateInput.value=""; clearDateErrors(); });

  docForm.addEventListener("submit",async e=>{
    e.preventDefault();
    const nameUa=nameUaInput.value.trim();
    if(!nameUa){ showToast("Вкажіть назву документа українською","error"); nameUaInput.focus(); return; }
    if(!noExpiryCheckbox.checked&&!expiryDateInput.value){ showToast("Вкажіть дату закінчення або позначте «Безстроковий»","error"); expiryDateInput.focus(); return; }
    if(!validateDates(issueDateInput.value,expiryDateInput.value,noExpiryCheckbox.checked)) return;
    const number=numberInput.value.trim();
    const dup=state.docs.find(d=>d.id!==state.editingId&&(d.nameUa||"").toLowerCase()===nameUa.toLowerCase()&&number&&d.number&&d.number.toLowerCase()===number.toLowerCase());
    if(dup&&!state.confirmDuplicate){ showToast("Документ із такою назвою та номером вже є. Натисніть «Зберегти» ще раз.","warn"); state.confirmDuplicate=true; return; }
    state.confirmDuplicate=false;
    const docData={
      nameUa, nameEn:nameEnInput.value.trim(), number, tags:formTags.slice(),
      issueDate:issueDateInput.value||"", noExpiry:noExpiryCheckbox.checked,
      expiryDate:noExpiryCheckbox.checked?"":expiryDateInput.value, notes:notesInput.value.trim(),
      files:state.formFiles.map(f=>({name:f.name,type:f.type,blob:f.blob,thumb:f.thumb||null})),
      updatedAt:Date.now(),
    };
    if(state.editingId){
      const ex=state.docs.find(d=>d.id===state.editingId);
      docData.id=state.editingId; docData.createdAt=ex?ex.createdAt:Date.now(); docData.archived=ex?!!ex.archived:false;
      await dbPut("documents",docData); showToast("Зміни збережено","success");
    } else {
      docData.createdAt=Date.now(); docData.archived=false;
      await dbPut("documents",docData); showToast("Документ додано","success");
    }
    await loadDocs(); closeModal(editModal); renderAll();
  });

  let deleteArmed=false;
  deleteDocBtn.addEventListener("click",async()=>{
    if(!deleteArmed){ deleteArmed=true; deleteDocBtn.textContent="Підтвердити видалення?"; deleteDocBtn.classList.add("armed"); setTimeout(()=>{deleteArmed=false;deleteDocBtn.textContent="Видалити документ";deleteDocBtn.classList.remove("armed");},4000); return; }
    await dbDelete("documents",state.editingId); await loadDocs(); closeModal(editModal); renderAll(); deleteArmed=false; showToast("Документ видалено","success");
  });

  /* ===================== Archive ===================== */
  async function archiveDoc(id){ const d=state.docs.find(x=>x.id===id); if(!d) return; d.archived=true; d.updatedAt=Date.now(); await dbPut("documents",d); await loadDocs(); renderAll(); showToast("Документ переміщено в архів","success"); }
  async function unarchiveDoc(id){ const d=state.docs.find(x=>x.id===id); if(!d) return; d.archived=false; d.updatedAt=Date.now(); await dbPut("documents",d); await loadDocs(); renderAll(); showToast("Документ повернуто з архіву","success"); }

  /* ===================== Event delegation ===================== */
  cardsGrid.addEventListener("click",e=>{
    const ab=e.target.closest("[data-archive]"); if(ab){e.stopPropagation();archiveDoc(+ab.getAttribute("data-archive"));return;}
    const ub=e.target.closest("[data-unarchive]"); if(ub){e.stopPropagation();unarchiveDoc(+ub.getAttribute("data-unarchive"));return;}
    const card=e.target.closest("[data-id]"); if(!card) return;
    const doc=state.docs.find(d=>String(d.id)===card.getAttribute("data-id")); if(doc) openEditModal(doc);
  });
  cardsGrid.addEventListener("keydown",e=>{
    if(e.key!=="Enter"&&e.key!==" ") return; const card=e.target.closest("[data-id]"); if(!card) return; e.preventDefault();
    const doc=state.docs.find(d=>String(d.id)===card.getAttribute("data-id")); if(doc) openEditModal(doc);
  });
  alertBanner.addEventListener("click",e=>{ const c=e.target.closest("[data-open]"); if(!c) return; const doc=state.docs.find(d=>String(d.id)===c.getAttribute("data-open")); if(doc) openEditModal(doc); });
  statusFiltersEl.addEventListener("click",e=>{ const b=e.target.closest("[data-status]"); if(!b) return; state.filters.status=b.getAttribute("data-status"); renderAll(); });
  tagFiltersEl.addEventListener("click",e=>{ const b=e.target.closest("[data-tag]"); if(!b) return; const t=b.getAttribute("data-tag"); state.filters.tags.has(t)?state.filters.tags.delete(t):state.filters.tags.add(t); renderAll(); });
  scopeActiveBtn.addEventListener("click",()=>{state.filters.scope="active";renderAll();});
  scopeArchiveBtn.addEventListener("click",()=>{state.filters.scope="archive";renderAll();});
  sortSelect.addEventListener("change",()=>{state.sort=sortSelect.value;renderCards();});
  document.querySelectorAll(".view-btn").forEach(b=>b.addEventListener("click",async()=>{ state.viewMode=b.getAttribute("data-view"); await dbPut("settings",{key:"viewMode",value:state.viewMode}); renderCards(); }));
  resetFiltersBtn.addEventListener("click",()=>{ state.filters.status="all"; state.filters.tags=new Set(); state.filters.search=""; searchInput.value=""; sortSelect.value="expiry-asc"; state.sort="expiry-asc"; renderAll(); });
  let sd=null; searchInput.addEventListener("input",()=>{ clearTimeout(sd); sd=setTimeout(()=>{state.filters.search=searchInput.value;renderCards();},150); });
  addBtn.addEventListener("click",openAddModal); emptyAddBtn.addEventListener("click",openAddModal);

  /* ===================== Calendar export (.ics) ===================== */
  calendarBtn.addEventListener("click",exportCalendar);
  function icsDate(iso){ return iso.replace(/-/g,""); }
  function icsDatePlus1(iso){ const d=new Date(iso+"T00:00:00"); d.setDate(d.getDate()+1); return d.toISOString().slice(0,10).replace(/-/g,""); }
  function icsEsc(s){ return (s||"").replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n"); }
  function nowStamp(){ return new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d+/,""); }

  async function exportCalendar(){
    const docs=state.docs.filter(d=>!d.archived&&d.expiryDate&&!d.noExpiry);
    if(!docs.length){ showToast("Немає документів з обмеженим строком дії","warn"); return; }
    const lines=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//DocVault//Certificates//UK","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:Сертифікати та ліцензії"];
    for(const d of docs){
      lines.push(
        "BEGIN:VEVENT",
        `UID:docvault-${d.id}@docvault`,
        `DTSTAMP:${nowStamp()}Z`,
        `DTSTART;VALUE=DATE:${icsDate(d.expiryDate)}`,
        `DTEND;VALUE=DATE:${icsDatePlus1(d.expiryDate)}`,
        `SUMMARY:⚠ Закінчується: ${icsEsc(d.nameUa)}`,
        `DESCRIPTION:${icsEsc(d.nameEn||"")}${d.number?"\\nНомер: "+icsEsc(d.number):""}`,
        "BEGIN:VALARM","TRIGGER:-P30D","ACTION:DISPLAY",`DESCRIPTION:За 30 днів: ${icsEsc(d.nameUa)}`,"END:VALARM",
        "BEGIN:VALARM","TRIGGER:-P7D","ACTION:DISPLAY",`DESCRIPTION:За 7 днів: ${icsEsc(d.nameUa)}`,"END:VALARM",
        "BEGIN:VALARM","TRIGGER:-P1D","ACTION:DISPLAY",`DESCRIPTION:Завтра закінчується: ${icsEsc(d.nameUa)}`,"END:VALARM",
        "END:VEVENT"
      );
    }
    lines.push("END:VCALENDAR");
    const content=lines.join("\r\n"), stamp=new Date().toISOString().slice(0,10), filename=`sertyfikaty-${stamp}.ics`;
    if(window.showSaveFilePicker){
      try{ const h=await window.showSaveFilePicker({suggestedName:filename,types:[{description:"iCalendar",accept:{"text/calendar":[".ics"]}}]}); const w=await h.createWritable(); await w.write(content); await w.close(); showToast("Календар збережено","success"); return; }
      catch(e){ if(e&&e.name==="AbortError") return; }
    }
    const blob=new Blob([content],{type:"text/calendar;charset=utf-8"});
    const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove();
    setTimeout(()=>URL.revokeObjectURL(url),5000); showToast("Файл .ics завантажено","success");
  }

  /* ===================== Print report ===================== */
  reportBtn.addEventListener("click",printReport);
  const SL={valid:"Дійсний",soon:"Спливає",expired:"Прострочено",none:"Безстроково"};
  const SC={valid:"pr-valid",soon:"pr-soon",expired:"pr-expired",none:"pr-none"};

  function printReport(){
    const list=getFilteredDocs();
    if(!list.length){ showToast("Немає документів для звіту","warn"); return; }
    const now=new Date().toLocaleDateString("uk-UA",{day:"2-digit",month:"2-digit",year:"numeric"});
    const scopeLabel=state.filters.scope==="archive"?"(Архів)":"(Активні)";
    const rows=list.map(d=>{
      const s=getDocStatus(d); const sl=SL[s.key]||""; const sc=SC[s.key]||"";
      const note=s.key==="soon"?` (${s.daysLeft} дн.)`:s.key==="expired"?` (${Math.abs(s.daysLeft)} дн. тому)`:"";
      return `<tr><td>${d.nameUa}${d.nameEn?`<br><span style="font-size:9.5px;color:#666">${d.nameEn}</span>`:""}</td><td>${d.number||"—"}</td><td>${d.issueDate?fmtDate(d.issueDate):"—"}</td><td>${d.noExpiry?"Безстроково":d.expiryDate?fmtDate(d.expiryDate):"—"}</td><td class="${sc}">${sl}${note}</td><td>${(d.tags||[]).join(", ")||"—"}</td></tr>`;
    }).join("");
    const html=`<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8"><title>Звіт — Сертифікати та ліцензії</title>
    <style>body{font-family:Georgia,"Times New Roman",serif;color:#111;margin:0;padding:20mm;font-size:11px;}h1{font-size:17px;margin:0 0 3px;}p.meta{font-size:9.5px;color:#666;margin:0 0 14px;}table{width:100%;border-collapse:collapse;}th{background:#111;color:#fff;padding:6px 8px;text-align:left;font-size:9px;letter-spacing:.05em;text-transform:uppercase;}td{border-bottom:1px solid #ddd;padding:6px 8px;vertical-align:top;}tr:nth-child(even)td{background:#f9f9f9;}.pr-valid{color:#2a7a4a;font-weight:700;}.pr-soon{color:#b36000;font-weight:700;}.pr-expired{color:#b02020;font-weight:700;}.pr-none{color:#555;}@media print{@page{size:A4 landscape;margin:12mm;}}</style>
    </head><body>
    <h1>Сертифікати та ліцензії ${scopeLabel}</h1>
    <p class="meta">Сформовано: ${now} &nbsp;·&nbsp; Документів: ${list.length}</p>
    <table><thead><tr><th>Документ</th><th>Номер</th><th>Дата видачі</th><th>Дійсний до</th><th>Статус</th><th>Теги</th></tr></thead><tbody>${rows}</tbody></table>
    <script>window.onload=function(){window.print();}<\/script></body></html>`;
    const w=window.open("","_blank","width=1000,height=700");
    if(!w){ showToast("Браузер заблокував вікно. Дозвольте спливаючі вікна.","error"); return; }
    w.document.write(html); w.document.close();
  }

  /* ===================== Settings ===================== */
  settingsBtn.addEventListener("click",async()=>{ warnDaysInput.value=state.settings.warnDays; updatePINUI(!!(await getPINHash())); showModal(settingsModal); });
  saveSettingsBtn.addEventListener("click",async()=>{
    const v=parseInt(warnDaysInput.value,10);
    if(isNaN(v)||v<1){ showToast("Вкажіть число днів більше нуля","error"); return; }
    await dbPut("settings",{key:"warnDays",value:v}); state.settings.warnDays=v; closeModal(settingsModal); renderAll(); showToast("Налаштування збережено","success");
  });
  let clearArmed=false;
  clearAllBtn.addEventListener("click",async()=>{
    if(!clearArmed){ clearArmed=true; clearAllBtn.textContent="Підтвердити очищення?"; clearAllBtn.classList.add("armed"); setTimeout(()=>{clearArmed=false;clearAllBtn.textContent="Очистити всі дані";clearAllBtn.classList.remove("armed");},4000); return; }
    await dbClear("documents"); await dbClear("settings"); await dbPut("settings",{key:"seeded_v1",value:true}); state.settings.warnDays=30;
    await loadDocs(); closeModal(settingsModal); renderAll(); clearArmed=false; showToast("Усі дані видалено","success");
  });

  /* ===================== Backup ===================== */
  backupBtn.addEventListener("click",()=>showModal(backupModal));
  exportBtn.addEventListener("click",async()=>{
    try{
      const docs=await dbGetAll("documents"), settings=await dbGetAll("settings"), serial=[];
      for(const d of docs){
        const copy=Object.assign({},d), files=[];
        for(const f of (d.files||[])){ files.push({name:f.name,type:f.type,dataUrl:await blobToDataURL(f.blob),thumbDataUrl:f.thumb?await blobToDataURL(f.thumb):null}); }
        copy.files=files; serial.push(copy);
      }
      const payload={app:"doc-vault",version:2,exportedAt:new Date().toISOString(),settings,docs:serial};
      const jsonStr=JSON.stringify(payload), stamp=new Date().toISOString().slice(0,10), filename=`dokumenty-rezervna-kopiya-${stamp}.json`;
      if(window.showSaveFilePicker){
        try{ const h=await window.showSaveFilePicker({suggestedName:filename,types:[{description:"JSON",accept:{"application/json":[".json"]}}]}); const w=await h.createWritable(); await w.write(jsonStr); await w.close(); showToast("Резервну копію збережено","success"); return; }
        catch(e){ if(e&&e.name==="AbortError") return; }
      }
      const blob=new Blob([jsonStr],{type:"application/json"}), url=URL.createObjectURL(blob), a=document.createElement("a");
      a.href=url; a.download=filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(()=>URL.revokeObjectURL(url),5000);
      showToast("Резервну копію завантажено у «Завантаження»","success");
    }catch(e){ console.error(e); showToast("Не вдалося створити резервну копію","error"); }
  });
  importBtn.addEventListener("click",()=>importFileInput.click());
  importFileInput.addEventListener("change",async()=>{
    const file=importFileInput.files[0]; if(!file) return;
    try{
      const payload=JSON.parse(await file.text());
      if(!payload||!Array.isArray(payload.docs)) throw new Error("bad format");
      let count=0;
      for(const d of payload.docs){
        const newDoc=Object.assign({},d); delete newDoc.id;
        const raw=Array.isArray(d.files)?d.files:d.fileBase64?[{name:d.fileName,type:d.fileType,dataUrl:d.fileBase64,thumbDataUrl:null}]:[];
        const files=[];
        for(const f of raw){ const blob=f.dataUrl?await dataURLToBlob(f.dataUrl):null; const thumb=f.thumbDataUrl?await dataURLToBlob(f.thumbDataUrl):null; if(blob) files.push({name:f.name,type:f.type,blob,thumb}); }
        newDoc.files=files; newDoc.archived=!!d.archived;
        delete newDoc.fileBase64; delete newDoc.fileName; delete newDoc.fileType; delete newDoc.fileData;
        await dbPut("documents",newDoc); count++;
      }
      await loadDocs(); renderAll(); showToast(`Імпортовано документів: ${count}`,"success"); closeModal(backupModal);
    }catch(e){ console.error(e); showToast("Не вдалося прочитати файл резервної копії","error"); }
    finally{ importFileInput.value=""; }
  });

  /* ===================== Init ===================== */
  async function init(){
    try{
      await loadSettings();
      await initPIN();
      await maybeSeed();
      await loadDocs();
      renderAll();
      window.PdfThumb&&window.PdfThumb.init().catch(()=>{});
    }catch(e){ console.error(e); showToast("Помилка завантаження. Перевірте підтримку IndexedDB браузером.","error"); }
  }
  document.addEventListener("DOMContentLoaded",init);
})();

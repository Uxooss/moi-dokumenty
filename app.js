/* ================================================================
   Document Archive — app.js
   IIFE wrapping all application logic
   ================================================================ */
(function () {
  "use strict";

  /* ===================== 1. i18n System ===================== */
  const TRANSLATIONS = {
    uk: {
      appTitle: 'Архів документів',
      appSubtitle: 'сертифікати · ліцензії · посвідчення',
      searchPlaceholder: 'Пошук за назвою, номером або датою…',
      addBtn: '+ Додати документ',
      backupBtn: 'Резервна копія',
      scopeActive: 'Активні',
      scopeArchive: 'Архів',
      filterStatus: 'Статус',
      filterTags: 'Теги',
      filterSort: 'Сортування',
      sortExpiry: 'Найближчий строк спершу',
      sortName: 'За назвою (А–Я)',
      sortAdded: 'Спершу нещодавно додані',
      resetFilters: 'Скинути фільтри',
      newDoc: 'Новий документ',
      editDoc: 'Документ',
      labelNameUa: 'Назва українською',
      labelNameEn: 'Назва англійською',
      labelNumber: 'Номер документа',
      labelTags: 'Теги / категорія',
      tagsHint: '(Enter або кома, щоб додати)',
      labelIssueDate: 'Дата видачі',
      labelExpiryDate: 'Дійсний до',
      labelNoExpiry: 'Безстроковий документ (без строку дії)',
      labelNotes: 'Нотатки',
      labelFiles: 'Файли документа',
      filesHint: '(PDF, JPG або PNG, до 25 МБ кожен)',
      optional: '(необов\'язково)',
      chooseFiles: 'Вибрати файл(и)',
      dragHint: 'або перетягніть сюди',
      saveBtn: 'Зберегти',
      cancelBtn: 'Скасувати',
      deleteBtn: 'Видалити документ',
      archiveBtn: 'Архівувати',
      unarchiveBtn: 'Повернути з архіву',
      confirmDeleteTitle: 'Видалити документ?',
      confirmDeleteMsg: 'Цю дію неможливо відмінити. Документ та всі прикріплені файли будуть видалені назавжди.',
      confirmClearTitle: 'Очистити всі дані?',
      confirmClearMsg: 'Всі документи та налаштування будуть видалені безповоротно.',
      settingsTitle: 'Налаштування',
      labelWarnDays: 'Попереджати за (днів до закінчення строку)',
      warnDaysNote: 'Документи, до закінчення яких залишилось менше вказаної кількості днів, позначаються жовтим.',
      autoLockTitle: 'Автоблокування',
      labelAutoLock: 'Блокувати після бездіяльності',
      autoLockOff: 'Вимкнено',
      pinSectionTitle: 'Захист PIN-кодом',
      pinNotSet: 'PIN-код не встановлено',
      pinIsSet: 'PIN-код встановлено ✓',
      setPin: 'Встановити PIN',
      changePin: 'Змінити PIN',
      removePin: 'Видалити PIN',
      pinEnter: 'Введіть PIN-код',
      pinAccess: 'для доступу до архіву',
      encryptionTitle: 'Шифрування даних',
      encryptionNote: 'Шифрує документи за допомогою PIN-коду (AES-GCM). Потребує встановленого PIN.',
      enableEncryption: 'Увімкнути шифрування',
      dangerZoneTitle: 'Небезпечна зона',
      dangerNote: 'Видалити всі документи та налаштування безповоротно.',
      clearAll: 'Очистити всі дані',
      backupTitle: 'Резервна копія',
      backupNote: 'Усі документи зберігаються лише в браузері на цьому пристрої.',
      backupSaveTitle: 'Зберегти копію',
      backupSaveDesc: 'Відкриє вікно вибору місця або завантажить у «Завантаження»',
      backupSaveBtn: 'Зберегти як…',
      backupRestoreTitle: 'Відновити з файлу',
      backupRestoreDesc: 'Додає документи з раніше збереженої копії',
      backupRestoreBtn: 'Обрати файл',
      pinSetupTitle: 'Встановити PIN-код',
      pinSetupNote: '4-значний числовий PIN-код.',
      confirmPinLabel: 'Підтвердити PIN-код',
      pinMismatch: 'PIN-коди не збігаються або занадто короткий',
      savePin: 'Зберегти PIN',
      shortcutsTitle: 'Гарячі клавіші',
      scNewDoc: 'Новий документ',
      scSearch: 'Фокус на пошук',
      scClose: 'Закрити вікно',
      scViews: 'Режим перегляду',
      scDash: 'Статистика',
      scHelp: 'Ця довідка',
      undoBtn: 'Відмінити',
      emptyText: 'Тут поки порожньо.',
      addFirstDoc: 'Додати перший документ',
      emptyArchive: 'В архіві поки нічого немає.',
      emptySearch: 'Нічого не знайдено.',
      dashTotal: 'Всього',
      dashValid: 'Дійсні',
      dashSoon: 'Спливають',
      dashExpired: 'Прострочені',
      dashNone: 'Безстрокові',
      dashTimeline: 'Найближчі терміни (90 днів)',
      skipToContent: 'Перейти до вмісту',
      statusAll: 'Усі',
      statusValid: 'Дійсні',
      statusSoon: 'Спливають',
      statusExpired: 'Прострочені',
      statusNone: 'Безстрокові',
      stampValid: 'ДІЙСНИЙ',
      stampExpired: 'ПРО-СТРО-ЧЕНО',
      stampToday: 'СЬОГО-ДНІ',
      stamp1Day: '1 ДЕНЬ',
      stampDays: 'ДН.',
      stampInfinity: '∞',
      coverLabel: 'обкладинка',
      toastSaved: 'Зміни збережено',
      toastAdded: 'Документ додано',
      toastDeleted: 'Документ видалено',
      toastArchived: 'Документ переміщено в архів',
      toastUnarchived: 'Документ повернуто з архіву',
      toastSettingsSaved: 'Налаштування збережено',
      toastPinSet: 'PIN-код встановлено',
      toastPinRemoved: 'PIN-код видалено',
      toastCleared: 'Усі дані видалено',
      toastBackupSaved: 'Резервну копію збережено',
      toastBackupDownloaded: 'Резервну копію завантажено',
      toastImported: 'Імпортовано документів',
      toastCalendarSaved: 'Календар збережено',
      toastCalendarDownloaded: 'Файл .ics завантажено',
      errNameRequired: 'Вкажіть назву документа українською',
      errExpiryRequired: 'Вкажіть дату закінчення або позначте «Безстроковий»',
      errYearRange: 'Рік має бути між 1980 та 2099',
      errExpiryBeforeIssue: 'Дата закінчення раніше дати видачі',
      errIssueFuture: 'Дата видачі не може бути в майбутньому',
      errWarnDays: 'Вкажіть число днів більше нуля',
      errBadBackup: 'Не вдалося прочитати файл резервної копії',
      errBackupFailed: 'Не вдалося створити резервну копію',
      errPopupBlocked: 'Браузер заблокував вікно. Дозвольте спливаючі вікна.',
      errLoadFailed: 'Помилка завантаження. Перевірте підтримку IndexedDB.',
      warnDuplicate: 'Документ із такою назвою вже є. Натисніть «Зберегти» ще раз.',
      warnNoCalendarDocs: 'Немає документів з обмеженим строком дії',
      warnNoReportDocs: 'Немає документів для звіту',
      fileSkippedType: 'пропущено: підтримуються PDF, JPG, PNG',
      fileSkippedSize: 'завеликий (макс. 25 МБ)',
      noFilesYet: 'Файлів ще не додано',
      noTagsYet: 'Тегів ще немає',
      confirmRemovePinTitle: 'Видалити PIN?',
      confirmRemovePinMsg: 'Введіть поточний PIN для видалення.',
      attentionNeeded: 'потребує уваги',
      docNeedAttention: 'документ потребує',
      docsNeedAttention: 'документи потребують',
      docsNeedAttention5: 'документів потребують',
      expired1: 'прострочений',
      expired24: 'прострочені',
      expired5: 'прострочених',
      expiringSoon: 'спливає найближчим часом',
      expiringSoonP: 'спливають найближчим часом',
      fromArchive: '↺ з архіву',
      toArchive: '🗄 архів',
      file1: 'файл', file24: 'файли', file5: 'файлів',
      doc1: 'документ', doc24: 'документи', doc5: 'документів',
      notifTitle: 'Архів документів — увага!',
      notifBody: 'документів потребують вашої уваги',
      reportTitle: 'Сертифікати та ліцензії',
      reportActive: '(Активні)',
      reportArchive: '(Архів)',
      reportGenerated: 'Сформовано',
      reportDocs: 'Документів',
      reportColName: 'Документ',
      reportColNumber: 'Номер',
      reportColIssued: 'Дата видачі',
      reportColExpiry: 'Дійсний до',
      reportColStatus: 'Статус',
      reportColTags: 'Теги',
      until: 'до',
      indefinitely: 'безстроково',
      daysAgo: 'дн. тому',
      daysLeft: 'дн.',
      today: 'сьогодні',
      tomorrow: 'завтра',
      phNameUa: 'напр. Посвідчення водія',
      phNumber: 'напр. AB 123456',
      phTag: 'додати тег…',
      phNotes: 'будь-які примітки до документа',
    },
    en: {
      appTitle: 'Document Archive',
      appSubtitle: 'certificates · licenses · credentials',
      searchPlaceholder: 'Search by name, number or date…',
      addBtn: '+ Add Document',
      backupBtn: 'Backup',
      scopeActive: 'Active',
      scopeArchive: 'Archive',
      filterStatus: 'Status',
      filterTags: 'Tags',
      filterSort: 'Sort',
      sortExpiry: 'Nearest expiry first',
      sortName: 'By name (A–Z)',
      sortAdded: 'Recently added first',
      resetFilters: 'Reset filters',
      newDoc: 'New Document',
      editDoc: 'Document',
      labelNameUa: 'Name (Ukrainian)',
      labelNameEn: 'Name (English)',
      labelNumber: 'Document number',
      labelTags: 'Tags / category',
      tagsHint: '(Enter or comma to add)',
      labelIssueDate: 'Issue date',
      labelExpiryDate: 'Valid until',
      labelNoExpiry: 'Permanent document (no expiry)',
      labelNotes: 'Notes',
      labelFiles: 'Document files',
      filesHint: '(PDF, JPG or PNG, up to 25 MB each)',
      optional: '(optional)',
      chooseFiles: 'Choose file(s)',
      dragHint: 'or drag & drop here',
      saveBtn: 'Save',
      cancelBtn: 'Cancel',
      deleteBtn: 'Delete document',
      archiveBtn: 'Archive',
      unarchiveBtn: 'Restore from archive',
      confirmDeleteTitle: 'Delete document?',
      confirmDeleteMsg: 'This action cannot be undone. The document and all attached files will be permanently deleted.',
      confirmClearTitle: 'Clear all data?',
      confirmClearMsg: 'All documents and settings will be permanently deleted.',
      settingsTitle: 'Settings',
      labelWarnDays: 'Warn before (days until expiry)',
      warnDaysNote: 'Documents expiring within this number of days are highlighted in yellow.',
      autoLockTitle: 'Auto-lock',
      labelAutoLock: 'Lock after inactivity',
      autoLockOff: 'Disabled',
      pinSectionTitle: 'PIN Protection',
      pinNotSet: 'PIN is not set',
      pinIsSet: 'PIN is set ✓',
      setPin: 'Set PIN',
      changePin: 'Change PIN',
      removePin: 'Remove PIN',
      pinEnter: 'Enter PIN',
      pinAccess: 'to access the archive',
      encryptionTitle: 'Data Encryption',
      encryptionNote: 'Encrypts documents using PIN code (AES-GCM). Requires a PIN.',
      enableEncryption: 'Enable encryption',
      dangerZoneTitle: 'Danger Zone',
      dangerNote: 'Permanently delete all documents and settings.',
      clearAll: 'Clear all data',
      backupTitle: 'Backup',
      backupNote: 'All documents are stored only in this browser. Save backups to external storage.',
      backupSaveTitle: 'Save backup',
      backupSaveDesc: 'Opens a save dialog or downloads to Downloads folder',
      backupSaveBtn: 'Save as…',
      backupRestoreTitle: 'Restore from file',
      backupRestoreDesc: 'Adds documents from a previously saved backup',
      backupRestoreBtn: 'Choose file',
      pinSetupTitle: 'Set PIN Code',
      pinSetupNote: '4-digit numeric PIN code.',
      confirmPinLabel: 'Confirm PIN',
      pinMismatch: 'PINs do not match or too short',
      savePin: 'Save PIN',
      shortcutsTitle: 'Keyboard Shortcuts',
      scNewDoc: 'New document',
      scSearch: 'Focus search',
      scClose: 'Close window',
      scViews: 'View mode',
      scDash: 'Statistics',
      scHelp: 'This help',
      undoBtn: 'Undo',
      emptyText: 'Nothing here yet.',
      addFirstDoc: 'Add first document',
      emptyArchive: 'Archive is empty.',
      emptySearch: 'Nothing found.',
      dashTotal: 'Total',
      dashValid: 'Valid',
      dashSoon: 'Expiring',
      dashExpired: 'Expired',
      dashNone: 'Permanent',
      dashTimeline: 'Upcoming deadlines (90 days)',
      skipToContent: 'Skip to content',
      statusAll: 'All',
      statusValid: 'Valid',
      statusSoon: 'Expiring',
      statusExpired: 'Expired',
      statusNone: 'Permanent',
      stampValid: 'VALID',
      stampExpired: 'EX-PI-RED',
      stampToday: 'TO-DAY',
      stamp1Day: '1 DAY',
      stampDays: 'D.',
      stampInfinity: '∞',
      coverLabel: 'cover',
      toastSaved: 'Changes saved',
      toastAdded: 'Document added',
      toastDeleted: 'Document deleted',
      toastArchived: 'Document moved to archive',
      toastUnarchived: 'Document restored from archive',
      toastSettingsSaved: 'Settings saved',
      toastPinSet: 'PIN set',
      toastPinRemoved: 'PIN removed',
      toastCleared: 'All data deleted',
      toastBackupSaved: 'Backup saved',
      toastBackupDownloaded: 'Backup downloaded',
      toastImported: 'Documents imported',
      toastCalendarSaved: 'Calendar saved',
      toastCalendarDownloaded: '.ics file downloaded',
      errNameRequired: 'Please enter document name in Ukrainian',
      errExpiryRequired: 'Please set expiry date or mark as permanent',
      errYearRange: 'Year must be between 1980 and 2099',
      errExpiryBeforeIssue: 'Expiry date is before issue date',
      errIssueFuture: 'Issue date cannot be in the future',
      errWarnDays: 'Enter a number of days greater than zero',
      errBadBackup: 'Could not read backup file',
      errBackupFailed: 'Could not create backup',
      errPopupBlocked: 'Browser blocked popup. Allow popups for this site.',
      errLoadFailed: 'Loading error. Check IndexedDB support.',
      warnDuplicate: 'A document with this name already exists. Press Save again to confirm.',
      warnNoCalendarDocs: 'No documents with limited validity',
      warnNoReportDocs: 'No documents for report',
      fileSkippedType: 'skipped: supported formats are PDF, JPG, PNG',
      fileSkippedSize: 'too large (max 25 MB)',
      noFilesYet: 'No files added yet',
      noTagsYet: 'No tags yet',
      confirmRemovePinTitle: 'Remove PIN?',
      confirmRemovePinMsg: 'Enter current PIN to remove.',
      attentionNeeded: 'need attention',
      docNeedAttention: 'document needs',
      docsNeedAttention: 'documents need',
      docsNeedAttention5: 'documents need',
      expired1: 'expired',
      expired24: 'expired',
      expired5: 'expired',
      expiringSoon: 'expiring soon',
      expiringSoonP: 'expiring soon',
      fromArchive: '↺ restore',
      toArchive: '🗄 archive',
      file1: 'file', file24: 'files', file5: 'files',
      doc1: 'document', doc24: 'documents', doc5: 'documents',
      notifTitle: 'Document Archive — attention!',
      notifBody: 'documents need your attention',
      reportTitle: 'Certificates and Licenses',
      reportActive: '(Active)',
      reportArchive: '(Archive)',
      reportGenerated: 'Generated',
      reportDocs: 'Documents',
      reportColName: 'Document',
      reportColNumber: 'Number',
      reportColIssued: 'Issue Date',
      reportColExpiry: 'Valid Until',
      reportColStatus: 'Status',
      reportColTags: 'Tags',
      until: 'until',
      indefinitely: 'permanent',
      daysAgo: 'd. ago',
      daysLeft: 'd.',
      today: 'today',
      tomorrow: 'tomorrow',
      phNameUa: 'e.g. Driving Licence',
      phNumber: 'e.g. AB 123456',
      phTag: 'add tag…',
      phNotes: 'any notes about the document',
    }
  };

  let currentLang = localStorage.getItem('lang') || 'uk';

  function t(key) {
    return TRANSLATIONS[currentLang][key] || TRANSLATIONS.uk[key] || key;
  }

  function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      el.textContent = t(key);
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      el.placeholder = t(el.getAttribute('data-i18n-placeholder'));
    });
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      el.title = t(el.getAttribute('data-i18n-title'));
    });
  }

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem('lang', lang);
    document.documentElement.setAttribute('data-lang', lang);
    const label = langToggleBtn.querySelector('.lang-label');
    if (label) label.textContent = lang === 'uk' ? 'UA' : 'EN';
    applyI18n();
    renderAll();
  }

  /* ===================== 2. Theme System ===================== */
  function getTheme() {
    return localStorage.getItem('theme') || (matchMedia('(prefers-color-scheme:light)').matches ? 'light' : 'dark');
  }

  function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    const meta = document.getElementById('metaThemeColor');
    if (meta) meta.content = theme === 'dark' ? '#0F1117' : '#ffffff';
  }

  function toggleTheme() {
    setTheme(getTheme() === 'dark' ? 'light' : 'dark');
  }

  // Apply theme immediately (before DOMContentLoaded)
  setTheme(getTheme());

  /* ===================== 3. IndexedDB + Encryption ===================== */
  const DB_NAME = "DocVaultDB", DB_VERSION = 1;
  let dbPromise = null;

  function openDB() {
    if (dbPromise) return dbPromise;
    dbPromise = new Promise((res, rej) => {
      const r = indexedDB.open(DB_NAME, DB_VERSION);
      r.onupgradeneeded = e => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains("documents")) db.createObjectStore("documents", { keyPath: "id", autoIncrement: true });
        if (!db.objectStoreNames.contains("settings")) db.createObjectStore("settings", { keyPath: "key" });
      };
      r.onsuccess = e => res(e.target.result);
      r.onerror = e => rej(e.target.error);
    });
    return dbPromise;
  }

  async function getStore(n, m) { const db = await openDB(); return db.transaction(n, m || "readonly").objectStore(n); }
  async function dbGetAll(n) { const s = await getStore(n); return new Promise((res, rej) => { const r = s.getAll(); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
  async function dbPut(n, v) { const s = await getStore(n, "readwrite"); return new Promise((res, rej) => { const r = s.put(v); r.onsuccess = () => res(r.result); r.onerror = () => rej(r.error); }); }
  async function dbDelete(n, k) { const s = await getStore(n, "readwrite"); return new Promise((res, rej) => { const r = s.delete(k); r.onsuccess = () => res(); r.onerror = () => rej(r.error); }); }
  async function dbClear(n) { const s = await getStore(n, "readwrite"); return new Promise((res, rej) => { const r = s.clear(); r.onsuccess = () => res(); r.onerror = () => rej(r.error); }); }

  /* AES-GCM Encryption */
  async function deriveKey(pin) {
    const enc = new TextEncoder().encode(pin);
    const keyMaterial = await crypto.subtle.importKey('raw', enc, 'PBKDF2', false, ['deriveKey']);
    const salt = new TextEncoder().encode('DocVaultSalt2024');
    return crypto.subtle.deriveKey(
      { name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' },
      keyMaterial, { name: 'AES-GCM', length: 256 }, false, ['encrypt', 'decrypt']
    );
  }

  async function encryptData(data, key) {
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const ct = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    return { iv: Array.from(iv), ct: Array.from(new Uint8Array(ct)) };
  }

  async function decryptData(encrypted, key) {
    const iv = new Uint8Array(encrypted.iv);
    const ct = new Uint8Array(encrypted.ct);
    const dec = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, ct);
    return JSON.parse(new TextDecoder().decode(dec));
  }

  /* ===================== 4. State Management ===================== */
  const state = {
    docs: [],
    settings: { warnDays: 30, autoLockMinutes: 0, encryptionEnabled: false },
    viewMode: 'tile',
    filters: { scope: 'active', status: 'all', tags: new Set(), search: '' },
    sort: 'expiry-asc',
    editingId: null,
    formFiles: [],
    confirmDuplicate: false,
    dashboardVisible: false,
    previewDoc: null,
    previewFileIndex: 0,
    selectedIds: new Set(),
    undoStack: [],
  };
  let formTags = [];
  const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

  /* Blob URL memory management (Bug fix #8) */
  const activeBlobURLs = new Map();

  function blobURL(blob) {
    if (!blob) return null;
    if (activeBlobURLs.has(blob)) return activeBlobURLs.get(blob);
    const u = URL.createObjectURL(blob);
    activeBlobURLs.set(blob, u);
    return u;
  }

  function revokeAllBlobURLs() {
    activeBlobURLs.forEach(url => URL.revokeObjectURL(url));
    activeBlobURLs.clear();
  }

  /* ===================== 5. DOM References ===================== */
  const $ = id => document.getElementById(id);

  /* These will be populated after DOMContentLoaded; declared here for hoisting */
  let searchInput, statusFiltersEl, statusFilterGroup, tagFiltersEl, sortSelect, resetFiltersBtn,
    cardsGrid, resultsCount, emptyState, emptyAddBtn, alertBanner, addBtn,
    settingsBtn, backupBtn, reportBtn, calendarBtn, lockBtn, toastContainer,
    scopeActiveBtn, scopeArchiveBtn, scopeActiveCount, scopeArchiveCount,
    editModal, docForm, modalTitle, nameUaInput, nameEnInput, numberInput,
    tagsInput, tagsChips, tagSuggestions, issueDateInput, expiryDateInput,
    noExpiryCheckbox, notesInput, fileInput, attachList, deleteDocBtn,
    archiveActionBtn, issueDateError, expiryDateError, dropZone,
    settingsModal, warnDaysInput, saveSettingsBtn, clearAllBtn,
    pinStatusNote, setPinBtn, removePinBtn,
    backupModal, exportBtn, importBtn, importFileInput,
    pinOverlay, pinTitle, pinSubtitle, pinDots, pinError, pinSkipBtn,
    pinSetupModal, pinInput1, pinInput2, confirmPinBtn, pinSetupError,
    themeToggleBtn, langToggleBtn, dashboardToggleBtn, dashboardSection,
    dashTotal, dashValidCount, dashSoonCount, dashExpiredCount, dashNoneCount, dashTimeline,
    previewModal, previewTitle, previewCounter, previewContent,
    previewPrevBtn, previewNextBtn, previewDownloadBtn, previewEditBtn, previewCloseBtn,
    previewDocMeta, confirmDialog, confirmTitle, confirmMessage,
    confirmOkBtn, confirmCancelBtn, confirmIcon,
    shortcutsModal, autoLockSelect, encryptionToggle,
    fabAddBtn, undoToast, undoMessage, undoBtn, sidebar;

  function cacheDOMRefs() {
    searchInput = $("searchInput"); statusFiltersEl = $("statusFilters");
    statusFilterGroup = $("statusFilterGroup"); tagFiltersEl = $("tagFilters");
    sortSelect = $("sortSelect"); resetFiltersBtn = $("resetFiltersBtn");
    cardsGrid = $("cardsGrid"); resultsCount = $("resultsCount");
    emptyState = $("emptyState"); emptyAddBtn = $("emptyAddBtn");
    alertBanner = $("alertBanner"); addBtn = $("addBtn");
    settingsBtn = $("settingsBtn"); backupBtn = $("backupBtn");
    reportBtn = $("reportBtn"); calendarBtn = $("calendarBtn");
    lockBtn = $("lockBtn"); toastContainer = $("toastContainer");
    scopeActiveBtn = $("scopeActiveBtn"); scopeArchiveBtn = $("scopeArchiveBtn");
    scopeActiveCount = $("scopeActiveCount"); scopeArchiveCount = $("scopeArchiveCount");
    editModal = $("editModal"); docForm = $("docForm"); modalTitle = $("modalTitle");
    nameUaInput = $("nameUaInput"); nameEnInput = $("nameEnInput"); numberInput = $("numberInput");
    tagsInput = $("tagsInput"); tagsChips = $("tagsChips"); tagSuggestions = $("tagSuggestions");
    issueDateInput = $("issueDateInput"); expiryDateInput = $("expiryDateInput");
    noExpiryCheckbox = $("noExpiryCheckbox"); notesInput = $("notesInput");
    fileInput = $("fileInput"); attachList = $("attachList");
    deleteDocBtn = $("deleteDocBtn"); archiveActionBtn = $("archiveActionBtn");
    issueDateError = $("issueDateError"); expiryDateError = $("expiryDateError");
    dropZone = $("dropZone");
    settingsModal = $("settingsModal"); warnDaysInput = $("warnDaysInput");
    saveSettingsBtn = $("saveSettingsBtn"); clearAllBtn = $("clearAllBtn");
    pinStatusNote = $("pinStatusNote"); setPinBtn = $("setPinBtn"); removePinBtn = $("removePinBtn");
    backupModal = $("backupModal"); exportBtn = $("exportBtn");
    importBtn = $("importBtn"); importFileInput = $("importFileInput");
    pinOverlay = $("pinOverlay"); pinTitle = $("pinTitle"); pinSubtitle = $("pinSubtitle");
    pinDots = $("pinDots"); pinError = $("pinError"); pinSkipBtn = $("pinSkipBtn");
    pinSetupModal = $("pinSetupModal"); pinInput1 = $("pinInput1"); pinInput2 = $("pinInput2");
    confirmPinBtn = $("confirmPinBtn"); pinSetupError = $("pinSetupError");
    themeToggleBtn = $("themeToggleBtn"); langToggleBtn = $("langToggleBtn");
    dashboardToggleBtn = $("dashboardToggleBtn"); dashboardSection = $("dashboardSection");
    dashTotal = $("dashTotal"); dashValidCount = $("dashValidCount");
    dashSoonCount = $("dashSoonCount"); dashExpiredCount = $("dashExpiredCount");
    dashNoneCount = $("dashNoneCount"); dashTimeline = $("dashTimeline");
    previewModal = $("previewModal"); previewTitle = $("previewTitle");
    previewCounter = $("previewCounter"); previewContent = $("previewContent");
    previewPrevBtn = $("previewPrevBtn"); previewNextBtn = $("previewNextBtn");
    previewDownloadBtn = $("previewDownloadBtn"); previewEditBtn = $("previewEditBtn");
    previewCloseBtn = $("previewCloseBtn"); previewDocMeta = $("previewDocMeta");
    confirmDialog = $("confirmDialog"); confirmTitle = $("confirmTitle");
    confirmMessage = $("confirmMessage"); confirmOkBtn = $("confirmOkBtn");
    confirmCancelBtn = $("confirmCancelBtn"); confirmIcon = $("confirmIcon");
    shortcutsModal = $("shortcutsModal"); autoLockSelect = $("autoLockSelect");
    encryptionToggle = $("encryptionToggle");
    fabAddBtn = $("fabAddBtn"); undoToast = $("undoToast");
    undoMessage = $("undoMessage"); undoBtn = $("undoBtn"); sidebar = $("sidebar");
  }

  /* ===================== 6. Utilities ===================== */
  function esc(s) {
    if (!s) return "";
    return String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  }

  function fmtDate(iso) {
    if (!iso) return "";
    const p = iso.split("-");
    return p.length === 3 ? `${p[2]}.${p[1]}.${p[0]}` : iso;
  }

  function daysBetween(s) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.round((new Date(s + "T00:00:00") - today) / 86400000);
  }

  function pluralUk(n, f) {
    if (currentLang === 'en') return n === 1 ? f[0] : f[1];
    const a = n % 10, b = n % 100;
    if (a === 1 && b !== 11) return f[0];
    if (a >= 2 && a <= 4 && (b < 12 || b > 14)) return f[1];
    return f[2];
  }

  function getDocStatus(doc) {
    if (doc.noExpiry || !doc.expiryDate) return { key: "none", daysLeft: null };
    const d = daysBetween(doc.expiryDate);
    if (d < 0) return { key: "expired", daysLeft: d };
    if (d <= state.settings.warnDays) return { key: "soon", daysLeft: d };
    return { key: "valid", daysLeft: d };
  }

  function stampText(doc) {
    const s = getDocStatus(doc);
    if (s.key === "none") return t('stampInfinity');
    if (s.key === "expired") return t('stampExpired');
    if (s.key === "soon") {
      if (s.daysLeft === 0) return t('stampToday');
      if (s.daysLeft === 1) return t('stamp1Day');
      return `${s.daysLeft} ${t('stampDays')}`;
    }
    return t('stampValid');
  }

  function getPreviewInfo(doc, large) {
    const c = doc.files && doc.files[0];
    if (!c) return { kind: "none" };
    if (c.thumb) return { kind: "img", url: blobURL(c.thumb) };
    if (c.type && c.type.startsWith("image/")) return { kind: "img", url: blobURL(c.blob) };
    if (c.type === "application/pdf") return large ? { kind: "pdf-live", url: blobURL(c.blob) } : { kind: "pdf-icon" };
    return { kind: "none" };
  }

  /* ===================== 7. Toast, Modal, Focus Trap, Confirm Dialog ===================== */
  function showToast(msg, type) {
    /* If msg is a translation key, use t(); otherwise use raw string */
    const text = TRANSLATIONS[currentLang][msg] ? t(msg) : msg;
    const el = document.createElement("div");
    el.className = "toast toast-" + (type || "info");
    el.textContent = text;
    toastContainer.appendChild(el);
    requestAnimationFrame(() => el.classList.add("show"));
    setTimeout(() => { el.classList.remove("show"); setTimeout(() => el.remove(), 300); }, 3800);
  }

  let lastFocusedElement = null;

  function showModal(m) {
    lastFocusedElement = document.activeElement;
    m.classList.remove("hidden");
    document.body.style.overflow = "hidden";
    focusTrap(m);
  }

  function closeModal(m) {
    m.classList.add("hidden");
    document.body.style.overflow = "";
    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      lastFocusedElement.focus();
    }
  }

  function focusTrap(modal) {
    const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    function handleTrap(e) {
      if (e.key !== 'Tab') return;
      if (modal.classList.contains('hidden')) {
        modal.removeEventListener('keydown', handleTrap);
        return;
      }
      if (e.shiftKey) {
        if (document.activeElement === first) { e.preventDefault(); last.focus(); }
      } else {
        if (document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    }
    modal.addEventListener('keydown', handleTrap);
    first.focus();
  }

  function showConfirm(title, message, okText, isDanger) {
    return new Promise(resolve => {
      confirmTitle.textContent = title;
      confirmMessage.textContent = message;
      confirmOkBtn.textContent = okText || t('saveBtn');
      confirmOkBtn.className = isDanger ? 'delete-btn' : 'btn-primary';
      showModal(confirmDialog);
      const onOk = () => { cleanup(); resolve(true); };
      const onCancel = () => { cleanup(); resolve(false); };
      function cleanup() {
        confirmOkBtn.removeEventListener('click', onOk);
        confirmCancelBtn.removeEventListener('click', onCancel);
        closeModal(confirmDialog);
      }
      confirmOkBtn.addEventListener('click', onOk);
      confirmCancelBtn.addEventListener('click', onCancel);
    });
  }

  /* base64 ↔ Blob helpers */
  function blobToDataURL(b) {
    return new Promise((res, rej) => {
      const r = new FileReader();
      r.onloadend = () => res(r.result);
      r.onerror = rej;
      r.readAsDataURL(b);
    });
  }

  async function dataURLToBlob(u) { return (await fetch(u)).blob(); }

  /* ===================== 8. PIN System (improved) ===================== */
  let pinBuffer = "";
  const PIN_MAX_ATTEMPTS = 5;

  /* Bug fix #4: store pinAttempts and pinLockUntil in sessionStorage */
  function getPinAttempts() { return parseInt(sessionStorage.getItem('pinAttempts') || '0', 10); }
  function setPinAttempts(n) { sessionStorage.setItem('pinAttempts', String(n)); }
  function getPinLockUntil() { return parseInt(sessionStorage.getItem('pinLockUntil') || '0', 10); }
  function setPinLockUntil(t) { sessionStorage.setItem('pinLockUntil', String(t)); }

  async function sha256(text) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
    return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, "0")).join("");
  }

  async function getPINHash() {
    const rows = await dbGetAll("settings");
    const r = rows.find(x => x.key === "pinHash");
    return r ? r.value : null;
  }

  function updatePinDots() {
    pinDots.querySelectorAll(".pd").forEach((d, i) => {
      d.classList.toggle("filled", i < pinBuffer.length);
      d.classList.remove("error");
    });
  }

  function shakePinDots() {
    pinDots.querySelectorAll(".pd").forEach(d => d.classList.add("error"));
    pinError.classList.remove("hidden");
    setTimeout(() => pinDots.querySelectorAll(".pd").forEach(d => d.classList.remove("error")), 600);
  }

  async function tryUnlock() {
    const lockUntil = getPinLockUntil();
    if (Date.now() < lockUntil) {
      const s = Math.ceil((lockUntil - Date.now()) / 1000);
      pinError.textContent = `${t('cancelBtn')}… ${s} с.`;
      pinError.classList.remove("hidden");
      pinBuffer = ""; updatePinDots();
      return;
    }
    const hash = await getPINHash();
    if (!hash) { closePINOverlay(); return; }
    if (await sha256(pinBuffer) === hash) {
      setPinAttempts(0); pinBuffer = ""; updatePinDots();
      closePINOverlay();
      resetAutoLock();
    } else {
      let attempts = getPinAttempts() + 1;
      setPinAttempts(attempts);
      if (attempts >= PIN_MAX_ATTEMPTS) {
        setPinLockUntil(Date.now() + 30000);
        setPinAttempts(0);
        pinError.textContent = "Занадто багато спроб. Зачекайте 30 с.";
      } else {
        pinError.textContent = `Неправильний PIN (${PIN_MAX_ATTEMPTS - attempts} залишилось)`;
      }
      shakePinDots(); pinBuffer = ""; updatePinDots();
    }
  }

  function openPINOverlay() {
    pinBuffer = ""; updatePinDots(); pinError.classList.add("hidden");
    pinTitle.textContent = t('pinEnter');
    pinSubtitle.textContent = t('pinAccess');
    pinSkipBtn.classList.add("hidden");
    pinOverlay.classList.remove("hidden");
    document.body.style.overflow = "hidden";
  }

  function closePINOverlay() {
    pinOverlay.classList.add("hidden");
    document.body.style.overflow = "";
  }

  function updatePINUI(hasPin) {
    pinStatusNote.textContent = hasPin ? t('pinIsSet') : t('pinNotSet');
    setPinBtn.textContent = hasPin ? t('changePin') : t('setPin');
    removePinBtn.classList.toggle("hidden", !hasPin);
    lockBtn.classList.toggle("hidden", !hasPin);
  }

  async function initPIN() {
    const h = await getPINHash();
    if (h) openPINOverlay();
    updatePINUI(!!h);
  }

  function bindPINEvents() {
    pinOverlay.addEventListener("click", async e => {
      const k = e.target.getAttribute("data-k");
      if (!k) return;
      if (k === "clear") { if (pinBuffer.length) pinBuffer = pinBuffer.slice(0, -1); updatePinDots(); return; }
      if (k === "ok") { if (pinBuffer.length === 4) await tryUnlock(); return; }
      if (pinBuffer.length < 4) { pinBuffer += k; updatePinDots(); if (pinBuffer.length === 4) await tryUnlock(); }
    });

    document.addEventListener("keydown", async e => {
      if (pinOverlay.classList.contains("hidden")) return;
      if (e.key >= "0" && e.key <= "9" && pinBuffer.length < 4) {
        pinBuffer += e.key; updatePinDots();
        if (pinBuffer.length === 4) await tryUnlock();
      } else if (e.key === "Backspace" && pinBuffer.length) {
        pinBuffer = pinBuffer.slice(0, -1); updatePinDots();
      } else if (e.key === "Enter" && pinBuffer.length === 4) {
        await tryUnlock();
      }
    });

    pinSkipBtn.addEventListener("click", () => closePINOverlay());
    lockBtn.addEventListener("click", () => openPINOverlay());

    setPinBtn.addEventListener("click", () => {
      pinInput1.value = ""; pinInput2.value = "";
      pinSetupError.classList.add("hidden");
      showModal(pinSetupModal);
    });

    /* Bug fix #5: PIN removal requires auth */
    removePinBtn.addEventListener("click", async () => {
      const ok = await showConfirm(t('confirmRemovePinTitle'), t('confirmRemovePinMsg'), t('removePin'), true);
      if (!ok) return;
      /* Verify via PIN overlay */
      const hash = await getPINHash();
      if (hash) {
        await new Promise(resolve => {
          pinBuffer = ""; updatePinDots(); pinError.classList.add("hidden");
          pinTitle.textContent = t('pinEnter');
          pinSubtitle.textContent = t('confirmRemovePinMsg');
          pinSkipBtn.classList.remove("hidden");
          pinOverlay.classList.remove("hidden");
          document.body.style.overflow = "hidden";
          const origTryUnlock = tryUnlock;
          const checkInterval = setInterval(() => {
            if (pinOverlay.classList.contains("hidden")) {
              clearInterval(checkInterval);
              resolve();
            }
          }, 200);
        });
        const h2 = await getPINHash();
        if (!h2) return; /* already removed somehow */
      }
      await dbDelete("settings", "pinHash");
      updatePINUI(false);
      showToast('toastPinRemoved', "success");
    });

    confirmPinBtn.addEventListener("click", async () => {
      const p1 = pinInput1.value.trim(), p2 = pinInput2.value.trim();
      if (p1.length !== 4 || !/^\d{4}$/.test(p1) || p1 !== p2) {
        pinSetupError.classList.remove("hidden");
        return;
      }
      await dbPut("settings", { key: "pinHash", value: await sha256(p1) });
      closeModal(pinSetupModal);
      updatePINUI(true);
      showToast('toastPinSet', "success");
    });
  }

  /* ===================== 9. Data Load ===================== */
  async function loadSettings() {
    const rows = await dbGetAll("settings");
    state.settings.warnDays = (rows.find(r => r.key === "warnDays") || { value: 30 }).value;
    state.settings.autoLockMinutes = (rows.find(r => r.key === "autoLockMinutes") || { value: 0 }).value;
    state.settings.encryptionEnabled = (rows.find(r => r.key === "encryptionEnabled") || { value: false }).value;
    state.viewMode = (rows.find(r => r.key === "viewMode") || { value: "tile" }).value;
  }

  async function loadDocs() { state.docs = await dbGetAll("documents"); }

  async function maybeSeed() {
    const rows = await dbGetAll("settings");
    if (rows.find(r => r.key === "seeded_v1")) return;
    const seed = window.SEED_DOCS;
    if (!seed || !seed.length) { await dbPut("settings", { key: "seeded_v1", value: true }); return; }
    showToast("Завантажуються початкові документи…", "info");
    for (const sd of seed) {
      const files = [];
      for (const f of sd.files) {
        const blob = await dataURLToBlob(`data:${f.type};base64,${f.base64}`);
        const thumb = f.thumbB64 ? await dataURLToBlob(`data:image/jpeg;base64,${f.thumbB64}`) : null;
        files.push({ name: f.name, type: f.type, blob, thumb });
      }
      await dbPut("documents", {
        nameUa: sd.nameUa, nameEn: sd.nameEn, number: sd.number, tags: (sd.tags || []).slice(),
        issueDate: sd.issueDate, expiryDate: sd.expiryDate, noExpiry: sd.noExpiry, notes: sd.notes || "",
        files, archived: false, createdAt: Date.now(), updatedAt: Date.now(),
      });
    }
    await dbPut("settings", { key: "seeded_v1", value: true });
    showToast(`Додано ${seed.length} ${pluralUk(seed.length, [t('doc1'), t('doc24'), t('doc5')])}`, "success");
  }

  /* ===================== 10. Dashboard Rendering ===================== */
  function renderDashboard() {
    const active = state.docs.filter(d => !d.archived);
    const counts = { valid: 0, soon: 0, expired: 0, none: 0 };
    active.forEach(d => { counts[getDocStatus(d).key]++; });
    dashTotal.textContent = active.length;
    dashValidCount.textContent = counts.valid;
    dashSoonCount.textContent = counts.soon;
    dashExpiredCount.textContent = counts.expired;
    dashNoneCount.textContent = counts.none;

    /* Timeline: next 90 days */
    const upcoming = active
      .filter(d => {
        const s = getDocStatus(d);
        return s.key === 'soon' || (s.key === 'valid' && s.daysLeft !== null && s.daysLeft <= 90);
      })
      .sort((a, b) => daysBetween(a.expiryDate) - daysBetween(b.expiryDate))
      .slice(0, 8);

    dashTimeline.innerHTML = upcoming.length ? upcoming.map(d => {
      const s = getDocStatus(d);
      const pct = Math.max(5, Math.min(100, (s.daysLeft / 90) * 100));
      return `<div class="dash-timeline-item status-${s.key}">
        <span class="dtl-name">${esc(d.nameUa)}</span>
        <div class="dtl-bar"><div class="dtl-fill" style="width:${pct}%"></div></div>
        <span class="dtl-days">${s.daysLeft} ${t('daysLeft')}</span>
      </div>`;
    }).join('') : `<p class="muted-note">${t('emptyText')}</p>`;
  }

  /* ===================== 11. Filtering / Sorting ===================== */
  const STATUS_DEFS_KEYS = ['all', 'valid', 'soon', 'expired', 'none'];
  const STATUS_I18N = { all: 'statusAll', valid: 'statusValid', soon: 'statusSoon', expired: 'statusExpired', none: 'statusNone' };

  function getFilteredDocs() {
    let list = state.docs.filter(d => !!d.archived === (state.filters.scope === "archive"));
    if (state.filters.scope === "active" && state.filters.status !== "all")
      list = list.filter(d => getDocStatus(d).key === state.filters.status);
    if (state.filters.tags.size)
      list = list.filter(d => (d.tags || []).some(tg => state.filters.tags.has(tg)));

    /* Bug fix #7: search in notes too */
    if (state.filters.search.trim()) {
      const q = state.filters.search.trim().toLowerCase();
      list = list.filter(d =>
        (d.nameUa || "").toLowerCase().includes(q) ||
        (d.nameEn || "").toLowerCase().includes(q) ||
        (d.number || "").toLowerCase().includes(q) ||
        (d.tags || []).some(tg => tg.toLowerCase().includes(q)) ||
        fmtDate(d.issueDate).includes(q) || fmtDate(d.expiryDate).includes(q) ||
        (d.issueDate || "").includes(q) || (d.expiryDate || "").includes(q) ||
        (d.notes || "").toLowerCase().includes(q)
      );
    }
    list.sort((a, b) => {
      if (state.sort === "expiry-asc") {
        const da = (a.noExpiry || !a.expiryDate) ? Infinity : daysBetween(a.expiryDate);
        const db2 = (b.noExpiry || !b.expiryDate) ? Infinity : daysBetween(b.expiryDate);
        return da - db2;
      }
      if (state.sort === "name-asc") return (a.nameUa || "").localeCompare(b.nameUa || "", "uk");
      if (state.sort === "added-desc") return (b.createdAt || 0) - (a.createdAt || 0);
      return 0;
    });
    return list;
  }

  /* ===================== 12. Card Templates & Rendering ===================== */
  function thumbHtml(doc, large) {
    const info = getPreviewInfo(doc, large);
    if (info.kind === "img") return `<img src="${info.url}" alt="">`;
    if (info.kind === "pdf-live") return `<iframe src="${info.url}#toolbar=0&navpanes=0&view=FitH" loading="lazy"></iframe>`;
    if (info.kind === "pdf-icon") return `<div class="doc-thumb-placeholder"><span class="ph-icon">PDF</span></div>`;
    return `<div class="doc-thumb-placeholder"><span class="ph-icon">—</span></div>`;
  }

  function archCtlHtml(doc) {
    const s = getDocStatus(doc);
    if (doc.archived) return `<button class="unarchive-btn" data-unarchive="${doc.id}">${t('fromArchive')}</button>`;
    if (s.key === "expired") return `<button class="archive-btn" data-archive="${doc.id}">${t('toArchive')}</button>`;
    return "";
  }

  function mkMeta(doc) {
    return doc.expiryDate
      ? `<span>${t('until')} ${fmtDate(doc.expiryDate)}</span>`
      : doc.noExpiry ? `<span>${t('indefinitely')}</span>` : "";
  }

  function mkTags(doc) {
    return (doc.tags || []).length
      ? `<div class="card-tags">${doc.tags.map(tg => `<span class="tag-pill">${esc(tg)}</span>`).join("")}</div>`
      : "";
  }

  function cardTile(doc) {
    const s = getDocStatus(doc), fc = (doc.files || []).length;
    return `<article class="doc-card status-${s.key}${doc.archived ? " is-archived" : ""}" data-id="${doc.id}" tabindex="0">
      <div class="doc-thumb">${thumbHtml(doc, false)}<div class="thumb-stamp stamp-${s.key}">${stampText(doc)}</div>${archCtlHtml(doc)}${fc > 1 ? `<span class="file-count-badge">${fc} ${pluralUk(fc, [t('file1'), t('file24'), t('file5')])}</span>` : ""}</div>
      <div class="card-body"><div class="card-titles"><h3>${esc(doc.nameUa)}</h3>${doc.nameEn ? `<p class="card-name-en">${esc(doc.nameEn)}</p>` : ""}</div>${doc.number ? `<p class="card-number">№ ${esc(doc.number)}</p>` : ""}<div class="card-meta">${mkMeta(doc)}</div>${mkTags(doc)}</div>
    </article>`;
  }

  function cardLarge(doc) {
    const s = getDocStatus(doc), fc = (doc.files || []).length;
    return `<article class="doc-card status-${s.key}${doc.archived ? " is-archived" : ""}" data-id="${doc.id}" tabindex="0">
      <div class="doc-thumb">${thumbHtml(doc, true)}<div class="thumb-stamp stamp-${s.key}">${stampText(doc)}</div>${archCtlHtml(doc)}${fc > 1 ? `<span class="file-count-badge">${fc} ${pluralUk(fc, [t('file1'), t('file24'), t('file5')])}</span>` : ""}</div>
      <div class="card-body"><div class="card-titles"><h3>${esc(doc.nameUa)}</h3>${doc.nameEn ? `<p class="card-name-en">${esc(doc.nameEn)}</p>` : ""}</div>${doc.number ? `<p class="card-number">№ ${esc(doc.number)}</p>` : ""}<div class="card-meta">${mkMeta(doc)}</div>${mkTags(doc)}</div>
    </article>`;
  }

  function cardRow(doc) {
    const s = getDocStatus(doc), info = getPreviewInfo(doc, false);
    const thumb = info.kind === "img" ? `<img src="${info.url}" alt="">` : `<div class="ph-icon">${info.kind === "pdf-icon" ? "PDF" : "—"}</div>`;
    const dateText = doc.expiryDate ? fmtDate(doc.expiryDate) : doc.noExpiry ? t('indefinitely') : "—";
    const archBtn = doc.archived
      ? `<button class="row-unarchive-btn" data-unarchive="${doc.id}">${t('fromArchive')}</button>`
      : s.key === "expired" ? `<button class="row-archive-btn" data-archive="${doc.id}">${t('toArchive')}</button>` : "";
    return `<article class="doc-row status-${s.key}${doc.archived ? " is-archived" : ""}" data-id="${doc.id}" tabindex="0">
      <div class="row-thumb">${thumb}</div>
      <div class="row-titles"><h3>${esc(doc.nameUa)}</h3>${doc.nameEn ? `<p>${esc(doc.nameEn)}</p>` : ""}</div>
      <div class="row-number">${doc.number ? "№ " + esc(doc.number) : ""}</div>
      <div class="row-tags">${(doc.tags || []).slice(0, 3).map(tg => `<span class="tag-pill">${esc(tg)}</span>`).join("")}</div>
      <div class="row-date">${dateText}</div>
      <div class="row-actions">${archBtn}<div class="row-stamp stamp-${s.key}">${stampText(doc)}</div></div>
    </article>`;
  }

  /* Render functions */
  function renderSidebar() {
    const active = state.docs.filter(d => !d.archived), arch = state.docs.filter(d => d.archived);
    scopeActiveCount.textContent = active.length;
    scopeArchiveCount.textContent = arch.length;
    scopeActiveBtn.classList.toggle("active", state.filters.scope === "active");
    scopeArchiveBtn.classList.toggle("active", state.filters.scope === "archive");
    statusFilterGroup.classList.toggle("hidden", state.filters.scope === "archive");

    const counts = { all: active.length, valid: 0, soon: 0, expired: 0, none: 0 };
    active.forEach(d => { counts[getDocStatus(d).key]++; });
    statusFiltersEl.innerHTML = STATUS_DEFS_KEYS.map(key =>
      `<button class="filter-pill${state.filters.status === key ? " active" : ""}" data-status="${key}">
        <span class="dot dot-${key}"></span>${t(STATUS_I18N[key])}<span class="count">${counts[key]}</span>
      </button>`
    ).join("");

    const allTags = new Set();
    state.docs.forEach(d => (d.tags || []).forEach(tg => allTags.add(tg)));
    const sorted = [...allTags].sort((a, b) => a.localeCompare(b, "uk"));
    tagFiltersEl.innerHTML = sorted.length
      ? sorted.map(tg => `<button class="tag-pill-btn${state.filters.tags.has(tg) ? " active" : ""}" data-tag="${esc(tg)}">${esc(tg)}</button>`).join("")
      : `<p class="muted-note">${t('noTagsYet')}</p>`;
    tagSuggestions.innerHTML = sorted.map(tg => `<option value="${esc(tg)}">`).join("");
  }

  function renderCards() {
    /* Revoke old blob URLs before re-rendering */
    revokeAllBlobURLs();

    const list = getFilteredDocs();
    resultsCount.textContent = `${list.length} ${pluralUk(list.length, [t('doc1'), t('doc24'), t('doc5')])}`;
    document.querySelectorAll(".view-btn").forEach(b => b.classList.toggle("active", b.getAttribute("data-view") === state.viewMode));

    if (!state.docs.length) {
      cardsGrid.innerHTML = ""; cardsGrid.className = "cards-grid";
      emptyState.classList.remove("hidden");
      emptyState.querySelector(".empty-state-text").textContent = t('emptyText');
      emptyAddBtn.classList.remove("hidden"); resultsCount.textContent = "";
      return;
    }
    if (!list.length) {
      cardsGrid.innerHTML = ""; cardsGrid.className = "cards-grid";
      emptyState.classList.remove("hidden");
      emptyState.querySelector(".empty-state-text").textContent = state.filters.scope === "archive" ? t('emptyArchive') : t('emptySearch');
      emptyAddBtn.classList.add("hidden");
      return;
    }
    emptyState.classList.add("hidden");
    if (state.viewMode === "list") { cardsGrid.className = "cards-list"; cardsGrid.innerHTML = list.map(cardRow).join(""); }
    else if (state.viewMode === "large") { cardsGrid.className = "cards-grid mode-large"; cardsGrid.innerHTML = list.map(cardLarge).join(""); }
    else { cardsGrid.className = "cards-grid"; cardsGrid.innerHTML = list.map(cardTile).join(""); }
  }

  function renderAlertBanner() {
    const urgent = state.docs.filter(d => !d.archived && ["soon", "expired"].includes(getDocStatus(d).key));
    if (!urgent.length) { alertBanner.classList.add("hidden"); alertBanner.innerHTML = ""; return; }
    urgent.sort((a, b) => getDocStatus(a).daysLeft - getDocStatus(b).daysLeft);
    const exp = urgent.filter(d => getDocStatus(d).key === "expired").length, soon = urgent.length - exp;
    let det = "";
    if (exp) det += `${exp} ${pluralUk(exp, [t('expired1'), t('expired24'), t('expired5')])}`;
    if (exp && soon) det += " · ";
    if (soon) det += `${soon} ${pluralUk(soon, [t('expiringSoon'), t('expiringSoonP'), t('expiringSoonP')])}`;
    const chips = urgent.slice(0, 5).map(d =>
      `<button class="alert-chip" data-open="${d.id}">${esc(d.nameUa)} · ${stampText(d)}</button>`
    ).join("");
    alertBanner.classList.remove("hidden");
    alertBanner.innerHTML = `<div class="alert-icon">⚠</div>
      <div class="alert-text"><strong>${urgent.length} ${pluralUk(urgent.length, [t('docNeedAttention'), t('docsNeedAttention'), t('docsNeedAttention5')])} ${t('attentionNeeded')}</strong><span>${det}</span></div>
      <div class="alert-chips">${chips}${urgent.length > 5 ? `<span class="alert-more">+${urgent.length - 5}</span>` : ""}</div>`;
  }

  function renderAll() {
    renderSidebar();
    renderCards();
    renderAlertBanner();
    if (state.dashboardVisible) renderDashboard();
  }

  /* ===================== 13. Tag Chips (form) ===================== */
  function renderFormTags() {
    tagsChips.innerHTML = formTags.map((tg, i) =>
      `<span class="chip">${esc(tg)}<button type="button" data-remove-tag="${i}">×</button></span>`
    ).join("");
  }

  function bindTagEvents() {
    tagsChips.addEventListener("click", e => {
      const i = e.target.getAttribute("data-remove-tag");
      if (i !== null) { formTags.splice(+i, 1); renderFormTags(); }
    });
    tagsInput.addEventListener("keydown", e => {
      if (e.key === "Enter" || e.key === ",") {
        e.preventDefault();
        const v = tagsInput.value.trim().replace(/,$/, "");
        if (v && !formTags.includes(v)) { formTags.push(v); renderFormTags(); }
        tagsInput.value = "";
      } else if (e.key === "Backspace" && !tagsInput.value && formTags.length) {
        formTags.pop(); renderFormTags();
      }
    });
  }

  /* ===================== 14. PDF Thumbnail Generation ===================== */
  async function generateThumb(entry) {
    if (entry.type !== "application/pdf" || entry.thumb) return;
    try {
      const t = await window.PdfThumb.generate(entry.blob, 0.55);
      if (t) entry.thumb = t;
    } catch (e) { console.warn("thumb gen failed", e); }
  }

  /* ===================== 15. Attach List & Drag-Drop ===================== */
  async function addFiles(fileList) {
    for (const f of Array.from(fileList)) {
      if (!ALLOWED_TYPES.includes(f.type)) {
        showToast(`«${f.name}» ${t('fileSkippedType')}`, "error"); continue;
      }
      if (f.size > 25 * 1024 * 1024) {
        showToast(`«${f.name}» ${t('fileSkippedSize')}`, "error"); continue;
      }
      const entry = { name: f.name, type: f.type, blob: f, thumb: null };
      state.formFiles.push(entry);
      generateThumb(entry).then(() => renderAttachList());
    }
    renderAttachList();
  }

  function renderAttachList() {
    if (!state.formFiles.length) {
      attachList.innerHTML = `<p class="muted-note">${t('noFilesYet')}</p>`;
      return;
    }
    attachList.innerHTML = state.formFiles.map((f, i) => {
      const url = blobURL(f.thumb || f.blob);
      const thumb = (f.thumb || f.type.startsWith("image/"))
        ? `<img class="attach-thumb" src="${url}" alt="">`
        : `<div class="attach-thumb-ph">${f.type === "application/pdf" ? "PDF" : "?"}</div>`;
      return `<div class="attach-row${i === 0 ? " is-cover" : ""}">
        ${thumb}<div class="attach-meta"><span class="attach-name">${esc(f.name)}</span>${i === 0 ? `<span class="attach-cover-tag">${t('coverLabel')}</span>` : ""}</div>
        <div class="attach-actions">${i !== 0 ? `<button type="button" data-cover="${i}">${t('coverLabel')}</button>` : ""}<button type="button" data-view-file="${i}">👁</button><button type="button" class="remove-btn" data-remove-file="${i}">✕</button></div>
      </div>`;
    }).join("");
  }

  function bindAttachEvents() {
    fileInput.addEventListener("change", async () => { await addFiles(fileInput.files); fileInput.value = ""; });
    dropZone.addEventListener("dragover", e => { e.preventDefault(); dropZone.classList.add("drag-over"); });
    dropZone.addEventListener("dragleave", e => { if (!dropZone.contains(e.relatedTarget)) dropZone.classList.remove("drag-over"); });
    dropZone.addEventListener("drop", async e => { e.preventDefault(); dropZone.classList.remove("drag-over"); await addFiles(e.dataTransfer.files); });

    attachList.addEventListener("click", e => {
      const ci = e.target.getAttribute("data-cover"),
        vi = e.target.getAttribute("data-view-file"),
        ri = e.target.getAttribute("data-remove-file");
      if (ci !== null) {
        const x = +ci; const [it] = state.formFiles.splice(x, 1);
        state.formFiles.unshift(it); renderAttachList();
      } else if (vi !== null) {
        const f = state.formFiles[+vi]; if (f) window.open(blobURL(f.blob), "_blank");
      } else if (ri !== null) {
        state.formFiles.splice(+ri, 1); renderAttachList();
      }
    });
  }

  /* ===================== 16. Date Validation (improved) ===================== */
  function clearDateErrors() {
    [issueDateError, expiryDateError].forEach(e => e.classList.add("hidden"));
    [issueDateInput, expiryDateInput].forEach(i => i.classList.remove("error-field"));
  }

  function validateDates(issueVal, expiryVal, noExpiry) {
    clearDateErrors();
    let ok = true;
    function badYear(v) { const y = parseInt(v.substring(0, 4)); return y < 1980 || y > 2099; }

    /* Bug fix #10: Issue date future check */
    if (issueVal) {
      if (badYear(issueVal)) {
        issueDateInput.classList.add("error-field");
        issueDateError.textContent = t('errYearRange');
        issueDateError.classList.remove("hidden"); ok = false;
      } else {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (new Date(issueVal + "T00:00:00") > today) {
          issueDateInput.classList.add("error-field");
          issueDateError.textContent = t('errIssueFuture');
          issueDateError.classList.remove("hidden"); ok = false;
        }
      }
    }
    if (!noExpiry && expiryVal) {
      if (badYear(expiryVal)) {
        expiryDateInput.classList.add("error-field");
        expiryDateError.textContent = t('errYearRange');
        expiryDateError.classList.remove("hidden"); ok = false;
      } else if (issueVal && expiryVal < issueVal) {
        expiryDateInput.classList.add("error-field");
        expiryDateError.textContent = t('errExpiryBeforeIssue');
        expiryDateError.classList.remove("hidden"); ok = false;
      }
    }
    return ok;
  }

  /* ===================== 17. Add/Edit Modal ===================== */
  function openAddModal() {
    state.editingId = null; state.confirmDuplicate = false;
    docForm.reset(); formTags = []; state.formFiles = [];
    renderFormTags(); renderAttachList(); clearDateErrors();
    modalTitle.textContent = t('newDoc');
    deleteDocBtn.classList.add("hidden");
    archiveActionBtn.classList.add("hidden");
    expiryDateInput.disabled = false;
    showModal(editModal);
    nameUaInput.focus();
  }

  function openEditModal(doc) {
    state.editingId = doc.id; state.confirmDuplicate = false;
    nameUaInput.value = doc.nameUa || "";
    nameEnInput.value = doc.nameEn || "";
    numberInput.value = doc.number || "";
    issueDateInput.value = doc.issueDate || "";
    noExpiryCheckbox.checked = !!doc.noExpiry;
    expiryDateInput.value = doc.expiryDate || "";
    expiryDateInput.disabled = !!doc.noExpiry;
    notesInput.value = doc.notes || "";
    formTags = (doc.tags || []).slice(); renderFormTags(); clearDateErrors();
    state.formFiles = (doc.files || []).map(f => ({ name: f.name, type: f.type, blob: f.blob, thumb: f.thumb || null }));
    renderAttachList();
    modalTitle.textContent = t('editDoc');
    deleteDocBtn.classList.remove("hidden");
    const s = getDocStatus(doc);
    if (doc.archived) {
      archiveActionBtn.textContent = t('unarchiveBtn');
      archiveActionBtn.classList.remove("hidden");
    } else if (s.key === "expired") {
      archiveActionBtn.textContent = t('archiveBtn');
      archiveActionBtn.classList.remove("hidden");
    } else {
      archiveActionBtn.classList.add("hidden");
    }
    showModal(editModal);
  }

  function bindEditModalEvents() {
    archiveActionBtn.addEventListener("click", async () => {
      const d = state.docs.find(x => x.id === state.editingId);
      if (!d) return;
      d.archived ? await unarchiveDoc(d.id) : await archiveDoc(d.id);
      closeModal(editModal);
    });

    noExpiryCheckbox.addEventListener("change", () => {
      expiryDateInput.disabled = noExpiryCheckbox.checked;
      if (noExpiryCheckbox.checked) expiryDateInput.value = "";
      clearDateErrors();
    });

    docForm.addEventListener("submit", async e => {
      e.preventDefault();
      const nameUa = nameUaInput.value.trim();
      if (!nameUa) { showToast('errNameRequired', "error"); nameUaInput.focus(); return; }
      if (!noExpiryCheckbox.checked && !expiryDateInput.value) {
        showToast('errExpiryRequired', "error"); expiryDateInput.focus(); return;
      }
      if (!validateDates(issueDateInput.value, expiryDateInput.value, noExpiryCheckbox.checked)) return;

      const number = numberInput.value.trim();

      /* Bug fix #1: Improved duplicate detection — check by nameUa alone */
      const dup = state.docs.find(d =>
        d.id !== state.editingId &&
        (d.nameUa || "").toLowerCase() === nameUa.toLowerCase()
      );
      if (dup && !state.confirmDuplicate) {
        showToast('warnDuplicate', "warn");
        state.confirmDuplicate = true;
        return;
      }
      state.confirmDuplicate = false;

      const docData = {
        nameUa,
        nameEn: nameEnInput.value.trim(),
        number,
        tags: formTags.slice(),
        issueDate: issueDateInput.value || "",
        noExpiry: noExpiryCheckbox.checked,
        expiryDate: noExpiryCheckbox.checked ? "" : expiryDateInput.value,
        notes: notesInput.value.trim(),
        files: state.formFiles.map(f => ({ name: f.name, type: f.type, blob: f.blob, thumb: f.thumb || null })),
        updatedAt: Date.now(),
      };

      if (state.editingId) {
        const ex = state.docs.find(d => d.id === state.editingId);
        docData.id = state.editingId;
        docData.createdAt = ex ? ex.createdAt : Date.now();
        docData.archived = ex ? !!ex.archived : false;
        await dbPut("documents", docData);
        showToast('toastSaved', "success");
      } else {
        docData.createdAt = Date.now(); docData.archived = false;
        await dbPut("documents", docData);
        showToast('toastAdded', "success");
      }
      await loadDocs(); closeModal(editModal); renderAll();
    });

    /* Bug fix #6: deleteArmed replaced by confirm dialog */
    deleteDocBtn.addEventListener("click", async () => {
      const ok = await showConfirm(t('confirmDeleteTitle'), t('confirmDeleteMsg'), t('deleteBtn'), true);
      if (!ok) return;
      const deletedDoc = state.docs.find(d => d.id === state.editingId);
      await dbDelete("documents", state.editingId);
      await loadDocs(); closeModal(editModal); renderAll();
      if (deletedDoc) pushUndo('delete', deletedDoc);
    });
  }

  /* ===================== 18. Document Preview Modal ===================== */
  function openPreview(doc) {
    state.previewDoc = doc;
    state.previewFileIndex = 0;
    previewTitle.textContent = doc.nameUa;
    renderPreviewContent();
    renderPreviewMeta();
    showModal(previewModal);
  }

  function renderPreviewContent() {
    const doc = state.previewDoc;
    const files = doc.files || [];
    if (!files.length) {
      previewContent.innerHTML = `<p class="muted-note">${t('noFilesYet')}</p>`;
      previewCounter.textContent = '';
      previewPrevBtn.classList.add('hidden');
      previewNextBtn.classList.add('hidden');
      return;
    }
    const f = files[state.previewFileIndex];
    const url = blobURL(f.blob);
    if (f.type && f.type.startsWith('image/')) {
      previewContent.innerHTML = `<img src="${url}" alt="${esc(f.name)}" class="preview-img">`;
    } else if (f.type === 'application/pdf') {
      previewContent.innerHTML = `<iframe src="${url}#toolbar=1" class="preview-pdf"></iframe>`;
    } else {
      previewContent.innerHTML = `<p>${esc(f.name)}</p>`;
    }
    previewCounter.textContent = files.length > 1 ? `${state.previewFileIndex + 1} / ${files.length}` : '';
    previewPrevBtn.classList.toggle('hidden', state.previewFileIndex === 0);
    previewNextBtn.classList.toggle('hidden', state.previewFileIndex >= files.length - 1);
  }

  function renderPreviewMeta() {
    const doc = state.previewDoc;
    let html = `<div class="preview-meta-grid">`;
    if (doc.nameEn) html += `<div class="pm-row"><span class="pm-label">${t('labelNameEn')}</span><span>${esc(doc.nameEn)}</span></div>`;
    if (doc.number) html += `<div class="pm-row"><span class="pm-label">${t('labelNumber')}</span><span>№ ${esc(doc.number)}</span></div>`;
    if (doc.issueDate) html += `<div class="pm-row"><span class="pm-label">${t('labelIssueDate')}</span><span>${fmtDate(doc.issueDate)}</span></div>`;
    html += `<div class="pm-row"><span class="pm-label">${t('labelExpiryDate')}</span><span>${doc.noExpiry ? t('indefinitely') : doc.expiryDate ? fmtDate(doc.expiryDate) : '—'}</span></div>`;
    if (doc.tags && doc.tags.length) html += `<div class="pm-row"><span class="pm-label">${t('labelTags')}</span><span>${doc.tags.map(tg => `<span class="tag-pill">${esc(tg)}</span>`).join(' ')}</span></div>`;
    if (doc.notes) html += `<div class="pm-row"><span class="pm-label">${t('labelNotes')}</span><span>${esc(doc.notes)}</span></div>`;
    html += `</div>`;
    previewDocMeta.innerHTML = html;
  }

  function bindPreviewEvents() {
    previewPrevBtn.addEventListener('click', () => {
      if (state.previewFileIndex > 0) { state.previewFileIndex--; renderPreviewContent(); }
    });
    previewNextBtn.addEventListener('click', () => {
      const files = (state.previewDoc && state.previewDoc.files) || [];
      if (state.previewFileIndex < files.length - 1) { state.previewFileIndex++; renderPreviewContent(); }
    });
    previewDownloadBtn.addEventListener('click', () => {
      const doc = state.previewDoc;
      if (!doc) return;
      const files = doc.files || [];
      if (!files.length) return;
      const f = files[state.previewFileIndex];
      const url = blobURL(f.blob);
      const a = document.createElement('a');
      a.href = url; a.download = f.name;
      document.body.appendChild(a); a.click(); a.remove();
    });
    previewEditBtn.addEventListener('click', () => {
      const doc = state.previewDoc;
      closeModal(previewModal);
      if (doc) openEditModal(doc);
    });
    previewCloseBtn.addEventListener('click', () => closeModal(previewModal));
  }

  /* ===================== 19. Archive / Unarchive ===================== */
  async function archiveDoc(id) {
    const d = state.docs.find(x => x.id === id);
    if (!d) return;
    const clone = Object.assign({}, d, { files: d.files });
    d.archived = true; d.updatedAt = Date.now();
    await dbPut("documents", d);
    await loadDocs(); renderAll();
    pushUndo('archive', clone);
  }

  async function unarchiveDoc(id) {
    const d = state.docs.find(x => x.id === id);
    if (!d) return;
    d.archived = false; d.updatedAt = Date.now();
    await dbPut("documents", d);
    await loadDocs(); renderAll();
    showToast('toastUnarchived', "success");
  }

  /* ===================== 20. Multi-select & Bulk (stub) ===================== */
  /* Not fully implemented in this version — focus on core features */

  /* ===================== 21. Undo System ===================== */
  function pushUndo(action, data) {
    state.undoStack.push({ action, data, timestamp: Date.now() });
    undoMessage.textContent = action === 'delete' ? t('toastDeleted') : t('toastArchived');
    undoToast.classList.remove('hidden');
    clearTimeout(state.undoTimer);
    state.undoTimer = setTimeout(() => {
      undoToast.classList.add('hidden');
      state.undoStack = [];
    }, 10000);
  }

  function bindUndoEvents() {
    undoBtn.addEventListener('click', async () => {
      const last = state.undoStack.pop();
      if (!last) return;
      if (last.action === 'delete') {
        await dbPut('documents', last.data);
      } else if (last.action === 'archive') {
        last.data.archived = false;
        await dbPut('documents', last.data);
      }
      await loadDocs(); renderAll();
      undoToast.classList.add('hidden');
      showToast('undoBtn', 'success');
    });
  }

  /* ===================== 22. Event Delegation ===================== */
  function bindCoreEvents() {
    /* Card click: preview if files, edit if none */
    cardsGrid.addEventListener("click", e => {
      const ab = e.target.closest("[data-archive]");
      if (ab) { e.stopPropagation(); archiveDoc(+ab.getAttribute("data-archive")); return; }
      const ub = e.target.closest("[data-unarchive]");
      if (ub) { e.stopPropagation(); unarchiveDoc(+ub.getAttribute("data-unarchive")); return; }
      const card = e.target.closest("[data-id]");
      if (!card) return;
      const doc = state.docs.find(d => String(d.id) === card.getAttribute("data-id"));
      if (!doc) return;
      if (doc.files && doc.files.length) openPreview(doc);
      else openEditModal(doc);
    });

    cardsGrid.addEventListener("keydown", e => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const card = e.target.closest("[data-id]");
      if (!card) return;
      e.preventDefault();
      const doc = state.docs.find(d => String(d.id) === card.getAttribute("data-id"));
      if (!doc) return;
      if (doc.files && doc.files.length) openPreview(doc);
      else openEditModal(doc);
    });

    alertBanner.addEventListener("click", e => {
      const c = e.target.closest("[data-open]");
      if (!c) return;
      const doc = state.docs.find(d => String(d.id) === c.getAttribute("data-open"));
      if (doc) {
        if (doc.files && doc.files.length) openPreview(doc);
        else openEditModal(doc);
      }
    });

    statusFiltersEl.addEventListener("click", e => {
      const b = e.target.closest("[data-status]");
      if (!b) return;
      state.filters.status = b.getAttribute("data-status"); renderAll();
    });

    tagFiltersEl.addEventListener("click", e => {
      const b = e.target.closest("[data-tag]");
      if (!b) return;
      const tg = b.getAttribute("data-tag");
      state.filters.tags.has(tg) ? state.filters.tags.delete(tg) : state.filters.tags.add(tg);
      renderAll();
    });

    scopeActiveBtn.addEventListener("click", () => { state.filters.scope = "active"; renderAll(); });
    scopeArchiveBtn.addEventListener("click", () => { state.filters.scope = "archive"; renderAll(); });
    sortSelect.addEventListener("change", () => { state.sort = sortSelect.value; renderCards(); });

    document.querySelectorAll(".view-btn").forEach(b => b.addEventListener("click", async () => {
      state.viewMode = b.getAttribute("data-view");
      await dbPut("settings", { key: "viewMode", value: state.viewMode });
      renderCards();
    }));

    resetFiltersBtn.addEventListener("click", () => {
      state.filters.status = "all"; state.filters.tags = new Set();
      state.filters.search = ""; searchInput.value = "";
      sortSelect.value = "expiry-asc"; state.sort = "expiry-asc";
      renderAll();
    });

    let sd = null;
    searchInput.addEventListener("input", () => {
      clearTimeout(sd);
      sd = setTimeout(() => { state.filters.search = searchInput.value; renderCards(); }, 150);
    });

    addBtn.addEventListener("click", openAddModal);
    emptyAddBtn.addEventListener("click", openAddModal);
    if (fabAddBtn) fabAddBtn.addEventListener("click", openAddModal);

    /* Modal close buttons (data-close-modal) */
    document.querySelectorAll("[data-close-modal]").forEach(b =>
      b.addEventListener("click", () => closeModal($(b.getAttribute("data-close-modal"))))
    );

    /* Click outside modal to close */
    document.querySelectorAll(".modal-overlay").forEach(o =>
      o.addEventListener("click", e => { if (e.target === o) closeModal(o); })
    );

    /* Theme toggle */
    themeToggleBtn.addEventListener("click", toggleTheme);

    /* Language toggle */
    langToggleBtn.addEventListener("click", () => {
      setLang(currentLang === 'uk' ? 'en' : 'uk');
    });

    /* Dashboard toggle */
    dashboardToggleBtn.addEventListener("click", () => {
      state.dashboardVisible = !state.dashboardVisible;
      dashboardSection.classList.toggle("hidden", !state.dashboardVisible);
      if (state.dashboardVisible) renderDashboard();
    });
  }

  /* ===================== 23. Keyboard Shortcuts ===================== */
  function bindKeyboardShortcuts() {
    document.addEventListener("keydown", e => {
      /* Skip if PIN overlay is visible */
      if (!pinOverlay.classList.contains("hidden")) return;

      /* Skip if inside input/textarea */
      const tag = (e.target.tagName || "").toLowerCase();
      const inInput = tag === 'input' || tag === 'textarea' || tag === 'select' || e.target.isContentEditable;

      /* Escape always works */
      if (e.key === "Escape") {
        /* Close topmost modal */
        const openModals = document.querySelectorAll(".modal-overlay:not(.hidden)");
        if (openModals.length) {
          closeModal(openModals[openModals.length - 1]);
          e.preventDefault();
          return;
        }
        /* Clear search */
        if (searchInput.value) {
          searchInput.value = ""; state.filters.search = ""; renderCards();
          e.preventDefault();
          return;
        }
        return;
      }

      if (inInput) return;

      /* Check no modal is open */
      const anyModalOpen = document.querySelector(".modal-overlay:not(.hidden)");
      if (anyModalOpen) {
        /* Arrow keys in preview modal for file navigation */
        if (!previewModal.classList.contains('hidden')) {
          if (e.key === 'ArrowLeft') {
            if (state.previewFileIndex > 0) { state.previewFileIndex--; renderPreviewContent(); e.preventDefault(); }
          } else if (e.key === 'ArrowRight') {
            const files = (state.previewDoc && state.previewDoc.files) || [];
            if (state.previewFileIndex < files.length - 1) { state.previewFileIndex++; renderPreviewContent(); e.preventDefault(); }
          }
        }
        return;
      }

      /* Ctrl+N → new document */
      if (e.ctrlKey && e.key === 'n') { e.preventDefault(); openAddModal(); return; }
      /* / → search */
      if (e.key === '/') { e.preventDefault(); searchInput.focus(); return; }
      /* 1, 2, 3 → view modes */
      if (e.key === '1') { state.viewMode = 'tile'; dbPut("settings", { key: "viewMode", value: "tile" }); renderCards(); return; }
      if (e.key === '2') { state.viewMode = 'list'; dbPut("settings", { key: "viewMode", value: "list" }); renderCards(); return; }
      if (e.key === '3') { state.viewMode = 'large'; dbPut("settings", { key: "viewMode", value: "large" }); renderCards(); return; }
      /* d → toggle dashboard */
      if (e.key === 'd') {
        state.dashboardVisible = !state.dashboardVisible;
        dashboardSection.classList.toggle("hidden", !state.dashboardVisible);
        if (state.dashboardVisible) renderDashboard();
        return;
      }
      /* ? → shortcuts modal */
      if (e.key === '?') { showModal(shortcutsModal); return; }
    });
  }

  /* ===================== 24. Browser Notifications ===================== */
  async function checkNotifications() {
    const urgent = state.docs.filter(d => !d.archived && ['soon', 'expired'].includes(getDocStatus(d).key));
    if (!urgent.length) return;
    if (!('Notification' in window)) return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
    if (Notification.permission === 'granted') {
      new Notification(t('notifTitle'), {
        body: `${urgent.length} ${t('notifBody')}`,
        icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">📋</text></svg>'
      });
    }
  }

  /* ===================== 25. Auto-Lock on Inactivity ===================== */
  let autoLockTimer = null;

  function resetAutoLock() {
    if (autoLockTimer) clearTimeout(autoLockTimer);
    const minutes = state.settings.autoLockMinutes;
    if (!minutes) return;
    autoLockTimer = setTimeout(async () => {
      const hash = await getPINHash();
      if (hash) openPINOverlay();
    }, minutes * 60 * 1000);
  }

  function bindAutoLockEvents() {
    ['click', 'keydown', 'mousemove', 'touchstart'].forEach(evt =>
      document.addEventListener(evt, resetAutoLock, { passive: true })
    );
  }

  /* ===================== 26. Calendar Export (.ics) ===================== */
  function icsDate(iso) { return iso.replace(/-/g, ""); }
  function icsDatePlus1(iso) {
    const d = new Date(iso + "T00:00:00"); d.setDate(d.getDate() + 1);
    return d.toISOString().slice(0, 10).replace(/-/g, "");
  }
  function icsEsc(s) {
    return (s || "").replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\n/g, "\\n");
  }
  function nowStamp() { return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d+/, ""); }

  async function exportCalendar() {
    const docs = state.docs.filter(d => !d.archived && d.expiryDate && !d.noExpiry);
    if (!docs.length) { showToast('warnNoCalendarDocs', "warn"); return; }
    const lines = ["BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//DocVault//Certificates//UK", "CALSCALE:GREGORIAN", "METHOD:PUBLISH", `X-WR-CALNAME:${t('reportTitle')}`];
    for (const d of docs) {
      lines.push(
        "BEGIN:VEVENT",
        `UID:docvault-${d.id}@docvault`,
        `DTSTAMP:${nowStamp()}Z`,
        `DTSTART;VALUE=DATE:${icsDate(d.expiryDate)}`,
        `DTEND;VALUE=DATE:${icsDatePlus1(d.expiryDate)}`,
        `SUMMARY:⚠ ${icsEsc(d.nameUa)}`,
        `DESCRIPTION:${icsEsc(d.nameEn || "")}${d.number ? "\\nНомер: " + icsEsc(d.number) : ""}`,
        "BEGIN:VALARM", "TRIGGER:-P30D", "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(d.nameUa)}`, "END:VALARM",
        "BEGIN:VALARM", "TRIGGER:-P7D", "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(d.nameUa)}`, "END:VALARM",
        "BEGIN:VALARM", "TRIGGER:-P1D", "ACTION:DISPLAY", `DESCRIPTION:${icsEsc(d.nameUa)}`, "END:VALARM",
        "END:VEVENT"
      );
    }
    lines.push("END:VCALENDAR");
    const content = lines.join("\r\n"), stamp = new Date().toISOString().slice(0, 10), filename = `sertyfikaty-${stamp}.ics`;
    if (window.showSaveFilePicker) {
      try {
        const h = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "iCalendar", accept: { "text/calendar": [".ics"] } }] });
        const w = await h.createWritable(); await w.write(content); await w.close();
        showToast('toastCalendarSaved', "success"); return;
      } catch (e) { if (e && e.name === "AbortError") return; }
    }
    const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = filename;
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    showToast('toastCalendarDownloaded', "success");
  }

  /* ===================== 27. Print Report ===================== */
  const STATUS_REPORT = { valid: 'statusValid', soon: 'statusSoon', expired: 'statusExpired', none: 'statusNone' };
  const SC = { valid: "pr-valid", soon: "pr-soon", expired: "pr-expired", none: "pr-none" };

  function printReport() {
    const list = getFilteredDocs();
    if (!list.length) { showToast('warnNoReportDocs', "warn"); return; }
    const now = new Date().toLocaleDateString("uk-UA", { day: "2-digit", month: "2-digit", year: "numeric" });
    const scopeLabel = state.filters.scope === "archive" ? t('reportArchive') : t('reportActive');
    const rows = list.map(d => {
      const s = getDocStatus(d);
      const sl = t(STATUS_REPORT[s.key]) || "";
      const sc = SC[s.key] || "";
      const note = s.key === "soon" ? ` (${s.daysLeft} ${t('daysLeft')})` : s.key === "expired" ? ` (${Math.abs(s.daysLeft)} ${t('daysAgo')})` : "";
      return `<tr><td>${d.nameUa}${d.nameEn ? `<br><span style="font-size:9.5px;color:#666">${d.nameEn}</span>` : ""}</td><td>${d.number || "—"}</td><td>${d.issueDate ? fmtDate(d.issueDate) : "—"}</td><td>${d.noExpiry ? t('indefinitely') : d.expiryDate ? fmtDate(d.expiryDate) : "—"}</td><td class="${sc}">${sl}${note}</td><td>${(d.tags || []).join(", ") || "—"}</td></tr>`;
    }).join("");
    const html = `<!DOCTYPE html><html lang="uk"><head><meta charset="UTF-8"><title>${t('reportTitle')}</title>
    <style>body{font-family:Georgia,"Times New Roman",serif;color:#111;margin:0;padding:20mm;font-size:11px;}h1{font-size:17px;margin:0 0 3px;}p.meta{font-size:9.5px;color:#666;margin:0 0 14px;}table{width:100%;border-collapse:collapse;}th{background:#111;color:#fff;padding:6px 8px;text-align:left;font-size:9px;letter-spacing:.05em;text-transform:uppercase;}td{border-bottom:1px solid #ddd;padding:6px 8px;vertical-align:top;}tr:nth-child(even)td{background:#f9f9f9;}.pr-valid{color:#2a7a4a;font-weight:700;}.pr-soon{color:#b36000;font-weight:700;}.pr-expired{color:#b02020;font-weight:700;}.pr-none{color:#555;}@media print{@page{size:A4 landscape;margin:12mm;}}</style>
    </head><body>
    <h1>${t('reportTitle')} ${scopeLabel}</h1>
    <p class="meta">${t('reportGenerated')}: ${now} &nbsp;·&nbsp; ${t('reportDocs')}: ${list.length}</p>
    <table><thead><tr><th>${t('reportColName')}</th><th>${t('reportColNumber')}</th><th>${t('reportColIssued')}</th><th>${t('reportColExpiry')}</th><th>${t('reportColStatus')}</th><th>${t('reportColTags')}</th></tr></thead><tbody>${rows}</tbody></table>
    <script>window.onload=function(){window.print();}<\/script></body></html>`;
    const w = window.open("", "_blank", "width=1000,height=700");
    if (!w) { showToast('errPopupBlocked', "error"); return; }
    w.document.write(html); w.document.close();
  }

  /* ===================== 28. Settings (extended) ===================== */
  function bindSettingsEvents() {
    settingsBtn.addEventListener("click", async () => {
      warnDaysInput.value = state.settings.warnDays;
      if (autoLockSelect) autoLockSelect.value = String(state.settings.autoLockMinutes || 0);
      if (encryptionToggle) encryptionToggle.checked = !!state.settings.encryptionEnabled;
      updatePINUI(!!(await getPINHash()));
      showModal(settingsModal);
    });

    saveSettingsBtn.addEventListener("click", async () => {
      const v = parseInt(warnDaysInput.value, 10);
      if (isNaN(v) || v < 1) { showToast('errWarnDays', "error"); return; }
      await dbPut("settings", { key: "warnDays", value: v });
      state.settings.warnDays = v;

      /* Auto-lock minutes */
      if (autoLockSelect) {
        const alm = parseInt(autoLockSelect.value, 10) || 0;
        await dbPut("settings", { key: "autoLockMinutes", value: alm });
        state.settings.autoLockMinutes = alm;
        resetAutoLock();
      }

      /* Encryption toggle */
      if (encryptionToggle) {
        const enc = encryptionToggle.checked;
        await dbPut("settings", { key: "encryptionEnabled", value: enc });
        state.settings.encryptionEnabled = enc;
      }

      closeModal(settingsModal); renderAll();
      showToast('toastSettingsSaved', "success");
    });

    clearAllBtn.addEventListener("click", async () => {
      const ok = await showConfirm(t('confirmClearTitle'), t('confirmClearMsg'), t('clearAll'), true);
      if (!ok) return;
      await dbClear("documents"); await dbClear("settings");
      await dbPut("settings", { key: "seeded_v1", value: true });
      state.settings.warnDays = 30;
      state.settings.autoLockMinutes = 0;
      state.settings.encryptionEnabled = false;
      await loadDocs(); closeModal(settingsModal); renderAll();
      showToast('toastCleared', "success");
    });
  }

  /* ===================== 29. Backup / Restore (improved) ===================== */
  function bindBackupEvents() {
    backupBtn.addEventListener("click", () => showModal(backupModal));

    exportBtn.addEventListener("click", async () => {
      try {
        const docs = await dbGetAll("documents"), settings = await dbGetAll("settings"), serial = [];
        for (const d of docs) {
          const copy = Object.assign({}, d), files = [];
          for (const f of (d.files || [])) {
            files.push({
              name: f.name, type: f.type,
              dataUrl: await blobToDataURL(f.blob),
              thumbDataUrl: f.thumb ? await blobToDataURL(f.thumb) : null
            });
          }
          copy.files = files; serial.push(copy);
        }
        const payload = { app: "doc-vault", version: 2, exportedAt: new Date().toISOString(), settings, docs: serial };
        const jsonStr = JSON.stringify(payload), stamp = new Date().toISOString().slice(0, 10), filename = `dokumenty-rezervna-kopiya-${stamp}.json`;
        if (window.showSaveFilePicker) {
          try {
            const h = await window.showSaveFilePicker({ suggestedName: filename, types: [{ description: "JSON", accept: { "application/json": [".json"] } }] });
            const w = await h.createWritable(); await w.write(jsonStr); await w.close();
            showToast('toastBackupSaved', "success"); return;
          } catch (e) { if (e && e.name === "AbortError") return; }
        }
        const blob = new Blob([jsonStr], { type: "application/json" }), url = URL.createObjectURL(blob), a = document.createElement("a");
        a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 5000);
        showToast('toastBackupDownloaded', "success");
      } catch (e) { console.error(e); showToast('errBackupFailed', "error"); }
    });

    importBtn.addEventListener("click", () => importFileInput.click());

    importFileInput.addEventListener("change", async () => {
      const file = importFileInput.files[0];
      if (!file) return;
      try {
        const payload = JSON.parse(await file.text());

        /* Bug fix #9: Validate payload.app */
        if (!payload || payload.app !== 'doc-vault' || !Array.isArray(payload.docs)) throw new Error("bad format");

        let count = 0, skipped = 0;

        for (const d of payload.docs) {
          /* Bug fix #2: Import deduplication */
          const existing = state.docs.find(ex =>
            (ex.nameUa || "").toLowerCase() === (d.nameUa || "").toLowerCase() &&
            (ex.number || "").toLowerCase() === (d.number || "").toLowerCase() &&
            (ex.expiryDate || "") === (d.expiryDate || "")
          );
          if (existing) { skipped++; continue; }

          const newDoc = Object.assign({}, d); delete newDoc.id;
          const raw = Array.isArray(d.files) ? d.files : d.fileBase64 ? [{ name: d.fileName, type: d.fileType, dataUrl: d.fileBase64, thumbDataUrl: null }] : [];
          const files = [];
          for (const f of raw) {
            const blob = f.dataUrl ? await dataURLToBlob(f.dataUrl) : null;
            const thumb = f.thumbDataUrl ? await dataURLToBlob(f.thumbDataUrl) : null;
            if (blob) files.push({ name: f.name, type: f.type, blob, thumb });
          }
          newDoc.files = files; newDoc.archived = !!d.archived;
          delete newDoc.fileBase64; delete newDoc.fileName; delete newDoc.fileType; delete newDoc.fileData;
          await dbPut("documents", newDoc); count++;
        }

        /* Bug fix #3: Import settings (warnDays and autoLockMinutes, NOT pinHash) */
        if (Array.isArray(payload.settings)) {
          for (const s of payload.settings) {
            if (s.key === 'warnDays' || s.key === 'autoLockMinutes') {
              await dbPut("settings", s);
            }
          }
          await loadSettings();
        }

        await loadDocs(); renderAll();
        showToast(`${t('toastImported')}: ${count}${skipped ? ` (${skipped} skipped)` : ''}`, "success");
        closeModal(backupModal);
      } catch (e) { console.error(e); showToast('errBadBackup', "error"); }
      finally { importFileInput.value = ""; }
    });

    calendarBtn.addEventListener("click", exportCalendar);
    reportBtn.addEventListener("click", printReport);
  }

  /* ===================== 30. PWA Registration ===================== */
  function registerSW() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('./sw.js').catch(e => console.warn('SW registration failed', e));
    }
  }

  /* ===================== 31. Init ===================== */
  async function init() {
    try {
      cacheDOMRefs();
      applyI18n();
      document.documentElement.setAttribute('data-lang', currentLang);
      const label = langToggleBtn.querySelector('.lang-label');
      if (label) label.textContent = currentLang === 'uk' ? 'UA' : 'EN';

      await loadSettings();
      await initPIN();
      await maybeSeed();
      await loadDocs();

      /* Bind all events */
      bindPINEvents();
      bindTagEvents();
      bindAttachEvents();
      bindEditModalEvents();
      bindPreviewEvents();
      bindUndoEvents();
      bindCoreEvents();
      bindKeyboardShortcuts();
      bindSettingsEvents();
      bindBackupEvents();
      bindAutoLockEvents();

      renderAll();
      resetAutoLock();

      /* PDF thumb init */
      window.PdfThumb && window.PdfThumb.init().catch(() => { });

      /* Notifications */
      checkNotifications();

      /* PWA */
      registerSW();
    } catch (e) {
      console.error(e);
      showToast('errLoadFailed', "error");
    }
  }

  document.addEventListener("DOMContentLoaded", init);
})();

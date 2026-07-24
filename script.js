const THEMES = [
  { name: 'Light Gray', primary: '#737373', secondary: '#a3a3a3', bg: '#f5f5f5', accent: '#e5e5e5', text: '#171717', border: '#d4d4d4' },
  { name: 'Minimal White', primary: '#111111', secondary: '#333333', bg: '#ffffff', accent: '#cccccc' },
  { name: 'Indigo',    primary: '#4f46e5', secondary: '#818cf8', bg: '#eef2ff', accent: '#c7d2fe' },
  { name: 'Ocean',     primary: '#0284c7', secondary: '#38bdf8', bg: '#f0f9ff', accent: '#bae6fd' },
  { name: 'Emerald',   primary: '#059669', secondary: '#34d399', bg: '#ecfdf5', accent: '#a7f3d0' },
  { name: 'Rose',      primary: '#e11d48', secondary: '#fb7185', bg: '#fff1f2', accent: '#fecdd3' },
  { name: 'Amber',     primary: '#d97706', secondary: '#fbbf24', bg: '#fffbeb', accent: '#fde68a' },
  { name: 'Purple',    primary: '#7c3aed', secondary: '#a78bfa', bg: '#f5f3ff', accent: '#ddd6fe' },
  { name: 'Teal',      primary: '#0d9488', secondary: '#2dd4bf', bg: '#f0fdfa', accent: '#99f6e4' },
  { name: 'Slate',     primary: '#475569', secondary: '#94a3b8', bg: '#f8fafc', accent: '#cbd5e1' },
  { name: 'Crimson',   primary: '#991b1b', secondary: '#dc2626', bg: '#fef2f2', accent: '#fecaca' },
  { name: 'Midnight',  primary: '#1e1b4b', secondary: '#312e81', bg: '#e0e7ff', accent: '#a5b4fc' },
];

const TEMPLATES = [
  { name: '1 Month Landscape', cols: -1, icon: '🖼️', cls: 'tpl-landscape', desc: 'Landscape Month' },
  { name: '1 Month/Page', cols: 0, icon: '📅', cls: 'tpl-single', desc: 'Current Month' },
  { name: '1 Column',     cols: 1, icon: '▣', cls: 'tpl-1col' },
  { name: '2 Columns',    cols: 2, icon: '▥', cls: 'tpl-2col' },
  { name: '3 Columns',    cols: 3, icon: '▦', cls: 'tpl-3col' },
  { name: '4 Columns',    cols: 4, icon: '▧', cls: 'tpl-4col' },
];

const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];
const DAYS_FULL = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

const MONTH_QUOTES = [
  "बीता चाहे कितना भी कठिन क्यों न हो, आप हमेशा नए सिरे से शुरुआत कर सकते हैं।",
  "पीछे मुड़कर मत देखो; तुम उस रास्ते नहीं जा रहे हो।",
  "इस बिंदु तक जो कुछ भी हुआ वह महानता के लिए मात्र अभ्यास था।",
  "आपकी गलतियों ने ही आपको इस स्थिति तक पहुंचाया है। उनके लिए आभारी रहें।",
  "बीते महीने का परिणाम इस महीने के परिणाम से तय नहीं होता।",
  "नया महीना हमें याद दिलाता है कि जीवन नई शुरुआत से भरा है।",
  "इस महीने की शब्दावली में \"नहीं कर सकते\" शब्द को शामिल न होने दें।",
  "अपने महीने को आशाओं, सपनों और लक्ष्यों से भरें, न कि दुखों, चिंताओं और अनिश्चितताओं से।",
  "बीते महीने की कठिनाइयों को इस महीने की सफलताओं का आधार बनने दें।",
  "अंधकार में मत डूबे रहो। नए महीने के उजाले में कदम रखो।",
  "भले ही पिछले महीने आपको हार का सामना करना पड़ा हो, याद रखें कि इस महीने आप अभी भी मैदान में हैं।",
  "अगर पिछला महीना आपके लिए अच्छा नहीं रहा, तो खुद को नए सिरे से तैयार करें। इस महीने की शुरुआत उन सभी चीजों की ओर दौड़कर करें जो आप चाहते हैं, न कि उन चीजों से दूर भागकर जो आप नहीं चाहते।"
];

let currentTheme = THEMES[0];
let currentTemplate = TEMPLATES[0];
let previewMonthIndex = 0;
let headerImageSrcBefore = null;
let headerImageSrcAfter = null;
let yearImageSrc = null;
let sidebarMonthImageSrc = null;
let currentImageTarget = 'headerImageSrcBefore';

function selectImageTarget(target) {
  currentImageTarget = target;
  document.querySelectorAll('.img-tgt-btn').forEach(b => {
    if (b.dataset.target === target) {
      b.classList.add('active');
    } else {
      b.classList.remove('active');
    }
  });
}

function clearCurrentImage() {
  if (currentImageTarget === 'headerImageSrcBefore') headerImageSrcBefore = null;
  else if (currentImageTarget === 'headerImageSrcAfter') headerImageSrcAfter = null;
  else if (currentImageTarget === 'yearImageSrc') yearImageSrc = null;
  else if (currentImageTarget === 'sidebarMonthImageSrc') sidebarMonthImageSrc = null;
  renderPreview();
}

function init() {
  populateYears();
  renderThemes();
  renderTemplates();
  renderPreview();

  document.getElementById('sharedImageUpload').addEventListener('change', function(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function(event) {
        if (currentImageTarget === 'headerImageSrcBefore') headerImageSrcBefore = event.target.result;
        else if (currentImageTarget === 'headerImageSrcAfter') headerImageSrcAfter = event.target.result;
        else if (currentImageTarget === 'yearImageSrc') yearImageSrc = event.target.result;
        else if (currentImageTarget === 'sidebarMonthImageSrc') sidebarMonthImageSrc = event.target.result;
        renderPreview();
      };
      reader.readAsDataURL(file);
    }
    this.value = '';
  });

  document.getElementById('bgOpacity').addEventListener('input', renderPreview);
  document.getElementById('globalTextColor').addEventListener('input', renderPreview);

  document.getElementById('yearSelect').addEventListener('change', () => { renderPreview(); });
  document.getElementById('pageFormat').addEventListener('change', renderPreview);
  document.getElementById('startDay').addEventListener('change', renderPreview);
  document.getElementById('calTitle').addEventListener('input', renderPreview);
  document.getElementById('highlightDateNum').addEventListener('input', renderPreview);
  document.getElementById('highlightDateColor').addEventListener('input', renderPreview);
  document.getElementById('fontFamily').addEventListener('change', function() {
    execCmdVal('fontName', this.value);
  });
  document.getElementById('editorArea').addEventListener('input', renderPreview);
  window.addEventListener('resize', adjustMobileScale);
}

function populateYears() {
  const sel = document.getElementById('yearSelect');
  const currentYear = new Date().getFullYear();
  const defaultYear = currentYear >= 2026 && currentYear <= 2050 ? currentYear : 2026;
  for (let y = 2026; y <= 2050; y++) {
    const opt = document.createElement('option');
    opt.value = y;
    opt.textContent = y;
    if (y === defaultYear) opt.selected = true;
    sel.appendChild(opt);
  }
}

function renderThemes() {
  const container = document.getElementById('themeContainer');
  container.innerHTML = '';
  THEMES.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'theme-card' + (i === 0 ? ' active' : '');
    card.innerHTML = `
      <div class="theme-preview" style="background: linear-gradient(135deg, ${t.primary}, ${t.secondary});"></div>
      <span>${t.name}</span>
    `;
    card.onclick = () => {
      document.querySelectorAll('.theme-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentTheme = t;
      renderPreview();
    };
    container.appendChild(card);
  });
}

function renderTemplates() {
  const container = document.getElementById('templateContainer');
  container.innerHTML = '';
  TEMPLATES.forEach((t, i) => {
    const card = document.createElement('div');
    card.className = 'template-card' + (i === 0 ? ' active' : '');
    card.innerHTML = `
      <div class="template-preview">${t.icon}</div>
      <span>${t.name}</span>
      ${t.desc ? `<div style="font-size:0.7rem;color:#64748b;margin-top:0.2rem;">${t.desc}</div>` : ''}
    `;
    card.onclick = () => {
      document.querySelectorAll('.template-card').forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      currentTemplate = t;
      previewMonthIndex = 0;
      renderPreview();
    };
    container.appendChild(card);
  });
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month, startDay) {
  let d = new Date(year, month, 1).getDay();
  return (d - startDay + 7) % 7;
}

function renderMonthHTML(year, month, startDay, theme, is4Col = false) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month, startDay);
  const today = new Date();

  const highlightInput = document.getElementById('highlightDateNum').value;
  const highlightColor = document.getElementById('highlightDateColor').value;
  const highlightDates = highlightInput.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));

  const dayHeaders = [];
  for (let i = 0; i < 7; i++) {
    const dayStr = DAYS_FULL[(i + startDay) % 7];
    dayHeaders.push(is4Col ? dayStr.charAt(0) : dayStr);
  }

  let html = `<div class="month-block">
    <div class="month-title" style="background:${theme.primary}; color: var(--theme-text, white);">${MONTHS[month]}</div>
    <table class="month-table"><thead><tr>`;

  dayHeaders.forEach((d, i) => {
    const color = i === 0 ? 'color:#ef4444;' : '';
    html += `<th style="${color}">${d}</th>`;
  });
  html += `</tr></thead><tbody><tr>`;

  for (let i = 0; i < firstDay; i++) {
    html += `<td class="empty"></td>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = (firstDay + day - 1) % 7;
    let cls = '';
    if (dayOfWeek === 0) cls = 'sunday';
    if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
      cls = 'today';
    }
    
    let styleStr = '';
    if (highlightDates.includes(day)) {
      styleStr = `color: ${highlightColor} !important; font-weight: bold;`;
    }
    
    html += `<td class="${cls}" style="${styleStr}">${day}</td>`;
    if (dayOfWeek === 6 && day < daysInMonth) html += `</tr><tr>`;
  }

  const lastDayOfWeek = (firstDay + daysInMonth - 1) % 7;
  for (let i = lastDayOfWeek + 1; i < 7; i++) {
    html += `<td class="empty"></td>`;
  }

  html += `</tr></tbody></table></div>`;
  return html;
}

// ===== ENHANCED SINGLE MONTH PAGE PREVIEW =====
function renderSingleMonthPageHTML(year, month, startDay, theme) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month, startDay);
  const today = new Date();

  const dayHeaders = [];
  for (let i = 0; i < 7; i++) {
    dayHeaders.push(DAYS_FULL[(i + startDay) % 7]);
  }

  const imgHtmlBefore = headerImageSrcBefore ? `<img src="${headerImageSrcBefore}" style="height: 1.2em; vertical-align: middle; margin: 0 15px;" />` : '';
  const imgHtmlAfter = headerImageSrcAfter ? `<img src="${headerImageSrcAfter}" style="height: 1.2em; vertical-align: middle; margin: 0 15px;" />` : '';

  let html = `<div class="single-month-page">
    <div class="big-header" style="background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary}); display: flex; justify-content: space-between; align-items: center;">
      <div class="month-name" style="display: flex; align-items: center;">
        ${imgHtmlBefore}<span>${MONTHS[month]}</span>${imgHtmlAfter}
      </div>
      <div class="year-text" style="display: flex; align-items: center;">${year}${yearImageSrc ? `<img src="${yearImageSrc}" style="height: 1.2em; vertical-align: middle; margin-left: 15px;" />` : ''}</div>
    </div>
    <div class="big-calendar">
      <div class="day-headers">`;

  dayHeaders.forEach((d, i) => {
    html += `<div>${d}</div>`;
  });

  html += `</div><div class="days-grid">`;

  for (let i = 0; i < firstDay; i++) {
    html += `<div class="day-cell empty"><span class="day-num"></span></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = (firstDay + day - 1) % 7;
    let cls = '';
    if (dayOfWeek === 0) cls = 'sunday';
    if (year === today.getFullYear() && month === today.getMonth() && day === today.getDate()) {
      cls = 'today';
    }
    
    const highlightInput = document.getElementById('highlightDateNum').value;
    const highlightColor = document.getElementById('highlightDateColor').value;
    const highlightDates = highlightInput.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));
    
    let styleStr = '';
    if (highlightDates.includes(day)) {
      styleStr = `color: ${highlightColor} !important;`;
    }
    
    html += `<div class="day-cell ${cls}"><span class="day-num" style="${styleStr}">${day}</span></div>`;
  }

  // Fill remaining cells to complete 6 rows (42 total)
  const totalFilled = firstDay + daysInMonth;
  for (let i = totalFilled; i < 42; i++) {
    html += `<div class="day-cell empty"><span class="day-num"></span></div>`;
  }

  html += `</div></div>`;

  const editorContent = document.getElementById('editorArea').innerHTML;
  const plainText = editorContent.replace(/<[^>]*>/g, '').trim();
  
  let finalEditorContent = editorContent;
  let isDefaultQuote = MONTH_QUOTES.includes(plainText) || plainText === 'Type your notes, holidays, events, or any custom text here...';
  if (isDefaultQuote) {
    finalEditorContent = `<p style="text-align:center; color:#64748b;">${MONTH_QUOTES[month]}</p>`;
  }

  if (plainText) {
    html += `<div class="notes-area"><strong>📝 Notes:</strong><br>${finalEditorContent}</div>`;
  }

  html += `</div>`;
  return html;
}

function renderLandscapeMonthPageHTML(year, month, startDay, theme) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month, startDay);
  const today = new Date();
  
  const editorHtml = document.getElementById('editorArea').innerHTML;
  const plainText = editorHtml.replace(/<[^>]*>/g, '').trim();
  
  let finalEditorContent = editorHtml;
  let isDefaultQuote = MONTH_QUOTES.includes(plainText) || plainText === 'Type your notes, holidays, events, or any custom text here...';
  if (isDefaultQuote) {
    finalEditorContent = `<p style="text-align:center; color:#64748b;">${MONTH_QUOTES[month]}</p>`;
  }
  
  const borderColor = theme.border || theme.primary;
  const textColor = theme.text || '#ffffff';
  const titleColor = (theme.primary === '#ffffff' || theme.name === 'Light Gray') ? '#000000' : theme.primary;
  
  let html = `<div class="landscape-month-page">`;
  
  const yearImgHtml = yearImageSrc ? `<img src="${yearImageSrc}" style="height: 0.8em; vertical-align: middle; margin-left: 10px;" />` : '';

  // Left Sidebar
  html += `<div class="landscape-sidebar" style="border: 2px solid ${borderColor};">
      <div class="ls-top">
         <div class="ls-year" style="color: ${titleColor};">${year}${yearImgHtml}</div>
      </div>
      <div class="ls-month-name" style="color: ${titleColor};">${MONTHS[month].substring(0,3).toUpperCase()}</div>
      ${sidebarMonthImageSrc ? `<div style="text-align: center; margin-bottom: 20px;"><img src="${sidebarMonthImageSrc}" style="max-width: 100%; max-height: 150px; border-radius: 8px;" /></div>` : ''}
      <div class="ls-notes">${finalEditorContent}</div>
  </div>`;
  
  // Grid
  html += `<div class="landscape-grid" style="border: 2px solid ${borderColor};">`;
  
  for (let c = 0; c < 7; c++) {
    const dayIndex = (c + startDay) % 7;
    const isSunday = dayIndex === 0;
    
    let headerColor = isSunday ? '#ef4444' : theme.primary; // red for sunday
    let headerText = isSunday ? '#ffffff' : textColor;
    
    html += `<div class="ls-col" style="border-right: 1px solid ${borderColor}; background: transparent; --dot-color: ${borderColor};">`;
    html += `<div class="ls-col-header" style="background: ${headerColor}; color: ${headerText};">${DAYS_FULL[dayIndex].toUpperCase()}</div>`;
    
    const highlightInput = document.getElementById('highlightDateNum').value;
    const highlightColor = document.getElementById('highlightDateColor').value;
    const highlightDates = highlightInput.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));
    
    // Now loop through 6 weeks
    for (let w = 0; w < 6; w++) {
       const cellPos = w * 7 + c;
       const dayNum = cellPos - firstDay + 1;
       if (dayNum > 0 && dayNum <= daysInMonth) {
          let color = isSunday ? '#ef4444' : 'var(--text)';
          if (highlightDates.includes(dayNum)) {
             color = highlightColor;
          }
          
          let isToday = (year === today.getFullYear() && month === today.getMonth() && dayNum === today.getDate());
          let extraStyle = isToday ? `background: linear-gradient(135deg, ${theme.primary}, ${theme.secondary || theme.primary}); color: white; border-radius: 12px; transform: scale(0.95);` : `color: ${color};`;
          
          html += `<div class="ls-cell" style="${extraStyle}"><span class="ls-day-num">${dayNum}</span></div>`;
       } else {
          html += `<div class="ls-cell empty"></div>`;
       }
    }
    html += `</div>`;
  }
  
  html += `</div></div>`;
  return html;
}

function hexToRgba(hex, alpha) {
  let r = 0, g = 0, b = 0;
  if (hex.length === 4) {
    r = parseInt(hex[1] + hex[1], 16);
    g = parseInt(hex[2] + hex[2], 16);
    b = parseInt(hex[3] + hex[3], 16);
  } else if (hex.length === 7) {
    r = parseInt(hex.substring(1, 3), 16);
    g = parseInt(hex.substring(3, 5), 16);
    b = parseInt(hex.substring(5, 7), 16);
  }
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function renderPreview() {
  const year = parseInt(document.getElementById('yearSelect').value);
  const format = document.getElementById('pageFormat').value;
  const startDay = parseInt(document.getElementById('startDay').value);
  const title = document.getElementById('calTitle').value || `Calendar ${year}`;

  const preview = document.getElementById('calendarPreview');
  preview.setAttribute('data-theme', currentTheme.name);
  
  const indicator = document.getElementById('pageIndicator');
  const navButtons = document.getElementById('navButtons');
  const btnGenerateAll = document.getElementById('btnGenerateAll');
  
  const bgOpacity = document.getElementById('bgOpacity') ? document.getElementById('bgOpacity').value : 1;
  const globalTextColor = document.getElementById('globalTextColor') ? document.getElementById('globalTextColor').value : '#1e293b';
  
  preview.style.backgroundColor = hexToRgba(currentTheme.bg, bgOpacity);
  preview.style.setProperty('--theme-text', currentTheme.text || 'white');
  preview.style.setProperty('--text', globalTextColor);

  if (currentTemplate.cols === -1) {
    preview.className = `calendar-page landscape page-${format}`;
    preview.innerHTML = renderLandscapeMonthPageHTML(year, previewMonthIndex, startDay, currentTheme);
    indicator.textContent = `Page ${previewMonthIndex + 1} of 12 — ${MONTHS[previewMonthIndex]} ${year}`;
    navButtons.style.display = 'flex';
    if (btnGenerateAll) btnGenerateAll.style.display = 'block';
    document.getElementById('prevMonthBtn').disabled = previewMonthIndex === 0;
    document.getElementById('nextMonthBtn').disabled = previewMonthIndex === 11;
    adjustMobileScale();
    return;
  }

  if (currentTemplate.cols === 0 || currentTemplate.cols === 1) {
    preview.className = `calendar-page page-${format}`;
    if (currentTemplate.cols === 1) {
      preview.classList.add('tpl-1col-new');
      preview.innerHTML = renderNew1ColMonthPageHTML(year, previewMonthIndex, startDay, currentTheme);
    } else {
      preview.innerHTML = renderSingleMonthPageHTML(year, previewMonthIndex, startDay, currentTheme);
    }
    indicator.textContent = `Page ${previewMonthIndex + 1} of 12 — ${MONTHS[previewMonthIndex]} ${year}`;
    navButtons.style.display = 'flex';
    if (btnGenerateAll) btnGenerateAll.style.display = 'block';
    document.getElementById('prevMonthBtn').disabled = previewMonthIndex === 0;
    document.getElementById('nextMonthBtn').disabled = previewMonthIndex === 11;
    adjustMobileScale();
    return;
  }

  preview.className = `calendar-page page-${format} ${currentTemplate.cls}`;
  indicator.textContent = '';
  navButtons.style.display = 'none';
  if (btnGenerateAll) btnGenerateAll.style.display = 'none';

  const editorContent = document.getElementById('editorArea').innerHTML;

  let html = `
    <div class="cal-header-bar" style="background: linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.secondary});">
      <h2>${title}</h2>
      <p>${year}</p>
    </div>
  `;

  if (editorContent.replace(/<[^>]*>/g, '').trim()) {
    html += `<div class="cal-user-text">${editorContent}</div>`;
  }

  const is4Col = currentTemplate.cols === 4;
  html += `<div class="cal-months-grid">`;
  for (let m = 0; m < 12; m++) {
    html += renderMonthHTML(year, m, startDay, currentTheme, is4Col);
  }
  html += `</div>`;

  preview.innerHTML = html;
  adjustMobileScale();
}

function adjustMobileScale() {
  const wrapper = document.querySelector('.preview-wrapper');
  const cal = document.getElementById('calendarPreview');
  if (!wrapper || !cal) return;
  
  if (window.innerWidth <= 1024) {
    cal.style.transform = 'none';
    wrapper.style.height = 'auto';
    
    const wrapperWidth = wrapper.clientWidth;
    const calWidth = cal.offsetWidth;
    const calHeight = cal.offsetHeight;
    
    if (calWidth > 0 && wrapperWidth > 0) {
      let scale = wrapperWidth / calWidth;
      scale = Math.min(scale, 1);
      
      cal.style.transform = `scale(${scale})`;
      cal.style.transformOrigin = 'top center';
      cal.style.marginBottom = '0';
      wrapper.style.height = `${calHeight * scale}px`;
    }
  } else {
    cal.style.transform = 'none';
    cal.style.marginBottom = '0';
    wrapper.style.height = 'auto';
  }
}

function changePreviewMonth(delta) {
  const oldIdx = previewMonthIndex;
  const newIdx = previewMonthIndex + delta;
  if (newIdx >= 0 && newIdx <= 11) {
    const editorHtml = document.getElementById('editorArea').innerHTML;
    const plainText = editorHtml.replace(/<[^>]*>/g, '').trim();
    
    previewMonthIndex = newIdx;
    
    if (!plainText || MONTH_QUOTES.includes(plainText) || plainText === 'Type your notes, holidays, events, or any custom text here...') {
       document.getElementById('editorArea').innerHTML = `<p style="text-align:center; color:#64748b;">${MONTH_QUOTES[newIdx]}</p>`;
    }
    
    renderPreview();
  }
}

function execCmd(command) {
  document.execCommand(command, false, null);
  document.getElementById('editorArea').focus();
}

function execCmdVal(command, value) {
  document.execCommand(command, false, value);
  document.getElementById('editorArea').focus();
}

// ===== PDF GENERATION =====
async function generatePDF() {
  const btn = document.getElementById('btnGenerate');
  const overlay = document.getElementById('loadingOverlay');
  const loadingText = document.getElementById('loadingText');

  btn.disabled = true;
  overlay.classList.add('show');
  loadingText.textContent = 'Generating your PDF calendar...';

  try {
    const year = parseInt(document.getElementById('yearSelect').value);
    const format = document.getElementById('pageFormat').value;
    const startDay = parseInt(document.getElementById('startDay').value);
    const title = document.getElementById('calTitle').value || `Calendar ${year}`;

    const pageSizes = {
      a4:      { w: 210, h: 297 },
      a3:      { w: 297, h: 420 },
      a5:      { w: 148, h: 210 },
      legal:   { w: 216, h: 356 },
      letter:  { w: 216, h: 279 },
      tabloid: { w: 279, h: 432 },
    };

    const { jsPDF } = window.jspdf;
    const size = pageSizes[format];
    
    const isLandscapeTemplate = currentTemplate.cols === -1;
    let orientation = size.w > size.h ? 'landscape' : 'portrait';
    let docW = size.w;
    let docH = size.h;
    
    if (isLandscapeTemplate) {
      orientation = 'landscape';
      docW = Math.max(size.w, size.h);
      docH = Math.min(size.w, size.h);
    }

    const doc = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: [docW, docH]
    });

    const previewEl = document.getElementById('calendarPreview');
    
    // Temporarily disable transform for high-quality capture
    const originalTransform = previewEl.style.transform;
    previewEl.style.transform = 'none';

    // Capture the exact HTML element
    const canvas = await html2canvas(previewEl, {
      scale: 3, // High-res capture
      useCORS: true,
      backgroundColor: null
    });

    previewEl.style.transform = originalTransform;

    const imgData = canvas.toDataURL('image/jpeg', 0.98);
    
    // Add image to fill the exact PDF page dimensions
    doc.addImage(imgData, 'JPEG', 0, 0, docW, docH);

    const monthName = (currentTemplate.cols === 0 || currentTemplate.cols === -1) ? `_${MONTHS[previewMonthIndex]}` : '';
    doc.save(`Calendar_${year}${monthName}_${currentTheme.name}_${format.toUpperCase()}.pdf`);
    showToast();

  } catch (err) {
    console.error(err);
    alert('Error generating PDF: ' + err.message);
  } finally {
    btn.disabled = false;
    overlay.classList.remove('show');
  }
}

async function generateAllMonthsPDF() {
  const btnAll = document.getElementById('btnGenerateAll');
  const btnGen = document.getElementById('btnGenerate');
  const overlay = document.getElementById('loadingOverlay');
  const loadingText = document.getElementById('loadingText');

  if (btnAll) btnAll.disabled = true;
  if (btnGen) btnGen.disabled = true;
  overlay.classList.add('show');
  
  try {
    const year = parseInt(document.getElementById('yearSelect').value);
    const format = document.getElementById('pageFormat').value;
    const startDay = parseInt(document.getElementById('startDay').value);

    const pageSizes = {
      a4:      { w: 210, h: 297 },
      a3:      { w: 297, h: 420 },
      a5:      { w: 148, h: 210 },
      legal:   { w: 216, h: 356 },
      letter:  { w: 216, h: 279 },
      tabloid: { w: 279, h: 432 },
    };

    const { jsPDF } = window.jspdf;
    const size = pageSizes[format];
    
    const isLandscapeTemplate = currentTemplate.cols === -1;
    let orientation = size.w > size.h ? 'landscape' : 'portrait';
    let docW = size.w;
    let docH = size.h;
    
    if (isLandscapeTemplate) {
      orientation = 'landscape';
      docW = Math.max(size.w, size.h);
      docH = Math.min(size.w, size.h);
    }

    const doc = new jsPDF({
      orientation: orientation,
      unit: 'mm',
      format: [docW, docH]
    });

    const previewEl = document.getElementById('calendarPreview');
    const originalTransform = previewEl.style.transform;
    previewEl.style.transform = 'none';
    
    const originalMonthIndex = previewMonthIndex;

    for (let m = 0; m < 12; m++) {
      loadingText.textContent = `Generating PDF: Month ${m + 1} of 12...`;
      
      if (isLandscapeTemplate) {
        previewEl.innerHTML = renderLandscapeMonthPageHTML(year, m, startDay, currentTheme);
      } else if (currentTemplate.cols === 1) {
        previewEl.innerHTML = renderNew1ColMonthPageHTML(year, m, startDay, currentTheme);
      } else {
        previewEl.innerHTML = renderSingleMonthPageHTML(year, m, startDay, currentTheme);
      }
      
      await new Promise(r => setTimeout(r, 50)); 

      const canvas = await html2canvas(previewEl, {
        scale: 3, 
        useCORS: true,
        backgroundColor: null
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      
      if (m > 0) {
        doc.addPage([docW, docH], orientation);
      }
      
      doc.addImage(imgData, 'JPEG', 0, 0, docW, docH);
    }

    previewMonthIndex = originalMonthIndex;
    renderPreview();
    previewEl.style.transform = originalTransform;

    doc.save(`Calendar_${year}_All_Months_${currentTheme.name}_${format.toUpperCase()}.pdf`);
    showToast();

  } catch (err) {
    console.error(err);
    alert('Error generating PDF: ' + err.message);
  } finally {
    if (btnAll) btnAll.disabled = false;
    if (btnGen) btnGen.disabled = false;
    overlay.classList.remove('show');
  }
}

function showToast() {
  const toast = document.getElementById('toast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3000);
}

function renderNew1ColMonthPageHTML(year, month, startDay, theme) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month, startDay);
  const today = new Date();
  
  const lightBg = hexToRgba(theme.primary, 0.15);
  
  const weeks = [];
  let currentWeek = Array(7).fill(null);
  for (let day = 1; day <= daysInMonth; day++) {
    const dayOfWeek = (firstDay + day - 1) % 7;
    currentWeek[dayOfWeek] = day;
    if (dayOfWeek === 6 || day === daysInMonth) {
      weeks.push(currentWeek);
      currentWeek = Array(7).fill(null);
    }
  }

  const monthNumStr = (month + 1).toString().padStart(2, '0');
  const monthNameStr = MONTHS[month].toUpperCase();
  
  let html = `<div class="tpl-1col-new-page" style="--primary: ${theme.primary}; --light-bg: ${lightBg};">`;
  
  html += `
    <div class="t1-header">
      <div class="t1-header-left">
        <div class="t1-month-name">${monthNameStr}</div>
      </div>
      <div class="t1-year">${year}</div>
    </div>
  `;
  
  html += `<div class="t1-grid" style="grid-template-columns: 90px repeat(${weeks.length}, 1fr);">`;
  
  const highlightInput = document.getElementById('highlightDateNum') ? document.getElementById('highlightDateNum').value : '';
  const highlightColor = document.getElementById('highlightDateColor') ? document.getElementById('highlightDateColor').value : '#ef4444';
  const highlightDates = highlightInput.split(',').map(d => parseInt(d.trim())).filter(d => !isNaN(d));

  for (let r = 0; r < 7; r++) {
    const dayName = DAYS_FULL[(r + startDay) % 7].substring(0,3).toUpperCase();
    html += `<div class="t1-day-label">${dayName}</div>`;
    
    for (let w = 0; w < weeks.length; w++) {
      const dayNum = weeks[w][r];
      if (dayNum) {
        let isToday = (year === today.getFullYear() && month === today.getMonth() && dayNum === today.getDate());
        let styleStr = '';
        let numStyle = '';
        if (isToday) {
           styleStr = `background: var(--primary); color: white;`;
        }
        if (highlightDates.includes(dayNum)) {
           numStyle = `color: ${highlightColor};`;
        }
        html += `<div class="t1-day-cell" style="${styleStr}">
                   <div class="t1-day-num" style="${numStyle}">${dayNum}</div>
                 </div>`;
      } else {
        html += `<div class="t1-day-cell empty"></div>`;
      }
    }
  }
  html += `</div>`;
  
  let prevMonth = month - 1;
  let prevYear = year;
  if (prevMonth < 0) { prevMonth = 11; prevYear--; }
  
  let nextMonth = month + 1;
  let nextYear = year;
  if (nextMonth > 11) { nextMonth = 0; nextYear++; }
  
  html += `
    <div class="t1-footer">
      <div class="t1-mini-cal">${renderMiniCal(prevYear, prevMonth, startDay, theme)}</div>
      <div class="t1-notes">
         <div class="t1-notes-title">NOTES</div>
         <div class="t1-notes-lines">
            <div></div><div></div><div></div><div></div><div></div>
         </div>
      </div>
      <div class="t1-mini-cal">${renderMiniCal(nextYear, nextMonth, startDay, theme)}</div>
    </div>
  `;
  
  html += `</div>`;
  return html;
}

function renderMiniCal(year, month, startDay, theme) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month, startDay);
  
  let html = `<div class="mini-cal-wrapper">`;
  html += `<div class="mini-cal-title">${MONTHS[month].toUpperCase()} ${year}</div>`;
  
  html += `<div class="mini-cal-grid">`;
  for (let i = 0; i < 7; i++) {
    html += `<div class="mini-cal-th">${DAYS_FULL[(i + startDay) % 7].substring(0,3).toUpperCase()}</div>`;
  }
  
  for (let i = 0; i < firstDay; i++) {
    html += `<div></div>`;
  }
  for (let day = 1; day <= daysInMonth; day++) {
    html += `<div class="mini-cal-td">${day}</div>`;
  }
  html += `</div></div>`;
  return html;
}

document.addEventListener('DOMContentLoaded', init);
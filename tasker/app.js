// Advanced Daily Planner with Multiple Lists, Modals, and Live Countdown
let lists = JSON.parse(localStorage.getItem('plannerLists') || '[]');
let currentEditingTask = null;
let currentEditingList = null;
let currentInlineBodyEditor = null;
let taskContentClickTimeout = null;
let countdownIntervals = new Map();
let taskPriorityState = new Map();
let taskUrgencyState = new Map();
let isColumnView = JSON.parse(localStorage.getItem('isColumnView')) || false;
const APP_VERSION = '1.2.7';
const DEFAULT_SETTINGS = {
  theme: 'light',
  isColumnView: false,
  localization: {
    dateFormat: 'iso',
    timeFormat: '24h'
  }
};
let appSettings = loadAppSettings();
isColumnView = appSettings.isColumnView;

function loadAppSettings() {
  const savedSettings = JSON.parse(localStorage.getItem('plannerSettings') || '{}');
  const savedTheme = localStorage.getItem('theme');
  const savedIsColumnView = JSON.parse(localStorage.getItem('isColumnView'));

  return {
    ...DEFAULT_SETTINGS,
    ...savedSettings,
    theme: savedTheme || savedSettings.theme || DEFAULT_SETTINGS.theme,
    isColumnView: typeof savedIsColumnView === 'boolean'
      ? savedIsColumnView
      : (typeof savedSettings.isColumnView === 'boolean' ? savedSettings.isColumnView : DEFAULT_SETTINGS.isColumnView),
    localization: {
      ...DEFAULT_SETTINGS.localization,
      ...(savedSettings.localization || {})
    }
  };
}

function saveAppSettings() {
  localStorage.setItem('plannerSettings', JSON.stringify(appSettings));
  localStorage.setItem('theme', appSettings.theme);
  localStorage.setItem('isColumnView', JSON.stringify(appSettings.isColumnView));
}

function formatDateForDisplay(dateValue) {
  if (!dateValue) return '';

  const [year, month, day] = dateValue.split('-');
  if (!year || !month || !day) return dateValue;

  switch (appSettings.localization.dateFormat) {
    case 'dmy':
      return `${day}.${month}.${year}`;
    case 'mdy':
      return `${month}/${day}/${year}`;
    case 'iso':
    default:
      return `${year}-${month}-${day}`;
  }
}

function formatTimeForDisplay(timeValue) {
  if (!timeValue) return '';

  const [hourRaw, minute] = timeValue.split(':');
  const hour = Number(hourRaw);
  if (Number.isNaN(hour) || !minute) return timeValue;

  if (appSettings.localization.timeFormat === '12h') {
    const suffix = hour >= 12 ? 'PM' : 'AM';
    const formattedHour = hour % 12 || 12;
    return `${formattedHour}:${minute} ${suffix}`;
  }

  return `${String(hour).padStart(2, '0')}:${minute}`;
}

function syncLocalizationControls() {
  const dateFormatSelect = document.getElementById('dateFormatSelect');
  const timeFormatSelect = document.getElementById('timeFormatSelect');

  if (dateFormatSelect) {
    dateFormatSelect.value = appSettings.localization.dateFormat;
  }

  if (timeFormatSelect) {
    timeFormatSelect.value = appSettings.localization.timeFormat;
  }
}

function handleLocalizationChange() {
  const dateFormatSelect = document.getElementById('dateFormatSelect');
  const timeFormatSelect = document.getElementById('timeFormatSelect');

  appSettings.localization.dateFormat = dateFormatSelect ? dateFormatSelect.value : DEFAULT_SETTINGS.localization.dateFormat;
  appSettings.localization.timeFormat = timeFormatSelect ? timeFormatSelect.value : DEFAULT_SETTINGS.localization.timeFormat;

  saveAppSettings();
  renderLists();
  showToast('Localization settings saved', 'success');
}

function switchSettingsTab(tabName) {
  const tabButtons = document.querySelectorAll('.settings-tab-btn');
  const tabPanels = document.querySelectorAll('.settings-tab-panel');

  tabButtons.forEach(button => {
    button.classList.toggle('active', button.getAttribute('data-tab') === tabName);
  });

  tabPanels.forEach(panel => {
    panel.classList.remove('active');
  });

  if (tabName === 'localisation') {
    document.getElementById('settingsLocalisationTab')?.classList.add('active');
  } else {
    document.getElementById('settingsDataTab')?.classList.add('active');
  }
}

// Toggle time inputs visibility
function toggleTimeInputs(button) {
  const form = button.closest('.list-form');
  const timeInputs = form.querySelector('.time-date-inputs');
  const isVisible = timeInputs.style.display !== 'none';

  if (isVisible) {
    timeInputs.style.display = 'none';
    button.classList.remove('active');
    button.title = 'Add time & date';
  } else {
    timeInputs.style.display = 'flex';
    button.classList.add('active');
    button.title = 'Hide time & date';
  }
}

// Toggle modal time inputs visibility
function toggleModalTimeInputs() {
  const timeInputs = document.querySelector('.modal-time-inputs');
  const toggleBtn = document.querySelector('#editTaskModal .time-toggle-btn');
  const isVisible = timeInputs.style.display !== 'none';

  if (isVisible) {
    timeInputs.style.display = 'none';
    toggleBtn.classList.remove('active');
    toggleBtn.title = 'Add time & date';
  } else {
    timeInputs.style.display = 'flex';
    toggleBtn.classList.add('active');
    toggleBtn.title = 'Hide time & date';
  }
}

// Settings modal functions
function showSettingsModal() {
  document.getElementById('settingsModal').style.display = 'block';
  switchSettingsTab('data');
  syncLocalizationControls();
}

function closeSettingsModal() {
  document.getElementById('settingsModal').style.display = 'none';
}

// Export data function
function exportData() {
  const data = {
    lists: lists,
    settings: appSettings,
    exportDate: new Date().toISOString(),
    version: APP_VERSION
  };

  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });

  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `tasker-backup-${new Date().toISOString().split('T')[0]}.json`;
  link.click();

  URL.revokeObjectURL(link.href);
  showToast('Data exported successfully!', 'success');
}

// Import data function
function importData() {
  document.getElementById('importFileInput').click();
}

function handleFileImport(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const data = JSON.parse(e.target.result);

      if (data.lists && Array.isArray(data.lists)) {
        const confirmImport = confirm('This will replace all your current data and settings. Are you sure you want to continue?');

        if (confirmImport) {
          // Import lists
          lists = data.lists;
          saveLists();

          // Import settings if available
          if (data.settings) {
            appSettings = {
              ...DEFAULT_SETTINGS,
              ...data.settings,
              localization: {
                ...DEFAULT_SETTINGS.localization,
                ...(data.settings.localization || {})
              }
            };
            isColumnView = appSettings.isColumnView;
            saveAppSettings();
            initializeTheme();
            initializeView();
            syncLocalizationControls();
          }

          renderLists();
          closeSettingsModal();
          showToast('Data and settings imported successfully!', 'success');
        }
      } else {
        showToast('Invalid file format. Please select a valid backup file.', 'error');
      }
    } catch (error) {
      showToast('Error reading file. Please make sure it\'s a valid JSON file.', 'error');
    }
  };

  reader.readAsText(file);
  event.target.value = ''; // Reset file input
}

// View toggle function
function toggleView() {
  isColumnView = !isColumnView;
  appSettings.isColumnView = isColumnView;
  saveAppSettings();

  const container = document.getElementById('listsContainer');
  const toggleBtn = document.getElementById('viewToggleBtn');

  if (isColumnView) {
    container.classList.add('column-view');
    toggleBtn.title = 'Switch to row view';
    toggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    `;
  } else {
    container.classList.remove('column-view');
    toggleBtn.title = 'Switch to column view';
    toggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
      </svg>
    `;
  }

  renderLists();
}

// Modal functions
function showAddListModal() {
  document.getElementById('addListModal').style.display = 'block';
  document.getElementById('newListName').focus();
}

function closeAddListModal() {
  document.getElementById('addListModal').style.display = 'none';
  document.getElementById('addListForm').reset();
}

function showEditListModal(list) {
  currentEditingList = list;
  document.getElementById('editListModal').style.display = 'block';
  document.getElementById('editListName').value = list.name;
  document.getElementById('editListDate').value = list.date || '';
  document.getElementById('editListTime').value = list.time || '';
  document.getElementById('editListDescription').value = list.description || '';
  document.getElementById('editListName').focus();
}

function closeEditListModal() {
  document.getElementById('editListModal').style.display = 'none';
  document.getElementById('editListForm').reset();
  currentEditingList = null;
}

function showEditTaskModal(task, listId, taskId) {
  currentEditingTask = { listId, taskId, task };
  document.getElementById('editTaskModal').style.display = 'block';
  document.getElementById('editTaskText').value = task.text;
  document.getElementById('editTaskTime').value = task.time || '';
  document.getElementById('editTaskDate').value = task.date || '';

  // Show time inputs if task has time or date
  const timeInputs = document.querySelector('.modal-time-inputs');
  const toggleBtn = document.querySelector('#editTaskModal .time-toggle-btn');
  if (task.time || task.date) {
    timeInputs.style.display = 'flex';
    toggleBtn.classList.add('active');
    toggleBtn.title = 'Hide time & date';
  } else {
    timeInputs.style.display = 'none';
    toggleBtn.classList.remove('active');
    toggleBtn.title = 'Add time & date';
  }

  document.getElementById('editTaskText').focus();
}

function closeEditTaskModal() {
  document.getElementById('editTaskModal').style.display = 'none';
  document.getElementById('editTaskForm').reset();
  currentEditingTask = null;
}

// Save to localStorage
function saveLists() {
  localStorage.setItem('plannerLists', JSON.stringify(lists));
}

function escapeHtml(text) {
  return String(text ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatInlineMarkup(text) {
  const escapedText = escapeHtml(text);
  return escapedText
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/(^|[\s>])((https?:\/\/)[^\s<]+)/g, '$1<a href="$2" target="_blank" rel="noopener noreferrer">$2</a>');
}

function parseTaskText(taskText) {
  const normalizedText = String(taskText || '').replace(/\r\n/g, '\n');
  const lines = normalizedText.split('\n');
  const title = (lines[0] || '').trim();
  const body = lines.slice(1).join('\n').trim();
  const hasBody = body.length > 0;
  const hasAnyText = normalizedText.trim().length > 0;

  return {
    title: title || (hasAnyText ? 'Untitled task' : 'Empty task'),
    body,
    hasBody,
    hasAnyText
  };
}

function buildTaskTextFromTitleAndBody(title, body) {
  const safeTitle = String(title || '').trim();
  const safeBody = String(body || '').trim();

  if (!safeBody) {
    return safeTitle;
  }

  return `${safeTitle}\n${safeBody}`;
}

function findTaskByIds(listId, taskId) {
  const list = lists.find(l => l.id === listId);
  if (!list) return { list: null, task: null };
  const task = list.tasks.find(t => t.id === taskId);
  return { list, task: task || null };
}

function autoResizeTaskBodyInput(textarea) {
  if (!textarea) return;
  textarea.style.height = 'auto';
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function openInlineBodyEditor(listId, taskId) {
  if (currentInlineBodyEditor && (currentInlineBodyEditor.listId !== listId || currentInlineBodyEditor.taskId !== taskId)) {
    closeInlineBodyEditor({ collapseAfterSave: true });
  }

  const { task } = findTaskByIds(listId, taskId);
  if (!task) return;

  task.expanded = true;
  currentInlineBodyEditor = { listId, taskId };
  saveLists();
  renderLists();

  setTimeout(() => {
    const textarea = document.getElementById(`task-body-input-${listId}-${taskId}`);
    if (textarea) {
      autoResizeTaskBodyInput(textarea);
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  }, 0);
}

function closeInlineBodyEditor({ collapseAfterSave = true } = {}) {
  if (!currentInlineBodyEditor) return;

  const { listId, taskId } = currentInlineBodyEditor;
  const { task } = findTaskByIds(listId, taskId);

  if (!task) {
    currentInlineBodyEditor = null;
    return;
  }

  const textarea = document.getElementById(`task-body-input-${listId}-${taskId}`);
  const nextBody = textarea ? textarea.value : parseTaskText(task.text).body;
  const currentParsed = parseTaskText(task.text);
  task.text = buildTaskTextFromTitleAndBody(currentParsed.title, nextBody);
  task.expanded = collapseAfterSave ? false : Boolean(task.expanded);

  currentInlineBodyEditor = null;
  saveLists();
  renderLists();
}

function renderTaskBodyMarkup(bodyText) {
  const lines = bodyText.replace(/\r\n/g, '\n').split('\n');
  let html = '';
  let listType = null; // 'ul' or 'ol'

  lines.forEach(line => {
    const trimmedLine = line.trim();

    // Bullet list items (- item or * item)
    const ulMatch = /^[-*]\s+(.+)$/.exec(trimmedLine);
    // Ordered list items (1. item, 2. item, etc.)
    const olMatch = /^\d+\.\s+(.+)$/.exec(trimmedLine);

    if (ulMatch) {
      if (listType !== 'ul') {
        if (listType) html += `</${listType}>`;
        html += '<ul>';
        listType = 'ul';
      }
      html += `<li>${formatInlineMarkup(ulMatch[1])}</li>`;
      return;
    }

    if (olMatch) {
      if (listType !== 'ol') {
        if (listType) html += `</${listType}>`;
        html += '<ol>';
        listType = 'ol';
      }
      html += `<li>${formatInlineMarkup(olMatch[1])}</li>`;
      return;
    }

    if (listType) {
      html += `</${listType}>`;
      listType = null;
    }

    // Line divider (--- or *** or ___)
    if (/^[-*_]{3,}$/.test(trimmedLine)) {
      html += '<hr>';
      return;
    }

    // Headings (h3 must be checked before h2)
    const h3Match = /^###\s+(.+)$/.exec(trimmedLine);
    if (h3Match) {
      html += `<h3>${formatInlineMarkup(h3Match[1])}</h3>`;
      return;
    }

    const h2Match = /^##\s+(.+)$/.exec(trimmedLine);
    if (h2Match) {
      html += `<h2>${formatInlineMarkup(h2Match[1])}</h2>`;
      return;
    }

    // Empty line
    if (trimmedLine === '') {
      html += '<br>';
      return;
    }

    // Regular paragraph
    html += `<p>${formatInlineMarkup(trimmedLine)}</p>`;
  });

  if (listType) {
    html += `</${listType}>`;
  }

  return html;
}

// Create countdown timer for lists
function createListCountdownTimer(list) {
  if (!list.time || !list.date) return null;

  const now = new Date();
  const listDate = new Date(list.date + 'T' + list.time);
  const diff = listDate - now;

  if (diff <= 0) {
    return { label: 'Due!', className: 'due' };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);

  if (totalMinutes <= 5) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      label: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      className: 'danger'
    };
  }

  if (totalMinutes <= 10) {
    return { label: `${totalMinutes}m`, className: 'danger' };
  }

  if (totalMinutes <= 20) {
    return { label: `${totalMinutes}m`, className: 'warning' };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 1) {
    return { label: `${minutes}m`, className: '' };
  }

  if (hours < 24) {
    return { label: `${hours}h ${minutes}m`, className: '' };
  }

  const days = Math.floor(hours / 24);
  return { label: `${days}d ${hours % 24}h`, className: '' };
}

// Create countdown timer
function createCountdownTimer(task) {
  if (task.done) return null;
  if (!task.time || !task.date) return null;

  const now = new Date();
  const taskDate = new Date(task.date + 'T' + task.time);
  const diff = taskDate - now;

  if (diff <= 0) {
    return {
      label: 'Due!',
      className: 'due'
    };
  }

  const totalSeconds = Math.floor(diff / 1000);
  const totalMinutes = Math.floor(totalSeconds / 60);

  if (totalMinutes <= 5) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return {
      label: `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`,
      className: 'danger final'
    };
  }

  if (totalMinutes <= 10) {
    return {
      label: `${totalMinutes}m`,
      className: 'danger'
    };
  }

  if (totalMinutes <= 20) {
    return {
      label: `${totalMinutes}m`,
      className: 'warning'
    };
  }

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours < 1) {
    return {
      label: `${minutes}m`,
      className: ''
    };
  }

  if (hours < 24) {
    return {
      label: `${hours}h ${minutes}m`,
      className: ''
    };
  }

  const days = Math.floor(hours / 24);
  return {
    label: `${days}d ${hours % 24}h`,
    className: ''
  };
}

function getTaskUrgencyClass(task) {
  const countdown = createCountdownTimer(task);
  if (!countdown) return '';

  if (countdown.className.includes('danger')) {
    return 'task-urgent-danger';
  }

  if (countdown.className.includes('warning')) {
    return 'task-urgent-warning';
  }

  return '';
}

function getTaskRemainingMs(task, now = new Date()) {
  if (!task.time || !task.date) return null;
  const taskDate = new Date(task.date + 'T' + task.time);
  return taskDate - now;
}

function isTaskTimed(task) {
  return Boolean(task.time || task.date);
}

function isTaskUrgent(task, now = new Date()) {
  if (task.done) return false;
  const remainingMs = getTaskRemainingMs(task, now);
  return remainingMs !== null && remainingMs <= 20 * 60 * 1000;
}

function getListStats(list) {
  const now = new Date();
  const total = list.tasks.length;
  const finished = list.tasks.filter(task => task.done).length;
  const timed = list.tasks.filter(isTaskTimed).length;
  const urgent = list.tasks.filter(task => isTaskUrgent(task, now)).length;

  return { total, finished, timed, urgent };
}

function renderCollapsedListStats(list) {
  const stats = getListStats(list);

  return `
    <div class="list-collapsed-stats" aria-label="List stats">
      <span class="list-collapsed-stat" title="Total tasks">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <circle cx="4" cy="6" r="1"></circle>
          <circle cx="4" cy="12" r="1"></circle>
          <circle cx="4" cy="18" r="1"></circle>
        </svg>
        <span>${stats.total}</span>
      </span>
      <span class="list-collapsed-stat" title="Finished tasks">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <polyline points="20 6 9 17 4 12"></polyline>
        </svg>
        <span>${stats.finished}</span>
      </span>
      <span class="list-collapsed-stat" title="Timed tasks">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <circle cx="12" cy="12" r="9"></circle>
          <polyline points="12 7 12 12 15 14"></polyline>
        </svg>
        <span>${stats.timed}</span>
      </span>
      <span class="list-collapsed-stat" title="Urgent tasks">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <path d="M12 9v4"></path>
          <circle cx="12" cy="17" r="1"></circle>
          <path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0z"></path>
        </svg>
        <span>${stats.urgent}</span>
      </span>
    </div>
  `;
}

// Update countdown timers
function updateCountdowns() {
  let shouldRerender = false;

  // Update list-level countdowns
  lists.forEach(list => {
    if (list.time && list.date) {
      const element = document.getElementById(`list-countdown-${list.id}`);
      if (element) {
        const countdown = createListCountdownTimer(list);
        if (countdown) {
          element.textContent = countdown.label;
          element.className = `list-countdown ${countdown.className}`.trim();
        }
      }
    }
  });

  lists.forEach(list => {
    list.tasks.forEach(task => {
      const timerId = `${list.id}-${task.id}`;
      const taskItemElement = document.querySelector(`.list-task-item[data-list-id="${list.id}"][data-task-id="${task.id}"]`);
      const remainingMs = getTaskRemainingMs(task);
      const isPriorityWithinHour = Boolean(!task.done && remainingMs !== null && remainingMs <= 60 * 60 * 1000);
      const isUrgent = Boolean(!task.done && remainingMs !== null && remainingMs <= 20 * 60 * 1000);
      const previousPriorityWithinHour = taskPriorityState.get(timerId);
      const previousUrgent = taskUrgencyState.get(timerId);

      if (previousPriorityWithinHour !== undefined && previousPriorityWithinHour !== isPriorityWithinHour) {
        shouldRerender = true;
      }

      if (previousUrgent !== undefined && previousUrgent !== isUrgent) {
        shouldRerender = true;
      }

      taskPriorityState.set(timerId, isPriorityWithinHour);
      taskUrgencyState.set(timerId, isUrgent);

      if (taskItemElement) {
        taskItemElement.classList.remove('task-urgent-warning', 'task-urgent-danger');
      }

      if (task.time && task.date) {
        const element = document.getElementById(`countdown-${timerId}`);
        if (element) {
          const countdown = createCountdownTimer(task);
          if (!countdown) {
            element.textContent = '';
            element.className = 'countdown-timer';
            return;
          }

          element.textContent = countdown.label;
          element.className = `countdown-timer ${countdown.className}`.trim();

          if (taskItemElement) {
            if (countdown.className.includes('danger')) {
              taskItemElement.classList.add('task-urgent-danger');
            } else if (countdown.className.includes('warning')) {
              taskItemElement.classList.add('task-urgent-warning');
            }
          }
        }
      }
    });
  });

  if (shouldRerender) {
    renderLists();
  }
}

// Get column count based on viewport width and column view state
function getColumnCount() {
  if (!isColumnView) return 1;
  const width = window.innerWidth;
  if (width < 768) return 1;
  if (width >= 2560) return 4;
  if (width >= 1920) return 3;
  return 2;
}

// Render all lists
function renderLists() {
  const container = document.getElementById('listsContainer');
  container.innerHTML = '';

  if (lists.length === 0) {
    container.innerHTML = `
      <div class="empty-list">
        <p>No lists yet. Click "+ New List" to create your first list!</p>
      </div>
    `;
    return;
  }

  const columnCount = getColumnCount();
  let columnWrappers = [];

  if (isColumnView && columnCount > 1) {
    for (let i = 0; i < columnCount; i++) {
      const wrapper = document.createElement('div');
      wrapper.className = 'column-wrapper';
      container.appendChild(wrapper);
      columnWrappers.push(wrapper);
    }
  }

  lists.forEach((list, index) => {
    const listCard = document.createElement('div');
    listCard.className = `list-card ${list.collapsed ? 'collapsed' : ''}`;
    listCard.setAttribute('data-list-id', list.id);
    listCard.setAttribute('draggable', 'true');
    console.log(`Rendering list ${list.id} with classes: ${listCard.className}`);

    // Apply initial collapsed state
    if (list.collapsed) {
      setTimeout(() => {
        const listContent = listCard.querySelector('.list-content');
        if (listContent) {
          listContent.style.display = 'none';
        }
      }, 0);
    }
    const listDateDisplay = list.date ? formatDateForDisplay(list.date) : '';
    const listTimeDisplay = list.time ? formatTimeForDisplay(list.time) : '';
    const listCountdown = createListCountdownTimer(list);
    const listCountdownHtml = listCountdown
      ? `<span id="list-countdown-${list.id}" class="list-countdown ${listCountdown.className}">${listCountdown.label}</span>`
      : '';
    const listDateTimeHtml = (listDateDisplay || listTimeDisplay)
      ? `<div class="list-date">${listDateDisplay}${listDateDisplay && listTimeDisplay ? ' ' : ''}${listTimeDisplay}${listCountdownHtml ? ' ' + listCountdownHtml : ''}</div>`
      : (listCountdownHtml ? `<div class="list-date">${listCountdownHtml}</div>` : '');
    listCard.innerHTML = `
      <div class="list-header">
        <div class="list-meta">
          <h3 class="list-title">${list.name}</h3>
          ${listDateTimeHtml}
        </div>
        <div class="list-actions-right">
          ${list.collapsed ? renderCollapsedListStats(list) : ''}
          <button class="list-collapse-btn" title="${list.collapsed ? 'Expand' : 'Collapse'} List">
            <svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="6 9 12 15 18 9"/>
            </svg>
          </button>
          <div class="list-menu-container">
            <button class="icon-btn list-menu" title="More options">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
            <div class="list-menu-dropdown">
              <button class="menu-item list-edit" title="Edit List">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit
              </button>
              <button class="menu-item list-delete" title="Delete List">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
      ${list.description ? `<div class="list-description">${escapeHtml(list.description)}</div>` : ''}
      <div class="list-content">
        <form class="list-form" onsubmit="addTask(event, '${list.id}')">
          <input type="text" placeholder="Add task..." required>
          <div class="time-date-inputs" style="display: none;">
            <input type="time" placeholder="Time">
            <input type="date" placeholder="Date">
          </div>
          <button type="button" class="time-toggle-btn" onclick="toggleTimeInputs(this)" title="Add time & date">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12,6 12,12 16,14"/>
            </svg>
          </button>
          <button type="submit">+</button>
        </form>
        <ul class="list-tasks">
          ${renderTasks(list)}
        </ul>
      </div>
    `;

    // Event handlers are now managed by event delegation

    // Add drag event handlers for list reordering
    listCard.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('text/plain', list.id);
      e.dataTransfer.setData('application/x-list-id', list.id);
      listCard.classList.add('dragging');
    });

    listCard.addEventListener('dragend', (e) => {
      listCard.classList.remove('dragging');
    });

    listCard.addEventListener('dragover', (e) => {
      e.preventDefault();
      const draggingList = document.querySelector('.list-card.dragging');
      if (draggingList && draggingList !== listCard) {
        const rect = listCard.getBoundingClientRect();
        const midY = rect.top + rect.height / 2;
        if (e.clientY < midY) {
          listCard.classList.add('drag-over-top');
          listCard.classList.remove('drag-over-bottom');
        } else {
          listCard.classList.add('drag-over-bottom');
          listCard.classList.remove('drag-over-top');
        }
      }
    });

    listCard.addEventListener('dragleave', (e) => {
      listCard.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    listCard.addEventListener('drop', (e) => {
      e.preventDefault();
      const draggedListId = e.dataTransfer.getData('application/x-list-id');
      if (draggedListId && draggedListId !== list.id) {
        reorderLists(draggedListId, list.id, listCard.classList.contains('drag-over-bottom'));
      }
      listCard.classList.remove('drag-over-top', 'drag-over-bottom');
    });

    if (isColumnView && columnCount > 1) {
      columnWrappers[index % columnCount].appendChild(listCard);
    } else {
      container.appendChild(listCard);
    }

    // Add task drag event handlers
    const taskItems = listCard.querySelectorAll('.list-task-item');
    taskItems.forEach(taskItem => {
      taskItem.addEventListener('dragstart', (e) => {
        const taskId = taskItem.getAttribute('data-task-id');
        const listId = taskItem.getAttribute('data-list-id');
        e.dataTransfer.setData('text/plain', `${listId}:${taskId}`);
        e.dataTransfer.setData('application/x-task-data', JSON.stringify({taskId, listId}));
        taskItem.classList.add('dragging');
        e.stopPropagation();
      });

      taskItem.addEventListener('dragend', (e) => {
        taskItem.classList.remove('dragging');
      });

      taskItem.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const draggingTask = document.querySelector('.list-task-item.dragging');
        if (draggingTask && draggingTask !== taskItem) {
          const rect = taskItem.getBoundingClientRect();
          const midY = rect.top + rect.height / 2;
          if (e.clientY < midY) {
            taskItem.classList.add('drag-over-top');
            taskItem.classList.remove('drag-over-bottom');
          } else {
            taskItem.classList.add('drag-over-bottom');
            taskItem.classList.remove('drag-over-top');
          }
        }
      });

      taskItem.addEventListener('dragleave', (e) => {
        taskItem.classList.remove('drag-over-top', 'drag-over-bottom');
      });

      taskItem.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const taskData = e.dataTransfer.getData('application/x-task-data');
        if (taskData) {
          const {taskId: draggedTaskId, listId: draggedListId} = JSON.parse(taskData);
          const targetTaskId = taskItem.getAttribute('data-task-id');
          const targetListId = taskItem.getAttribute('data-list-id');
          if (draggedTaskId !== targetTaskId) {
            reorderTasks(draggedListId, draggedTaskId, targetTaskId, targetListId, taskItem.classList.contains('drag-over-bottom'));
          }
        }
        taskItem.classList.remove('drag-over-top', 'drag-over-bottom');
      });
    });

    // Add drag event handlers for empty lists
    const emptyList = listCard.querySelector('.empty-list');
    if (emptyList) {
      emptyList.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const draggingTask = document.querySelector('.list-task-item.dragging');
        if (draggingTask) {
          emptyList.classList.add('drag-over');
        }
      });

      emptyList.addEventListener('dragleave', (e) => {
        emptyList.classList.remove('drag-over');
      });

      emptyList.addEventListener('drop', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const taskData = e.dataTransfer.getData('application/x-task-data');
        if (taskData) {
          const {taskId: draggedTaskId, listId: draggedListId} = JSON.parse(taskData);
          const targetListId = emptyList.getAttribute('data-list-id');
          if (draggedListId !== targetListId) {
            moveTaskToEmptyList(draggedListId, draggedTaskId, targetListId);
          }
        }
        emptyList.classList.remove('drag-over');
      });
    }
  });

  startCountdownUpdates();
}

// Render tasks for a list
function renderTasks(list) {
  if (list.tasks.length === 0) {
    return `<div class="empty-list" data-list-id="${list.id}">No tasks yet. Add your first task!</div>`;
  }

  const activeTasks = list.tasks.filter(task => !task.done);
  const finishedTasks = list.tasks.filter(task => task.done);
  const now = new Date();

  const prioritizedTimedTasks = activeTasks
    .filter(task => {
      const remainingMs = getTaskRemainingMs(task, now);
      return remainingMs !== null && remainingMs <= 60 * 60 * 1000;
    })
    .sort((a, b) => {
      const aRemaining = getTaskRemainingMs(a, now) ?? Number.MAX_SAFE_INTEGER;
      const bRemaining = getTaskRemainingMs(b, now) ?? Number.MAX_SAFE_INTEGER;
      return aRemaining - bRemaining;
    });

  const prioritizedTaskIds = new Set(prioritizedTimedTasks.map(task => task.id));
  const regularActiveTasks = activeTasks.filter(task => !prioritizedTaskIds.has(task.id));
  const orderedActiveTasks = [...prioritizedTimedTasks, ...regularActiveTasks];

  const renderTaskItem = (task) => {
    const timerId = `${list.id}-${task.id}`;
    const countdown = createCountdownTimer(task);
    const urgencyClass = getTaskUrgencyClass(task);
    const parsedTask = parseTaskText(task.text);
    const isExpanded = Boolean(task.expanded) && parsedTask.hasBody;
    const isInlineEditing = Boolean(
      currentInlineBodyEditor
      && currentInlineBodyEditor.listId === list.id
      && currentInlineBodyEditor.taskId === task.id
    );
    const taskBodyMarkup = parsedTask.hasBody ? renderTaskBodyMarkup(parsedTask.body) : '';

    return `
      <li class="list-task-item ${task.done ? 'done' : ''} ${urgencyClass}" draggable="true" data-task-id="${task.id}" data-list-id="${list.id}">
        <input type="checkbox" ${task.done ? 'checked' : ''}
               onchange="toggleTask('${list.id}', '${task.id}')">
        <div class="task-main">
          <div class="task-content ${parsedTask.hasBody ? 'has-body' : 'is-empty-body'}" data-task-id="${task.id}" data-list-id="${list.id}" data-has-body="${parsedTask.hasBody}">
            <div class="task-title-row">
              <span class="task-title">${escapeHtml(parsedTask.title)}</span>
              ${parsedTask.hasBody ? '<span class="task-detail-marker" title="Has details"></span>' : ''}
            </div>
          </div>
        </div>
        <div class="task-meta">
          ${task.date ? `<span class="task-time">${formatDateForDisplay(task.date)}</span>` : ''}
          ${task.time ? `<span class="task-time">${formatTimeForDisplay(task.time)}</span>` : ''}
          ${countdown ? `<span id="countdown-${timerId}" class="countdown-timer ${countdown.className}">${countdown.label}</span>` : ''}
        </div>
        <div class="task-actions">
          <div class="task-menu-container">
            <button class="icon-btn task-menu" title="More options" data-task-id="${task.id}" data-list-id="${list.id}">
              <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="1"/>
                <circle cx="12" cy="5" r="1"/>
                <circle cx="12" cy="19" r="1"/>
              </svg>
            </button>
            <div class="task-menu-dropdown">
              <button class="menu-item task-edit" title="Edit Task" data-task-id="${task.id}" data-list-id="${list.id}">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
                </svg>
                Edit
              </button>
              <button class="menu-item task-reminder" title="Set Reminder" data-task-id="${task.id}" data-list-id="${list.id}">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
                </svg>
                Reminder
              </button>
              <button class="menu-item task-delete" title="Delete Task" data-task-id="${task.id}" data-list-id="${list.id}">
                <svg class="icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
                </svg>
                Delete
              </button>
            </div>
          </div>
        </div>
        ${task.done ? '<span class="task-finished-badge">Done</span>' : ''}
        ${(parsedTask.hasBody || isInlineEditing) ? `
          <div class="task-body-wrapper ${(isExpanded || isInlineEditing) ? 'expanded' : ''}" data-task-id="${task.id}" data-list-id="${list.id}">
            <div class="task-body expanded">
              ${isInlineEditing
                ? `<textarea id="task-body-input-${list.id}-${task.id}" class="task-body-input" placeholder="Add details...">${escapeHtml(parsedTask.body)}</textarea>`
                : taskBodyMarkup}
            </div>
          </div>
        ` : ''}
      </li>
    `;
  };

  const activeMarkup = orderedActiveTasks.map(renderTaskItem).join('');
  const finishedMarkup = finishedTasks.map(renderTaskItem).join('');
  const finishedCollapsed = Boolean(list.finishedCollapsed);
  const finishedDivider = finishedTasks.length > 0
    ? `
      <li class="finished-tasks-divider">
        <button type="button" class="finished-toggle-btn ${finishedCollapsed ? 'is-collapsed' : ''}" data-list-id="${list.id}" title="${finishedCollapsed ? 'Expand finished tasks' : 'Collapse finished tasks'}">
          <span>Finished tasks (${finishedTasks.length})</span>
          <span class="finished-toggle-chevron">▾</span>
        </button>
      </li>
    `
    : '';

  return `${activeMarkup}${finishedDivider}${finishedCollapsed ? '' : finishedMarkup}`;
}

// Add new list
function addList(event) {
  event.preventDefault();
  const name = event.target.elements[0].value.trim();
  const date = event.target.elements[1].value;
  const time = event.target.elements[2].value;
  const description = event.target.elements[3].value.trim();

  if (name) {
    const newList = {
      id: Date.now().toString(),
      name: name,
      date: date,
      time: time || '',
      description: description,
      collapsed: false,
      finishedCollapsed: false,
      tasks: []
    };
    lists.push(newList);
    saveLists();
    renderLists();
    closeAddListModal();
  }
}

// Save edited list
function saveEditedList(event) {
  event.preventDefault();
  if (!currentEditingList) return;

  const name = document.getElementById('editListName').value.trim();
  const date = document.getElementById('editListDate').value;
  const time = document.getElementById('editListTime').value;
  const description = document.getElementById('editListDescription').value.trim();

  if (name) {
    currentEditingList.name = name;
    currentEditingList.date = date;
    currentEditingList.time = time || '';
    currentEditingList.description = description;
    saveLists();
    renderLists();
    closeEditListModal();
  }
}

// Add task to list
function addTask(event, listId) {
  event.preventDefault();
  const form = event.target;
  const text = form.elements[0].value.trim();
  const time = form.elements[1].value;
  const date = form.elements[2].value;

  if (text) {
    const list = lists.find(l => l.id === listId);
    if (list) {
      const newTask = {
        id: Date.now().toString(),
        text: text,
        time: time,
        date: date,
        expanded: false,
        done: false
      };
      list.tasks.push(newTask);
      saveLists();
      renderLists();
      form.reset();
    }
  }
}

// Toggle task completion
function toggleTask(listId, taskId) {
  const list = lists.find(l => l.id === listId);
  if (list) {
    const task = list.tasks.find(t => t.id === taskId);
    if (task) {
      task.done = !task.done;
      saveLists();
      renderLists();
    }
  }
}

// Edit task
function editTask(listId, taskId) {
  if (currentInlineBodyEditor) {
    closeInlineBodyEditor({ collapseAfterSave: false });
  }

  const list = lists.find(l => l.id === listId);
  if (list) {
    const task = list.tasks.find(t => t.id === taskId);
    if (task) {
      showEditTaskModal(task, listId, taskId);
    }
  }
}

// Save edited task
function saveEditedTask(event) {
  event.preventDefault();
  if (!currentEditingTask) return;

  const { listId, taskId } = currentEditingTask;
  const text = document.getElementById('editTaskText').value.trim();
  const time = document.getElementById('editTaskTime').value;
  const date = document.getElementById('editTaskDate').value;

  if (text) {
    const list = lists.find(l => l.id === listId);
    if (list) {
      const task = list.tasks.find(t => t.id === taskId);
      if (task) {
        task.text = text;
        task.time = time;
        task.date = date;
        if (!parseTaskText(text).hasBody) {
          task.expanded = false;
        }
        saveLists();
        renderLists();
        closeEditTaskModal();
      }
    }
  }
}

// Delete task
function deleteTask(listId, taskId) {
  const list = lists.find(l => l.id === listId);
  if (!list) return;

  const task = list.tasks.find(t => t.id === taskId);
  if (!task) return;

  // Create confirmation toast with action buttons
  showConfirmationToast(
    `Delete task "${task.text}"?`,
    () => {
      list.tasks = list.tasks.filter(t => t.id !== taskId);
      saveLists();
      renderLists();
      showToast('Task deleted successfully', 'success');
    },
    () => {}
  );
}

// Toggle list collapse
function toggleListCollapse(listId) {
  const list = lists.find(l => l.id === listId);
  if (list) {
    list.collapsed = !list.collapsed;
    saveLists();
    renderLists();
  }
}

function toggleTaskExpanded(listId, taskId) {
  const list = lists.find(l => l.id === listId);
  if (!list) return;

  const task = list.tasks.find(t => t.id === taskId);
  if (!task) return;

  if (!parseTaskText(task.text).hasBody) return;

  task.expanded = !Boolean(task.expanded);
  saveLists();
  renderLists();
}

function toggleFinishedTasks(listId) {
  const list = lists.find(l => l.id === listId);
  if (!list) return;

  list.finishedCollapsed = !Boolean(list.finishedCollapsed);
  saveLists();
  renderLists();
}

// Edit list
function editList(listId) {
  const list = lists.find(l => l.id === listId);
  if (list) {
    showEditListModal(list);
  }
}

// Delete list
function deleteList(listId) {
  const list = lists.find(l => l.id === listId);
  if (!list) return;

  // Create confirmation toast with action buttons
  showConfirmationToast(
    `Delete entire list "${list.name}" and all its tasks?`,
    () => {
      lists = lists.filter(l => l.id !== listId);
      saveLists();
      renderLists();
      showToast('List deleted successfully', 'success');
    },
    () => {}
  );
}

// Reorder lists
function reorderLists(draggedListId, targetListId, insertAfter) {
  const draggedIndex = lists.findIndex(l => l.id === draggedListId);
  const targetIndex = lists.findIndex(l => l.id === targetListId);

  if (draggedIndex === -1 || targetIndex === -1) return;

  const draggedList = lists[draggedIndex];
  lists.splice(draggedIndex, 1);

  const newTargetIndex = lists.findIndex(l => l.id === targetListId);
  const insertIndex = insertAfter ? newTargetIndex + 1 : newTargetIndex;

  lists.splice(insertIndex, 0, draggedList);
  saveLists();
  renderLists();
}

// Reorder tasks
function reorderTasks(draggedListId, draggedTaskId, targetTaskId, targetListId, insertAfter) {
  const draggedList = lists.find(l => l.id === draggedListId);
  const targetList = lists.find(l => l.id === targetListId);

  if (!draggedList || !targetList) return;

  const draggedTaskIndex = draggedList.tasks.findIndex(t => t.id === draggedTaskId);
  if (draggedTaskIndex === -1) return;

  const draggedTask = draggedList.tasks[draggedTaskIndex];

  // Remove task from source list
  draggedList.tasks.splice(draggedTaskIndex, 1);

  // Find target position
  if (draggedListId === targetListId) {
    // Reordering within same list
    const targetTaskIndex = targetList.tasks.findIndex(t => t.id === targetTaskId);
    if (targetTaskIndex !== -1) {
      const insertIndex = insertAfter ? targetTaskIndex + 1 : targetTaskIndex;
      targetList.tasks.splice(insertIndex, 0, draggedTask);
    } else {
      // If target task not found, add back to original position or end
      targetList.tasks.push(draggedTask);
    }
  } else {
    // Moving between different lists
    const targetTaskIndex = targetList.tasks.findIndex(t => t.id === targetTaskId);
    if (targetTaskIndex !== -1) {
      const insertIndex = insertAfter ? targetTaskIndex + 1 : targetTaskIndex;
      targetList.tasks.splice(insertIndex, 0, draggedTask);
    } else {
      // If target task not found, add to end
      targetList.tasks.push(draggedTask);
    }
  }

  saveLists();
  renderLists();
}

// Move task to empty list
function moveTaskToEmptyList(draggedListId, draggedTaskId, targetListId) {
  const draggedList = lists.find(l => l.id === draggedListId);
  const targetList = lists.find(l => l.id === targetListId);

  if (!draggedList || !targetList) return;

  const draggedTaskIndex = draggedList.tasks.findIndex(t => t.id === draggedTaskId);
  if (draggedTaskIndex === -1) return;

  const draggedTask = draggedList.tasks[draggedTaskIndex];

  // Remove task from source list
  draggedList.tasks.splice(draggedTaskIndex, 1);

  // Add task to target list
  targetList.tasks.push(draggedTask);

  saveLists();
  renderLists();
}

// Set reminder
function setReminder(listId, taskId) {
  const list = lists.find(l => l.id === listId);
  if (!list) return;

  const task = list.tasks.find(t => t.id === taskId);
  if (!task || !task.time || !task.date) {
    showToast('Please set both time and date for this task first.', 'warning');
    return;
  }

  if (!('Notification' in window)) {
    showToast('Notifications are not supported in your browser.', 'error');
    return;
  }

  const taskDate = new Date(task.date + 'T' + task.time);
  const now = new Date();
  const timeUntilReminder = taskDate - now;

  if (timeUntilReminder <= 0) {
    showToast('This task is already past due!', 'warning');
    return;
  }

  if (Notification.permission === 'default') {
    Notification.requestPermission().then(permission => {
      setupReminder(task, permission, timeUntilReminder);
    });
  } else {
    setupReminder(task, Notification.permission, timeUntilReminder);
  }
}

function setupReminder(task, permission, timeUntilReminder) {
  showToast(`Reminder set for "${task.text}" at ${formatDateForDisplay(task.date)} ${formatTimeForDisplay(task.time)}`, 'success');

  setTimeout(() => {
    if (permission === 'granted') {
      new Notification('Daily Planner Reminder', {
        body: task.text
      });
    } else {
      showToast(`Reminder: ${task.text}`, 'info', 6000);
    }
  }, timeUntilReminder);
}

// Start countdown updates
function startCountdownUpdates() {
  countdownIntervals.forEach(interval => clearInterval(interval));
  countdownIntervals.clear();

  const interval = setInterval(updateCountdowns, 1000);
  countdownIntervals.set('main', interval);
}

// Initialize view state
function initializeView() {
  const container = document.getElementById('listsContainer');
  const toggleBtn = document.getElementById('viewToggleBtn');

  if (isColumnView) {
    container.classList.add('column-view');
    toggleBtn.title = 'Switch to row view';
    toggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="3" y1="6" x2="21" y2="6"/>
        <line x1="3" y1="12" x2="21" y2="12"/>
        <line x1="3" y1="18" x2="21" y2="18"/>
      </svg>
    `;
  } else {
    container.classList.remove('column-view');
    toggleBtn.title = 'Switch to column view';
    toggleBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <rect x="3" y="3" width="7" height="7"/>
        <rect x="14" y="3" width="7" height="7"/>
        <rect x="3" y="14" width="7" height="7"/>
        <rect x="14" y="14" width="7" height="7"/>
      </svg>
    `;
  }
}

// Event listeners
document.getElementById('addListForm').addEventListener('submit', addList);
document.getElementById('editListForm').addEventListener('submit', saveEditedList);
document.getElementById('editTaskForm').addEventListener('submit', saveEditedTask);

// Event delegation for dynamically created list action buttons
document.addEventListener('click', function(event) {
  // Allow links in task body to work without toggling expand/collapse
  if (event.target.closest('.task-body a')) {
    event.stopPropagation();
    return;
  }

  const taskBodyWrapper = event.target.closest('.task-body-wrapper');
  if (taskBodyWrapper && !event.target.closest('.task-body-input')) {
    const taskId = taskBodyWrapper.getAttribute('data-task-id');
    const listId = taskBodyWrapper.getAttribute('data-list-id');
    if (taskId && listId) {
      toggleTaskExpanded(listId, taskId);
    }
    return;
  }

  const taskContent = event.target.closest('.task-content');
  if (taskContent) {
    if (event.target.closest('.task-body-input')) {
      return;
    }

    const taskId = taskContent.getAttribute('data-task-id');
    const listId = taskContent.getAttribute('data-list-id');
    if (!taskId || !listId) return;

    const isInlineEditorTarget = Boolean(
      currentInlineBodyEditor
      && currentInlineBodyEditor.listId === listId
      && currentInlineBodyEditor.taskId === taskId
    );

    if (isInlineEditorTarget) {
      closeInlineBodyEditor({ collapseAfterSave: true });
      return;
    }

    const hasBody = taskContent.getAttribute('data-has-body') === 'true';
    if (hasBody) {
      if (taskContentClickTimeout) {
        clearTimeout(taskContentClickTimeout);
      }

      taskContentClickTimeout = setTimeout(() => {
        toggleTaskExpanded(listId, taskId);
        taskContentClickTimeout = null;
      }, 220);
    }
    return;
  }

  const target = event.target.closest('button');
  console.log('Click event detected:', {
    target: target,
    classList: target ? Array.from(target.classList) : null,
    eventTarget: event.target
  });

  if (!target) return;

  // Handle list collapse button
  if (target.classList.contains('list-collapse-btn')) {
    console.log('List collapse button clicked');
    const listCard = target.closest('.list-card');
    if (listCard) {
      const listId = listCard.getAttribute('data-list-id');
      console.log('Toggling list collapse for:', listId);
      toggleListCollapse(listId);
    }
  }

  // Handle finished tasks section toggle
  else if (target.classList.contains('finished-toggle-btn')) {
    const listId = target.getAttribute('data-list-id');
    if (listId) {
      toggleFinishedTasks(listId);
    }
  }

  // Handle list menu toggle button
  else if (target.classList.contains('list-menu')) {
    event.stopPropagation();
    const menuContainer = target.closest('.list-menu-container');
    const isActive = menuContainer.classList.contains('active');

    // Close all other open menus
    document.querySelectorAll('.list-menu-container.active').forEach(container => {
      container.classList.remove('active');
    });

    // Toggle current menu
    if (!isActive) {
      menuContainer.classList.add('active');
    }
  }

  // Handle list edit button
  else if (target.classList.contains('list-edit')) {
    const listCard = target.closest('.list-card');
    if (listCard) {
      const listId = listCard.getAttribute('data-list-id');
      editList(listId);
      // Close the menu
      const menuContainer = target.closest('.list-menu-container');
      if (menuContainer) {
        menuContainer.classList.remove('active');
      }
    }
  }

  // Handle list delete button
  else if (target.classList.contains('list-delete')) {
    const listCard = target.closest('.list-card');
    if (listCard) {
      const listId = listCard.getAttribute('data-list-id');
      deleteList(listId);
      // Close the menu
      const menuContainer = target.closest('.list-menu-container');
      if (menuContainer) {
        menuContainer.classList.remove('active');
      }
    }
  }

  // Handle task menu toggle button
  else if (target.classList.contains('task-menu')) {
    event.stopPropagation();
    const menuContainer = target.closest('.task-menu-container');
    const isActive = menuContainer.classList.contains('active');

    // Close all other open menus (both list and task menus)
    document.querySelectorAll('.list-menu-container.active, .task-menu-container.active').forEach(container => {
      container.classList.remove('active');
    });

    // Toggle current menu
    if (!isActive) {
      menuContainer.classList.add('active');
    }
  }

  // Handle task edit button
  else if (target.classList.contains('task-edit')) {
    const taskId = target.getAttribute('data-task-id');
    const listId = target.getAttribute('data-list-id');
    if (taskId && listId) {
      editTask(listId, taskId);
      // Close the menu
      const menuContainer = target.closest('.task-menu-container');
      if (menuContainer) {
        menuContainer.classList.remove('active');
      }
    }
  }

  // Handle task reminder button
  else if (target.classList.contains('task-reminder')) {
    const taskId = target.getAttribute('data-task-id');
    const listId = target.getAttribute('data-list-id');
    if (taskId && listId) {
      setReminder(listId, taskId);
      // Close the menu
      const menuContainer = target.closest('.task-menu-container');
      if (menuContainer) {
        menuContainer.classList.remove('active');
      }
    }
  }

  // Handle task delete button
  else if (target.classList.contains('task-delete')) {
    const taskId = target.getAttribute('data-task-id');
    const listId = target.getAttribute('data-list-id');
    if (taskId && listId) {
      deleteTask(listId, taskId);
      // Close the menu
      const menuContainer = target.closest('.task-menu-container');
      if (menuContainer) {
        menuContainer.classList.remove('active');
      }
    }
  }
});

document.addEventListener('dblclick', function(event) {
  const taskContent = event.target.closest('.task-content');
  if (!taskContent) return;

  if (taskContentClickTimeout) {
    clearTimeout(taskContentClickTimeout);
    taskContentClickTimeout = null;
  }

  if (event.target.closest('.task-body-input')) return;

  const taskId = taskContent.getAttribute('data-task-id');
  const listId = taskContent.getAttribute('data-list-id');
  if (taskId && listId) {
    openInlineBodyEditor(listId, taskId);
  }
});

document.addEventListener('input', function(event) {
  const textarea = event.target.closest('.task-body-input');
  if (!textarea) return;
  autoResizeTaskBodyInput(textarea);
});

// Close dropdown menus when clicking outside
document.addEventListener('click', function(event) {
  if (!event.target.closest('.list-menu-container') && !event.target.closest('.task-menu-container')) {
    document.querySelectorAll('.list-menu-container.active, .task-menu-container.active').forEach(container => {
      container.classList.remove('active');
    });
  }
});

// Close modals when clicking outside
window.onclick = function(event) {
  const addModal = document.getElementById('addListModal');
  const editListModal = document.getElementById('editListModal');
  const editTaskModal = document.getElementById('editTaskModal');
  const settingsModal = document.getElementById('settingsModal');
  if (event.target === addModal) closeAddListModal();
  if (event.target === editListModal) closeEditListModal();
  if (event.target === editTaskModal) closeEditTaskModal();
  if (event.target === settingsModal) closeSettingsModal();
};

// Theme management
function initializeTheme() {
  document.documentElement.setAttribute('data-theme', appSettings.theme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

  document.documentElement.setAttribute('data-theme', newTheme);
  appSettings.theme = newTheme;
  saveAppSettings();
}

// Toast notification system
function showToast(message, type = 'info', duration = 4000) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;

  const icons = {
    success: '<path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    error: '<path d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>',
    warning: '<path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>',
    info: '<path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>'
  };

  toast.innerHTML = `
    <div class="toast-content">
      <svg class="toast-icon ${type}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        ${icons[type]}
      </svg>
      <div class="toast-message">${message}</div>
    </div>
    <button class="toast-close" onclick="removeToast(this.parentElement)">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <line x1="18" y1="6" x2="6" y2="18"></line>
        <line x1="6" y1="6" x2="18" y2="18"></line>
      </svg>
    </button>
  `;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  // Auto remove
  setTimeout(() => removeToast(toast), duration);

  return toast;
}

function removeToast(toast) {
  if (!toast || !toast.parentElement) return;

  toast.classList.remove('show');
  setTimeout(() => {
    if (toast.parentElement) {
      toast.parentElement.removeChild(toast);
    }
  }, 300);
}

function showConfirmationToast(message, onConfirm, onCancel) {
  const container = document.getElementById('toastContainer');
  const toast = document.createElement('div');
  toast.className = 'toast warning confirmation';

  toast.innerHTML = `
    <div class="toast-content">
      <svg class="toast-icon warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z"/>
      </svg>
      <div class="toast-message">${message}</div>
    </div>
    <div class="toast-actions">
      <button class="toast-btn cancel" onclick="handleConfirmationAction(this, false)">Cancel</button>
      <button class="toast-btn confirm" onclick="handleConfirmationAction(this, true)">Delete</button>
    </div>
  `;

  // Store callbacks on the toast element
  toast._onConfirm = onConfirm;
  toast._onCancel = onCancel;

  container.appendChild(toast);

  // Trigger animation
  setTimeout(() => toast.classList.add('show'), 10);

  return toast;
}

function handleConfirmationAction(button, isConfirm) {
  const toast = button.closest('.toast');
  if (!toast) return;

  if (isConfirm && toast._onConfirm) {
    toast._onConfirm();
  } else if (!isConfirm && toast._onCancel) {
    toast._onCancel();
  }

  removeToast(toast);
}

// Re-render on resize when column count changes
let lastColumnCount = getColumnCount();
window.addEventListener('resize', () => {
  const newColumnCount = getColumnCount();
  if (newColumnCount !== lastColumnCount) {
    lastColumnCount = newColumnCount;
    renderLists();
  }
});

// Initialize
initializeTheme();
initializeView();
const appVersionElement = document.getElementById('appVersion');
if (appVersionElement) {
  appVersionElement.textContent = `v${APP_VERSION}`;
}
renderLists();
startCountdownUpdates();

// Simple touch drag-and-drop for mobile
(function() {
  let dragEl = null, dragType = null, clone = null;
  let startX, startY, offsetX, offsetY;
  const THRESHOLD = 10;

  function getTarget(targets, x, y) {
    for (let t of targets) {
      const r = t.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) return t;
    }
    return null;
  }

  function findDraggable(el) {
    while (el) {
      if (el.classList?.contains('list-task-item') && el.draggable) return {el, type: 'task'};
      if (el.classList?.contains('list-card') && el.draggable) return {el, type: 'list'};
      el = el.parentElement;
    }
    return null;
  }

  function isInteractive(el) {
    if (!el) return false;
    const tag = el.tagName;
    return ['INPUT','TEXTAREA','SELECT','BUTTON','A'].includes(tag) ||
           el.closest('button, a, input, .task-menu-container, .list-menu-container');
  }

  document.addEventListener('touchstart', e => {
    if (e.touches.length !== 1) return;
    const t = e.touches[0];
    const d = findDraggable(e.target);
    if (!d || isInteractive(e.target)) return;
    dragEl = d.el; dragType = d.type;
    const r = dragEl.getBoundingClientRect();
    startX = t.clientX; startY = t.clientY;
    offsetX = t.clientX - r.left; offsetY = t.clientY - r.top;
  }, {passive: true});

  document.addEventListener('touchmove', e => {
    if (!dragEl) return;
    const t = e.touches[0];
    const dx = t.clientX - startX, dy = t.clientY - startY;
    if (!clone && Math.abs(dx) + Math.abs(dy) > THRESHOLD) {
      clone = dragEl.cloneNode(true);
      const r = dragEl.getBoundingClientRect();
      clone.style.cssText = `position:fixed;left:${r.left}px;top:${r.top}px;width:${r.width}px;height:${r.height}px;opacity:0.8;z-index:99999;pointer-events:none;transform:rotate(3deg);box-shadow:0 10px 30px rgba(0,0,0,0.3);`;
      document.body.appendChild(clone);
      dragEl.classList.add('dragging');
    }
    if (clone) {
      e.preventDefault();
      clone.style.left = (t.clientX - offsetX) + 'px';
      clone.style.top = (t.clientY - offsetY) + 'px';
      // Update drop indicators
      document.querySelectorAll('.drag-over,.drag-over-top,.drag-over-bottom').forEach(el => el.classList.remove('drag-over','drag-over-top','drag-over-bottom'));
      const targets = dragType === 'list'
        ? [...document.querySelectorAll('.list-card')].filter(x => x !== dragEl)
        : [...document.querySelectorAll('.list-task-item')].filter(x => x !== dragEl);
      const target = getTarget(targets, t.clientX, t.clientY);
      if (target) {
        const r = target.getBoundingClientRect();
        target.classList.add(t.clientY < r.top + r.height/2 ? 'drag-over-top' : 'drag-over-bottom');
      }
    }
  }, {passive: false});

  document.addEventListener('touchend', e => {
    if (!dragEl) return;
    const t = e.changedTouches[0];
    if (clone) {
      const targets = dragType === 'list'
        ? [...document.querySelectorAll('.list-card')].filter(x => x !== dragEl)
        : [...document.querySelectorAll('.list-task-item')].filter(x => x !== dragEl);
      const target = getTarget(targets, t.clientX, t.clientY);
      if (target) {
        if (dragType === 'list') {
          reorderLists(dragEl.dataset.listId, target.dataset.listId, target.classList.contains('drag-over-bottom'));
        } else {
          reorderTasks(dragEl.dataset.listId, dragEl.dataset.taskId, target.dataset.taskId, target.dataset.listId, target.classList.contains('drag-over-bottom'));
        }
      }
      clone.remove();
      dragEl.classList.remove('dragging');
    }
    document.querySelectorAll('.drag-over,.drag-over-top,.drag-over-bottom').forEach(el => el.classList.remove('drag-over','drag-over-top','drag-over-bottom'));
    dragEl = dragType = clone = null;
  }, {passive: true});
})();

// Request notification permission
if ('Notification' in window && Notification.permission === 'default') {
  Notification.requestPermission();
}

console.log('History.js v2.0.0 loaded - Calculation history');

const APP_VERSION = '2.0.0';
const LANGUAGE_STORAGE_KEY = 'preferred_language';
const HISTORY_STORAGE_KEY = 'conversion_history';
const SUPPORTED_LANGUAGES = ['en', 'sk', 'sr'];
const LANGUAGE_LOCALES = {
    en: 'en-US',
    sk: 'sk-SK',
    sr: 'sr-RS'
};

const FALLBACK_TRANSLATIONS = {
    en: {
        title: 'Currency calculator',
        history: 'History',
        history_title: 'Calculation history',
        history_intro: 'Recent conversions saved on this device.',
        back_to_calculator: 'Back to calculator',
        back_to_grid: 'Back to tools',
        clear_history: 'Clear history',
        clear_history_confirm: 'Clear all saved calculations?',
        modal_cancel: 'Cancel',
        modal_confirm: 'Confirm',
        delete_history_item: 'Delete',
        delete_history_item_aria: 'Delete this history item',
        history_empty: 'No calculations yet',
        history_empty_hint: 'Your recent conversions will appear here after you calculate them.',
        history_today: 'Today',
        history_yesterday: 'Yesterday'
    },
    sk: {
        title: 'Menová kalkulačka',
        history: 'História',
        history_title: 'História výpočtov',
        history_intro: 'Nedávne konverzie uložené v tomto zariadení.',
        back_to_calculator: 'Späť na kalkulačku',
        back_to_grid: 'Späť na nástroje',
        clear_history: 'Vymazať históriu',
        clear_history_confirm: 'Vymazať všetky uložené výpočty?',
        modal_cancel: 'Zrušiť',
        modal_confirm: 'Potvrdiť',
        delete_history_item: 'Odstrániť',
        delete_history_item_aria: 'Odstrániť túto položku histórie',
        history_empty: 'Zatiaľ žiadne výpočty',
        history_empty_hint: 'Vaše posledné konverzie sa zobrazia tu po vykonaní výpočtu.',
        history_today: 'Dnes',
        history_yesterday: 'Včera'
    },
    sr: {
        title: 'Kalkulator valuta',
        history: 'Istorija',
        history_title: 'Istorija proračuna',
        history_intro: 'Nedavne konverzije sačuvane na ovom uređaju.',
        back_to_calculator: 'Nazad na kalkulator',
        back_to_grid: 'Nazad na alate',
        clear_history: 'Obriši istoriju',
        clear_history_confirm: 'Obrisati sve sačuvane proračune?',
        modal_cancel: 'Otkaži',
        modal_confirm: 'Potvrdi',
        delete_history_item: 'Obriši',
        delete_history_item_aria: 'Obriši ovu stavku istorije',
        history_empty: 'Još nema proračuna',
        history_empty_hint: 'Vaše poslednje konverzije će se pojaviti ovde nakon izračunavanja.',
        history_today: 'Danas',
        history_yesterday: 'Juče'
    }
};

let currentLanguage = 'en';
let translations = {};
let activeModalResolver = null;
let lastFocusedElement = null;

function detectLanguage() {
    const storedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (storedLanguage && SUPPORTED_LANGUAGES.includes(storedLanguage)) {
        return storedLanguage;
    }

    const preferredLanguages = Array.isArray(navigator.languages) && navigator.languages.length
        ? navigator.languages
        : [navigator.language || navigator.userLanguage || 'en'];

    for (const language of preferredLanguages) {
        const langCode = String(language || '').toLowerCase().split('-')[0];
        if (SUPPORTED_LANGUAGES.includes(langCode)) {
            return langCode;
        }
    }

    return 'en';
}

function t(key) {
    return translations[key] || key;
}

function loadTranslations(lang) {
    const nextLanguage = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en';

    // Apply fallback immediately so history renders without any network wait
    translations = FALLBACK_TRANSLATIONS[nextLanguage] || FALLBACK_TRANSLATIONS.en;
    currentLanguage = nextLanguage;
    updateUI();
    renderHistory();

    // Refresh from SW cache / network in background (non-blocking)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    fetch(`./translations/${nextLanguage}.json`, { signal: controller.signal })
        .then(r => { clearTimeout(timeoutId); if (!r.ok) throw new Error(); return r.json(); })
        .then(data => {
            translations = data;
            currentLanguage = nextLanguage;
            updateUI();
            renderHistory();
        })
        .catch(() => clearTimeout(timeoutId));
}

function formatNumber(number) {
    return new Intl.NumberFormat('fr-FR').format(number);
}

function formatTimestamp(timestamp) {
    const locale = LANGUAGE_LOCALES[currentLanguage] || LANGUAGE_LOCALES.en;
    return new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(timestamp));
}

function formatGroupDate(timestamp) {
    const locale = LANGUAGE_LOCALES[currentLanguage] || LANGUAGE_LOCALES.en;
    return new Intl.DateTimeFormat(locale, {
        dateStyle: 'full'
    }).format(new Date(timestamp));
}

function getDayKey(timestamp) {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function getGroupLabel(timestamp) {
    const today = getDayKey(new Date().toISOString());
    const yesterdayDate = new Date();
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const yesterday = getDayKey(yesterdayDate.toISOString());
    const targetDay = getDayKey(timestamp);

    if (targetDay === today) {
        return t('history_today');
    }

    if (targetDay === yesterday) {
        return t('history_yesterday');
    }

    return formatGroupDate(timestamp);
}

function getHistoryEntries() {
    const rawHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');

    if (!Array.isArray(rawHistory)) {
        return [];
    }

    return rawHistory
        .map((entry, storageIndex) => ({ ...entry, storageIndex }))
        .filter(entry => {
            return entry
                && typeof entry.amount === 'number'
                && typeof entry.result === 'number'
                && typeof entry.fromCurrency === 'string'
                && typeof entry.toCurrency === 'string'
                && typeof entry.timestamp === 'string';
        });
}

function groupHistoryEntries(entries) {
    const groups = [];

    entries.forEach(entry => {
        const dayKey = getDayKey(entry.timestamp);
        const existingGroup = groups.find(group => group.dayKey === dayKey);

        if (existingGroup) {
            existingGroup.entries.push(entry);
            return;
        }

        groups.push({
            dayKey,
            label: getGroupLabel(entry.timestamp),
            entries: [entry]
        });
    });

    return groups;
}

function deleteHistoryEntry(storageIndex) {
    const rawHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');

    if (!Array.isArray(rawHistory) || storageIndex < 0 || storageIndex >= rawHistory.length) {
        return;
    }

    rawHistory.splice(storageIndex, 1);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(rawHistory));
    renderHistory();
}

function closeConfirmModal(confirmed) {
    const modal = document.getElementById('confirm-modal');

    if (!modal || !activeModalResolver) {
        return;
    }

    modal.hidden = true;
    document.body.classList.remove('modal-open');

    const resolver = activeModalResolver;
    activeModalResolver = null;
    resolver(confirmed);

    if (lastFocusedElement instanceof HTMLElement) {
        lastFocusedElement.focus();
    }
}

function openConfirmModal() {
    const modal = document.getElementById('confirm-modal');
    const acceptButton = document.getElementById('confirm-accept-btn');

    if (!modal || !acceptButton) {
        return Promise.resolve(false);
    }

    lastFocusedElement = document.activeElement;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    acceptButton.focus();

    return new Promise(resolve => {
        activeModalResolver = resolve;
    });
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    const clearButton = document.getElementById('clear-history-btn');
    const entries = getHistoryEntries();

    if (!historyList || !clearButton) {
        return;
    }

    historyList.innerHTML = '';
    clearButton.disabled = entries.length === 0;

    if (entries.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'history-empty';
        emptyState.innerHTML = `
            <h2>${t('history_empty')}</h2>
            <p>${t('history_empty_hint')}</p>
        `;
        historyList.appendChild(emptyState);
        return;
    }

    groupHistoryEntries(entries).forEach(group => {
        const groupSection = document.createElement('section');
        groupSection.className = 'history-group';

        const groupTitle = document.createElement('h3');
        groupTitle.className = 'history-group-title';
        groupTitle.textContent = group.label;

        const groupList = document.createElement('div');
        groupList.className = 'history-group-list';

        group.entries.forEach(entry => {
            const card = document.createElement('article');
            card.className = 'history-card';

            const cardHead = document.createElement('div');
            cardHead.className = 'history-card-head';

            const currencies = document.createElement('p');
            currencies.className = 'history-currencies';
            currencies.textContent = `${entry.fromCurrency} -> ${entry.toCurrency}`;

            const meta = document.createElement('div');
            meta.className = 'history-card-meta';

            const date = document.createElement('p');
            date.className = 'history-date';
            date.textContent = formatTimestamp(entry.timestamp);

            const deleteButton = document.createElement('button');
            deleteButton.type = 'button';
            deleteButton.className = 'history-item-delete';
            deleteButton.textContent = t('delete_history_item');
            deleteButton.setAttribute('aria-label', t('delete_history_item_aria'));
            deleteButton.addEventListener('click', () => {
                deleteHistoryEntry(entry.storageIndex);
            });

            const equation = document.createElement('p');
            equation.className = 'history-equation';
            equation.textContent = `${formatNumber(entry.amount)} ${entry.fromCurrency} = ${formatNumber(entry.result)} ${entry.toCurrency}`;

            meta.appendChild(date);
            meta.appendChild(deleteButton);
            cardHead.appendChild(currencies);
            cardHead.appendChild(meta);
            card.appendChild(cardHead);
            card.appendChild(equation);
            groupList.appendChild(card);
        });

        groupSection.appendChild(groupTitle);
        groupSection.appendChild(groupList);
        historyList.appendChild(groupSection);
    });
}

function updateUI() {
    document.documentElement.lang = currentLanguage;
    document.title = `${t('history_title')} | ${t('title')}`;

    const historyTitle = document.getElementById('history-title');
    if (historyTitle) {
        historyTitle.textContent = t('history_title');
    }

    const historyIntro = document.getElementById('history-intro');
    if (historyIntro) {
        historyIntro.textContent = t('history_intro');
    }

    const backLink = document.getElementById('back-link');
    if (backLink) {
        backLink.textContent = t('back_to_grid');
    }

    const clearButton = document.getElementById('clear-history-btn');
    if (clearButton) {
        clearButton.textContent = t('clear_history');
    }

    const modalTitle = document.getElementById('confirm-modal-title');
    if (modalTitle) {
        modalTitle.textContent = t('clear_history');
    }

    const modalMessage = document.getElementById('confirm-modal-message');
    if (modalMessage) {
        modalMessage.textContent = t('clear_history_confirm');
    }

    const modalCancelButton = document.getElementById('confirm-cancel-btn');
    if (modalCancelButton) {
        modalCancelButton.textContent = t('modal_cancel');
    }

    const modalConfirmButton = document.getElementById('confirm-accept-btn');
    if (modalConfirmButton) {
        modalConfirmButton.textContent = t('modal_confirm');
    }

    const versionElement = document.querySelector('.version-info');
    if (versionElement) {
        versionElement.textContent = `v${APP_VERSION}`;
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const clearButton = document.getElementById('clear-history-btn');
    if (clearButton) {
        clearButton.addEventListener('click', async () => {
            const confirmed = await openConfirmModal();
            if (!confirmed) {
                return;
            }

            localStorage.removeItem(HISTORY_STORAGE_KEY);
            renderHistory();
        });
    }

    const modal = document.getElementById('confirm-modal');
    if (modal) {
        modal.addEventListener('click', event => {
            if (event.target === modal) {
                closeConfirmModal(false);
            }
        });
    }

    const modalCancelButton = document.getElementById('confirm-cancel-btn');
    if (modalCancelButton) {
        modalCancelButton.addEventListener('click', () => {
            closeConfirmModal(false);
        });
    }

    const modalConfirmButton = document.getElementById('confirm-accept-btn');
    if (modalConfirmButton) {
        modalConfirmButton.addEventListener('click', () => {
            closeConfirmModal(true);
        });
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && activeModalResolver) {
            closeConfirmModal(false);
        }
    });

    loadTranslations(detectLanguage());
});
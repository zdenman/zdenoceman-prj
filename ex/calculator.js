(function () {
    'use strict';

    const LANGUAGE_STORAGE_KEY = 'preferred_language';
    const HISTORY_STORAGE_KEY = 'classic_calc_history';
    const SUPPORTED_LANGUAGES = ['en', 'sk', 'sr'];
    const MAX_HISTORY_ITEMS = 10;

    const FALLBACK = {
        en: {
            menu_calculator: 'Calculator',
            back_to_grid: 'Back to tools',
            calc_clear_screen: 'Clear screen',
            calc_clear_entry: 'CE',
            calc_backspace: 'DEL',
            calc_equals: '=',
            calc_keypad_aria: 'Calculator keypad',
            calc_empty_hint: 'Previous calculations stay here. Tap any number to reuse it.',
            calc_error: 'Error',
            calc_title: 'Calculator',
            calc_meta: 'Classic calculator with visible calculation history and reusable results.'
        },
        sk: {
            menu_calculator: 'Kalkulačka',
            back_to_grid: 'Späť na nástroje',
            calc_clear_screen: 'Vymazať displej',
            calc_clear_entry: 'CE',
            calc_backspace: 'DEL',
            calc_equals: '=',
            calc_keypad_aria: 'Klávesnica kalkulačky',
            calc_empty_hint: 'Predchádzajúce výpočty ostanú tu. Ťuknutím na ľubovoľné číslo ho znovu použiješ.',
            calc_error: 'Chyba',
            calc_title: 'Kalkulačka',
            calc_meta: 'Klasická kalkulačka s viditeľnou históriou výpočtov a znovupoužiteľnými výsledkami.'
        },
        sr: {
            menu_calculator: 'Kalkulator',
            back_to_grid: 'Nazad na alate',
            calc_clear_screen: 'Obriši ekran',
            calc_clear_entry: 'CE',
            calc_backspace: 'DEL',
            calc_equals: '=',
            calc_keypad_aria: 'Tastatura kalkulatora',
            calc_empty_hint: 'Prethodni proračuni ostaju ovde. Dodirni bilo koji broj da ga ponovo upotrebiš.',
            calc_error: 'Greška',
            calc_title: 'Kalkulator',
            calc_meta: 'Klasični kalkulator sa vidljivom istorijom proračuna i ponovnom upotrebom rezultata.'
        }
    };

    let currentLanguage = 'en';
    let strings = FALLBACK.en;
    let currentExpression = '0';
    let justEvaluated = false;

    function t(key) {
        return strings[key] || key;
    }

    function detectLanguage() {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
            return stored;
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

    function loadHistory() {
        try {
            const parsed = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return [];
        }
    }

    function saveHistory(history) {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(-MAX_HISTORY_ITEMS)));
    }

    function toDisplayExpression(expression) {
        return expression.replace(/\*/g, '×').replace(/\//g, '÷').replace(/-/g, '−');
    }

    function sanitizeExpression(expression) {
        return expression
            .replace(/×/g, '*')
            .replace(/÷/g, '/')
            .replace(/−/g, '-')
            .replace(/,/g, '.');
    }

    function formatNumber(value) {
        if (!Number.isFinite(value)) {
            return t('calc_error');
        }

        return Number(value).toLocaleString('en-US', {
            maximumFractionDigits: 10,
            useGrouping: false
        });
    }

    function evaluateExpression(expression) {
        const sanitized = sanitizeExpression(expression).replace(/%/g, '/100');

        if (!/^[0-9+\-*/().\s]+$/.test(sanitized)) {
            throw new Error('Invalid characters');
        }

        const result = Function(`"use strict"; return (${sanitized});`)();
        if (!Number.isFinite(result)) {
            throw new Error('Invalid result');
        }

        return formatNumber(result);
    }

    function updateExpression() {
        const expressionEl = document.getElementById('calc-expression');
        if (expressionEl) {
            expressionEl.textContent = toDisplayExpression(currentExpression);
        }
    }

    function insertHistoryNumber(value) {
        const normalizedValue = sanitizeExpression(String(value));
        const lastChar = currentExpression.slice(-1);
        const endsWithOperator = /[+\-*/%(]/.test(lastChar);
        const isErrorState = currentExpression === t('calc_error');

        if (isErrorState || currentExpression === '0') {
            currentExpression = normalizedValue;
            justEvaluated = false;
            updateExpression();
            return;
        }

        if (justEvaluated && !endsWithOperator) {
            currentExpression = normalizedValue;
            justEvaluated = false;
            updateExpression();
            return;
        }

        currentExpression += normalizedValue;
        justEvaluated = false;
        updateExpression();
    }

    function createHistoryNumberButton(value, extraClass = '') {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `calc-history-number${extraClass ? ` ${extraClass}` : ''}`;
        button.textContent = value;
        button.addEventListener('click', () => {
            insertHistoryNumber(value);
        });
        return button;
    }

    function appendHistoryTokens(container, expression) {
        const tokens = sanitizeExpression(expression).match(/\d*\.\d+|\d+|[+\-*/%()]/g) || [sanitizeExpression(expression)];

        tokens.forEach(token => {
            if (/^\d*\.?\d+$/.test(token)) {
                container.appendChild(createHistoryNumberButton(token));
                return;
            }

            const operator = document.createElement('span');
            operator.className = 'calc-history-operator';
            operator.textContent = toDisplayExpression(token);
            container.appendChild(operator);
        });
    }

    function renderHistory() {
        const historyEl = document.getElementById('calc-history');
        if (!historyEl) {
            return;
        }

        const history = loadHistory();
        historyEl.innerHTML = '';

        if (!history.length) {
            const empty = document.createElement('p');
            empty.className = 'calc-history-empty';
            empty.textContent = t('calc_empty_hint');
            historyEl.appendChild(empty);
            return;
        }

        history.forEach(item => {
            const row = document.createElement('div');
            row.className = 'calc-history-row';

            const expr = document.createElement('div');
            expr.className = 'calc-history-expression';
            appendHistoryTokens(expr, item.expression);

            const equals = document.createElement('span');
            equals.className = 'calc-history-operator';
            equals.textContent = '=';
            expr.appendChild(equals);

            const reuse = createHistoryNumberButton(item.result, 'calc-history-value');

            row.appendChild(expr);
            row.appendChild(reuse);
            historyEl.appendChild(row);
        });

        historyEl.scrollTop = historyEl.scrollHeight;
    }

    function addToHistory(expression, result) {
        const history = loadHistory();
        history.push({ expression, result });
        saveHistory(history);
        renderHistory();
    }

    function clearScreen() {
        localStorage.removeItem(HISTORY_STORAGE_KEY);
        currentExpression = '0';
        justEvaluated = false;
        updateExpression();
        renderHistory();
    }

    function appendValue(value) {
        if (justEvaluated && /[0-9.]/.test(value)) {
            currentExpression = '0';
        }

        justEvaluated = false;

        if (/[+\-*/%]/.test(value)) {
            const lastChar = currentExpression.slice(-1);
            if (/[+\-*/%.]/.test(lastChar)) {
                currentExpression = currentExpression.slice(0, -1) + value;
            } else {
                currentExpression += value;
            }
            updateExpression();
            return;
        }

        if (value === '.') {
            const lastSegment = currentExpression.split(/[+\-*/%]/).pop();
            if (lastSegment.includes('.')) {
                return;
            }
        }

        currentExpression = currentExpression === '0' ? value : currentExpression + value;
        updateExpression();
    }

    function clearEntry() {
        currentExpression = '0';
        justEvaluated = false;
        updateExpression();
    }

    function backspace() {
        if (justEvaluated) {
            clearEntry();
            return;
        }

        currentExpression = currentExpression.length > 1 ? currentExpression.slice(0, -1) : '0';
        updateExpression();
    }

    function evaluateCurrent() {
        try {
            const expression = currentExpression;
            const result = evaluateExpression(expression);
            currentExpression = result;
            justEvaluated = true;
            updateExpression();
            addToHistory(expression, result);
        } catch {
            currentExpression = t('calc_error');
            justEvaluated = true;
            updateExpression();
        }
    }

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            const value = t(key);
            if (value !== key) {
                element.textContent = value;
            }
        });

        document.querySelectorAll('[data-i18n-aria-label]').forEach(element => {
            const key = element.getAttribute('data-i18n-aria-label');
            const value = t(key);
            if (value !== key) {
                element.setAttribute('aria-label', value);
            }
        });

        document.documentElement.lang = currentLanguage;
        document.title = t('calc_title');

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = t('calc_meta');
        }

        if (currentExpression === 'Error' || currentExpression === 'Chyba' || currentExpression === 'Greška') {
            currentExpression = t('calc_error');
            updateExpression();
        }

        renderHistory();
    }

    function loadLanguage(language) {
        currentLanguage = FALLBACK[language] ? language : 'en';
        strings = FALLBACK[currentLanguage] || FALLBACK.en;
        applyTranslations();

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);
        fetch(`./translations/${currentLanguage}.json`, { signal: controller.signal })
            .then(response => {
                clearTimeout(timeoutId);
                if (!response.ok) {
                    throw new Error('Failed to load translations');
                }
                return response.json();
            })
            .then(data => {
                strings = { ...strings, ...data };
                applyTranslations();
            })
            .catch(() => clearTimeout(timeoutId));
    }

    function bindKeypad() {
        document.querySelectorAll('.calc-key').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const value = button.dataset.value;

                if (action === 'clear-entry') {
                    clearEntry();
                    return;
                }

                if (action === 'backspace') {
                    backspace();
                    return;
                }

                if (action === 'evaluate') {
                    evaluateCurrent();
                    return;
                }

                if (value) {
                    appendValue(value);
                }
            });
        });

        const clearScreenBtn = document.getElementById('calc-clear-screen');
        if (clearScreenBtn) {
            clearScreenBtn.addEventListener('click', clearScreen);
        }
    }

    document.addEventListener('keydown', event => {
        if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'l') {
            event.preventDefault();
            clearScreen();
            return;
        }

        if (event.key === 'Enter' || event.key === '=') {
            event.preventDefault();
            evaluateCurrent();
            return;
        }

        if (event.key === 'Backspace') {
            event.preventDefault();
            backspace();
            return;
        }

        if (event.key === 'Escape') {
            event.preventDefault();
            clearEntry();
            return;
        }

        if (/^[0-9.+\-*/%]$/.test(event.key)) {
            event.preventDefault();
            appendValue(event.key);
        }
    });

    document.addEventListener('DOMContentLoaded', () => {
        bindKeypad();

        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', event => {
                switchLanguage(event.target.value);
            });
        }

        loadLanguage(detectLanguage());
        updateExpression();
        renderHistory();
    });
})();
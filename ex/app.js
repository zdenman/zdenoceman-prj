// Internationalization system
console.log('App.js v2.0.0 loaded - Dynamic currency conversion');

// Add version check for mobile cache busting
const APP_VERSION = '2.0.0';
const DISPLAY_CURRENCIES = ['rsd', 'czk', 'huf', 'mkd', 'pln'];
const LANGUAGE_STORAGE_KEY = 'preferred_language';
const SUPPORTED_LANGUAGES = ['en', 'sk', 'sr'];
const HISTORY_STORAGE_KEY = 'conversion_history';
const APP_STATE_STORAGE_KEY = 'app_state';
const RATES_STORAGE_KEY = 'exchange_rates';
const RATES_TIMESTAMP_STORAGE_KEY = 'rates_timestamp';
const HISTORY_LIMIT = 50;
const DEFAULT_APP_STATE = {
    ratesPanelExpanded: false,
    fromCurrency: null,
    toCurrency: null,
    amount: '',
    resultText: ''
};
const FALLBACK_TRANSLATIONS = {
    en: {
        title: 'Currency calculator',
        heading: 'Currency calculator',
        intro: 'Currency values are updated daily',
        convert: 'Convert',
        history: 'History',
        amount_placeholder: {
            enter_amount: 'Enter amount',
            eur: 'Amount EUR',
            rsd: 'Amount RSD',
            czk: 'Amount CZK',
            huf: 'Amount HUF',
            mkd: 'Amount MKD',
            pln: 'Amount PLN'
        },
        loading: 'Loading...',
        language: 'Language:',
        exchange_rate: '1 EUR = {rate}',
        section_title: 'Select currencies',
        currency_selection: 'Currency selection',
        show_rates: 'Show rates',
        hide_rates: 'Hide rates',
        reset: 'Reset',
        enter_amount: 'Enter amount of {currency} to convert',
        enter_valid_amount: 'Please enter a valid amount',
        menu_currency: 'Currency',
        menu_length: 'Length',
        menu_speed: 'Speed',
        menu_area: 'Area / Field',
        menu_volume: 'Volume',
        menu_bmi: 'BMI',
        menu_alcohol: 'Alcohol',
        back_to_grid: 'Back to tools',
        coming_soon: 'Soon',
        back_home: 'Back to Currency',
        menu_open: 'Open menu',
        menu_close: 'Close menu'
    },
    sk: {
        title: 'Menova kalkulacka',
        heading: 'Menova kalkulacka',
        intro: 'Menove kurzy sa aktualizuju denne',
        convert: 'Konvertovat',
        history: 'Historia',
        amount_placeholder: {
            enter_amount: 'Zadajte sumu',
            eur: 'Suma EUR',
            rsd: 'Suma RSD',
            czk: 'Suma CZK',
            huf: 'Suma HUF',
            mkd: 'Suma MKD',
            pln: 'Suma PLN'
        },
        loading: 'Nacitava sa...',
        language: 'Jazyk:',
        exchange_rate: '1 EUR = {rate}',
        section_title: 'Vyberte meny',
        currency_selection: 'Vyber mien',
        show_rates: 'Zobrazit kurzy',
        hide_rates: 'Skryt kurzy',
        reset: 'Resetovat',
        enter_amount: 'Zadajte sumu {currency} na konverziu',
        enter_valid_amount: 'Zadajte platnu sumu',
        menu_currency: 'Mena',
        menu_length: 'Dĺžka',
        menu_speed: 'Rýchlosť',
        menu_area: 'Plocha / Pole',
        menu_volume: 'Objem',
        menu_bmi: 'BMI',
        menu_alcohol: 'Alkohol',
        back_to_grid: 'Späť na nástroje',
        coming_soon: 'Čoskoro',
        back_home: 'Späť na kalkulačku',
        menu_open: 'Otvoriť menu',
        menu_close: 'Zavrieť menu'
    },
    sr: {
        title: 'Kalkulator valuta',
        heading: 'Kalkulator valuta',
        intro: 'Kursevi valuta se azuriraju dnevno',
        convert: 'Konvertuj',
        history: 'Istorija',
        amount_placeholder: {
            enter_amount: 'Unesite iznos',
            eur: 'Iznos EUR',
            rsd: 'Iznos RSD',
            czk: 'Iznos CZK',
            huf: 'Iznos HUF',
            mkd: 'Iznos MKD',
            pln: 'Iznos PLN'
        },
        loading: 'Ucitava se...',
        language: 'Jezik:',
        exchange_rate: '1 EUR = {rate}',
        section_title: 'Izaberite valute',
        currency_selection: 'Izbor valuta',
        show_rates: 'Prikazi kurseve',
        hide_rates: 'Sakrij kurseve',
        reset: 'Resetuj',
        enter_amount: 'Unesite iznos {currency} za konverziju',
        enter_valid_amount: 'Unesite vazeci iznos',
        menu_currency: 'Valuta',
        menu_length: 'Dužina',
        menu_speed: 'Brzina',
        menu_area: 'Površina / Polje',
        menu_volume: 'Zapremina',
        menu_bmi: 'BMI',
        menu_alcohol: 'Alkohol',
        back_to_grid: 'Nazad na alate',
        coming_soon: 'Uskoro',
        back_home: 'Nazad na valutu',
        menu_open: 'Otvori meni',
        menu_close: 'Zatvori meni'
    }
};
const storedVersion = localStorage.getItem('app_version');
if (storedVersion !== APP_VERSION) {
    localStorage.setItem('app_version', APP_VERSION);
    console.log('App version updated, cache cleared');
    // Force reload if this is not the first load
    if (storedVersion && window.location.search.indexOf('cache_bust') === -1) {
        window.location.href = window.location.href + '?cache_bust=' + Date.now();
    }
}
let currentLanguage = 'en';
let translations = {};
let isOffline = !navigator.onLine;

function readStoredAppState() {
    try {
        const storedState = JSON.parse(localStorage.getItem(APP_STATE_STORAGE_KEY) || '{}');

        return {
            ...DEFAULT_APP_STATE,
            ratesPanelExpanded: storedState.ratesPanelExpanded === true,
            fromCurrency: typeof storedState.fromCurrency === 'string' ? storedState.fromCurrency : null,
            toCurrency: typeof storedState.toCurrency === 'string' ? storedState.toCurrency : null,
            amount: typeof storedState.amount === 'string' ? storedState.amount : '',
            resultText: typeof storedState.resultText === 'string' ? storedState.resultText : ''
        };
    } catch (error) {
        console.warn('Failed to parse stored app state, resetting to defaults', error);
        return { ...DEFAULT_APP_STATE };
    }
}

function updateStoredAppState(partialState) {
    const nextState = {
        ...readStoredAppState(),
        ...partialState
    };

    localStorage.setItem(APP_STATE_STORAGE_KEY, JSON.stringify(nextState));
}

// Detect browser language
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

// Switch language manually
function switchLanguage(lang) {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    loadTranslations(lang);
}

// Load translations
function loadTranslations(lang) {
    const nextLanguage = SUPPORTED_LANGUAGES.includes(lang) ? lang : 'en';

    // Apply fallback immediately so UI renders without any network wait
    translations = FALLBACK_TRANSLATIONS[nextLanguage] || FALLBACK_TRANSLATIONS.en;
    currentLanguage = nextLanguage;
    updateUI();

    // Refresh from SW cache / network in background (non-blocking)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    fetch(`./translations/${nextLanguage}.json`, { signal: controller.signal })
        .then(r => { clearTimeout(timeoutId); if (!r.ok) throw new Error(); return r.json(); })
        .then(data => {
            translations = data;
            currentLanguage = nextLanguage;
            updateUI();
        })
        .catch(() => clearTimeout(timeoutId));
}

function saveCalculationToHistory(entry) {
    const existingHistory = JSON.parse(localStorage.getItem(HISTORY_STORAGE_KEY) || '[]');
    const updatedHistory = [entry, ...existingHistory].slice(0, HISTORY_LIMIT);
    localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updatedHistory));
}

// Get translated text
function t(key, params = {}) {
    let text = translations[key] || key;

    // Handle nested keys like amount_placeholder.eur
    if (key.includes('.')) {
        const keys = key.split('.');
        text = translations;
        for (const k of keys) {
            text = text?.[k];
        }
        text = text || key;
    }

    // Replace placeholders
    Object.keys(params).forEach(param => {
        text = text.replace(`{${param}}`, params[param]);
    });

    return text;
}

function normalizeRates(rawData) {
    const source = rawData?.eur || rawData?.conversion_rates || rawData;

    if (!source || typeof source !== 'object') {
        return null;
    }

    const normalizedRates = {};

    DISPLAY_CURRENCIES.forEach(currencyCode => {
        const rawRate = source[currencyCode] ?? source[currencyCode.toUpperCase()];
        const numericRate = typeof rawRate === 'number' ? rawRate : Number(rawRate);

        if (Number.isFinite(numericRate)) {
            normalizedRates[currencyCode] = numericRate;
        }
    });

    return DISPLAY_CURRENCIES.every(currencyCode => Number.isFinite(normalizedRates[currencyCode]))
        ? normalizedRates
        : null;
}

function formatExchangeRate(rate) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 4
    }).format(rate);
}

function setRatesPanelExpanded(isExpanded) {
    const ratesPanel = document.getElementById('exchange-rates-panel');
    const ratesToggle = document.getElementById('rates-toggle');
    const ratesToggleLabel = document.getElementById('rates-toggle-label');

    if (!ratesPanel || !ratesToggle || !ratesToggleLabel) {
        return;
    }

    ratesPanel.hidden = !isExpanded;
    ratesToggle.setAttribute('aria-expanded', String(isExpanded));
    ratesToggleLabel.textContent = t(isExpanded ? 'hide_rates' : 'show_rates');
    updateStoredAppState({ ratesPanelExpanded: isExpanded });
}

function initializeRatesPanel() {
    const ratesToggle = document.getElementById('rates-toggle');

    if (!ratesToggle || ratesToggle.dataset.initialized === 'true') {
        return;
    }

    ratesToggle.dataset.initialized = 'true';
    ratesToggle.addEventListener('click', () => {
        const isExpanded = ratesToggle.getAttribute('aria-expanded') === 'true';
        setRatesPanelExpanded(!isExpanded);
    });

    setRatesPanelExpanded(readStoredAppState().ratesPanelExpanded);
}

// Update UI with translations
function updateUI() {
    // Update title and meta
    document.title = t('title');
    document.querySelector('html').lang = currentLanguage;

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
        metaDescription.content = t('intro');
    }

    // Update main heading
    document.querySelector('h1').textContent = t('heading');

    // Update intro text
    document.querySelector('.intro').textContent = t('intro');

    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle) {
        sectionTitle.textContent = t('section_title');
    }

    const historyLink = document.getElementById('history-link');
    if (historyLink) {
        historyLink.textContent = t('history');
    }

    const calculateButton = document.getElementById('calculate-btn');
    if (calculateButton) {
        calculateButton.textContent = t('convert');
    }

    const resetButton = document.getElementById('reset-btn');
    if (resetButton) {
        resetButton.textContent = t('reset');
    }

    const amountLabel = document.querySelector('label[for="amount-input"]');
    if (amountLabel) {
        amountLabel.textContent = t('enter_amount', { currency: 'EUR' });
    }

    // Update placeholders
    const amountInput = document.getElementById('amount-input');
    if (amountInput) {
        amountInput.placeholder = t('amount_placeholder.enter_amount');
        amountInput.setAttribute('aria-label', t('enter_amount', { currency: 'EUR' }));
    }

    const currencyGridElement = document.getElementById('currency-selection-grid');
    if (currencyGridElement) {
        currencyGridElement.setAttribute('aria-label', t('currency_selection'));
    }

    // Update language selector
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLanguage;
    }

    // Update language label
    const languageLabel = document.querySelector('label[for="language-select"]');
    if (languageLabel) {
        languageLabel.textContent = t('language');
    }

    const ratesToggle = document.getElementById('rates-toggle');
    const isRatesPanelInitialized = ratesToggle?.dataset.initialized === 'true';
    const isExpanded = isRatesPanelInitialized
        ? ratesToggle.getAttribute('aria-expanded') === 'true'
        : readStoredAppState().ratesPanelExpanded;
    setRatesPanelExpanded(isExpanded);

    // Update exchange rates if data is available
    if (window.rates) {
        updateExchangeRates();
    }

    // Apply data-i18n text content
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const text = t(key);
        if (text !== key) el.textContent = text;
    });

    // Apply data-i18n-aria-label
    document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
        const key = el.getAttribute('data-i18n-aria-label');
        const text = t(key);
        if (text !== key) el.setAttribute('aria-label', text);
    });
}

// Update exchange rates with translations
function updateExchangeRates() {
    if (window.rates) {
        DISPLAY_CURRENCIES.forEach(currencyCode => {
            const rateElement = document.getElementById(currencyCode);
            const rate = window.rates[currencyCode];

            if (rateElement && Number.isFinite(rate)) {
                rateElement.textContent = t('exchange_rate', {
                    rate: formatExchangeRate(rate),
                    currency: currencyCode.toUpperCase()
                });
            }
        });
    }
}

// Initialize i18n
async function initI18n() {
    const detectedLang = detectLanguage();
    await loadTranslations(detectedLang);
}

function initializeMenuToggle() {
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

    if (!menuToggle || !navMenu || menuToggle.dataset.initialized === 'true') {
        return;
    }

    menuToggle.dataset.initialized = 'true';

    function openMenu() {
        navMenu.hidden = false;
        menuToggle.setAttribute('aria-expanded', 'true');
    }

    function closeMenu() {
        navMenu.hidden = true;
        menuToggle.setAttribute('aria-expanded', 'false');
    }

    menuToggle.addEventListener('click', (e) => {
        e.stopPropagation();
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        isExpanded ? closeMenu() : openMenu();
    });

    document.addEventListener('click', (e) => {
        if (!navMenu.hidden && !navMenu.contains(e.target) && e.target !== menuToggle) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !navMenu.hidden) {
            closeMenu();
            menuToggle.focus();
        }
    });
}

document.addEventListener("DOMContentLoaded", async event => {
    // Initialize internationalization first
    initI18n();
    initializeRatesPanel();
    initializeMenuToggle();

    // Add language switcher event listener
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', (e) => {
            switchLanguage(e.target.value);
        });
    }

    // we can move only if we are not in a browser's tab
    let isBrowser = matchMedia("(display-mode: browser)").matches;
    if (!isBrowser) {
       window.moveTo(16, 16);
       // Set optimal size for desktop PWA
       window.resizeTo(620, 860);
    }


    // Set loading text initially
    DISPLAY_CURRENCIES.forEach(currencyCode => {
        const rateElement = document.getElementById(currencyCode);

        if (rateElement) {
            rateElement.textContent = t('exchange_rate', {
                rate: t('loading')
            });
        }
    });

    // --- New Dynamic Conversion Logic ---
    const currencyGrid = document.getElementById('currency-selection-grid');
    const calculatorSection = document.getElementById('calculator-section');
    const amountInput = document.getElementById('amount-input');
    const calculateBtn = document.getElementById('calculate-btn');
    const conversionResult = document.getElementById('conversion-result');
    const selectedCurrencyPair = document.getElementById('selected-currency-pair');
    const currencies = ['EUR', 'RSD', 'CZK', 'HUF', 'MKD', 'PLN'];
    const restoredAppState = readStoredAppState();
    let fromCurrency = currencies.includes(restoredAppState.fromCurrency) ? restoredAppState.fromCurrency : null;
    let toCurrency = currencies.includes(restoredAppState.toCurrency) ? restoredAppState.toCurrency : null;

    if (fromCurrency === toCurrency) {
        toCurrency = null;
    }

    amountInput.value = restoredAppState.amount;
    conversionResult.textContent = restoredAppState.resultText;

    initializeCurrencyGrid();

    // Initialize exchange rates after DOM is ready
    if (!navigator.onLine) {
        console.log('App started in offline mode');
    }

    // Preload the most recently saved rates so the calculator is usable immediately.
    if (loadCachedRates()) {
        updateOfflineStatus();
        updateExchangeRates();
        initializeCurrencyGrid();
    }

    fetchExchangeRates();

    // Offline functionality

    // Check if we have cached rates in localStorage
    function loadCachedRates() {
        const cachedRates = localStorage.getItem(RATES_STORAGE_KEY);
        const cacheTimestamp = localStorage.getItem(RATES_TIMESTAMP_STORAGE_KEY);

        if (cachedRates) {
            const normalizedRates = normalizeRates(JSON.parse(cachedRates));

            if (normalizedRates) {
                window.rates = normalizedRates;
                console.log('Loaded cached exchange rates', cacheTimestamp ? `from ${cacheTimestamp}` : '');
                return true;
            }
        }

        return false;
    }

    // Save rates to localStorage
    function saveRatesToCache(rates) {
        localStorage.setItem(RATES_STORAGE_KEY, JSON.stringify(rates));
        localStorage.setItem(RATES_TIMESTAMP_STORAGE_KEY, Date.now().toString());
        console.log('Exchange rates saved to cache');
    }

    // Update offline status indicator
    function updateOfflineStatus() {
        const offlineIndicator = document.getElementById('offline-indicator');
        const introText = document.querySelector('.intro');

        if (isOffline) {
            if (offlineIndicator) {
                offlineIndicator.style.display = 'block';
            }
            if (introText) {
                // Check if we're using fallback rates
                const usingFallback = window.rates === fallbackRates;
                if (usingFallback) {
                    introText.textContent = 'Offline mode - Using approximate values';
                    introText.style.color = 'var(--accent-warning)';
                } else {
                    introText.textContent = 'Offline mode - Using cached data';
                    introText.style.color = 'var(--accent-warning)';
                }
            }
        } else {
            if (offlineIndicator) {
                offlineIndicator.style.display = 'none';
            }
            if (introText) {
                introText.textContent = t('intro');
                introText.style.color = '';
            }
        }
    }

    // Fallback exchange rates for offline use when no cached data is available
    const fallbackRates = {
        rsd: 117.1777,
        czk: 25.352,
        huf: 394.6337,
        mkd: 61.695,
        pln: 4.3172
    };

    async function fetchRatesFromSource(url) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);
        try {
            const response = await fetch(url, { cache: 'no-store', signal: controller.signal });

            if (!response.ok) {
                throw new Error(`Network response was not ok for ${url}`);
            }

            const data = await response.json();
            const normalizedRates = normalizeRates(data);

            if (!normalizedRates) {
                throw new Error(`Unsupported exchange rate format from ${url}`);
            }

            return normalizedRates;
        } finally {
            clearTimeout(timeoutId);
        }
    }

    // Load fallback rates when no other data is available
    function loadFallbackRates() {
        window.rates = fallbackRates;
        saveRatesToCache(fallbackRates);
        console.log('Loaded fallback exchange rates for offline use');
        isOffline = true;
        updateOfflineStatus();
        updateExchangeRates();
        initializeCurrencyGrid();
    }

    // Fetch exchange rates with offline fallback
    function fetchExchangeRates() {
        // If online, prioritize fetching fresh rates
        if (navigator.onLine) {
            isOffline = false;
            updateOfflineStatus();
            console.log('Online - attempting to fetch fresh rates');
            fetchFreshRates();
            return;
        }

        // If offline, try to load from cache first
        console.log('Offline - loading cached rates');
        if (loadCachedRates()) {
            isOffline = true;
            updateOfflineStatus();
            updateExchangeRates();
            initializeCurrencyGrid();
        } else {
            // No cached data available, use fallback rates
            console.log('Offline with no cached data, using fallback rates');
            loadFallbackRates();
        }
    }

    // Separate function to fetch fresh rates
    async function fetchFreshRates() {
        const sources = [
            'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json',
            './eur.json'
        ];

        for (const source of sources) {
            try {
                const normalizedRates = await fetchRatesFromSource(source);
                window.rates = normalizedRates;
                saveRatesToCache(normalizedRates);
                isOffline = source !== sources[0];
                updateOfflineStatus();
                updateExchangeRates();
                initializeCurrencyGrid();
                console.log(`Exchange rates loaded from ${source}`);
                return;
            } catch (error) {
                console.log(`Failed to load exchange rates from ${source}:`, error);
            }
        }

        if (!window.rates) {
            console.log('No rates loaded, trying cached rates');
            if (!loadCachedRates()) {
                console.log('No cached rates available, using fallback rates');
                loadFallbackRates();
            } else {
                isOffline = true;
                updateOfflineStatus();
                updateExchangeRates();
                initializeCurrencyGrid();
            }
        } else {
            isOffline = true;
            updateOfflineStatus();
            updateExchangeRates();
            initializeCurrencyGrid();
        }
    }

    // Listen for online/offline events
    window.addEventListener('online', () => {
        console.log('Back online, fetching fresh rates');
        fetchExchangeRates();
    });

    window.addEventListener('offline', () => {
        console.log('Gone offline, using cached rates');
        isOffline = true;
        loadCachedRates();
        updateOfflineStatus();
        updateExchangeRates();
        initializeCurrencyGrid();
    });

    // Update version display
    function updateVersionDisplay() {
        const versionElement = document.querySelector('.version-info');
        if (versionElement) {
            versionElement.textContent = `v${APP_VERSION}`;
        }
    }

    // Call version update after DOM is loaded
    updateVersionDisplay();
    // Formating result to spaces between thousands
    function formatNumber(number) {
        return new Intl.NumberFormat('fr-FR').format(number);
    }

    function persistCalculatorState() {
        updateStoredAppState({
            fromCurrency,
            toCurrency,
            amount: amountInput.value,
            resultText: conversionResult.textContent
        });
    }

    function updateSelectedCurrencyPair() {
        if (!selectedCurrencyPair) {
            return;
        }

        selectedCurrencyPair.textContent = fromCurrency && toCurrency
            ? `${fromCurrency} -> ${toCurrency}`
            : fromCurrency
                ? `${fromCurrency} -> ...`
                : '';
    }

    function syncCurrencyGridSelection() {
        document.querySelectorAll('#currency-selection-grid button').forEach(button => {
            const isSelected = button.dataset.currency === fromCurrency || button.dataset.currency === toCurrency;
            button.classList.toggle('selected', isSelected);
        });
    }

    function initializeCurrencyGrid() {
        currencyGrid.innerHTML = '';
        currencies.forEach(currency => {
            const button = document.createElement('button');
            button.textContent = currency;
            button.dataset.currency = currency;
            button.addEventListener('click', handleCurrencySelection);
            currencyGrid.appendChild(button);
        });

        syncCurrencyGridSelection();
        updateSelectedCurrencyPair();

        if (fromCurrency && toCurrency) {
            showCalculator();

            if (amountInput.value && parseFloat(amountInput.value) > 0 && window.rates) {
                calculateConversion({ skipHistory: true });
            }
        } else {
            calculatorSection.style.display = 'none';
        }

        persistCalculatorState();
    }

    function handleCurrencySelection(event) {
        const selectedCurrency = event.target.dataset.currency;

        // If clicking on already selected currency, deselect it
        if (event.target.classList.contains('selected')) {
            event.target.classList.remove('selected');
            if (fromCurrency === selectedCurrency) {
                fromCurrency = null;
            } else if (toCurrency === selectedCurrency) {
                toCurrency = null;
            }
            // Hide calculator if no pair is selected
            if (!fromCurrency || !toCurrency) {
                calculatorSection.style.display = 'none';
                conversionResult.textContent = '';
            }
            updateSelectedCurrencyPair();
            persistCalculatorState();
            return;
        }

        if (!fromCurrency) {
            fromCurrency = selectedCurrency;
            event.target.classList.add('selected');
        } else if (!toCurrency) {
            toCurrency = selectedCurrency;
            event.target.classList.add('selected');
            updateSelectedCurrencyPair();
            showCalculator();
            // Auto-calculate if amount is already entered
            if (amountInput.value && parseFloat(amountInput.value) > 0) {
                calculateConversion();
            } else {
                persistCalculatorState();
            }
        } else {
            // Both currencies are selected, reset and start new selection
            // Clear all selected states
            document.querySelectorAll('#currency-selection-grid button').forEach(btn => {
                btn.classList.remove('selected');
            });
            // Set new fromCurrency
            fromCurrency = selectedCurrency;
            toCurrency = null;
            event.target.classList.add('selected');
            calculatorSection.style.display = 'none';
            conversionResult.textContent = '';
            updateSelectedCurrencyPair();
            persistCalculatorState();
        }
    }

    function showCalculator() {
        calculatorSection.style.display = 'block';
        amountInput.placeholder = `Amount in ${fromCurrency}`;
        updateSelectedCurrencyPair();
        persistCalculatorState();
    }

    function calculateConversion(options = {}) {
        const { skipHistory = false } = options;
        const amount = parseFloat(amountInput.value);
        if (isNaN(amount) || amount <= 0) {
            conversionResult.textContent = t('enter_valid_amount');
            persistCalculatorState();
            return;
        }

        let result;
        const fromRate = fromCurrency === 'EUR' ? 1 : window.rates[fromCurrency.toLowerCase()];
        const toRate = toCurrency === 'EUR' ? 1 : window.rates[toCurrency.toLowerCase()];

        if (fromCurrency === 'EUR') {
            result = amount * toRate;
        } else if (toCurrency === 'EUR') {
            result = amount / fromRate;
        } else {
            result = (amount / fromRate) * toRate;
        }

        conversionResult.textContent = `${formatNumber(amount)} ${fromCurrency} = ${formatNumber(result.toFixed(2))} ${toCurrency}`;

        if (!skipHistory) {
            saveCalculationToHistory({
                amount,
                fromCurrency,
                toCurrency,
                result: Number(result.toFixed(2)),
                timestamp: new Date().toISOString()
            });
        }

        persistCalculatorState();
    }

    calculateBtn.addEventListener('click', calculateConversion);
    amountInput.addEventListener('input', () => {
        conversionResult.textContent = '';
        persistCalculatorState();
    });
    amountInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            calculateConversion();
        }
    });

    // Reset button functionality
    const resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', () => {
        // Clear amount input
        amountInput.value = '';
        // Clear conversion result
        conversionResult.textContent = '';
        // Deselect all currencies
        document.querySelectorAll('#currency-selection-grid button').forEach(btn => {
            btn.classList.remove('selected');
        });
        // Reset currency selections
        fromCurrency = null;
        toCurrency = null;
        // Hide calculator
        calculatorSection.style.display = 'none';
        updateSelectedCurrencyPair();
        persistCalculatorState();
    });

});

// BMI Calculator
(function () {
    'use strict';

    // BMI categories
    const CATEGORIES = [
        { key: 'underweight', max: 18.5, rowId: null,                    color: '#60a5fa' },
        { key: 'normal',      max: 25,   rowId: 'bmi-table-row-normal',  color: '#22c55e' },
        { key: 'overweight',  max: 30,   rowId: 'bmi-table-row-overweight', color: '#f59e0b' },
        { key: 'obese1',      max: 35,   rowId: 'bmi-table-row-obese1',  color: '#f97316' },
        { key: 'obese2',      max: 40,   rowId: 'bmi-table-row-obese2',  color: '#ef4444' },
        { key: 'obese3',      max: Infinity, rowId: 'bmi-table-row-obese3', color: '#991b1b' }
    ];

    function getCategory(bmi) {
        return CATEGORIES.find(c => bmi < c.max) || CATEGORIES[CATEGORIES.length - 1];
    }

    // Needle position: maps BMI range [16, 40+] to [0%, 100%]
    function needlePercent(bmi) {
        const MIN = 16, MAX = 42;
        return Math.max(0, Math.min(100, ((bmi - MIN) / (MAX - MIN)) * 100));
    }

    // ── Language / Translation ──────────────────────────────────────────────
    const LANGUAGE_STORAGE_KEY = 'preferred_language';
    const SUPPORTED_LANGUAGES = ['en', 'sk', 'sr'];

    const FALLBACK = {
        en: {
            language: 'Language:',
            menu_currency: 'Currency',
            menu_length: 'Length',
            menu_speed: 'Speed',
            menu_area: 'Area / Field',
            menu_volume: 'Volume',
            menu_bmi: 'BMI',
            back_to_grid: 'Back to tools',
            menu_open: 'Open menu',
            menu_close: 'Close menu',
            bmi_intro: 'Body Mass Index — calculate and understand your BMI',
            bmi_metric: 'Metric',
            bmi_imperial: 'Imperial',
            bmi_height_cm: 'Height (cm)',
            bmi_weight_kg: 'Weight (kg)',
            bmi_height_ft: 'Height',
            bmi_weight_lbs: 'Weight (lbs)',
            bmi_placeholder_height_cm: 'e.g. 175',
            bmi_placeholder_weight_kg: 'e.g. 70',
            bmi_placeholder_ft: 'ft',
            bmi_placeholder_in: 'in',
            bmi_placeholder_weight_lbs: 'e.g. 154',
            bmi_calculate: 'Calculate',
            bmi_reset: 'Reset',
            bmi_your_bmi: 'Your BMI',
            bmi_table_title: 'BMI Categories',
            bmi_cat_underweight: 'Underweight',
            bmi_cat_normal: 'Normal weight',
            bmi_cat_overweight: 'Overweight',
            bmi_cat_obese1: 'Obese class I',
            bmi_cat_obese2: 'Obese class II',
            bmi_cat_obese3: 'Obese class III',
            bmi_desc_underweight: 'May indicate malnutrition, eating disorders or other health issues.',
            bmi_desc_normal: 'Associated with the lowest risk of weight-related health problems.',
            bmi_desc_overweight: 'Increased risk of cardiovascular disease, type 2 diabetes and hypertension.',
            bmi_desc_obese1: 'High risk. Lifestyle changes and medical consultation are recommended.',
            bmi_desc_obese2: 'Very high risk. Medical treatment is strongly advised.',
            bmi_desc_obese3: 'Extremely high risk. Immediate medical attention is strongly recommended.',
            bmi_disclaimer: 'BMI is a screening tool, not a diagnostic measure. It does not account for muscle mass, bone density, or fat distribution. Consult a healthcare professional for a full assessment.',
            bmi_invalid: 'Please enter valid height and weight values.',
            bmi_invalid_height: 'Please enter a valid height.',
            bmi_invalid_weight: 'Please enter a valid weight.'
        },
        sk: {
            language: 'Jazyk:',
            menu_currency: 'Mena',
            menu_length: 'Dĺžka',
            menu_speed: 'Rýchlosť',
            menu_area: 'Plocha / Pole',
            menu_volume: 'Objem',
            menu_bmi: 'BMI',
            back_to_grid: 'Späť na nástroje',
            menu_open: 'Otvoriť menu',
            menu_close: 'Zavrieť menu',
            bmi_intro: 'Index telesnej hmotnosti — vypočítajte a porozumejte svojmu BMI',
            bmi_metric: 'Metrické',
            bmi_imperial: 'Imperiálne',
            bmi_height_cm: 'Výška (cm)',
            bmi_weight_kg: 'Hmotnosť (kg)',
            bmi_height_ft: 'Výška',
            bmi_weight_lbs: 'Hmotnosť (lbs)',
            bmi_placeholder_height_cm: 'napr. 175',
            bmi_placeholder_weight_kg: 'napr. 70',
            bmi_placeholder_ft: 'stopy',
            bmi_placeholder_in: 'palce',
            bmi_placeholder_weight_lbs: 'napr. 154',
            bmi_calculate: 'Vypočítať',
            bmi_reset: 'Resetovať',
            bmi_your_bmi: 'Vaše BMI',
            bmi_table_title: 'Kategórie BMI',
            bmi_cat_underweight: 'Podváha',
            bmi_cat_normal: 'Normálna hmotnosť',
            bmi_cat_overweight: 'Nadváha',
            bmi_cat_obese1: 'Obezita I. stupňa',
            bmi_cat_obese2: 'Obezita II. stupňa',
            bmi_cat_obese3: 'Obezita III. stupňa',
            bmi_desc_underweight: 'Môže naznačovať podvýživu, poruchy príjmu potravy alebo iné zdravotné problémy.',
            bmi_desc_normal: 'Spojené s najnižším rizikom zdravotných problémov súvisiacich s hmotnosťou.',
            bmi_desc_overweight: 'Zvýšené riziko kardiovaskulárnych ochorení, cukrovky 2. typu a hypertenzie.',
            bmi_desc_obese1: 'Vysoké riziko. Odporúčajú sa zmeny životného štýlu a konzultácia s lekárom.',
            bmi_desc_obese2: 'Veľmi vysoké riziko. Dôrazne sa odporúča lekárska liečba.',
            bmi_desc_obese3: 'Mimoriadne vysoké riziko. Dôrazne sa odporúča okamžitá lekárska pomoc.',
            bmi_disclaimer: 'BMI je skríningový nástroj, nie diagnostická miera. Nezohľadňuje svalovú hmotu, hustotu kostí ani rozloženie tuku. Pre úplné posúdenie sa poraďte so zdravotníckym odborníkom.',
            bmi_invalid: 'Zadajte platné hodnoty výšky a hmotnosti.',
            bmi_invalid_height: 'Zadajte platnú výšku.',
            bmi_invalid_weight: 'Zadajte platnú hmotnosť.'
        },
        sr: {
            language: 'Jezik:',
            menu_currency: 'Valuta',
            menu_length: 'Dužina',
            menu_speed: 'Brzina',
            menu_area: 'Površina / Polje',
            menu_volume: 'Zapremina',
            menu_bmi: 'BMI',
            back_to_grid: 'Nazad na alate',
            menu_open: 'Otvori meni',
            menu_close: 'Zatvori meni',
            bmi_intro: 'Indeks telesne mase — izračunajte i razumejte vaš BMI',
            bmi_metric: 'Metričko',
            bmi_imperial: 'Imperijalno',
            bmi_height_cm: 'Visina (cm)',
            bmi_weight_kg: 'Težina (kg)',
            bmi_height_ft: 'Visina',
            bmi_weight_lbs: 'Težina (lbs)',
            bmi_placeholder_height_cm: 'npr. 175',
            bmi_placeholder_weight_kg: 'npr. 70',
            bmi_placeholder_ft: 'stope',
            bmi_placeholder_in: 'inči',
            bmi_placeholder_weight_lbs: 'npr. 154',
            bmi_calculate: 'Izračunaj',
            bmi_reset: 'Resetuj',
            bmi_your_bmi: 'Vaš BMI',
            bmi_table_title: 'Kategorije BMI',
            bmi_cat_underweight: 'Pothranjenost',
            bmi_cat_normal: 'Normalna težina',
            bmi_cat_overweight: 'Prekomerna težina',
            bmi_cat_obese1: 'Gojaznost I stepena',
            bmi_cat_obese2: 'Gojaznost II stepena',
            bmi_cat_obese3: 'Gojaznost III stepena',
            bmi_desc_underweight: 'Može ukazivati na pothranjenost, poremećaje ishrane ili druge zdravstvene probleme.',
            bmi_desc_normal: 'Povezano s najnižim rizikom od zdravstvenih problema vezanih za težinu.',
            bmi_desc_overweight: 'Povećan rizik od kardiovaskularnih bolesti, dijabetesa tipa 2 i hipertenzije.',
            bmi_desc_obese1: 'Visok rizik. Preporučuju se promene životnog stila i konsultacija s lekarom.',
            bmi_desc_obese2: 'Veoma visok rizik. Preporučuje se lekarski tretman.',
            bmi_desc_obese3: 'Izrazito visok rizik. Preporučuje se hitna lekarska pomoć.',
            bmi_disclaimer: 'BMI je alat za praćenje, a ne dijagnostička mera. Ne uzima u obzir mišićnu masu, gustinu kostiju ni raspored masti. Za potpunu procenu konsultujte zdravstvenog radnika.',
            bmi_invalid: 'Unesite važeće vrednosti visine i težine.',
            bmi_invalid_height: 'Unesite važeću visinu.',
            bmi_invalid_weight: 'Unesite važeću težinu.'
        }
    };

    let strings = FALLBACK.en;
    let currentLang = 'en';

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (strings[key] !== undefined) el.textContent = strings[key];
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria-label');
            if (strings[key] !== undefined) el.setAttribute('aria-label', strings[key]);
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            const key = el.getAttribute('data-i18n-placeholder');
            if (strings[key] !== undefined) el.setAttribute('placeholder', strings[key]);
        });
        document.documentElement.lang = currentLang;
        const langSel = document.getElementById('language-select');
        if (langSel) langSel.value = currentLang;
    }

    function loadLang(lang) {
        currentLang = lang;
        strings = FALLBACK[lang] || FALLBACK.en;
        applyTranslations();

        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 4000);
        fetch('./translations/' + lang + '.json', { signal: controller.signal })
            .then(r => { clearTimeout(tid); if (!r.ok) throw new Error(); return r.json(); })
            .then(data => { strings = Object.assign({}, strings, data); applyTranslations(); })
            .catch(() => clearTimeout(tid));
    }

    function detectLang() {
        const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (stored && SUPPORTED_LANGUAGES.includes(stored)) return stored;

        const preferredLanguages = Array.isArray(navigator.languages) && navigator.languages.length
            ? navigator.languages
            : [navigator.language || navigator.userLanguage || 'en'];

        for (const language of preferredLanguages) {
            const langCode = String(language || '').toLowerCase().split('-')[0];
            if (SUPPORTED_LANGUAGES.includes(langCode)) return langCode;
        }

        return 'en';
    }

    loadLang(detectLang());

    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.addEventListener('change', function (e) {
            const lang = e.target.value;
            localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
            loadLang(lang);
        });
    }

    // ── Hamburger menu ──────────────────────────────────────────────────────
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu    = document.getElementById('nav-menu');

    if (menuToggle && navMenu) {
        function openMenu() {
            navMenu.hidden = false;
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.setAttribute('aria-label', strings.menu_close || 'Close menu');
        }
        function closeMenu() {
            navMenu.hidden = true;
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', strings.menu_open || 'Open menu');
        }
        menuToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            menuToggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
        });
        document.addEventListener('click', function (e) {
            if (!navMenu.hidden && !navMenu.contains(e.target) && e.target !== menuToggle) closeMenu();
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !navMenu.hidden) { closeMenu(); menuToggle.focus(); }
        });
    }

    // ── Calculator ──────────────────────────────────────────────────────────
    const calcBtn  = document.getElementById('calc-btn');
    const resetBtn = document.getElementById('reset-btn');
    const resultBox = document.getElementById('bmi-result-box');
    const scoreEl   = document.getElementById('bmi-score');
    const badgeEl   = document.getElementById('bmi-badge');
    const needleEl  = document.getElementById('bmi-needle');

    const ROW_IDS = {
        underweight: null,
        normal:      'bmi-table-row-normal',
        overweight:  'bmi-table-row-overweight',
        obese1:      'bmi-table-row-obese1',
        obese2:      'bmi-table-row-obese2',
        obese3:      'bmi-table-row-obese3'
    };

    function clearResult() {
        if (resultBox) resultBox.hidden = true;
        document.querySelectorAll('.bmi-table-row').forEach(r => r.classList.remove('bmi-table-row--active'));
    }

    function showResult(bmi) {
        const cat = getCategory(bmi);

        scoreEl.textContent = bmi.toFixed(1);
        scoreEl.style.color = cat.color;

        badgeEl.textContent = strings['bmi_cat_' + cat.key] || cat.key;
        badgeEl.style.background = cat.color;

        needleEl.style.left = needlePercent(bmi) + '%';

        resultBox.hidden = false;

        // Highlight active row in category table
        document.querySelectorAll('.bmi-table-row').forEach(r => r.classList.remove('bmi-table-row--active'));
        if (ROW_IDS[cat.key]) {
            const row = document.getElementById(ROW_IDS[cat.key]);
            if (row) row.classList.add('bmi-table-row--active');
        }
    }

    function doCalculate() {
        const hCm = parseFloat(document.getElementById('height-cm').value);
        const wKg = parseFloat(document.getElementById('weight-kg').value);
        if (!hCm || hCm <= 0 || isNaN(hCm)) { showValidationError('height'); return; }
        if (!wKg || wKg <= 0 || isNaN(wKg)) { showValidationError('weight'); return; }
        const heightM = hCm / 100;
        const bmi = wKg / (heightM * heightM);
        if (!isFinite(bmi) || bmi <= 0) { showValidationError('general'); return; }
        showResult(bmi);
    }

    function showValidationError(type) {
        clearResult();
        const key = type === 'height' ? 'bmi_invalid_height'
                  : type === 'weight' ? 'bmi_invalid_weight'
                  : 'bmi_invalid';
        badgeEl.textContent = strings[key] || 'Invalid input';
        badgeEl.style.background = 'var(--accent-error)';
        scoreEl.textContent = '—';
        scoreEl.style.color = 'var(--accent-error)';
        needleEl.style.left = '0%';
        resultBox.hidden = false;
    }

    function doReset() {
        ['height-cm', 'weight-kg'].forEach(id => {
            const el = document.getElementById(id);
            if (el) el.value = '';
        });
        clearResult();
        const firstInput = document.getElementById('height-cm');
        if (firstInput) firstInput.focus();
    }

    if (calcBtn)  calcBtn.addEventListener('click', doCalculate);
    if (resetBtn) resetBtn.addEventListener('click', doReset);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doCalculate();
    });
})();

// Area Calculator — metric, traditional and imperial conversions
(function () {
    'use strict';

    // Conversion factors: 1 unit = N square metres
    const TO_M2 = {
        km2:   1e6,
        ha:    10000,
        ar:    100,
        m2:    1,
        dm2:   0.01,
        cm2:   0.0001,
        jutro: 5754.642,   // 1 jutro (Austrian/Balkan) = 5754.642 m²
        ac:    4046.8564224,
        mi2:   2589988.110336,
        yd2:   0.83612736,
        ft2:   0.09290304,
        in2:   0.00064516
    };

    // Display codes shown in result text
    const UNIT_DISPLAY = {
        km2: 'km²', ha: 'ha', ar: 'a', m2: 'm²', dm2: 'dm²', cm2: 'cm²',
        jutro: 'jutro', ac: 'ac', mi2: 'mi²', yd2: 'yd²', ft2: 'ft²', in2: 'in²'
    };

    function convert(value, fromUnit, toUnit) {
        return (value * TO_M2[fromUnit]) / TO_M2[toUnit];
    }

    function formatResult(value) {
        if (value === 0) return '0';
        const abs = Math.abs(value);
        if (abs >= 1e6)  return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
        if (abs >= 1)    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
        return value.toLocaleString(undefined, { maximumSignificantDigits: 6 });
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
            back_to_grid: 'Back to tools',
            coming_soon: 'Soon',
            menu_open: 'Open menu',
            menu_close: 'Close menu',
            area_intro: 'Convert between metric, imperial and traditional area units',
            area_from: 'From',
            area_to: 'To',
            area_enter_value: 'Enter value',
            area_convert: 'Convert',
            area_reset: 'Reset',
            area_swap: 'Swap units',
            area_invalid: 'Please enter a valid positive number',
            area_same_unit: 'Select different units to convert',
            unit_group_metric: 'Metric',
            unit_group_traditional: 'Traditional',
            unit_group_imperial: 'Imperial',
            unit_km2: 'square kilometer',
            unit_ha: 'hectare',
            unit_ar: 'are',
            unit_m2: 'square meter',
            unit_dm2: 'square decimeter',
            unit_cm2: 'square centimeter',
            unit_jutro: 'jutro',
            unit_ac: 'acre',
            unit_mi2: 'square mile',
            unit_yd2: 'square yard',
            unit_ft2: 'square foot',
            unit_in2: 'square inch'
        },
        sk: {
            language: 'Jazyk:',
            menu_currency: 'Mena',
            menu_length: 'Dĺžka',
            menu_speed: 'Rýchlosť',
            menu_area: 'Plocha / Pole',
            back_to_grid: 'Späť na nástroje',
            coming_soon: 'Čoskoro',
            menu_open: 'Otvoriť menu',
            menu_close: 'Zavrieť menu',
            area_intro: 'Konvertujte medzi metrickými, imperiálnymi a tradičnými jednotkami plochy',
            area_from: 'Z',
            area_to: 'Na',
            area_enter_value: 'Zadajte hodnotu',
            area_convert: 'Konvertovať',
            area_reset: 'Resetovať',
            area_swap: 'Vymeniť jednotky',
            area_invalid: 'Zadajte platné kladné číslo',
            area_same_unit: 'Vyberte rôzne jednotky na konverziu',
            unit_group_metric: 'Metrické',
            unit_group_traditional: 'Tradičné',
            unit_group_imperial: 'Imperiálne',
            unit_km2: 'štvorcový kilometer',
            unit_ha: 'hektár',
            unit_ar: 'ár',
            unit_m2: 'štvorcový meter',
            unit_dm2: 'štvorcový decimeter',
            unit_cm2: 'štvorcový centimeter',
            unit_jutro: 'jutro',
            unit_ac: 'aker',
            unit_mi2: 'štvorcová míľa',
            unit_yd2: 'štvorcový yard',
            unit_ft2: 'štvorcová stopa',
            unit_in2: 'štvorcový palec'
        },
        sr: {
            language: 'Jezik:',
            menu_currency: 'Valuta',
            menu_length: 'Dužina',
            menu_speed: 'Brzina',
            menu_area: 'Površina / Polje',
            back_to_grid: 'Nazad na alate',
            coming_soon: 'Uskoro',
            menu_open: 'Otvori meni',
            menu_close: 'Zatvori meni',
            area_intro: 'Konvertujte između metričkih, imperijalnih i tradicionalnih jedinica površine',
            area_from: 'Iz',
            area_to: 'U',
            area_enter_value: 'Unesite vrednost',
            area_convert: 'Konvertuj',
            area_reset: 'Resetuj',
            area_swap: 'Zameni jedinice',
            area_invalid: 'Unesite važeći pozitivni broj',
            area_same_unit: 'Odaberite različite jedinice za konverziju',
            unit_group_metric: 'Metričko',
            unit_group_traditional: 'Tradicionalno',
            unit_group_imperial: 'Imperijalno',
            unit_km2: 'kvadratni kilometar',
            unit_ha: 'hektar',
            unit_ar: 'ar',
            unit_m2: 'kvadratni metar',
            unit_dm2: 'kvadratni decimetar',
            unit_cm2: 'kvadratni centimetar',
            unit_jutro: 'jutro',
            unit_ac: 'akra',
            unit_mi2: 'kvadratna milja',
            unit_yd2: 'kvadratni jard',
            unit_ft2: 'kvadratna stopa',
            unit_in2: 'kvadratni inč'
        }
    };

    let strings = FALLBACK.en;
    let currentLang = 'en';

    function getUnitGroupLabel(selectEl) {
        const selectedOption = selectEl && selectEl.selectedOptions ? selectEl.selectedOptions[0] : null;
        const optgroup = selectedOption ? selectedOption.parentElement : null;

        if (!optgroup || optgroup.tagName !== 'OPTGROUP') return '';

        const groupKey = optgroup.dataset.unitGroup;
        return groupKey ? (strings['unit_group_' + groupKey] || optgroup.label || '') : (optgroup.label || '');
    }

    function refreshUnitGroupBadges() {
        document.querySelectorAll('.unit-select-group select').forEach(selectEl => {
            const groupEl = selectEl.closest('.unit-select-group');
            if (!groupEl) return;

            const selectedOption = selectEl.selectedOptions ? selectEl.selectedOptions[0] : null;
            const optgroup = selectedOption ? selectedOption.parentElement : null;
            const groupKey = optgroup && optgroup.tagName === 'OPTGROUP' ? (optgroup.dataset.unitGroup || '') : '';
            const label = getUnitGroupLabel(selectEl);

            let badgeEl = groupEl.querySelector('.unit-group-chip');
            if (!badgeEl) {
                badgeEl = document.createElement('span');
                badgeEl.className = 'unit-group-chip';
                badgeEl.setAttribute('aria-hidden', 'true');

                const labelEl = groupEl.querySelector('label');
                if (labelEl) {
                    labelEl.insertAdjacentElement('afterend', badgeEl);
                } else {
                    groupEl.prepend(badgeEl);
                }
            }

            groupEl.dataset.unitGroup = groupKey;
            badgeEl.textContent = label;
        });
    }

    function syncUnitSelectionUi() {
        refreshUnitGroupBadges();
        if (window.MobileUnitPicker) window.MobileUnitPicker.refreshAll(document);
    }

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
        document.querySelectorAll('[data-i18n-unit]').forEach(el => {
            const name = strings['unit_' + el.value];
            const code = el.dataset.unitDisplay || el.value;
            if (name) el.textContent = name + ' (' + code + ')';
        });
        document.querySelectorAll('optgroup[data-unit-group]').forEach(el => {
            const groupKey = el.dataset.unitGroup;
            if (strings['unit_group_' + groupKey] !== undefined) el.label = strings['unit_group_' + groupKey];
        });
        document.documentElement.lang = currentLang;
        const langSel = document.getElementById('language-select');
        if (langSel) langSel.value = currentLang;
        syncUnitSelectionUi();
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
            if (!navMenu.hidden && !navMenu.contains(e.target) && e.target !== menuToggle) {
                closeMenu();
            }
        });
        document.addEventListener('keydown', function (e) {
            if (e.key === 'Escape' && !navMenu.hidden) {
                closeMenu();
                menuToggle.focus();
            }
        });
    }

    // ── Calculator ──────────────────────────────────────────────────────────
    const fromUnitEl = document.getElementById('from-unit');
    const toUnitEl   = document.getElementById('to-unit');
    const inputEl    = document.getElementById('area-input');
    const convertBtn = document.getElementById('convert-btn');
    const resetBtn   = document.getElementById('reset-btn');
    const swapBtn    = document.getElementById('swap-btn');
    const resultEl   = document.getElementById('area-result');

    function showError(msg) {
        resultEl.textContent = msg;
        resultEl.className = 'length-result length-result-error';
    }

    function showOk(text) {
        resultEl.textContent = text;
        resultEl.className = 'length-result length-result-ok';
    }

    function doConvert() {
        const raw   = inputEl.value.trim();
        const value = parseFloat(raw);

        if (raw === '' || isNaN(value) || value < 0) {
            showError(strings.area_invalid || 'Please enter a valid positive number');
            return;
        }

        const fromUnit = fromUnitEl.value;
        const toUnit   = toUnitEl.value;

        if (fromUnit === toUnit) {
            showError(strings.area_same_unit || 'Select different units to convert');
            return;
        }

        const result    = convert(value, fromUnit, toUnit);
        const fromLabel = UNIT_DISPLAY[fromUnit];
        const toLabel   = UNIT_DISPLAY[toUnit];
        showOk(formatResult(value) + ' ' + fromLabel + ' = ' + formatResult(result) + ' ' + toLabel);
    }

    function doReset() {
        inputEl.value = '';
        resultEl.textContent = '';
        resultEl.className = 'length-result';
        fromUnitEl.value = 'ha';
        toUnitEl.value   = 'ac';
        syncUnitSelectionUi();
        inputEl.focus();
    }

    if (convertBtn) convertBtn.addEventListener('click', doConvert);
    if (resetBtn)   resetBtn.addEventListener('click', doReset);

    if (swapBtn) {
        swapBtn.addEventListener('click', function () {
            const tmp        = fromUnitEl.value;
            fromUnitEl.value = toUnitEl.value;
            toUnitEl.value   = tmp;
            syncUnitSelectionUi();
            if (inputEl.value.trim() !== '') doConvert();
        });
    }

    [fromUnitEl, toUnitEl].forEach(selectEl => {
        if (!selectEl) return;
        selectEl.addEventListener('change', syncUnitSelectionUi);
    });

    syncUnitSelectionUi();

    if (inputEl) {
        inputEl.addEventListener('keydown', function (e) {
            if (e.key === 'Enter') doConvert();
        });
    }
})();

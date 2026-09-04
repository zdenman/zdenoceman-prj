// Length Calculator — metric ↔ imperial conversions
(function () {
    'use strict';

    // Conversion factors: 1 unit = N metres
    const TO_METERS = {
        km: 1000,
        m:  1,
        cm: 0.01,
        mm: 0.001,
        mi: 1609.344,
        yd: 0.9144,
        ft: 0.3048,
        in: 0.0254
    };

    function convert(value, fromUnit, toUnit) {
        return (value * TO_METERS[fromUnit]) / TO_METERS[toUnit];
    }

    function formatResult(value) {
        if (value === 0) return '0';
        const abs = Math.abs(value);
        if (abs >= 1000)  return value.toLocaleString(undefined, { maximumFractionDigits: 4 });
        if (abs >= 1)     return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
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
            length_intro: 'Convert between metric and imperial units',
            length_from: 'From',
            length_to: 'To',
            length_enter_value: 'Enter value',
            length_convert: 'Convert',
            length_reset: 'Reset',
            length_swap: 'Swap units',
            length_invalid: 'Please enter a valid positive number',
            length_same_unit: 'Select different units to convert',
            unit_group_metric: 'Metric',
            unit_group_imperial: 'Imperial',
            unit_km: 'kilometer', unit_m: 'meter', unit_cm: 'centimeter', unit_mm: 'millimeter',
            unit_mi: 'mile', unit_yd: 'yard', unit_ft: 'foot', unit_in: 'inch'
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
            length_intro: 'Konvertujte medzi metrickými a imperiálnymi jednotkami',
            length_from: 'Z',
            length_to: 'Na',
            length_enter_value: 'Zadajte hodnotu',
            length_convert: 'Konvertovať',
            length_reset: 'Resetovať',
            length_swap: 'Vymeniť jednotky',
            length_invalid: 'Zadajte platné kladné číslo',
            length_same_unit: 'Vyberte rôzne jednotky na konverziu',
            unit_group_metric: 'Metrické',
            unit_group_imperial: 'Imperiálne',
            unit_km: 'kilometer', unit_m: 'meter', unit_cm: 'centimeter', unit_mm: 'milimeter',
            unit_mi: 'míľa', unit_yd: 'yard', unit_ft: 'stopa', unit_in: 'palec'
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
            length_intro: 'Konvertujte između metričkih i imperijalnih jedinica',
            length_from: 'Iz',
            length_to: 'U',
            length_enter_value: 'Unesite vrednost',
            length_convert: 'Konvertuj',
            length_reset: 'Resetuj',
            length_swap: 'Zameni jedinice',
            length_invalid: 'Unesite važeći pozitivni broj',
            length_same_unit: 'Odaberite različite jedinice za konverziju',
            unit_group_metric: 'Metričko',
            unit_group_imperial: 'Imperijalno',
            unit_km: 'kilometar', unit_m: 'metar', unit_cm: 'centimetar', unit_mm: 'milimetar',
            unit_mi: 'milja', unit_yd: 'jard', unit_ft: 'stopa', unit_in: 'inč'
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
    const inputEl    = document.getElementById('length-input');
    const convertBtn = document.getElementById('convert-btn');
    const resetBtn   = document.getElementById('reset-btn');
    const swapBtn    = document.getElementById('swap-btn');
    const resultEl   = document.getElementById('length-result');

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
            showError(strings.length_invalid || 'Please enter a valid positive number');
            return;
        }

        const fromUnit = fromUnitEl.value;
        const toUnit   = toUnitEl.value;

        if (fromUnit === toUnit) {
            showError(strings.length_same_unit || 'Select different units to convert');
            return;
        }

        const result = convert(value, fromUnit, toUnit);
        showOk(formatResult(value) + ' ' + fromUnit + ' = ' + formatResult(result) + ' ' + toUnit);
    }

    function doReset() {
        inputEl.value = '';
        resultEl.textContent = '';
        resultEl.className = 'length-result';
        fromUnitEl.value = 'm';
        toUnitEl.value   = 'mi';
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

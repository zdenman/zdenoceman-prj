// Volume Calculator — metric and imperial/US conversions
(function () {
    'use strict';

    // Conversion factors: 1 unit = N litres
    const TO_LITRES = {
        m3:      1000,
        dm3:     1,
        cm3:     0.001,
        mm3:     0.000001,
        l:       1,
        dl:      0.1,
        cl:      0.01,
        ml:      0.001,
        gal_us:  3.785411784,
        gal_uk:  4.54609,
        qt:      0.946352946,
        pt:      0.473176473,
        cup:     0.2365882365,
        floz_us: 0.0295735296,
        ft3:     28.316846592,
        in3:     0.016387064
    };

    const UNIT_DISPLAY = {
        m3: 'm³', dm3: 'dm³', cm3: 'cm³', mm3: 'mm³',
        l: 'l', dl: 'dl', cl: 'cl', ml: 'ml',
        gal_us: 'gal', gal_uk: 'gal UK', qt: 'qt', pt: 'pt',
        cup: 'cup', floz_us: 'fl oz', ft3: 'ft³', in3: 'in³'
    };

    function convert(value, fromUnit, toUnit) {
        return (value * TO_LITRES[fromUnit]) / TO_LITRES[toUnit];
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
            menu_volume: 'Volume',
            back_to_grid: 'Back to tools',
            coming_soon: 'Soon',
            menu_open: 'Open menu',
            menu_close: 'Close menu',
            volume_intro: 'Convert between metric and imperial volume units',
            volume_from: 'From',
            volume_to: 'To',
            volume_enter_value: 'Enter value',
            volume_convert: 'Convert',
            volume_reset: 'Reset',
            volume_swap: 'Swap units',
            volume_invalid: 'Please enter a valid positive number',
            volume_same_unit: 'Select different units to convert',
            unit_group_metric: 'Metric',
            unit_group_imperial_us: 'Imperial / US',
            unit_m3: 'cubic meter',
            unit_dm3: 'cubic decimeter',
            unit_cm3: 'cubic centimeter',
            unit_mm3: 'cubic millimeter',
            unit_l: 'liter',
            unit_dl: 'deciliter',
            unit_cl: 'centiliter',
            unit_ml: 'milliliter',
            unit_gal_us: 'gallon US',
            unit_gal_uk: 'gallon UK',
            unit_qt: 'quart US',
            unit_pt: 'pint US',
            unit_cup: 'cup US',
            unit_floz_us: 'fluid ounce US',
            unit_ft3: 'cubic foot',
            unit_in3: 'cubic inch'
        },
        sk: {
            language: 'Jazyk:',
            menu_currency: 'Mena',
            menu_length: 'Dĺžka',
            menu_speed: 'Rýchlosť',
            menu_area: 'Plocha / Pole',
            menu_volume: 'Objem',
            back_to_grid: 'Späť na nástroje',
            coming_soon: 'Čoskoro',
            menu_open: 'Otvoriť menu',
            menu_close: 'Zavrieť menu',
            volume_intro: 'Konvertujte medzi metrickými a imperiálnymi jednotkami objemu',
            volume_from: 'Z',
            volume_to: 'Na',
            volume_enter_value: 'Zadajte hodnotu',
            volume_convert: 'Konvertovať',
            volume_reset: 'Resetovať',
            volume_swap: 'Vymeniť jednotky',
            volume_invalid: 'Zadajte platné kladné číslo',
            volume_same_unit: 'Vyberte rôzne jednotky na konverziu',
            unit_group_metric: 'Metrické',
            unit_group_imperial_us: 'Imperiálne / US',
            unit_m3: 'kubický meter',
            unit_dm3: 'kubický decimeter',
            unit_cm3: 'kubický centimeter',
            unit_mm3: 'kubický milimeter',
            unit_l: 'liter',
            unit_dl: 'deciliter',
            unit_cl: 'centiliter',
            unit_ml: 'mililiter',
            unit_gal_us: 'galón US',
            unit_gal_uk: 'galón UK',
            unit_qt: 'quart US',
            unit_pt: 'pinta US',
            unit_cup: 'pohár US',
            unit_floz_us: 'tekutá unca US',
            unit_ft3: 'kubická stopa',
            unit_in3: 'kubický palec'
        },
        sr: {
            language: 'Jezik:',
            menu_currency: 'Valuta',
            menu_length: 'Dužina',
            menu_speed: 'Brzina',
            menu_area: 'Površina / Polje',
            menu_volume: 'Zapremina',
            back_to_grid: 'Nazad na alate',
            coming_soon: 'Uskoro',
            menu_open: 'Otvori meni',
            menu_close: 'Zatvori meni',
            volume_intro: 'Konvertujte između metričkih i imperijalnih jedinica zapremine',
            volume_from: 'Iz',
            volume_to: 'U',
            volume_enter_value: 'Unesite vrednost',
            volume_convert: 'Konvertuj',
            volume_reset: 'Resetuj',
            volume_swap: 'Zameni jedinice',
            volume_invalid: 'Unesite važeći pozitivni broj',
            volume_same_unit: 'Odaberite različite jedinice za konverziju',
            unit_group_metric: 'Metričko',
            unit_group_imperial_us: 'Imperijalno / US',
            unit_m3: 'kubni metar',
            unit_dm3: 'kubni decimetar',
            unit_cm3: 'kubni centimetar',
            unit_mm3: 'kubni milimetar',
            unit_l: 'litar',
            unit_dl: 'decilitar',
            unit_cl: 'centilitar',
            unit_ml: 'mililitar',
            unit_gal_us: 'galon US',
            unit_gal_uk: 'galon UK',
            unit_qt: 'quart US',
            unit_pt: 'pinta US',
            unit_cup: 'šolja US',
            unit_floz_us: 'tečna unca US',
            unit_ft3: 'kubna stopa',
            unit_in3: 'kubni inč'
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
    const inputEl    = document.getElementById('volume-input');
    const convertBtn = document.getElementById('convert-btn');
    const resetBtn   = document.getElementById('reset-btn');
    const swapBtn    = document.getElementById('swap-btn');
    const resultEl   = document.getElementById('volume-result');

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
            showError(strings.volume_invalid || 'Please enter a valid positive number');
            return;
        }

        const fromUnit = fromUnitEl.value;
        const toUnit   = toUnitEl.value;

        if (fromUnit === toUnit) {
            showError(strings.volume_same_unit || 'Select different units to convert');
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
        fromUnitEl.value = 'l';
        toUnitEl.value   = 'gal_us';
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

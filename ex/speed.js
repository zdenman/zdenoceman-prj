// Speed Calculator — metric ↔ imperial / nautical conversions
(function () {
    'use strict';

    // Conversion factors: 1 unit = N metres per second
    const TO_MS = {
        kmh: 1000 / 3600,   // km/h
        ms:  1,              // m/s
        mph: 1609.344 / 3600,// mph
        kn:  1852 / 3600,   // knot
        fts: 0.3048          // ft/s
    };

    // Display codes shown in result text
    const UNIT_DISPLAY = {
        kmh: 'km/h', ms: 'm/s', mph: 'mph', kn: 'kn', fts: 'ft/s'
    };

    function convert(value, fromUnit, toUnit) {
        return (value * TO_MS[fromUnit]) / TO_MS[toUnit];
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
            speed_intro: 'Convert between metric and imperial speed units',
            speed_from: 'From',
            speed_to: 'To',
            speed_enter_value: 'Enter value',
            speed_convert: 'Convert',
            speed_reset: 'Reset',
            speed_swap: 'Swap units',
            speed_invalid: 'Please enter a valid positive number',
            speed_same_unit: 'Select different units to convert',
            unit_group_metric: 'Metric',
            unit_group_imperial_nautical: 'Imperial / Nautical',
            unit_kmh: 'kilometer per hour', unit_ms: 'meter per second',
            unit_mph: 'mile per hour', unit_kn: 'knot', unit_fts: 'foot per second'
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
            speed_intro: 'Konvertujte medzi metrickými a imperiálnymi jednotkami rýchlosti',
            speed_from: 'Z',
            speed_to: 'Na',
            speed_enter_value: 'Zadajte hodnotu',
            speed_convert: 'Konvertovať',
            speed_reset: 'Resetovať',
            speed_swap: 'Vymeniť jednotky',
            speed_invalid: 'Zadajte platné kladné číslo',
            speed_same_unit: 'Vyberte rôzne jednotky na konverziu',
            unit_group_metric: 'Metrické',
            unit_group_imperial_nautical: 'Imperiálne / námorné',
            unit_kmh: 'kilometer za hodinu', unit_ms: 'meter za sekundu',
            unit_mph: 'míľa za hodinu', unit_kn: 'uzol', unit_fts: 'stopa za sekundu'
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
            speed_intro: 'Konvertujte između metričkih i imperijalnih jedinica brzine',
            speed_from: 'Iz',
            speed_to: 'U',
            speed_enter_value: 'Unesite vrednost',
            speed_convert: 'Konvertuj',
            speed_reset: 'Resetuj',
            speed_swap: 'Zameni jedinice',
            speed_invalid: 'Unesite važeći pozitivni broj',
            speed_same_unit: 'Odaberite različite jedinice za konverziju',
            unit_group_metric: 'Metričko',
            unit_group_imperial_nautical: 'Imperijalno / nautičko',
            unit_kmh: 'kilometar na sat', unit_ms: 'metar u sekundi',
            unit_mph: 'milja na sat', unit_kn: 'čvor', unit_fts: 'stopa u sekundi'
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
    const inputEl    = document.getElementById('speed-input');
    const convertBtn = document.getElementById('convert-btn');
    const resetBtn   = document.getElementById('reset-btn');
    const swapBtn    = document.getElementById('swap-btn');
    const resultEl   = document.getElementById('speed-result');

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
            showError(strings.speed_invalid || 'Please enter a valid positive number');
            return;
        }

        const fromUnit = fromUnitEl.value;
        const toUnit   = toUnitEl.value;

        if (fromUnit === toUnit) {
            showError(strings.speed_same_unit || 'Select different units to convert');
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
        fromUnitEl.value = 'kmh';
        toUnitEl.value   = 'mph';
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

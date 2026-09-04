// Alcohol BAC Calculator — Widmark formula
(function () {
    'use strict';

    // ── Constants ───────────────────────────────────────────────────────────
    const LANGUAGE_STORAGE_KEY = 'preferred_language';
    const SUPPORTED_LANGUAGES = ['en', 'sk', 'sr'];
    const BETA = 0.15;          // ‰ eliminated per hour
    const ETHANOL_DENSITY = 0.789; // g/ml

    const PRESETS = {
        beer_s:  { icon: '🍺', volume: 330,  abv: 4.5,  nameKey: 'alc_preset_beer_s' },
        beer_l:  { icon: '🍺', volume: 500,  abv: 4.5,  nameKey: 'alc_preset_beer_l' },
        wine:    { icon: '🍷', volume: 150,  abv: 12,   nameKey: 'alc_preset_wine'   },
        shot:    { icon: '🥃', volume: 40,   abv: 40,   nameKey: 'alc_preset_shot'   },
        radler:  { icon: '🍹', volume: 500,  abv: 2,    nameKey: 'alc_preset_radler' },
        custom:  { icon: '🥂', volume: null, abv: null, nameKey: 'alc_preset_custom' }
    };

    // ── Translation / Language ──────────────────────────────────────────────
    const FALLBACK = {
        en: {
            language: 'Language:',
            language_select: 'Select language',
            nav_app: 'App navigation',
            menu_currency: 'Currency',
            menu_length: 'Length',
            menu_speed: 'Speed',
            menu_area: 'Area / Field',
            menu_volume: 'Volume',
            menu_bmi: 'BMI',
            menu_alcohol: 'Alcohol',
            back_to_grid: 'Back to tools',
            menu_open: 'Open menu',
            menu_close: 'Close menu',
            alc_intro: 'Blood alcohol calculator — when will you be sober?',
            alc_how_link: 'How it works',
            alc_how_link_aria: 'Open BAC explanation page',
            alc_presets_title: 'Quick add',
            alc_preset_beer_s: 'Small beer',
            alc_preset_beer_l: 'Large beer',
            alc_preset_wine: 'Wine',
            alc_preset_shot: 'Shot',
            alc_preset_radler: 'Radler',
            alc_preset_custom: 'Custom',
            alc_col_time: 'Time',
            alc_col_volume: 'ml',
            alc_col_abv: '%',
            alc_quick_add_aria: 'Quick add drinks',
            alc_drink_list_aria: 'Drinks',
            alc_no_drinks: 'No drinks added yet. Use the buttons above.',
            alc_gender_label: 'Gender',
            alc_gender_m: 'M',
            alc_gender_f: 'F',
            alc_weight: 'Weight (kg)',
            alc_placeholder_weight: 'e.g. 80',
            alc_food: 'Had food?',
            alc_food_no: 'No',
            alc_food_yes: 'Yes',
            alc_calculate: 'Calculate',
            alc_reset: 'Reset',
            alc_your_bac: 'Current BAC',
            alc_status_safe: 'Sober',
            alc_status_caution: 'Caution',
            alc_status_stop: 'Do not drive',
            alc_zero_at: 'Sober at',
            alc_already_zero: 'Already sober',
            alc_future_title: 'Check BAC at a future time',
            alc_future_day_aria: 'Future day selector',
            alc_future_today: 'Today',
            alc_future_tomorrow: 'Tomorrow',
            alc_future_check_btn: 'Check',
            alc_future_bac_at: 'BAC at',
            alc_auto_updated: 'Auto-updated every minute',
            alc_no_drinks_err: 'Add at least one drink.',
            alc_err_weight: 'Enter a valid body weight.',
            alc_legal_note: '',
            alc_remove_aria: 'Remove drink'
        },
        sk: {
            language: 'Jazyk:',
            language_select: 'Vybrať jazyk',
            nav_app: 'Navigácia aplikácie',
            menu_currency: 'Mena',
            menu_length: 'Dĺžka',
            menu_speed: 'Rýchlosť',
            menu_area: 'Plocha / Pole',
            menu_volume: 'Objem',
            menu_bmi: 'BMI',
            menu_alcohol: 'Alkohol',
            back_to_grid: 'Späť na nástroje',
            menu_open: 'Otvoriť menu',
            menu_close: 'Zavrieť menu',
            alc_intro: 'Kalkulátor hladiny alkoholu — kedy budeš triezvy?',
            alc_how_link: 'Ako to funguje',
            alc_how_link_aria: 'Otvoriť stránku s vysvetlením BAC kalkulačky',
            alc_presets_title: 'Rýchle pridanie',
            alc_preset_beer_s: 'Malé pivo',
            alc_preset_beer_l: 'Veľké pivo',
            alc_preset_wine: 'Víno',
            alc_preset_shot: 'Shot',
            alc_preset_radler: 'Radler',
            alc_preset_custom: 'Vlastný',
            alc_col_time: 'Čas',
            alc_col_volume: 'ml',
            alc_col_abv: '%',
            alc_quick_add_aria: 'Rýchle pridanie nápojov',
            alc_drink_list_aria: 'Nápoje',
            alc_no_drinks: 'Zatiaľ žiadne nápoje. Použi tlačidlá vyššie.',
            alc_gender_label: 'Pohlavie',
            alc_gender_m: 'M',
            alc_gender_f: 'Ž',
            alc_weight: 'Hmotnosť (kg)',
            alc_placeholder_weight: 'napr. 80',
            alc_food: 'Jedol si?',
            alc_food_no: 'Nie',
            alc_food_yes: 'Áno',
            alc_calculate: 'Vypočítať',
            alc_reset: 'Resetovať',
            alc_your_bac: 'Aktuálne BAC',
            alc_status_safe: 'Triezvy',
            alc_status_caution: 'Pozor',
            alc_status_stop: 'Nešofuj',
            alc_zero_at: 'Triezvy o',
            alc_already_zero: 'Už triezvy',
            alc_future_title: 'Zisti BAC v budúcom čase',
            alc_future_day_aria: 'Výber dňa pre budúci čas',
            alc_future_today: 'Dnes',
            alc_future_tomorrow: 'Zajtra',
            alc_future_check_btn: 'Skontrolovať',
            alc_future_bac_at: 'BAC o',
            alc_auto_updated: 'Automaticky aktualizované každú minútu',
            alc_no_drinks_err: 'Pridaj aspoň jeden nápoj.',
            alc_err_weight: 'Zadaj platnú telesnú hmotnosť.',
            alc_legal_note: '⚠️ SK/CZ zákonný limit: 0,0 ‰. Kalkulátor je len orientačný — nenahrádza dychový test.',
            alc_remove_aria: 'Odstrániť nápoj'
        },
        sr: {
            language: 'Jezik:',
            language_select: 'Izaberi jezik',
            nav_app: 'Navigacija aplikacije',
            menu_currency: 'Valuta',
            menu_length: 'Dužina',
            menu_speed: 'Brzina',
            menu_area: 'Površina / Polje',
            menu_volume: 'Zapremina',
            menu_bmi: 'BMI',
            menu_alcohol: 'Alkohol',
            back_to_grid: 'Nazad na alate',
            menu_open: 'Otvori meni',
            menu_close: 'Zatvori meni',
            alc_intro: 'Kalkulator alkohola u krvi — kada ćeš biti trijezan?',
            alc_how_link: 'Kako radi',
            alc_how_link_aria: 'Otvori stranicu sa objašnjenjem BAC kalkulatora',
            alc_presets_title: 'Brzo dodaj',
            alc_preset_beer_s: 'Malo pivo',
            alc_preset_beer_l: 'Veliko pivo',
            alc_preset_wine: 'Vino',
            alc_preset_shot: 'Šot',
            alc_preset_radler: 'Radler',
            alc_preset_custom: 'Prilagođeno',
            alc_col_time: 'Vreme',
            alc_col_volume: 'ml',
            alc_col_abv: '%',
            alc_quick_add_aria: 'Brzo dodavanje pića',
            alc_drink_list_aria: 'Pića',
            alc_no_drinks: 'Nema dodanih pića. Koristi dugmiće iznad.',
            alc_gender_label: 'Pol',
            alc_gender_m: 'M',
            alc_gender_f: 'Ž',
            alc_weight: 'Težina (kg)',
            alc_placeholder_weight: 'npr. 80',
            alc_food: 'Jeo si?',
            alc_food_no: 'Ne',
            alc_food_yes: 'Da',
            alc_calculate: 'Izračunaj',
            alc_reset: 'Resetuj',
            alc_your_bac: 'Trenutni BAC',
            alc_status_safe: 'Trijezan',
            alc_status_caution: 'Oprez',
            alc_status_stop: 'Ne vozi',
            alc_zero_at: 'Trijezan u',
            alc_already_zero: 'Već trijezan',
            alc_future_title: 'Provjeri BAC u budućem vremenu',
            alc_future_day_aria: 'Izbor dana za buduće vreme',
            alc_future_today: 'Danas',
            alc_future_tomorrow: 'Sutra',
            alc_future_check_btn: 'Provjeri',
            alc_future_bac_at: 'BAC u',
            alc_auto_updated: 'Automatski ažuriranje svaki minut',
            alc_no_drinks_err: 'Dodaj bar jedno piće.',
            alc_err_weight: 'Unesi validnu tjelesnu težinu.',
            alc_legal_note: '⚠️ Proveri zakonski limit u svojoj zemlji. Kalkulator je samo orijentacioni — ne zamjenjuje alkotest.',
            alc_remove_aria: 'Ukloni piće'
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
        // Update all remove buttons in drink rows
        document.querySelectorAll('.alc-remove-btn').forEach(btn => {
            btn.setAttribute('aria-label', strings.alc_remove_aria || 'Remove');
        });
        const legalNote = document.getElementById('alc-legal-note');
        if (legalNote) {
            const noteText = strings.alc_legal_note || '';
            legalNote.hidden = !noteText.trim();
        }
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

    // ── Drink list state ────────────────────────────────────────────────────
    let drinks = [];     // { id, icon, nameKey, volume, abv, timeMin }
    let nextId = 1;

    function nowMinutes() {
        const d = new Date();
        return d.getHours() * 60 + d.getMinutes() + (d.getSeconds() / 60);
    }

    function currentTimeString() {
        const d = new Date();
        return String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
    }

    // Resolve HH:MM string to absolute minutes since midnight.
    // If the stored time is greater than now, assume yesterday (midnight crossover).
    function resolveTimeMinutes(hmStr) {
        const [h, m] = hmStr.split(':').map(Number);
        const val = h * 60 + m;
        const now = nowMinutes();
        if (val > now) {
            // assume yesterday
            return val - 1440;
        }
        return val;
    }

    function addDrink(presetKey) {
        const preset = PRESETS[presetKey] || PRESETS.custom;
        const id = nextId++;
        const drink = {
            id,
            icon: preset.icon,
            nameKey: preset.nameKey,
            volume: preset.volume,
            abv: preset.abv,
            timeStr: currentTimeString()
        };
        drinks.push(drink);
        renderDrinkList();
        clearResult();
    }

    function removeDrink(id) {
        drinks = drinks.filter(d => d.id !== id);
        renderDrinkList();
        clearResult();
    }

    function renderDrinkList() {
        const list = document.getElementById('drink-list');
        const emptyMsg = document.getElementById('alc-empty-msg');
        list.innerHTML = '';

        if (drinks.length === 0) {
            emptyMsg.hidden = false;
            return;
        }
        emptyMsg.hidden = true;

        drinks.forEach(function (drink) {
            const row = document.createElement('div');
            row.className = 'alc-drink-row';
            row.setAttribute('role', 'listitem');
            row.dataset.id = drink.id;

            const name = strings[drink.nameKey] || drink.nameKey;

            row.innerHTML =
                '<input type="time" class="length-input alc-time-input alc-drink-time" value="' + drink.timeStr + '" aria-label="' + (strings.alc_col_time || 'Time') + '">' +
                '<span class="alc-drink-icon">' + drink.icon + '</span>' +
                '<span class="alc-drink-name">' + name + '</span>' +
                '<div class="alc-input-cell">' +
                    '<span class="alc-input-unit">' + (strings.alc_col_volume || 'ml') + '</span>' +
                    '<input type="number" class="length-input alc-num-input alc-drink-volume" value="' + (drink.volume !== null ? drink.volume : '') + '" min="1" max="2000" step="1" placeholder="' + (strings.alc_col_volume || 'ml') + '" aria-label="' + (strings.alc_col_volume || 'ml') + '">' +
                '</div>' +
                '<div class="alc-input-cell">' +
                    '<span class="alc-input-unit">' + (strings.alc_col_abv || '%') + '</span>' +
                    '<input type="number" class="length-input alc-num-input alc-drink-abv" value="' + (drink.abv !== null ? drink.abv : '') + '" min="0.1" max="96" step="0.1" placeholder="' + (strings.alc_col_abv || '%') + '" aria-label="' + (strings.alc_col_abv || '%') + '">' +
                '</div>' +
                '<button type="button" class="alc-remove-btn" aria-label="' + (strings.alc_remove_aria || 'Remove') + '">×</button>';

            // Sync inputs back to state
            row.querySelector('.alc-drink-time').addEventListener('change', function () {
                drink.timeStr = this.value;
                clearResult();
            });
            row.querySelector('.alc-drink-volume').addEventListener('input', function () {
                drink.volume = parseFloat(this.value) || null;
                clearResult();
            });
            row.querySelector('.alc-drink-abv').addEventListener('input', function () {
                drink.abv = parseFloat(this.value) || null;
                clearResult();
            });
            row.querySelector('.alc-remove-btn').addEventListener('click', function () {
                removeDrink(drink.id);
            });

            list.appendChild(row);
        });
    }

    // ── Profile state ───────────────────────────────────────────────────────
    let isMale = true;
    let hadFood = true;
    let futureDayOffset = 0;

    const btnMale   = document.getElementById('btn-male');
    const btnFemale = document.getElementById('btn-female');
    const btnNoFood = document.getElementById('btn-no-food');
    const btnYesFood = document.getElementById('btn-yes-food');
    const btnFutureToday = document.getElementById('future-day-today');
    const btnFutureTomorrow = document.getElementById('future-day-tomorrow');

    function setGender(male) {
        isMale = male;
        btnMale.classList.toggle('alc-gender-btn--active', male);
        btnFemale.classList.toggle('alc-gender-btn--active', !male);
        clearResult();
    }
    function setFood(ate) {
        hadFood = ate;
        btnYesFood.classList.toggle('alc-food-btn--active', ate);
        btnNoFood.classList.toggle('alc-food-btn--active', !ate);
        clearResult();
    }
    function setFutureDay(dayOffset) {
        futureDayOffset = dayOffset;
        if (btnFutureToday) btnFutureToday.classList.toggle('alc-future-day-btn--active', dayOffset === 0);
        if (btnFutureTomorrow) btnFutureTomorrow.classList.toggle('alc-future-day-btn--active', dayOffset === 1);
        const futureResult = document.getElementById('alc-future-result');
        if (futureResult) futureResult.textContent = '';
    }

    if (btnMale)    btnMale.addEventListener('click', function () { setGender(true); });
    if (btnFemale)  btnFemale.addEventListener('click', function () { setGender(false); });
    if (btnNoFood)  btnNoFood.addEventListener('click', function () { setFood(false); });
    if (btnYesFood) btnYesFood.addEventListener('click', function () { setFood(true); });
    if (btnFutureToday) btnFutureToday.addEventListener('click', function () { setFutureDay(0); });
    if (btnFutureTomorrow) btnFutureTomorrow.addEventListener('click', function () { setFutureDay(1); });

    // ── BAC formula (Widmark — cumulative simulation) ──────────────────────
    // Alcohol is absorbed linearly over 30/60 minutes, but elimination happens
    // once for the total BAC, not once per drink. We simulate minute-by-minute.
    function createDrinkProfile(weightKg, drink, absorptionMin, r) {
        var alcG = drink.volume * (drink.abv / 100) * ETHANOL_DENSITY;
        var peakBAC = alcG / (weightKg * r);
        var startMin = resolveTimeMinutes(drink.timeStr);
        return {
            startMin: startMin,
            peakMin: startMin + absorptionMin,
            peakBAC: peakBAC
        };
    }

    function absorbedDelta(profile, minuteStart, minuteEnd) {
        if (minuteEnd <= profile.startMin || minuteStart >= profile.peakMin) return 0;
        var overlapStart = Math.max(minuteStart, profile.startMin);
        var overlapEnd = Math.min(minuteEnd, profile.peakMin);
        if (overlapEnd <= overlapStart) return 0;
        return profile.peakBAC * ((overlapEnd - overlapStart) / (profile.peakMin - profile.startMin));
    }

    function buildBACatTime(weightKg, targetTimeMin) {
        const r = isMale ? 0.7 : 0.6;
        const absorptionMin = hadFood ? 60 : 30;
        if (!drinks.length) return 0;

        var profiles = drinks.map(function (drink) {
            return createDrinkProfile(weightKg, drink, absorptionMin, r);
        });
        var startMin = profiles.reduce(function (min, profile) {
            return Math.min(min, profile.startMin);
        }, targetTimeMin);
        var bac = 0;
        var minute = Math.floor(startMin);
        var target = targetTimeMin;

        while (minute < target) {
            var nextMinute = Math.min(minute + 1, target);
            profiles.forEach(function (profile) {
                bac += absorbedDelta(profile, minute, nextMinute);
            });
            bac = Math.max(0, bac - BETA * ((nextMinute - minute) / 60));
            minute = nextMinute;
        }

        return bac;
    }

    // Returns minutes-since-midnight when total BAC reaches 0.
    // Scans forward in 1-min steps from earliest peak until BAC hits 0.
    function computeZeroTime(weightKg) {
        const absorptionMin = hadFood ? 60 : 30;

        // Find the latest peak time — BAC will be monotonically falling after it
        var lastPeakMin = -Infinity;
        drinks.forEach(function (drink) {
            var peakMin = resolveTimeMinutes(drink.timeStr) + absorptionMin;
            if (peakMin > lastPeakMin) lastPeakMin = peakMin;
        });
        if (!isFinite(lastPeakMin)) return -Infinity;

        var bacAtLastPeak = buildBACatTime(weightKg, lastPeakMin);
        if (bacAtLastPeak <= 0) return lastPeakMin;
        // After last peak: steady decline at β
        return lastPeakMin + (bacAtLastPeak / BETA) * 60;
    }

    function minutesToTimeStr(totalMin) {
        // Handle multi-day wrap: normalise to 0–2879 (0 to next-day 23:59)
        let m = totalMin % 1440;
        if (m < 0) m += 1440;
        const h = Math.floor(m / 60);
        const min = Math.round(m % 60);
        return String(h).padStart(2, '0') + ':' + String(min).padStart(2, '0');
    }

    // ── Result rendering ────────────────────────────────────────────────────
    const resultCard   = document.getElementById('alc-result-card');
    const bacValueEl   = document.getElementById('alc-bac-value');
    const statusBadge  = document.getElementById('alc-status-badge');
    const zeroTimeEl   = document.getElementById('alc-zero-time');
    const futureSection = document.getElementById('alc-future-section');

    function getBacStatus(bac) {
        if (bac <= 0.01) return { key: 'alc_status_safe',    color: '#22c55e' };
        if (bac < 0.5)   return { key: 'alc_status_caution', color: '#f59e0b' };
        return                  { key: 'alc_status_stop',    color: '#ef4444' };
    }

    function showResult(weightKg) {
        const nowMin = nowMinutes();
        const bac    = buildBACatTime(weightKg, nowMin);
        const status = getBacStatus(bac);

        bacValueEl.textContent  = bac.toFixed(2) + ' ‰';
        bacValueEl.style.color  = status.color;
        statusBadge.textContent = strings[status.key] || status.key;
        statusBadge.style.background = status.color;

        const zeroMin = computeZeroTime(weightKg);
        if (zeroMin <= nowMin) {
            zeroTimeEl.textContent = strings.alc_already_zero || 'Already sober';
        } else {
            zeroTimeEl.textContent = minutesToTimeStr(zeroMin);
        }

        resultCard.hidden = false;
        futureSection.hidden = false;
    }

    function clearResult() {
        resultCard.hidden = true;
        if (futureSection) futureSection.hidden = true;
        const futureResult = document.getElementById('alc-future-result');
        if (futureResult) futureResult.textContent = '';
    }

    function showError(msgKey) {
        clearResult();
        const zeroRow = document.getElementById('alc-zero-row');
        bacValueEl.textContent = strings[msgKey] || 'Error';
        bacValueEl.style.color = 'var(--accent-error)';
        statusBadge.textContent = '';
        statusBadge.style.background = 'transparent';
        zeroTimeEl.textContent = '—';
        resultCard.hidden = false;
        if (zeroRow) zeroRow.hidden = true;
    }

    function doCalculate() {
        const weightKg = parseFloat(document.getElementById('body-weight').value);
        if (!weightKg || weightKg <= 0 || isNaN(weightKg)) {
            showError('alc_err_weight');
            const zeroRow = document.getElementById('alc-zero-row');
            if (zeroRow) zeroRow.hidden = true;
            resultCard.hidden = false;
            return;
        }
        if (drinks.length === 0) {
            showError('alc_no_drinks_err');
            const zeroRow = document.getElementById('alc-zero-row');
            if (zeroRow) zeroRow.hidden = true;
            resultCard.hidden = false;
            return;
        }

        // Validate all drink rows
        for (let i = 0; i < drinks.length; i++) {
            if (!drinks[i].volume || !drinks[i].abv) {
                showError('alc_no_drinks_err');
                const zeroRow = document.getElementById('alc-zero-row');
                if (zeroRow) zeroRow.hidden = true;
                resultCard.hidden = false;
                return;
            }
        }

        const zeroRow = document.getElementById('alc-zero-row');
        if (zeroRow) zeroRow.hidden = false;
        showResult(weightKg);
    }

    function doReset() {
        drinks = [];
        renderDrinkList();
        clearResult();
        document.getElementById('body-weight').value = '';
        document.getElementById('future-time').value = '';
        setFutureDay(0);
        const futureResult = document.getElementById('alc-future-result');
        if (futureResult) futureResult.textContent = '';
    }

    document.getElementById('calc-btn').addEventListener('click', doCalculate);
    document.getElementById('reset-btn').addEventListener('click', doReset);

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Enter') doCalculate();
    });

    // ── Preset chips ────────────────────────────────────────────────────────
    document.querySelectorAll('.alc-chip').forEach(function (btn) {
        btn.addEventListener('click', function () {
            addDrink(btn.dataset.preset);
        });
    });

    // ── Future BAC check ────────────────────────────────────────────────────
    document.getElementById('future-btn').addEventListener('click', function () {
        const weightKg = parseFloat(document.getElementById('body-weight').value);
        if (!weightKg || weightKg <= 0 || isNaN(weightKg) || drinks.length === 0) return;

        const futureTimeStr = document.getElementById('future-time').value;
        if (!futureTimeStr) return;

        const [fh, fm] = futureTimeStr.split(':').map(Number);
        let futureMin = fh * 60 + fm + (futureDayOffset * 1440);
        const nowMin = nowMinutes();
        if (futureDayOffset === 0 && futureMin < nowMin) {
            futureMin = fh * 60 + fm + 1440;
        }

        const futureBac = buildBACatTime(weightKg, futureMin);
        const status    = getBacStatus(futureBac);
        const futureResult = document.getElementById('alc-future-result');
        const dayLabel = futureDayOffset === 0
            ? (strings.alc_future_today || 'Today')
            : (strings.alc_future_tomorrow || 'Tomorrow');

        futureResult.innerHTML =
            '<span class="alc-future-label">' + (strings.alc_future_bac_at || 'BAC at') + ' ' + dayLabel.toLowerCase() + ' ' + futureTimeStr + ':</span>' +
            '<span class="alc-future-value" style="color:' + status.color + '">' + futureBac.toFixed(2) + ' ‰</span>' +
            '<span class="alc-future-badge" style="background:' + status.color + '">' + (strings[status.key] || '') + '</span>';
    });

    // ── Auto-refresh every 60s ──────────────────────────────────────────────
    setInterval(function () {
        if (resultCard.hidden) return;
        const weightKg = parseFloat(document.getElementById('body-weight').value);
        if (!weightKg || weightKg <= 0 || isNaN(weightKg)) return;
        showResult(weightKg);
    }, 60000);

})();

// Script for placeholder calculator pages
// Handles translations, hamburger menu toggle, and language persistence

(function () {
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
            menu_alcohol: 'Alcohol',
            coming_soon: 'Soon',
            back_home: 'Back to Currency',
            menu_open: 'Open menu',
            menu_close: 'Close menu',
            page_length_title: 'Length Calculator',
            page_speed_title: 'Speed Calculator',
            page_area_title: 'Area / Field Calculator'
        },
        sk: {
            language: 'Jazyk:',
            menu_currency: 'Mena',
            menu_length: 'Dĺžka',
            menu_speed: 'Rýchlosť',
            menu_area: 'Plocha / Pole',
            menu_volume: 'Objem',
            menu_bmi: 'BMI',
            menu_alcohol: 'Alkohol',
            coming_soon: 'Čoskoro',
            back_home: 'Späť na kalkulačku',
            menu_open: 'Otvoriť menu',
            menu_close: 'Zavrieť menu',
            page_length_title: 'Kalkulačka dĺžky',
            page_speed_title: 'Kalkulačka rýchlosti',
            page_area_title: 'Kalkulačka plochy'
        },
        sr: {
            language: 'Jezik:',
            menu_currency: 'Valuta',
            menu_length: 'Dužina',
            menu_speed: 'Brzina',
            menu_area: 'Površina / Polje',
            menu_volume: 'Zapremina',
            menu_bmi: 'BMI',
            menu_alcohol: 'Alkohol',
            coming_soon: 'Uskoro',
            back_home: 'Nazad na valutu',
            menu_open: 'Otvori meni',
            menu_close: 'Zatvori meni',
            page_length_title: 'Kalkulator dužine',
            page_speed_title: 'Kalkulator brzine',
            page_area_title: 'Kalkulator površine'
        }
    };

    let strings = FALLBACK.en;

    function applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (strings[key]) el.textContent = strings[key];
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(el => {
            const key = el.getAttribute('data-i18n-aria-label');
            if (strings[key]) el.setAttribute('aria-label', strings[key]);
        });
        document.querySelector('html').lang = currentLang;
    }

    let currentLang = 'en';

    function loadLang(lang) {
        currentLang = lang;
        strings = FALLBACK[lang] || FALLBACK.en;
        applyTranslations();

        const controller = new AbortController();
        const tid = setTimeout(() => controller.abort(), 4000);
        fetch(`./translations/${lang}.json`, { signal: controller.signal })
            .then(r => { clearTimeout(tid); if (!r.ok) throw new Error(); return r.json(); })
            .then(data => { strings = { ...strings, ...data }; applyTranslations(); })
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

    // Init language
    loadLang(detectLang());

    // Language switcher
    const languageSelect = document.getElementById('language-select');
    if (languageSelect) {
        languageSelect.value = currentLang;
        languageSelect.addEventListener('change', (e) => {
            const lang = e.target.value;
            localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
            loadLang(lang);
        });
    }

    // Hamburger menu toggle
    const menuToggle = document.getElementById('menu-toggle');
    const navMenu = document.getElementById('nav-menu');

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

        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            menuToggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
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
})();

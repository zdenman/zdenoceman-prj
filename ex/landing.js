(function () {
    const LANGUAGE_STORAGE_KEY = 'preferred_language';
    const SUPPORTED_LANGUAGES = ['en', 'sk', 'sr'];
    const FALLBACK = {
        en: {
            language: 'Language:',
            language_select: 'Select language',
            menu_currency: 'Currency',
            menu_calculator: 'Calculator',
            menu_length: 'Length',
            menu_speed: 'Speed',
            menu_area: 'Area / Field',
            menu_volume: 'Volume',
            menu_bmi: 'BMI',
            menu_alcohol: 'Alcohol',
            menu_settings: 'Settings',
            menu_open: 'Open menu',
            menu_close: 'Close menu',
            landing_title: 'Pocket Calculators',
            landing_intro: 'Fast calculators and converters for everyday use, with direct offline access to every tool.',
            landing_open: 'Open',
            landing_currency_desc: 'Live and cached exchange conversion with offline fallback.',
            landing_calculator_desc: 'Classic calculator with reusable result history on the screen.',
            landing_length_desc: 'Metric and imperial length conversion in one place.',
            landing_speed_desc: 'Convert km/h, mph, knots, and more.',
            landing_area_desc: 'Field, hectare, acre, and square-unit conversions.',
            landing_volume_desc: 'Metric and imperial volume units, from ml to gallons.',
            landing_bmi_desc: 'Calculate BMI and review category guidance instantly.',
            landing_alcohol_desc: 'Estimate BAC trends, sober time, and future checks.'
        },
        sk: {
            language: 'Jazyk:',
            language_select: 'Vybrať jazyk',
            menu_currency: 'Mena',
            menu_calculator: 'Kalkulačka',
            menu_length: 'Dĺžka',
            menu_speed: 'Rýchlosť',
            menu_area: 'Plocha / Pole',
            menu_volume: 'Objem',
            menu_bmi: 'BMI',
            menu_alcohol: 'Alkohol',
            menu_settings: 'Nastavenia',
            menu_open: 'Otvoriť menu',
            menu_close: 'Zavrieť menu',
            landing_title: 'Vreckové kalkulačky',
            landing_intro: 'Rýchle kalkulačky a konvertory na každý deň s priamym offline prístupom ku každému nástroju.',
            landing_open: 'Otvoriť',
            landing_currency_desc: 'Konverzia mien so živými aj uloženými kurzami a offline zálohou.',
            landing_calculator_desc: 'Klasická kalkulačka so znovupoužiteľnými výsledkami priamo na displeji.',
            landing_length_desc: 'Metrické aj imperiálne prevody dĺžky na jednom mieste.',
            landing_speed_desc: 'Prepočítaj km/h, mph, uzly a ďalšie jednotky.',
            landing_area_desc: 'Prevod poľa, hektárov, akrov a štvorcových jednotiek.',
            landing_volume_desc: 'Metrické aj imperiálne jednotky objemu od ml po galóny.',
            landing_bmi_desc: 'Vypočítaj BMI a hneď si pozri kategóriu aj vysvetlenie.',
            landing_alcohol_desc: 'Odhad BAC, času vytriezvenia a budúcej kontroly.'
        },
        sr: {
            language: 'Jezik:',
            language_select: 'Izaberi jezik',
            menu_currency: 'Valuta',
            menu_calculator: 'Kalkulator',
            menu_length: 'Dužina',
            menu_speed: 'Brzina',
            menu_area: 'Površina / Polje',
            menu_volume: 'Zapremina',
            menu_bmi: 'BMI',
            menu_alcohol: 'Alkohol',
            menu_settings: 'Podešavanja',
            menu_open: 'Otvori meni',
            menu_close: 'Zatvori meni',
            landing_title: 'Džepni kalkulatori',
            landing_intro: 'Brzi kalkulatori i konvertori za svakodnevnu upotrebu, sa direktnim offline pristupom svakom alatu.',
            landing_open: 'Otvori',
            landing_currency_desc: 'Konverzija valuta sa živim i sačuvanim kursevima i offline rezervom.',
            landing_calculator_desc: 'Klasični kalkulator sa ponovnom upotrebom rezultata direktno na ekranu.',
            landing_length_desc: 'Metričke i imperijalne konverzije dužine na jednom mestu.',
            landing_speed_desc: 'Konvertuj km/h, mph, čvorove i druge jedinice.',
            landing_area_desc: 'Konverzije polja, hektara, akri i kvadratnih jedinica.',
            landing_volume_desc: 'Metričke i imperijalne jedinice zapremine, od ml do galona.',
            landing_bmi_desc: 'Izračunaj BMI i odmah pregledaj kategoriju i objašnjenje.',
            landing_alcohol_desc: 'Proceni BAC, vreme otrežnjenja i buduće provere.'
        }
    };

    let currentLanguage = 'en';
    let strings = FALLBACK.en;

    function hideSplashScreen() {
        const splash = document.getElementById('app-splash');
        if (!splash || splash.classList.contains('is-hidden')) {
            document.body.classList.remove('app-loading');
            return;
        }

        splash.classList.add('is-hidden');
        document.body.classList.remove('app-loading');

        const removeSplash = () => splash.remove();
        splash.addEventListener('transitionend', removeSplash, { once: true });
        window.setTimeout(removeSplash, 700);
    }

    function t(key) {
        return strings[key] || key;
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
        document.title = t('landing_title');

        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
            metaDescription.content = t('landing_intro');
        }

        const menuToggle = document.getElementById('menu-toggle');
        if (menuToggle && menuToggle.getAttribute('aria-expanded') !== 'true') {
            menuToggle.setAttribute('aria-label', t('menu_open'));
        }

        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = currentLanguage;
        }
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

    function initializeMenu() {
        const menuToggle = document.getElementById('menu-toggle');
        const navMenu = document.getElementById('nav-menu');

        if (!menuToggle || !navMenu) {
            return;
        }

        function openMenu() {
            navMenu.hidden = false;
            menuToggle.setAttribute('aria-expanded', 'true');
            menuToggle.setAttribute('aria-label', t('menu_close'));
        }

        function closeMenu() {
            navMenu.hidden = true;
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.setAttribute('aria-label', t('menu_open'));
        }

        menuToggle.addEventListener('click', event => {
            event.stopPropagation();
            const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
            if (isExpanded) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        document.addEventListener('click', event => {
            if (!navMenu.hidden && !navMenu.contains(event.target) && event.target !== menuToggle) {
                closeMenu();
            }
        });

        document.addEventListener('keydown', event => {
            if (event.key === 'Escape' && !navMenu.hidden) {
                closeMenu();
                menuToggle.focus();
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        initializeMenu();

        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', event => {
                const language = event.target.value;
                localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
                loadLanguage(language);
            });
        }

        loadLanguage(detectLanguage());
        window.setTimeout(hideSplashScreen, 1450);
    });
})();
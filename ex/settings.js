(function () {
    'use strict';

    const preferences = window.AppPreferences;
    const FALLBACK = {
        en: {
            back_to_grid: 'Back to tools',
            landing_open: 'Open',
            settings_title: 'Settings',
            settings_intro: 'Choose app language and accent color. Manual settings override automatic device detection.',
            settings_language_label: 'Language',
            settings_language_help: 'If you do not choose one, the app follows your device or browser language.',
            settings_accent_label: 'Accent color',
            settings_accent_help: 'This color is used for buttons, highlights, and focus states across the app.',
            settings_accent_reset: 'Reset accent',
            settings_preview_chip: 'Accent preview',
            settings_lang_en: 'English',
            settings_lang_sk: 'Slovak',
            settings_lang_sr: 'Serbian'
        },
        sk: {
            back_to_grid: 'Späť na nástroje',
            landing_open: 'Otvoriť',
            settings_title: 'Nastavenia',
            settings_intro: 'Vyber jazyk aplikácie a akcentovú farbu. Ručné nastavenia majú prednosť pred automatickou detekciou zariadenia.',
            settings_language_label: 'Jazyk',
            settings_language_help: 'Ak nič ručne nevyberieš, aplikácia sa riadi jazykom zariadenia alebo prehliadača.',
            settings_accent_label: 'Akcentová farba',
            settings_accent_help: 'Táto farba sa používa pre tlačidlá, zvýraznenia a focus stavy v celej aplikácii.',
            settings_accent_reset: 'Obnoviť akcent',
            settings_preview_chip: 'Ukážka akcentu',
            settings_lang_en: 'Angličtina',
            settings_lang_sk: 'Slovenčina',
            settings_lang_sr: 'Srbčina'
        },
        sr: {
            back_to_grid: 'Nazad na alate',
            landing_open: 'Otvori',
            settings_title: 'Podešavanja',
            settings_intro: 'Izaberi jezik aplikacije i akcentnu boju. Ručna podešavanja imaju prednost nad automatskom detekcijom jezika uređaja.',
            settings_language_label: 'Jezik',
            settings_language_help: 'Ako ništa ne izabereš ručno, aplikacija prati jezik uređaja ili pregledača.',
            settings_accent_label: 'Akcentna boja',
            settings_accent_help: 'Ova boja se koristi za dugmad, isticanja i focus stanja kroz celu aplikaciju.',
            settings_accent_reset: 'Vrati podrazumevani akcenat',
            settings_preview_chip: 'Pregled akcenta',
            settings_lang_en: 'Engleski',
            settings_lang_sk: 'Slovački',
            settings_lang_sr: 'Srpski'
        }
    };

    let currentLanguage = 'en';
    let strings = FALLBACK.en;

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

        document.documentElement.lang = currentLanguage;
        document.title = t('settings_title');

        const languageSelect = document.getElementById('settings-language-select');
        if (languageSelect) {
            languageSelect.value = currentLanguage;
        }
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

    function syncAccentControls(color) {
        const accentInput = document.getElementById('settings-accent-input');
        const accentCode = document.getElementById('settings-accent-code');
        const normalized = preferences.normalizeHex(color) || preferences.DEFAULT_ACCENT;

        if (accentInput) {
            accentInput.value = normalized;
        }

        if (accentCode) {
            accentCode.textContent = normalized.toUpperCase();
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        const detectedLanguage = preferences.detectPreferredLanguage();
        loadLanguage(detectedLanguage);
        syncAccentControls(preferences.getStoredAccent());

        const languageSelect = document.getElementById('settings-language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', event => {
                const language = preferences.setLanguage(event.target.value);
                loadLanguage(language);
            });
        }

        const accentInput = document.getElementById('settings-accent-input');
        if (accentInput) {
            accentInput.addEventListener('input', event => {
                const color = preferences.setAccent(event.target.value);
                syncAccentControls(color);
            });
        }

        const accentReset = document.getElementById('settings-accent-reset');
        if (accentReset) {
            accentReset.addEventListener('click', () => {
                const color = preferences.clearAccent();
                syncAccentControls(color);
            });
        }
    });

    window.addEventListener('app:accent-changed', event => {
        syncAccentControls(event.detail?.color || preferences.DEFAULT_ACCENT);
    });

    window.addEventListener('app:language-changed', event => {
        loadLanguage(event.detail?.language || preferences.detectPreferredLanguage());
    });
})();
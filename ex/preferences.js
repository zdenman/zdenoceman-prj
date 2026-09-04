(function () {
    'use strict';

    const LANGUAGE_STORAGE_KEY = 'preferred_language';
    const ACCENT_STORAGE_KEY = 'preferred_accent';
    const SUPPORTED_LANGUAGES = ['en', 'sk', 'sr'];
    const DEFAULT_ACCENT = '#3b82f6';

    function normalizeHex(color) {
        if (typeof color !== 'string') {
            return null;
        }

        let value = color.trim();
        if (!value) {
            return null;
        }

        if (!value.startsWith('#')) {
            value = `#${value}`;
        }

        if (/^#([0-9a-fA-F]{3})$/.test(value)) {
            value = `#${value.slice(1).split('').map(char => char + char).join('')}`;
        }

        if (!/^#([0-9a-fA-F]{6})$/.test(value)) {
            return null;
        }

        return value.toLowerCase();
    }

    function hexToRgb(color) {
        const normalized = normalizeHex(color);
        if (!normalized) {
            return null;
        }

        return {
            r: parseInt(normalized.slice(1, 3), 16),
            g: parseInt(normalized.slice(3, 5), 16),
            b: parseInt(normalized.slice(5, 7), 16)
        };
    }

    function rgbToHex(red, green, blue) {
        return `#${[red, green, blue]
            .map(value => Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0'))
            .join('')}`;
    }

    function mixColors(baseColor, mixColor, weight) {
        const base = hexToRgb(baseColor);
        const mix = hexToRgb(mixColor);
        const safeWeight = Math.max(0, Math.min(1, weight));

        if (!base || !mix) {
            return DEFAULT_ACCENT;
        }

        return rgbToHex(
            base.r + ((mix.r - base.r) * safeWeight),
            base.g + ((mix.g - base.g) * safeWeight),
            base.b + ((mix.b - base.b) * safeWeight)
        );
    }

    function dispatchPreferenceEvent(name, detail) {
        window.dispatchEvent(new CustomEvent(name, { detail }));
    }

    function getStoredLanguage() {
        try {
            const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
            return SUPPORTED_LANGUAGES.includes(stored) ? stored : null;
        } catch {
            return null;
        }
    }

    function detectPreferredLanguage() {
        const storedLanguage = getStoredLanguage();
        if (storedLanguage) {
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

    function setLanguage(language) {
        const nextLanguage = SUPPORTED_LANGUAGES.includes(language) ? language : 'en';

        try {
            localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
        } catch {
            // Ignore storage write failures and still return the requested language.
        }

        dispatchPreferenceEvent('app:language-changed', { language: nextLanguage });
        return nextLanguage;
    }

    function clearLanguage() {
        try {
            localStorage.removeItem(LANGUAGE_STORAGE_KEY);
        } catch {
            // Ignore storage write failures and still fall back to detected language.
        }

        const detectedLanguage = detectPreferredLanguage();
        dispatchPreferenceEvent('app:language-changed', { language: detectedLanguage });
        return detectedLanguage;
    }

    function getStoredAccent() {
        try {
            return normalizeHex(localStorage.getItem(ACCENT_STORAGE_KEY)) || DEFAULT_ACCENT;
        } catch {
            return DEFAULT_ACCENT;
        }
    }

    function applyAccent(color) {
        const primary = normalizeHex(color) || DEFAULT_ACCENT;
        const secondary = mixColors(primary, '#ffffff', 0.22);
        const primaryRgb = hexToRgb(primary);
        const secondaryRgb = hexToRgb(secondary);
        const root = document.documentElement;

        root.style.setProperty('--accent-primary', primary);
        root.style.setProperty('--accent-secondary', secondary);
        root.style.setProperty('--accent-primary-rgb', `${primaryRgb.r}, ${primaryRgb.g}, ${primaryRgb.b}`);
        root.style.setProperty('--accent-secondary-rgb', `${secondaryRgb.r}, ${secondaryRgb.g}, ${secondaryRgb.b}`);
    }

    function setAccent(color) {
        const normalized = normalizeHex(color) || DEFAULT_ACCENT;

        try {
            localStorage.setItem(ACCENT_STORAGE_KEY, normalized);
        } catch {
            // Ignore storage write failures and still apply the accent for the active page.
        }

        applyAccent(normalized);
        dispatchPreferenceEvent('app:accent-changed', { color: normalized });
        return normalized;
    }

    function clearAccent() {
        try {
            localStorage.removeItem(ACCENT_STORAGE_KEY);
        } catch {
            // Ignore storage write failures and still apply the default accent.
        }

        applyAccent(DEFAULT_ACCENT);
        dispatchPreferenceEvent('app:accent-changed', { color: DEFAULT_ACCENT });
        return DEFAULT_ACCENT;
    }

    window.AppPreferences = Object.freeze({
        LANGUAGE_STORAGE_KEY,
        ACCENT_STORAGE_KEY,
        SUPPORTED_LANGUAGES,
        DEFAULT_ACCENT,
        normalizeHex,
        detectPreferredLanguage,
        getStoredLanguage,
        setLanguage,
        clearLanguage,
        getStoredAccent,
        applyAccent,
        setAccent,
        clearAccent
    });

    applyAccent(getStoredAccent());

    window.addEventListener('storage', event => {
        if (event.key === ACCENT_STORAGE_KEY) {
            applyAccent(event.newValue || DEFAULT_ACCENT);
        }

        if (event.key === LANGUAGE_STORAGE_KEY) {
            dispatchPreferenceEvent('app:language-changed', { language: detectPreferredLanguage() });
        }
    });
})();
(function () {
    'use strict';

    const MOBILE_BREAKPOINT = '(max-width: 768px)';
    const TOUCH_QUERY = '(hover: none) and (pointer: coarse)';
    const CLOSE_LABELS = {
        en: 'Close',
        sk: 'Zavriet',
        sr: 'Zatvori'
    };

    let overlayEl = null;
    let titleEl = null;
    let labelEl = null;
    let closeButtonEl = null;
    let groupsEl = null;
    let activeSelect = null;
    let activeTrigger = null;
    let lastFocusedElement = null;

    function isMobilePickerViewport() {
        return window.matchMedia(MOBILE_BREAKPOINT).matches || window.matchMedia(TOUCH_QUERY).matches;
    }

    function getLang() {
        const lang = (document.documentElement.lang || 'en').toLowerCase().split('-')[0];
        return CLOSE_LABELS[lang] ? lang : 'en';
    }

    function getCloseLabel() {
        return CLOSE_LABELS[getLang()];
    }

    function getAssociatedLabel(selectEl) {
        if (!selectEl || !selectEl.id) return '';
        const label = document.querySelector('label[for="' + selectEl.id + '"]');
        return label ? label.textContent.trim() : '';
    }

    function getSelectedOption(selectEl) {
        return selectEl && selectEl.selectedOptions ? selectEl.selectedOptions[0] : null;
    }

    function getGroupLabel(optionEl) {
        if (!optionEl || !optionEl.parentElement || optionEl.parentElement.tagName !== 'OPTGROUP') return '';
        return optionEl.parentElement.label || '';
    }

    function parseOptionText(text) {
        const match = String(text || '').match(/^(.*)\s\(([^)]+)\)$/);
        if (!match) {
            return { primary: String(text || '').trim(), secondary: '' };
        }

        return {
            primary: match[1].trim(),
            secondary: match[2].trim()
        };
    }

    function ensureDialog() {
        if (overlayEl) return;

        overlayEl = document.createElement('div');
        overlayEl.className = 'modal-overlay mobile-picker-overlay';
        overlayEl.hidden = true;
        overlayEl.innerHTML = [
            '<div class="modal-dialog mobile-picker-sheet" role="dialog" aria-modal="true" aria-labelledby="mobile-picker-title">',
            '  <div class="mobile-picker-header">',
            '    <div class="mobile-picker-header-copy">',
            '      <div class="mobile-picker-label" id="mobile-picker-label"></div>',
            '      <h2 class="modal-title mobile-picker-title" id="mobile-picker-title"></h2>',
            '    </div>',
            '    <button type="button" class="mobile-picker-close" aria-label="Close">&times;</button>',
            '  </div>',
            '  <div class="mobile-picker-groups"></div>',
            '</div>'
        ].join('');

        document.body.appendChild(overlayEl);

        titleEl = overlayEl.querySelector('.mobile-picker-title');
        labelEl = overlayEl.querySelector('.mobile-picker-label');
        closeButtonEl = overlayEl.querySelector('.mobile-picker-close');
        groupsEl = overlayEl.querySelector('.mobile-picker-groups');

        overlayEl.addEventListener('click', function (event) {
            if (event.target === overlayEl) closeDialog();
        });

        closeButtonEl.addEventListener('click', closeDialog);

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && overlayEl && !overlayEl.hidden) {
                event.preventDefault();
                closeDialog();
            }
        });
    }

    function buildGroupSection(groupName, options, selectEl) {
        const section = document.createElement('section');
        section.className = 'mobile-picker-group';

        const heading = document.createElement('h3');
        heading.className = 'mobile-picker-group-title';
        heading.textContent = groupName;
        section.appendChild(heading);

        const list = document.createElement('div');
        list.className = 'mobile-picker-options';

        options.forEach(optionEl => {
            const optionButton = document.createElement('button');
            optionButton.type = 'button';
            optionButton.className = 'mobile-picker-option';
            optionButton.dataset.value = optionEl.value;
            optionButton.setAttribute('aria-pressed', optionEl.selected ? 'true' : 'false');

            if (optionEl.selected) {
                optionButton.classList.add('is-selected');
            }

            const textWrap = document.createElement('span');
            textWrap.className = 'mobile-picker-option-text';

            const parsed = parseOptionText(optionEl.textContent);
            const primary = document.createElement('span');
            primary.className = 'mobile-picker-option-primary';
            primary.textContent = parsed.primary;
            textWrap.appendChild(primary);

            if (parsed.secondary) {
                const secondary = document.createElement('span');
                secondary.className = 'mobile-picker-option-secondary';
                secondary.textContent = parsed.secondary;
                textWrap.appendChild(secondary);
            }

            const check = document.createElement('span');
            check.className = 'mobile-picker-option-check';
            check.setAttribute('aria-hidden', 'true');
            check.textContent = optionEl.selected ? '●' : '○';

            optionButton.appendChild(textWrap);
            optionButton.appendChild(check);
            optionButton.addEventListener('click', function () {
                if (selectEl.value !== optionEl.value) {
                    selectEl.value = optionEl.value;
                    selectEl.dispatchEvent(new Event('change', { bubbles: true }));
                }
                closeDialog();
            });

            list.appendChild(optionButton);
        });

        section.appendChild(list);
        return section;
    }

    function renderOptions(selectEl) {
        groupsEl.innerHTML = '';

        const groupedOptions = [];
        Array.from(selectEl.children).forEach(child => {
            if (child.tagName === 'OPTGROUP') {
                groupedOptions.push({
                    label: child.label,
                    options: Array.from(child.children).filter(optionEl => !optionEl.disabled)
                });
                return;
            }

            if (child.tagName === 'OPTION' && !child.disabled) {
                groupedOptions.push({
                    label: '',
                    options: [child]
                });
            }
        });

        groupedOptions.forEach(group => {
            if (!group.options.length) return;
            groupsEl.appendChild(buildGroupSection(group.label || getGroupLabel(group.options[0]), group.options, selectEl));
        });
    }

    function openDialog(selectEl, triggerEl) {
        if (!isMobilePickerViewport()) return;

        ensureDialog();
        activeSelect = selectEl;
        activeTrigger = triggerEl;
        lastFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

        labelEl.textContent = getAssociatedLabel(selectEl);
        titleEl.textContent = getSelectedOption(selectEl) ? getSelectedOption(selectEl).textContent.trim() : '';
        closeButtonEl.setAttribute('aria-label', getCloseLabel());
        renderOptions(selectEl);

        overlayEl.hidden = false;
        document.body.classList.add('modal-open');
        closeButtonEl.focus();
    }

    function closeDialog() {
        if (!overlayEl || overlayEl.hidden) return;

        overlayEl.hidden = true;
        document.body.classList.remove('modal-open');

        if (activeTrigger) {
            activeTrigger.focus();
        } else if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
            lastFocusedElement.focus();
        }

        activeSelect = null;
        activeTrigger = null;
        lastFocusedElement = null;
    }

    function updateTrigger(selectEl) {
        const wrapper = selectEl.closest('.unit-select-group');
        if (!wrapper) return;

        const triggerEl = wrapper.querySelector('.mobile-picker-trigger');
        if (!triggerEl) return;

        const selectedOption = getSelectedOption(selectEl);
        const optionText = selectedOption ? selectedOption.textContent.trim() : '';

        const titleNode = triggerEl.querySelector('.mobile-picker-trigger-title');

        if (titleNode) titleNode.textContent = optionText;
        triggerEl.setAttribute('aria-label', getAssociatedLabel(selectEl) + ': ' + optionText);
    }

    function enhanceSelect(selectEl) {
        if (!selectEl || selectEl.dataset.mobilePickerReady === 'true') return;

        const wrapper = selectEl.closest('.unit-select-group');
        if (!wrapper) return;

        const triggerEl = document.createElement('button');
        triggerEl.type = 'button';
        triggerEl.className = 'mobile-picker-trigger';
        triggerEl.innerHTML = [
            '<span class="mobile-picker-trigger-copy">',
            '  <span class="mobile-picker-trigger-title"></span>',
            '</span>',
            '<span class="mobile-picker-trigger-icon" aria-hidden="true">▾</span>'
        ].join('');

        triggerEl.addEventListener('click', function () {
            openDialog(selectEl, triggerEl);
        });

        selectEl.insertAdjacentElement('afterend', triggerEl);
        selectEl.dataset.mobilePickerReady = 'true';
        wrapper.classList.add('mobile-picker-enhanced');

        selectEl.addEventListener('change', function () {
            updateTrigger(selectEl);
            if (activeSelect === selectEl && overlayEl && !overlayEl.hidden) {
                titleEl.textContent = getSelectedOption(selectEl) ? getSelectedOption(selectEl).textContent.trim() : '';
                renderOptions(selectEl);
            }
        });

        updateTrigger(selectEl);
    }

    function init(root) {
        const scope = root && root.querySelectorAll ? root : document;
        scope.querySelectorAll('.unit-select-group select').forEach(enhanceSelect);
    }

    function refresh(root) {
        const scope = root && root.querySelectorAll ? root : document;
        scope.querySelectorAll('.unit-select-group select[data-mobile-picker-ready="true"]').forEach(updateTrigger);

        if (activeSelect && overlayEl && !overlayEl.hidden) {
            titleEl.textContent = getSelectedOption(activeSelect) ? getSelectedOption(activeSelect).textContent.trim() : '';
            labelEl.textContent = getAssociatedLabel(activeSelect);
            closeButtonEl.setAttribute('aria-label', getCloseLabel());
            renderOptions(activeSelect);
        }
    }

    window.MobileUnitPicker = {
        init: init,
        refreshAll: refresh,
        close: closeDialog
    };

    init(document);
})();
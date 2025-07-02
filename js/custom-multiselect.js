// custom-multiselect.js - Отдельный файл для класса CustomMultiSelect

class CustomMultiSelect {
    constructor(containerId) {
        // Определяем текущий язык
        this.currentLang = this.detectLanguage();
        
        this.container = document.getElementById(containerId);
        this.trigger = document.getElementById('multiselect-trigger');
        this.dropdown = document.getElementById('multiselect-dropdown');
        this.arrow = document.getElementById('arrow-icon');
        this.selectedText = document.getElementById('selected-text');
        this.selectedTags = document.getElementById('selected-tags');
        this.originalSelect = document.getElementById('country-region');
        
        this.selectedValues = [];
        this.isOpen = false;
        
        // Тексты для разных языков
        this.texts = {
            uk: {
                placeholder: 'Оберіть країну або регіон зі списку',
                removeButtonAria: 'Видалити',
                openDropdownAria: 'Відкрити список',
                closeDropdownAria: 'Закрити список'
            },
            en: {
                placeholder: 'Select country or region from the list',
                removeButtonAria: 'Remove',
                openDropdownAria: 'Open list',
                closeDropdownAria: 'Close list'
            }
        };
        
        this.init();
    }

    // Определение текущего языка
    detectLanguage() {
        const path = window.location.pathname;
        const langMatch = path.match(/\/(en|uk)\//);
        return langMatch ? langMatch[1] : 'uk';
    }

    // Получение локализованного текста
    getText(key) {
        return this.texts[this.currentLang]?.[key] || this.texts.uk[key] || key;
    }

    // Получение локализованного пути
    getLocalizedPath(path) {
        if (path.startsWith('./')) {
            return this.currentLang === 'en' ? '../' + path.substring(2) : path;
        }
        return path;
    }

    // Получение локализованного URL
    getLocalizedUrl(url) {
        if (url.startsWith('./')) {
            const baseUrl = url.substring(2);
            return this.currentLang === 'en' ? `../en/${baseUrl}` : `./${baseUrl}`;
        }
        return url;
    }

    init() {
        if (!this.container || !this.trigger || !this.dropdown) {
            console.warn('CustomMultiSelect: Не найдены необходимые элементы DOM');
            return;
        }

        // Устанавливаем начальный placeholder
        this.updatePlaceholder();

        // Открытие/закрытие dropdown
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Обработка чекбоксов
        const checkboxes = this.dropdown.querySelectorAll('.option-checkbox');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.handleOptionChange(checkbox);
            });
        });

        // Закрытие при клике вне элемента
        document.addEventListener('click', (e) => {
            if (!this.container.contains(e.target)) {
                this.close();
            }
        });

        // Предотвращаем закрытие при клике внутри dropdown
        this.dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Поддержка клавиатуры
        this.trigger.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.toggle();
            } else if (e.key === 'Escape') {
                this.close();
            }
        });

        // Устанавливаем ARIA атрибуты
        this.setupAccessibility();
    }

    // Настройка доступности
    setupAccessibility() {
        if (this.trigger) {
            this.trigger.setAttribute('role', 'button');
            this.trigger.setAttribute('aria-expanded', 'false');
            this.trigger.setAttribute('aria-haspopup', 'listbox');
            this.trigger.setAttribute('tabindex', '0');
        }

        if (this.dropdown) {
            this.dropdown.setAttribute('role', 'listbox');
            this.dropdown.setAttribute('aria-multiselectable', 'true');
        }
    }

    // Обновление placeholder
    updatePlaceholder() {
        if (this.selectedText) {
            const placeholder = this.getText('placeholder');
            this.selectedText.setAttribute('data-placeholder', placeholder);
        }
    }

    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    open() {
        this.isOpen = true;
        this.dropdown.classList.add('open');
        this.trigger.classList.add('open');
        
        if (this.arrow) {
            this.arrow.classList.add('rotated');
        }

        // Обновляем ARIA
        this.trigger.setAttribute('aria-expanded', 'true');
        
        // Фокус на первый чекбокс
        const firstCheckbox = this.dropdown.querySelector('.option-checkbox');
        if (firstCheckbox) {
            setTimeout(() => firstCheckbox.focus(), 100);
        }
    }

    close() {
        this.isOpen = false;
        this.dropdown.classList.remove('open');
        this.trigger.classList.remove('open');
        
        if (this.arrow) {
            this.arrow.classList.remove('rotated');
        }

        // Обновляем ARIA
        this.trigger.setAttribute('aria-expanded', 'false');
    }

    handleOptionChange(checkbox) {
        const option = checkbox.closest('.multiselect-option');
        if (!option) return;

        const value = option.dataset.value;
        const label = option.querySelector('.option-label')?.textContent || value;

        if (checkbox.checked) {
            if (!this.selectedValues.includes(value)) {
                this.selectedValues.push(value);
                this.addTag(value, label);
            }
        } else {
            this.selectedValues = this.selectedValues.filter(v => v !== value);
            this.removeTag(value);
        }

        this.updateOriginalSelect();
        this.updateDisplay();
        this.validateField();
        this.triggerChangeEvent();
    }

    addTag(value, label) {
        if (!this.selectedTags) return;

        const tag = document.createElement('div');
        tag.className = 'selected-tag';
        tag.dataset.value = value;
        
        const removeButtonAria = this.getText('removeButtonAria');
        
        tag.innerHTML = `
            <span class="tag-label">${label}</span>
            <button type="button" class="tag-remove" 
                    aria-label="${removeButtonAria} ${label}"
                    onclick="window.countryMultiSelect?.removeOption('${value.replace(/'/g, "\\'")}')">
                &times;
            </button>
        `;
        
        this.selectedTags.appendChild(tag);
    }

    removeTag(value) {
        if (!this.selectedTags) return;

        const tag = this.selectedTags.querySelector(`[data-value="${value}"]`);
        if (tag) {
            tag.remove();
        }
    }

    removeOption(value) {
        // Снимаем чекбокс
        const checkbox = this.dropdown.querySelector(`[data-value="${value}"] .option-checkbox`);
        if (checkbox) {
            checkbox.checked = false;
        }

        // Обновляем данные
        this.selectedValues = this.selectedValues.filter(v => v !== value);
        this.removeTag(value);
        this.updateOriginalSelect();
        this.updateDisplay();
        this.validateField();
        this.triggerChangeEvent();
    }

    updateOriginalSelect() {
        if (!this.originalSelect) return;

        // Обновляем скрытый select для отправки формы
        Array.from(this.originalSelect.options).forEach(option => {
            option.selected = this.selectedValues.includes(option.value);
        });
    }

    updateDisplay() {
        if (!this.selectedText || !this.selectedTags) return;

        if (this.selectedValues.length === 0) {
            this.selectedText.textContent = this.getText('placeholder');
            this.selectedText.classList.add('placeholder');
            this.selectedTags.style.display = 'none';
        } else {
            this.selectedText.textContent = '';
            this.selectedText.classList.remove('placeholder');
            this.selectedTags.style.display = 'flex';
        }

        // Обновляем ARIA label
        const selectedCount = this.selectedValues.length;
        const ariaLabel = selectedCount > 0 
            ? `${selectedCount} элементов выбрано` 
            : this.getText('placeholder');
        
        this.trigger.setAttribute('aria-label', ariaLabel);
    }

    validateField() {
        const group = this.container.closest('.input-grup, .form-group, .field-group');
        const isValid = this.selectedValues.length > 0;
        
        if (group) {
            group.classList.toggle('error', !isValid);
            group.classList.toggle('has-error', !isValid);
            group.classList.toggle('valid', isValid);
        }

        // Обновляем ARIA атрибуты валидации
        this.trigger.setAttribute('aria-invalid', (!isValid).toString());
        
        return isValid;
    }

    triggerChangeEvent() {
        // Создаем и отправляем custom event
        const event = new CustomEvent('multiselect:change', {
            detail: {
                selectedValues: [...this.selectedValues],
                selectedCount: this.selectedValues.length
            },
            bubbles: true
        });
        
        this.container.dispatchEvent(event);

        // Также отправляем событие для оригинального select
        if (this.originalSelect) {
            const changeEvent = new Event('change', { bubbles: true });
            this.originalSelect.dispatchEvent(changeEvent);
        }
    }

    // Публичные методы
    getSelectedValues() {
        return [...this.selectedValues];
    }

    setSelectedValues(values) {
        if (!Array.isArray(values)) {
            console.warn('setSelectedValues: значение должно быть массивом');
            return;
        }

        // Сбрасываем все
        this.selectedValues = [];
        if (this.selectedTags) {
            this.selectedTags.innerHTML = '';
        }
        
        // Снимаем все чекбоксы
        const checkboxes = this.dropdown.querySelectorAll('.option-checkbox');
        checkboxes.forEach(cb => cb.checked = false);

        // Устанавливаем новые значения
        values.forEach(value => {
            const option = this.dropdown.querySelector(`[data-value="${value}"]`);
            if (option) {
                const checkbox = option.querySelector('.option-checkbox');
                const label = option.querySelector('.option-label')?.textContent || value;
                
                if (checkbox) {
                    checkbox.checked = true;
                    this.selectedValues.push(value);
                    this.addTag(value, label);
                }
            }
        });

        this.updateOriginalSelect();
        this.updateDisplay();
        this.validateField();
        this.triggerChangeEvent();
    }

    clear() {
        this.setSelectedValues([]);
    }

    disable() {
        this.trigger.setAttribute('disabled', 'true');
        this.trigger.classList.add('disabled');
        this.trigger.setAttribute('tabindex', '-1');
    }

    enable() {
        this.trigger.removeAttribute('disabled');
        this.trigger.classList.remove('disabled');
        this.trigger.setAttribute('tabindex', '0');
    }

    destroy() {
        // Удаляем обработчики событий
        if (this.trigger) {
            this.trigger.replaceWith(this.trigger.cloneNode(true));
        }
        
        if (this.dropdown) {
            this.dropdown.replaceWith(this.dropdown.cloneNode(true));
        }

        // Очищаем ссылки
        this.container = null;
        this.trigger = null;
        this.dropdown = null;
        this.selectedTags = null;
        this.selectedText = null;
        this.originalSelect = null;
    }

    // Методы для отладки
    getState() {
        return {
            selectedValues: [...this.selectedValues],
            isOpen: this.isOpen,
            language: this.currentLang,
            isValid: this.validateField()
        };
    }

    // Переключение языка (для случаев динамической смены языка)
    setLanguage(lang) {
        if (this.texts[lang]) {
            this.currentLang = lang;
            this.updatePlaceholder();
            this.updateDisplay();
        }
    }
}

// Экспорт для использования в других скриптах
window.CustomMultiSelect = CustomMultiSelect;
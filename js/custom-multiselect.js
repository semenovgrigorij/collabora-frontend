// custom-multiselect.js - Отдельный файл для класса CustomMultiSelect

class CustomMultiSelect {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.trigger = document.getElementById('multiselect-trigger');
        this.dropdown = document.getElementById('multiselect-dropdown');
        this.arrow = document.getElementById('arrow-icon');
        this.selectedText = document.getElementById('selected-text');
        this.selectedTags = document.getElementById('selected-tags');
        this.originalSelect = document.getElementById('country-region');
        
        this.selectedValues = [];
        this.isOpen = false;
        
        this.init();
    }

    init() {
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
        this.arrow.classList.add('rotated');
    }

    close() {
        this.isOpen = false;
        this.dropdown.classList.remove('open');
        this.trigger.classList.remove('open');
        this.arrow.classList.remove('rotated');
    }

    handleOptionChange(checkbox) {
        const option = checkbox.closest('.multiselect-option');
        const value = option.dataset.value;
        const label = option.querySelector('.option-label').textContent;

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
    }

    addTag(value, label) {
        const tag = document.createElement('div');
        tag.className = 'selected-tag';
        tag.dataset.value = value;
        tag.innerHTML = `
            <span>${label}</span>
            <span class="tag-remove" onclick="window.countryMultiSelect?.removeOption('${value}')">&times;</span>
        `;
        this.selectedTags.appendChild(tag);
    }

    removeTag(value) {
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
    }

    updateOriginalSelect() {
        // Обновляем скрытый select для отправки формы
        Array.from(this.originalSelect.options).forEach(option => {
            option.selected = this.selectedValues.includes(option.value);
        });
    }

    updateDisplay() {
        if (this.selectedValues.length === 0) {
            this.selectedText.textContent = 'Оберіть країну або регіон зі списку';
            this.selectedText.classList.add('placeholder');
            this.selectedTags.style.display = 'none';
        } else {
            this.selectedText.textContent = '';
            this.selectedText.classList.remove('placeholder');
            this.selectedTags.style.display = 'flex';
        }
    }

    validateField() {
        const group = this.container.closest('.input-grup');
        const isValid = this.selectedValues.length > 0;
        if (group) {
            group.classList.toggle('error', !isValid);
        }
        return isValid;
    }

    getSelectedValues() {
        return this.selectedValues;
    }

    setSelectedValues(values) {
        // Сбрасываем все
        this.selectedValues = [];
        this.selectedTags.innerHTML = '';
        
        // Снимаем все чекбоксы
        const checkboxes = this.dropdown.querySelectorAll('.option-checkbox');
        checkboxes.forEach(cb => cb.checked = false);

        // Устанавливаем новые значения
        values.forEach(value => {
            const option = this.dropdown.querySelector(`[data-value="${value}"]`);
            if (option) {
                const checkbox = option.querySelector('.option-checkbox');
                const label = option.querySelector('.option-label').textContent;
                
                checkbox.checked = true;
                this.selectedValues.push(value);
                this.addTag(value, label);
            }
        });

        this.updateOriginalSelect();
        this.updateDisplay();
        this.validateField();
    }
}

// Экспорт для использования в других скриптах
window.CustomMultiSelect = CustomMultiSelect;
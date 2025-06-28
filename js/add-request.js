// add-request.js - Функциональность страницы создания запроса

class AddRequestPage {
    constructor() {
        this.countryMultiSelect = null;
        this.richTextEditor = null;
        this.init();
    }

    init() {
        this.setupForm();
        this.setupCountryMultiSelect();
        this.setupRichTextEditor();
        this.setupFormValidation();
        console.log('Страница создания запроса инициализирована');
    }

    // Настройка основной формы
    setupForm() {
        const form = document.getElementById('add-request-form');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleFormSubmit();
            });
        }
    }

    // Настройка мультиселекта стран (переиспользуем класс из registration.js)
    setupCountryMultiSelect() {
        if (document.getElementById('custom-country-select')) {
            // Используем тот же класс CustomMultiSelect из registration.js
            this.countryMultiSelect = new CustomMultiSelect('custom-country-select');
        }
    }

    // Настройка Rich Text Editor
    setupRichTextEditor() {
        const editor = document.getElementById('rich-text-editor');
        if (!editor) return;

        this.richTextEditor = new RichTextEditor('rich-text-editor');
    }

    // Настройка валидации формы
    setupFormValidation() {
        const inputs = document.querySelectorAll('#add-request-form input, #add-request-form select, #add-request-form textarea');
        
        inputs.forEach(input => {
            if (input.type !== 'checkbox') {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => {
                    const group = input.closest('.input-grup');
                    if (group && group.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            } else {
                input.addEventListener('change', () => this.validateField(input));
            }
        });
    }

    // Валидация отдельного поля
    validateField(field) {
        const group = field.closest('.input-grup');
        let isValid = true;

        if (field.type === 'checkbox' && field.hasAttribute('required')) {
            isValid = field.checked;
        } else if (field.name === 'country_region[]' && this.countryMultiSelect) {
            isValid = this.countryMultiSelect.getSelectedValues().length > 0;
        } else if (field.name === 'detailed-info') {
            // Проверяем содержимое rich text editor
            const content = this.richTextEditor ? this.richTextEditor.getContent() : '';
            isValid = content.trim() !== '';
        } else if (field.hasAttribute('required')) {
            isValid = field.value.trim() !== '';
        }

        if (group) {
            group.classList.toggle('error', !isValid);
        }

        return isValid;
    }

    // Обработка отправки формы
    handleFormSubmit() {
        let isFormValid = true;
        const form = document.getElementById('add-request-form');
        const inputs = form.querySelectorAll('input, select, textarea');

        // Валидируем все поля
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });

        // Дополнительная проверка rich text editor
        if (this.richTextEditor) {
            const content = this.richTextEditor.getContent();
            const hiddenTextarea = document.getElementById('detailed-info');
            if (hiddenTextarea) {
                hiddenTextarea.value = content;
            }
            
            if (!this.validateField(hiddenTextarea)) {
                isFormValid = false;
            }
        }

        if (isFormValid) {
            this.submitForm();
        } else {
            const firstError = form.querySelector('.input-grup.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }

    // Отправка формы
    submitForm() {
        const formData = new FormData(document.getElementById('add-request-form'));
        const requestData = {};

        // Собираем данные формы
        for (let [key, value] of formData.entries()) {
            requestData[key] = value;
        }

        // Добавляем данные из мультиселекта стран
        if (this.countryMultiSelect) {
            requestData['country_region'] = this.countryMultiSelect.getSelectedValues();
        }

        // Добавляем контент из rich text editor
        if (this.richTextEditor) {
            requestData['detailed_info'] = this.richTextEditor.getContent();
        }

        // Добавляем метаданные
        requestData.createdAt = new Date().toISOString();
        requestData.id = 'request_' + Date.now();

        console.log('Данные запроса:', requestData);

        // В реальном проекте здесь будет отправка на сервер
        // Пока что сохраняем в localStorage и показываем уведомление
        this.saveRequest(requestData);
    }

    // Сохранение запроса
    saveRequest(requestData) {
        try {
            // Получаем существующие запросы
            const existingRequests = JSON.parse(localStorage.getItem('userRequests') || '[]');
            
            // Добавляем новый запрос
            existingRequests.push(requestData);
            
            // Сохраняем обратно
            localStorage.setItem('userRequests', JSON.stringify(existingRequests));
            
            // Показываем уведомление об успехе
            this.showSuccessMessage();
            
            // Очищаем форму
            setTimeout(() => {
                this.resetForm();
            }, 2000);
            
        } catch (error) {
            console.error('Ошибка сохранения запроса:', error);
            alert('Помилка збереження запиту. Спробуйте ще раз.');
        }
    }

    // Показ уведомления об успехе
    showSuccessMessage() {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div>
                    <h4>Запит успішно створено!</h4>
                    <p>Ваш запит буде розглянуто найближчим часом.</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Убираем уведомление через 3 секунды
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Сброс формы
    resetForm() {
        const form = document.getElementById('add-request-form');
        form.reset();
        
        // Очищаем ошибки валидации
        const errorGroups = form.querySelectorAll('.input-grup.error');
        errorGroups.forEach(group => group.classList.remove('error'));
        
        // Очищаем мультиселект
        if (this.countryMultiSelect) {
            this.countryMultiSelect.setSelectedValues([]);
        }
        
        // Очищаем rich text editor
        if (this.richTextEditor) {
            this.richTextEditor.setContent('');
        }
    }
}

// Класс для Rich Text Editor
class RichTextEditor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.content = this.container.querySelector('.editor-content');
        this.hiddenInput = this.container.querySelector('textarea[name="detailed-info"]');
        this.init();
    }

    init() {
        this.setupToolbar();
        this.setupContentArea();
    }

    // Настройка панели инструментов
    setupToolbar() {
        const toolbar = this.container.querySelector('.editor-toolbar');
        const buttons = toolbar.querySelectorAll('.toolbar-btn');
        const selects = toolbar.querySelectorAll('.toolbar-select');

        buttons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const command = button.getAttribute('data-command');
                this.executeCommand(command);
            });
        });

        selects.forEach(select => {
            select.addEventListener('change', (e) => {
                const command = select.getAttribute('data-command');
                const value = select.value;
                if (value) {
                    this.executeCommand(command, value);
                    select.value = '';
                }
            });
        });
    }

    // Настройка области контента
    setupContentArea() {
        this.content.addEventListener('input', () => {
            this.updateHiddenInput();
        });

        this.content.addEventListener('paste', (e) => {
            e.preventDefault();
            const text = (e.clipboardData || window.clipboardData).getData('text/plain');
            document.execCommand('insertText', false, text);
        });
    }

    // Выполнение команд редактирования
    executeCommand(command, value = null) {
        this.content.focus();
        
        if (command === 'createLink') {
            const url = prompt('Введіть URL:');
            if (url) {
                document.execCommand(command, false, url);
            }
        } else if (command === 'insertImage') {
            const url = prompt('Введіть URL зображення:');
            if (url) {
                document.execCommand(command, false, url);
            }
        } else {
            document.execCommand(command, false, value);
        }
        
        this.updateHiddenInput();
    }

    // Обновление скрытого поля
    updateHiddenInput() {
        if (this.hiddenInput) {
            this.hiddenInput.value = this.content.innerHTML;
        }
    }

    // Получение контента
    getContent() {
        return this.content.innerHTML;
    }

    // Установка контента
    setContent(html) {
        this.content.innerHTML = html;
        this.updateHiddenInput();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.addRequestPage = new AddRequestPage();
    console.log('Функциональность страницы создания запроса загружена');
});

// Экспорт для использования в других скриптах
window.AddRequestPage = AddRequestPage;
window.RichTextEditor = RichTextEditor;addEventListener('DOMContentLoaded', function() {
    window.addRequestPage = new AddRequestPage();
    console.log('Функциональность страницы создания запроса загружена');
});

// Экспорт для использования в других скриптах
window.AddRequestPage = AddRequestPage;
window.RichTextEditor = RichTextEditor;addEventListener('DOMContentLoaded', function() {
    window.addRequestPage = new AddRequestPage();
    console.log('Функциональность страницы создания запроса загружена');
});

// Экспорт для использования в других скриптах
window.AddRequestPage = AddRequestPage;
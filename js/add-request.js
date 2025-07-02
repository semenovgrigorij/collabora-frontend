// add-request.js - многоязычная функциональность страницы создания запроса

// Определение текущего языка
function getCurrentLanguage() {
    const currentPath = window.location.pathname;
    const isEnglishPage = currentPath.includes('/en/');
    return isEnglishPage ? 'en' : 'uk';
}

// Получение пути к странице с учетом языка
function getLocalizedPath(pageName) {
    const currentLang = getCurrentLanguage();
    
    if (currentLang === 'en') {
        return `./en/${pageName}`;
    } else {
        return `./${pageName}`;
    }
}

// Локализованные тексты
function getLocalizedText(key) {
    const currentLang = getCurrentLanguage();
    
    const texts = {
        uk: {
            selectCountry: 'Оберіть країну або регіон зі списку',
            requestCreatedSuccess: 'Запит успішно створено!',
            requestWillBeReviewed: 'Ваш запит буде розглянуто найближчим часом.',
            requestSaveError: 'Помилка збереження запиту. Спробуйте ще раз.',
            pageInitialized: 'Сторінка створення запиту ініціалізована',
            functionalityLoaded: 'Функціональність сторінки створення запиту завантажена',
            enterUrl: 'Введіть URL:',
            enterImageUrl: 'Введіть URL зображення:',
            requestData: 'Дані запиту:'
        },
        en: {
            selectCountry: 'Select country or region from the list',
            requestCreatedSuccess: 'Request successfully created!',
            requestWillBeReviewed: 'Your request will be reviewed shortly.',
            requestSaveError: 'Error saving request. Please try again.',
            pageInitialized: 'Add request page initialized',
            functionalityLoaded: 'Add request page functionality loaded',
            enterUrl: 'Enter URL:',
            enterImageUrl: 'Enter image URL:',
            requestData: 'Request data:'
        }
    };
    
    return texts[currentLang][key] || texts['uk'][key];
}

class AddRequestPage {
    constructor() {
        this.currentLang = getCurrentLanguage();
        this.countryMultiSelect = null;
        this.richTextEditor = null;
        this.init();
    }

    init() {
        this.setupForm();
        this.setupCountryMultiSelect();
        this.setupRichTextEditor();
        this.setupFormValidation();
        console.log(getLocalizedText('pageInitialized'));
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

    // Настройка мультиселекта стран (используем класс из custom-multiselect.js)
    setupCountryMultiSelect() {
        if (document.getElementById('custom-country-select')) {
            // Проверяем, что класс CustomMultiSelect доступен
            if (typeof CustomMultiSelect !== 'undefined') {
                this.countryMultiSelect = new CustomMultiSelect('custom-country-select');
            } else {
                console.warn('CustomMultiSelect class not found. Make sure custom-multiselect.js is loaded.');
            }
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
        requestData.language = this.currentLang;

        console.log(getLocalizedText('requestData'), requestData);

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
            alert(getLocalizedText('requestSaveError'));
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
                    <h4>${getLocalizedText('requestCreatedSuccess')}</h4>
                    <p>${getLocalizedText('requestWillBeReviewed')}</p>
                </div>
            </div>
        `;
        
        // Добавляем стили для уведомления
        this.addNotificationStyles();
        document.body.appendChild(notification);
        
        // Убираем уведомление через 3 секунды
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Добавление стилей для уведомлений
    addNotificationStyles() {
        const styleId = 'add-request-notification-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .success-notification {
                position: fixed;
                top: 20px;
                right: 20px;
                background: white;
                border: 1px solid #10B981;
                border-radius: 12px;
                padding: 20px;
                box-shadow: 0 10px 25px rgba(0,0,0,0.1);
                z-index: 1000;
                animation: slideInRight 0.3s ease;
                max-width: 400px;
            }
            
            .notification-content {
                display: flex;
                align-items: flex-start;
                gap: 12px;
            }
            
            .notification-content h4 {
                margin: 0 0 4px 0;
                color: #10B981;
                font-size: 16px;
                font-weight: 600;
            }
            
            .notification-content p {
                margin: 0;
                color: #666;
                font-size: 14px;
                line-height: 1.4;
            }
            
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }

            @media (max-width: 480px) {
                .success-notification {
                    left: 20px;
                    right: 20px;
                    max-width: none;
                }
            }
        `;
        
        document.head.appendChild(style);
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

// Класс для Rich Text Editor с локализацией
class RichTextEditor {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.content = this.container.querySelector('.editor-content');
        this.hiddenInput = this.container.querySelector('textarea[name="detailed-info"]');
        this.currentLang = getCurrentLanguage();
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

    // Выполнение команд редактирования с локализацией
    executeCommand(command, value = null) {
        this.content.focus();
        
        if (command === 'createLink') {
            const url = prompt(getLocalizedText('enterUrl'));
            if (url) {
                document.execCommand(command, false, url);
            }
        } else if (command === 'insertImage') {
            const url = prompt(getLocalizedText('enterImageUrl'));
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
    console.log(getLocalizedText('functionalityLoaded'));
});

// Экспорт для использования в других скриптов
window.AddRequestPage = AddRequestPage;
window.RichTextEditor = RichTextEditor;
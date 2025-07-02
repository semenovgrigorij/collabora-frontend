// registration.js - многоязычная версия

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
        return `./${pageName}`;
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
            registrationSuccess: 'Реєстрація успішна!',
            redirectingToCabinet: 'Перенаправляємо в особистий кабінет...',
            processingImage: 'Обробка зображення...',
            register: 'Зареєструватися',
            fileTooLarge: 'Файл занадто великий! Максимальний розмір: 4МБ',
            invalidFileType: 'Невірний тип файлу! Дозволені: JPG, JPEG, PNG, GIF, SVG',
            pleaseSelectImage: 'Будь ласка, оберіть файл зображення',
            formHasErrors: 'Форма містить помилки. Перевірте заповнення полів.',
            dataProcessingError: 'Помилка обробки даних. Спробуйте ще раз.',
            imageProcessingError: 'Помилка обробки зображення. Спробуйте ще раз.',
            fileReadError: 'Помилка читання файлу. Спробуйте вибрати інший файл.',
            saveWithoutImage: 'Зберегти дані без зображення?',
            savingWithoutImage: 'Збереження даних без зображення...',
            imageConvertedSuccess: 'Зображення успішно конвертовано в Base64',
            userDataSaved: 'Дані користувача збережено',
            userDataCleared: 'Данные пользователя очищены',
            imageProcessingStart: 'Початок конвертації зображення:',
            imageCompressionNotImplemented: 'Функція стиснення зображення поки не реалізована. Спробуйте менший файл.',
            trySmallFile: 'Зображення занадто велике для збереження. Спробувати зменшити якість?',
            selectedFile: 'Обрано:',
            businessFormShown: 'Показан блок business-form',
            goFormShown: 'Показан блок go-form',
            expertFormShown: 'Показан блок expert-form',
            allFormsHidden: 'Все блоки скрыты',
            selectedUserType: 'Выбран тип пользователя:',
            fileSize: 'Розмір файлу:',
            loadingProgress: 'Прогрес завантаження:'
        },
        en: {
            selectCountry: 'Select country or region from the list',
            registrationSuccess: 'Registration successful!',
            redirectingToCabinet: 'Redirecting to personal cabinet...',
            processingImage: 'Processing image...',
            register: 'Sign up',
            fileTooLarge: 'File too large! Maximum size: 4MB',
            invalidFileType: 'Invalid file type! Allowed: JPG, JPEG, PNG, GIF, SVG',
            pleaseSelectImage: 'Please select an image file',
            formHasErrors: 'Form contains errors. Please check the filled fields.',
            dataProcessingError: 'Data processing error. Please try again.',
            imageProcessingError: 'Image processing error. Please try again.',
            fileReadError: 'File reading error. Please try selecting another file.',
            saveWithoutImage: 'Save data without image?',
            savingWithoutImage: 'Saving data without image...',
            imageConvertedSuccess: 'Image successfully converted to Base64',
            userDataSaved: 'User data saved',
            userDataCleared: 'User data cleared',
            imageProcessingStart: 'Starting image conversion:',
            imageCompressionNotImplemented: 'Image compression feature not yet implemented. Try a smaller file.',
            trySmallFile: 'Image too large for storage. Try reducing quality?',
            selectedFile: 'Selected:',
            businessFormShown: 'Business form shown',
            goFormShown: 'Organization form shown',
            expertFormShown: 'Expert form shown',
            allFormsHidden: 'All forms hidden',
            selectedUserType: 'Selected user type:',
            fileSize: 'File size:',
            loadingProgress: 'Loading progress:'
        }
    };
    
    return texts[currentLang][key] || texts['uk'][key];
}

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
            <span class="tag-remove" onclick="countryMultiSelect.removeOption('${value}')">&times;</span>
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
            this.selectedText.textContent = getLocalizedText('selectCountry');
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
        group.classList.toggle('error', !isValid);
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

// Отключаем стандартные всплывающие сообщения браузера
const form = document.getElementById('registration-form');
const inputs = form.querySelectorAll('input, textarea, select');

let countryMultiSelect = null;
if (document.getElementById('custom-country-select')) {
    countryMultiSelect = new CustomMultiSelect('custom-country-select');
}

// Остальной код остается практически тот же, но с заменой текстов на getLocalizedText()

// Функция показа сообщения об успешной регистрации
function showRegistrationSuccessMessage() {
    const notification = document.createElement('div');
    notification.className = 'registration-success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
                <h4>${getLocalizedText('registrationSuccess')}</h4>
                <p>${getLocalizedText('redirectingToCabinet')}</p>
            </div>
        </div>
    `;
    
    // Добавляем стили
    const style = document.createElement('style');
    style.textContent = `
        .registration-success-notification {
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
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-content h4 {
            margin: 0;
            color: #10B981;
            font-size: 16px;
        }
        
        .notification-content p {
            margin: 0;
            color: #666;
            font-size: 14px;
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
    `;
    
    document.head.appendChild(style);
    document.body.appendChild(notification);
    
    // Убираем уведомление через 3 секунды
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Функция для файла upload с локализацией
function handleFileSelect(input) {
    const file = input.files[0];
    const selectedFileDiv = document.getElementById('selectedFile');
    
    if (file) {
        // Проверка размера файла (4MB = 4 * 1024 * 1024 bytes)
        if (file.size > 4 * 1024 * 1024) {
            alert(getLocalizedText('fileTooLarge'));
            input.value = '';
            selectedFileDiv.style.display = 'none';
            validateField(input);
            return;
        }
        
        selectedFileDiv.textContent = `${getLocalizedText('selectedFile')} ${file.name}`;
        selectedFileDiv.style.display = 'block';
        validateField(input);
    } else {
        selectedFileDiv.style.display = 'none';
        validateField(input);
    }
}

function handleFileSelect2(input) {
    const file = input.files[0];
    const selectedFileDiv = document.getElementById('selectedFile2');
    
    if (file) {
        if (file.size > 4 * 1024 * 1024) {
            alert(getLocalizedText('fileTooLarge'));
            input.value = '';
            selectedFileDiv.style.display = 'none';
            return;
        }
        
        selectedFileDiv.textContent = `${getLocalizedText('selectedFile')} ${file.name}`;
        selectedFileDiv.style.display = 'block';
    } else {
        selectedFileDiv.style.display = 'none';
    }
}

// Функция сохранения данных и перенаправления с локализацией
function saveUserDataAndRedirect(userData) {
    showLoadingIndicator();
    
    // Добавляем метаданные
    userData.registrationDate = new Date().toISOString();
    userData.userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    try {
        // Сохраняем в localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log(getLocalizedText('userDataSaved'));
        console.log('Тип користувача:', userData.user_type);
        console.log('Країни:', userData.country_region);
        
        // Показываем уведомление об успешной регистрации
        showRegistrationSuccessMessage();
        
        // Перенаправляем на страницу благодарности через 2 секунды
        setTimeout(() => {
            window.location.href = getLocalizedPath('thank-page.html');
        }, 2000);
        
    } catch (error) {
        console.error('Помилка збереження даних:', error);
        hideLoadingIndicator();
        
        // Если данные слишком большие для localStorage
        if (error.name === 'QuotaExceededError') {
            const confirmResize = confirm(getLocalizedText('trySmallFile'));
            if (confirmResize) {
                alert(getLocalizedText('imageCompressionNotImplemented'));
            }
        } else {
            alert(getLocalizedText('dataProcessingError'));
        }
    }
}

// Функция конвертации изображения в Base64 с локализацией
function convertImageToBase64(file, userData) {
    console.log(getLocalizedText('imageProcessingStart'), file.name);
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            // Сохраняем изображение в Base64
            userData.photoBase64 = e.target.result;
            userData.photoFileName = file.name;
            userData.photoSize = file.size;
            userData.photoType = file.type;
            
            console.log(getLocalizedText('imageConvertedSuccess'));
            console.log(getLocalizedText('fileSize'), (file.size / 1024).toFixed(2), 'KB');
            
            // Сохраняем данные после обработки изображения
            saveUserDataAndRedirect(userData);
            
        } catch (error) {
            console.error('Помилка при збереженні даних зображення:', error);
            alert(getLocalizedText('imageProcessingError'));
        }
    };
    
    reader.onerror = function(error) {
        console.error('Помилка читання файлу:', error);
        alert(getLocalizedText('fileReadError'));
        
        // Можно предложить сохранить данные без изображения
        const confirmSave = confirm(getLocalizedText('saveWithoutImage'));
        if (confirmSave) {
            console.log(getLocalizedText('savingWithoutImage'));
            saveUserDataAndRedirect(userData);
        }
    };
    
    reader.onprogress = function(e) {
        if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            console.log(getLocalizedText('loadingProgress'), progress.toFixed(0) + '%');
        }
    };
    
    reader.readAsDataURL(file);
}

function showLoadingIndicator() {
    const submitButton = document.querySelector('.registracion-form-submit button');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = getLocalizedText('processingImage');
    }
}

function hideLoadingIndicator() {
    const submitButton = document.querySelector('.registracion-form-submit button');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = getLocalizedText('register');
    }
}

// Функция для очистки данных (для тестирования)
function clearUserData() {
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    console.log(getLocalizedText('userDataCleared'));
}

// Управление видимостью блоков формы с локализацией
function handleUserTypeChange() {
    const userTypeSelect = document.getElementById('user-type');
    const businessForm = document.querySelector('.business-form');
    const goForm = document.querySelector('.go-form');
    const expertForm = document.querySelector('.expert-form');
    
    function hideAllForms() {
        if (businessForm) businessForm.style.display = 'none';
        if (goForm) goForm.style.display = 'none';
        if (expertForm) expertForm.style.display = 'none';
    }
    
    function showFormByUserType(userType) {
        hideAllForms();
        
        switch(userType) {
            case 'business':
                if (businessForm) {
                    businessForm.style.display = 'block';
                    console.log(getLocalizedText('businessFormShown'));
                }
                break;
            case 'organization':
                if (goForm) {
                    goForm.style.display = 'block';
                    console.log(getLocalizedText('goFormShown'));
                }
                break;
            case 'expert':
                if (expertForm) {
                    expertForm.style.display = 'block';
                    console.log(getLocalizedText('expertFormShown'));
                }
                break;
            case 'other':
            case '':
            default:
                console.log(getLocalizedText('allFormsHidden'));
                break;
        }
    }
    
    hideAllForms();
    
    userTypeSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        console.log(getLocalizedText('selectedUserType'), selectedValue);
        showFormByUserType(selectedValue);
        clearValidationErrorsInHiddenForms(selectedValue);
    });
}

// Остальные функции валидации остаются практически теми же...
// (код валидации очень длинный, поэтому показываю основные изменения)

// Для отладки - добавляем в глобальную область видимости
window.clearUserData = clearUserData;

// Инициализация обработчика при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    handleUserTypeChange();
});

// Экспорт функций для использования в других частях кода
window.userTypeHandler = {
    clearValidationErrorsInHiddenForms,
    isFieldRequiredForUserType
};
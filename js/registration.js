// registration.js 

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

// Функция для определения обязательных полей
function isFieldRequired(field) {
    // Стандартные required поля
    if (field.hasAttribute('required')) {
        return true;
    }
    
    // Дополнительные обязательные поля по типу формы
    const expertRequiredFields = [
        'short-description',
        'experience',
        'expectation'
    ];
    
    const businessRequiredFields = [
        'short-description',
        'services',
        'need'
    ];
    
    // Определяем какая форма (по наличию специфических полей)
    const isExpertForm = document.getElementById('expectation');
    const isBizForm = document.getElementById('services');
    
    if (isExpertForm) {
        return expertRequiredFields.includes(field.id);
    } else if (isBizForm) {
        return businessRequiredFields.includes(field.id);
    }
    
    return false;
}

// Функция валидации отдельного поля
function validateField(field) {
    const group = field.closest('.input-grup');
    let isValid = true;
    
    // Проверяем, находится ли поле в видимом блоке
    const fieldContainer = field.closest('.business-form, .go-form, .expert-form');
    if (fieldContainer && fieldContainer.style.display === 'none') {
        // Если поле в скрытом блоке, считаем его валидным
        if (group) {
            group.classList.remove('error');
        }
        return true;
    }
    
    // Для radio buttons - проверяем группу
    if (field.type === 'radio') {
        const radioGroup = form.querySelectorAll(`input[name="${field.name}"]`);
        // Проверяем только radio кнопки в видимых блоках
        const visibleRadios = Array.from(radioGroup).filter(radio => {
            const container = radio.closest('.business-form, .go-form, .expert-form');
            return !container || container.style.display !== 'none';
        });
        isValid = visibleRadios.some(radio => radio.checked);
    }
    // Для file input - проверяем выбран ли файл
    else if (field.type === 'file' && field.hasAttribute('required')) {
        isValid = field.files.length > 0;
    }
    // Для мультиселекта стран
    else if (field.name === 'country_region[]' && countryMultiSelect) {
        isValid = countryMultiSelect.getSelectedValues().length > 0;
    }
    // Для остальных обязательных полей
    else if (isFieldRequiredForUserType(field)) {
        if (field.type === 'email') {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            isValid = field.value.trim() !== '' && emailRegex.test(field.value);
        } else {
            isValid = field.value.trim() !== '';
        }
    }
    
    // Применяем класс ошибки
    if (group) {
        group.classList.toggle('error', !isValid);
    }
    
    return isValid;
}

// Специальная функция для валидации блока с чекбоксами "Основні напрямки роботи"
function validateWorkDirections() {
    const workDirectionsGroup = document.querySelector('.input-grup:has([name="work_directions[]"])');
    if (!workDirectionsGroup) return true;
    
    // Проверяем, видим ли блок с этими чекбоксами
    const goForm = workDirectionsGroup.closest('.go-form');
    if (goForm && goForm.style.display === 'none') {
        workDirectionsGroup.classList.remove('error');
        return true;
    }
    
    const checkboxes = workDirectionsGroup.querySelectorAll('input[type="checkbox"]');
    const otherTextarea = workDirectionsGroup.querySelector('textarea[name="other_directions"]');
    
    // Проверяем: выбран ли хотя бы один чекбокс ИЛИ заполнено поле "другое"
    const hasCheckedBox = Array.from(checkboxes).some(checkbox => checkbox.checked);
    const hasOtherText = otherTextarea && otherTextarea.value.trim() !== '';
    
    const isValid = hasCheckedBox || hasOtherText;
    
    // Применяем класс ошибки к группе
    workDirectionsGroup.classList.toggle('error', !isValid);
    
    return isValid;
}

// Специальная функция для валидации чекбоксов cooperation[] (expert форма)
function validateCooperationCheckboxes() {
    const cooperationGroup = document.querySelector('.input-grup:has([name="cooperation[]"])');
    if (!cooperationGroup) return true;
    
    // Проверяем, видим ли блок expert-form
    const expertForm = cooperationGroup.closest('.expert-form');
    if (expertForm && expertForm.style.display === 'none') {
        cooperationGroup.classList.remove('error');
        return true;
    }
    
    const checkboxes = cooperationGroup.querySelectorAll('input[type="checkbox"]');
    const hasCheckedBox = Array.from(checkboxes).some(checkbox => checkbox.checked);
    
    cooperationGroup.classList.toggle('error', !hasCheckedBox);
    return hasCheckedBox;
}

// Валидация при потере фокуса для обычных полей
inputs.forEach(input => {
    if (input.type !== 'radio' && input.type !== 'checkbox') {
        input.addEventListener('blur', () => validateField(input));
        input.addEventListener('input', () => {
            const group = input.closest('.input-grup');
            if (group && group.classList.contains('error')) {
                validateField(input);
            }
        });
        
        // Специальная обработка для file input
        if (input.type === 'file') {
            input.addEventListener('change', () => validateField(input));
        }
    }
});

// Валидация radio buttons при изменении
const radioGroups = {};
inputs.forEach(input => {
    if (input.type === 'radio') {
        if (!radioGroups[input.name]) {
            radioGroups[input.name] = [];
        }
        radioGroups[input.name].push(input);
        
        input.addEventListener('change', () => {
            validateField(input);
        });
    }
});

// Валидация чекбоксов в блоке "Основні напрямки роботи" (основная форма)
const workDirectionsCheckboxes = document.querySelectorAll('input[name="work_directions[]"]');
const otherDirectionsTextarea = document.querySelector('textarea[name="other_directions"]');

workDirectionsCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', validateWorkDirections);
});

if (otherDirectionsTextarea) {
    otherDirectionsTextarea.addEventListener('input', validateWorkDirections);
    otherDirectionsTextarea.addEventListener('blur', validateWorkDirections);
}

// Валидация чекбоксов cooperation[] (expert форма)
const cooperationCheckboxes = document.querySelectorAll('input[name="cooperation[]"]');

cooperationCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', validateCooperationCheckboxes);
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    let isFormValid = true;
    const userType = document.getElementById('user-type').value;
    
    // Проверяем все обычные поля (кроме radio и checkbox)
    inputs.forEach(input => {
        if (input.type !== 'radio' && input.type !== 'checkbox') {
            // Пропускаем поля в скрытых блоках
            const fieldContainer = input.closest('.business-form, .go-form, .expert-form');
            if (fieldContainer && fieldContainer.style.display === 'none') {
                return; // пропускаем это поле
            }
            
            const fieldValid = validateField(input);
            if (!fieldValid) isFormValid = false;
        }
    });
    
    // Проверяем все radio группы только в видимых блоках
    Object.keys(radioGroups).forEach(groupName => {
        const firstRadio = radioGroups[groupName][0];
        const fieldContainer = firstRadio.closest('.business-form, .go-form, .expert-form');
        
        // Пропускаем radio группы в скрытых блоках
        if (fieldContainer && fieldContainer.style.display === 'none') {
            return;
        }
        
        const fieldValid = validateField(firstRadio);
        if (!fieldValid) isFormValid = false;
    });
    
    // Проверяем блок с чекбоксами "Основні напрямки роботи" только если видим go-form
    if (userType === 'organization') {
        const workDirectionsValid = validateWorkDirections();
        if (!workDirectionsValid) isFormValid = false;
    }
    
    // Проверяем чекбоксы cooperation[] только если видим expert-form
    if (userType === 'expert') {
        const cooperationValid = validateCooperationCheckboxes();
        if (!cooperationValid) isFormValid = false;
    }
    
    // Проверяем мультиселект стран отдельно
    if (countryMultiSelect) {
        const countryValid = countryMultiSelect.validateField();
        if (!countryValid) isFormValid = false;
    }
    
    if (isFormValid) {
        // Собираем все данные формы
        const formData = new FormData(form);
        const userData = {};
        
        // Обрабатываем обычные поля
        for (let [key, value] of formData.entries()) {
            // Пропускаем файл - он обрабатывается отдельно
            if (key === 'photo') continue;
            
            if (userData[key]) {
                // Если ключ уже существует, создаем массив
                if (Array.isArray(userData[key])) {
                    userData[key].push(value);
                } else {
                    userData[key] = [userData[key], value];
                }
            } else {
                userData[key] = value;
            }
        }
        
        // Добавляем данные из мультиселекта стран
        if (countryMultiSelect) {
            userData['country_region'] = countryMultiSelect.getSelectedValues();
        }
        
        // Добавляем тип пользователя для удобства
        userData['user_type'] = userType;
        
        // Обрабатываем файл отдельно
        const photoFile = document.getElementById('photo').files[0];
        if (photoFile) {
            // Проверяем размер файла (4MB)
            if (photoFile.size > 4 * 1024 * 1024) {
                alert('Файл занадто великий! Максимальний розмір: 4МБ');
                return;
            }
            
            // Проверяем тип файла
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/svg+xml'];
            if (!allowedTypes.includes(photoFile.type)) {
                alert('Невірний тип файлу! Дозволені: JPG, JPEG, PNG, GIF, SVG');
                return;
            }
            
            console.log('Обробка зображення...');
            // Конвертируем изображение в Base64
            convertImageToBase64(photoFile, userData);
        } else {
            // Проверяем, обязательно ли поле файла
            const photoInput = document.getElementById('photo');
            if (photoInput.hasAttribute('required')) {
                alert('Будь ласка, оберіть файл зображення');
                const photoGroup = photoInput.closest('.input-grup');
                if (photoGroup) {
                    photoGroup.classList.add('error');
                    photoGroup.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }
            
            // Если файла нет и он не обязателен, сохраняем данные сразу
            console.log('Збереження даних без зображення...');
            saveUserDataAndRedirect(userData);
        }
    } else {
        // Скроллим к первой ошибке
        const firstError = form.querySelector('.input-grup.error');
        if (firstError) {
            firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // Добавляем фокус на первое поле с ошибкой
            const firstErrorInput = firstError.querySelector('input, textarea, select');
            if (firstErrorInput && firstErrorInput.focus) {
                setTimeout(() => firstErrorInput.focus(), 500);
            }
        }
        
        console.log('Форма містить помилки. Перевірте заповнення полів.');
    }
});
    

// Функция показа сообщения об успешной регистрации
function showRegistrationSuccessMessage() {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = 'registration-success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
                <h4>Реєстрація успішна!</h4>
                <p>Перенаправляємо в особистий кабінет...</p>
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

// Функция для очистки данных (для тестирования)
function clearUserData() {
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    console.log('Данные пользователя очищены');
}

// Функция конвертации изображения в Base64
function convertImageToBase64(file, userData) {
    console.log('Початок конвертації зображення:', file.name);
    
    const reader = new FileReader();
    
    reader.onload = function(e) {
        try {
            // Сохраняем изображение в Base64
            userData.photoBase64 = e.target.result;
            userData.photoFileName = file.name;
            userData.photoSize = file.size;
            userData.photoType = file.type;
            
            console.log('Зображення успішно конвертовано в Base64');
            console.log('Розмір файлу:', (file.size / 1024).toFixed(2), 'KB');
            
            // Сохраняем данные после обработки изображения
            saveUserDataAndRedirect(userData);
            
        } catch (error) {
            console.error('Помилка при збереженні даних зображення:', error);
            alert('Помилка обробки зображення. Спробуйте ще раз.');
        }
    };
    
    reader.onerror = function(error) {
        console.error('Помилка читання файлу:', error);
        alert('Помилка читання файлу. Спробуйте вибрати інший файл.');
        
        // Можно предложить сохранить данные без изображения
        const confirmSave = confirm('Зберегти дані без зображення?');
        if (confirmSave) {
            console.log('Збереження даних без зображення...');
            saveUserDataAndRedirect(userData);
        }
    };
    
    reader.onprogress = function(e) {
        if (e.lengthComputable) {
            const progress = (e.loaded / e.total) * 100;
            console.log('Прогрес завантаження:', progress.toFixed(0) + '%');
            
            // Можно добавить индикатор прогресса
            // updateProgressIndicator(progress);
        }
    };
    
    // Читаем файл как Data URL (Base64)
    reader.readAsDataURL(file);
}

function showLoadingIndicator() {
    const submitButton = document.querySelector('.registracion-form-submit button');
    if (submitButton) {
        submitButton.disabled = true;
        submitButton.textContent = 'Обробка зображення...';
    }
}
function hideLoadingIndicator() {
    const submitButton = document.querySelector('.registracion-form-submit button');
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = 'Зареєструватися';
    }
}

// Для отладки - добавляем в глобальную область видимости
window.clearUserData = clearUserData;

// Отключаем стандартные сообщения браузера
inputs.forEach(input => {
    input.addEventListener('invalid', (e) => {
        e.preventDefault();
    });
});

// Функция для file upload
function handleFileSelect(input) {
    const file = input.files[0];
    const selectedFileDiv = document.getElementById('selectedFile');
    
    if (file) {
        // Проверка размера файла (4MB = 4 * 1024 * 1024 bytes)
        if (file.size > 4 * 1024 * 1024) {
            alert('Файл занадто великий! Максимальний розмір: 4МБ');
            input.value = '';
            selectedFileDiv.style.display = 'none';
            // Валидируем поле после очистки
            validateField(input);
            return;
        }
        
        selectedFileDiv.textContent = `Обрано: ${file.name}`;
        selectedFileDiv.style.display = 'block';
        
        // Валидируем поле после выбора файла
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
            alert('Файл занадто великий! Максимальний розмір: 4МБ');
            input.value = '';
            selectedFileDiv.style.display = 'none';
            return;
        }
        
        selectedFileDiv.textContent = `Обрано: ${file.name}`;
        selectedFileDiv.style.display = 'block';
    } else {
        selectedFileDiv.style.display = 'none';
    }
}

// Функция сохранения данных и перенаправления
function saveUserDataAndRedirect(userData) {
    showLoadingIndicator();
    
    // Добавляем метаданные
    userData.registrationDate = new Date().toISOString();
    userData.userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    
    try {
        // Сохраняем в localStorage
        localStorage.setItem('userData', JSON.stringify(userData));
        localStorage.setItem('isLoggedIn', 'true');
        
        console.log('Дані користувача збережено');
        console.log('Тип користувача:', userData.user_type);
        console.log('Країни:', userData.country_region);
        
        // Показываем уведомление об успешной регистрации
        showRegistrationSuccessMessage();
        
        // Перенаправляем на страницу благодарности через 2 секунды
        setTimeout(() => {
            window.location.href = 'thank-page.html';
        }, 2000);
        
    } catch (error) {
        console.error('Помилка збереження даних:', error);
        hideLoadingIndicator();
        
        // Если данные слишком большие для localStorage
        if (error.name === 'QuotaExceededError') {
            const confirmResize = confirm('Зображення занадто велике для збереження. Спробувати зменшити якість?');
            if (confirmResize) {
                // Можно добавить функцию сжатия изображения
                alert('Функція стиснення зображення поки не реалізована. Спробуйте менший файл.');
            }
        } else {
            alert('Помилка збереження даних. Спробуйте ще раз.');
        }
    }
}

// Управление классом has-value для select
document.addEventListener('DOMContentLoaded', function() {
    const selects = document.querySelectorAll('select');
    
    selects.forEach(select => {
        // Проверяем значение при загрузке
        checkSelectValue(select);
        
        // Проверяем при изменении
        select.addEventListener('change', function() {
            checkSelectValue(this);
        });
    });
    
    function checkSelectValue(select) {
        if (select.value && select.value !== "" && select.value !== "0") {
            select.classList.add('has-value');
        } else {
            select.classList.remove('has-value');
        }
    }
});

// Функция для управления видимостью блоков формы
function handleUserTypeChange() {
    const userTypeSelect = document.getElementById('user-type');
    const businessForm = document.querySelector('.business-form');
    const goForm = document.querySelector('.go-form');
    const expertForm = document.querySelector('.expert-form');
    
    // Скрываем все блоки по умолчанию
    function hideAllForms() {
        if (businessForm) businessForm.style.display = 'none';
        if (goForm) goForm.style.display = 'none';
        if (expertForm) expertForm.style.display = 'none';
    }
    
    // Показываем нужный блок в зависимости от выбора
    function showFormByUserType(userType) {
        hideAllForms();
        
        switch(userType) {
            case 'business':
                if (businessForm) {
                    businessForm.style.display = 'block';
                    console.log('Показан блок business-form');
                }
                break;
            case 'organization':
                if (goForm) {
                    goForm.style.display = 'block';
                    console.log('Показан блок go-form');
                }
                break;
            case 'expert':
                if (expertForm) {
                    expertForm.style.display = 'block';
                    console.log('Показан блок expert-form');
                }
                break;
            case 'other':
            case '':
            default:
                // Для "Інше" и пустого значения оставляем все скрытым
                console.log('Все блоки скрыты');
                break;
        }
    }
    
    // Инициализация - скрываем все блоки при загрузке
    hideAllForms();
    
    // Обработчик изменения select
    userTypeSelect.addEventListener('change', function() {
        const selectedValue = this.value;
        console.log('Выбран тип пользователя:', selectedValue);
        showFormByUserType(selectedValue);
        
        // Очищаем ошибки валидации в скрытых блоках
        clearValidationErrorsInHiddenForms(selectedValue);
    });
}

// Функция для очистки ошибок валидации в скрытых блоках
function clearValidationErrorsInHiddenForms(selectedUserType) {
    const allForms = ['.business-form', '.go-form', '.expert-form'];
    const visibleFormMap = {
        'business': '.business-form',
        'organization': '.go-form',
        'expert': '.expert-form'
    };
    
    // Определяем какой блок должен быть видимым
    const visibleForm = visibleFormMap[selectedUserType];
    
    // Очищаем ошибки в невидимых блоках
    allForms.forEach(formSelector => {
        if (formSelector !== visibleForm) {
            const form = document.querySelector(formSelector);
            if (form) {
                // Убираем класс error со всех input-grup в этом блоке
                const errorGroups = form.querySelectorAll('.input-grup.error');
                errorGroups.forEach(group => {
                    group.classList.remove('error');
                });
                
                // Очищаем значения полей в скрытых блоках (опционально)
                const inputs = form.querySelectorAll('input, textarea, select');
                inputs.forEach(input => {
                    if (input.type === 'checkbox' || input.type === 'radio') {
                        input.checked = false;
                    } else if (input.tagName === 'SELECT') {
                        input.selectedIndex = 0;
                    } else {
                        input.value = '';
                    }
                });
            }
        }
    });
}

// Модифицируем функцию isFieldRequired для учета типа пользователя
function isFieldRequiredForUserType(field) {
    const userType = document.getElementById('user-type').value;
    const fieldContainer = field.closest('.business-form, .go-form, .expert-form');
    
    // Если поле находится в скрытом блоке, оно не обязательно
    if (fieldContainer) {
        const isBusinessForm = fieldContainer.classList.contains('business-form');
        const isGoForm = fieldContainer.classList.contains('go-form');
        const isExpertForm = fieldContainer.classList.contains('expert-form');
        
        // Проверяем соответствие типа пользователя и блока формы
        if (isBusinessForm && userType !== 'business') return false;
        if (isGoForm && userType !== 'organization') return false;
        if (isExpertForm && userType !== 'expert') return false;
    }
    
    // Используем существующую логику для определения обязательности
    return isFieldRequired(field);
}

// Инициализация обработчика при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Запускаем обработчик выбора типа пользователя
    handleUserTypeChange();
    
    // Остальной код инициализации...
    // (здесь должен быть ваш существующий код из DOMContentLoaded)
});

// Экспортируем функции для использования в других частях кода
window.userTypeHandler = {
    clearValidationErrorsInHiddenForms,
    isFieldRequiredForUserType
};
// edit-profile.js - многоязычная версия единой формы редактирования профиля и пароля

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
            profileUpdated: 'Профіль успішно оновлено!',
            profileAndPasswordUpdated: 'Профіль та пароль успішно оновлено!',
            fixPasswordErrors: 'Будь ласка, виправте помилки в секції зміни пароля',
            fixProfileErrors: 'Будь ласка, виправте помилки в особистій інформації',
            profileUpdateError: 'Помилка збереження профілю',
            profileUpdatedSuccess: 'Profile updated successfully',
            passwordChangedSuccess: 'Password changed successfully',
            changingPassword: 'Changing password...',
            confirmCancelEdit: 'Ви впевнені, що хочете скасувати зміни?',
            weakPassword: 'Слабкий пароль',
            fairPassword: 'Задовільний пароль',
            goodPassword: 'Хороший пароль',
            strongPassword: 'Сильний пароль',
            error: 'Помилка',
            dataLoadError: 'Помилка завантаження даних для редагування'
        },
        en: {
            profileUpdated: 'Profile successfully updated!',
            profileAndPasswordUpdated: 'Profile and password successfully updated!',
            fixPasswordErrors: 'Please fix errors in the password change section',
            fixProfileErrors: 'Please fix errors in personal information',
            profileUpdateError: 'Profile saving error',
            profileUpdatedSuccess: 'Profile updated successfully',
            passwordChangedSuccess: 'Password changed successfully',
            changingPassword: 'Changing password...',
            confirmCancelEdit: 'Are you sure you want to cancel changes?',
            weakPassword: 'Weak password',
            fairPassword: 'Fair password',
            goodPassword: 'Good password',
            strongPassword: 'Strong password',
            error: 'Error',
            dataLoadError: 'Error loading data for editing'
        }
    };
    
    return texts[currentLang][key] || texts['uk'][key];
}

document.addEventListener('DOMContentLoaded', function() {
    loadEditData();
    initializeFormHandlers();
    initializePasswordToggle();
});

// Состояние формы
const formState = {
    isPasswordSectionOpen: false,
    isPasswordChangeRequested: false
};

// Загружаем данные для редактирования
function loadEditData() {
    try {
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
            window.location.href = getLocalizedPath('registration.html');
            return;
        }

        const userData = JSON.parse(userDataString);
        
        // Заполняем поля профиля
        const profileFields = {
            'editName': userData.name || '',
            'editEmail': userData.email || '',
            'editPhone': userData.phone || '',
            'editDescription': userData['short-description'] || '',
            'editExperience': userData.experience || '',
            'editExpectation': userData.expectation || ''
        };

        Object.keys(profileFields).forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                field.value = profileFields[fieldId];
            }
        });
        
    } catch (error) {
        console.error('Error loading edit data:', error);
        alert(getLocalizedText('dataLoadError'));
        window.location.href = getLocalizedPath('cabinet.html');
    }
}

// Инициализация обработчиков формы
function initializeFormHandlers() {
    const form = document.getElementById('editForm');
    if (!form) {
        console.error('Form editForm not found');
        return;
    }

    // Единый обработчик отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        handleFormSubmission(this);
    });

    // Валидация полей профиля
    initializeProfileValidation();
    
    // Валидация полей паролей
    initializePasswordValidation();
}

// Инициализация переключателя секции паролей
function initializePasswordToggle() {
    const passwordToggle = document.getElementById('passwordToggle');
    const passwordFields = document.getElementById('passwordFields');

    if (passwordToggle && passwordFields) {
        passwordToggle.addEventListener('click', function() {
            formState.isPasswordSectionOpen = !formState.isPasswordSectionOpen;
            
            if (formState.isPasswordSectionOpen) {
                passwordFields.classList.add('show');
                passwordToggle.classList.add('active');
                formState.isPasswordChangeRequested = true;
            } else {
                passwordFields.classList.remove('show');
                passwordToggle.classList.remove('active');
                clearPasswordFields();
                formState.isPasswordChangeRequested = false;
            }
        });
    }
}

// Обработка отправки единой формы
function handleFormSubmission(form) {
    const profileValid = validateProfileFields();
    let passwordValid = true;

    // Если секция паролей открыта, валидируем пароли
    if (formState.isPasswordChangeRequested) {
        passwordValid = validatePasswordForm();
        
        if (!passwordValid) {
            alert(getLocalizedText('fixPasswordErrors'));
            return;
        }
    }

    if (!profileValid) {
        alert(getLocalizedText('fixProfileErrors'));
        return;
    }

    // Обновляем профиль
    updateProfile(form);

    // Если запрошена смена пароля, обрабатываем ее
    if (formState.isPasswordChangeRequested) {
        handlePasswordChange(form);
    }

    // Показываем успех и перенаправляем
    showSuccessAndRedirect();
}

// Обновление профиля
function updateProfile(form) {
    try {
        const userDataString = localStorage.getItem('userData');
        const userData = JSON.parse(userDataString);
        
        // Обновляем данные профиля
        const profileFields = ['editName', 'editEmail', 'editPhone', 'editDescription', 'editExperience', 'editExpectation'];
        
        profileFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field && field.value.trim()) {
                const key = fieldId.replace('edit', '').toLowerCase();
                if (key === 'name') userData.name = field.value.trim();
                else if (key === 'email') userData.email = field.value.trim();
                else if (key === 'phone') userData.phone = field.value.trim();
                else if (key === 'description') userData['short-description'] = field.value.trim();
                else if (key === 'experience') userData.experience = field.value.trim();
                else if (key === 'expectation') userData.expectation = field.value.trim();
            }
        });
        
        // Добавляем метку о последнем обновлении
        userData.lastUpdated = new Date().toISOString();
        
        // Сохраняем обновленные данные
        localStorage.setItem('userData', JSON.stringify(userData));
        
        console.log(getLocalizedText('profileUpdatedSuccess'));
        
    } catch (error) {
        console.error('Error updating profile:', error);
        alert(getLocalizedText('profileUpdateError'));
        return;
    }
}

// Обработка смены пароля
function handlePasswordChange(form) {
    const formData = new FormData(form);
    const oldPassword = formData.get('oldPassword');
    const newPassword = formData.get('newPassword');

    // В реальном проекте здесь будет отправка на сервер
    console.log(getLocalizedText('changingPassword'), {
        oldPassword: oldPassword,
        newPassword: newPassword
    });

    // Имитация успешной смены пароля
    console.log(getLocalizedText('passwordChangedSuccess'));
}

// Показ сообщения об успехе и перенаправление
function showSuccessAndRedirect() {
    // Показываем сообщение об успехе
    const successMessage = document.getElementById('successMessage');
    if (successMessage) {
        if (formState.isPasswordChangeRequested) {
            successMessage.textContent = getLocalizedText('profileAndPasswordUpdated');
        } else {
            successMessage.textContent = getLocalizedText('profileUpdated');
        }
        successMessage.style.display = 'block';
    }
    
    // Обновляем header если есть
    if (window.headerLoader) {
        window.headerLoader.refresh();
    }
    
    // Перенаправляем в кабинет через 2 секунды
    setTimeout(() => {
        window.location.href = getLocalizedPath('cabinet.html');
    }, 2000);
}

// ===== ВАЛИДАЦИЯ ПРОФИЛЯ =====

function initializeProfileValidation() {
    const profileFields = ['editName', 'editEmail', 'editPhone'];
    
    profileFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('blur', () => validateProfileField(fieldId));
            field.addEventListener('input', () => {
                const group = field.closest('.input-grup');
                if (group && group.classList.contains('error')) {
                    validateProfileField(fieldId);
                }
            });
        }
    });
}

function validateProfileField(fieldId) {
    const field = document.getElementById(fieldId);
    const group = field.closest('.input-grup');
    
    if (!field || !group) return true;
    
    let isValid = false;
    
    if (fieldId === 'editEmail') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        isValid = field.value.trim() !== '' && emailRegex.test(field.value);
    } else {
        isValid = field.value.trim() !== '';
    }
    
    group.classList.remove('error', 'success');
    if (field.value.trim() !== '') {
        group.classList.add(isValid ? 'success' : 'error');
    }
    
    return isValid;
}

function validateProfileFields() {
    const requiredFields = ['editName', 'editEmail', 'editPhone'];
    let allValid = true;
    
    requiredFields.forEach(fieldId => {
        const isValid = validateProfileField(fieldId);
        if (!isValid) allValid = false;
    });
    
    return allValid;
}

// ===== ВАЛИДАЦИЯ ПАРОЛЕЙ =====

function initializePasswordValidation() {
    const passwordFields = ['oldPassword', 'newPassword', 'confirmPassword'];
    
    passwordFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            if (fieldId === 'newPassword') {
                field.addEventListener('input', function() {
                    updatePasswordStrength(this.value);
                    validatePasswordForm();
                });
            } else {
                field.addEventListener('input', validatePasswordForm);
            }
        }
    });
}

// Переключение видимости пароля
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    if (!input) return;
    
    const toggle = input.nextElementSibling;
    if (!toggle) return;
    
    const icon = toggle.querySelector('.eye-icon');
    if (!icon) return;
    
    if (input.type === 'password') {
        input.type = 'text';
        icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
        `;
    } else {
        input.type = 'password';
        icon.innerHTML = `
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
        `;
    }
}

// Проверка силы пароля
function checkPasswordStrength(password) {
    let score = 0;
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(password)
    };

    // Обновляем индикаторы требований
    Object.keys(requirements).forEach(req => {
        const element = document.getElementById(`req-${req}`);
        if (element) {
            if (requirements[req]) {
                element.classList.add('met');
                score++;
            } else {
                element.classList.remove('met');
            }
        }
    });

    return { score, requirements };
}

// Обновление индикатора силы пароля
function updatePasswordStrength(password) {
    const strengthIndicator = document.getElementById('passwordStrength');
    const strengthFill = document.getElementById('strengthFill');
    const strengthText = document.getElementById('strengthText');

    if (!strengthIndicator || !strengthFill || !strengthText) return;

    if (password.length === 0) {
        strengthIndicator.classList.remove('show');
        return;
    }

    strengthIndicator.classList.add('show');
    const { score } = checkPasswordStrength(password);

    // Удаляем предыдущие классы
    strengthFill.className = 'strength-fill';

    let strengthLevel = '';
    let strengthMessage = '';

    if (score <= 2) {
        strengthLevel = 'strength-weak';
        strengthMessage = getLocalizedText('weakPassword');
    } else if (score === 3) {
        strengthLevel = 'strength-fair';
        strengthMessage = getLocalizedText('fairPassword');
    } else if (score === 4) {
        strengthLevel = 'strength-good';
        strengthMessage = getLocalizedText('goodPassword');
    } else {
        strengthLevel = 'strength-strong';
        strengthMessage = getLocalizedText('strongPassword');
    }

    strengthFill.classList.add(strengthLevel);
    strengthText.textContent = strengthMessage;
}

// Валидация полей паролей
function validatePasswordField(fieldId, validationFn) {
    const field = document.getElementById(fieldId);
    const group = document.getElementById(fieldId + 'Group');
    
    if (!field || !group) return true;
    
    const isValid = validationFn(field.value);

    group.classList.remove('error', 'success');
    if (field.value.length > 0) {
        group.classList.add(isValid ? 'success' : 'error');
    }

    return isValid;
}

// Проверка формы паролей
function validatePasswordForm() {
    if (!formState.isPasswordChangeRequested) return true;

    const oldPasswordField = document.getElementById('oldPassword');
    const newPasswordField = document.getElementById('newPassword');
    const confirmPasswordField = document.getElementById('confirmPassword');

    if (!oldPasswordField || !newPasswordField || !confirmPasswordField) {
        return true; // Поля паролей отсутствуют
    }

    const oldPassword = oldPasswordField.value;
    const newPassword = newPasswordField.value;
    const confirmPassword = confirmPasswordField.value;

    const isOldPasswordValid = oldPassword.length > 0;
    const { score } = checkPasswordStrength(newPassword);
    const isNewPasswordValid = score === 5;
    const isConfirmPasswordValid = newPassword === confirmPassword && confirmPassword.length > 0;

    validatePasswordField('oldPassword', () => isOldPasswordValid);
    validatePasswordField('newPassword', () => isNewPasswordValid);
    validatePasswordField('confirmPassword', () => isConfirmPasswordValid);

    const isFormValid = isOldPasswordValid && isNewPasswordValid && isConfirmPasswordValid;
    return isFormValid;
}

// Очистка полей паролей
function clearPasswordFields() {
    const passwordFields = ['oldPassword', 'newPassword', 'confirmPassword'];
    
    passwordFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        const group = document.getElementById(fieldId + 'Group');
        
        if (field) field.value = '';
        if (group) group.classList.remove('error', 'success');
    });

    const strengthIndicator = document.getElementById('passwordStrength');
    if (strengthIndicator) {
        strengthIndicator.classList.remove('show');
    }

    const requirements = document.querySelectorAll('.requirement');
    requirements.forEach(req => req.classList.remove('met'));
}

// Отмена редактирования
function cancelEdit() {
    if (confirm(getLocalizedText('confirmCancelEdit'))) {
        window.location.href = getLocalizedPath('cabinet.html');
    }
}

// Экспортируем функции в глобальную область видимости
window.togglePassword = togglePassword;
window.cancelEdit = cancelEdit;
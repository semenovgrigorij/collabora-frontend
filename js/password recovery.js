// password-recovery.js - многоязычная версия

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
            enterEmail: 'Введіть вашу електронну пошту',
            passwordResetEmailSent: 'Інструкції з відновлення паролю надіслано на вашу електронну пошту',
            backToLogin: 'Повернення до форми входу',
            emailForPasswordReset: 'Email для восстановления пароля:',
            invalidEmail: 'Введіть коректний email',
            emailSent: 'Email надіслано!',
            checkEmail: 'Перевірте вашу електронну пошту',
            sending: 'Надсилання...',
            send: 'Надіслати',
            passwordRecovery: 'Відновлення паролю'
        },
        en: {
            enterEmail: 'Enter your email address',
            passwordResetEmailSent: 'Password reset instructions sent to your email',
            backToLogin: 'Back to login form',
            emailForPasswordReset: 'Email for password reset:',
            invalidEmail: 'Enter a valid email',
            emailSent: 'Email sent!',
            checkEmail: 'Check your email',
            sending: 'Sending...',
            send: 'Send',
            passwordRecovery: 'Password Recovery'
        }
    };
    
    return texts[currentLang][key] || texts['uk'][key];
}

// Основная логика восстановления пароля
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('password-reset-form');
    const emailInput = document.getElementById('email');
    const submitButton = form.querySelector('button[type="submit"]');
    const backToLoginLink = document.getElementById('back-to-login-link');

    // Валидация email при вводе
    emailInput.addEventListener('input', function() {
        validateEmailField(this);
    });

    emailInput.addEventListener('blur', function() {
        validateEmailField(this);
    });

    // Обработчик отправки формы
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const email = emailInput.value.trim();
        
        // Валидация email
        if (!email) {
            showError(getLocalizedText('enterEmail'));
            emailInput.focus();
            return;
        }

        if (!isValidEmail(email)) {
            showError(getLocalizedText('invalidEmail'));
            emailInput.focus();
            return;
        }

        // Отправка запроса на восстановление пароля
        sendPasswordResetRequest(email);
    });

    // Обработчик для возврата к форме входа
    backToLoginLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Перенаправляем на страницу авторизации с учетом языка
        window.location.href = getLocalizedPath('authorization.html');
    });
});

// Функция валидации email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Валидация поля email
function validateEmailField(emailInput) {
    const email = emailInput.value.trim();
    const formGroup = emailInput.closest('.input-grup');
    
    if (!formGroup) return;

    // Убираем предыдущие классы
    formGroup.classList.remove('error', 'success');

    if (email === '') {
        // Если поле пустое, не показываем ошибку
        return;
    }

    if (isValidEmail(email)) {
        formGroup.classList.add('success');
    } else {
        formGroup.classList.add('error');
    }
}

// Функция отправки запроса на восстановление пароля
function sendPasswordResetRequest(email) {
    const submitButton = document.querySelector('#password-reset-form button[type="submit"]');
    const originalText = submitButton.textContent;

    // Показываем индикатор загрузки
    submitButton.disabled = true;
    submitButton.textContent = getLocalizedText('sending');

    console.log(getLocalizedText('emailForPasswordReset'), email);

    // Имитация отправки запроса (в реальном проекте здесь будет AJAX запрос)
    setTimeout(() => {
        try {
            // Здесь можно добавить реальную отправку запроса на сервер
            // const response = await fetch('/api/password-reset', {
            //     method: 'POST',
            //     headers: { 'Content-Type': 'application/json' },
            //     body: JSON.stringify({ email })
            // });

            // Показываем успешное уведомление
            showSuccessMessage();
            
            // Очищаем поле после успешной отправки
            document.getElementById('email').value = '';
            
            // Убираем классы валидации
            const formGroup = document.getElementById('email').closest('.input-grup');
            if (formGroup) {
                formGroup.classList.remove('error', 'success');
            }

        } catch (error) {
            console.error('Error sending password reset request:', error);
            showError('Помилка надсилання запиту. Спробуйте пізніше.');
        } finally {
            // Восстанавливаем кнопку
            submitButton.disabled = false;
            submitButton.textContent = originalText;
        }
    }, 1500); // Имитация задержки сети
}

// Функция показа сообщения об ошибке
function showError(message) {
    // Убираем предыдущие уведомления
    removeExistingNotifications();

    const notification = document.createElement('div');
    notification.className = 'error-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
                <h4>Помилка</h4>
                <p>${message}</p>
            </div>
        </div>
    `;

    addNotificationStyles();
    document.body.appendChild(notification);

    // Убираем уведомление через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Функция показа сообщения об успехе
function showSuccessMessage() {
    // Убираем предыдущие уведомления
    removeExistingNotifications();

    const notification = document.createElement('div');
    notification.className = 'success-notification';
    notification.innerHTML = `
        <div class="notification-content">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            <div>
                <h4>${getLocalizedText('emailSent')}</h4>
                <p>${getLocalizedText('passwordResetEmailSent')}</p>
            </div>
        </div>
    `;

    addNotificationStyles();
    document.body.appendChild(notification);

    // Убираем уведомление через 5 секунд
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Функция удаления существующих уведомлений
function removeExistingNotifications() {
    const existingNotifications = document.querySelectorAll('.error-notification, .success-notification');
    existingNotifications.forEach(notification => notification.remove());
}

// Функция добавления стилей для уведомлений
function addNotificationStyles() {
    const styleId = 'password-reset-notification-styles';
    if (document.getElementById(styleId)) return;

    const style = document.createElement('style');
    style.id = styleId;
    style.textContent = `
        .error-notification,
        .success-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
            z-index: 1000;
            animation: slideInRight 0.3s ease;
            max-width: 400px;
        }

        .error-notification {
            border: 1px solid #EF4444;
        }

        .success-notification {
            border: 1px solid #10B981;
        }
        
        .notification-content {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        
        .notification-content h4 {
            margin: 0 0 4px 0;
            font-size: 16px;
            font-weight: 600;
        }

        .error-notification .notification-content h4 {
            color: #EF4444;
        }

        .success-notification .notification-content h4 {
            color: #10B981;
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
            .error-notification,
            .success-notification {
                left: 20px;
                right: 20px;
                max-width: none;
            }
        }
    `;
    
    document.head.appendChild(style);
}
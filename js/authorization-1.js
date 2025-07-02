// authorization.js - обновленная версия

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, есть ли форма авторизации на странице
    const authForm = document.getElementById('authorization-form');
    if (!authForm) {
        // Если формы авторизации нет, просто проверяем авторизацию и выходим
        checkExistingAuth();
        return;
    }
    
    // Проверяем, не авторизован ли уже пользователь
    checkExistingAuth();
    
    // Обработчик формы авторизации
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const emailField = document.getElementById('email');
        const passwordField = document.getElementById('password');
        
        if (!emailField || !passwordField) {
            console.error('Поля email или password не найдены');
            return;
        }
        
        const email = emailField.value.trim();
        const password = passwordField.value;
        
        // Базовая валидация
        if (!email || !password) {
            showError('Заповніть всі поля');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('Введіть коректний email');
            return;
        }
        
        // Попытка авторизации
        attemptLogin(email, password);
    });
    
    // Показ/скрытие пароля
    setupPasswordToggle();
});

// Проверка существующей авторизации
function checkExistingAuth() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn === 'true') {
        // Пользователь уже авторизован, перенаправляем в кабинет
        window.location.href = 'cabinet.html';
    }
}

// Попытка входа в систему
function attemptLogin(email, password) {
    // Показываем индикатор загрузки
    showLoginLoading(true);
    
    // Имитируем задержку запроса к серверу
    setTimeout(() => {
        const loginResult = performLogin(email, password);
        showLoginLoading(false);
        
        if (loginResult.success) {
            // Успешная авторизация
            handleSuccessfulLogin(loginResult.userData);
        } else {
            // Ошибка авторизации
            showError(loginResult.message);
        }
    }, 1000); // Имитация сетевой задержки
}

// Выполнение логики входа
function performLogin(email, password) {
    try {
        // Получаем данные зарегистрированного пользователя
        const registeredUserData = localStorage.getItem('userData');
        
        if (!registeredUserData) {
            return {
                success: false,
                message: 'Користувача не знайдено. Спочатку зареєструйтеся.'
            };
        }
        
        const userData = JSON.parse(registeredUserData);
        
        // Проверяем email
        if (userData.email !== email) {
            return {
                success: false,
                message: 'Неправильний email або пароль'
            };
        }
        
        // В реальном проекте здесь будет проверка хеша пароля
        // Для демо используем простую проверку или пропускаем
        if (password.length < 6) {
            return {
                success: false,
                message: 'Неправильний email або пароль'
            };
        }
        
        // Успешная авторизация
        return {
            success: true,
            userData: userData
        };
        
    } catch (error) {
        return {
            success: false,
            message: 'Помилка системи. Спробуйте пізніше.'
        };
    }
}

// Обработка успешного входа
function handleSuccessfulLogin(userData) {
    // Устанавливаем флаг авторизации
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('loginTime', new Date().getTime().toString());
    
    // Обновляем время последнего входа
    userData.lastLoginTime = new Date().toISOString();
    localStorage.setItem('userData', JSON.stringify(userData));
    
    // Показываем сообщение об успехе
    showAuthSuccessMessage('Вхід успішний! Перенаправляємо...');
    
    // Перенаправляем в личный кабинет
    setTimeout(() => {
        window.location.href = 'cabinet.html';
    }, 1500);
}

// Показ индикатора загрузки
function showLoginLoading(isLoading) {
    const submitButton = document.querySelector('.login-form-submit button');
    const originalText = submitButton.textContent;
    
    if (isLoading) {
        submitButton.disabled = true;
        submitButton.textContent = 'Вхід...';
        submitButton.style.opacity = '0.7';
    } else {
        submitButton.disabled = false;
        submitButton.textContent = originalText;
        submitButton.style.opacity = '1';
    }
}

// Показ сообщения об ошибке
function showError(message) {
    const form = document.getElementById('authorization-form');
    if (!form) {
        console.error('Форма авторизации не найдена');
        return;
    }
    
    // Убираем предыдущие сообщения
    removeExistingMessages();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    
    form.insertBefore(errorDiv, form.firstChild);
    
    // Автоматически убираем через 5 секунд
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

// Показ сообщения об успехе
function showAuthSuccessMessage(message) {
    const form = document.getElementById('authorization-form');
    if (!form) {
        console.error('Форма авторизации не найдена');
        return;
    }
    
    // Убираем предыдущие сообщения
    removeExistingMessages();
    
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    form.insertBefore(successDiv, form.firstChild);
}

// Удаление существующих сообщений
function removeExistingMessages() {
    const existingMessages = document.querySelectorAll('.error-message, .success-message');
    existingMessages.forEach(msg => msg.remove());
}

// Валидация email
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Настройка переключения видимости пароля
function setupPasswordToggle() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.querySelector('.open-eye');
    
    if (eyeIcon && passwordInput) {
        eyeIcon.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            
            // Меняем иконку (если есть разные иконки)
            if (type === 'text') {
                eyeIcon.src = './icons/icon-close-eye.svg'; // если есть такая иконка
                eyeIcon.alt = 'hide';
            } else {
                eyeIcon.src = './icons/icon-open-eye.svg';
                eyeIcon.alt = 'show';
            }
        });
        
        // Делаем иконку кликабельной
        eyeIcon.style.cursor = 'pointer';
    }
}

// Демо-функция для быстрого входа (для тестирования)
function quickLogin() {
    const userData = localStorage.getItem('userData');
    if (userData) {
        const user = JSON.parse(userData);
        document.getElementById('email').value = user.email || '';
        document.getElementById('password').value = 'demo123'; // демо-пароль
        
        console.log('Демо-данные заполнены. Email:', user.email);
        console.log('Демо-пароль: demo123');
    } else {
        console.log('Сначала зарегистрируйтесь');
    }
}

// Добавляем функцию в глобальную область для тестирования
window.quickLogin = quickLogin;
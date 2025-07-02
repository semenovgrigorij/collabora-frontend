// thank-page.js - скрипт для страницы благодарности

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем, что пользователь действительно зарегистрировался
    checkRegistrationStatus();
    
    // Добавляем кнопку перехода в кабинет
    addCabinetButton();
    
    // Автоматический переход в кабинет через 10 секунд
    startAutoRedirect();
});

// Проверка статуса регистрации
function checkRegistrationStatus() {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const userData = localStorage.getItem('userData');
    
    // Если пользователь не зарегистрирован, перенаправляем на регистрацию
    if (!isLoggedIn || !userData) {
        console.log('User not registered, redirecting to registration');
        window.location.href = 'registration.html';
        return;
    }
    
    // Персонализируем страницу
    personalizeThankYouPage(JSON.parse(userData));
    
    console.log('Registration confirmed, showing thank you page');
}

// Персонализация страницы благодарности
function personalizeThankYouPage(userData) {
    const titleElement = document.querySelector('h1');
    const userName = userData.name || 'Користувач';
    
    if (titleElement) {
        // Добавляем имя пользователя в заголовок
        titleElement.textContent = `Дякуємо, ${userName.split(' ')[0]}!`;
    }
    
    // Можно добавить дополнительную информацию
    const descriptionElement = document.querySelector('p');
    if (descriptionElement) {
        descriptionElement.textContent = `Ваш профіль "${userName}" буде опрацьовано та активовано адміністратором Collabora найближчим часом.`;
    }
}

// Добавление кнопки перехода в кабинет
function addCabinetButton() {
    const gratitudeWrapper = document.querySelector('.gratitude-wrapper');
    if (!gratitudeWrapper) return;
    
    // Создаем контейнер для кнопок
    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'thank-page-buttons';
    buttonContainer.style.cssText = `
        display: flex;
        gap: 15px;
        margin-top: 30px;
        width: 100%;
        max-width: 400px;
    `;
    
    // Кнопка перехода в кабинет
    const cabinetButton = document.createElement('button');
    cabinetButton.className = 'cabinet-btn';
    cabinetButton.textContent = 'Перейти в кабінет';
    cabinetButton.style.cssText = `
        flex: 1;
        background: linear-gradient(135deg, #6A0DAD, #8A2BE2);
        color: white;
        border: none;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s ease;
    `;
    
    // Hover эффект для кнопки
    cabinetButton.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-2px)';
        this.style.boxShadow = '0 4px 12px rgba(106, 13, 173, 0.3)';
    });
    
    cabinetButton.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
        this.style.boxShadow = 'none';
    });
    
    // Обработчик клика
    cabinetButton.addEventListener('click', function() {
        goToCabinet();
    });
    
    // Кнопка "Позже"
    const laterButton = document.createElement('button');
    laterButton.className = 'later-btn';
    laterButton.textContent = 'Пізніше';
    laterButton.style.cssText = `
        flex: 1;
        background: transparent;
        color: #6A0DAD;
        border: 2px solid #6A0DAD;
        padding: 12px 24px;
        border-radius: 8px;
        cursor: pointer;
        font-size: 16px;
        font-weight: 500;
        transition: all 0.3s ease;
    `;
    
    // Hover эффект для кнопки "Позже"
    laterButton.addEventListener('mouseenter', function() {
        this.style.background = '#6A0DAD';
        this.style.color = 'white';
    });
    
    laterButton.addEventListener('mouseleave', function() {
        this.style.background = 'transparent';
        this.style.color = '#6A0DAD';
    });
    
    // Обработчик клика "Позже"
    laterButton.addEventListener('click', function() {
        // Можно перенаправить на главную страницу или закрыть вкладку
        window.location.href = 'index.html'; // или другая страница
    });
    
    // Добавляем кнопки в контейнер
    buttonContainer.appendChild(cabinetButton);
    buttonContainer.appendChild(laterButton);
    
    // Добавляем контейнер на страницу
    gratitudeWrapper.appendChild(buttonContainer);
}

// Функция перехода в кабинет
function goToCabinet() {
    console.log('Redirecting to cabinet...');
    window.location.href = 'cabinet.html';
}

// Автоматический переход в кабинет
function startAutoRedirect() {
    let countdown = 10; // 10 секунд
    
    // Создаем элемент для отображения обратного отсчета
    const countdownElement = document.createElement('div');
    countdownElement.className = 'auto-redirect-countdown';
    countdownElement.style.cssText = `
        margin-top: 20px;
        padding: 10px;
        background: rgba(106, 13, 173, 0.1);
        border-radius: 8px;
        text-align: center;
        font-size: 14px;
        color: #6A0DAD;
    `;
    
    // Функция обновления текста обратного отсчета
    function updateCountdown() {
        countdownElement.textContent = `Автоматичний перехід в кабінет через ${countdown} сек.`;
    }
    
    updateCountdown();
    
    // Добавляем элемент на страницу
    const gratitudeWrapper = document.querySelector('.gratitude-wrapper');
    if (gratitudeWrapper) {
        gratitudeWrapper.appendChild(countdownElement);
    }
    
    // Запускаем обратный отсчет
    const timer = setInterval(() => {
        countdown--;
        updateCountdown();
        
        if (countdown <= 0) {
            clearInterval(timer);
            goToCabinet();
        }
    }, 1000);
    
    // Останавливаем таймер при клике на любую кнопку
    document.addEventListener('click', function(e) {
        if (e.target.matches('.cabinet-btn, .later-btn')) {
            clearInterval(timer);
            if (countdownElement.parentNode) {
                countdownElement.remove();
            }
        }
    });
}

// Добавляем анимацию появления
function addPageAnimation() {
    const gratitudeWrapper = document.querySelector('.gratitude-wrapper');
    if (gratitudeWrapper) {
        gratitudeWrapper.style.opacity = '0';
        gratitudeWrapper.style.transform = 'translateY(20px)';
        gratitudeWrapper.style.transition = 'all 0.6s ease';
        
        setTimeout(() => {
            gratitudeWrapper.style.opacity = '1';
            gratitudeWrapper.style.transform = 'translateY(0)';
        }, 100);
    }
}

// Инициализация анимации
addPageAnimation();
// cabinet.js - отдельный скрипт только для страницы кабинета

document.addEventListener('DOMContentLoaded', function() {
    console.log('Cabinet page loaded'); // Для отладки
    loadUserData();
});

// Функция загрузки данных пользователя
function loadUserData() {
    try {
        console.log('Loading user data...'); // Для отладки
        
        // Проверяем авторизацию
        const isLoggedIn = localStorage.getItem('isLoggedIn');
        console.log('Is logged in:', isLoggedIn); // Для отладки
        
        if (!isLoggedIn || isLoggedIn !== 'true') {
            console.log('User not logged in, redirecting...'); // Для отладки
            window.location.href = 'authorization.html';
            return;
        }

        // Загружаем данные из localStorage
        const userDataString = localStorage.getItem('userData');
        if (!userDataString) {
            console.log('No user data found'); // Для отладки
            throw new Error('Дані користувача не знайдено');
        }

        console.log('Raw user data string:', userDataString); // Для отладки

        const userData = JSON.parse(userDataString);
        
        // Проверяем корректность данных
        if (!userData || typeof userData !== 'object') {
            throw new Error('Некоректні дані користувача');
        }
        
        // Проверяем обязательные поля
        if (!userData.email) {
            console.warn('User data missing email field');
        }
        
        console.log('User data loaded:', userData); // Для отладки
        displayUserData(userData);
        
    } catch (error) {
        console.error('Error loading user data:', error); // Для отладки
        showError('Помилка завантаження профілю: ' + error.message);
    }
}

// Функция отображения данных пользователя
function displayUserData(user) {
    console.log('Displaying user data...'); // Для отладки
    console.log('User object:', user); // Для отладки
    console.log('User name field:', user.name); // Для отладки
    
    // Скрываем индикатор загрузки
    const loadingMessage = document.getElementById('loadingMessage');
    const dashboardContent = document.getElementById('dashboardContent');
    
    if (loadingMessage) loadingMessage.style.display = 'none';
    if (dashboardContent) dashboardContent.style.display = 'flex';

    // Заполняем данные в header (маленький блок)
    const userName = getSafeName(user);
    const headerUserName = document.getElementById('headerUserName');
    const headerUserAvatar = document.getElementById('headerUserAvatar');
    
    if (headerUserName) {
        headerUserName.textContent = getFirstName(userName);
    }
    
    if (headerUserAvatar) {
        if (user.photoBase64) {
            headerUserAvatar.innerHTML = `<img src="${user.photoBase64}" alt="Аватар" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            headerUserAvatar.textContent = getFirstLetter(userName);
        }
    }

    // Заполняем основные данные пользователя (большой блок)
    const userNameElement = document.getElementById('userName');
    const userEmailElement = document.getElementById('userEmail');
    const userPhoneElement = document.getElementById('userPhone');
    const userSkillsElement = document.getElementById('userSkills');
    const userAvatarElement = document.getElementById('userAvatar');
    
    if (userNameElement) userNameElement.textContent = userName;
    if (userEmailElement) userEmailElement.textContent = user.email || 'Email не вказано';
    if (userPhoneElement) userPhoneElement.textContent = user.phone || 'Телефон не вказано';
    if (userSkillsElement) {
    
        console.log('Debugging skills data:');
        console.log('user[short-description]:', user['short-description']);
        console.log('user.shortDescription:', user.shortDescription);
    
        // Получаем короткое описание деятельности из формы регистрации
        const shortDescription = user['short-description'] || user.shortDescription || '';
    
        if (shortDescription.trim()) {
            console.log('Setting skills from short-description:', shortDescription);
            userSkillsElement.textContent = shortDescription;
        } else {
            // Fallback - если нет короткого описания, показываем тип пользователя
            const userTypeText = getUserTypeText(user['user-type'] || user.userType);
            console.log('Setting skills from user type:', userTypeText);
            userSkillsElement.textContent = userTypeText || 'Опис діяльності не вказано';
        }
    }
    
    // Обрабатываем главный аватар пользователя
    if (userAvatarElement) {
        if (user.photoBase64) {
            userAvatarElement.innerHTML = `<img src="${user.photoBase64}" alt="Аватар" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        } else {
            // Если изображения нет, показываем инициалы
            userAvatarElement.textContent = userName.charAt(0).toUpperCase();
        }
    }

    // НОВЫЙ КОД для business-description:
const businessDescriptionElement = document.querySelector('.business-description');
if (businessDescriptionElement) {
    
    // Отладка: проверяем данные
    console.log('Debugging business description data:');
    console.log('user.services:', user.services);
    
    // Получаем описание продуктов/услуг из формы регистрации
    const servicesDescription = user.services || user['services'] || '';
    
    if (servicesDescription.trim()) {
        console.log('Setting business description from services:', servicesDescription);
        
        // Создаем HTML контент для блока описания бизнеса
        businessDescriptionElement.innerHTML = `
            <div class="business-description-content">
                <p>${servicesDescription}</p>
            </div>
        `;
        
        // Показываем блок
        businessDescriptionElement.style.display = 'block';
    } else {
        // Если нет описания услуг, скрываем блок
        console.log('No services description found, hiding business description block');
        businessDescriptionElement.style.display = 'none';
    }
}
    // Заполняем личную информацию
    const displayNameElement = document.getElementById('displayName');
    const displayEmailElement = document.getElementById('displayEmail');
    const displayPhoneElement = document.getElementById('displayPhone');
    const displayCountryElement = document.getElementById('displayCountry');
    
    if (displayNameElement) displayNameElement.textContent = user.name || '-';
    if (displayEmailElement) displayEmailElement.textContent = user.email || '-';
    if (displayPhoneElement) displayPhoneElement.textContent = user.phone || '-';
    
    // Обработка массива стран
    if (displayCountryElement) {
        const countries = Array.isArray(user['country_region']) ? user['country_region'] : [];
        displayCountryElement.textContent = countries.length > 0 ? countries.join(', ') : '-';
    }

    // Отображение фото профиля
    const photoField = document.getElementById('photoField');
    const profilePhoto = document.getElementById('profilePhoto');
    if (user.photoBase64 && photoField && profilePhoto) {
        profilePhoto.src = user.photoBase64;
        photoField.style.display = 'block';
    }

    // Заполняем профессиональную информацию
    const displaySpecializationElement = document.getElementById('displaySpecialization');
    const displayDescriptionElement = document.getElementById('displayDescription');
    const displayExperienceElement = document.getElementById('displayExperience');
    
    if (displaySpecializationElement) {
        displaySpecializationElement.textContent = getSpecializationText(user.specialization);
    }
    if (displayDescriptionElement) {
        displayDescriptionElement.textContent = user['short-description'] || '-';
    }
    if (displayExperienceElement) {
        displayExperienceElement.textContent = user.experience || '-';
    }

    // Отображение форматов сотрудничества
    const cooperationContainer = document.getElementById('displayCooperation');
    if (cooperationContainer) {
        const cooperation = Array.isArray(user.cooperation) ? user.cooperation : [];
        if (cooperation.length > 0) {
            cooperationContainer.innerHTML = cooperation.map(item => 
                `<span class="tag">${getCooperationText(item)}</span>`
            ).join('');
        } else {
            cooperationContainer.innerHTML = '<div class="field-value">-</div>';
        }
    }

    // Дата регистрации
    const displayCreatedAtElement = document.getElementById('displayCreatedAt');
    if (displayCreatedAtElement && user.registrationDate) {
        const date = new Date(user.registrationDate);
        displayCreatedAtElement.textContent = date.toLocaleDateString('uk-UA');
    }

    const displayExpectationElement = document.getElementById('displayExpectation');
    if (displayExpectationElement) {
        displayExpectationElement.textContent = user.expectation || '-';
    }
    
    console.log('User data displayed successfully'); // Для отладки
    
    // Настраиваем функциональность header
    setupHeaderUserBlock();
}

// Вспомогательные функции для перевода значений
function getSpecializationText(value) {
    const specializations = {
        'production': 'Виробнича',
        'trading': 'Торгова',
        'service': 'Сервісна',
        'financial': 'Фінансова',
        'informational': 'Інформаційна',
        'other': 'Інше'
    };
    return specializations[value] || value || '-';
}

function getCooperationText(value) {
    const cooperations = {
        'consultations': 'Консультації',
        'mentoring': 'Менторство',
        'project': 'Проєктна участь',
        'online-offline': 'Онлайн / Офлайн'
    };
    return cooperations[value] || value;
}

// Безопасная функция для получения имени пользователя
function getSafeName(user) {
    if (!user) return 'Користувач';
    
    // Проверяем разные возможные поля
    const name = user.name || user.userName || user.fullName || '';
    
    return typeof name === 'string' && name.trim() 
        ? name.trim() 
        : 'Користувач';
}

// Безопасная функция для получения первой буквы
function getFirstLetter(name) {
    const safeName = getSafeName({ name });
    return safeName.charAt(0).toUpperCase();
}

// Безопасная функция для получения первого слова
function getFirstName(name) {
    const safeName = getSafeName({ name });
    return safeName.split(' ')[0];
}

// Функция отображения ошибки
function showError(message) {
    const loadingMessage = document.getElementById('loadingMessage');
    const errorMessage = document.getElementById('errorMessage');
    
    if (loadingMessage) loadingMessage.style.display = 'none';
    if (errorMessage) {
        errorMessage.textContent = message;
        errorMessage.style.display = 'block';
    } else {
        alert(message); // Fallback если элемента нет
    }
}

// Функция выхода
function logout() {
    console.log('Logging out...'); // Для отладки
    
    // Очищаем данные пользователя
    localStorage.removeItem('userData');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('loginTime');
    
    // Показываем уведомление
    alert('Ви успішно вийшли з системи');
    
    // Перенаправляем на страницу авторизации
    window.location.href = 'authorization.html';
}

// Функция редактирования профиля
function editProfile() {
    console.log('Redirecting to edit profile...'); // Для отладки
    window.location.href = 'edit-profile.html';
}

// Добавляем обработчик клика на блок пользователя в header
function setupHeaderUserBlock() {
    const headerUserBlock = document.getElementById('headerUserBlock');
    if (headerUserBlock) {
        headerUserBlock.addEventListener('click', function() {
            // Можно показать dropdown меню или перейти к редактированию
            const dropdown = document.createElement('div');
            dropdown.className = 'header-user-dropdown';
            dropdown.innerHTML = `
                <div class="dropdown-item" onclick="editProfile()">
                    <span>📝</span> Редагувати профіль
                </div>
                <div class="dropdown-item" onclick="logout()">
                    <span>🚪</span> Вийти
                </div>
            `;
            
            // Добавляем стили для dropdown
            dropdown.style.cssText = `
                position: absolute;
                top: 100%;
                right: 0;
                background: white;
                border: 1px solid #e9ecef;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                z-index: 1000;
                min-width: 200px;
                margin-top: 8px;
            `;
            
            // Стили для элементов dropdown
            const style = document.createElement('style');
            style.textContent = `
                .header-user-dropdown .dropdown-item {
                    padding: 12px 16px;
                    cursor: pointer;
                    transition: background 0.3s ease;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    font-size: 14px;
                }
                .header-user-dropdown .dropdown-item:hover {
                    background: #f8f9fa;
                }
                .header-user-dropdown .dropdown-item:first-child {
                    border-top-left-radius: 8px;
                    border-top-right-radius: 8px;
                }
                .header-user-dropdown .dropdown-item:last-child {
                    border-bottom-left-radius: 8px;
                    border-bottom-right-radius: 8px;
                }
            `;
            
            // Проверяем, нет ли уже открытого dropdown
            const existingDropdown = document.querySelector('.header-user-dropdown');
            if (existingDropdown) {
                existingDropdown.remove();
                return;
            }
            
            document.head.appendChild(style);
            headerUserBlock.style.position = 'relative';
            headerUserBlock.appendChild(dropdown);
            
            // Закрытие при клике вне dropdown
            setTimeout(() => {
                document.addEventListener('click', function closeDropdown(e) {
                    if (!headerUserBlock.contains(e.target)) {
                        dropdown.remove();
                        style.remove();
                        document.removeEventListener('click', closeDropdown);
                    }
                });
            }, 100);
        });
    }
}

// Вспомогательная функция для перевода типа пользователя
function getUserTypeText(userType) {
    const userTypes = {
        'business': 'Бізнес',
        'organization': 'ГО/ініціативна група/громада/волонтери',
        'expert': 'Експерт',
        'other': 'Інше'
    };
    return userTypes[userType] || userType || 'Тип користувача не вказано';
}

// Делаем функции доступными глобально
window.logout = logout;
window.editProfile = editProfile;

// Функция для очистки поврежденных данных (для отладки)
window.clearCorruptedData = function() {
    console.log('Clearing all localStorage data...');
    localStorage.clear();
    alert('Данные очищены. Перенаправляем на страницу регистрации...');
    window.location.href = 'registration.html';
};

// Функция для проверки данных localStorage (для отладки)
window.checkUserData = function() {
    console.log('=== USER DATA DEBUG ===');
    console.log('isLoggedIn:', localStorage.getItem('isLoggedIn'));
    console.log('userData raw:', localStorage.getItem('userData'));
    
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('userData parsed:', userData);
        console.log('name field:', userData.name, typeof userData.name);
        console.log('email field:', userData.email, typeof userData.email);
    } catch (error) {
        console.error('Error parsing userData:', error);
    }
    console.log('=== END DEBUG ===');
};
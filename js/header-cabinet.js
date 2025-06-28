// header-loader.js - загрузчик header компонента

class HeaderLoader {
    constructor() {
        this.headerPath = './components/header-cabinet.html';
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.userData = this.getUserData();
    }

    // Безопасное получение данных пользователя
    getUserData() {
        try {
            const userData = localStorage.getItem('userData');
            return userData ? JSON.parse(userData) : {};
        } catch (error) {
            console.error('Error parsing user data:', error);
            return {};
        }
    }

    // Загрузка HTML компонента
    async loadHeader() {
        try {
            const response = await fetch(this.headerPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            return html;
        } catch (error) {
            console.error('Error loading header:', error);
            return this.createFallbackHeader();
        }
    }

    // Fallback header если не удалось загрузить компонент
    createFallbackHeader() {
        return `
            <header class="header">
                <div class="header-wrapper">
                    <a class="header-logo" href="./home.html">
                        <img src="./icons/logo-header-mobile.svg" alt="Collabora" width="130">
                    </a>
                    <nav class="header-nav">
                        <ul class="header-list">
                            <li><a href="./home.html">Головна</a></li>
                            <li><a href="./contacts.html">Контакти</a></li>
                        </ul>
                    </nav>
                    <div class="header-wrapper-right">
                        ${this.isLoggedIn ? this.createUserBlock() : this.createAuthButtons()}
                    </div>
                </div>
            </header>
        `;
    }

    // Создание блока пользователя
    createUserBlock() {
        const name = this.getSafeName();
        const avatar = this.createAvatarContent();
        const company = this.getCompanyName();

        return `
            <div class="header-user-block" id="headerUserBlock">
                <div class="header-user-avatar" id="headerUserAvatar">${avatar}</div>
                <div class="header-user-info">
                    <span class="header-user-name" id="headerUserName">${name}</span>
                    // <span class="header-user-status" id="headerUserCompany">${company}</span>
                </div>
            </div>
        `;
    }

    // Создание кнопок авторизации
    createAuthButtons() {
        return `
            <div class="auth-buttons" id="authButtons">
                <a href="./authorization.html" class="auth-btn login-btn">Увійти</a>
                <a href="./registration.html" class="auth-btn register-btn">Реєстрація</a>
            </div>
        `;
    }

    // Создание контента аватара
    createAvatarContent() {
        if (this.userData.photoBase64) {
            return `<img src="${this.userData.photoBase64}" alt="Аватар" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        }
        return this.getFirstLetter();
    }

    // Безопасное получение имени
    getSafeName() {
        const name = this.userData.name || '';
        if (typeof name === 'string' && name.trim()) {
            return name.trim().split(' ')[0];
        }
        return 'Користувач';
    }

    // Получение первой буквы
    getFirstLetter() {
        const name = this.userData.name || '';
        if (typeof name === 'string' && name.trim()) {
            return name.trim().charAt(0).toUpperCase();
        }
        return 'К';
    }

    // Получение названия организации
    getCompanyName() {
        return this.userData.companyName || 'Назва організації';
    }
    // Вставка header в DOM
    async insertHeader() {
        const headerContainer = document.getElementById('header-placeholder-cabinet') || 
            document.querySelector('[data-header]') ||
            this.createHeaderContainer();

        const headerHTML = await this.loadHeader();
        headerContainer.innerHTML = headerHTML;

        // Инициализируем функциональность после вставки
        this.initializeHeader();
    }

    // Создание контейнера для header если его нет
    createHeaderContainer() {
        const container = document.createElement('div');
        container.id = 'header-placeholder-cabinet';
        document.body.insertBefore(container, document.body.firstChild);
        return container;
    }

    // Инициализация функциональности header
    initializeHeader() {
        // Показываем/скрываем блоки в зависимости от авторизации
        this.setupVisibility();
        
        // Заполняем данные пользователя
        if (this.isLoggedIn) {
            this.fillUserData();
            this.setupUserDropdown();
        }

        // Инициализируем остальную функциональность
        this.setupLanguageSelector();
        this.setupMobileMenu();
    }

    // Настройка видимости элементов
    setupVisibility() {
        const userBlock = document.getElementById('headerUserBlock');
        const authButtons = document.getElementById('authButtons');

        if (this.isLoggedIn) {
            if (userBlock) userBlock.style.display = 'flex';
            if (authButtons) authButtons.style.display = 'none';
        } else {
            if (userBlock) userBlock.style.display = 'none';
            if (authButtons) authButtons.style.display = 'flex';
        }
    }

    // Заполнение данных пользователя
    fillUserData() {
        const nameElement = document.getElementById('headerUserName');
        const avatarElement = document.getElementById('headerUserAvatar');
        const companyElement = document.getElementById('headerUserCompany');

        if (nameElement) {
            nameElement.textContent = this.getSafeName();
        }

        if (avatarElement) {
            avatarElement.innerHTML = this.createAvatarContent();
        }
        if (companyElement) {
            companyElement.innerHTML = this.getCompanyName();
        }
    }

    // Настройка dropdown пользователя
    setupUserDropdown() {
        const userBlock = document.getElementById('headerUserBlock');
        if (!userBlock) return;

        userBlock.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleUserDropdown();
        });

        // Закрытие при клике вне
        document.addEventListener('click', () => {
            this.closeUserDropdown();
        });
    }

    // Показ/скрытие dropdown
    toggleUserDropdown() {

        const existing = document.querySelector('.header-user-dropdown');
        const userBlock = document.getElementById('headerUserBlock');
        const arrow = userBlock?.querySelector('.arrow-cabinet');

        if (existing) {
        this.hideDropdown(existing);
        // Возвращаем стрелку в исходное положение
        if (arrow) {
            arrow.style.transform = 'rotate(0deg)';
        }
        // Убираем класс активности с блока
        if (userBlock) {
            userBlock.classList.remove('dropdown-open');
        }
        return;
    }

        const dropdown = document.createElement('div');
        dropdown.className = 'header-user-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-item" onclick="window.location.href='cabinet.html'">
                Мій профіль
            </div>
            <div class="dropdown-item" onclick="window.location.href='edit-profile.html'">
                Налаштування
            </div>           
        `;

        // Добавляем стили для анимации
        this.addDropdownAnimationStyles();

        userBlock.style.position = 'relative';
        userBlock.appendChild(dropdown);

        // Поворачиваем стрелку вверх
        if (arrow) {
            arrow.style.transform = 'rotate(180deg)';
        }
    
        // Добавляем класс активности к блоку
        userBlock.classList.add('dropdown-open');

        // Запускаем анимацию появления
        this.showDropdown(dropdown);
    }

    // Анимация появления dropdown
    showDropdown(dropdown) {
        // Устанавливаем начальное состояние
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-10px) scale(0.95)';
        dropdown.style.visibility = 'visible';
        
        // Принудительный reflow для применения начальных стилей
        dropdown.offsetHeight;
        
        // Запускаем анимацию
        dropdown.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0) scale(1)';
    }

    // Анимация скрытия dropdown
    hideDropdown(dropdown) {
        dropdown.style.transition = 'all 0.2s cubic-bezier(0.4, 0, 1, 1)';
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-5px) scale(0.98)';
        
        // Удаляем элемент после завершения анимации
        setTimeout(() => {
            if (dropdown.parentNode) {
                dropdown.remove();
            }
        }, 200);
    }

    // Добавление стилей для анимации dropdown
    addDropdownAnimationStyles() {
        const styleId = 'dropdown-animation-styles';
        if (document.getElementById(styleId)) return;

        const style = document.createElement('style');
        style.id = styleId;
        style.textContent = `
            .header-user-block .header-user-dropdown {
                padding: 9px 5px;
                position: absolute;
                top: calc(100% + 12px);
                right: 0;
                box-shadow: 0 0 8px 0 rgba(25, 21, 37, 0.09);
                background: var(--white);
                border: 1px solid rwhitegba(0, 0, 0, 0.1);
                border-radius: 10px;
                z-index: 1000;
                min-width: 231px;
                overflow: hidden;
                visibility: hidden;
                transform-origin: top right;
                gap: 10px;
                z-index: 1000;
            }
            
            .header-user-dropdown::before {
                content: '';
                position: absolute;
                top: -6px;
                right: 20px;
                width: 12px;
                height: 12px;
                background: white;
                border: 1px solid rgba(0, 0, 0, 0.1);
                border-bottom: none;
                border-right: none;
                transform: rotate(45deg);
                z-index: -1;
            }

            .header-user-dropdown .dropdown-item {
                padding: 10px;
                cursor: pointer;
                transition: all 0.2s ease;
                display: flex;
                align-items: center;
                border: none;
                background: none;
                width: 100%;
                text-align: left;
                position: relative;
                overflow: hidden;
                font-family: var(--font-family);
                font-weight: 400;
                font-size: 14px;
                line-height: 110%;
                color: var(--text-dark);
            }

            .header-user-dropdown .dropdown-item::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(106, 13, 173, 0.1), rgba(138, 43, 226, 0.1));
                opacity: 0;
                transition: opacity 0.2s ease;
            }

            .header-user-dropdown .dropdown-item:hover::before {
                opacity: 1;
            }

            .header-user-dropdown .dropdown-item:hover {
                color: var(--violet);
                transform: translateX(2px);
            }

            .header-user-dropdown .dropdown-item:first-child {
                border-top-left-radius: 8px;
                border-top-right-radius: 8px;
            }

            .header-user-dropdown .dropdown-item:last-child {
                border-bottom-left-radius: 8px;
                border-bottom-right-radius: 8px;
            }

            .arrow-cabinet {
                vertical-align: middle;
                max-width: 100%;
                display: inline-block;
                transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }


            .header-user-block.dropdown-open {
                background: var(--text-dark);
                transform: translateY(-1px);
            }

            .header-user-block.dropdown-open .header-user-name {
                color: white;
            }
            .header-user-block.dropdown-open .arrow-cabinet path {
                stroke: var(--white);
            }
            .header-user-block.dropdown-open .arrow-cabinet {
                transform: rotate(180deg);
            }
            
            .header-user-block:hover:not(.dropdown-open) {
                transform: translateY(-1px);
            }

            .header-user-block:hover .arrow-cabinet {
                transform: rotate(15deg);
            }

            .header-user-block.dropdown-open:hover .arrow-cabinet {
                transform: rotate(195deg);
            }

            /* Анимация для мобильных устройств */
            @media (max-width: 769px) {
                .header-user-dropdown {
                    right: -10px;
                    min-width: 200px;
                    top: calc(100% + 8px);
                }

                .header-user-dropdown::before {
                    right: 15px;
                }

                .header-user-dropdown .dropdown-item {
                    padding: 12px 16px;
                    font-size: 13px;
                }
            }
        `;

        document.head.appendChild(style);
    }

        // Закрытие dropdown
    closeUserDropdown() {
        const dropdown = document.querySelector('.header-user-dropdown');
        const userBlock = document.getElementById('headerUserBlock');
        const arrow = userBlock?.querySelector('.arrow-cabinet');
    
        if (dropdown) {
            this.hideDropdown(dropdown);
        
            // Возвращаем стрелку в исходное положение
            if (arrow) {
                arrow.style.transform = 'rotate(0deg)';
            }
        
            // Убираем класс активности с блока
            if (userBlock) {
                userBlock.classList.remove('dropdown-open');
            }
        }
    }

    // Настройка языкового селектора
    setupLanguageSelector() {
        const langSelector = document.getElementById('langSelector');
        if (!langSelector) return;

        const currentLang = langSelector.querySelector('.current-lang');
        const dropdown = langSelector.querySelector('.lang-dropdown');

        if (currentLang && dropdown) {

            currentLang.addEventListener('click', (e) => {
                e.stopPropagation();
                
                const isOpen = dropdown.style.display === 'block';
                if (isOpen) {
                    this.hideLangDropdown(dropdown);
                } else {
                    this.showLangDropdown(dropdown);
                }
            });

            document.addEventListener('click', () => {
                this.hideLangDropdown(dropdown);
            });

            // Обработка выбора языка
            const langOptions = dropdown.querySelectorAll('.lang-option');
            langOptions.forEach(option => {
                option.addEventListener('click', function() {
                    const lang = this.dataset.lang;
                    const url = this.dataset.url;
                    
                    langSelector.querySelector('.current-lang-text').textContent = lang;
                    
                    if (url) {
                        window.location.href = url;
                    }
                    
                    dropdown.style.display = 'none';
                });
            });
        }
    }

    // Анимации для языкового dropdown
    showLangDropdown(dropdown) {
        dropdown.style.display = 'block';
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-8px)';
        
        dropdown.offsetHeight; // Reflow
        
        dropdown.style.transition = 'all 0.2s ease';
        dropdown.style.opacity = '1';
        dropdown.style.transform = 'translateY(0)';
    }

    hideLangDropdown(dropdown) {
        dropdown.style.transition = 'all 0.15s ease';
        dropdown.style.opacity = '0';
        dropdown.style.transform = 'translateY(-5px)';
        
        setTimeout(() => {
            dropdown.style.display = 'none';
        }, 150);
    }


    // Настройка мобильного меню
    setupMobileMenu() {
        const hamburger = document.querySelector('.hamburger-btn');
        const nav = document.querySelector('.header-nav');
        const overlay = document.querySelector('.mobile-overlay');

        if (!hamburger) return;

        hamburger.addEventListener('click', () => {
            const isOpen = nav?.classList.contains('mobile-open');
            
            if (isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        });

        if (overlay) {
            overlay.addEventListener('click', () => this.closeMobileMenu());
        }
    }

    openMobileMenu() {
        const nav = document.querySelector('.header-nav');
        const hamburger = document.querySelector('.hamburger-btn');
        const overlay = document.querySelector('.mobile-overlay');

        nav?.classList.add('mobile-open');
        hamburger?.classList.add('active');
        overlay?.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeMobileMenu() {
        const nav = document.querySelector('.header-nav');
        const hamburger = document.querySelector('.hamburger-btn');
        const overlay = document.querySelector('.mobile-overlay');

        nav?.classList.remove('mobile-open');
        hamburger?.classList.remove('active');
        overlay?.classList.remove('active');
        document.body.style.overflow = '';
    }

    // Выход из системы
    logout() {
        if (confirm('Ви впевнені, що хочете вийти з системи?')) {
            localStorage.removeItem('userData');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginTime');
            window.location.href = 'authorization.html';
        }
    }

    // Обновление header после изменения данных
    refresh() {
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.userData = this.getUserData();
        this.insertHeader();
    }
}

// Создаем глобальный экземпляр
window.headerLoader = new HeaderLoader();

// Автоматическая загрузка при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    window.headerLoader.insertHeader();
});
// header-cabinet.js - многоязычная версия загрузчика header компонента

class HeaderLoader {
    constructor() {
        this.currentLang = this.getCurrentLanguage();
        this.headerPath = this.getHeaderPath();
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.userData = this.getUserData();
    }

    // Определение текущего языка
    getCurrentLanguage() {
        const currentPath = window.location.pathname;
        const isEnglishPage = currentPath.includes('/en/');
        const detectedLang = isEnglishPage ? 'en' : 'uk';
        console.log(`🌐 Определен язык: ${detectedLang} из пути: ${currentPath}`);
        return detectedLang;
    }

    // Получение правильного пути к header
    getHeaderPath() {
        if (this.currentLang === 'en') {
            return '../components/header-cabinet-en.html';
        } else {
            return './components/header-cabinet.html';
        }
    }

    // Получение пути к странице с учетом языка
    getLocalizedPath(pageName) {
        if (this.currentLang === 'en') {
            // Для английской версии ссылки должны оставаться в папке /en/
            return `./${pageName}`;
        } else {
            // Для украинской версии ссылки относительно корня
            return `./${pageName}`;
        }
    }

    // Получение пути к ресурсам с учетом языка
    getResourcePath(resourcePath) {
        if (this.currentLang === 'en') {
            return `../${resourcePath}`;
        } else {
            return `./${resourcePath}`;
        }
    }

    // Локализованные тексты
    getLocalizedText(key) {
        const texts = {
            uk: {
                user: 'Користувач',
                organizationName: 'Назва організації',
                myProfile: 'Мій профіль',
                settings: 'Налаштування',
                signOut: 'Вийти',
                logoutConfirm: 'Ви впевнені, що хочете вийти з системи?',
                login: 'Увійти',
                register: 'Реєстрація',
                home: 'Головна',
                contacts: 'Контакти',
                howItWorks: 'Як це працює',
                privacyPolicy: 'Політика конфіденційності'
            },
            en: {
                user: 'User',
                organizationName: 'Organization Name',
                myProfile: 'My Profile',
                settings: 'Settings',
                signOut: 'Sign Out',
                logoutConfirm: 'Are you sure you want to sign out?',
                login: 'Log in',
                register: 'Sign up',
                home: 'Home',
                contacts: 'Contacts',
                howItWorks: 'How it works',
                privacyPolicy: 'Privacy Policy'
            }
        };
        
        return texts[this.currentLang][key] || texts['uk'][key];
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

    // Загрузка HTML компонента с улучшенной обработкой ошибок
    async loadHeader() {
        console.log(`📥 Попытка загрузки header: ${this.headerPath}`);
        
        try {
            const response = await fetch(this.headerPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
            }
            const html = await response.text();
            
            if (!html || html.trim() === '') {
                throw new Error('Пустой ответ от сервера');
            }
            
            console.log(`✅ Header успешно загружен с пути: ${this.headerPath}`);
            return html;
        } catch (error) {
            console.error(`❌ Ошибка загрузки header с пути ${this.headerPath}:`, error);
            
            // Пробуем fallback
            return await this.loadFallbackHeader();
        }
    }

    // Загрузка fallback header
    async loadFallbackHeader() {
        const fallbackPath = './components/header-cabinet.html'; // украинская версия как fallback
        console.log(`🔄 Попытка загрузки fallback header: ${fallbackPath}`);
        
        try {
            const response = await fetch(fallbackPath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            console.log(`✅ Fallback header загружен успешно`);
            return html;
        } catch (error) {
            console.error(`❌ Ошибка загрузки fallback header:`, error);
            console.log(`🔧 Создаем резервный header`);
            return this.createFallbackHeader();
        }
    }

    // Fallback header если не удалось загрузить компонент
    createFallbackHeader() {
        const logoPath = this.getResourcePath('icons/logo-header-mobile.svg');
        const homeLink = this.getLocalizedPath('home.html');
        const contactsLink = this.getLocalizedPath('contacts.html');
        
        return `
            <header class="header">
                <div class="header-wrapper">
                    <a class="header-logo" href="${homeLink}">
                        <img src="${logoPath}" alt="Collabora" width="130">
                    </a>
                    <nav class="header-nav">
                        <ul class="header-list">
                            <li><a href="${homeLink}">${this.getLocalizedText('home')}</a></li>
                            <li><a href="${contactsLink}">${this.getLocalizedText('contacts')}</a></li>
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
                    <!-- <span class="header-user-status" id="headerUserCompany">${company}</span> -->
                </div>
            </div>
        `;
    }

    // Создание кнопок авторизации
    createAuthButtons() {
        const loginLink = this.getLocalizedPath('authorization.html');
        const registerLink = this.getLocalizedPath('registration.html');
        
        return `
            <div class="auth-buttons" id="authButtons">
                <a href="${loginLink}" class="auth-btn login-btn">${this.getLocalizedText('login')}</a>
                <a href="${registerLink}" class="auth-btn register-btn">${this.getLocalizedText('register')}</a>
            </div>
        `;
    }

    // Создание контента аватара
    createAvatarContent() {
        if (this.userData.photoBase64) {
            const altText = this.currentLang === 'en' ? 'Avatar' : 'Аватар';
            return `<img src="${this.userData.photoBase64}" alt="${altText}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        }
        return this.getFirstLetter();
    }

    // Безопасное получение имени
    getSafeName() {
        const name = this.userData.name || '';
        if (typeof name === 'string' && name.trim()) {
            return name.trim().split(' ')[0];
        }
        return this.getLocalizedText('user');
    }

    // Получение первой буквы
    getFirstLetter() {
        const name = this.userData.name || '';
        if (typeof name === 'string' && name.trim()) {
            return name.trim().charAt(0).toUpperCase();
        }
        return this.getLocalizedText('user').charAt(0).toUpperCase();
    }

    // Получение названия организации
    getCompanyName() {
        return this.userData.companyName || this.getLocalizedText('organizationName');
    }

    // Вставка header в DOM с улучшенной обработкой
    async insertHeader() {
        console.log('🚀 Начинаем вставку header...');
        
        const headerContainer = document.getElementById('header-placeholder-cabinet') || 
            document.getElementById('header-placeholder') ||
            document.querySelector('[data-header]') ||
            this.createHeaderContainer();

        // Устанавливаем видимость placeholder
        this.ensurePlaceholderVisibility(headerContainer);

        try {
            const headerHTML = await this.loadHeader();
            headerContainer.innerHTML = headerHTML;

            // Инициализируем функциональность после вставки
            this.initializeHeader();
            
            console.log('✅ Header успешно вставлен и инициализирован');
            
            // Диспатчим событие успешной загрузки
            this.dispatchHeaderLoadedEvent();
            
        } catch (error) {
            console.error('❌ Критическая ошибка вставки header:', error);
            this.handleCriticalError(headerContainer);
        }
    }

    // Обеспечение видимости placeholder
    ensurePlaceholderVisibility(container) {
        container.style.opacity = '1';
        container.style.visibility = 'visible';
        container.style.display = 'block';
        container.classList.add('header-loading');
        
        console.log('📦 Header placeholder подготовлен и видимость установлена');
    }

    // Обработка критической ошибки
    handleCriticalError(container) {
        container.innerHTML = this.createFallbackHeader();
        container.style.opacity = '1';
        container.style.visibility = 'visible';
        container.classList.remove('header-loading');
        container.classList.add('header-error');
        
        console.log('🔧 Показан критический fallback header');
        
        this.initializeHeader();
    }

    // Диспатч события загрузки
    dispatchHeaderLoadedEvent() {
        const event = new CustomEvent('headerLoaded', {
            detail: {
                language: this.currentLang,
                isLoggedIn: this.isLoggedIn,
                timestamp: Date.now()
            }
        });
        
        document.dispatchEvent(event);
        console.log('📡 Событие headerLoaded отправлено');
    }

    // Создание контейнера для header если его нет
    createHeaderContainer() {
        const container = document.createElement('div');
        container.id = 'header-placeholder-cabinet';
        document.body.insertBefore(container, document.body.firstChild);
        console.log('📦 Создан новый header container');
        return container;
    }

    // Инициализация функциональности header
    initializeHeader() {
        console.log('🔧 Инициализация функциональности header...');
        
        // Убираем класс загрузки
        const container = document.getElementById('header-placeholder-cabinet') || 
                         document.getElementById('header-placeholder');
        if (container) {
            container.classList.remove('header-loading');
            container.classList.add('header-loaded');
        }
        
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
        
        console.log('✅ Функциональность header инициализирована');
    }

    // Настройка видимости элементов
    setupVisibility() {
        const userBlock = document.getElementById('headerUserBlock');
        const authButtons = document.getElementById('authButtons');

        if (this.isLoggedIn) {
            if (userBlock) userBlock.style.display = 'flex';
            if (authButtons) authButtons.style.display = 'none';
            console.log('👤 Показан блок авторизованного пользователя');
        } else {
            if (userBlock) userBlock.style.display = 'none';
            if (authButtons) authButtons.style.display = 'flex';
            
            // Если пользователь не авторизован в кабинете, перенаправляем
            console.log('❌ Пользователь не авторизован в кабинете');
            window.location.href = this.getLocalizedPath('authorization.html');
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
            companyElement.textContent = this.getCompanyName();
        }
        
        console.log('📝 Данные пользователя заполнены');
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
        
        console.log('📋 User dropdown настроен');
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

        const cabinetLink = this.getLocalizedPath('cabinet.html');
        const editProfileLink = this.getLocalizedPath('edit-profile.html');

        const dropdown = document.createElement('div');
        dropdown.className = 'header-user-dropdown';
        dropdown.innerHTML = `
            <div class="dropdown-item" onclick="window.location.href='${cabinetLink}'">
                ${this.getLocalizedText('myProfile')}
            </div>
            <div class="dropdown-item" onclick="window.location.href='${editProfileLink}'">
                ${this.getLocalizedText('settings')}
            </div>
            <div class="dropdown-item" onclick="window.headerLoader.logout()">
                ${this.getLocalizedText('signOut')}
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
            /* Принудительная видимость header placeholder */
            #header-placeholder,
            #header-placeholder-cabinet {
                opacity: 1 !important;
                visibility: visible !important;
                display: block !important;
            }
            
            .header-loading {
                background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
                background-size: 200% 100%;
                animation: loading-shimmer 1.5s infinite;
                min-height: 60px;
            }
            
            @keyframes loading-shimmer {
                0% { background-position: -200% 0; }
                100% { background-position: 200% 0; }
            }
            
            .header-loaded {
                background: none !important;
                animation: none !important;
            }
            
            .header-user-block .header-user-dropdown {
                padding: 9px 5px;
                position: absolute;
                top: calc(100% + 12px);
                right: 0;
                box-shadow: 0 0 8px 0 rgba(25, 21, 37, 0.09);
                background: var(--white);
                border: 1px solid rgba(0, 0, 0, 0.1);
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
        
        console.log('🌐 Языковой селектор настроен');
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
        
        console.log('📱 Мобильное меню настроено');
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
        const confirmText = this.getLocalizedText('logoutConfirm');
        if (confirm(confirmText)) {
            localStorage.removeItem('userData');
            localStorage.removeItem('isLoggedIn');
            localStorage.removeItem('loginTime');
            window.location.href = this.getLocalizedPath('authorization.html');
        }
    }

    // Обновление header после изменения данных
    refresh() {
        this.currentLang = this.getCurrentLanguage();
        this.headerPath = this.getHeaderPath();
        this.isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        this.userData = this.getUserData();
        this.insertHeader();
    }

    // Отладочная информация
    getDebugInfo() {
        const container = document.getElementById('header-placeholder-cabinet') || 
                         document.getElementById('header-placeholder');
        
        return {
            language: this.currentLang,
            headerPath: this.headerPath,
            isLoggedIn: this.isLoggedIn,
            isLoaded: container ? container.classList.contains('header-loaded') : false,
            containerExists: !!container,
            containerClasses: container ? Array.from(container.classList) : [],
            containerStyles: container ? {
                opacity: container.style.opacity,
                visibility: container.style.visibility,
                display: container.style.display
            } : null,
            userData: this.userData
        };
    }
}

// Создаем глобальный экземпляр
window.headerLoader = new HeaderLoader();

// Автоматическая загрузка при загрузке DOM
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 DOM загружен, начинаем инициализацию HeaderLoader...');
    window.headerLoader.insertHeader();
});
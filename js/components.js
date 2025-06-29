// js/components.js - Загрузчик компонентов

// Подавление ошибок от расширений браузера
window.addEventListener('error', function(e) {
    // Игнорируем ошибки от content scripts расширений
    if (e.filename && e.filename.includes('content.js')) {
        e.preventDefault();
        return false;
    }
});

// Подавление необработанных промисов от расширений
window.addEventListener('unhandledrejection', function(e) {
    // Игнорируем ошибки "message port closed"
    if (e.reason && e.reason.message && 
        e.reason.message.includes('message port closed')) {
        e.preventDefault();
        return false;
    }
});

class ComponentManager {
    constructor() {
        // Определяем текущий язык на основе URL
        const currentPath = window.location.pathname;
        const isEnglishPage = currentPath.includes('/en/');
        
        console.log(`🌐 Определен язык: ${isEnglishPage ? 'EN' : 'UA'}, путь: ${currentPath}`);
        
        // Выбираем правильные компоненты в зависимости от языка
        // Для английских страниц используем относительный путь к корневой папке
        this.components = {
            header: isEnglishPage ? '../components/header-en.html' : './components/header.html',
            footer: isEnglishPage ? '../components/footer-en.html' : './components/footer.html'
        };
        this.isInitialized = false;
        this.currentLanguage = isEnglishPage ? 'EN' : 'UA';
    }

    // Загрузка одного компонента
    async loadComponent(elementId, componentPath) {
        try {
            console.log(`🔄 Загружаем: ${componentPath}`);
            
            const response = await fetch(componentPath);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const html = await response.text();
            const element = document.getElementById(elementId);
            
            if (element) {
                element.innerHTML = html;
                console.log(`✅ Загружен: ${componentPath}`);
                return true;
            } else {
                console.error(`❌ Элемент #${elementId} не найден`);
                return false;
            }
            
        } catch (error) {
            console.error(`❌ Ошибка загрузки ${componentPath}:`, error.message);
            
            // Fallback контент
            const element = document.getElementById(elementId);
            if (element) {
                if (elementId === 'header-placeholder') {
                    element.innerHTML = '<header><div class="header-wrapper"><p>Ошибка загрузки header</p></div></header>';
                } else if (elementId === 'footer-placeholder') {
                    element.innerHTML = '<footer><div class="footer-wrapper"><p>Ошибка загрузки footer</p></div></footer>';
                }
            }
            return false;
        }
    }

    // Загрузка всех компонентов
    async initializeComponents() {
        if (this.isInitialized) return;

        console.log('🚀 Инициализация компонентов...');
        
        const startTime = performance.now();
        
        try {
            // Загружаем компоненты параллельно
            const loadPromises = [
                this.loadComponent('header-placeholder', this.components.header),
                this.loadComponent('footer-placeholder', this.components.footer)
            ];
            
            const results = await Promise.allSettled(loadPromises);
            
            // Проверяем результаты
            const headerLoaded = results[0].status === 'fulfilled' && results[0].value;
            const footerLoaded = results[1].status === 'fulfilled' && results[1].value;
            
            if (headerLoaded) {
                console.log('✅ Header загружен успешно');
            }
            if (footerLoaded) {
                console.log('✅ Footer загружен успешно');
            }
            
            const endTime = performance.now();
            console.log(`⚡ Компоненты загружены за ${Math.round(endTime - startTime)}мс`);
            
            // Инициализируем функционал после загрузки
            this.setupComponentFeatures();
            this.isInitialized = true;
            
            // Уведомляем о готовности
            document.dispatchEvent(new CustomEvent('componentsLoaded'));
            
        } catch (error) {
            console.error('❌ Критическая ошибка при загрузке компонентов:', error);
        }
    }

    // Настройка функционала после загрузки
    setupComponentFeatures() {
        // Подсветка активной страницы
        this.highlightActivePage();
        
        // Инициализация мобильного меню
        this.initMobileMenu();
        
        // Инициализация языкового селектора
        this.initLanguageSelector();
        
        // Добавление hover эффектов
        this.addInteractionEffects();
        
        // Обработчики для ссылок
        this.setupLinkHandlers();
    }

    // Подсветка активной страницы
    highlightActivePage() {
        const currentPath = window.location.pathname;
        const currentPage = currentPath.split('/').pop() || 'home.html';
        
        console.log(`🎯 Текущая страница: ${currentPage}`);
        
        const navLinks = document.querySelectorAll('.header-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            const linkPage = href ? href.split('/').pop() : '';
            
            // Убираем активный класс
            link.classList.remove('active');
            
            // Добавляем активный класс
            if (linkPage === currentPage || 
                (currentPage === '' && linkPage === 'home.html') ||
                (currentPage === 'home.html' && linkPage === '')) {
                
                link.classList.add('active');
                link.setAttribute('aria-current', 'page');
                console.log(`🔗 Активная ссылка: ${href}`);
            }
        });
    }

    // Инициализация языкового селектора
    initLanguageSelector() {
        const langSelector = document.getElementById('langSelector');
        const currentLangText = document.querySelector('.current-lang-text');
        
        if (!langSelector || !currentLangText) {
            console.warn('⚠️ Элементы языкового селектора не найдены');
            return;
        }

        console.log('🌐 Инициализация языкового селектора...');

        // Используем делегирование событий
        langSelector.addEventListener('click', (e) => {
            const option = e.target.closest('.lang-option');
            if (!option) return;
            
            e.stopPropagation();
            
            const selectedLang = option.getAttribute('data-lang');
            const currentPath = window.location.pathname;
            
            // Определяем целевой URL
            const targetUrl = this.getCorrespondingPageUrl(currentPath, selectedLang);
            
            console.log('🌐 Выбран язык:', selectedLang, 'Текущий путь:', currentPath, 'Целевой URL:', targetUrl);
            
            // Если это тот же язык, ничего не делаем
            if (selectedLang === this.currentLanguage) {
                console.log('🌐 Тот же язык, переход не требуется');
                return;
            }
            
            // Переход на другую языковую версию
            if (targetUrl && targetUrl !== currentPath) {
                try {
                    console.log('🚀 Переход на:', targetUrl);
                    setTimeout(() => {
                        window.location.href = targetUrl;
                    }, 100);
                } catch (error) {
                    console.error('❌ Ошибка при переходе:', error);
                    window.location.href = targetUrl;
                }
            }
        });

        // Предотвращаем закрытие при клике на сам селектор
        langSelector.addEventListener('click', function(e) {
            if (e.target === this || e.target.closest('.current-lang')) {
                e.stopPropagation();
            }
        });

        console.log('✅ Языковой селектор инициализирован');
    }

    // Определение соответствующей страницы на другом языке
    getCorrespondingPageUrl(currentPath, targetLang) {
        // Получаем имя текущей страницы
        let currentPage = currentPath.split('/').pop() || 'home.html';
        const isCurrentlyEnglish = currentPath.includes('/en/');
        
        console.log(`🔍 Текущий путь: ${currentPath}, страница: ${currentPage}, английский: ${isCurrentlyEnglish}`);
        
        // Если текущая страница пустая (корневой путь), используем home.html
        if (!currentPage || currentPage === '') {
            currentPage = 'home.html';
        }
        
        // Карта соответствий страниц
        const pageMapping = {
            'home.html': 'home.html',
            'contacts.html': 'contacts.html',
            'privacy-policy.html': 'privacy-policy.html',
            'authorization.html': 'authorization.html',
            'registration.html': 'registration.html',
            'choice-of-direction.html': 'choice-of-direction.html',
            'password-recovery.html': 'password-recovery.html',
            'rubricator.html': 'rubricator.html',
            'thank-page.html': 'thank-page.html',
            'b2b.html': 'b2b.html',
            'sphere-of-possibilities.html': 'sphere-of-possibilities.html',
            'mission.html': 'mission.html',
            'social-initiatives.html': 'social-initiatives.html'
        };
        
        // Если текущая страница не найдена в карте, используем home.html
        const targetPage = pageMapping[currentPage] || 'home.html';
        
        let targetUrl;
        
        if (targetLang === 'EN') {
            // Переход на английскую версию
            targetUrl = `${basePath}/en/${targetPage}`;
        } else if (targetLang === 'UA') {
            // Переход на украинскую версию
            if (targetPage === 'home.html') {
                // Главная страница - переходим в корень
                targetUrl = '/';
            } else {
                // Остальные страницы - относительный путь
                targetUrl = `${basePath}/${targetPage}`;
            }
        } else {
            targetUrl = currentPath; // Возвращаем текущий путь, если что-то пошло не так
        }
        
        console.log(`🎯 Целевой URL для ${targetLang}: ${targetUrl}`);
        return targetUrl;
    }

    // Инициализация мобильного меню
    initMobileMenu() {
        const hamburgerBtn = document.querySelector('.hamburger-btn');
        const mobileOverlay = document.querySelector('.mobile-overlay');
        const menuLinks = document.querySelectorAll('.header-link');
        const entranceRegistration = document.querySelector('.entrance-registration');
        const headerNav = document.querySelector('.header-nav');
        const headerWrapperRight = document.querySelector('.header-wrapper-right');
        
        if (!hamburgerBtn || !mobileOverlay || !headerNav) {
            console.warn('⚠️ Элементы мобильного меню не найдены');
            return;
        }

        // Переменные для отслеживания состояния
        let isMovedToNav = false;
        let scrollPosition = 0;
        const originalParent = headerWrapperRight;

        // Функция перемещения блока регистрации
        const moveEntranceRegistration = () => {
            const windowWidth = window.innerWidth;
            
            if (windowWidth <= 361 && !isMovedToNav && entranceRegistration) {
                headerNav.appendChild(entranceRegistration);
                isMovedToNav = true;
                entranceRegistration.classList.add('entrance-registration-mobile');
                console.log('📱 Блок регистрации перемещен в навигацию');
                
            } else if (windowWidth > 361 && isMovedToNav && entranceRegistration) {
                originalParent.insertBefore(entranceRegistration, hamburgerBtn);
                isMovedToNav = false;
                entranceRegistration.classList.remove('entrance-registration-mobile');
                console.log('💻 Блок регистрации возвращен в header');
            }
        };

        // Функция переключения меню
        const toggleMenu = () => {
            const body = document.body;
            const isOpen = body.classList.contains('menu-open');
            
            if (!isOpen) {
                // Открываем меню
                scrollPosition = window.pageYOffset;
                body.style.top = -scrollPosition + 'px';
                body.classList.add('menu-open');
                hamburgerBtn.setAttribute('aria-expanded', 'true');
                console.log('📱 Мобильное меню открыто');
            } else {
                // Закрываем меню
                body.classList.remove('menu-open');
                body.style.top = '';
                window.scrollTo(0, scrollPosition);
                hamburgerBtn.setAttribute('aria-expanded', 'false');
                console.log('📱 Мобильное меню закрыто');
            }
        };

        // Обработчики событий
        hamburgerBtn.addEventListener('click', toggleMenu);
        mobileOverlay.addEventListener('click', toggleMenu);

        // Закрытие меню при клике на ссылку
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (document.body.classList.contains('menu-open')) {
                    toggleMenu();
                }
            });
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && document.body.classList.contains('menu-open')) {
                toggleMenu();
            }
        });

        // Обработчик изменения размера окна
        window.addEventListener('resize', () => {
            moveEntranceRegistration();
            
            // Закрываем меню на больших экранах
            if (window.innerWidth > 769 && document.body.classList.contains('menu-open')) {
                toggleMenu();
            }
        });

        // Инициализация
        moveEntranceRegistration();
        hamburgerBtn.setAttribute('aria-expanded', 'false');
        
        console.log('📱 Мобильное меню инициализировано');
    }

    // Добавление интерактивных эффектов
    addInteractionEffects() {
        // Hover эффекты для ссылок
        const links = document.querySelectorAll('.header-link, .header-entrance, .header-registration');
        
        links.forEach(link => {
            link.addEventListener('mouseenter', () => {
                link.style.transition = 'all 0.3s ease';
            });
        });
    }

    // Обработчики для ссылок
    setupLinkHandlers() {
        const allLinks = document.querySelectorAll('a[href]');
        
        allLinks.forEach(link => {
            // Добавляем обработчик для внутренних ссылок
            if (link.href.includes(window.location.origin)) {
                link.addEventListener('click', (e) => {
                    console.log(`🔗 Переход на: ${link.href}`);
                    
                    // Здесь можно добавить прелоадер, аналитику и т.д.
                });
            }
            
            // Внешние ссылки открываем в новой вкладке
            if (link.href.startsWith('http') && !link.href.includes(window.location.origin)) {
                link.setAttribute('target', '_blank');
                link.setAttribute('rel', 'noopener noreferrer');
            }
        });
    }
}

// Инициализация при загрузке DOM
document.addEventListener('DOMContentLoaded', async () => {
    console.log('🌟 DOM загружен, инициализируем компоненты...');
    
    const componentManager = new ComponentManager();
    await componentManager.initializeComponents();
    
    // Добавляем класс готовности
    document.body.classList.add('components-ready');
    
    console.log('🎉 Все компоненты готовы к работе!');
});

// Экспорт для использования в других скриптах
window.ComponentManager = ComponentManager;
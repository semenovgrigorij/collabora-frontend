// breadcrumbs.js - Динамические хлебные крошки с поддержкой многоязычности

class BreadcrumbsManager {
    constructor() {
        // Определяем текущий язык
        this.currentLang = this.detectLanguage();
        
        // Настройки разделителей
        this.separatorSettings = {
            text: ' / ',
            className: 'breadcrumb-separator'
        };
        
        // Локализованные тексты
        this.texts = {
            uk: {
                home: 'Головна',
                b2bPlatform: 'Майданчик B2B',
                createRequest: 'Створення пропозиції/потреби',
                cabinet: 'Особистий кабінет',
                profile: 'Профіль',
                settings: 'Налаштування',
                editProfile: 'Редагування профілю',
                myRequests: 'Мої запити',
                category: 'Категорія',
                offer: 'Пропозиція',
                contacts: 'Контакти',
                about: 'Про нас',
                howItWorks: 'Як це працює',
                privacyPolicy: 'Політика конфіденційності'
            },
            en: {
                home: 'Home',
                b2bPlatform: 'B2B Platform',
                createRequest: 'Post Request/Offer',
                cabinet: 'Personal Cabinet',
                profile: 'Profile',
                settings: 'Settings',
                editProfile: 'Edit Profile',
                myRequests: 'My Requests',
                category: 'Category',
                offer: 'Offer',
                contacts: 'Contacts',
                about: 'About',
                howItWorks: 'How it works',
                privacyPolicy: 'Privacy Policy'
            }
        };

        // Маппинг страниц к текстам
        this.pageMapping = {
            'b2b.html': 'b2bPlatform',
            'add-request.html': 'createRequest',
            'cabinet.html': 'cabinet',
            'edit-profile.html': 'editProfile',
            'contacts.html': 'contacts',
            'about.html': 'about',
            'how-it-works.html': 'howItWorks',
            'privacy-policy.html': 'privacyPolicy',
            'b2b-single.html': 'category',
            'branch.html': 'category',
            'offer.html': 'offer'
        };

        this.init();
    }

    // Определение текущего языка
    detectLanguage() {
        const path = window.location.pathname;
        const langMatch = path.match(/\/(en|uk)\//);
        const detectedLang = langMatch ? langMatch[1] : 'uk';
        
        console.log(`🍞 Breadcrumbs: Определен язык ${detectedLang} из пути: ${path}`);
        return detectedLang;
    }

    // Получение локализованного текста
    getText(key) {
        return this.texts[this.currentLang]?.[key] || this.texts.uk[key] || key;
    }

    // Получение локализованного пути
    getLocalizedPath(path) {
        if (path.startsWith('./')) {
            const basePath = path.substring(2);
            if (this.currentLang === 'en') {
                return `./${basePath}`;
            } else {
                return `./${basePath}`;
            }
        }
        return path;
    }

    // Получение URL с учетом языка для навигации
    getNavigationUrl(page) {
        if (this.currentLang === 'en') {
            // Для английской версии остаемся в папке /en/
            return `./${page}`;
        } else {
            // Для украинской версии переходим в корень
            return `./${page}`;
        }
    }

    init() {
        console.log('🚀 Инициализация BreadcrumbsManager...');
        
        // Ждем загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupBreadcrumbs();
            });
        } else {
            this.setupBreadcrumbs();
        }
    }

    // Настройка хлебных крошек
    setupBreadcrumbs() {
        const breadcrumbsContainer = this.findBreadcrumbsContainer();
        if (!breadcrumbsContainer) {
            console.warn('⚠️ Контейнер для хлебных крошек не найден');
            return;
        }

        // Определяем текущую страницу
        const currentPage = this.getCurrentPage();
        console.log(`📍 Текущая страница: ${currentPage}`);

        // Генерируем хлебные крошки на основе страницы
        const breadcrumbs = this.generateBreadcrumbs(currentPage);
        
        // Отрисовываем хлебные крошки
        this.renderBreadcrumbs(breadcrumbsContainer, breadcrumbs);
        
        console.log('✅ Хлебные крошки настроены');
    }

    // Поиск контейнера для хлебных крошек
    findBreadcrumbsContainer() {
        return document.querySelector('.bread-crumbs-b2b') || 
               document.querySelector('.breadcrumbs') ||
               document.querySelector('[data-breadcrumbs]') ||
               document.getElementById('breadcrumbs');
    }

    // Определение текущей страницы
    getCurrentPage() {
        const path = window.location.pathname;
        const fileName = path.split('/').pop() || 'index.html';
        
        // Логируем для отладки
        console.log(`🔍 Полный путь: ${path}`);
        console.log(`📄 Определена страница: ${fileName}`);
        
        return fileName;
    }

    // Генерация хлебных крошек на основе страницы
    generateBreadcrumbs(currentPage) {
        const breadcrumbs = [];

        // Всегда начинаем с "Главная"
        breadcrumbs.push({
            text: this.getText('home'),
            url: this.getNavigationUrl('index.html'),
            isActive: false
        });

        // Добавляем промежуточные и конечные крошки в зависимости от страницы
        switch (currentPage) {
            case 'b2b.html':
                breadcrumbs.push({
                    text: this.getText('b2bPlatform'),
                    url: null,
                    isActive: true
                });
                break;

            case 'add-request.html':
                breadcrumbs.push({
                    text: this.getText('b2bPlatform'),
                    url: this.getNavigationUrl('b2b.html'),
                    isActive: false
                });
                breadcrumbs.push({
                    text: this.getText('createRequest'),
                    url: null,
                    isActive: true
                });
                break;

            case 'cabinet.html':
                breadcrumbs.push({
                    text: this.getText('cabinet'),
                    url: null,
                    isActive: true
                });
                break;

            case 'edit-profile.html':
                breadcrumbs.push({
                    text: this.getText('cabinet'),
                    url: this.getNavigationUrl('cabinet.html'),
                    isActive: false
                });
                breadcrumbs.push({
                    text: this.getText('editProfile'),
                    url: null,
                    isActive: true
                });
                break;

            case 'b2b-single.html':
                breadcrumbs.push({
                    text: this.getText('b2bPlatform'),
                    url: this.getNavigationUrl('b2b.html'),
                    isActive: false
                });
                breadcrumbs.push({
                    text: this.getText('category'),
                    url: null,
                    isActive: true
                });
                break;

            case 'offer.html':
                breadcrumbs.push({
                    text: this.getText('b2bPlatform'),
                    url: this.getNavigationUrl('b2b.html'),
                    isActive: false
                });
                breadcrumbs.push({
                    text: this.getText('category'),
                    url: this.getNavigationUrl('b2b-single.html'),
                    isActive: false
                });
                breadcrumbs.push({
                    text: this.getText('offer'),
                    url: null,
                    isActive: true
                });
                break;

            case 'branch.html':
                breadcrumbs.push({
                    text: this.getText('b2bPlatform'),
                    url: this.getNavigationUrl('b2b.html'),
                    isActive: false
                });
                breadcrumbs.push({
                    text: this.getText('category'),
                    url: null,
                    isActive: true
                });
                break;

            case 'contacts.html':
                breadcrumbs.push({
                    text: this.getText('contacts'),
                    url: null,
                    isActive: true
                });
                break;

            case 'about.html':
                breadcrumbs.push({
                    text: this.getText('about'),
                    url: null,
                    isActive: true
                });
                break;

            case 'how-it-works.html':
                breadcrumbs.push({
                    text: this.getText('howItWorks'),
                    url: null,
                    isActive: true
                });
                break;

            case 'privacy-policy.html':
                breadcrumbs.push({
                    text: this.getText('privacyPolicy'),
                    url: null,
                    isActive: true
                });
                break;

            case 'index.html':
            case '':
                // Для главной страницы только "Главная" и она активна
                breadcrumbs[0].isActive = true;
                breadcrumbs[0].url = null;
                break;

            default:
                // Для неизвестных страниц пытаемся определить по маппингу
                const pageKey = this.pageMapping[currentPage];
                if (pageKey) {
                    breadcrumbs.push({
                        text: this.getText(pageKey),
                        url: null,
                        isActive: true
                    });
                } else {
                    // Если страница неизвестна, но в пути есть подсказки
                    if (currentPage.includes('b2b')) {
                        breadcrumbs.push({
                            text: this.getText('b2bPlatform'),
                            url: null,
                            isActive: true
                        });
                    }
                }
                break;
        }

        return breadcrumbs;
    }

    // Отрисовка хлебных крошек с настраиваемыми разделителями
    renderBreadcrumbs(container, breadcrumbs, customSeparator = null) {
        // Очищаем контейнер
        container.innerHTML = '';

        const separator = customSeparator || this.separatorSettings;

        breadcrumbs.forEach((crumb, index) => {
            // Добавляем разделитель перед каждой крошкой кроме первой
            if (index > 0) {
                const separatorElement = document.createElement('span');
                separatorElement.className = separator.className;
                separatorElement.textContent = separator.text;
                container.appendChild(separatorElement);
            }

            const crumbElement = document.createElement('span');
            
            if (crumb.isActive) {
                crumbElement.className = 'current';
                crumbElement.textContent = crumb.text;
            } else if (crumb.url) {
                crumbElement.className = index === 0 ? 'home' : 'b2b-link';
                const link = document.createElement('a');
                link.href = crumb.url;
                link.textContent = crumb.text;
                link.addEventListener('click', (e) => {
                    this.handleBreadcrumbClick(e, crumb.url);
                });
                crumbElement.appendChild(link);
            } else {
                crumbElement.className = index === 0 ? 'home' : 'b2b-link';
                crumbElement.textContent = crumb.text;
            }

            container.appendChild(crumbElement);
        });

        console.log(`🍞 Отрендерено ${breadcrumbs.length} хлебных крошек с разделителями "${separator.text}"`);
    }

    // Настройка кастомного разделителя
    setSeparator(text, className = 'breadcrumb-separator') {
        this.separatorSettings = { text, className };
        this.refresh(); // Перерисовываем с новым разделителем
    }

    // Обработка клика по хлебной крошке
    handleBreadcrumbClick(event, url) {
        // Можно добавить дополнительную логику перед переходом
        console.log(`🔗 Переход по хлебной крошке: ${url}`);
        
        // Если нужно, можно предотвратить стандартное поведение и сделать кастомную навигацию
        // event.preventDefault();
        // window.location.href = url;
    }

    // Публичный метод для создания кастомных хлебных крошек
    buildBreadcrumbs(customBreadcrumbs) {
        const container = this.findBreadcrumbsContainer();
        if (!container) {
            console.warn('⚠️ Контейнер для хлебных крошек не найден');
            return;
        }

        // Преобразуем кастомные крошки в нужный формат
        const breadcrumbs = [];
        
        // Всегда добавляем "Главная" в начало
        breadcrumbs.push({
            text: this.getText('home'),
            url: this.getNavigationUrl('index.html'),
            isActive: false
        });

        // Добавляем кастомные крошки
        customBreadcrumbs.forEach((crumb, index) => {
            breadcrumbs.push({
                text: crumb.title,
                url: crumb.href,
                isActive: index === customBreadcrumbs.length - 1 // последняя крошка активна
            });
        });

        this.renderBreadcrumbs(container, breadcrumbs);
        console.log('🍞 Построены кастомные хлебные крошки');
    }

    // Обновление хлебных крошек (например, при смене языка)
    refresh() {
        this.currentLang = this.detectLanguage();
        this.setupBreadcrumbs();
        console.log('🔄 Хлебные крошки обновлены');
    }

    // Отладочная информация
    getDebugInfo() {
        const container = this.findBreadcrumbsContainer();
        
        return {
            language: this.currentLang,
            currentPage: this.getCurrentPage(),
            containerExists: !!container,
            containerContent: container ? container.innerHTML : null,
            availableTexts: this.texts[this.currentLang]
        };
    }
}

// Создаем глобальный экземпляр
window.breadcrumbsManager = new BreadcrumbsManager();

// Экспорт для использования в других скриптах
window.BreadcrumbsManager = BreadcrumbsManager;
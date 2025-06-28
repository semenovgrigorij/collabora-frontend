// Main Application File - Главный файл приложения

// Предотвращаем повторную загрузку
if (window.RUBRICATOR_MAIN_LOADED) {
    console.warn('Main.js already loaded, skipping...');
} else {
    window.RUBRICATOR_MAIN_LOADED = true;

// Глобальные функции-обертки для безопасного вызова из HTML (определяем сразу)
window.handleBackButton = function() {
    if (window.categoriesManager && typeof window.categoriesManager.showCategoriesPage === 'function') {
        window.categoriesManager.showCategoriesPage();
    } else if (typeof showCategoriesPage === 'function') {
        showCategoriesPage();
    } else {
        // Fallback - простое переключение страниц
        const subcategoriesPage = document.getElementById('subcategories-page');
        const categoriesPage = document.getElementById('categories-page');
        if (subcategoriesPage) subcategoriesPage.style.display = 'none';
        if (categoriesPage) categoriesPage.style.display = 'block';
        if (typeof currentCategory !== 'undefined') {
            currentCategory = null;
        }
        console.log('Used fallback navigation');
    }
};

window.safeToggleAdmin = function() {
    try {
        const adminPanel = document.getElementById('admin-panel');
        if (!adminPanel) {
            console.warn('Admin panel not found');
            return;
        }

        const isVisible = adminPanel.style.display === 'block';
        
        if (isVisible) {
            // Закрываем панель
            adminPanel.style.opacity = '0';
            setTimeout(() => {
                adminPanel.style.display = 'none';
                adminPanel.style.opacity = '1';
            }, 300);
        } else {
            // Открываем панель
            adminPanel.style.display = 'block';
            adminPanel.style.opacity = '0';
            
            // Плавное появление
            setTimeout(() => {
                adminPanel.style.opacity = '1';
            }, 10);
            
            // Загружаем содержимое если нужно
            setTimeout(() => {
                if (window.adminLoader && !window.adminLoader.isAdminLoaded()) {
                    window.adminLoader.loadAdminPanel().catch(console.error);
                }
            }, 100);
        }
    } catch (error) {
        console.error('Error toggling admin:', error);
    }
};

window.safeAddCategory = function() {
    try {
        if (window.adminManager && typeof window.adminManager.addCategory === 'function') {
            window.adminManager.addCategory();
        } else if (typeof addCategory === 'function') {
            addCategory();
        } else {
            console.warn('Add category function not available');
        }
    } catch (error) {
        console.error('Error adding category:', error);
    }
};

window.safeAddSubcategory = function() {
    try {
        if (window.adminManager && typeof window.adminManager.addSubcategory === 'function') {
            window.adminManager.addSubcategory();
        } else if (typeof addSubcategory === 'function') {
            addSubcategory();
        } else {
            console.warn('Add subcategory function not available');
        }
    } catch (error) {
        console.error('Error adding subcategory:', error);
    }
};

// Функции для админ-панели
window.toggleSection = function(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.toggle('hidden');
        
        // Прокручиваем к секции если она открывается
        if (!section.classList.contains('hidden')) {
            setTimeout(() => {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    }
};

window.clearCategoryForm = function() {
    const elements = [
        'category-name', 'category-icon', 'category-description', 
        'category-regions', 'category-business-forms'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
};

window.clearSubcategoryForm = function() {
    const elements = [
        'parent-category', 'subcategory-name', 
        'subcategory-icon', 'subcategory-description'
    ];
    
    elements.forEach(id => {
        const element = document.getElementById(id);
        if (element) element.value = '';
    });
};

window.addCategory = function() {
    if (window.adminManager && typeof window.adminManager.addCategory === 'function') {
        window.adminManager.addCategory();
        
        // Обновляем интерфейс если это динамическая админка
        if (window.adminLoader && window.adminLoader.isAdminLoaded()) {
            setTimeout(() => {
                if (window.adminManager) {
                    window.adminManager.displayCategoriesInAdmin();
                    window.adminManager.updateParentCategorySelect();
                }
            }, 100);
        }
    } else {
        console.warn('Admin manager not available');
    }
};

window.addSubcategory = function() {
    if (window.adminManager && typeof window.adminManager.addSubcategory === 'function') {
        window.adminManager.addSubcategory();
        
        // Обновляем интерфейс если это динамическая админка
        if (window.adminLoader && window.adminLoader.isAdminLoaded()) {
            setTimeout(() => {
                if (window.adminManager) {
                    window.adminManager.displaySubcategoriesInAdmin();
                }
            }, 100);
        }
    } else {
        console.warn('Admin manager not available');
    }
};

window.deleteCategory = function(categoryId) {
    if (window.adminManager && typeof window.adminManager.deleteCategory === 'function') {
        window.adminManager.deleteCategory(categoryId);
    } else {
        console.warn('Admin manager not available');
    }
};

window.deleteSubcategory = function(subcategoryId) {
    if (window.adminManager && typeof window.adminManager.deleteSubcategory === 'function') {
        window.adminManager.deleteSubcategory(subcategoryId);
    } else {
        console.warn('Admin manager not available');
    }
};

// Функции управления данными
window.exportData = function() {
    const data = {
        categories: categories,
        subcategories: subcategories,
        exportDate: new Date().toISOString(),
        version: '1.0.0'
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rubricator-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    if (window.adminManager) {
        window.adminManager.showSuccessMessage('Дані експортовано успішно!');
    } else {
        alert('Дані експортовано успішно!');
    }
};

window.importData = function(fileInput) {
    const file = fileInput.files[0];
    if (!file) return;

    if (file.type !== 'application/json') {
        const errorMsg = 'Будь ласка, оберіть JSON файл';
        if (window.adminManager) {
            window.adminManager.showErrorMessage(errorMsg);
        } else {
            alert(errorMsg);
        }
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            if (!data.categories || !data.subcategories) {
                throw new Error('Невірний формат файлу');
            }

            if (confirm('Імпорт замінить всі поточні дані. Продовжити?')) {
                categories.length = 0;
                categories.push(...data.categories);
                subcategories.length = 0;
                subcategories.push(...data.subcategories);
                
                // Обновляем все интерфейсы
                if (window.categoriesManager) {
                    window.categoriesManager.refresh();
                }
                if (window.adminManager) {
                    window.adminManager.displayCategoriesInAdmin();
                    window.adminManager.displaySubcategoriesInAdmin();
                    window.adminManager.updateParentCategorySelect();
                    window.adminManager.showSuccessMessage('Дані імпортовано успішно!');
                } else {
                    alert('Дані імпортовано успішно!');
                }
            }
        } catch (error) {
            const errorMsg = 'Помилка при читанні файлу: ' + error.message;
            if (window.adminManager) {
                window.adminManager.showErrorMessage(errorMsg);
            } else {
                alert(errorMsg);
            }
        }
    };

    reader.readAsText(file);
    fileInput.value = ''; // Сбрасываем input
};

window.goToMainSite = function() {
    if (confirm('Перейти на основний сайт? Незбережені зміни можуть бути втрачені.')) {
        window.location.href = './rubricator.html';
    }
};

// Функции редактирования (заглушки для динамической админки)
window.editCategory = function(categoryId) {
    if (window.adminStandalone && typeof window.adminStandalone.editCategory === 'function') {
        // Если доступна полная версия
        return window.adminStandalone.editCategory(categoryId);
    }
    
    // Простая заглушка
    const category = categories.find(cat => cat.id === categoryId);
    if (category) {
        alert(`Редагування категорії "${category.name}" доступне тільки в повній адмін-панелі.\n\nВідкрийте admin.html для повного функціоналу.`);
    }
};

window.editSubcategory = function(subcategoryId) {
    if (window.adminStandalone && typeof window.adminStandalone.editSubcategory === 'function') {
        // Если доступна полная версия
        return window.adminStandalone.editSubcategory(subcategoryId);
    }
    
    // Простая заглушка
    const subcategory = subcategories.find(sub => sub.id === subcategoryId);
    if (subcategory) {
        alert(`Редагування підкатегорії "${subcategory.name}" доступне тільки в повній адмін-панелі.\n\nВідкрийте admin.html для повного функціоналу.`);
    }
};

class RubricatorApp {
    constructor() {
        this.isInitialized = false;
        this.modules = {};
    }

    /**
     * Инициализация приложения
     */
    async init() {
        if (this.isInitialized) {
            console.warn('Application already initialized');
            return;
        }

        try {
            // Ждем полной загрузки DOM
            await this.waitForDOM();
            
            // Инициализируем модули в правильном порядке
            await this.initializeModules();
            
            // Устанавливаем глобальные обработчики
            this.setupGlobalEventHandlers();
            
            // Первоначальное отображение
            this.initialRender();
            
            this.isInitialized = true;
            console.log('Rubricator application initialized successfully');
            
        } catch (error) {
            console.error('Failed to initialize application:', error);
            this.showInitializationError();
        }
    }

    /**
     * Ожидание полной загрузки DOM
     */
    waitForDOM() {
        return new Promise((resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', resolve);
            } else {
                resolve();
            }
        });
    }

    /**
     * Инициализация всех модулей
     */
    async initializeModules() {
        console.log('Initializing modules...');

        // Ждём загрузки данных
        await this.waitForData();

        // Инициализируем модули в правильном порядке зависимостей
        
        // 1. Базовые модули без зависимостей от данных
        this.modules.pagination = new Pagination();
        window.paginationManager = this.modules.pagination;
        
        this.modules.secretAccess = new SecretAccess();
        window.secretAccess = this.modules.secretAccess;
        
        // 2. Модули с зависимостями от данных
        this.modules.filters = new Filters();
        this.modules.filters.init();
        window.filtersManager = this.modules.filters;
        
        // 3. Основные функциональные модули
        this.modules.categories = new CategoriesManager();
        this.modules.categories.init();
        window.categoriesManager = this.modules.categories;
        
        this.modules.subcategories = new SubcategoriesManager();
        this.modules.subcategories.init();
        window.subcategoriesManager = this.modules.subcategories;
        
        // 4. Админ-модуль (последним, так как зависит от всех остальных)
        this.modules.admin = new AdminManager();
        this.modules.admin.init();
        window.adminManager = this.modules.admin;

        console.log('All modules initialized');
    }

    /**
     * Ожидание загрузки данных
     */
    waitForData() {
        return new Promise((resolve) => {
            // Если данные уже загружены
            if (typeof categories !== 'undefined' && typeof subcategories !== 'undefined' && categories && subcategories) {
                console.log('Data already loaded');
                resolve();
                return;
            }

            // Слушаем событие загрузки данных
            const handleDataLoaded = () => {
                console.log('Data loaded via event');
                window.removeEventListener('dataLoaded', handleDataLoaded);
                resolve();
            };
            window.addEventListener('dataLoaded', handleDataLoaded);

            // Резервный метод - проверяем периодически
            const checkData = () => {
                if (typeof categories !== 'undefined' && typeof subcategories !== 'undefined' && categories && subcategories) {
                    console.log('Data loaded via polling:', {
                        categories: categories.length,
                        subcategories: subcategories.length
                    });
                    window.removeEventListener('dataLoaded', handleDataLoaded);
                    resolve();
                } else {
                    setTimeout(checkData, 100); // Проверяем каждые 100мс
                }
            };
            
            // Начинаем проверку через 100мс
            setTimeout(checkData, 100);
        });
    }

    /**
     * Установка глобальных обработчиков событий
     */
    setupGlobalEventHandlers() {
        // Обработчик изменения размера окна
        window.addEventListener('resize', this.debounce(() => {
            this.handleWindowResize();
        }, 250));

        // Обработчик ошибок JavaScript
        window.addEventListener('error', (event) => {
            console.error('Global JavaScript error:', event.error);
            this.handleGlobalError(event.error);
        });

        // Обработчик unhandled promise rejections
        window.addEventListener('unhandledrejection', (event) => {
            console.error('Unhandled promise rejection:', event.reason);
            this.handleGlobalError(event.reason);
        });

        // Обработчик visibility change (когда пользователь переключается между вкладками)
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden) {
                this.handlePageBecameVisible();
            }
        });
    }

    /**
     * Первоначальный рендер приложения
     */
    initialRender() {
        // Показываем страницу категорий по умолчанию
        this.showCategoriesPage();
        
        // Добавляем индикатор загрузки если нужно
        this.hideLoadingIndicator();
        
        // Применяем тему если сохранена в localStorage
        this.applyStoredTheme();
    }

    /**
     * Показывает страницу категорий
     */
    showCategoriesPage() {
        const categoriesPage = document.getElementById('categories-page');
        const subcategoriesPage = document.getElementById('subcategories-page');
        
        if (categoriesPage) categoriesPage.style.display = 'block';
        if (subcategoriesPage) subcategoriesPage.style.display = 'none';
        
        currentCategory = null;
        currentSubcategoryPage = 1;
    }

    /**
     * Обработчик изменения размера окна
     */
    handleWindowResize() {
        // Пересчитываем layout если нужно
        if (this.modules.categories) {
            this.modules.categories.displayCategories();
        }
        
        if (this.modules.subcategories && currentCategory) {
            this.modules.subcategories.displaySubcategories();
        }
    }

    /**
     * Обработчик глобальных ошибок
     */
    handleGlobalError(error) {
        // Логируем ошибку
        console.error('Application error:', error);
        
        // Показываем уведомление пользователю только для критичных ошибок
        if (this.isCriticalError(error)) {
            this.showErrorNotification('Виникла помилка. Спробуйте оновити сторінку.');
        }
    }

    /**
     * Проверяет, является ли ошибка критичной
     */
    isCriticalError(error) {
        const criticalMessages = [
            'Script error',
            'Network error',
            'Failed to fetch'
        ];
        
        return criticalMessages.some(msg => 
            error.message && error.message.includes(msg)
        );
    }

    /**
     * Обработчик когда страница становится видимой
     */
    handlePageBecameVisible() {
        // Обновляем данные если нужно
        // Это может быть полезно когда данные приходят с сервера
    }

    /**
     * Скрывает индикатор загрузки
     */
    hideLoadingIndicator() {
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 300);
        }
    }

    /**
     * Показывает индикатор загрузки
     */
    showLoadingIndicator() {
        const loader = document.getElementById('loading-indicator');
        if (loader) {
            loader.style.display = 'flex';
            loader.style.opacity = '1';
        }
    }

    /**
     * Применяет сохраненную тему
     */
    applyStoredTheme() {
        try {
            const savedTheme = localStorage.getItem('rubricator-theme');
            if (savedTheme) {
                document.body.className = savedTheme;
            }
        } catch (error) {
            // localStorage может быть недоступен
            console.warn('Could not access localStorage for theme');
        }
    }

    /**
     * Показывает ошибку инициализации
     */
    showInitializationError() {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #f5f5f5;
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            font-family: Arial, sans-serif;
        `;
        
        errorDiv.innerHTML = `
            <div style="text-align: center; max-width: 500px; padding: 2rem;">
                <h2 style="color: #ff6b6b; margin-bottom: 1rem;">Помилка ініціалізації</h2>
                <p style="color: #666; margin-bottom: 2rem;">
                    Виникла помилка при завантаженні додатку. 
                    Спробуйте оновити сторінку або зверніться до адміністратора.
                </p>
                <button onclick="window.location.reload()" 
                        style="background: #667eea; color: white; border: none; 
                               padding: 0.75rem 1.5rem; border-radius: 5px; 
                               cursor: pointer; font-size: 1rem;">
                    Оновити сторінку
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
    }

    /**
     * Показывает уведомление об ошибке
     */
    showErrorNotification(message) {
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: #ff6b6b;
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 1000;
            font-weight: 500;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            max-width: 300px;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    /**
     * Debounce функция для оптимизации обработчиков событий
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Получает статистику приложения
     */
    getAppStats() {
        return {
            initialized: this.isInitialized,
            modules: Object.keys(this.modules),
            categoriesCount: typeof categories !== 'undefined' && categories ? categories.length : 0,
            subcategoriesCount: typeof subcategories !== 'undefined' && subcategories ? subcategories.length : 0,
            currentPage: currentPage,
            currentCategory: currentCategory?.name || null
        };
    }

    /**
     * Сброс приложения к начальному состоянию
     */
    reset() {
        // Сбрасываем состояние
        currentPage = 1;
        currentSubcategoryPage = 1;
        currentSearch = '';
        currentRegion = '';
        currentBusinessForm = '';
        currentCategory = null;
        
        // Очищаем формы
        if (this.modules.filters) {
            this.modules.filters.clearFilters();
        }
        
        // Показываем страницу категорий
        this.showCategoriesPage();
        
        // Обновляем отображение
        if (this.modules.categories) {
            this.modules.categories.displayCategories();
        }
        
        console.log('Application reset to initial state');
    }

    /**
     * Деструктор приложения
     */
    destroy() {
        // Удаляем обработчики событий
        window.removeEventListener('resize', this.handleWindowResize);
        
        // Очищаем модули
        Object.keys(this.modules).forEach(key => {
            if (this.modules[key] && typeof this.modules[key].destroy === 'function') {
                this.modules[key].destroy();
            }
        });
        
        this.modules = {};
        this.isInitialized = false;
        
        console.log('Application destroyed');
    }
}

// Создаем и инициализируем приложение только если ещё не создано
if (!window.rubricatorApp) {
    const app = new RubricatorApp();

    // Автоматическая инициализация при загрузке страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => app.init());
    } else {
        app.init();
    }

    // Экспортируем для глобального доступа
    window.rubricatorApp = app;
}

// Debug функции для консоли (доступны всегда) - только если ещё не определены
if (!window.debugRubricator) {
    window.debugRubricator = {
        getStats: () => window.rubricatorApp ? window.rubricatorApp.getAppStats() : 'App not initialized',
        reset: () => window.rubricatorApp ? window.rubricatorApp.reset() : 'App not initialized',
        exportData: () => {
            return {
                categories: typeof categories !== 'undefined' ? categories : [],
                subcategories: typeof subcategories !== 'undefined' ? subcategories : []
            };
        },
        importData: (data) => {
            if (data.categories && typeof categories !== 'undefined') categories = data.categories;
            if (data.subcategories && typeof subcategories !== 'undefined') subcategories = data.subcategories;
            if (window.rubricatorApp) window.rubricatorApp.reset();
            console.log('Data imported and application reset');
        },
        testAdmin: () => {
            console.log('Testing admin panel...');
            const adminPanel = document.getElementById('admin-panel');
            console.log('Admin panel element:', adminPanel);
            console.log('Current display:', adminPanel?.style.display);
            console.log('Admin loader:', window.adminLoader);
            console.log('Secret access:', window.secretAccess);
            
            // Принудительно открываем админку
            if (adminPanel) {
                adminPanel.style.display = 'block';
                adminPanel.style.opacity = '1';
                console.log('Admin panel opened manually');
            }
        },
        testPagination: () => {
            console.log('Testing pagination...');
            
            // Проверяем что данные загружены
            if (typeof categories === 'undefined' || !categories) {
                console.error('Categories not loaded! Cannot test pagination.');
                return;
            }
            
            console.log('Categories count:', categories.length);
            console.log('Items per page:', itemsPerPage);
            console.log('Current page:', currentPage);
            console.log('Categories manager:', window.categoriesManager);
            console.log('Pagination manager:', window.paginationManager);
            
            // Принудительно показываем пагинацию
            if (window.paginationManager) {
                const container = document.getElementById('categories-pagination');
                console.log('Pagination container:', container);
                
                if (container) {
                    window.paginationManager.display(
                        'categories-pagination',
                        Math.ceil(categories.length / itemsPerPage),
                        currentPage,
                        (page) => {
                            console.log('Page clicked:', page);
                            currentPage = page;
                            if (window.categoriesManager) {
                                window.categoriesManager.displayCategories();
                            }
                        }
                    );
                    console.log('Pagination displayed manually');
                }
            }
        },
        forceItemsPerPage: (count) => {
            window.itemsPerPage = count;
            itemsPerPage = count; // Обновляем локальную переменную тоже
            console.log(`Items per page set to: ${count}`);
            console.log('Total categories:', typeof categories !== 'undefined' && categories ? categories.length : 0);
            console.log('Expected pages:', typeof categories !== 'undefined' && categories ? Math.ceil(categories.length / count) : 0);
            
            if (window.categoriesManager) {
                window.categoriesManager.displayCategories();
            } else {
                console.error('Categories manager not found');
            }
        },
        getCurrentState: () => {
            const categoriesAvailable = typeof categories !== 'undefined' && categories;
            return {
                categoriesCount: categoriesAvailable ? categories.length : 0,
                itemsPerPage: itemsPerPage,
                currentPage: currentPage,
                totalPages: categoriesAvailable ? Math.ceil(categories.length / itemsPerPage) : 0,
                categoriesManager: !!window.categoriesManager,
                paginationManager: !!window.paginationManager,
                dataLoaded: categoriesAvailable
            };
        },
        showPaginationInfo: () => {
            const state = window.debugRubricator.getCurrentState();
            console.table(state);
            
            const container = document.getElementById('categories-pagination');
            console.log('Pagination container exists:', !!container);
            console.log('Container HTML:', container?.innerHTML);
            console.log('Container classes:', container?.className);
            
            // Проверяем CSS стили
            if (container) {
                const styles = window.getComputedStyle(container);
                console.log('Container computed styles:', {
                    display: styles.display,
                    visibility: styles.visibility,
                    height: styles.height,
                    overflow: styles.overflow
                });
            }
            
            return state;
        },
        goToPage: (page) => {
            console.log('Going to page:', page);
            if (typeof categories !== 'undefined' && categories && page >= 1 && page <= Math.ceil(categories.length / window.itemsPerPage)) {
                window.currentPage = page;
                currentPage = page;
                if (window.categoriesManager) {
                    window.categoriesManager.displayCategories();
                }
            }
        },
        fixPagination: () => {
            console.log('Attempting to fix pagination...');
            
            // Проверяем все компоненты
            const container = document.getElementById('categories-pagination');
            console.log('Container:', container);
            
            if (!container) {
                console.error('Pagination container not found!');
                return;
            }
            
            // Принудительно пересоздаем пагинацию
            if (window.categoriesManager && window.categoriesManager.createFallbackPagination) {
                const totalPages = Math.ceil(categories.length / window.itemsPerPage);
                window.categoriesManager.createFallbackPagination(totalPages, window.currentPage);
            } else {
                // Еще более простой fallback
                container.innerHTML = `
                    <div class="pagination" style="display: flex; justify-content: center; gap: 0.5rem; margin: 2rem 0; padding: 1rem; background: rgba(255,255,255,0.1); border-radius: 10px;">
                        <button style="padding: 0.75rem 1rem; background: rgba(255,255,255,0.95); border: none; border-radius: 50%; cursor: pointer;" onclick="window.debugRubricator.goToPage(1)">1</button>
                        <button style="padding: 0.75rem 1rem; background: rgba(255,255,255,0.95); border: none; border-radius: 50%; cursor: pointer;" onclick="window.debugRubricator.goToPage(2)">2</button>
                        <button style="padding: 0.75rem 1rem; background: rgba(255,255,255,0.95); border: none; border-radius: 50%; cursor: pointer;" onclick="window.debugRubricator.goToPage(3)">3</button>
                    </div>
                `;
                console.log('Basic pagination created');
            }
        },
        checkDataStatus: () => {
            console.log('=== DATA STATUS ===');
            console.log('Categories defined:', typeof categories !== 'undefined');
            console.log('Categories exists:', typeof categories !== 'undefined' && !!categories);
            console.log('Categories length:', typeof categories !== 'undefined' && categories ? categories.length : 'N/A');
            console.log('Subcategories defined:', typeof subcategories !== 'undefined');
            console.log('Subcategories exists:', typeof subcategories !== 'undefined' && !!subcategories);
            console.log('Subcategories length:', typeof subcategories !== 'undefined' && subcategories ? subcategories.length : 'N/A');
            console.log('App initialized:', !!window.rubricatorApp && window.rubricatorApp.isInitialized);
            
            return {
                categoriesDefined: typeof categories !== 'undefined',
                categoriesLength: typeof categories !== 'undefined' && categories ? categories.length : 0,
                subcategoriesDefined: typeof subcategories !== 'undefined', 
                subcategoriesLength: typeof subcategories !== 'undefined' && subcategories ? subcategories.length : 0,
                appInitialized: !!window.rubricatorApp && window.rubricatorApp.isInitialized
            };
        }
    };

    console.log('Debug functions available: window.debugRubricator');
    console.log('🔍 Try: window.debugRubricator.checkDataStatus()');
    console.log('📊 Try: window.debugRubricator.showPaginationInfo()');
    console.log('⚙️ Try: window.debugRubricator.forceItemsPerPage(3)');
    console.log('🔧 Try: window.debugRubricator.fixPagination()');
    console.log('🧪 Try: window.debugRubricator.testPagination()');
}

// Дополнительные debug функции только для localhost
if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    console.log('Additional localhost debug functions enabled');
}

} // Конец проверки на дублирование
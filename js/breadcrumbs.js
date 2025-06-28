// breadcrumbs.js - Универсальная функция для хлебных крошек (исправленная версия)

class BreadcrumbsManager {
    constructor() {
        this.breadcrumbs = document.querySelector('.bread-crumbs-b2b');
        this.links = {
            home: this.breadcrumbs?.querySelector('.home'),
            b2bLink: this.breadcrumbs?.querySelector('.b2b-link'),
            current: this.breadcrumbs?.querySelector('.current')
        };
    }

   // Улучшенный метод с автоматическим добавлением классов
buildBreadcrumbs(levels) {
    if (!this.breadcrumbs) return;
    
    // Очищаем содержимое
    this.breadcrumbs.innerHTML = '';
    
    // Создаем массив всех элементов
    const allLevels = [
        { title: 'Головна', href: './index.html', className: 'home' },
        { title: 'Майданчик B2B', href: './b2b.html', className: 'b2b-link' },
        ...levels
    ];
    
    // Добавляем элементы
    allLevels.forEach((level, index) => {
        const element = document.createElement('span');
        element.textContent = level.title;
        
        // Определяем класс элемента
        let className = level.className || '';
        
        if (index === allLevels.length - 1) {
            // Последний элемент - текущая страница
            className += ' current';
            element.setAttribute('aria-current', 'page');
        } else if (level.href) {
            // Кликабельный элемент
            className += ' breadcrumb-link';
            
            // Если это предпоследний элемент, добавляем специальный класс
            if (index === allLevels.length - 2) {
                className += ' breadcrumb-category';
            }
            
            element.style.cursor = 'pointer';
            element.addEventListener('click', () => {
                window.location.href = level.href;
            });
        }
        
        if (className.trim()) {
            element.className = className.trim();
        }
        
        this.breadcrumbs.appendChild(element);
    });
    
    // Обновляем ссылки
    this.links = {
        home: this.breadcrumbs.querySelector('.home'),
        b2bLink: this.breadcrumbs.querySelector('.b2b-link'),
        current: this.breadcrumbs.querySelector('.current')
    };
    
    // Добавляем разделители и accessibility
    this.addSeparators();
    this.setAccessibility();
}

    // Инициализация хлебных крошек
    init() {
        if (!this.breadcrumbs) return;

        this.setupClickHandlers();
        this.addSeparators();
        this.setAccessibility();
        
        console.log('Хлебные крошки инициализированы');
    }

    // Настройка обработчиков кликов
    setupClickHandlers() {
        if (this.links.home) {
            this.links.home.addEventListener('click', () => {
                window.location.href = './index.html';
            });
            this.links.home.style.cursor = 'pointer';
        }

        if (this.links.b2bLink) {
            this.links.b2bLink.addEventListener('click', () => {
                window.location.href = './b2b.html';
            });
            this.links.b2bLink.style.cursor = 'pointer';
        }
    }

    // Добавление разделителей (только если их еще нет)
    addSeparators() {
        const elements = Array.from(this.breadcrumbs.children).filter(el => 
            !el.classList.contains('breadcrumb-separator')
        );
        
        // Удаляем все существующие разделители
        this.breadcrumbs.querySelectorAll('.breadcrumb-separator').forEach(sep => sep.remove());
        
        // Добавляем разделители между элементами
        elements.forEach((element, index) => {
            if (index < elements.length - 1) {
                const separator = document.createElement('span');
                separator.textContent = ' / ';
                separator.style.margin = '0 11px';
                separator.style.color = 'var(--violet)';
                separator.classList.add('breadcrumb-separator');
                
                // Вставляем разделитель после текущего элемента
                element.insertAdjacentElement('afterend', separator);
            }
        });
    }

    // Установка атрибутов доступности
    setAccessibility() {
        this.breadcrumbs.setAttribute('aria-label', 'Навигационные хлебные крошки');
        
        if (this.links.current) {
            this.links.current.setAttribute('aria-current', 'page');
        }
    }

    // Обновление текущей страницы (для динамического изменения)
    updateCurrentPage(title) {
        if (this.links.current) {
            this.links.current.textContent = title;
        }
    }

    // Очистка хлебных крошек до базового состояния
    reset() {
        if (!this.breadcrumbs) return;
        
        // Очищаем весь контент
        this.breadcrumbs.innerHTML = `
            <span class="home">Головна</span>
            <span class="b2b-link">Майданчик B2B</span>
        `;
        
        // Обновляем ссылки
        this.links = {
            home: this.breadcrumbs.querySelector('.home'),
            b2bLink: this.breadcrumbs.querySelector('.b2b-link'),
            current: null
        };
        
        // Переинициализируем
        this.setupClickHandlers();
        this.addSeparators();
        this.setAccessibility();
        
        console.log('Хлебные крошки сброшены к базовому состоянию');
    }

    // Добавление нового уровня (исправленная версия)
    addLevel(title, href = null) {
        if (!this.breadcrumbs) return;

        console.log('addLevel вызван:', { title, href });

        // Если есть текущий элемент, убираем у него класс current
        const currentElement = this.breadcrumbs.querySelector('.current');
        if (currentElement) {
            console.log('Найден current элемент:', currentElement.textContent);
            currentElement.classList.remove('current');
            currentElement.removeAttribute('aria-current');
            
            // Если есть href, делаем элемент кликабельным
            if (href) {
                console.log('Делаем элемент кликабельным:', currentElement.textContent);
                currentElement.style.cursor = 'pointer';
                currentElement.addEventListener('click', () => {
                    console.log('Клик по хлебной крошке, переход на:', href);
                    window.location.href = href;
                });
            }
        }

        // Создаем новый элемент
        const newElement = document.createElement('span');
        newElement.textContent = title;
        newElement.classList.add('current');
        newElement.setAttribute('aria-current', 'page');
        
        // Добавляем элемент в конец
        this.breadcrumbs.appendChild(newElement);

        // Обновляем ссылки
        this.links.current = newElement;
        
        // Перестраиваем разделители
        this.addSeparators();
        
        console.log('Новый уровень добавлен:', title);
    }
}

// Автоматическая инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    const breadcrumbsElement = document.querySelector('.bread-crumbs-b2b');
    if (breadcrumbsElement) {
        window.breadcrumbsManager = new BreadcrumbsManager();
        window.breadcrumbsManager.init();
        console.log('BreadcrumbsManager создан и доступен');
    }
});

// Экспорт для использования в других скриптах
window.BreadcrumbsManager = BreadcrumbsManager;
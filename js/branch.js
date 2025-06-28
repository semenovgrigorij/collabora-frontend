// js/branch.js - Функциональность страницы галузі

class BranchManager {
    constructor() {
        // Данные бизнесов (можно заменить на API)
        this.allBusinesses = [
            {
                id: 1,
                name: "Нова Пошта",
                description: "Нова пошта — це українська компанія з експрес-доставки, заснована 2001 року. Її мета — забезпечувати легку доставку для кожного клієнта — у відділення, поштомат або на адресу.",
                logo: "./img/branch-logo-1.png",
                businessType: "services",
                scale: "large",
                geography: "kyiv",
                needs: ["investment", "partnership", "similar"],
                category: "logistics"
            },
            {
                id: 2,
                name: "АТБ",
                description: "АТБ — провідна українська мережа супермаркетів, що пропонує якісні продукти за доступними цінами по всій країні.",
                logo: "./img/branch-logo-2.png",
                businessType: "trade",
                scale: "large",
                geography: "dnipro",
                needs: ["marketing", "partnership", "similar"],
                category: "retail"
            },
            {
                id: 3,
                name: "Rozetka",
                description: "Rozetka — найбільший онлайн-ритейлер в Україні, що пропонує широкий асортимент товарів та зручну доставку.",
                logo: "./img/branch-logo-3.png",
                businessType: "technology",
                scale: "large",
                geography: "kyiv",
                needs: ["investment", "similar"],
                category: "ecommerce"
            },
            // Додаємо більше даних для демонстрації
            ...Array.from({length: 22}, (_, i) => ({
                id: i + 4,
                name: `Компанія ${i + 4}`,
                description: "Опис компанії з детальною інформацією про діяльність та можливості співпраці.",
                logo: `./img/branch-logo-${(i % 3) + 1}.png`,
                businessType: ["production", "trade", "services", "technology"][i % 4],
                scale: ["small", "medium", "large"][i % 3],
                geography: ["kyiv", "lviv", "odesa", "kharkiv", "dnipro"][i % 5],
                needs: [
                    ["investment", "similar"], 
                    ["marketing", "partnership"], 
                    ["partnership", "similar"], 
                    ["investment", "marketing", "similar"],
                    ["investment", "marketing", "partnership", "similar"]
                ][i % 5],
                category: "general"
            }))
        ];

        this.filteredBusinesses = [...this.allBusinesses];
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.currentFilters = {
            businessType: [],
            scale: [],
            geography: [],
            needs: []
        };

        // Информация о категории (будет получена из URL параметров)
        this.categoryInfo = {
            name: "Виробництво",
            description: "Бізнеси що займаються вирощенням сільськогосподарських рослин",
            icon: "./icons/categories-icon.svg"
        };

        this.init();
    }

    init() {
        console.log('🚀 Инициализация BranchManager');
        console.log(`📊 Всего бизнесов в базе: ${this.allBusinesses.length}`);
        console.log('📋 Список всех бизнесов:', this.allBusinesses.map(b => `${b.id}: ${b.name}`));
        
        this.loadCategoryFromURL();
        this.setupEventListeners();
        
        console.log(`🔍 После фильтрации: ${this.filteredBusinesses.length} бизнесов`);
        console.log('📋 Отфильтрованные бизнесы:', this.filteredBusinesses.map(b => `${b.id}: ${b.name}`));
        
        this.renderBusinesses();
        this.renderPagination();
        this.updateResultsCount();
        
        console.log('✅ Инициализация завершена');
    }

    // Загрузка информации о категории из URL
    loadCategoryFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const categoryId = urlParams.get('category');
    const categoryName = urlParams.get('name');
    const categoryIcon = urlParams.get('icon');

    if (categoryName) {
        this.categoryInfo.name = decodeURIComponent(categoryName);
    }

    if (categoryIcon) {
        this.categoryInfo.icon = `./icons/${categoryIcon}`;
    }

    if (categoryId) {
        // Можно загрузить дополнительную информацию о категории по ID
        console.log(`Загружена категория ID: ${categoryId}, название: ${this.categoryInfo.name}, иконка: ${this.categoryInfo.icon}`);
    }

    // Попытка загрузить из localStorage если URL параметры отсутствуют
    if (!categoryName || !categoryIcon) {
        try {
            const savedData = localStorage.getItem('selectedCategory');
            if (savedData) {
                const categoryData = JSON.parse(savedData);
                if (!categoryName && categoryData.categoryName) {
                    this.categoryInfo.name = categoryData.categoryName;
                }
                if (!categoryIcon && categoryData.categoryIcon) {
                    this.categoryInfo.icon = `./icons/${categoryData.categoryIcon}`;
                }
                console.log('Восстановлены данные из localStorage:', categoryData);
            }
        } catch (e) {
            console.warn('Ошибка при восстановлении данных из localStorage:', e);
        }
    }

    // Обновляем заголовок страницы
    this.updateCategoryDisplay();
}

    // Обновление отображения информации о категории
    updateCategoryDisplay() {
    const titleElement = document.getElementById('branchTitle');
    const descriptionElement = document.getElementById('branchDescription');
    const iconElement = document.getElementById('branchIcon');

    if (titleElement) {
        titleElement.textContent = this.categoryInfo.name;
    }

    if (iconElement) {
        // Обновляем иконку
        iconElement.src = this.categoryInfo.icon;
        iconElement.alt = `${this.categoryInfo.name} icon`;
        
        // Добавляем обработчик ошибки загрузки
        iconElement.onerror = function() {
            this.src = './icons/categories-icon.svg'; // Fallback иконка
            console.warn(`Не удалось загрузить иконку: ${this.categoryInfo.icon}`);
        };
    }

    if (descriptionElement) {
        // Можно настроить описания для разных категорий
        const descriptions = {
            "Промисловість та переробка": "Бізнеси що займаються промисловим виробництвом та переробкою сировини",
            "Будівництво, матеріали, деревопереробка": "Компанії будівельної галузі та виробництва будівельних матеріалів",
            "Агро і харчова промисловість": "Підприємства сільського господарства та харчової промисловості",
            "Енергетика": "Компанії енергетичного сектору та альтернативної енергетики",
            "Логістика і транспорт": "Компанії що надають логістичні та транспортні послуги",
            "Фінанси та бізнес послуги": "Фінансові установи та компанії бізнес-послуг",
            "Оптова та роздрібна торгівля": "Торговельні компанії та роздрібні мережі",
            "Легка промисловість/мода": "Підприємства легкої промисловості та модної індустрії",
            "IT та телекомунікації": "Технологічні компанії та постачальники телекомунікаційних послуг",
            "Здоров'я та краса": "Компанії сфери охорони здоров'я та косметології",
            "Туризм, спорт, розваги": "Підприємства туристичної та розважальної індустрії",
            "Освіта, наука, мистецтво": "Освітні установи та організації наукової діяльності",
            "Медіа та реклама": "Медійні компанії та рекламні агентства",
            "Креативна індустрія": "Підприємства креативної економіки та дизайну",
            "Машинобудування": "Підприємства машинобудівної галузі",
            "Хімічна промисловість": "Компанії хімічної та нафтохімічної промисловості",
            "Текстильна промисловість": "Підприємства текстильної галузі",
            "Металургія": "Металургійні підприємства та компанії з обробки металів",
            "Видобувна промисловість": "Підприємства добувної промисловості",
            "Фармацевтика": "Фармацевтичні компанії та медичні установи",
            "Біотехнології": "Компанії біотехнологічної галузі",
            "Нанотехнології": "Підприємства нанотехнологій",
            "Космічні технології": "Компанії космічної галузі",
            "Екологія та природоохорона": "Екологічні організації та природоохоронні підприємства",
            "Інше": "Різноманітні бізнеси та підприємства інших галузей"
        };
        
        descriptionElement.textContent = descriptions[this.categoryInfo.name] || 
            `Бізнеси в галузі: ${this.categoryInfo.name}`;
    }

    // Обновляем title страницы
    document.title = `Collabora - ${this.categoryInfo.name}`;
}

    setupEventListeners() {
        // Настройка чекбоксов для фильтров
        this.setupCheckboxFilters('businessTypeBtn', 'businessTypeDropdown', 'businessType');
        this.setupCheckboxFilters('scaleBtn', 'scaleDropdown', 'scale');
        this.setupCheckboxFilters('geographyBtn', 'geographyDropdown', 'geography');
        this.setupCheckboxFilters('needsBtn', 'needsDropdown', 'needs');

        // Кнопка очистки фильтров
        const clearBtn = document.getElementById('clearFiltersBtn');
        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                this.clearFilters();
            });
        }

        // Закрытие дропдаунов при клике вне их
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-dropdown')) {
                this.closeAllDropdowns();
            }
        });
    }

    setupCheckboxFilters(btnId, dropdownId, filterType) {
        const btn = document.getElementById(btnId);
        const dropdown = document.getElementById(dropdownId);

        if (!btn || !dropdown) return;

        // Обработчик клика по кнопке фильтра
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(btn, dropdown);
        });

        // Обработчики для чекбоксов
        const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.handleCheckboxChange(filterType, checkbox.value, checkbox.checked);
                this.updateFilterButton(btnId, filterType);
            });
        });

        // Предотвращаем закрытие при клике внутри дропдауна
        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    handleCheckboxChange(filterType, value, isChecked) {
        if (isChecked) {
            // Добавляем значение в фильтр
            if (!this.currentFilters[filterType].includes(value)) {
                this.currentFilters[filterType].push(value);
            }
        } else {
            // Убираем значение из фильтра
            const index = this.currentFilters[filterType].indexOf(value);
            if (index > -1) {
                this.currentFilters[filterType].splice(index, 1);
            }
        }

        console.log(`Фильтр ${filterType}:`, this.currentFilters[filterType]);
        this.applyFilters();
    }

    updateFilterButton(btnId, filterType) {
        const btn = document.getElementById(btnId);
        const countElement = btn.querySelector('.filter-count');
        const selectedCount = this.currentFilters[filterType].length;

        if (selectedCount > 0) {
            btn.classList.add('has-selections');
            countElement.textContent = selectedCount;
            countElement.classList.add('visible');
        } else {
            btn.classList.remove('has-selections');
            countElement.classList.remove('visible');
        }
    }

    toggleDropdown(btn, dropdown) {
        const isActive = btn.classList.contains('active');
        
        // Закрываем все дропдауны
        this.closeAllDropdowns();
        
        // Открываем текущий, если он был закрыт
        if (!isActive) {
            btn.classList.add('active');
            btn.parentElement.classList.add('active');
        }
    }

    closeAllDropdowns() {
        const activeDropdowns = document.querySelectorAll('.filter-dropdown.active');
        const activeBtns = document.querySelectorAll('.filter-btn.active');
        
        activeDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        activeBtns.forEach(btn => btn.classList.remove('active'));
    }

    applyFilters() {
        this.filteredBusinesses = this.allBusinesses.filter(business => {
            const matchesBusinessType = this.currentFilters.businessType.length === 0 || 
                this.currentFilters.businessType.includes(business.businessType);
            
            const matchesScale = this.currentFilters.scale.length === 0 || 
                this.currentFilters.scale.includes(business.scale);
            
            const matchesGeography = this.currentFilters.geography.length === 0 || 
                this.currentFilters.geography.includes(business.geography);
            
            const matchesNeeds = this.currentFilters.needs.length === 0 || 
                this.currentFilters.needs.some(need => business.needs.includes(need));

            return matchesBusinessType && matchesScale && matchesGeography && matchesNeeds;
        });

        this.currentPage = 1; // Сбрасываем на первую страницу
        this.renderBusinesses();
        this.renderPagination();
        this.updateResultsCount();
    }

    renderBusinesses() {
    const container = document.getElementById('branchContainer');
    const noResults = document.getElementById('branchNoResults');
    
    if (!container) {
        console.error('❌ Контейнер branchContainer не найден');
        return;
    }

    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    const businessesToShow = this.filteredBusinesses.slice(startIndex, endIndex);

    console.log(`📊 Рендер бизнесов:`);
    console.log(`- Всего отфильтрованных: ${this.filteredBusinesses.length}`);
    console.log(`- Страница: ${this.currentPage}, на странице: ${this.itemsPerPage}`);
    console.log(`- Индексы: ${startIndex}-${endIndex}`);
    console.log(`- К показу: ${businessesToShow.length}`);
    console.log(`- Бизнесы на странице:`, businessesToShow.map(b => b.name));

    if (businessesToShow.length === 0) {
        // ИСПРАВЛЕНИЕ: Принудительная очистка и установка заглушки
        container.innerHTML = '<div style="text-align: center; padding: 40px; color: #666;">Нет данных для отображения</div>';
        if (noResults) noResults.style.display = 'block';
        console.log('❌ Нет бизнесов для отображения');
        return;
    }

    if (noResults) noResults.style.display = 'none';

    // ИСПРАВЛЕНИЕ: Принудительная очистка контейнера
    container.innerHTML = '';
    
    // Создаем HTML карточек
    const cardsHTML = businessesToShow.map(business => this.createBusinessCard(business)).join('');
    
    // Устанавливаем HTML
    container.innerHTML = cardsHTML;

    // ИСПРАВЛЕНИЕ: Проверяем что карточки действительно добавились
    const addedCards = container.querySelectorAll('.branch-block');
    console.log(`✅ Добавлено карточек в DOM: ${addedCards.length}`);
    
    if (addedCards.length === 0) {
        console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: Карточки не добавились в DOM!');
        console.log('HTML для вставки:', cardsHTML.substring(0, 200) + '...');
    }

    // Добавляем обработчики событий для кнопок связи
    container.querySelectorAll('.branch-contact-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const businessId = btn.getAttribute('data-business-id');
            this.handleContactClick(businessId);
        });
    });

    // Добавляем обработчики для ссылок потребностей
    container.querySelectorAll('.need-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const need = link.getAttribute('data-need');
            const businessId = link.closest('.branch-block').getAttribute('data-business-id');
            this.handleNeedClick(need, businessId);
        });
    });
    
    console.log(`✅ Отрендерено ${businessesToShow.length} карточек бизнесов`);
}
    createBusinessCard(business) {
    const needsIcons = {
        'investment': './icons/branch-navigation-icon-1.svg',
        'marketing': './icons/branch-navigation-icon-2.svg',
        'partnership': './icons/branch-navigation-icon-3.svg',
        'similar': './icons/branch-navigation-icon-4.svg'
    };

    const needsTexts = {
        'investment': 'Пошук інвестицій',
        'marketing': 'Маркетингова співпраця',
        'partnership': 'Партнерство',
        'similar': 'Схожі бізнеси, що можуть вас зацікавити'
    };

    // Создаем левую навигацию (всегда показываем все 3 основные потребности)
    const leftNavigationHtml = `
        <a href="#" class="need-link ${business.needs.includes('investment') ? 'active' : ''}" data-need="investment">
            <img src="${needsIcons['investment']}" alt="need icon" width="20" onerror="this.style.display='none'">
            ${needsTexts['investment']}
        </a>
        <a href="#" class="need-link ${business.needs.includes('marketing') ? 'active' : ''}" data-need="marketing">
            <img src="${needsIcons['marketing']}" alt="need icon" width="20" onerror="this.style.display='none'">
            ${needsTexts['marketing']}
        </a>
        <a href="#" class="need-link ${business.needs.includes('partnership') ? 'active' : ''}" data-need="partnership">
            <img src="${needsIcons['partnership']}" alt="need icon" width="20" onerror="this.style.display='none'">
            ${needsTexts['partnership']}
        </a>
    `;

    // Создаем правую навигацию (всегда показываем "Схожі бізнеси")
    const rightNavigationHtml = `
        <a href="#" class="need-link ${business.needs.includes('similar') ? 'active' : ''}" data-need="similar">
            <img src="${needsIcons['similar']}" alt="need icon" width="20" onerror="this.style.display='none'">
            ${needsTexts['similar']}
        </a>
    `;

    return `
    <div class="branch-block" data-business-id="${business.id}">
        <div class="branch-block-navigation">
            <div class="branch-block-navigation-left">
                ${leftNavigationHtml}
            </div>
            <div class="branch-block-navigation-right">
                ${rightNavigationHtml}
            </div>
        </div>
        <div class="branch-block-content">
            <div class="branch-logo">
                <img src="${business.logo}" alt="logo" width="400" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iNCIgZmlsbD0iIzY2NjY2NiIvPgo8dGV4dCB4PSIyMCIgeT0iMjUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkM8L3RleHQ+Cjwvc3ZnPg=='">
            </div>
            <div class="branch-text">
                <h3>${business.name}</h3>
                <p>${business.description}</p>
                <a href="#" class="branch-contact-btn" data-business-id="${business.id}">
                    Зв'язатись
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 14L14 1M14 1H1M14 1V14" stroke="#3B2F77" stroke-linecap="round" />
                    </svg>
                </a>
            </div>
        </div>
    </div>
`;
}

renderPagination() {
    const container = document.getElementById('branchPagination');
    if (!container) return;

    const totalPages = Math.ceil(this.filteredBusinesses.length / this.itemsPerPage);
    
    console.log(`📄 Рендер пагинации: страница ${this.currentPage} из ${totalPages}`);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }

    let paginationHTML = '';

    // Логика для пагинации БЕЗ разделителей
    if (totalPages <= 4) {
        // Если страниц 4 или меньше, показываем все
        for (let page = 1; page <= totalPages; page++) {
            paginationHTML += `
                <div class="branch-pagination-block ${page === this.currentPage ? 'active' : ''}" 
                     data-page="${page}">
                    ${page}
                </div>
            `;
        }
    } else {
        // Если страниц больше 4
        if (this.currentPage <= 3) {
            // Показываем первые 3 страницы
            for (let page = 1; page <= 3; page++) {
                paginationHTML += `
                    <div class="branch-pagination-block ${page === this.currentPage ? 'active' : ''}" 
                         data-page="${page}">
                        ${page}
                    </div>
                `;
            }
            
            // Многоточие
            paginationHTML += `<div class="branch-pagination-block dots">...</div>`;
            
            // Последняя страница
            paginationHTML += `
                <div class="branch-pagination-block" data-page="${totalPages}">
                    ${totalPages}
                </div>
            `;
        } else if (this.currentPage >= totalPages - 2) {
            // Показываем последние 3 страницы
            paginationHTML += `
                <div class="branch-pagination-block" data-page="1">1</div>
            `;
            
            paginationHTML += `<div class="branch-pagination-block dots">...</div>`;
            
            for (let page = totalPages - 2; page <= totalPages; page++) {
                paginationHTML += `
                    <div class="branch-pagination-block ${page === this.currentPage ? 'active' : ''}" 
                         data-page="${page}">
                        ${page}
                    </div>
                `;
            }
        } else {
            // Показываем текущую страницу в середине
            paginationHTML += `
                <div class="branch-pagination-block" data-page="1">1</div>
            `;
            
            paginationHTML += `<div class="branch-pagination-block dots">...</div>`;
            
            paginationHTML += `
                <div class="branch-pagination-block active" data-page="${this.currentPage}">
                    ${this.currentPage}
                </div>
            `;
            
            paginationHTML += `<div class="branch-pagination-block dots">...</div>`;
            
            paginationHTML += `
                <div class="branch-pagination-block" data-page="${totalPages}">
                    ${totalPages}
                </div>
            `;
        }
    }

    container.innerHTML = paginationHTML;
    
    // Добавляем обработчики событий для кнопок пагинации
    const paginationButtons = container.querySelectorAll('.branch-pagination-block[data-page]');
    console.log(`🔗 Добавляем обработчики для ${paginationButtons.length} кнопок пагинации`);
    
    paginationButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const page = parseInt(btn.getAttribute('data-page'));
            console.log(`🔗 Клик по странице: ${page}`);
            
            if (page && page !== this.currentPage) {
                this.goToPage(page);
            }
        });
    });
    
}
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredBusinesses.length / this.itemsPerPage);
        
        console.log(`🔄 Переход на страницу ${page} из ${totalPages}`);
        console.log(`Текущая страница: ${this.currentPage}`);
        console.log(`Всего бизнесов: ${this.filteredBusinesses.length}`);
        
        if (page < 1 || page > totalPages) {
            console.warn(`❌ Некорректная страница: ${page}`);
            return;
        }
        
        this.currentPage = page;
        console.log(`✅ Установлена страница: ${this.currentPage}`);
        
        this.renderBusinesses();
        this.renderPagination();
        
        // Плавная прокрутка к началу списка бизнесов
        const branchSection = document.getElementById('branch-section');
        if (branchSection) {
            branchSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    updateResultsCount() {
        const countElement = document.getElementById('branchResultsCount');
        if (countElement) {
            const count = this.filteredBusinesses.length;
            const word = this.getPlural(count, 'бізнес', 'бізнеси', 'бізнесів');
            countElement.textContent = `Знайдено: ${count} ${word}`;
        }
    }

    getPlural(number, one, few, many) {
        const mod10 = number % 10;
        const mod100 = number % 100;
        
        if (mod100 >= 11 && mod100 <= 19) {
            return many;
        }
        if (mod10 === 1) {
            return one;
        }
        if (mod10 >= 2 && mod10 <= 4) {
            return few;
        }
        return many;
    }

    clearFilters() {
        // Сбрасываем фильтры
        this.currentFilters = {
            businessType: [],
            scale: [],
            geography: [],
            needs: []
        };

        // Снимаем отметки со всех чекбоксов
        document.querySelectorAll('.filter-dropdown input[type="checkbox"]').forEach(checkbox => {
            checkbox.checked = false;
        });

        // Сбрасываем кнопки фильтров
        const buttons = [
            { id: 'businessTypeBtn', type: 'businessType' },
            { id: 'scaleBtn', type: 'scale' },
            { id: 'geographyBtn', type: 'geography' },
            { id: 'needsBtn', type: 'needs' }
        ];

        buttons.forEach(({ id, type }) => {
            this.updateFilterButton(id, type);
        });

        this.applyFilters();
        console.log('Фільтри очищені');
    }

    handleContactClick(businessId) {
        const business = this.allBusinesses.find(b => b.id == businessId);
        if (business) {
            console.log(`Связь с бизнесом: ${business.name}`);
            
            // Здесь можно добавить модальное окно или переход на страницу контактов
            alert(`Связь с компанией "${business.name}"\nЗдесь будет форма для связи или контактная информация.`);
        }
    }

    handleNeedClick(need, businessId) {
        const business = this.allBusinesses.find(b => b.id == businessId);
        if (business) {
            const needTexts = {
                'investment': 'Пошук інвестицій',
                'marketing': 'Маркетингова співпраця',
                'partnership': 'Партнерство',
                'similar': 'Схожі бізнеси, що можуть вас зацікавити'
            };

            const needText = needTexts[need] || need;
            console.log(`Клик по потребности "${needText}" для бизнеса "${business.name}"`);

            // Проверяем, активна ли эта потребность для данного бизнеса
            if (business.needs.includes(need)) {
                if (need === 'similar') {
                    // Логика для показа похожих бизнесов
                    this.showSimilarBusinesses(businessId);
                } else {
                    // Логика для других потребностей
                    this.showNeedDetails(need, businessId);
                }
            } else {
                // Потребность неактивна
                alert(`Компанія "${business.name}" не має потреби в "${needText}"`);
            }
        }
    }

    showSimilarBusinesses(businessId) {
        const business = this.allBusinesses.find(b => b.id == businessId);
        if (business) {
            console.log(`Показ похожих бизнесов для: ${business.name}`);
            
            // Можно отфильтровать похожие бизнесы
            const similarBusinesses = this.allBusinesses.filter(b => 
                b.id !== business.id && 
                (b.businessType === business.businessType || 
                 b.geography === business.geography ||
                 b.scale === business.scale)
            );

            if (similarBusinesses.length > 0) {
                const names = similarBusinesses.slice(0, 3).map(b => b.name).join(', ');
                alert(`Схожі бізнеси для "${business.name}":\n${names}`);
            } else {
                alert(`Схожих бізнесів для "${business.name}" не знайдено.`);
            }
        }
    }

    showNeedDetails(need, businessId) {
        const business = this.allBusinesses.find(b => b.id == businessId);
        if (business) {
            const messages = {
                'investment': `Компанія "${business.name}" шукає інвестиції.\nЗдесь буде детальна інформація про інвестиційні можливості.`,
                'marketing': `Компанія "${business.name}" відкрита для маркетингової співпраці.\nЗдесь буде інформація про маркетингові пропозиції.`,
                'partnership': `Компанія "${business.name}" розглядає партнерські пропозиції.\nЗдесь буде інформація про можливості партнерства.`
            };

            alert(messages[need] || 'Детальна інформація про цю потребу.');
        }
    }

    // Получение состояния для отладки
    getState() {
        return {
            currentPage: this.currentPage,
            totalPages: Math.ceil(this.filteredBusinesses.length / this.itemsPerPage),
            totalBusinesses: this.allBusinesses.length,
            filteredBusinesses: this.filteredBusinesses.length,
            filters: { ...this.currentFilters },
            category: this.categoryInfo
        };
    }

    getDebugInfo() {
    const container = document.getElementById('branchContainer');
    const pagination = document.getElementById('branchPagination');
    
    return {
        currentPage: this.currentPage,
        totalPages: Math.ceil(this.filteredBusinesses.length / this.itemsPerPage),
        totalBusinesses: this.allBusinesses.length,
        filteredBusinesses: this.filteredBusinesses.length,
        filters: { ...this.currentFilters },
        domCards: container ? container.querySelectorAll('.branch-block').length : 0,
        domPaginationButtons: pagination ? pagination.querySelectorAll('[data-page]').length : 0,
        containerExists: !!container,
        paginationExists: !!pagination
    };
}
}

// Инициализация при загрузке страницы
let branchManager;

document.addEventListener('DOMContentLoaded', () => {
    // Ждем загрузки компонентов
    if (document.body.classList.contains('components-ready')) {
        initBranch();
    } else {
        document.addEventListener('componentsLoaded', initBranch);
    }
});

function initBranch() {
    console.log('🚀 Инициализация страницы галузі...');
    branchManager = new BranchManager();

    window.branchManager = branchManager;
    
    // Добавляем глобальные горячие клавиши
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            branchManager.closeAllDropdowns();
        }
    });
    
    console.log('✅ Страница галузі готова к работе!');
}

// Экспорт для использования в других скриптах
window.BranchManager = BranchManager;
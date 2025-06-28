// js/rubricator.js - Функциональность рубрикатора

class RubricatorManager {
    constructor() {
        // Данные категорий (можно заменить на API)
        this.allCategories = [
            { id: 1, name: "Промисловість та переробка", icon: "categories-icon.svg", region: "kyiv", businessForm: "tov", spheres: ["finance", "marketplace"] },
            { id: 2, name: "Будівництво, матеріали, деревопереробка", icon: "categories-icon-1.svg", region: "lviv", businessForm: "fop", spheres: ["marketplace"] },
            { id: 3, name: "Агро і харчова промисловість", icon: "categories-icon-2.svg", region: "odesa", businessForm: "at", spheres: ["marketplace"] },
            { id: 4, name: "Енергетика", icon: "categories-icon-3.svg", region: "kharkiv", businessForm: "tov", spheres: ["finance"] },
            { id: 5, name: "Логістика і транспорт", icon: "categories-icon-4.svg", region: "dnipro", businessForm: "pp", spheres: ["marketplace"] },
            { id: 6, name: "Фінанси та бізнес послуги", icon: "categories-icon-5.svg", region: "kyiv", businessForm: "tov", spheres: ["finance", "consulting", "marketplace"] },
            { id: 7, name: "Оптова та роздрібна торгівля", icon: "categories-icon-6.svg", region: "lviv", businessForm: "fop", spheres: ["marketplace"] },
            { id: 8, name: "Легка промисловість/мода", icon: "categories-icon-7.svg", region: "odesa", businessForm: "at", spheres: ["marketplace"] },
            { id: 9, name: "IT та телекомунікації", icon: "categories-icon-8.svg", region: "kyiv", businessForm: "tov", spheres: ["finance", "consulting", "education"] },
            { id: 10, name: "Здоров'я та краса", icon: "categories-icon-9.svg", region: "kharkiv", businessForm: "fop", spheres: ["consulting", "marketplace"] },
            { id: 11, name: "Туризм, спорт, розваги", icon: "categories-icon-10.svg", region: "dnipro", businessForm: "pp", spheres: ["marketplace"]  },
            { id: 12, name: "Освіта, наука, мистецтво", icon: "categories-icon-11.svg", region: "kyiv", businessForm: "tov", spheres: ["consulting", "education"] },
            { id: 13, name: "Медіа та реклама", icon: "categories-icon-12.svg", region: "lviv", businessForm: "at", spheres: ["education", "consulting"] },
            { id: 14, name: "Креативна індустрія", icon: "categories-icon-13.svg", region: "odesa", businessForm: "fop", spheres: ["education", "consulting"]  },
            { id: 15, name: "Інше", icon: "categories-icon-14.svg", region: "kharkiv", businessForm: "tov", spheres: ["finance", "consulting", "education", "marketplace"]  },
            // Дополнительные категории для демонстрации пагинации
            { id: 16, name: "Машинобудування", icon: "categories-icon.svg", region: "dnipro", businessForm: "at" },
            { id: 17, name: "Хімічна промисловість", icon: "categories-icon-1.svg", region: "kyiv", businessForm: "tov" },
            { id: 18, name: "Текстильна промисловість", icon: "categories-icon-2.svg", region: "lviv", businessForm: "fop" },
            { id: 19, name: "Металургія", icon: "categories-icon-3.svg", region: "odesa", businessForm: "pp" },
            { id: 20, name: "Видобувна промисловість", icon: "categories-icon-4.svg", region: "kharkiv", businessForm: "tov" },
            { id: 21, name: "Фармацевтика", icon: "categories-icon-5.svg", region: "dnipro", businessForm: "at" },
            { id: 22, name: "Біотехнології", icon: "categories-icon-6.svg", region: "kyiv", businessForm: "fop" },
            { id: 23, name: "Нанотехнології", icon: "categories-icon-7.svg", region: "lviv", businessForm: "tov" },
            { id: 24, name: "Космічні технології", icon: "categories-icon-8.svg", region: "odesa", businessForm: "pp" },
            { id: 25, name: "Екологія та природоохорона", icon: "categories-icon-9.svg", region: "kharkiv", businessForm: "at" }
        ];

        this.filteredCategories = [...this.allCategories];
        this.currentPage = 1;
        this.itemsPerPage = 15;
        this.currentFilters = {
            search: '',
            region: '',
            businessForm: ''
        };

        // Информация о выбранной сфере
        this.selectedSphere = null;
        this.checkSphereSelection();

        this.init();
    }

    init() {
        this.loadSphereSelection();
        this.setupEventListeners();
        this.renderCategories();
        this.renderPagination();
        this.updateResultsCount();
        this.updatePageTitle();
    }

        // Метод для загрузки данных о выбранной сфере
loadSphereSelection() {
    try {
        // Проверяем sessionStorage
        const sphereData = sessionStorage.getItem('sphereSelection');
        
        // Проверяем URL параметры
        const urlParams = new URLSearchParams(window.location.search);
        const sphereParam = urlParams.get('sphere');
        
        if (sphereData) {
            this.selectedSphere = JSON.parse(sphereData);
            console.log('🌟 Загружены данные о выбранной сфере:', this.selectedSphere);
            
            // Применяем фильтрацию по сфере
            this.applySphereFilter();
            
        } else if (sphereParam) {
            console.log('🔗 Обнаружен параметр сферы в URL:', sphereParam);
            
            // Создаем базовую информацию о сфере из URL
            this.selectedSphere = {
                sphereType: sphereParam,
                source: 'url-parameter'
            };
            
            this.applySphereFilter();
        }
    } catch (error) {
        console.error('Ошибка при загрузке данных о сфере:', error);
    }
}
checkSphereSelection() {
    console.log('🔍 Проверяем выбранную сферу...');
    
    try {
        // Проверяем sessionStorage
        const sphereData = sessionStorage.getItem('sphereSelection');
        if (sphereData) {
            this.selectedSphere = JSON.parse(sphereData);
            console.log('✅ Найдена сфера в sessionStorage:', this.selectedSphere);
            this.applySphereFilter();
            return;
        }
        
        // Проверяем URL параметры
        const urlParams = new URLSearchParams(window.location.search);
        const sphereParam = urlParams.get('sphere');
        if (sphereParam) {
            console.log('✅ Найден параметр sphere в URL:', sphereParam);
            this.selectedSphere = { sphereType: sphereParam };
            this.applySphereFilter();
            return;
        }
        
        console.log('ℹ️ Сфера не выбрана, показываем все категории');
    } catch (error) {
        console.error('❌ Ошибка при проверке сферы:', error);
    }
}

applySphereFilter() {
    if (!this.selectedSphere || !this.selectedSphere.sphereType) {
        console.log('⚠️ Нет данных о сфере для фильтрации');
        return;
    }
    
    const sphereType = this.selectedSphere.sphereType;
    console.log(`🎯 Применяем фильтр по сфере: ${sphereType}`);
    
    // Фильтруем категории по сфере
    this.filteredCategories = this.allCategories.filter(category => {
        const hasSphere = category.spheres && category.spheres.includes(sphereType);
        if (hasSphere) {
            console.log(`✅ Категория "${category.name}" соответствует сфере ${sphereType}`);
        }
        return hasSphere;
    });
    
    console.log(`📊 Отфильтровано ${this.filteredCategories.length} категорий из ${this.allCategories.length}`);
    
    // Обновляем заголовок
    this.updatePageTitle();
}

updatePageTitle() {
    if (!this.selectedSphere) return;
    
    const titleElement = document.querySelector('.title-rubricator h1');
    if (titleElement && this.selectedSphere.sphereTitle) {
        titleElement.innerHTML = `Категорії для <span>"${this.selectedSphere.sphereTitle}"</span>`;
    }
    
    console.log('📝 Заголовок обновлен для сферы:', this.selectedSphere.sphereTitle);
}

// Метод для добавления информационного блока
addSphereInfoBlock() {
    if (!this.selectedSphere) return;
    
    // Проверяем, не добавлен ли уже блок
    if (document.querySelector('.sphere-info-block')) return;
    
    const titleSection = document.getElementById('title-search-section');
    if (!titleSection) return;
    
    const infoBlock = document.createElement('div');
    infoBlock.className = 'sphere-info-block';
    infoBlock.innerHTML = `
        <div class="sphere-info-content">
            <div class="sphere-info-icon">🌟</div>
            <div class="sphere-info-text">
                <h3>Вибрана сфера: ${this.selectedSphere.sphereTitle || 'Невідома сфера'}</h3>
                <p>Показано категорії, релевантні для обраної сфери можливостей</p>
            </div>
            <button class="sphere-info-close" onclick="rubricatorManager.clearSphereFilter()">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M12 4L4 12M4 4L12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </button>
        </div>
    `;
    
    // Добавляем стили
    if (!document.getElementById('sphere-info-styles')) {
        const styles = document.createElement('style');
        styles.id = 'sphere-info-styles';
        styles.textContent = `
            .sphere-info-block {
                margin: 20px auto;
                max-width: 1180px;
            }
            
            .sphere-info-content {
                display: flex;
                align-items: center;
                gap: 16px;
                background: linear-gradient(135deg, var(--turquoise) 0%, var(--light-violet) 100%);
                color: white;
                padding: 16px 24px;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(73, 211, 211, 0.3);
            }
            
            .sphere-info-icon {
                font-size: 24px;
                flex-shrink: 0;
            }
            
            .sphere-info-text {
                flex-grow: 1;
            }
            
            .sphere-info-text h3 {
                margin: 0 0 4px 0;
                font-family: var(--second-family);
                font-size: 18px;
                font-weight: 600;
            }
            
            .sphere-info-text p {
                margin: 0;
                font-family: var(--font-family);
                font-size: 14px;
                opacity: 0.9;
                text-align: left;
            }
            
            .sphere-info-close {
                background: rgba(255, 255, 255, 0.2);
                border: none;
                border-radius: 50%;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                cursor: pointer;
                transition: background-color 0.2s ease;
                color: white;
            }
            
            .sphere-info-close:hover {
                background: rgba(255, 255, 255, 0.3);
            }
            
            @media (max-width: 768px) {
                .sphere-info-content {
                    padding: 12px 16px;
                    gap: 12px;
                }
                
                .sphere-info-text h3 {
                    font-size: 16px;
                }
                
                .sphere-info-text p {
                    font-size: 13px;
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    titleSection.insertAdjacentElement('afterend', infoBlock);
}

// Метод для очистки фильтра по сфере
clearSphereFilter() {
    console.log('🧹 Очищаем фильтр по сфере');
    
    // Очищаем данные о сфере
    this.selectedSphere = null;
    this.currentFilters.sphere = '';
    
    // Очищаем sessionStorage
    sessionStorage.removeItem('sphereSelection');
    
    // Убираем информационный блок
    const infoBlock = document.querySelector('.sphere-info-block');
    if (infoBlock) {
        infoBlock.remove();
    }
    
    // Восстанавливаем заголовок
    const titleElement = document.querySelector('.title-rubricator h1');
    const descriptionElement = document.querySelector('.title-rubricator p');
    
    if (titleElement) {
        titleElement.innerHTML = 'Побудуй партнерство, <span>яке змінює гру</span>';
    }
    
    if (descriptionElement) {
        descriptionElement.textContent = 'Знаходь можливості співпраці за сферами діяльності та регіонами';
    }
    
    // Применяем фильтрацию (покажет все категории)
    this.applyFilters();
    
    // Обновляем URL (убираем параметры сферы)
    const url = new URL(window.location);
    url.searchParams.delete('sphere');
    url.searchParams.delete('source');
    window.history.replaceState({}, '', url);
}

    setupEventListeners() {
        // Поиск
        const searchInput = document.getElementById('categorySearch');
        const searchBtn = document.getElementById('searchBtn');

        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.currentFilters.search = e.target.value.toLowerCase();
                this.applyFilters();
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.applyFilters();
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                this.applyFilters();
            });
        }

        // Фильтры
        this.setupDropdown('regionBtn', 'regionDropdown', 'region');
        this.setupDropdown('businessFormBtn', 'businessFormDropdown', 'businessForm');

        // Закрытие дропдаунов при клике вне их
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-dropdown')) {
                this.closeAllDropdowns();
            }
        });
    }

    setupDropdown(btnId, dropdownId, filterType) {
        const btn = document.getElementById(btnId);
        const dropdown = document.getElementById(dropdownId);

        if (!btn || !dropdown) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(btn, dropdown);
        });

        dropdown.addEventListener('click', (e) => {
            const option = e.target.closest('.filter-option');
            if (option) {
                const value = option.getAttribute('data-value');
                const text = option.textContent;
                
                this.selectFilterOption(btn, dropdown, value, text, filterType);
            }
        });
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

    selectFilterOption(btn, dropdown, value, text, filterType) {
        // Обновляем текст кнопки
        const filterText = btn.querySelector('.filter-text');
        if (filterText) {
            filterText.textContent = text;
        }

        // Обновляем выбранные опции
        dropdown.querySelectorAll('.filter-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        dropdown.querySelector(`[data-value="${value}"]`).classList.add('selected');

        // Применяем фильтр
        this.currentFilters[filterType] = value;
        this.applyFilters();

        // Закрываем дропдаун
        this.closeAllDropdowns();
    }

    applyFilters() {
        this.filteredCategories = this.allCategories.filter(category => {
            const matchesSearch = !this.currentFilters.search || 
                category.name.toLowerCase().includes(this.currentFilters.search);
            
            const matchesRegion = !this.currentFilters.region || 
                category.region === this.currentFilters.region;
            
            const matchesBusinessForm = !this.currentFilters.businessForm || 
                category.businessForm === this.currentFilters.businessForm;

            return matchesSearch && matchesRegion && matchesBusinessForm;
        });

        this.currentPage = 1; // Сбрасываем на первую страницу
        this.renderCategories();
        this.renderPagination();
        this.updateResultsCount();
    }

    renderCategories() {
        const container = document.getElementById('categoriesContainer');
        const noResults = document.getElementById('noResults');
        
        if (!container) return;

        // Вычисляем категории для текущей страницы
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        
        // Отфильтровываем категорию "Інше" для отдельной обработки
        const otherCategory = this.filteredCategories.find(cat => cat.id === 15);
        const regularCategories = this.filteredCategories.filter(cat => cat.id !== 15);
        
        // Берем обычные категории для текущей страницы (14 штук максимум, чтобы оставить место для "Інше")
        const maxRegularItems = this.itemsPerPage - 1; // 14 вместо 15
        const regularCategoriesToShow = regularCategories.slice(startIndex, startIndex + maxRegularItems);
        
        // Всегда добавляем категорию "Інше" в конец, если она есть в отфильтрованных
        let categoriesToShow = [...regularCategoriesToShow];
        
        if (otherCategory) {
            categoriesToShow.push(otherCategory);
        }

        if (categoriesToShow.length === 0) {
            container.innerHTML = '';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        if (noResults) noResults.style.display = 'none';

        container.innerHTML = categoriesToShow.map(category => `
            <div class="categories-block ${category.id === 15 ? 'other-category' : ''}" data-category-id="${category.id}">
                <div class="categories-block-top">
                    <img src="./icons/${category.icon}" alt="categories icon" width="108">
                    <a href="#" data-category="${category.name}" data-category-id="${category.id}">
                        <img class="arrow-card" src="./icons/arrow-title.svg" alt="arrow" width="14">
                        <img class="arrow-card-hover" src="./icons/arrow-title-hover.svg" alt="arrow" width="14">
                    </a>   
                </div>
                <div class="categories-block-bottom">
                    <h3>${category.name}</h3>
                </div>
            </div>
        `).join('');

        // Добавляем обработчики событий для ссылок и блоков
        container.querySelectorAll('a[data-category]').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const categoryId = parseInt(link.getAttribute('data-category-id'));
                const categoryName = link.getAttribute('data-category');
                this.handleCategoryClick(categoryId, categoryName);
            });
        });

        // Добавляем обработчики для всего блока категории "Інше"
        container.querySelectorAll('.other-category').forEach(block => {
            block.style.cursor = 'pointer';
            block.addEventListener('click', (e) => {
                // Проверяем, что клик не по ссылке (она уже обработана выше)
                if (!e.target.closest('a')) {
                    const categoryId = parseInt(block.getAttribute('data-category-id'));
                    this.handleCategoryClick(categoryId, 'Інше');
                }
            });
        });
    }

    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;

        // Исключаем категорию "Інше" из подсчета пагинации и учитываем, что на каждой странице 14 обычных + 1 "Інше"
        const regularCategories = this.filteredCategories.filter(cat => cat.id !== 15);
        const itemsPerPageForRegular = this.itemsPerPage - 1; // 14 мест для обычных категорий
        const totalPages = Math.ceil(regularCategories.length / itemsPerPageForRegular);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '';
        let elementCount = 0; // Счетчик элементов для вставки линий

        // Функция добавления линии между элементами
        const addSeparatorLine = () => {
            if (elementCount > 0) {
                paginationHTML += `
                    <svg class="pagination-separator" width="26" height="2" viewBox="0 0 26 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M0 1H26" stroke="#241A56" />
                    </svg>
                `;
            }
            elementCount++;
        };

        // Логика отображения страниц
        const maxVisiblePages = 5;
        let startPage = Math.max(1, this.currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Корректируем начальную страницу если недостаточно страниц в конце
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        // Первая страница и многоточие
        if (startPage > 1) {
            addSeparatorLine();
            paginationHTML += `
                <button class="pagination-btn" onclick="rubricatorManager.goToPage(1)">1</button>
            `;
            elementCount++;
            
            if (startPage > 2) {
                addSeparatorLine();
                paginationHTML += '<span class="pagination-dots">...</span>';
                elementCount++;
            }
        }

        // Видимые страницы
        for (let page = startPage; page <= endPage; page++) {
            addSeparatorLine();
            paginationHTML += `
                <button class="pagination-btn ${page === this.currentPage ? 'active' : ''}" 
                        onclick="rubricatorManager.goToPage(${page})">
                    ${page}
                </button>
            `;
            elementCount++;
        }

        // Многоточие и последняя страница
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                addSeparatorLine();
                paginationHTML += '<span class="pagination-dots">...</span>';
                elementCount++;
            }
            addSeparatorLine();
            paginationHTML += `
                <button class="pagination-btn" onclick="rubricatorManager.goToPage(${totalPages})">
                    ${totalPages}
                </button>
            `;
            elementCount++;
        }
        container.innerHTML = paginationHTML;
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredCategories.length / this.itemsPerPage);
        
        if (page < 1 || page > totalPages) return;
        
        this.currentPage = page;
        this.renderCategories();
        this.renderPagination();
        
        // Плавная прокрутка к началу категорий
        const categoriesSection = document.getElementById('categories-section');
        if (categoriesSection) {
            categoriesSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
        if  (countElement) {
            const count = this.filteredCategories.length;
            const word = this.getPlural(count, 'категорія', 'категорії', 'категорій');
        
            let text = `Знайдено: ${count} ${word}`;
        
            if (this.selectedSphere) {
                text += ` для сфери "${this.selectedSphere.sphereTitle || this.selectedSphere.sphereType}"`;
            }
        
            countElement.textContent = text;
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

    // Обработка кликов по категориям
    handleCategoryClick(categoryId, categoryName) {
        console.log(`🎯 Клик по категории: ${categoryName} (ID: ${categoryId})`);
        
        if (categoryId === 15) {
            // Специальная обработка для категории "Інше"
            this.navigateToNextPage();
        } else {
            // Обычная обработка для других категорий
            this.navigateToCategory(categoryId, categoryName);
        }
    }

    // Переход на следующую страницу пагинации для категории "Інше"
    navigateToNextPage() {
        console.log('🚀 Переход на следующую страницу пагинации');
        
        // Считаем общее количество страниц (исключая "Інше")
        const regularCategories = this.filteredCategories.filter(cat => cat.id !== 15);
        const totalPages = Math.ceil(regularCategories.length / (this.itemsPerPage - 1)); // -1 потому что место занимает "Інше"
        
        if (this.currentPage < totalPages) {
            // Переходим на следующую страницу
            this.goToPage(this.currentPage + 1);
        } else {
            // Если это последняя страница, можно сделать что-то другое
            console.log('🏁 Это последняя страница');
            this.showEndMessage();
        }
    }

    // Показать сообщение о том, что это последняя страница
    showEndMessage() {
        // Определяем текущий язык
        const isEnglishPage = window.location.pathname.includes('/en/');
        
        const message = isEnglishPage 
            ? 'You have reached the last page!' 
            : 'Ви досягли останньої сторінки!';
            
        const submessage = isEnglishPage 
            ? 'Try changing your filters or search parameters.' 
            : 'Спробуйте змінити фільтри або параметри пошуку.';

        // Создаем красивое уведомление
        const notification = document.createElement('div');
        notification.className = 'end-notification';
        notification.innerHTML = `
            <div class="end-notification-content">
                <div class="end-notification-icon">🏁</div>
                <div class="end-notification-text">
                    <h4>${message}</h4>
                    <p>${submessage}</p>
                </div>
                <button class="end-notification-close" onclick="this.parentElement.parentElement.remove()">×</button>
            </div>
        `;

        // Добавляем стили для уведомления
        if (!document.querySelector('#end-notification-styles')) {
            const styles = document.createElement('style');
            styles.id = 'end-notification-styles';
            styles.textContent = `
                .end-notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    z-index: 10000;
                    animation: slideInRight 0.3s ease;
                }
                
                .end-notification-content {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    background: var(--white);
                    border: 2px solid var(--turquoise);
                    border-radius: 12px;
                    padding: 16px 20px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    max-width: 350px;
                }
                
                .end-notification-icon {
                    font-size: 24px;
                }
                
                .end-notification-text h4 {
                    margin: 0 0 4px 0;
                    font-family: var(--second-family);
                    font-size: 16px;
                    color: var(--text-dark);
                }
                
                .end-notification-text p {
                    margin: 0;
                    font-family: var(--font-family);
                    font-size: 14px;
                    color: var(--gray);
                    text-align: left;
                    line-height: 1.3;
                }
                
                .end-notification-close {
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: var(--gray);
                    padding: 0;
                    width: 24px;
                    height: 24px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 50%;
                    transition: background-color 0.2s ease;
                }
                
                .end-notification-close:hover {
                    background-color: var(--light-gray);
                }
                
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
            `;
            document.head.appendChild(styles);
        }

        // Показываем уведомление
        document.body.appendChild(notification);

        // Автоматически убираем уведомление через 5 секунд
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    // Обработка для обычных категорий
    navigateToCategory(categoryId, categoryName) {
    console.log(`📂 Переход в категорию: ${categoryName}`);
    
    // Находим категорию для получения иконки
    const category = this.allCategories.find(cat => cat.id === categoryId);
    
    // Определяем текущий язык
    const isEnglishPage = window.location.pathname.includes('/en/');
    
    // Создаем URL для страницы галузі
    const branchUrl = isEnglishPage ? '/en/branch.html' : '/branch.html';
    
    // Создаем параметры для передачи информации о категории
    const params = new URLSearchParams({
        category: categoryId,
        name: categoryName,
        icon: category ? category.icon : 'categories-icon.svg' // Добавляем иконку
    });
    
    const fullUrl = `${branchUrl}?${params.toString()}`;
    
    // Сохраняем информацию о выборе
    try {
        const selectionData = {
            categoryId: categoryId,
            categoryName: categoryName,
            categoryIcon: category ? category.icon : 'categories-icon.svg', // Добавляем иконку
            timestamp: new Date().toISOString(),
            filters: { ...this.currentFilters },
            currentPage: this.currentPage,
            source: 'rubricator'
        };
        localStorage.setItem('selectedCategory', JSON.stringify(selectionData));
    } catch (e) {
        console.warn('Не удалось сохранить данные в localStorage:', e);
    }
    
    // Показываем индикатор загрузки
    this.showLoadingIndicator();
    
    // Переход
    setTimeout(() => {
        window.location.href = fullUrl;
    }, 300);
}

    // Создание slug для URL категории
    createCategorySlug(categoryName) {
        const translitMap = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'є': 'ie',
            'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y', 'к': 'k',
            'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p', 'р': 'r', 'с': 's',
            'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh', 'ц': 'ts', 'ч': 'ch', 'ш': 'sh',
            'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya', "'": '', "'": ''
        };
        
        return categoryName
            .toLowerCase()
            .split('')
            .map(char => translitMap[char] || char)
            .join('')
            .replace(/[^a-z0-9]/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '');
    }

    // Показать индикатор загрузки
    showLoadingIndicator() {
        const container = document.getElementById('categoriesContainer');
        if (container) {
            container.classList.add('loading');
        }
    }

    // Скрыть индикатор загрузки
    hideLoadingIndicator() {
        const container = document.getElementById('categoriesContainer');
        if (container) {
            container.classList.remove('loading');
        }
    }
    addCategory(category) {
        const newId = Math.max(...this.allCategories.map(c => c.id)) + 1;
        const newCategory = { ...category, id: newId };
        this.allCategories.push(newCategory);
        this.applyFilters();
        console.log('Добавлена новая категория:', newCategory);
    }

    removeCategory(categoryId) {
        this.allCategories = this.allCategories.filter(c => c.id !== categoryId);
        this.applyFilters();
        console.log('Удалена категория с ID:', categoryId);
    }

    clearFilters() {
        // Сбрасываем фильтры
        this.currentFilters = {
            search: '',
            region: '',
            businessForm: ''
        };

        // Очищаем поле поиска
        const searchInput = document.getElementById('categorySearch');
        if (searchInput) {
            searchInput.value = '';
        }

        // Сбрасываем дропдауны
        const regionBtn = document.getElementById('regionBtn');
        const businessFormBtn = document.getElementById('businessFormBtn');
        
        if (regionBtn) {
            regionBtn.querySelector('.filter-text').textContent = 'Регіон';
        }
        if (businessFormBtn) {
            businessFormBtn.querySelector('.filter-text').textContent = 'Форма бізнесу';
        }

        // Убираем выделение с опций
        document.querySelectorAll('.filter-option.selected').forEach(option => {
            option.classList.remove('selected');
        });

        // Выделяем "Всі" опции
        document.querySelectorAll('.filter-option[data-value=""]').forEach(option => {
            option.classList.add('selected');
        });

        this.applyFilters();
        console.log('Фильтры очищены');
    }

    // Метод для получения текущего состояния
    getState() {
        return {
            currentPage: this.currentPage,
            totalPages: Math.ceil(this.filteredCategories.length / this.itemsPerPage),
            totalCategories: this.allCategories.length,
            filteredCategories: this.filteredCategories.length,
            filters: { ...this.currentFilters }
        };
    }
}

// Инициализация при загрузке страницы
let rubricatorManager;

document.addEventListener('DOMContentLoaded', () => {
    // Ждем загрузки компонентов
    if (document.body.classList.contains('components-ready')) {
        initRubricator();
    } else {
        document.addEventListener('componentsLoaded', initRubricator);
    }
});

function initRubricator() {
    console.log('🚀 Инициализация рубрикатора...');
    rubricatorManager = new RubricatorManager();
    
    // Добавляем глобальные горячие клавиши
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            rubricatorManager.closeAllDropdowns();
        }
        
        // Ctrl + / для фокуса на поиске
        if (e.ctrlKey && e.key === '/') {
            e.preventDefault();
            const searchInput = document.getElementById('categorySearch');
            if (searchInput) {
                searchInput.focus();
            }
        }
    });
    
    console.log('✅ Рубрикатор готов к работе!');
}

// Экспорт для использования в других скриптах
window.RubricatorManager = RubricatorManager;
// js/rubricator.js - Функциональность рубрикатора с поддержкой многоязычности

// Определение текущего языка
function getCurrentLanguage() {
    const currentPath = window.location.pathname;
    const isEnglishPage = currentPath.includes('/en/');
    return isEnglishPage ? 'en' : 'uk';
}

// Получение корректного пути к ресурсам с учетом языка
function getResourcePath(resourcePath) {
    const currentLang = getCurrentLanguage();
    
    if (currentLang === 'en') {
        // Для английской версии возвращаемся на уровень выше
        return `../${resourcePath}`;
    } else {
        // Для украинской версии путь остается как есть
        return `./${resourcePath}`;
    }
}

// Получение пути к странице с учетом языка
function getLocalizedPath(pageName) {
    const currentLang = getCurrentLanguage();
    
    return `./${pageName}`;
}

// Локализованные тексты
function getLocalizedText(key) {
    const currentLang = getCurrentLanguage();
    
    const texts = {
        uk: {
            selectCountry: 'Оберіть країну або регіон зі списку',
            pageInitialized: 'Рубрикатор ініціалізований',
            functionalityLoaded: 'Функціональність рубрикатора завантажена',
            sphereLoaded: 'Завантажені дані про вибрану сферу:',
            sphereFromUrl: 'Виявлено параметр сфери в URL:',
            checkingSphere: 'Перевіряємо вибрану сферу...',
            sphereInSession: 'Знайдена сфера в sessionStorage:',
            sphereInUrl: 'Знайдено параметр sphere в URL:',
            sphereNotSelected: 'Сфера не вибрана, показуємо всі категорії',
            sphereFilterError: 'Помилка при перевірці сфери:',
            sphereDataMissing: 'Немає даних про сферу для фільтрації',
            applySphereFilter: 'Застосовуємо фільтр по сфері:',
            categoryMatches: 'Категорія відповідає сфері',
            categoriesFiltered: 'Відфільтровано категорій з',
            titleUpdated: 'Заголовок оновлено для сфери:',
            clearSphereFilter: 'Очищуємо фільтр по сфері',
            categoriesFor: 'Категорії для',
            selectedSphere: 'Вибрана сфера:',
            sphereDescription: 'Показано категорії, релевантні для обраної сфери можливостей',
            unknownSphere: 'Невідома сфера',
            buildPartnership: 'Побудуй партнерство,',
            gameChanger: 'яке змінює гру',
            findOpportunities: 'Знаходь можливості співпраці за сферами діяльності та регіонами',
            resultsFound: 'Знайдено:',
            forSphere: 'для сфери',
            category: 'категорія',
            categories2: 'категорії',
            categories5: 'категорій',
            clickCategory: 'Клік по категорії:',
            nextPage: 'Перехід на наступну сторінку пагінації',
            lastPage: 'Це остання сторінка',
            lastPageReached: 'Ви досягли останньої сторінки!',
            tryChangeFilters: 'Спробуйте змінити фільтри або параметри пошуку.',
            categoryBranch: 'Перехід в категорію:',
            newCategoryAdded: 'Додано нову категорію:',
            categoryRemoved: 'Видалено категорію з ID:',
            filtersCleared: 'Фільтри очищено',
            rubricatorReady: 'Рубрикатор готовий до роботи!',
            region: 'Регіон',
            businessForm: 'Форма бізнесу'
        },
        en: {
            selectCountry: 'Select country or region from the list',
            pageInitialized: 'Rubricator initialized',
            functionalityLoaded: 'Rubricator functionality loaded',
            sphereLoaded: 'Selected sphere data loaded:',
            sphereFromUrl: 'Sphere parameter detected in URL:',
            checkingSphere: 'Checking selected sphere...',
            sphereInSession: 'Sphere found in sessionStorage:',
            sphereInUrl: 'Sphere parameter found in URL:',
            sphereNotSelected: 'Sphere not selected, showing all categories',
            sphereFilterError: 'Error checking sphere:',
            sphereDataMissing: 'No sphere data for filtering',
            applySphereFilter: 'Applying sphere filter:',
            categoryMatches: 'Category matches sphere',
            categoriesFiltered: 'Filtered categories from',
            titleUpdated: 'Title updated for sphere:',
            clearSphereFilter: 'Clearing sphere filter',
            categoriesFor: 'Categories for',
            selectedSphere: 'Selected sphere:',
            sphereDescription: 'Showing categories relevant to the selected opportunity sphere',
            unknownSphere: 'Unknown sphere',
            buildPartnership: 'Build partnership',
            gameChanger: 'that changes the game',
            findOpportunities: 'Find collaboration opportunities by spheres of activity and regions',
            resultsFound: 'Found:',
            forSphere: 'for sphere',
            category: 'category',
            categories2: 'categories',
            categories5: 'categories',
            clickCategory: 'Click on category:',
            nextPage: 'Navigate to next pagination page',
            lastPage: 'This is the last page',
            lastPageReached: 'You have reached the last page!',
            tryChangeFilters: 'Try changing your filters or search parameters.',
            categoryBranch: 'Navigate to category:',
            newCategoryAdded: 'New category added:',
            categoryRemoved: 'Category removed with ID:',
            filtersCleared: 'Filters cleared',
            rubricatorReady: 'Rubricator ready to work!',
            region: 'Region',
            businessForm: 'Business Form'
        }
    };
    
    return texts[currentLang][key] || texts['uk'][key];
}

class RubricatorManager {
    constructor() {
        this.currentLang = getCurrentLanguage();
        
        // Данные категорий (можно заменить на API)
        this.allCategories = [
            { 
                id: 1, 
                name: this.currentLang === 'en' ? "Industry and Processing" : "Промисловість та переробка", 
                icon: "categories-icon.svg", 
                region: "kyiv", 
                businessForm: "tov", 
                spheres: ["finance", "marketplace"] 
            },
            { 
                id: 2, 
                name: this.currentLang === 'en' ? "Construction, Materials, Woodworking" : "Будівництво, матеріали, деревопереробка", 
                icon: "categories-icon-1.svg", 
                region: "lviv", 
                businessForm: "fop", 
                spheres: ["marketplace"] 
            },
            { 
                id: 3, 
                name: this.currentLang === 'en' ? "Agriculture and Food Industry" : "Агро і харчова промисловість", 
                icon: "categories-icon-2.svg", 
                region: "odesa", 
                businessForm: "at", 
                spheres: ["marketplace"] 
            },
            { 
                id: 4, 
                name: this.currentLang === 'en' ? "Energy" : "Енергетика", 
                icon: "categories-icon-3.svg", 
                region: "kharkiv", 
                businessForm: "tov", 
                spheres: ["finance"] 
            },
            { 
                id: 5, 
                name: this.currentLang === 'en' ? "Logistics and Transport" : "Логістика і транспорт", 
                icon: "categories-icon-4.svg", 
                region: "dnipro", 
                businessForm: "pp", 
                spheres: ["marketplace"] 
            },
            { 
                id: 6, 
                name: this.currentLang === 'en' ? "Finance and Business Services" : "Фінанси та бізнес послуги", 
                icon: "categories-icon-5.svg", 
                region: "kyiv", 
                businessForm: "tov", 
                spheres: ["finance", "consulting", "marketplace"] 
            },
            { 
                id: 7, 
                name: this.currentLang === 'en' ? "Wholesale and Retail Trade" : "Оптова та роздрібна торгівля", 
                icon: "categories-icon-6.svg", 
                region: "lviv", 
                businessForm: "fop", 
                spheres: ["marketplace"] 
            },
            { 
                id: 8, 
                name: this.currentLang === 'en' ? "Light Industry/Fashion" : "Легка промисловість/мода", 
                icon: "categories-icon-7.svg", 
                region: "odesa", 
                businessForm: "at", 
                spheres: ["marketplace"] 
            },
            { 
                id: 9, 
                name: this.currentLang === 'en' ? "IT and Telecommunications" : "IT та телекомунікації", 
                icon: "categories-icon-8.svg", 
                region: "kyiv", 
                businessForm: "tov", 
                spheres: ["finance", "consulting", "education"] 
            },
            { 
                id: 10, 
                name: this.currentLang === 'en' ? "Health and Beauty" : "Здоров'я та краса", 
                icon: "categories-icon-9.svg", 
                region: "kharkiv", 
                businessForm: "fop", 
                spheres: ["consulting", "marketplace"] 
            },
            { 
                id: 11, 
                name: this.currentLang === 'en' ? "Tourism, Sports, Entertainment" : "Туризм, спорт, розваги", 
                icon: "categories-icon-10.svg", 
                region: "dnipro", 
                businessForm: "pp", 
                spheres: ["marketplace"] 
            },
            { 
                id: 12, 
                name: this.currentLang === 'en' ? "Education, Science, Arts" : "Освіта, наука, мистецтво", 
                icon: "categories-icon-11.svg", 
                region: "kyiv", 
                businessForm: "tov", 
                spheres: ["consulting", "education"] 
            },
            { 
                id: 13, 
                name: this.currentLang === 'en' ? "Media and Advertising" : "Медіа та реклама", 
                icon: "categories-icon-12.svg", 
                region: "lviv", 
                businessForm: "at", 
                spheres: ["education", "consulting"] 
            },
            { 
                id: 14, 
                name: this.currentLang === 'en' ? "Creative Industry" : "Креативна індустрія", 
                icon: "categories-icon-13.svg", 
                region: "odesa", 
                businessForm: "fop", 
                spheres: ["education", "consulting"] 
            },
            { 
                id: 15, 
                name: this.currentLang === 'en' ? "Other" : "Інше", 
                icon: "categories-icon-14.svg", 
                region: "kharkiv", 
                businessForm: "tov", 
                spheres: ["finance", "consulting", "education", "marketplace"] 
            },
            // Дополнительные категории для демонстрации пагинации
            { 
                id: 16, 
                name: this.currentLang === 'en' ? "Mechanical Engineering" : "Машинобудування", 
                icon: "categories-icon.svg", 
                region: "dnipro", 
                businessForm: "at",
                spheres: ["finance", "marketplace"]
            },
            { 
                id: 17, 
                name: this.currentLang === 'en' ? "Chemical Industry" : "Хімічна промисловість", 
                icon: "categories-icon-1.svg", 
                region: "kyiv", 
                businessForm: "tov",
                spheres: ["finance", "marketplace"]
            },
            { 
                id: 18, 
                name: this.currentLang === 'en' ? "Textile Industry" : "Текстильна промисловість", 
                icon: "categories-icon-2.svg", 
                region: "lviv", 
                businessForm: "fop",
                spheres: ["marketplace"]
            },
            { 
                id: 19, 
                name: this.currentLang === 'en' ? "Metallurgy" : "Металургія", 
                icon: "categories-icon-3.svg", 
                region: "odesa", 
                businessForm: "pp",
                spheres: ["finance", "marketplace"]
            },
            { 
                id: 20, 
                name: this.currentLang === 'en' ? "Mining Industry" : "Видобувна промисловість", 
                icon: "categories-icon-4.svg", 
                region: "kharkiv", 
                businessForm: "tov",
                spheres: ["finance"]
            },
            { 
                id: 21, 
                name: this.currentLang === 'en' ? "Pharmaceuticals" : "Фармацевтика", 
                icon: "categories-icon-5.svg", 
                region: "dnipro", 
                businessForm: "at",
                spheres: ["consulting", "marketplace"]
            },
            { 
                id: 22, 
                name: this.currentLang === 'en' ? "Biotechnology" : "Біотехнології", 
                icon: "categories-icon-6.svg", 
                region: "kyiv", 
                businessForm: "fop",
                spheres: ["consulting", "education"]
            },
            { 
                id: 23, 
                name: this.currentLang === 'en' ? "Nanotechnology" : "Нанотехнології", 
                icon: "categories-icon-7.svg", 
                region: "lviv", 
                businessForm: "tov",
                spheres: ["education", "consulting"]
            },
            { 
                id: 24, 
                name: this.currentLang === 'en' ? "Space Technology" : "Космічні технології", 
                icon: "categories-icon-8.svg", 
                region: "odesa", 
                businessForm: "pp",
                spheres: ["education"]
            },
            { 
                id: 25, 
                name: this.currentLang === 'en' ? "Ecology and Nature Conservation" : "Екологія та природоохорона", 
                icon: "categories-icon-9.svg", 
                region: "kharkiv", 
                businessForm: "at",
                spheres: ["consulting", "education"]
            }
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
                console.log('🌟 ' + getLocalizedText('sphereLoaded'), this.selectedSphere);
                
                // Применяем фильтрацию по сфере
                this.applySphereFilter();
                
            } else if (sphereParam) {
                console.log('🔗 ' + getLocalizedText('sphereFromUrl'), sphereParam);
                
                // Создаем базовую информацию о сфере из URL
                this.selectedSphere = {
                    sphereType: sphereParam,
                    source: 'url-parameter'
                };
                
                this.applySphereFilter();
            }
        } catch (error) {
            console.error(getLocalizedText('sphereFilterError'), error);
        }
    }

    checkSphereSelection() {
        console.log('🔍 ' + getLocalizedText('checkingSphere'));
        
        try {
            // Проверяем sessionStorage
            const sphereData = sessionStorage.getItem('sphereSelection');
            if (sphereData) {
                this.selectedSphere = JSON.parse(sphereData);
                console.log('✅ ' + getLocalizedText('sphereInSession'), this.selectedSphere);
                this.applySphereFilter();
                return;
            }
            
            // Проверяем URL параметры
            const urlParams = new URLSearchParams(window.location.search);
            const sphereParam = urlParams.get('sphere');
            if (sphereParam) {
                console.log('✅ ' + getLocalizedText('sphereInUrl'), sphereParam);
                this.selectedSphere = { sphereType: sphereParam };
                this.applySphereFilter();
                return;
            }
            
            console.log('ℹ️ ' + getLocalizedText('sphereNotSelected'));
        } catch (error) {
            console.error('❌ ' + getLocalizedText('sphereFilterError'), error);
        }
    }

    applySphereFilter() {
        if (!this.selectedSphere || !this.selectedSphere.sphereType) {
            console.log('⚠️ ' + getLocalizedText('sphereDataMissing'));
            return;
        }
        
        const sphereType = this.selectedSphere.sphereType;
        console.log(`🎯 ${getLocalizedText('applySphereFilter')}: ${sphereType}`);
        
        // Фильтруем категории по сфере
        this.filteredCategories = this.allCategories.filter(category => {
            const hasSphere = category.spheres && category.spheres.includes(sphereType);
            if (hasSphere) {
                console.log(`✅ ${getLocalizedText('categoryMatches')} "${category.name}" ${sphereType}`);
            }
            return hasSphere;
        });
        
        console.log(`📊 ${getLocalizedText('categoriesFiltered')} ${this.filteredCategories.length} ${getLocalizedText('categoriesFiltered')} ${this.allCategories.length}`);
        
        // Обновляем заголовок
        this.updatePageTitle();
    }

    updatePageTitle() {
        if (!this.selectedSphere) return;
        
        const titleElement = document.querySelector('.title-rubricator h1');
        if (titleElement && this.selectedSphere.sphereTitle) {
            const categoriesForText = getLocalizedText('categoriesFor');
            titleElement.innerHTML = `${categoriesForText} <span>"${this.selectedSphere.sphereTitle}"</span>`;
        }
        
        console.log('📝 ' + getLocalizedText('titleUpdated'), this.selectedSphere.sphereTitle);
    }

    // Метод для добавления информационного блока
    addSphereInfoBlock() {
        if (!this.selectedSphere) return;
        
        // Проверяем, не добавлен ли уже блок
        if (document.querySelector('.sphere-info-block')) return;
        
        const titleSection = document.getElementById('title-search-section');
        if (!titleSection) return;
        
        const selectedSphereText = getLocalizedText('selectedSphere');
        const sphereDescriptionText = getLocalizedText('sphereDescription');
        const unknownSphereText = getLocalizedText('unknownSphere');
        
        const infoBlock = document.createElement('div');
        infoBlock.className = 'sphere-info-block';
        infoBlock.innerHTML = `
            <div class="sphere-info-content">
                <div class="sphere-info-icon">🌟</div>
                <div class="sphere-info-text">
                    <h3>${selectedSphereText} ${this.selectedSphere.sphereTitle || unknownSphereText}</h3>
                    <p>${sphereDescriptionText}</p>
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
        console.log('🧹 ' + getLocalizedText('clearSphereFilter'));
        
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
            const buildPartnership = getLocalizedText('buildPartnership');
            const gameChanger = getLocalizedText('gameChanger');
            titleElement.innerHTML = `${buildPartnership} <span>${gameChanger}</span>`;
        }
        
        if (descriptionElement) {
            descriptionElement.textContent = getLocalizedText('findOpportunities');
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
        
        // Отфильтровываем категорию "Інше"/"Other" для отдельной обработки
        const otherCategory = this.filteredCategories.find(cat => cat.id === 15);
        const regularCategories = this.filteredCategories.filter(cat => cat.id !== 15);
        
        // Берем обычные категории для текущей страницы (14 штук максимум, чтобы оставить место для "Інше")
        const maxRegularItems = this.itemsPerPage - 1; // 14 вместо 15
        const regularCategoriesToShow = regularCategories.slice(startIndex, startIndex + maxRegularItems);
        
        // Всегда добавляем категорию "Інше"/"Other" в конец, если она есть в отфильтрованных
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
                <img src="${getResourcePath('icons/' + category.icon)}" alt="categories icon" width="108">
                <a href="#" data-category="${category.name}" data-category-id="${category.id}">
                    <img class="arrow-card" src="${getResourcePath('icons/arrow-title.svg')}" alt="arrow" width="14">
                    <img class="arrow-card-hover" src="${getResourcePath('icons/arrow-title-hover.svg')}" alt="arrow" width="14">
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

        // Добавляем обработчики для всего блока категории "Інше"/"Other"
        container.querySelectorAll('.other-category').forEach(block => {
            block.style.cursor = 'pointer';
            block.addEventListener('click', (e) => {
                // Проверяем, что клик не по ссылке (она уже обработана выше)
                if (!e.target.closest('a')) {
                    const categoryId = parseInt(block.getAttribute('data-category-id'));
                    const otherText = this.currentLang === 'en' ? 'Other' : 'Інше';
                    this.handleCategoryClick(categoryId, otherText);
                }
            });
        });
    }

    renderPagination() {
        const container = document.getElementById('pagination');
        if (!container) return;

        // Исключаем категорию "Інше"/"Other" из подсчета пагинации и учитываем, что на каждой странице 14 обычных + 1 "Інше"/"Other"
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
        if (countElement) {
            const count = this.filteredCategories.length;
            const word = this.getPlural(count, 
                getLocalizedText('category'), 
                getLocalizedText('categories2'), 
                getLocalizedText('categories5')
            );
        
            let text = `${getLocalizedText('resultsFound')} ${count} ${word}`;
        
            if (this.selectedSphere) {
                text += ` ${getLocalizedText('forSphere')} "${this.selectedSphere.sphereTitle || this.selectedSphere.sphereType}"`;
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
        console.log(`🎯 ${getLocalizedText('clickCategory')} ${categoryName} (ID: ${categoryId})`);
        
        if (categoryId === 15) {
            // Специальная обработка для категории "Інше"/"Other"
            this.navigateToNextPage();
        } else {
            // Обычная обработка для других категорий
            this.navigateToCategory(categoryId, categoryName);
        }
    }

    // Переход на следующую страницу пагинации для категории "Інше"/"Other"
    navigateToNextPage() {
        console.log('🚀 ' + getLocalizedText('nextPage'));
        
        // Считаем общее количество страниц (исключая "Інше"/"Other")
        const regularCategories = this.filteredCategories.filter(cat => cat.id !== 15);
        const totalPages = Math.ceil(regularCategories.length / (this.itemsPerPage - 1)); // -1 потому что место занимает "Інше"/"Other"
        
        if (this.currentPage < totalPages) {
            // Переходим на следующую страницу
            this.goToPage(this.currentPage + 1);
        } else {
            // Если это последняя страница, можно сделать что-то другое
            console.log('🏁 ' + getLocalizedText('lastPage'));
            this.showEndMessage();
        }
    }

    // Показать сообщение о том, что это последняя страница
    showEndMessage() {
        const message = getLocalizedText('lastPageReached');
        const submessage = getLocalizedText('tryChangeFilters');

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
        console.log(`📂 ${getLocalizedText('categoryBranch')}: ${categoryName}`);
        
        // Находим категорию для получения иконки
        const category = this.allCategories.find(cat => cat.id === categoryId);
        
        // Создаем URL для страницы галузі с учетом языка
        const branchUrl = './branch.html';
        
        // Создаем параметры для передачи информации о категории
        const params = new URLSearchParams({
            category: categoryId,
            name: categoryName,
            icon: category ? category.icon : 'categories-icon.svg' 
        });
        
        const fullUrl = `${branchUrl}?${params.toString()}`;
        
        // Сохраняем информацию о выборе
        try {
            const selectionData = {
                categoryId: categoryId,
                categoryName: categoryName,
                categoryIcon: category ? getResourcePath('icons/' + category.icon) : getResourcePath('icons/categories-icon.svg'), // Добавляем иконку
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
        console.log(getLocalizedText('newCategoryAdded'), newCategory);
    }

    removeCategory(categoryId) {
        this.allCategories = this.allCategories.filter(c => c.id !== categoryId);
        this.applyFilters();
        console.log(getLocalizedText('categoryRemoved'), categoryId);
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
        
        const regionText = getLocalizedText('region');
        const businessFormText = getLocalizedText('businessForm');
        
        if (regionBtn) {
            regionBtn.querySelector('.filter-text').textContent = regionText;
        }
        if (businessFormBtn) {
            businessFormBtn.querySelector('.filter-text').textContent = businessFormText;
        }

        // Убираем выделение с опций
        document.querySelectorAll('.filter-option.selected').forEach(option => {
            option.classList.remove('selected');
        });

        // Выделяем "Всі"/"All" опции
        document.querySelectorAll('.filter-option[data-value=""]').forEach(option => {
            option.classList.add('selected');
        });

        this.applyFilters();
        console.log(getLocalizedText('filtersCleared'));
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
    console.log('🚀 ' + getLocalizedText('pageInitialized'));
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
    
    console.log('✅ ' + getLocalizedText('rubricatorReady'));
}

// Экспорт для использования в других скриптах
window.RubricatorManager = RubricatorManager;
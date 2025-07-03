// js/branch.js - Функциональность страницы галузі с полной поддержкой многоязычности

class BranchManager {
    constructor() {
        // Определяем текущий язык
        this.currentLang = this.detectLanguage();
        console.log('Detected language:', this.currentLang);
        
        // Инициализируем categoryInfo с дефолтными значениями
        this.categoryInfo = {
            name: this.currentLang === 'en' ? "Manufacturing" : "Виробництво",
            description: this.currentLang === 'en' 
                ? "Businesses engaged in manufacturing and production"
                : "Бізнеси що займаються виробництвом та промисловістю",
            icon: this.getLocalizedPath("./icons/categories-icon.svg")
        };
        
        // КРИТИЧЕСКИ ВАЖНО: Инициализируем данные бизнесов СНАЧАЛА
        this.initializeBusinessData();

        // Затем инициализируем остальные свойства
        this.filteredBusinesses = [...this.allBusinesses];
        this.currentPage = 1;
        this.itemsPerPage = 6;
        this.currentFilters = {
            businessType: [],
            scale: [],
            geography: [],
            needs: []
        };

        this.init();
    }

    // Определение текущего языка
    detectLanguage() {
        const path = window.location.pathname;
        const isEnglish = path.includes('/en/');
        return isEnglish ? 'en' : 'uk';
    }

    // Получение пути с учетом языка
    getLocalizedPath(path) {
        if (path.startsWith('./')) {
            const relativePath = path.substring(2);
            if (this.currentLang === 'en') {
                return `../${relativePath}`; // для английской версии
            } else {
                return `./${relativePath}`; // для украинской версии
            }
        }
        return path;
    }

    // Принудительная инициализация данных бизнесов
    initializeBusinessData() {
        console.log('🔧 Инициализация данных бизнесов для языка:', this.currentLang);
        
        this.allBusinesses = [
            {
                id: 1,
                name: this.currentLang === 'en' ? "Nova Poshta" : "Нова Пошта",
                description: this.currentLang === 'en' 
                    ? "Nova Poshta is a Ukrainian express delivery company founded in 2001. Its goal is to provide easy delivery for every customer - to the office, parcel locker or address."
                    : "Нова пошта — це українська компанія з експрес-доставки, заснована 2001 року. Її мета — забезпечувати легку доставку для кожного клієнта — у відділення, поштомат або на адресу.",
                logo: this.getLocalizedPath("./img/branch-logo-1.png"),
                businessType: "services",
                scale: "large",
                geography: "kyiv",
                needs: ["investment", "partnership", "similar"],
                category: "logistics"
            },
            {
                id: 2,
                name: this.currentLang === 'en' ? "ATB" : "АТБ",
                description: this.currentLang === 'en'
                    ? "ATB is a leading Ukrainian supermarket chain offering quality products at affordable prices throughout the country."
                    : "АТБ — провідна українська мережа супермаркетів, що пропонує якісні продукти за доступними цінами по всій країні.",
                logo: this.getLocalizedPath("./img/branch-logo-2.png"),
                businessType: "trade",
                scale: "large",
                geography: "dnipro",
                needs: ["marketing", "partnership", "similar"],
                category: "retail"
            },
            {
                id: 3,
                name: "Rozetka",
                description: this.currentLang === 'en'
                    ? "Rozetka is the largest online retailer in Ukraine, offering a wide range of products and convenient delivery."
                    : "Rozetka — найбільший онлайн-ритейлер в Україні, що пропонує широкий асортимент товарів та зручну доставку.",
                logo: this.getLocalizedPath("./img/branch-logo-3.png"),
                businessType: "technology",
                scale: "large",
                geography: "kyiv",
                needs: ["investment", "similar"],
                category: "ecommerce"
            },
            // Генерируем дополнительные компании
            ...Array.from({length: 22}, (_, i) => ({
                id: i + 4,
                name: this.currentLang === 'en' ? `Company ${i + 4}` : `Компанія ${i + 4}`,
                description: this.currentLang === 'en'
                    ? "Company description with detailed information about activities and cooperation opportunities."
                    : "Опис компанії з детальною інформацією про діяльність та можливості співпраці.",
                logo: this.getLocalizedPath(`./img/branch-logo-${(i % 3) + 1}.png`),
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

        console.log(`✅ Данные бизнесов инициализированы: ${this.allBusinesses.length} записей`);
    }

    // Инициализация
    init() {
        console.log('🚀 Инициализация BranchManager');
        console.log('Current language:', this.currentLang);
        console.log(`📊 Всего бизнесов в базе: ${this.allBusinesses.length}`);
        
        // Проверяем, что у нас есть данные бизнесов
        if (this.allBusinesses.length === 0) {
            console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: Нет данных бизнесов!');
            this.initializeBusinessData();
        }
        
        console.log('Category info before URL load:', this.categoryInfo);
        
        // Загружаем данные из URL и обновляем отображение
        this.loadCategoryFromURL();
        console.log('Category info after URL load:', this.categoryInfo);
        
        this.updateCategoryDisplay();
        this.setupEventListeners();
        
        console.log(`🔍 Отфильтрованных бизнесов: ${this.filteredBusinesses.length}`);
        
        // Рендерим контент
        this.renderBusinesses();
        this.renderPagination();
        this.updateResultsCount();
        
        // Проверка секции блога
        this.checkBlogSection();
        
        // Дополнительная проверка через 200мс
        setTimeout(() => {
            console.log('🔄 Дополнительная проверка контента через 200мс');
            this.checkContentRendering();
        }, 200);
        
        console.log('✅ Инициализация завершена');
    }

    // Проверка  секции блога для английской версии
    checkBlogSection() {
    const blogSection = document.getElementById('blog-section');
    
    if (blogSection) {
        // Теперь показываем секцию блога для обеих языков
        blogSection.style.display = 'block';
        blogSection.style.visibility = 'visible';
        blogSection.removeAttribute('hidden');
        blogSection.classList.remove('hidden-en');
        
        console.log(`📰 Секция блога отображается для языка: ${this.currentLang}`);
    } else {
        console.log('ℹ️ Секция блога не найдена на этой странице');
    }
}


    // Загрузка информации о категории из URL
    loadCategoryFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryId = urlParams.get('category');
        const categoryName = urlParams.get('name');
        const categoryIcon = urlParams.get('icon');

        console.log('🔄 loadCategoryFromURL called');
        console.log('URL params:', { categoryId, categoryName, categoryIcon });
        console.log('Current language:', this.currentLang);

        let originalCategoryName = null;

        // ПРИОРИТЕТ 1: Получаем название из URL
        if (categoryName) {
            originalCategoryName = decodeURIComponent(categoryName);
            console.log('📥 Category name from URL:', originalCategoryName);
        }
        
        // ПРИОРИТЕТ 2: Если нет в URL, пробуем localStorage
        if (!originalCategoryName) {
            try {
                const savedData = localStorage.getItem('selectedCategory');
                if (savedData) {
                    const categoryData = JSON.parse(savedData);
                    originalCategoryName = categoryData.categoryName;
                    console.log('📥 Category name from localStorage:', originalCategoryName);
                }
            } catch (e) {
                console.warn('❌ Ошибка чтения localStorage:', e);
            }
        }

        // КЛЮЧЕВОЕ ИСПРАВЛЕНИЕ: Всегда переводим название под текущий язык
        if (originalCategoryName) {
            // Сначала нормализуем название (переводим в базовый вариант)
            const normalizedName = this.getNormalizedCategoryName(originalCategoryName);
            // Затем переводим под текущий язык
            const localizedName = this.getLocalizedCategoryName(normalizedName);
            
            this.categoryInfo.name = localizedName;
            
            console.log('🔄 Translation process:');
            console.log('- Original:', originalCategoryName);
            console.log('- Normalized:', normalizedName);
            console.log('- Localized for', this.currentLang + ':', localizedName);
        } else {
            // Если нет названия, используем дефолтное
            this.categoryInfo.name = this.currentLang === 'en' ? "Manufacturing" : "Виробництво";
            console.log('📄 Using default category name:', this.categoryInfo.name);
        }

        // Обработка иконки
        if (categoryIcon) {
            const iconFileName = categoryIcon.replace(/.*\//, '');
            this.categoryInfo.icon = this.getLocalizedPath(`./icons/${iconFileName}`);
            console.log('🖼️ Icon path set to:', this.categoryInfo.icon);
        } else {
            // Пробуем получить иконку из localStorage
            try {
                const savedData = localStorage.getItem('selectedCategory');
                if (savedData) {
                    const categoryData = JSON.parse(savedData);
                    if (categoryData.categoryIcon) {
                        const iconFileName = categoryData.categoryIcon.replace(/.*\//, '');
                        this.categoryInfo.icon = this.getLocalizedPath(`./icons/${iconFileName}`);
                        console.log('🖼️ Icon from localStorage:', this.categoryInfo.icon);
                    }
                }
            } catch (e) {
                console.warn('❌ Ошибка получения иконки из localStorage:', e);
            }
        }

        console.log('✅ Final category info:', this.categoryInfo);
    }

    // Нормализация названия категории (приведение к базовому виду)
    getNormalizedCategoryName(categoryName) {
        const normalizationMap = {
            // Украинские -> Английские (базовые)
            "Промисловість та переробка": "Industry and Processing",
            "Будівництво, матеріали, деревопереробка": "Construction, Materials, Woodworking",
            "Агро і харчова промисловість": "Agriculture and Food Industry",
            "Енергетика": "Energy",
            "Логістика і транспорт": "Logistics and Transport",
            "Фінанси та бізнес послуги": "Finance and Business Services",
            "Оптова та роздрібна торгівля": "Wholesale and Retail Trade",
            "Легка промисловість/мода": "Light Industry/Fashion",
            "IT та телекомунікації": "IT and Telecommunications",
            "Здоров'я та краса": "Health and Beauty",
            "Туризм, спорт, розваги": "Tourism, Sports, Entertainment",
            "Освіта, наука, мистецтво": "Education, Science, Arts",
            "Медіа та реклама": "Media and Advertising",
            "Креативна індустрія": "Creative Industry",
            "Інше": "Other",
            "Виробництво": "Manufacturing",
            
            // Английские остаются как есть (уже базовые)
            "Industry and Processing": "Industry and Processing",
            "Construction, Materials, Woodworking": "Construction, Materials, Woodworking",
            "Agriculture and Food Industry": "Agriculture and Food Industry",
            "Energy": "Energy",
            "Logistics and Transport": "Logistics and Transport",
            "Finance and Business Services": "Finance and Business Services",
            "Wholesale and Retail Trade": "Wholesale and Retail Trade",
            "Light Industry/Fashion": "Light Industry/Fashion",
            "IT and Telecommunications": "IT and Telecommunications",
            "Health and Beauty": "Health and Beauty",
            "Tourism, Sports, Entertainment": "Tourism, Sports, Entertainment",
            "Education, Science, Arts": "Education, Science, Arts",
            "Media and Advertising": "Media and Advertising",
            "Creative Industry": "Creative Industry",
            "Other": "Other",
            "Manufacturing": "Manufacturing"
        };

        const normalized = normalizationMap[categoryName] || categoryName;
        console.log(`🔄 Normalized "${categoryName}" -> "${normalized}"`);
        return normalized;
    }

    // Локализация названий категорий
    getLocalizedCategoryName(baseCategoryName) {
        console.log('🌐 Localizing category:', baseCategoryName, 'to language:', this.currentLang);
        
        if (this.currentLang === 'en') {
            // Если нужен английский, возвращаем как есть (базовое название уже английское)
            console.log('📝 Returning English name:', baseCategoryName);
            return baseCategoryName;
        } else {
            // Если нужен украинский, переводим с английского на украинский
            const englishToUkrainian = {
                "Industry and Processing": "Промисловість та переробка",
                "Construction, Materials, Woodworking": "Будівництво, матеріали, деревопереробка",
                "Agriculture and Food Industry": "Агро і харчова промисловість",
                "Energy": "Енергетика",
                "Logistics and Transport": "Логістика і транспорт",
                "Finance and Business Services": "Фінанси та бізнес послуги",
                "Wholesale and Retail Trade": "Оптова та роздрібна торгівля",
                "Light Industry/Fashion": "Легка промисловість/мода",
                "IT and Telecommunications": "IT та телекомунікації",
                "Health and Beauty": "Здоров'я та краса",
                "Tourism, Sports, Entertainment": "Туризм, спорт, розваги",
                "Education, Science, Arts": "Освіта, наука, мистецтво",
                "Media and Advertising": "Медіа та реклама",
                "Creative Industry": "Креативна індустрія",
                "Other": "Інше",
                "Manufacturing": "Виробництво"
            };
            
            const ukrainianName = englishToUkrainian[baseCategoryName] || baseCategoryName;
            console.log('📝 Returning Ukrainian name:', ukrainianName);
            return ukrainianName;
        }
    }

    // Обновление отображения информации о категории
    updateCategoryDisplay() {
        console.log('📝 updateCategoryDisplay started');
        console.log('- Current language:', this.currentLang);
        console.log('- Category name to display:', this.categoryInfo.name);
        
        const titleElement = document.getElementById('branchTitle');
        const descriptionElement = document.getElementById('branchDescription');
        const iconElement = document.getElementById('branchIcon');

        // ПРИНУДИТЕЛЬНОЕ обновление заголовка
        if (titleElement) {
            console.log('🎯 Updating title element');
            console.log('- Current title text:', titleElement.textContent);
            console.log('- Target title text:', this.categoryInfo.name);
            
            titleElement.innerHTML = '';
            titleElement.textContent = this.categoryInfo.name;
            
            setTimeout(() => {
                if (titleElement.textContent !== this.categoryInfo.name) {
                    console.warn('⚠️ Title not updated, forcing again');
                    titleElement.textContent = this.categoryInfo.name;
                }
                console.log('✅ Final title text:', titleElement.textContent);
            }, 100);
            
        } else {
            console.error('❌ Title element #branchTitle not found');
        }

        // ПРИНУДИТЕЛЬНОЕ обновление описания
        if (descriptionElement) {
            const correctDescription = this.getCorrectDescription();
            console.log('🎯 Updating description element');
            console.log('- Current description:', descriptionElement.textContent);
            console.log('- Target description:', correctDescription);
            
            descriptionElement.innerHTML = '';
            descriptionElement.textContent = correctDescription;
            
            setTimeout(() => {
                if (descriptionElement.textContent !== correctDescription) {
                    console.warn('⚠️ Description not updated, forcing again');
                    descriptionElement.textContent = correctDescription;
                }
                console.log('✅ Final description text:', descriptionElement.textContent);
            }, 100);
            
        } else {
            console.error('❌ Description element #branchDescription not found');
        }

        // Обновление иконки
        if (iconElement) {
            iconElement.src = this.categoryInfo.icon;
            iconElement.alt = `${this.categoryInfo.name} icon`;
            
            iconElement.onerror = () => {
                const fallbackIcon = this.getLocalizedPath('./icons/categories-icon.svg');
                console.warn(`Failed to load icon: ${this.categoryInfo.icon}, using fallback: ${fallbackIcon}`);
                iconElement.src = fallbackIcon;
            };
        }

        // Обновляем заголовок секции фильтрования
        const filteringTitle = document.querySelector('#search-branch-section h2');
        if (filteringTitle) {
            filteringTitle.textContent = this.getLocalizedText('filtering');
            console.log('📝 Filtering title updated to:', filteringTitle.textContent);
        }

        // Обновляем title страницы
        document.title = `Collabora - ${this.categoryInfo.name}`;
        
        console.log('✅ updateCategoryDisplay completed');
    }

    // Получение правильного описания
    getCorrectDescription() {
        const descriptions = {
            en: {
                "Industry and Processing": "Businesses engaged in industrial production and raw material processing",
                "Construction, Materials, Woodworking": "Construction industry companies and building material manufacturers",
                "Agriculture and Food Industry": "Agricultural enterprises and food industry companies",
                "Energy": "Energy sector companies and alternative energy",
                "Logistics and Transport": "Companies providing logistics and transport services",
                "Finance and Business Services": "Financial institutions and business service companies",
                "Wholesale and Retail Trade": "Trading companies and retail chains",
                "Light Industry/Fashion": "Light industry enterprises and fashion industry",
                "IT and Telecommunications": "Technology companies and telecommunications service providers",
                "Health and Beauty": "Healthcare and cosmetology companies",
                "Tourism, Sports, Entertainment": "Tourism and entertainment industry enterprises",
                "Education, Science, Arts": "Educational institutions and scientific activity organizations",
                "Media and Advertising": "Media companies and advertising agencies",
                "Creative Industry": "Creative economy and design enterprises",
                "Manufacturing": "Manufacturing and production companies",
                "Other": "Various businesses and enterprises from other industries"
            },
            uk: {
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
                "Освіта, наука, мистецтво": "Освітні установи та organisations наукової діяльності",
                "Медіа та реклама": "Медійні компанії та рекламні агентства",
                "Креативна індустрія": "Підприємства креативної економіки та дизайну",
                "Виробництво": "Виробничі та промислові компанії",
                "Інше": "Різноманітні бізнеси та підприємства інших галузей"
            }
        };
        
        const currentDescriptions = descriptions[this.currentLang] || descriptions['uk'];
        let description = currentDescriptions[this.categoryInfo.name];
        
        if (!description) {
            description = this.currentLang === 'en' 
                ? `Businesses in the ${this.categoryInfo.name} industry`
                : `Бізнеси в галузі: ${this.categoryInfo.name}`;
        }
        
        return description;
    }

    // Локализованные тексты
    getLocalizedText(key) {
        if (this.currentLang === 'en') {
            switch(key) {
                case 'contact': return 'Contact';
                case 'clearFilters': return 'Clear filters';
                case 'found': return 'Found:';
                case 'filtering': return 'Filtering';
                case 'investment': return 'Investment search';
                case 'marketing': return 'Marketing cooperation';
                case 'partnership': return 'Partnership';
                case 'similar': return 'Similar businesses that might interest you';
                case 'business': return 'business';
                case 'businesses2': return 'businesses';
                case 'businesses5': return 'businesses';
                case 'noResults': return 'No results found for your filters';
                case 'tryChanging': return 'Try changing your filter parameters';
                default: return key;
            }
        } else {
            switch(key) {
                case 'contact': return "Зв'язатись";
                case 'clearFilters': return 'Очистити фільтри';
                case 'found': return 'Знайдено:';
                case 'filtering': return 'Фільтрування';
                case 'investment': return 'Пошук інвестицій';
                case 'marketing': return 'Маркетингова співпраця';
                case 'partnership': return 'Партнерство';
                case 'similar': return 'Схожі бізнеси, що можуть вас зацікавити';
                case 'business': return 'бізнес';
                case 'businesses2': return 'бізнеси';
                case 'businesses5': return 'бізнесів';
                case 'noResults': return 'За вашими фільтрами нічого не знайдено';
                case 'tryChanging': return 'Спробуйте змінити параметри фільтрування';
                default: return key;
            }
        }
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Настройка чекбоксов для фильтров (только для украинской версии)
        if (this.currentLang === 'uk') {
            this.setupCheckboxFilters('businessTypeBtn', 'businessTypeDropdown', 'businessType');
            this.setupCheckboxFilters('scaleBtn', 'scaleDropdown', 'scale');
            this.setupCheckboxFilters('geographyBtn', 'geographyDropdown', 'geography');
            this.setupCheckboxFilters('needsBtn', 'needsDropdown', 'needs');
        } else {
            // Для английской версии используем обычные дропдауны
            this.setupSimpleFilters('businessTypeBtn', 'businessTypeDropdown', 'businessType');
            this.setupSimpleFilters('scaleBtn', 'scaleDropdown', 'scale');
            this.setupSimpleFilters('geographyBtn', 'geographyDropdown', 'geography');
            this.setupSimpleFilters('needsBtn', 'needsDropdown', 'needs');
        }

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

    // Настройка чекбоксов для украинской версии
    setupCheckboxFilters(btnId, dropdownId, filterType) {
        const btn = document.getElementById(btnId);
        const dropdown = document.getElementById(dropdownId);

        if (!btn || !dropdown) return;

        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleDropdown(btn, dropdown);
        });

        const checkboxes = dropdown.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                e.stopPropagation();
                this.handleCheckboxChange(filterType, checkbox.value, checkbox.checked);
                this.updateFilterButton(btnId, filterType);
            });
        });

        dropdown.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    // Настройка простых фильтров для английской версии
    setupSimpleFilters(btnId, dropdownId, filterType) {
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
                
                this.selectSimpleFilterOption(btn, dropdown, value, text, filterType);
            }
        });
    }

    // Обработка простых фильтров
    selectSimpleFilterOption(btn, dropdown, value, text, filterType) {
        const filterText = btn.querySelector('.filter-text');
        if (filterText) {
            filterText.textContent = text;
        }

        dropdown.querySelectorAll('.filter-option').forEach(opt => {
            opt.classList.remove('selected');
        });
        dropdown.querySelector(`[data-value="${value}"]`).classList.add('selected');

        // Для простых фильтров устанавливаем одно значение
        this.currentFilters[filterType] = value ? [value] : [];
        this.applyFilters();
        this.closeAllDropdowns();
    }

    // Обработка изменений чекбоксов
    handleCheckboxChange(filterType, value, isChecked) {
        if (isChecked) {
            if (!this.currentFilters[filterType].includes(value)) {
                this.currentFilters[filterType].push(value);
            }
        } else {
            const index = this.currentFilters[filterType].indexOf(value);
            if (index > -1) {
                this.currentFilters[filterType].splice(index, 1);
            }
        }

        console.log(`Фильтр ${filterType}:`, this.currentFilters[filterType]);
        this.applyFilters();
    }

    // Обновление кнопки фильтра
    updateFilterButton(btnId, filterType) {
        const btn = document.getElementById(btnId);
        const countElement = btn.querySelector('.filter-count');
        const selectedCount = this.currentFilters[filterType].length;

        if (selectedCount > 0) {
            btn.classList.add('has-selections');
            if (countElement) {
                countElement.textContent = selectedCount;
                countElement.classList.add('visible');
            }
        } else {
            btn.classList.remove('has-selections');
            if (countElement) {
                countElement.classList.remove('visible');
            }
        }
    }

    // Переключение дропдауна
    toggleDropdown(btn, dropdown) {
        const isActive = btn.classList.contains('active');
        
        this.closeAllDropdowns();
        
        if (!isActive) {
            btn.classList.add('active');
            btn.parentElement.classList.add('active');
        }
    }

    // Закрытие всех дропдаунов
    closeAllDropdowns() {
        const activeDropdowns = document.querySelectorAll('.filter-dropdown.active');
        const activeBtns = document.querySelectorAll('.filter-btn.active');
        
        activeDropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        activeBtns.forEach(btn => btn.classList.remove('active'));
    }

    // Применение фильтров
    applyFilters() {
        console.log('🔍 Применяем фильтры...');
        console.log('- Фильтры:', this.currentFilters);
        console.log('- Исходных бизнесов:', this.allBusinesses.length);
        
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

        console.log('- Отфильтрованных бизнесов:', this.filteredBusinesses.length);

        this.currentPage = 1;
        this.renderBusinesses();
        this.renderPagination();
        this.updateResultsCount();
        
        console.log('✅ Фильтры применены');
    }

    // Рендеринг бизнесов
    renderBusinesses() {
        console.log('🎨 renderBusinesses вызван');
        
        const container = document.getElementById('branchContainer');
        const noResults = document.getElementById('branchNoResults');
        
        if (!container) {
            console.error('❌ Контейнер branchContainer не найден');
            return;
        }

        if (!this.filteredBusinesses || this.filteredBusinesses.length === 0) {
            console.warn('⚠️ Нет отфильтрованных бизнесов');
            
            if (!this.allBusinesses || this.allBusinesses.length === 0) {
                console.error('❌ Нет исходных данных бизнесов! Инициализируем...');
                this.initializeBusinessData();
            }
            
            this.applyFilters();
        }

        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const businessesToShow = this.filteredBusinesses.slice(startIndex, endIndex);

        console.log(`📊 Рендер бизнесов:`);
        console.log(`- Всего отфильтрованных: ${this.filteredBusinesses.length}`);
        console.log(`- Страница: ${this.currentPage}, на странице: ${this.itemsPerPage}`);
        console.log(`- К показу: ${businessesToShow.length}`);

        if (businessesToShow.length === 0) {
            const noDataMessage = this.currentLang === 'en' 
                ? 'No businesses to display' 
                : 'Нет бизнесов для отображения';
            
            container.innerHTML = `<div style="text-align: center; padding: 40px; color: #666;">${noDataMessage}</div>`;
            if (noResults) noResults.style.display = 'block';
            console.log('❌ Нет бизнесов для отображения');
            return;
        }

        if (noResults) noResults.style.display = 'none';

        container.innerHTML = '';
        
        const cardsHTML = businessesToShow.map(business => this.createBusinessCard(business)).join('');
        container.innerHTML = cardsHTML;

        const addedCards = container.querySelectorAll('.branch-block');
        console.log(`✅ Добавлено карточек в DOM: ${addedCards.length}`);
        
        if (addedCards.length === 0) {
            console.error('❌ КРИТИЧЕСКАЯ ОШИБКА: Карточки не добавились в DOM!');
            setTimeout(() => {
                this.forceRenderBusinesses();
            }, 100);
            return;
        }

        this.addBusinessCardEventListeners(container);
        console.log(`✅ Отрендерено ${businessesToShow.length} карточек бизнесов`);
    }

    // Создание карточки бизнеса
    createBusinessCard(business) {
        const needsIcons = {
            'investment': this.getLocalizedPath('./icons/branch-navigation-icon-1.svg'),
            'marketing': this.getLocalizedPath('./icons/branch-navigation-icon-2.svg'),
            'partnership': this.getLocalizedPath('./icons/branch-navigation-icon-3.svg'),
            'similar': this.getLocalizedPath('./icons/branch-navigation-icon-4.svg')
        };

        const needsTexts = {
            'investment': this.getLocalizedText('investment'),
            'marketing': this.getLocalizedText('marketing'),
            'partnership': this.getLocalizedText('partnership'),
            'similar': this.getLocalizedText('similar')
        };

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
                        ${this.getLocalizedText('contact')}
                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 14L14 1M14 1H1M14 1V14" stroke="#3B2F77" stroke-linecap="round" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
        `;
    }

    // Принудительный рендеринг бизнесов
    forceRenderBusinesses() {
        console.log('🔧 Принудительный рендеринг бизнесов');
        
        const container = document.getElementById('branchContainer');
        if (!container) {
            console.error('❌ Контейнер не найден для принудительного рендеринга');
            return;
        }
        
        if (this.filteredBusinesses.length === 0) {
            console.warn('⚠️ Нет отфильтрованных бизнесов для отображения');
            container.innerHTML = `<div style="text-align: center; padding: 40px; color: #666;">
                ${this.currentLang === 'en' ? 'No businesses to display' : 'Нет бизнесов для отображения'}
            </div>`;
            return;
        }
        
        container.innerHTML = '';
        
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const businessesToShow = this.filteredBusinesses.slice(startIndex, endIndex);
        
        console.log(`📋 К отображению: ${businessesToShow.length} бизнесов`);
        
        try {
            const cardsHTML = businessesToShow.map(business => {
                return this.createBusinessCard(business);
            }).join('');
            
            container.innerHTML = cardsHTML;
            
            const insertedCards = container.querySelectorAll('.branch-block');
            console.log(`✅ Вставлено карточек: ${insertedCards.length}`);
            
            if (insertedCards.length > 0) {
                this.addBusinessCardEventListeners(container);
            }
            
        } catch (error) {
            console.error('❌ Ошибка при создании карточек:', error);
            container.innerHTML = `<div style="text-align: center; padding: 40px; color: #ff0000;">
                ${this.currentLang === 'en' ? 'Error loading businesses' : 'Ошибка загрузки бизнесов'}
            </div>`;
        }
    }

    // Добавление обработчиков событий для карточек
    addBusinessCardEventListeners(container) {
        const contactButtons = container.querySelectorAll('.branch-contact-btn');
        contactButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const businessId = btn.getAttribute('data-business-id');
                this.handleContactClick(businessId);
            });
        });

        const needLinks = container.querySelectorAll('.need-link');
        needLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const need = link.getAttribute('data-need');
                const businessId = link.closest('.branch-block').getAttribute('data-business-id');
                this.handleNeedClick(need, businessId);
            });
        });
    }

    // Проверка рендеринга контента
    checkContentRendering() {
        const container = document.getElementById('branchContainer');
        
        if (!container) {
            console.error('❌ Контейнер #branchContainer не найден!');
            return;
        }
        
        const renderedCards = container.querySelectorAll('.branch-block');
        console.log(`📊 Проверка контента:`);
        console.log(`- Контейнер существует: ✅`);
        console.log(`- Отрендеренных карточек: ${renderedCards.length}`);
        console.log(`- Ожидалось карточек: ${Math.min(this.filteredBusinesses.length, this.itemsPerPage)}`);
        
        if (renderedCards.length === 0 && this.filteredBusinesses.length > 0) {
            console.warn('⚠️ Карточки не отрендерились, принудительный рендеринг...');
            this.forceRenderBusinesses();
        }
    }

    // Рендеринг пагинации
    renderPagination() {
        const container = document.getElementById('branchPagination');
        if (!container) return;

        const totalPages = Math.ceil(this.filteredBusinesses.length / this.itemsPerPage);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        if (totalPages <= 4) {
            for (let page = 1; page <= totalPages; page++) {
                paginationHTML += `
                    <div class="branch-pagination-block ${page === this.currentPage ? 'active' : ''}" 
                         data-page="${page}">
                        ${page}
                    </div>
                `;
            }
        } else {
            if (this.currentPage <= 3) {
                for (let page = 1; page <= 3; page++) {
                    paginationHTML += `
                        <div class="branch-pagination-block ${page === this.currentPage ? 'active' : ''}" 
                             data-page="${page}">
                            ${page}
                        </div>
                    `;
                }
                
                paginationHTML += `<div class="branch-pagination-block dots">...</div>`;
                
                paginationHTML += `
                    <div class="branch-pagination-block" data-page="${totalPages}">
                        ${totalPages}
                    </div>
                `;
            } else if (this.currentPage >= totalPages - 2) {
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
        
        const paginationButtons = container.querySelectorAll('.branch-pagination-block[data-page]');
        paginationButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const page = parseInt(btn.getAttribute('data-page'));
                
                if (page && page !== this.currentPage) {
                    this.goToPage(page);
                }
            });
        });
    }

    // Переход на страницу
    goToPage(page) {
        const totalPages = Math.ceil(this.filteredBusinesses.length / this.itemsPerPage);
        
        if (page < 1 || page > totalPages) {
            return;
        }
        
        this.currentPage = page;
        this.renderBusinesses();
        this.renderPagination();
        
        const branchSection = document.getElementById('branch-section');
        if (branchSection) {
            branchSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    // Обновление счетчика результатов
    updateResultsCount() {
        const countElement = document.getElementById('branchResultsCount');
        if (countElement) {
            const count = this.filteredBusinesses.length;
            let word;
            
            if (this.currentLang === 'en') {
                word = count === 1 ? this.getLocalizedText('business') : this.getLocalizedText('businesses2');
            } else {
                word = this.getPlural(count, 
                    this.getLocalizedText('business'), 
                    this.getLocalizedText('businesses2'), 
                    this.getLocalizedText('businesses5')
                );
            }
            
            countElement.textContent = `${this.getLocalizedText('found')} ${count} ${word}`;
        }
    }

    // Множественные формы для украинского языка
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

    // Очистка фильтров
    clearFilters() {
        this.currentFilters = {
            businessType: [],
            scale: [],
            geography: [],
            needs: []
        };

        // Для украинской версии очищаем чекбоксы
        if (this.currentLang === 'uk') {
            document.querySelectorAll('.filter-dropdown input[type="checkbox"]').forEach(checkbox => {
                checkbox.checked = false;
            });

            const buttons = [
                { id: 'businessTypeBtn', type: 'businessType' },
                { id: 'scaleBtn', type: 'scale' },
                { id: 'geographyBtn', type: 'geography' },
                { id: 'needsBtn', type: 'needs' }
            ];

            buttons.forEach(({ id, type }) => {
                this.updateFilterButton(id, type);
            });
        } else {
            // Для английской версии сбрасываем простые фильтры
            const regionBtn = document.getElementById('regionBtn');
            const businessFormBtn = document.getElementById('businessFormBtn');
            
            if (regionBtn) {
                regionBtn.querySelector('.filter-text').textContent = 'Region';
            }
            if (businessFormBtn) {
                businessFormBtn.querySelector('.filter-text').textContent = 'Business Form';
            }

            document.querySelectorAll('.filter-option.selected').forEach(option => {
                option.classList.remove('selected');
            });

            document.querySelectorAll('.filter-option[data-value=""]').forEach(option => {
                option.classList.add('selected');
            });
        }

        this.applyFilters();
        console.log('Фільтри очищені');
    }

    // Обработка клика по контакту
    handleContactClick(businessId) {
        const business = this.allBusinesses.find(b => b.id == businessId);
        if (business) {
            const message = this.currentLang === 'en'
                ? `Contact company "${business.name}"\nHere will be a contact form or contact information.`
                : `Связь с компанией "${business.name}"\nЗдесь будет форма для связи или контактная информация.`;
            
            alert(message);
        }
    }

    // Обработка клика по потребности
    handleNeedClick(need, businessId) {
        const business = this.allBusinesses.find(b => b.id == businessId);
        if (business) {
            const needTexts = this.currentLang === 'en' ? {
                'investment': 'Investment search',
                'marketing': 'Marketing cooperation',
                'partnership': 'Partnership',
                'similar': 'Similar businesses that might interest you'
            } : {
                'investment': 'Пошук інвестицій',
                'marketing': 'Маркетингова співпраця',
                'partnership': 'Партнерство',
                'similar': 'Схожі бізнеси, що можуть вас зацікавити'
            };

            const needText = needTexts[need] || need;

            if (business.needs.includes(need)) {
                if (need === 'similar') {
                    this.showSimilarBusinesses(businessId);
                } else {
                    this.showNeedDetails(need, businessId);
                }
            } else {
                const noNeedMessage = this.currentLang === 'en'
                    ? `Company "${business.name}" does not have "${needText}" need`
                    : `Компанія "${business.name}" не має потреби в "${needText}"`;
                alert(noNeedMessage);
            }
        }
    }

    // Показ похожих бизнесов
    showSimilarBusinesses(businessId) {
        const business = this.allBusinesses.find(b => b.id == businessId);
        if (business) {
            const similarBusinesses = this.allBusinesses.filter(b => 
                b.id !== business.id && 
                (b.businessType === business.businessType || 
                b.geography === business.geography ||
                b.scale === business.scale)
            );

            if (similarBusinesses.length > 0) {
                const names = similarBusinesses.slice(0, 3).map(b => b.name).join(', ');
                const message = this.currentLang === 'en'
                    ? `Similar businesses for "${business.name}":\n${names}`
                    : `Схожі бізнеси для "${business.name}":\n${names}`;
                alert(message);
            } else {
                const noSimilarMessage = this.currentLang === 'en'
                    ? `No similar businesses found for "${business.name}".`
                    : `Схожих бізнесів для "${business.name}" не знайдено.`;
                alert(noSimilarMessage);
            }
        }
    }

    // Показ деталей потребности
    showNeedDetails(need, businessId) {
        const business = this.allBusinesses.find(b => b.id == businessId);
        if (business) {
            const messages = this.currentLang === 'en' ? {
                'investment': `Company "${business.name}" is looking for investments.\nHere will be detailed information about investment opportunities.`,
                'marketing': `Company "${business.name}" is open for marketing cooperation.\nHere will be information about marketing proposals.`,
                'partnership': `Company "${business.name}" considers partnership proposals.\nHere will be information about partnership opportunities.`
            } : {
                'investment': `Компанія "${business.name}" шукає інвестиції.\nЗдесь буде детальна інформація про інвестиційні можливості.`,
                'marketing': `Компанія "${business.name}" відкрита для маркетингової співпраці.\nЗдесь буде інформація про маркетингові пропозиції.`,
                'partnership': `Компанія "${business.name}" розглядає партнерські пропозиції.\nЗдесь буде інформація про можливості партнерства.`
            };

            const defaultMessage = this.currentLang === 'en'
                ? 'Detailed information about this need.'
                : 'Детальна інформація про цю потребу.';

            alert(messages[need] || defaultMessage);
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
            category: this.categoryInfo,
            language: this.currentLang
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

// Отладочная функция
function debugBranchContent() {
    console.log('🔍 ОТЛАДКА КОНТЕНТА:');
    
    if (!window.branchManager) {
        console.error('❌ branchManager не найден в window');
        return;
    }
    
    const bm = window.branchManager;
    
    console.log('📊 Состояние BranchManager:');
    console.log('- Язык:', bm.currentLang);
    console.log('- Всего бизнесов:', bm.allBusinesses?.length || 0);
    console.log('- Отфильтрованных:', bm.filteredBusinesses?.length || 0);
    console.log('- Текущая страница:', bm.currentPage);
    
    const container = document.getElementById('branchContainer');
    console.log('📦 DOM состояние:');
    console.log('- Контейнер найден:', !!container);
    console.log('- Карточек в DOM:', container ? container.querySelectorAll('.branch-block').length : 0);
    
    if (bm.allBusinesses && bm.allBusinesses.length > 0) {
        console.log('📋 Первые 3 бизнеса:');
        bm.allBusinesses.slice(0, 3).forEach((business, index) => {
            console.log(`${index + 1}. ${business.name} (ID: ${business.id})`);
        });
    }
    
    console.log('🔧 Попытка принудительного рендеринга...');
    bm.forceRenderBusinesses();
}

// Добавляем функции в глобальную область для отладки
window.debugBranchContent = debugBranchContent;

// Экспорт для использования в других скриптах
window.BranchManager = BranchManager;

// ПОЛНАЯ ПОДДЕРЖКА БЛОГА ДЛЯ АНГЛИЙСКОЙ ВЕРСИИ 
setTimeout(() => {
    const blogSection = document.getElementById('blog-section');
    const currentLang = window.location.pathname.includes('/en/') ? 'en' : 'uk';
    
    if (blogSection) {
        // Всегда показываем секцию блога
        blogSection.style.display = 'block';
        blogSection.style.visibility = 'visible';
        blogSection.removeAttribute('hidden');
        
        // Обновляем заголовок в зависимости от языка
        const blogTitle = document.querySelector('.blog-title h4');
        if (blogTitle) {
            blogTitle.textContent = currentLang === 'en' 
                ? 'Events, initiatives and news' 
                : 'Події, ініціативи та новини';
            console.log('✅ Заголовок блога обновлен:', blogTitle.textContent);
        }
        
        // Создаем посты если BlogManager не инициализирован
        if (!window.blogManager) {
            console.log('📝 Создаем базовые посты для', currentLang);
            createBasicBlogPosts(currentLang);
        }
        
        console.log(`✅ Блог отображается для языка: ${currentLang}`);
    }
}, 1000);

// Функция создания базовых постов
function createBasicBlogPosts(lang) {
    const blogContainer = document.querySelector('.blog-container');
    if (!blogContainer) return;
    
    const posts = [
        {
            title: lang === 'en' 
                ? "We have been teaching micro, small and medium business owners since 2016"
                : "Ми навчаємо власників мікро-, малого та середнього бізнесу з 2016 року",
            image: lang === 'en' ? "../img/blog-img-1.png" : "./img/blog-img-1.png",
            date: "30.04.2025"
        },
        {
            title: lang === 'en'
                ? "Training for fast food restaurant owners from McDonald's"
                : "Тренінг для власників ресторанів фаст-фудів від МакДональдс",
            image: lang === 'en' ? "../img/blog-img-2.png" : "./img/blog-img-2.png",
            date: "30.04.2025"
        },
        {
            title: lang === 'en'
                ? "How to develop big business in wartime - training from METRO"
                : "Як розвивати великий бізнес в умовах війни - тренінг від МЕТРО",
            image: lang === 'en' ? "../img/blog-img-3.png" : "./img/blog-img-3.png",
            date: "30.04.2025"
        },
        {
            title: lang === 'en'
                ? "Digital transformation of small business: 5 steps to success"
                : "Цифрова трансформація малого бізнесу: 5 кроків до успіху",
            image: lang === 'en' ? "../img/blog-img-4.jpg" : "./img/blog-img-4.jpg",
            date: "29.04.2025"
        },
        {
            title: lang === 'en'
                ? "How to get government support for a startup in 2025"
                : "Як отримати державну підтримку для стартапу в 2025 році",
            image: lang === 'en' ? "../img/blog-img-5.jpg" : "./img/blog-img-5.jpg",
            date: "28.04.2025"
        },
        {
            title: lang === 'en'
                ? "Secrets of effective marketing for small business"
                : "Секрети ефективного маркетингу для малого бізнесу",
            image: lang === 'en' ? "../img/blog-img-6.jpg" : "./img/blog-img-6.jpg",
            date: "27.04.2025"
        }
    ];
    
    // Показываем первые 3 поста
    const postsToShow = posts.slice(0, 3);
    blogContainer.innerHTML = '';
    
    postsToShow.forEach((post, index) => {
        const postDiv = document.createElement('div');
        postDiv.className = 'blog-block';
        postDiv.style.cursor = 'pointer';
        
        postDiv.innerHTML = `
            <img src="${post.image}" 
                 alt="Blog image" 
                 width="422" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIyIiBoZWlnaHQ9IjI4MCIgZmlsbD0iI2Y1ZjVmNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDIyIiBoZWlnaHQ9IjI4MCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjIxMSIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            <h5>${post.title}</h5>
            <p>${post.date}</p>
        `;
        
        // Добавляем обработчик клика
        postDiv.addEventListener('click', () => {
            showSimpleModal(post, lang);
        });
        
        blogContainer.appendChild(postDiv);
    });
    
    // Создаем простую пагинацию
    createSimplePagination(posts, lang);
    
    console.log(`✅ Создано ${postsToShow.length} постов`);
}

// Простая пагинация
function createSimplePagination(allPosts, lang) {
    const paginationContainer = document.getElementById('blogPagination');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(allPosts.length / 3);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '';
    for (let page = 1; page <= totalPages; page++) {
        paginationHTML += `
            <div class="blog-pagination-block ${page === 1 ? 'active' : ''}" 
                 data-page="${page}" style="cursor: pointer;">
                ${page}
            </div>
        `;
    }
    
    paginationContainer.innerHTML = paginationHTML;
    
    // Добавляем обработчики для пагинации
    paginationContainer.querySelectorAll('[data-page]').forEach(btn => {
        btn.addEventListener('click', () => {
            const page = parseInt(btn.getAttribute('data-page'));
            showPagePosts(allPosts, page, lang);
            
            // Обновляем активную страницу
            paginationContainer.querySelectorAll('.blog-pagination-block').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
}

// Показ постов конкретной страницы
function showPagePosts(allPosts, page, lang) {
    const startIndex = (page - 1) * 3;
    const endIndex = startIndex + 3;
    const postsToShow = allPosts.slice(startIndex, endIndex);
    
    const blogContainer = document.querySelector('.blog-container');
    if (!blogContainer) return;
    
    blogContainer.innerHTML = '';
    
    postsToShow.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'blog-block';
        postDiv.style.cursor = 'pointer';
        
        postDiv.innerHTML = `
            <img src="${post.image}" 
                 alt="Blog image" 
                 width="422" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIyIiBoZWlnaHQ9IjI4MCIgZmlsbD0iI2Y1ZjVmNSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDIyIiBoZWlnaHQ9IjI4MCIgZmlsbD0iI2Y1ZjVmNSIvPjx0ZXh0IHg9IjIxMSIgeT0iMTUwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlPC90ZXh0Pjwvc3ZnPg=='">
            <h5>${post.title}</h5>
            <p>${post.date}</p>
        `;
        
        postDiv.addEventListener('click', () => {
            showSimpleModal(post, lang);
        });
        
        blogContainer.appendChild(postDiv);
    });
}

// Простое модальное окно
function showSimpleModal(post, lang) {
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
    `;
    
    modal.innerHTML = `
        <div style="background: white; border-radius: 12px; max-width: 600px; max-height: 80vh; overflow-y: auto; margin: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 20px; border-bottom: 1px solid #eee;">
                <h3 style="margin: 0;">${post.title}</h3>
                <button style="background: none; border: none; font-size: 24px; cursor: pointer; padding: 0; width: 30px; height: 30px;">&times;</button>
            </div>
            <div style="padding: 20px;">
                <img src="${post.image}" alt="Post image" style="width: 100%; border-radius: 8px; margin-bottom: 15px;">
                <p><strong>${lang === 'en' ? 'Date:' : 'Дата:'}</strong> ${post.date}</p>
                <p>${lang === 'en' ? 'Here will be the full text of the post...' : 'Тут буде повний текст поста...'}</p>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Обработчики закрытия
    const closeBtn = modal.querySelector('button');
    closeBtn.addEventListener('click', () => modal.remove());
    modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.remove();
    });
}
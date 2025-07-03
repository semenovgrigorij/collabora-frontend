// b2b-single.js - Функциональность страницы B2B сингла с поддержкой многоязычности

// Определение текущего языка
function getCurrentLanguage() {
    const currentPath = window.location.pathname;
    const langMatch = currentPath.match(/\/(en|uk)\//);
    const detectedLang = langMatch ? langMatch[1] : 'uk';
    
    console.log(`🌐 B2B Single: Определен язык ${detectedLang} из пути: ${currentPath}`);
    return detectedLang;
}

// Получение пути к странице с учетом языка
function getLocalizedPath(pageName) {
    const currentLang = getCurrentLanguage();
    
    if (currentLang === 'en') {
        // Для английской версии остаемся в папке /en/
        return `./${pageName}`;
    } else {
        // Для украинской версии остаемся в корне
        return `./${pageName}`;
    }
}

// Получение пути к ресурсам с учетом языка
function getResourcePath(resourcePath) {
    const currentLang = getCurrentLanguage();
    
    if (currentLang === 'en') {
        // Для английской версии идем на уровень выше
        return `../${resourcePath}`;
    } else {
        // Для украинской версии остаемся в корне
        return `./${resourcePath}`;
    }
}

// Локализованные тексты
function getLocalizedText(key) {
    const currentLang = getCurrentLanguage();
    
    const texts = {
        uk: {
            pageInitialized: 'B2B сингл страница инициализирована',
            functionalityLoaded: 'B2B сингл функциональность загружена',
            dataNotFound: 'Данные B2B элемента не найдены',
            clickByArrow: 'Клик по стрелке - пропускаем',
            clickByOffer: 'Клик по предложению с ID:',
            offerDataFound: 'Данные предложения найдены:',
            offerDataNotFound: 'Данные предложения не найдены для ID:',
            goToOfferPage: 'Переход на страницу предложения:',
            collaborationProposal: 'Предложение сотрудничества для:',
            initialRequest: 'Начальный запрос для:',
            lastUpdate: 'Останнє оновлення',
            participants: 'Учасників:',
            b2bPlatform: 'Майданчик B2B',
            published: 'Опубліковано',
            lookingForPartner: 'Шукаю партнера',
            offeringServices: 'Пропоную послуги',
            packaging: 'Пакування',
            metalworking: 'Металообробка',
            woodworking: 'Деревообробка',
            lvivRegion: 'Львівська область',
            kharkivRegion: 'Харківська область',
            kiev: 'Київ',
            lviv: 'Львів',
            kharkiv: 'Харків',
            odesa: 'Одеса',
            dnipro: 'Дніпро'
        },
        en: {
            pageInitialized: 'B2B single page initialized',
            functionalityLoaded: 'B2B single functionality loaded',
            dataNotFound: 'B2B item data not found',
            clickByArrow: 'Click on arrow - skipping',
            clickByOffer: 'Click on offer with ID:',
            offerDataFound: 'Offer data found:',
            offerDataNotFound: 'Offer data not found for ID:',
            goToOfferPage: 'Navigate to offer page:',
            collaborationProposal: 'Collaboration proposal for:',
            initialRequest: 'Initial request for:',
            lastUpdate: 'Last update',
            participants: 'Participants:',
            b2bPlatform: 'B2B Platform',
            published: 'Published',
            lookingForPartner: 'Looking for partner',
            offeringServices: 'Offering services',
            packaging: 'Packaging',
            metalworking: 'Metalworking',
            woodworking: 'Woodworking',
            lvivRegion: 'Lviv region',
            kharkivRegion: 'Kharkiv region',
            kiev: 'Kyiv',
            lviv: 'Lviv',
            kharkiv: 'Kharkiv',
            odesa: 'Odesa',
            dnipro: 'Dnipro'
        }
    };
    
    return texts[currentLang][key] || texts['uk'][key];
}

class B2BSinglePage {
    constructor() {
        this.currentItem = null;
        this.currentLang = getCurrentLanguage();
        this.init();
    }

    init() {
        this.loadItemData();
        this.setupActionButtons();
        this.renderPageContent();
        
        console.log(getLocalizedText('pageInitialized'));
    }

    // Обновление путей к ресурсам в элементе с учетом языка
    updateItemResourcePaths(item) {
        if (!item) return item;

        const updatedItem = { ...item };

        // Обновляем путь к основному изображению
        if (updatedItem.image) {
            const fileName = updatedItem.image.split('/').pop();
            updatedItem.image = getResourcePath(`icons/${fileName}`);
        }

        console.log(`🔄 Пути к ресурсам обновлены для элемента: ${updatedItem.title}`);
        console.log(`🖼️ Новый путь к изображению: ${updatedItem.image}`);

        return updatedItem;
    }

    // Загрузка данных элемента
    loadItemData() {
        // Пытаемся получить данные из sessionStorage
        const storedData = sessionStorage.getItem('currentB2BItem');
        if (storedData) {
            const rawItem = JSON.parse(storedData);
            
            // Обновляем пути к ресурсам с учетом текущего языка
            this.currentItem = this.updateItemResourcePaths(rawItem);
            
            return;
        }

        // Если нет данных в sessionStorage, пытаемся получить из URL
        const urlParams = new URLSearchParams(window.location.search);
        const itemId = urlParams.get('id');
        
        if (itemId) {
            // В реальном проекте здесь будет запрос к API
            // Пока что используем мок-данные
            this.currentItem = this.getMockItemById(itemId);
        }

        // Если данных все еще нет, перенаправляем обратно
        if (!this.currentItem) {
            console.warn(getLocalizedText('dataNotFound'));
            window.location.href = getLocalizedPath('b2b.html');
            return;
        }
    }

    // Мок-данные (в продакшене будет API запрос)
    getMockItemById(id) {
        // Базовые данные без путей к изображениям
        const mockDataBase = {
            1: {
                id: 1,
                title: this.currentLang === 'en' ? "Industry and Processing" : "Промисловість та переробка",
                lastUpdate: this.currentLang === 'en' ? "25 min. ago" : "25 хв. тому",
                participants: "4.1 тис",
                imageFileName: "b2b-img-1.svg", // Только имя файла
                businessType: ["production"],
                scale: ["large"],
                region: ["kyiv", "kharkiv"],
                status: ["partnership"],
                directions: this.currentLang === 'en' 
                    ? ["Metallurgy", "Chemical Industry", "Mechanical Engineering", "Raw Material Processing"]
                    : ["Металургія", "Хімічна промисловість", "Машинобудування", "Переробка сировини"],
                regionNames: this.currentLang === 'en' ? ["Kyiv", "Kharkiv"] : ["Київ", "Харків"]
            },
            2: {
                id: 2,
                title: this.currentLang === 'en' ? "Construction, Materials, Woodworking" : "Будівництво, матеріали, деревопереробка",
                lastUpdate: this.currentLang === 'en' ? "1 hour ago" : "1 год. тому",
                participants: "3.2 тис",
                imageFileName: "b2b-img-2.svg",
                businessType: ["production", "trade"],
                scale: ["medium", "large"],
                region: ["kyiv", "lviv"],
                status: ["investment", "partnership"],
                directions: this.currentLang === 'en' 
                    ? ["Building Materials", "Woodworking", "Design", "Construction"]
                    : ["Будівельні матеріали", "Деревообробка", "Проектування", "Будівництво"],
                regionNames: this.currentLang === 'en' ? ["Kyiv", "Lviv"] : ["Київ", "Львів"]
            },
            3: {
                id: 3,
                title: this.currentLang === 'en' ? "Agriculture and Food Industry" : "Агро і харчова промисловість",
                lastUpdate: this.currentLang === 'en' ? "2 hours ago" : "2 год. тому",
                participants: "2.8 тис",
                imageFileName: "b2b-img-3.svg",
                businessType: ["production"],
                scale: ["small", "medium"],
                region: ["kyiv", "odesa", "dnipro"],
                status: ["marketing", "similar"],
                directions: this.currentLang === 'en' 
                    ? ["Agriculture", "Food Industry", "Organic Production", "Processing"]
                    : ["Сільське господарство", "Харчова промисловість", "Органічне виробництво", "Переробка"],
                regionNames: this.currentLang === 'en' ? ["Kyiv", "Odesa", "Dnipro"] : ["Київ", "Одеса", "Дніпро"]
            },
            4: {
                id: 4,
                title: this.currentLang === 'en' ? "Energy" : "Енергетика",
                lastUpdate: this.currentLang === 'en' ? "3 hours ago" : "3 год. тому",
                participants: "1.9 тис",
                imageFileName: "b2b-img-4.svg",
                businessType: ["technology", "services"],
                scale: ["large"],
                region: ["kyiv", "kharkiv", "dnipro"],
                status: ["investment"],
                directions: this.currentLang === 'en' 
                    ? ["Renewable Energy", "Energy Efficiency", "Energy Equipment", "Alternative Sources"]
                    : ["Відновлювана енергетика", "Енергоефективність", "Енергетичне обладнання", "Альтернативні джерела"],
                regionNames: this.currentLang === 'en' ? ["Kyiv", "Kharkiv", "Dnipro"] : ["Київ", "Харків", "Дніпро"]
            },
            5: {
                id: 5,
                title: this.currentLang === 'en' ? "IT and Telecommunications" : "IT та телекомунікації",
                lastUpdate: this.currentLang === 'en' ? "4 hours ago" : "4 год. тому",
                participants: "5.5 тис",
                imageFileName: "b2b-img-5.svg",
                businessType: ["technology", "services"],
                scale: ["small", "medium"],
                region: ["kyiv", "lviv", "kharkiv"],
                status: ["partnership", "marketing"],
                directions: this.currentLang === 'en' 
                    ? ["Software Development", "Telecommunications", "Cybersecurity", "Artificial Intelligence"]
                    : ["Розробка ПЗ", "Телекомунікації", "Кібербезпека", "Штучний інтелект"],
                regionNames: this.currentLang === 'en' ? ["Kyiv", "Lviv", "Kharkiv"] : ["Київ", "Львів", "Харків"]
            }
        };

        const baseData = mockDataBase[id];
        if (!baseData) return null;

        // Добавляем правильный путь к изображению с учетом текущего языка
        const itemData = {
            ...baseData,
            image: getResourcePath(`icons/${baseData.imageFileName}`)
        };

        console.log(`🖼️ Создан элемент ID ${id} с изображением: ${itemData.image}`);
        
        return itemData;
    }

    // Настройка кнопок действий
    setupActionButtons() {
        const primaryBtn = document.querySelector('.action-btn.primary');
        const secondaryBtn = document.querySelector('.action-btn.secondary');

        if (primaryBtn) {
            primaryBtn.addEventListener('click', () => {
                this.handleCollaborationProposal();
            });
        }

        if (secondaryBtn) {
            secondaryBtn.addEventListener('click', () => {
                this.handleInitialRequest();
            });
        }
    }

    // Рендеринг контента страницы
    renderPageContent() {
        if (!this.currentItem) return;

        // Обновляем заголовок страницы
        document.title = `${this.currentItem.title} - Collabora`;

        // Обновляем хлебные крошки через BreadcrumbsManager
        this.updateBreadcrumbs();

        // Обновляем основной контент
        this.updateMainContent();
        this.renderOffers();
        this.setupOfferClickHandlers();
    }

    // Обновление хлебных крошек
    updateBreadcrumbs() {
        setTimeout(() => {
            if (window.breadcrumbsManager) {
                const b2bUrl = getLocalizedPath('b2b.html');
                
                window.breadcrumbsManager.buildBreadcrumbs([
                    { title: getLocalizedText('b2bPlatform'), href: b2bUrl },
                    { title: this.currentItem.title, href: null }
                ]);
                
                console.log('🍞 Хлебные крошки обновлены для b2b-single.html');
            }
        }, 100);
    }

    // Обновление основного контента
    updateMainContent() {
        const elements = {
            singleImage: document.getElementById('singleImage'),
            singleTitle: document.getElementById('singleTitle'),
            singleUpdate: document.getElementById('singleUpdate'),
            singleParticipants: document.getElementById('singleParticipants')
        };

        if (elements.singleImage) {
            elements.singleImage.src = this.currentItem.image;
            elements.singleImage.alt = `${this.currentItem.title} Logo`;
            
            // Добавляем обработчик ошибки загрузки
            elements.singleImage.onerror = () => {
                console.error(`❌ Ошибка загрузки изображения: ${this.currentItem.image}`);
                console.log(`🔍 Текущий язык: ${this.currentLang}`);
                console.log(`🔍 Ожидаемый путь: ${this.currentItem.image}`);
                
                // Создаем простое SVG изображение как fallback
                const fallbackSvg = 'data:image/svg+xml;base64,' + btoa(`
                    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
                        <rect width="100" height="100" fill="#e0e0e0" stroke="#ccc" stroke-width="2"/>
                        <text x="50" y="40" text-anchor="middle" font-family="Arial" font-size="12" fill="#666">IMG</text>
                        <text x="50" y="60" text-anchor="middle" font-family="Arial" font-size="10" fill="#999">404</text>
                    </svg>
                `);
                
                elements.singleImage.src = fallbackSvg;
                console.log('🔧 Установлено fallback изображение');
            };
            
            console.log(`🖼️ Устанавливаем изображение: ${this.currentItem.image}`);
        }

        if (elements.singleTitle) {
            elements.singleTitle.textContent = this.currentItem.title;
        }

        if (elements.singleUpdate) {
            elements.singleUpdate.textContent = `${getLocalizedText('lastUpdate')} ${this.currentItem.lastUpdate}`;
        }

        if (elements.singleParticipants) {
            elements.singleParticipants.textContent = `${getLocalizedText('participants')} ${this.currentItem.participants}`;
        }
    }

    // Рендеринг предложений
    renderOffers() {
        const container = document.querySelector('.single-content-wrapper');
        if (!container) return;

        // Мок-данные предложений для этой категории
        const offers = this.getMockOffers();
        
        container.innerHTML = offers.map(offer => this.createOfferHTML(offer)).join('');
    }

    // Мок-данные предложений
    getMockOffers() {
        // Возвращаем разные предложения в зависимости от категории и языка
        const categoryOffers = {
            1: [ // Промисловість та переробка / Industry and Processing
                {
                    id: 1,
                    title: this.currentLang === 'en' 
                        ? "Bulk product packaging services" 
                        : "Пропоную послуги фасування сипучих продуктів",
                    description: this.currentLang === 'en'
                        ? "We provide bulk material packaging services in packages from 100g to 10kg. We work with food and non-food products. Production facility meets HACCP requirements. Individual approach to each partner."
                        : "Надаємо послуги фасування сипучих матеріалів у пакування від 100 г до 10 кг. Працюємо з харчовими та нехарчовими продуктами. Виробничий цех відповідає вимогам HACCP. Індивідуальний підхід до кожного партнера.",
                    author: {
                        name: this.currentLang === 'en' ? "Dmytro" : "Дмитро",
                        company: this.currentLang === 'en' ? "Agropack-Service LLC" : "ТОВ «Агропак-Сервіс»",
                        avatar: getResourcePath("icons/single-logo.svg"),
                        isVerified: true
                    },
                    region: getLocalizedText('lvivRegion'),
                    publishDate: "18.05.2025",
                    category: getLocalizedText('lookingForPartner'),
                    industry: getLocalizedText('packaging')
                },
                {
                    id: 2,
                    title: this.currentLang === 'en' 
                        ? "Metalworking and parts manufacturing" 
                        : "Металообробка та виготовлення деталей",
                    description: this.currentLang === 'en'
                        ? "Professional metalworking on modern equipment. We manufacture parts according to customer drawings. Accuracy up to 0.1 mm. Execution time from 3 days."
                        : "Професійна металообробка на сучасному обладнанні. Виготовляємо деталі за кресленнями замовника. Точність до 0.1 мм. Терміни виконання від 3 днів.",
                    author: {
                        name: this.currentLang === 'en' ? "Oleksandr" : "Олександр",
                        company: this.currentLang === 'en' ? "Metalprom" : "Металпром",
                        avatar: getResourcePath("icons/single-logo.svg"),
                        isVerified: true
                    },
                    region: getLocalizedText('kharkivRegion'),
                    publishDate: "17.05.2025",
                    category: getLocalizedText('offeringServices'),
                    industry: getLocalizedText('metalworking')
                }
            ],
            2: [ // Будівництво, матеріали, деревопереробка / Construction, Materials, Woodworking
                {
                    id: 5,
                    title: this.currentLang === 'en' 
                        ? "Natural wood furniture manufacturing" 
                        : "Виготовлення меблів з натурального дерева",
                    description: this.currentLang === 'en'
                        ? "Individual furniture manufacturing from oak, ash, pine solid wood. Full cycle from design to installation. 5-year warranty."
                        : "Індивідуальне виготовлення меблів з масиву дуба, ясена, сосни. Повний цикл від проектування до встановлення. Гарантія 5 років.",
                    author: {
                        name: this.currentLang === 'en' ? "Mykhailo" : "Михайло",
                        company: this.currentLang === 'en' ? "Wooden House" : "Деревяний дім",
                        avatar: getResourcePath("icons/single-logo.svg"),
                        isVerified: true
                    },
                    region: getLocalizedText('lvivRegion'),
                    publishDate: "18.05.2025",
                    category: getLocalizedText('offeringServices'),
                    industry: getLocalizedText('woodworking')
                }
            ]
        };

        // Возвращаем предложения для текущей категории или дефолтные
        return categoryOffers[this.currentItem?.id] || categoryOffers[1];
    }

    // Создание HTML для предложения
    createOfferHTML(offer) {
        const publishedText = getLocalizedText('published');
        const verifiedIcon = getResourcePath("icons/single-verified.svg");
        const markerIcon = getResourcePath("icons/single-marker.svg");
        const arrowIcon = getResourcePath("icons/arrow-title.svg");
        const arrowHoverIcon = getResourcePath("icons/arrow-title-hover.svg");
        
        // Исправляем путь к аватару - используем уже обработанный путь из offer.author.avatar
        const avatarPath = offer.author.avatar;
        
        return `
            <div class="single-content-block" data-offer-id="${offer.id}" style="cursor: pointer;">
                <div class="single-content-block-top">
                    <div class="single-content-block-title">
                        <img src="${avatarPath}" alt="Logo" width="45" onerror="console.error('Ошибка загрузки аватара:', this.src)">
                        <div class="name-varifed-company">
                            <div class="name-varifed">
                                <h2>${offer.author.name}</h2>
                                ${offer.author.isVerified ? `<img src="${verifiedIcon}" alt="verified icon" width="108" onerror="console.error('Ошибка загрузки иконки verified:', this.src)">` : ''}
                            </div>
                            <p class="name-company">${offer.author.company}</p>
                        </div>
                    </div>
                    <a href="#" class="single-content-block-arrow" onclick="event.stopPropagation();">
                        <img class="arrow-card" src="${arrowIcon}" alt="arrow" width="14" onerror="console.error('Ошибка загрузки стрелки:', this.src)">
                        <img class="arrow-card-hover" src="${arrowHoverIcon}" alt="arrow" width="14" onerror="console.error('Ошибка загрузки стрелки hover:', this.src)">
                    </a>
                </div>
                <div class="single-content-block-middle">
                    <img src="${markerIcon}" alt="Marker" width="20" onerror="console.error('Ошибка загрузки маркера:', this.src)">
                    <p>${offer.region}</p>
                    <p>${publishedText} ${offer.publishDate}</p>
                </div>
                <div class="single-content-block-bottom">
                    <h3>${offer.title}</h3>
                    <p>${offer.description}</p>
                </div>
            </div>
        `;
    }

    // Настройка обработчиков кликов по предложениям
    setupOfferClickHandlers() {
        const container = document.querySelector('.single-content-wrapper');
        if (!container) return;

        container.addEventListener('click', (e) => {
            const offerBlock = e.target.closest('.single-content-block');
            if (!offerBlock) return;

            // Проверяем, что клик не по ссылке-стрелке
            if (e.target.closest('.single-content-block-arrow')) {
                console.log(getLocalizedText('clickByArrow'));
                return;
            }

            const offerId = offerBlock.getAttribute('data-offer-id');
            console.log(getLocalizedText('clickByOffer'), offerId);
            
            const offerData = this.getMockOffers().find(offer => offer.id == offerId);
            
            if (offerData) {
                console.log(getLocalizedText('offerDataFound'), offerData);
                this.navigateToOfferPage(offerData);
            } else {
                console.error(getLocalizedText('offerDataNotFound'), offerId);
            }
        });
    }

    // Переход на страницу предложения
    navigateToOfferPage(offerData) {
        // Создаем расширенные данные для страницы предложения
        const expandedOfferData = {
            id: offerData.id,
            title: offerData.title,
            category: offerData.category,
            industry: offerData.industry,
            region: offerData.region,
            publishDate: offerData.publishDate,
            description: this.getFullDescription(offerData.id),
            author: {
                id: 100 + offerData.id,
                name: offerData.author.name,
                company: offerData.author.company,
                avatar: offerData.author.avatar,
                isOnline: true,
                isVerified: offerData.author.isVerified
            }
        };

        // Сохраняем данные в sessionStorage
        sessionStorage.setItem('currentOffer', JSON.stringify(expandedOfferData));
        
        console.log(`${getLocalizedText('goToOfferPage')}: ${offerData.title}`);
        
        // Переходим на страницу предложения с учетом языка
        window.location.href = getLocalizedPath('offer.html');
    }

    // Получение полного описания для конкретного предложения
    getFullDescription(offerId) {
        const descriptions = {
            uk: {
                1: `Компанія ТОВ «Агропак-Сервіс» пропонує послуги з фасування сипучих матеріалів у споживчу упаковку. Надаємо повний цикл робіт — від прийому сировини до нанесення етикеток і формування готових партій для реалізації. Наші потужності дозволяють фасувати продукти в пакети, мішки або дойпаки об'ємом від 100 грамів до 10 кілограмів.

Ми працюємо з різними видами продукції:
• харчові: крупи, спеції, цукор, сіль, борошно
• технічні: мінеральні суміші, будівельні добавки
• зоотовари: комбікорми, кормові добавки, тирса

Цехи обладнані відповідно до вимог HACCP, є сертифікати якості. Кожен етап контролюється — від зважування до герметичного запаювання.

Додаткові можливості:
• нанесення логотипу або штрихкоду
• маркування за вимогами замовника
• короткі терміни виконання замовлення
• допомога з логістикою`,

                2: `Компанія «Металпром» спеціалізується на високоточній металообробці та виготовленні деталей за індивідуальними кресленнями. Використовуємо сучасне обладнання з ЧПУ для забезпечення максимальної точності.

Наші послуги:
• токарні роботи (точність до 0.1 мм)
• фрезерні роботи
• свердління та розвертання отворів
• шліфування поверхонь

Ми працюємо з різними видами металів: сталь, алюміній, латунь, бронза. Можливе виготовлення як одиничних деталей, так і серійного виробництва. Контроль якості на всіх етапах виробництва.`,

                5: `Майстерня «Деревяний дім» спеціалізується на виготовленні ексклюзивних меблів з натурального дерева. Ми працюємо виключно з якісною деревиною, дотримуючись традиційних технологій та сучасних стандартів.

Наші послуги:
• індивідуальне проектування меблів
• виготовлення з масиву дуба, ясена, сосни
• реставрація антикварних меблів
• обробка екологічними лаками та маслами

Кожен виріб виготовляється вручну досвідченими майстрами. Гарантуємо високу якість, довговічність та унікальність кожного виробу. Повний цикл від ескізу до встановлення.`
            },
            en: {
                1: `Agropack-Service LLC offers bulk material packaging services for consumer packaging. We provide a full cycle of work - from raw material reception to labeling and formation of finished batches for sale. Our facilities allow packaging products in bags, sacks or doy-packs with volumes from 100 grams to 10 kilograms.

We work with various types of products:
• food products: cereals, spices, sugar, salt, flour
• technical: mineral mixtures, construction additives
• pet products: compound feeds, feed additives, sawdust

Workshops are equipped in accordance with HACCP requirements, quality certificates are available. Each stage is controlled - from weighing to hermetic sealing.

Additional features:
• logo or barcode application
• marking according to customer requirements
• short order execution time
• logistics assistance`,

                2: `Metalprom company specializes in high-precision metalworking and manufacturing of parts according to individual drawings. We use modern CNC equipment to ensure maximum accuracy.

Our services:
• turning work (accuracy up to 0.1 mm)
• milling work
• drilling and reaming holes
• surface grinding

We work with various types of metals: steel, aluminum, brass, bronze. It is possible to manufacture both individual parts and serial production. Quality control at all stages of production.`,

                5: `Wooden House workshop specializes in manufacturing exclusive furniture from natural wood. We work exclusively with quality wood, following traditional technologies and modern standards.

Our services:
• individual furniture design
• manufacturing from oak, ash, pine solid wood
• antique furniture restoration
• treatment with eco-friendly varnishes and oils

Each product is handmade by experienced craftsmen. We guarantee high quality, durability and uniqueness of each product. Full cycle from sketch to installation.`
            }
        };
        
        return descriptions[this.currentLang][offerId] || descriptions[this.currentLang][1]; // Fallback на первое описание
    }

    // Обработка предложения сотрудничества
    handleCollaborationProposal() {
        console.log(getLocalizedText('collaborationProposal'), this.currentItem.title);
        
        // В реальном проекте здесь будет переход на форму add-request.html с учетом языка
        window.location.href = getLocalizedPath('add-request.html');
    }

    // Обработка начального запроса
    handleInitialRequest() {
        console.log(getLocalizedText('initialRequest'), this.currentItem.title);
        
        // В реальном проекте здесь будет переход на форму add-request.html с учетом языка
        window.location.href = getLocalizedPath('add-request.html');
    }

    // Отладочная информация
    getDebugInfo() {
        return {
            currentItem: this.currentItem,
            language: this.currentLang,
            resourcePaths: {
                sampleImage: getResourcePath("icons/b2b-img-1.svg"),
                sampleIcon: getResourcePath("icons/single-logo.svg")
            },
            localizedPaths: {
                b2bPage: getLocalizedPath('b2b.html'),
                addRequestPage: getLocalizedPath('add-request.html'),
                offerPage: getLocalizedPath('offer.html')
            },
            breadcrumbsManager: !!window.breadcrumbsManager
        };
    }

    // Публичные методы
    getCurrentItem() {
        return this.currentItem;
    }

    // Переключение языка (для случаев динамической смены языка)
    setLanguage(lang) {
        this.currentLang = lang;
        this.renderPageContent();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.b2bSinglePage = new B2BSinglePage();
    console.log(getLocalizedText('functionalityLoaded'));
});

// Экспорт для использования в других скриптах
window.B2BSinglePage = B2BSinglePage;
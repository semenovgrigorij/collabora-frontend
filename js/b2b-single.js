// b2b-single.js - Функциональность страницы B2B сингла

class B2BSinglePage {
    constructor() {
        this.currentItem = null;
        this.init();
    }

    init() {
        this.loadItemData();
        this.setupActionButtons();
        this.renderPageContent();
        
        console.log('B2B сингл страница инициализирована');
    }

    // Загрузка данных элемента
    loadItemData() {
        // Пытаемся получить данные из sessionStorage
        const storedData = sessionStorage.getItem('currentB2BItem');
        if (storedData) {
            this.currentItem = JSON.parse(storedData);
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
            console.warn('Данные B2B элемента не найдены');
            window.location.href = './b2b.html';
            return;
        }
    }

    // Мок-данные (в продакшене будет API запрос)
    getMockItemById(id) {
        const mockData = {
            1: {
                id: 1,
                title: "Промисловість та переробка",
                lastUpdate: "25 хв. тому",
                participants: "4.1 тис",
                image: "./icons/b2b-img-1.svg",
                businessType: ["production"],
                scale: ["large"],
                region: ["kyiv", "kharkiv"],
                status: ["partnership"],
                directions: ["Металургія", "Хімічна промисловість", "Машинобудування", "Переробка сировини"],
                regionNames: ["Київ", "Харків"]
            },
            2: {
                id: 2,
                title: "Будівництво, матеріали, деревопереробка",
                lastUpdate: "1 год. тому",
                participants: "3.2 тис",
                image: "./icons/b2b-img-2.svg",
                businessType: ["production", "trade"],
                scale: ["medium", "large"],
                region: ["kyiv", "lviv"],
                status: ["investment", "partnership"],
                directions: ["Будівельні матеріали", "Деревообробка", "Проектування", "Будівництво"],
                regionNames: ["Київ", "Львів"]
            },
            3: {
                id: 3,
                title: "Агро і харчова промисловість",
                lastUpdate: "2 год. тому",
                participants: "2.8 тис",
                image: "./icons/b2b-img-3.svg",
                businessType: ["production"],
                scale: ["small", "medium"],
                region: ["kyiv", "odesa", "dnipro"],
                status: ["marketing", "similar"],
                directions: ["Сільське господарство", "Харчова промисловість", "Органічне виробництво", "Переробка"],
                regionNames: ["Київ", "Одеса", "Дніпро"]
            },
            4: {
                id: 4,
                title: "Енергетика",
                lastUpdate: "3 год. тому",
                participants: "1.9 тис",
                image: "./icons/b2b-img-4.svg",
                businessType: ["technology", "services"],
                scale: ["large"],
                region: ["kyiv", "kharkiv", "dnipro"],
                status: ["investment"],
                directions: ["Відновлювана енергетика", "Енергоефективність", "Енергетичне обладнання", "Альтернативні джерела"],
                regionNames: ["Київ", "Харків", "Дніпро"]
            },
            5: {
                id: 5,
                title: "IT та телекомунікації",
                lastUpdate: "4 год. тому",
                participants: "5.5 тис",
                image: "./icons/b2b-img-5.svg",
                businessType: ["technology", "services"],
                scale: ["small", "medium"],
                region: ["kyiv", "lviv", "kharkiv"],
                status: ["partnership", "marketing"],
                directions: ["Розробка ПЗ", "Телекомунікації", "Кібербезпека", "Штучний інтелект"],
                regionNames: ["Київ", "Львів", "Харків"]
            }
        };

        return mockData[id] || null;
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

        // Обновляем хлебные крошки
        const currentPageTitle = document.getElementById('currentPageTitle');
        if (currentPageTitle) {
            currentPageTitle.textContent = this.currentItem.title;
        }

        // Обновляем основной контент
        this.updateMainContent();
        this.renderOffers();
        this.setupOfferClickHandlers();
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
        }

        if (elements.singleTitle) {
            elements.singleTitle.textContent = this.currentItem.title;
        }

        if (elements.singleUpdate) {
            elements.singleUpdate.textContent = `Останнє оновлення ${this.currentItem.lastUpdate}`;
        }

        if (elements.singleParticipants) {
            elements.singleParticipants.textContent = `Учасників: ${this.currentItem.participants}`;
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
        // Возвращаем разные предложения в зависимости от категории
        const categoryOffers = {
            1: [ // Промисловість та переробка
                {
                    id: 1,
                    title: "Пропоную послуги фасування сипучих продуктів",
                    description: "Надаємо послуги фасування сипучих матеріалів у пакування від 100 г до 10 кг. Працюємо з харчовими та нехарчовими продуктами. Виробничий цех відповідає вимогам HACCP. Індивідуальний підхід до кожного партнера.",
                    author: {
                        name: "Дмитро",
                        company: "ТОВ «Агропак-Сервіс»",
                        avatar: "./icons/single-logo.svg",
                        isVerified: true
                    },
                    region: "Львівська область",
                    publishDate: "18.05.2025",
                    category: "Шукаю партнера",
                    industry: "Пакування"
                },
                {
                    id: 2,
                    title: "Металообробка та виготовлення деталей",
                    description: "Професійна металообробка на сучасному обладнанні. Виготовляємо деталі за кресленнями замовника. Точність до 0.1 мм. Терміни виконання від 3 днів.",
                    author: {
                        name: "Олександр",
                        company: "Металпром",
                        avatar: "./icons/single-logo.svg",
                        isVerified: true
                    },
                    region: "Харківська область",
                    publishDate: "17.05.2025",
                    category: "Пропоную послуги",
                    industry: "Металообробка"
                },
                {
                    id: 3,
                    title: "Шукаю постачальника металу для виготовлення каркасів",
                    description: "Шукаємо надійного постачальника чорного та нержавіючого металу для виготовлення каркасних конструкцій. Обсяги – до 10 тонн щомісяця.",
                    author: {
                        name: "Іван",
                        company: "БудКонструкції",
                        avatar: "./icons/single-logo.svg",
                        isVerified: true
                    },
                    region: "Дніпропетровська область",
                    publishDate: "16.05.2025",
                    category: "Шукаю постачальника",
                    industry: "Металургія"
                },
                {
                    id: 4,
                    title: "Послуги з термообробки металу",
                    description: "Надаємо послуги термообробки металевих виробів. Загартування, відпуск, нормалізація. Сучасне обладнання та контроль якості.",
                    author: {
                        name: "Петро",
                        company: "ТермоТех",
                        avatar: "./icons/single-logo.svg",
                        isVerified: false
                    },
                    region: "Київська область",
                    publishDate: "15.05.2025",
                    category: "Пропоню послуги",
                    industry: "Металообробка"
                }
            ],
            2: [ // Будівництво, матеріали, деревопереробка
                {
                    id: 5,
                    title: "Виготовлення меблів з натурального дерева",
                    description: "Індивідуальне виготовлення меблів з масиву дуба, ясена, сосни. Повний цикл від проектування до встановлення. Гарантія 5 років.",
                    author: {
                        name: "Михайло",
                        company: "Деревяний дім",
                        avatar: "./icons/single-logo.svg",
                        isVerified: true
                    },
                    region: "Львівська область",
                    publishDate: "18.05.2025",
                    category: "Пропоную послуги",
                    industry: "Деревообробка"
                },
                {
                    id: 6,
                    title: "Пошук підрядника для будівництва складу",
                    description: "Шукаємо підрядника для будівництва складського комплексу площею 2000 м². Потрібен повний цикл робіт від фундаменту до здачі під ключ.",
                    author: {
                        name: "Андрій",
                        company: "Логістик Центр",
                        avatar: "./icons/single-logo.svg",
                        isVerified: true
                    },
                    region: "Київська область",
                    publishDate: "17.05.2025",
                    category: "Шукаю підрядника",
                    industry: "Будівництво"
                }
            ]
        };

        // Возвращаем предложения для текущей категории или дефолтные
        return categoryOffers[this.currentItem?.id] || categoryOffers[1];
    }

    // Создание HTML для предложения
    createOfferHTML(offer) {
        return `
            <div class="single-content-block" data-offer-id="${offer.id}" style="cursor: pointer;">
                <div class="single-content-block-top">
                    <div class="single-content-block-title">
                        <img src="${offer.author.avatar}" alt="Logo" width="45">
                        <div class="name-varifed-company">
                            <div class="name-varifed">
                                <h2>${offer.author.name}</h2>
                                ${offer.author.isVerified ? '<img src="./icons/single-verified.svg" alt="verified icon" width="108">' : ''}
                            </div>
                            <p class="name-company">${offer.author.company}</p>
                        </div>
                    </div>
                    <a href="#" class="single-content-block-arrow" onclick="event.stopPropagation();">
                        <img class="arrow-card" src="./icons/arrow-title.svg" alt="arrow" width="14">
                        <img class="arrow-card-hover" src="./icons/arrow-title-hover.svg" alt="arrow" width="14">
                    </a>
                </div>
                <div class="single-content-block-middle">
                    <img src="./icons/single-marker.svg" alt="Marker" width="20">
                    <p>${offer.region}</p>
                    <p>Опубліковано ${offer.publishDate}</p>
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
                console.log('Клик по стрелке - пропускаем');
                return;
            }

            const offerId = offerBlock.getAttribute('data-offer-id');
            console.log('Клик по предложению с ID:', offerId);
            
            const offerData = this.getMockOffers().find(offer => offer.id == offerId);
            
            if (offerData) {
                console.log('Данные предложения найдены:', offerData);
                this.navigateToOfferPage(offerData);
            } else {
                console.error('Данные предложения не найдены для ID:', offerId);
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
        
        console.log(`Переход на страницу предложения: ${offerData.title}`);
        
        // Переходим на страницу предложения
        window.location.href = './offer.html';
    }

    // Получение полного описания для конкретного предложения
    getFullDescription(offerId) {
        const descriptions = {
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

            3: `Наша компанія «БудКонструкції» займається виготовленням металевих каркасних конструкцій для промислових об'єктів. Шукаємо надійного постачальника чорного та нержавіючого металу з можливістю регулярних поставок.

Наші вимоги:
• якісний метал згідно з ДСТУ
• стабільні обсяги поставок до 10 тонн щомісяця
• конкурентні ціни
• можливість доставки до наших виробничих потужностей

Готові до довгострокової співпраці з перевіреними постачальниками. Маємо досвід роботи з великими обсягами та готові обговорити взаємовигідні умови співпраці.`,

            5: `Майстерня «Деревяний дім» спеціалізується на виготовленні ексклюзивних меблів з натурального дерева. Ми працюємо виключно з якісною деревиною, дотримуючись традиційних технологій та сучасних стандартів.

Наші послуги:
• індивідуальне проектування меблів
• виготовлення з масиву дуба, ясена, сосни
• реставрація антикварних меблів
• обробка екологічними лаками та маслами

Кожен виріб виготовляється вручну досвідченими майстрами. Гарантуємо високу якість, довговічність та унікальність кожного виробу. Повний цикл від ескізу до встановлення.`
        };
        
        return descriptions[offerId] || descriptions[1]; // Fallback на перше описання
    }

    // Обработка предложения сотрудничества
    handleCollaborationProposal() {
        console.log('Предложение сотрудничества для:', this.currentItem.title);
        
        // В реальном проекте здесь будет переход на форму add-request.html
        window.location.href = './add-request.html';
    }

    // Обработка начального запроса
    handleInitialRequest() {
        console.log('Начальный запрос для:', this.currentItem.title);
        
        // В реальном проекте здесь будет переход на форму add-request.html
        window.location.href = './add-request.html';
    }

    // Публичные методы
    getCurrentItem() {
        return this.currentItem;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.b2bSinglePage = new B2BSinglePage();
    console.log('B2B сингл функциональность загружена');
});

// Экспорт для использования в других скриптах
window.B2BSinglePage = B2BSinglePage;
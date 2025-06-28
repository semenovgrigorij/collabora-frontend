// offer.js - Функциональность страницы конкретного предложения

let scrollPosition = 0;

function getScrollbarWidth() {
    // Создаем временный элемент для измерения ширины скроллбара
    const outer = document.createElement('div');
    outer.style.visibility = 'hidden';
    outer.style.overflow = 'scroll';
    outer.style.msOverflowStyle = 'scrollbar';
    document.body.appendChild(outer);

    const inner = document.createElement('div');
    outer.appendChild(inner);

    const scrollbarWidth = outer.offsetWidth - inner.offsetWidth;
    outer.parentNode.removeChild(outer);

    return scrollbarWidth;
}

function disableScroll() {
    // Сохраняем текущую позицию скролла
    scrollPosition = window.pageYOffset;
    
    // Получаем ширину скроллбара
    const scrollbarWidth = getScrollbarWidth();
    
    // Применяем стили для блокировки скролла
    document.body.style.overflow = 'hidden';
    document.body.style.position = 'fixed';
    document.body.style.top = `-${scrollPosition}px`;
    document.body.style.width = '100%';
    
    // Компенсируем исчезновение скроллбара
    if (scrollbarWidth > 0) {
        document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
}

function enableScroll() {
    // Убираем все примененные стили
    document.body.style.removeProperty('overflow');
    document.body.style.removeProperty('position');
    document.body.style.removeProperty('top');
    document.body.style.removeProperty('width');
    document.body.style.removeProperty('padding-right');
    
    // Восстанавливаем позицию скролла
    window.scrollTo(0, scrollPosition);
}

// Функция для получения информации о текущем пользователе
function getCurrentUserInfo() {
    try {
        const userData = localStorage.getItem('userData');
        if (userData) {
            const user = JSON.parse(userData);
            return {
                id: user.userId || 'user_' + Date.now(),
                name: user.name || 'Користувач',
                email: user.email || '',
                avatar: user.photoBase64 || './icons/user-avatar-default.svg',
                isOnline: true,
                isVerified: false
            };
        }
    } catch (error) {
        console.error('Ошибка при получении данных пользователя:', error);
    }
    
    return {
        id: 'guest',
        name: 'Користувач',
        email: '',
        avatar: './icons/user-avatar-default.svg',
        isOnline: true,
        isVerified: false
    };
}

// Функция для установки информации о пользователе в header
function setupHeaderUserInfo() {
    const userInfo = getCurrentUserInfo();
    const userBlock = document.getElementById('headerUserBlock');
    const userAvatar = document.getElementById('headerUserAvatar');
    const userName = document.getElementById('headerUserName');

    if (userBlock) {
        userBlock.style.display = 'flex';
    }

    if (userAvatar) {
        const img = userAvatar.querySelector('img');
        if (img) {
            img.src = userInfo.avatar;
            img.alt = `Аватар ${userInfo.name}`;
        } else {
            userAvatar.innerHTML = `<img src="${userInfo.avatar}" alt="Аватар ${userInfo.name}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;">`;
        }
    }

    if (userName) {
        userName.textContent = userInfo.name;
    }

    const userStatus = document.querySelector('.header-user-status');
    if (userStatus) {
        userStatus.textContent = userInfo.isOnline ? 'Онлайн' : 'Офлайн';
        userStatus.className = `header-user-status ${userInfo.isOnline ? 'online' : 'offline'}`;
    }

    return userInfo;
}

class OfferPage {
    constructor() {
        this.currentOffer = null;
        this.popupOverlay = null;
        this.init();
    }

    init() {
        this.loadOfferData();
        this.setupUserInfo();
        this.setupComplaintButton();
        this.setupRespondButton();
        this.createPopupOverlay();
        
        console.log('Страница предложения инициализирована');
    }

    // Загрузка данных предложения
    loadOfferData() {
        // Пытаемся получить данные из sessionStorage
        const storedData = sessionStorage.getItem('currentOffer');
        if (storedData) {
            this.currentOffer = JSON.parse(storedData);
            this.renderOfferContent();
            return;
        }

        // Если нет данных в sessionStorage, используем мок-данные
        this.currentOffer = this.getMockOfferData();
        this.renderOfferContent();
    }

    // Мок-данные предложения
    getMockOfferData() {
        return {
            id: 1,
            title: "Пропоную послуги фасування сипучих продуктів",
            category: "Шукаю партнера",
            industry: "Пакування",
            region: "Львівська область",
            publishDate: "18.05.2025",
            description: `Компанія ТОВ «Агропак-Сервіс» пропонує послуги з фасування сипучих матеріалів у споживчу упаковку. Надаємо повний цикл робіт — від прийому сировини до нанесення етикеток і формування готових партій для реалізації. Наші потужності дозволяють фасувати продукти в пакети, мішки або дойпаки об'ємом від 100 грамів до 10 кілограмів.

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
            author: {
                id: 123,
                name: "HRYHORII",
                company: "ТОВ «Агропак-Сервіс»",
                avatar: "./icons/user-avatar-default.svg",
                isOnline: true,
                isVerified: true
            }
        };
    }

    // Рендеринг контента предложения
    renderOfferContent() {
        if (!this.currentOffer) return;

        // Обновляем заголовок страницы
        document.title = `${this.currentOffer.title} - Collabora`;

        // Обновляем хлебные крошки через BreadcrumbsManager
        this.updateBreadcrumbs();

        // Обновляем основной контент
        this.updateOfferContent();
    }

    // Обновление хлебных крошек
updateBreadcrumbs() {
    setTimeout(() => {
        if (window.breadcrumbsManager) {
            const b2bData = sessionStorage.getItem('currentB2BItem');
            let b2bTitle = 'Категорія';
            
            if (b2bData) {
                try {
                    const parsedData = JSON.parse(b2bData);
                    b2bTitle = parsedData.title || 'Категорія';
                } catch (error) {
                    console.warn('Ошибка при парсинге данных B2B:', error);
                }
            }

            const truncatedTitle = this.truncateTitle(this.currentOffer.title, 50);
            
            // Используем новый метод
            window.breadcrumbsManager.buildBreadcrumbs([
                { title: b2bTitle, href: './b2b-single.html' },
                { title: truncatedTitle, href: null }
            ]);
            
            console.log('Хлебные крошки обновлены для offer.html');
        }
    }, 100);
}

    // Обрезка длинного заголовка
    truncateTitle(title, maxLength) {
        if (title.length <= maxLength) return title;
        return title.substring(0, maxLength) + '...';
    }

    // Обновление контента предложения
    updateOfferContent() {
        const elements = {
            title: document.querySelector('.offer-content-container h1'),
            publishDate: document.querySelector('.data-publication'),
            category: document.querySelector('.categories span'),
            industry: document.querySelector('.branch span'),
            region: document.querySelector('.region span'),
            description: document.querySelector('.offer-text')
        };

        if (elements.title) {
            elements.title.textContent = this.currentOffer.title;
        }

        if (elements.publishDate) {
            elements.publishDate.textContent = `Опубліковано ${this.currentOffer.publishDate}`;
        }

        if (elements.category) {
            elements.category.textContent = this.currentOffer.category;
        }

        if (elements.industry) {
            elements.industry.textContent = this.currentOffer.industry;
        }

        if (elements.region) {
            elements.region.textContent = this.currentOffer.region;
        }

        if (elements.description) {
            // Конвертируем текст с переносами строк в HTML
            const formattedText = this.formatDescription(this.currentOffer.description);
            elements.description.innerHTML = formattedText;
        }
    }

    // Форматирование описания
    formatDescription(text) {
        return text
            .split('\n\n')
            .map(paragraph => {
                if (paragraph.includes('•')) {
                    // Это список
                    const items = paragraph.split('\n').filter(line => line.trim());
                    const title = items[0];
                    const listItems = items.slice(1).map(item => 
                        `<li>${item.replace('•', '').trim()}</li>`
                    ).join('');
                    return `<p>${title}</p><ul>${listItems}</ul>`;
                } else {
                    // Обычный параграф
                    return `<p>${paragraph}</p>`;
                }
            })
            .join('');
    }

    // Настройка информации о пользователе
    setupUserInfo() {
        // Сначала устанавливаем информацию о текущем пользователе в header
        const currentUserInfo = setupHeaderUserInfo();
        
        // Если есть данные об авторе предложения, используем их
        // Иначе используем данные текущего пользователя
        if (!this.currentOffer || !this.currentOffer.author) {
            console.warn('Нет данных об авторе предложения, используем данные текущего пользователя');
            return;
        }

        // Информация об авторе предложения уже установлена в loadOfferData()
        // Здесь мы просто проверяем, что header заполнен корректно
        console.log('Информация о пользователе установлена:', currentUserInfo);
    }

    // Настройка кнопки жалобы
    setupComplaintButton() {
        const complaintBtn = document.querySelector('.complaint-button');
        const complaintPopupBtn = document.querySelector('.complaint-button-popup');

        if (complaintBtn) {
            complaintBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleComplaintPopup();
            });
        }

        if (complaintPopupBtn) {
            complaintPopupBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.showComplaintModal();
            });
        }

        // Скрываем popup при клике вне его
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.complaint-button') && !e.target.closest('.complaint-button-popup')) {
                this.hideComplaintPopup();
            }
        });
    }

    // Переключение видимости popup жалобы
    toggleComplaintPopup() {
        const popupBtn = document.querySelector('.complaint-button-popup');
        if (popupBtn) {
            const isVisible = popupBtn.style.display === 'block';
            popupBtn.style.display = isVisible ? 'none' : 'block';
        }
    }

    // Скрытие popup жалобы
    hideComplaintPopup() {
        const popupBtn = document.querySelector('.complaint-button-popup');
        if (popupBtn) {
            popupBtn.style.display = 'none';
        }
    }

    // Показ модального окна жалобы
    showComplaintModal() {
        this.hideComplaintPopup();
        
        const modal = this.createModal('complaint', 'Скарга', `
            <div class="modal-content">
                <p>Надішліть скаргу та модерація перевірить пропозицію/потребу на наявність порушення</p>
                <textarea 
                    id="complaintText" 
                    placeholder="Опишіть суть скарги на пропозицію/потребу"
                    rows="5"
                    maxlength="500"
                ></textarea>
                <div class="char-counter">
                    <span id="charCount">0</span>/500
                </div>
                <div class="modal-buttons">
                    <button class="modal-btn primary" onclick="window.offerPage.submitComplaint()">Надіслати</button>
                </div>
            </div>
        `);

        this.showModal(modal);
        
        // Настройка счетчика символов
        const textarea = modal.querySelector('#complaintText');
        const charCount = modal.querySelector('#charCount');
        
        if (textarea && charCount) {
            textarea.addEventListener('input', () => {
                charCount.textContent = textarea.value.length;
            });
        }
    }

    // Настройка кнопки ответа
    setupRespondButton() {
        const respondBtn = document.querySelector('.respond-button-popup');
        
        if (respondBtn) {
            respondBtn.addEventListener('click', () => {
                this.showRespondModal();
            });
        }
    }

    // Показ модального окна ответа
    showRespondModal() {
        const modal = this.createModal('respond', 'Відгукнутись', `
            <div class="modal-content">
                <p>Залиште ваше повідомлення та контакти для зв’язку з Вами</p>
                <div class="form-group">
                    <label for="respondComment">Коментар до відгуку</label>
                    <textarea 
                        id="respondComment" 
                        placeholder="Опишіть чим ви можете домогти або запропонуйте іншу співпрацю"
                        rows="4"
                        maxlength="1000"
                        required
                    ></textarea>
                    <div class="char-counter">
                        <span id="respondCharCount">0</span>/1000
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="respondContact">Контакти для зв'язку</label>
                    <textarea 
                        id="respondContact" 
                        placeholder="Наприклад, контактна особа, e-mail, номер телефону"
                        rows="3"
                        maxlength="300"
                        required
                    ></textarea>
                    <div class="char-counter">
                        <span id="contactCharCount">0</span>/300
                    </div>
                </div>
                
                <div class="modal-buttons">
                    <button class="modal-btn primary" onclick="window.offerPage.submitResponse()">Надіслати</button>
                </div>
            </div>
        `);

        this.showModal(modal);
        
        // Настройка счетчиков символов
        this.setupCharCounters(modal);
    }

    // Настройка счетчиков символов
    setupCharCounters(modal) {
        const respondTextarea = modal.querySelector('#respondComment');
        const contactTextarea = modal.querySelector('#respondContact');
        const respondCharCount = modal.querySelector('#respondCharCount');
        const contactCharCount = modal.querySelector('#contactCharCount');
        
        if (respondTextarea && respondCharCount) {
            respondTextarea.addEventListener('input', () => {
                respondCharCount.textContent = respondTextarea.value.length;
            });
        }
        
        if (contactTextarea && contactCharCount) {
            contactTextarea.addEventListener('input', () => {
                contactCharCount.textContent = contactTextarea.value.length;
            });
        }
    }

    // Создание overlay для попапов
    createPopupOverlay() {
        this.popupOverlay = document.createElement('div');
        this.popupOverlay.className = 'popup-overlay';
        this.popupOverlay.addEventListener('click', (e) => {
            if (e.target === this.popupOverlay) {
                this.closeModal();
            }
        });
        document.body.appendChild(this.popupOverlay);
    }

    // Создание модального окна
    createModal(type, title, content) {
        const modal = document.createElement('div');
        modal.className = `modal modal-${type}`;
        modal.innerHTML = `
            <div class="modal-header">
                <h3>${title}</h3>
                <button class="modal-close" onclick="window.offerPage.closeModal()">
                    <svg width="26" height="26" viewBox="0 0 26 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M1 1L25 25M1 25L25 1" stroke="#241A56" />
                    </svg>
                </button>
            </div>
            ${content}
        `;
        return modal;
    }

    // Показ модального окна
    showModal(modal) {
        this.popupOverlay.innerHTML = '';
        this.popupOverlay.appendChild(modal);
        this.popupOverlay.classList.add('active');

        // Отключаем скроллинг
        disableScroll();
    }

    // Закрытие модального окна
    closeModal() {
        this.popupOverlay.classList.remove('active');

        // Включаем скроллинг
        enableScroll();

        setTimeout(() => {
            this.popupOverlay.innerHTML = '';
        }, 300);
    }

    // Отправка жалобы
    submitComplaint() {
        const textarea = document.getElementById('complaintText');
        if (!textarea || !textarea.value.trim()) {
            alert('Будь ласка, введіть текст скарги');
            return;
        }

        const complaintData = {
            offerId: this.currentOffer.id,
            authorId: this.currentOffer.author.id,
            complaintText: textarea.value.trim(),
            timestamp: new Date().toISOString()
        };

        console.log('Отправка жалобы:', complaintData);

        // В реальном проекте здесь будет API запрос
        // Пока что имитируем успешную отправку
        this.showSuccessMessage('Скаргу надіслано! Вона буде розглянута найближчим часом.');
        this.closeModal();
    }

    // Отправка ответа
    submitResponse() {
        const commentTextarea = document.getElementById('respondComment');
        const contactTextarea = document.getElementById('respondContact');
        
        if (!commentTextarea || !commentTextarea.value.trim()) {
            alert('Будь ласка, введіть коментар');
            return;
        }
        
        if (!contactTextarea || !contactTextarea.value.trim()) {
            alert('Будь ласка, вкажіть контактні дані');
            return;
        }

        const responseData = {
            offerId: this.currentOffer.id,
            authorId: this.currentOffer.author.id,
            comment: commentTextarea.value.trim(),
            contact: contactTextarea.value.trim(),
            timestamp: new Date().toISOString()
        };

        console.log('Отправка отклика:', responseData);

        // В реальном проекте здесь будет API запрос
        // Пока что имитируем успешную отправку
        this.showSuccessMessage('Відгук надіслано! Автор отримає ваше повідомлення.');
        this.closeModal();
    }

    // Показ сообщения об успехе
    showSuccessMessage(message) {
        const notification = document.createElement('div');
        notification.className = 'success-notification';
        notification.innerHTML = `
            <div class="notification-content">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <div>
                    <p>${message}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Убираем уведомление через 4 секунды
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // Публичные методы
    getCurrentOffer() {
        return this.currentOffer;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.offerPage = new OfferPage();
    console.log('Функциональность страницы предложения загружена');
});

// Экспорт для использования в других скриптах
window.OfferPage = OfferPage;
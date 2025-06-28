// b2b.js - Функциональность B2B страницы

// Мок-данные для B2B блоков (имитация базы данных)
const b2bDatabase = [
    {
        id: 1,
        title: "Промисловість та переробка",
        lastUpdate: "25 хв. тому",
        participants: "4.1 тис",
        image: "./icons/b2b-img-1.svg",
        businessType: ["production"],
        scale: ["large"],
        region: ["kyiv", "kharkiv"],
        status: ["partnership"],
        dateAdded: new Date('2024-12-15')
    },
    {
        id: 2,
        title: "Будівництво, матеріали, деревопереробка",
        lastUpdate: "1 год. тому",
        participants: "3.2 тис",
        image: "./icons/b2b-img-2.svg",
        businessType: ["production", "trade"],
        scale: ["medium", "large"],
        region: ["kyiv", "lviv"],
        status: ["investment", "partnership"],
        dateAdded: new Date('2024-12-14')
    },
    {
        id: 3,
        title: "Агро і харчова промисловість",
        lastUpdate: "2 год. тому",
        participants: "2.8 тис",
        image: "./icons/b2b-img-3.svg",
        businessType: ["production"],
        scale: ["small", "medium"],
        region: ["kyiv", "odesa", "dnipro"],
        status: ["marketing", "similar"],
        dateAdded: new Date('2024-12-13')
    },
    {
        id: 4,
        title: "Енергетика",
        lastUpdate: "3 год. тому",
        participants: "1.9 тис",
        image: "./icons/b2b-img-4.svg",
        businessType: ["technology", "services"],
        scale: ["large"],
        region: ["kyiv", "kharkiv", "dnipro"],
        status: ["investment"],
        dateAdded: new Date('2024-12-12')
    },
    {
        id: 5,
        title: "IT та телекомунікації",
        lastUpdate: "4 год. тому",
        participants: "5.5 тис",
        image: "./icons/b2b-img-5.svg",
        businessType: ["technology", "services"],
        scale: ["small", "medium"],
        region: ["kyiv", "lviv", "kharkiv"],
        status: ["partnership", "marketing"],
        dateAdded: new Date('2024-12-11')
    },
    {
        id: 6,
        title: "Фінанси та банкінг",
        lastUpdate: "5 год. тому",
        participants: "2.1 тис",
        image: "./icons/b2b-img-6.svg",
        businessType: ["services"],
        scale: ["large"],
        region: ["kyiv"],
        status: ["investment"],
        dateAdded: new Date('2024-12-10')
    },
    {
        id: 7,
        title: "Роздрібна торгівля",
        lastUpdate: "6 год. тому",
        participants: "3.7 тис",
        image: "./icons/b2b-img-7.svg",
        businessType: ["trade"],
        scale: ["small", "medium"],
        region: ["kyiv", "lviv", "odesa"],
        status: ["marketing", "similar"],
        dateAdded: new Date('2024-12-09')
    },
    {
        id: 8,
        title: "Логістика та транспорт",
        lastUpdate: "7 год. тому",
        participants: "1.6 тис",
        image: "./icons/b2b-img-8.svg",
        businessType: ["services"],
        scale: ["medium"],
        region: ["kyiv", "odesa", "dnipro"],
        status: ["partnership"],
        dateAdded: new Date('2024-12-08')
    }
];

class B2BPage {
    constructor() {
        this.filters = {
            businessType: [],
            scale: [],
            geography: [],
            needs: []
        };
        this.filteredData = [...b2bDatabase];
        this.init();
    }

    init() {
        this.setupFilters();
        this.setupClearButton();
        this.setupBlockClickHandlers(); // Устанавливаем обработчики один раз
        this.renderB2BBlocks();
        this.updateResultsCount();
        
        console.log('B2B страница инициализирована');
    }

    // Настройка фильтров
    setupFilters() {
        const filterButtons = document.querySelectorAll('.filter-btn');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleFilter(button);
            });
        });

        // Настройка чекбоксов в фильтрах
        const checkboxes = document.querySelectorAll('.filter-option-checkbox input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                this.handleFilterChange(e);
            });
        });

        // Закрытие фильтров при клике вне
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.filter-dropdown')) {
                this.closeAllFilters();
            }
        });
    }

    // Переключение видимости фильтра
    toggleFilter(button) {
        const dropdown = button.closest('.filter-dropdown');
        const isActive = dropdown.classList.contains('active');
        
        // Закрываем все остальные фильтры
        this.closeAllFilters();
        
        // Переключаем текущий фильтр
        if (!isActive) {
            dropdown.classList.add('active');
            button.classList.add('active');
        }
    }

    // Закрытие всех фильтров
    closeAllFilters() {
        const dropdowns = document.querySelectorAll('.filter-dropdown');
        const buttons = document.querySelectorAll('.filter-btn');
        
        dropdowns.forEach(dropdown => dropdown.classList.remove('active'));
        buttons.forEach(button => button.classList.remove('active'));
    }

    // Обработка изменения фильтра
    handleFilterChange(e) {
        const checkbox = e.target;
        const value = checkbox.value;
        const filterOption = checkbox.closest('.filter-option-checkbox');
        const dropdown = checkbox.closest('.filter-dropdown-content');
        const filterId = dropdown.id;

        // Определяем тип фильтра
        let filterType = '';
        if (filterId.includes('businessType')) filterType = 'businessType';
        else if (filterId.includes('scale')) filterType = 'scale';
        else if (filterId.includes('geography')) filterType = 'geography';
        else if (filterId.includes('needs')) filterType = 'needs';

        // Обновляем массив фильтров
        if (checkbox.checked) {
            if (!this.filters[filterType].includes(value)) {
                this.filters[filterType].push(value);
            }
        } else {
            this.filters[filterType] = this.filters[filterType].filter(item => item !== value);
        }

        // Обновляем счетчик выбранных фильтров
        this.updateFilterCount(filterType);
        
        // Применяем фильтрацию
        this.applyFilters();
        
        console.log('Фильтры обновлены:', this.filters);
    }

    // Обновление счетчика фильтров
    updateFilterCount(filterType) {
        const countElementId = filterType + 'Count';
        const countElement = document.getElementById(countElementId);
        
        if (countElement) {
            const count = this.filters[filterType].length;
            countElement.textContent = count > 0 ? `(${count})` : '';
            countElement.style.display = count > 0 ? 'inline' : 'none';
        }
    }

    // Применение фильтров
    applyFilters() {
        this.filteredData = b2bDatabase.filter(item => {
            // Проверяем каждый тип фильтра
            const businessTypeMatch = this.filters.businessType.length === 0 || 
                this.filters.businessType.some(type => item.businessType.includes(type));
            
            const scaleMatch = this.filters.scale.length === 0 || 
                this.filters.scale.some(scale => item.scale.includes(scale));
            
            const geographyMatch = this.filters.geography.length === 0 || 
                this.filters.geography.some(region => item.region.includes(region));
            
            const needsMatch = this.filters.needs.length === 0 || 
                this.filters.needs.some(status => item.status.includes(status));

            return businessTypeMatch && scaleMatch && geographyMatch && needsMatch;
        });

        // Сортируем по дате добавления (новые первыми)
        this.filteredData.sort((a, b) => b.dateAdded - a.dateAdded);

        this.renderB2BBlocks();
        this.updateResultsCount();
    }

    // Настройка кнопки очистки фильтров
    setupClearButton() {
        const clearButton = document.getElementById('clearFiltersBtn');
        if (clearButton) {
            clearButton.addEventListener('click', () => {
                this.clearAllFilters();
            });
        }
    }

    // Очистка всех фильтров
    clearAllFilters() {
        // Сбрасываем массивы фильтров
        this.filters = {
            businessType: [],
            scale: [],
            geography: [],
            needs: []
        };

        // Снимаем все чекбоксы
        const checkboxes = document.querySelectorAll('.filter-option-checkbox input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });

        // Обновляем счетчики
        ['businessType', 'scale', 'geography', 'needs'].forEach(filterType => {
            this.updateFilterCount(filterType);
        });

        // Закрываем все фильтры
        this.closeAllFilters();

        // Применяем фильтрацию (показываем все)
        this.applyFilters();

        console.log('Все фильтры очищены');
    }

    // Рендеринг B2B блоков
    renderB2BBlocks() {
        const container = document.getElementById('b2bContainer');
        const noResults = document.getElementById('b2bNoResults');
        
        if (!container) return;

        // Показываем только первые 4 блока
        const displayData = this.filteredData.slice(0, 4);

        if (displayData.length === 0) {
            container.style.display = 'none';
            if (noResults) noResults.style.display = 'block';
            return;
        }

        container.style.display = 'grid';
        if (noResults) noResults.style.display = 'none';

        container.innerHTML = displayData.map(item => this.createB2BBlockHTML(item)).join('');

        console.log('B2B блоки отрендерены:', displayData.length);
    }

    // Создание HTML для B2B блока
    createB2BBlockHTML(item) {
        return `
            <div class="b2b-block" data-id="${item.id}" style="cursor: pointer;">
                <div class="b2b-block-top">
                    <div class="b2b-block-top-img">
                        <img src="${item.image}" alt="b2b logo" width="120">
                    </div>
                    <div class="b2b-block-top-text">
                        <p>Останнє оновлення ${item.lastUpdate}</p>
                        <h4>${item.title}</h4>
                        <p>Учасників: ${item.participants}</p>
                    </div>
                </div>              
                <div class="b2b-block-bottom">
                    <a href="#" class="b2b-block-bottom-discussions" onclick="event.stopPropagation();">
                        <img src="./icons/b2b-icon-1.svg" alt="discussions" width="23">
                        <p>Обговорення</p>
                    </a>
                    <a href="#" class="b2b-block-bottom-offers" onclick="event.stopPropagation();">
                        <img src="./icons/b2b-icon-plus.svg" alt="offers" width="23">
                        <p>Запропонувати</p>
                    </a>
                </div>
            </div>
        `;
    }

    // Настройка обработчиков кликов по блокам
    setupBlockClickHandlers() {
        const container = document.getElementById('b2bContainer');
        if (!container) return;

        // Используем делегирование событий для динамически созданных элементов
        container.addEventListener('click', (e) => {
            const block = e.target.closest('.b2b-block');
            if (!block) return;

            // Проверяем, что клик не по ссылкам внутри блока
            if (e.target.closest('a')) {
                console.log('Клик по ссылке внутри блока - пропускаем');
                return;
            }

            const blockId = block.getAttribute('data-id');
            console.log('Клик по блоку с ID:', blockId);
            
            const blockData = b2bDatabase.find(item => item.id == blockId);
            
            if (blockData) {
                console.log('Данные блока найдены:', blockData);
                this.navigateToSinglePage(blockData);
            } else {
                console.error('Данные блока не найдены для ID:', blockId);
            }
        });

        // Обработчики для hover эффектов
        container.addEventListener('mouseenter', (e) => {
            const block = e.target.closest('.b2b-block');
            if (block) {
                block.style.transform = 'translateY(-2px)';
                block.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
                block.style.transition = 'all 0.2s ease';
            }
        }, true);

        container.addEventListener('mouseleave', (e) => {
            const block = e.target.closest('.b2b-block');
            if (block) {
                block.style.transform = 'translateY(0)';
                block.style.boxShadow = 'none';
            }
        }, true);
    }

    // Переход на страницу сингла
    navigateToSinglePage(blockData) {
        // Создаем слаг из названия для URL
        const slug = this.createSlug(blockData.title);
        const singlePageUrl = `./b2b-single.html?id=${blockData.id}&slug=${slug}`;
        
        console.log(`Переход на страницу: ${blockData.title}`);
        console.log(`URL: ${singlePageUrl}`);
        
        // Сохраняем данные в sessionStorage для использования на странице сингла
        sessionStorage.setItem('currentB2BItem', JSON.stringify(blockData));
        
        // Проверяем, существует ли файл b2b-single.html
        // В разработке можно закомментировать следующие строки и раскомментировать alert
        try {
            window.location.href = singlePageUrl;
        } catch (error) {
            console.error('Ошибка при переходе:', error);
            // Пока что показываем alert с информацией, если страница не существует
            alert(`Переход на страницу: "${blockData.title}"\nURL: ${singlePageUrl}\n\nСтраница b2b-single.html еще не создана.`);
        }
    }

    // Создание слага из названия
    createSlug(title) {
        const translitMap = {
            'а': 'a', 'б': 'b', 'в': 'v', 'г': 'g', 'д': 'd', 'е': 'e', 'є': 'ye',
            'ж': 'zh', 'з': 'z', 'и': 'y', 'і': 'i', 'ї': 'yi', 'й': 'y',
            'к': 'k', 'л': 'l', 'м': 'm', 'н': 'n', 'о': 'o', 'п': 'p',
            'р': 'r', 'с': 's', 'т': 't', 'у': 'u', 'ф': 'f', 'х': 'kh',
            'ц': 'ts', 'ч': 'ch', 'ш': 'sh', 'щ': 'shch', 'ь': '', 'ю': 'yu', 'я': 'ya'
        };

        return title
            .toLowerCase()
            .split('')
            .map(char => translitMap[char] || char)
            .join('')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    }

    // Обновление счетчика результатов
    updateResultsCount() {
        const resultsElement = document.getElementById('b2bResultsCount');
        if (resultsElement) {
            const count = this.filteredData.length;
            const displayCount = Math.min(count, 4);
            
            if (count === 0) {
                resultsElement.textContent = 'Нічого не знайдено';
            } else if (count <= 4) {
                resultsElement.textContent = `Знайдено: ${count} ${this.getBusinessWord(count)}`;
            } else {
                resultsElement.textContent = `Показано: ${displayCount} з ${count} ${this.getBusinessWord(count)}`;
            }
        }
    }

    // Склонение слова "бизнес"
    getBusinessWord(count) {
        if (count === 1) return 'бізнес';
        if (count >= 2 && count <= 4) return 'бізнеси';
        return 'бізнесів';
    }

    // Публичные методы для внешнего использования
    getFilteredData() {
        return this.filteredData;
    }

    getCurrentFilters() {
        return this.filters;
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    window.b2bPage = new B2BPage();
    console.log('B2B функциональность загружена');
});

// Экспорт для использования в других скриптах
window.B2BPage = B2BPage;
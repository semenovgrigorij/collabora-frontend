// js/blog.js - Система пагинации для блога с поддержкой обеих языков

class BlogManager {
    constructor() {
        // Определяем текущий язык
        this.currentLang = this.detectLanguage();
        console.log('🌐 Detected language for blog:', this.currentLang);
        
        // Локализованные данные блог-постов
        this.allPosts = this.initializePosts();

        this.filteredPosts = [...this.allPosts];
        this.currentPage = 1;
        this.itemsPerPage = 3; // Показываем 3 поста на странице

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

    // Инициализация постов с учетом языка
    initializePosts() {
        const posts = [
            {
                id: 1,
                title: this.currentLang === 'en' 
                    ? "We have been teaching micro, small and medium business owners since 2016"
                    : "Ми навчаємо власників мікро-, малого та середнього бізнесу з 2016 року",
                image: this.getLocalizedPath("./img/blog-img-1.png"),
                date: "30.04.2025",
                category: "business"
            },
            {
                id: 2,
                title: this.currentLang === 'en'
                    ? "Training for fast food restaurant owners from McDonald's"
                    : "Тренінг для власників ресторанів фаст-фудів від МакДональдс",
                image: this.getLocalizedPath("./img/blog-img-2.png"),
                date: "30.04.2025",
                category: "training"
            },
            {
                id: 3,
                title: this.currentLang === 'en'
                    ? "How to develop big business in wartime - training from METRO"
                    : "Як розвивати великий бізнес в умовах війни - тренінг від МЕТРО",
                image: this.getLocalizedPath("./img/blog-img-3.png"),
                date: "30.04.2025",
                category: "training"
            },
            {
                id: 4,
                title: this.currentLang === 'en'
                    ? "Digital transformation of small business: 5 steps to success"
                    : "Цифрова трансформація малого бізнесу: 5 кроків до успіху",
                image: this.getLocalizedPath("./img/blog-img-4.jpg"),
                date: "29.04.2025",
                category: "digital"
            },
            {
                id: 5,
                title: this.currentLang === 'en'
                    ? "How to get government support for a startup in 2025"
                    : "Як отримати державну підтримку для стартапу в 2025 році",
                image: this.getLocalizedPath("./img/blog-img-5.jpg"),
                date: "28.04.2025",
                category: "startup"
            },
            {
                id: 6,
                title: this.currentLang === 'en'
                    ? "Secrets of effective marketing for small business"
                    : "Секрети ефективного маркетингу для малого бізнесу",
                image: this.getLocalizedPath("./img/blog-img-6.jpg"),
                date: "27.04.2025",
                category: "marketing"
            },
            {
                id: 7,
                title: this.currentLang === 'en'
                    ? "Financial planning for business owners: practical tips"
                    : "Фінансове планування для власників бізнесу: практичні поради",
                image: this.getLocalizedPath("./img/blog-img-7.jpg"),
                date: "26.04.2025",
                category: "finance"
            },
            {
                id: 8,
                title: this.currentLang === 'en'
                    ? "How to increase sales through social media"
                    : "Як збільшити продажі через соціальні мережі",
                image: this.getLocalizedPath("./img/blog-img-8.jpg"),
                date: "25.04.2025",
                category: "marketing"
            },
            {
                id: 9,
                title: this.currentLang === 'en'
                    ? "Legal aspects of doing business in Ukraine"
                    : "Правові аспекти ведення бізнесу в Україні",
                image: this.getLocalizedPath("./img/blog-img-9.jpg"),
                date: "24.04.2025",
                category: "legal"
            },
            {
                id: 10,
                title: this.currentLang === 'en'
                    ? "Innovative solutions for business process automation"
                    : "Інноваційні рішення для автоматизації бізнес-процесів",
                image: this.getLocalizedPath("./img/blog-img-10.jpg"),
                date: "23.04.2025",
                category: "innovation"
            },
            {
                id: 11,
                title: this.currentLang === 'en'
                    ? "How to build a successful team: experience of top managers"
                    : "Як створити успішну команду: досвід топ-менеджерів",
                image: this.getLocalizedPath("./img/blog-img-11.jpg"),
                date: "22.04.2025",
                category: "management"
            },
            {
                id: 12,
                title: this.currentLang === 'en'
                    ? "Green business: trends and opportunities for 2025"
                    : "Екологічний бізнес: тренди та можливості 2025 року",
                image: this.getLocalizedPath("./img/blog-img-12.jpg"),
                date: "21.04.2025",
                category: "ecology"
            },
            {
                id: 13,
                title: this.currentLang === 'en'
                    ? "Training for fast food restaurant owners from McDonald's"
                    : "Тренінг для власників ресторанів фаст-фудів від МакДональдс",
                image: this.getLocalizedPath("./img/blog-img-2.png"),
                date: "30.04.2025",
                category: "training"
            },
            {
                id: 14,
                title: this.currentLang === 'en'
                    ? "Financial planning for business owners: practical tips"
                    : "Фінансове планування для власників бізнесу: практичні поради",
                image: this.getLocalizedPath("./img/blog-img-1.png"),
                date: "26.04.2025",
                category: "finance"
            },
            {
                id: 15,
                title: this.currentLang === 'en'
                    ? "How to increase sales through social media"
                    : "Як збільшити продажі через соціальні мережі",
                image: this.getLocalizedPath("./img/blog-img-5.jpg"),
                date: "25.04.2025",
                category: "marketing"
            },
            {
                id: 16,
                title: this.currentLang === 'en'
                    ? "Legal aspects of doing business in Ukraine"
                    : "Правові аспекти ведення бізнесу в Україні",
                image: this.getLocalizedPath("./img/blog-img-8.jpg"),
                date: "24.04.2025",
                category: "legal"
            }
        ];

        console.log(`📰 Инициализировано ${posts.length} постов для языка: ${this.currentLang}`);
        return posts;
    }

    // Локализованные тексты
    getLocalizedText(key) {
        const texts = {
            en: {
                blogTitle: "Events, initiatives and news",
                noPostsMessage: "No posts to display",
                blogImageAlt: "Blog image",
                postContent: "Here will be the full text of the post...",
                date: "Date:"
            },
            uk: {
                blogTitle: "Події, ініціативи та новини",
                noPostsMessage: "Немає постів для відображення",
                blogImageAlt: "Зображення блогу",
                postContent: "Тут буде повний текст поста...",
                date: "Дата:"
            }
        };

        return texts[this.currentLang][key] || texts['uk'][key] || key;
    }

    init() {
        console.log('🚀 Инициализация BlogManager');
        console.log(`📊 Всего постов: ${this.allPosts.length}`);
        console.log(`🌐 Текущий язык: ${this.currentLang}`);
        
        // Обновляем заголовок секции блога
        this.updateBlogTitle();
        
        // Всегда показываем секцию блога
        this.ensureBlogSectionVisible();
        
        // Рендерим контент
        this.renderPosts();
        this.renderPagination();
        
        console.log('✅ BlogManager готов к работе');
    }

    // Обновление заголовка секции блога
    updateBlogTitle() {
        const blogTitle = document.querySelector('.blog-title h4');
        if (blogTitle) {
            blogTitle.textContent = this.getLocalizedText('blogTitle');
            console.log('📝 Заголовок блога обновлен:', blogTitle.textContent);
        }
    }

    // Убеждаемся, что секция блога видна
    ensureBlogSectionVisible() {
        const blogSection = document.getElementById('blog-section');
        
        if (blogSection) {
            // Принудительно показываем секцию для обеих языков
            blogSection.style.display = 'block';
            blogSection.style.visibility = 'visible';
            blogSection.style.opacity = '1';
            blogSection.removeAttribute('hidden');
            blogSection.classList.remove('hidden-en');
            
            console.log(`✅ Секция блога принудительно показана для языка: ${this.currentLang}`);
        } else {
            console.warn('⚠️ Секция блога не найдена в DOM');
        }
    }

    renderPosts() {
        const container = document.querySelector('.blog-container');
        
        if (!container) {
            console.error('❌ Контейнер .blog-container не найден');
            return;
        }

        // Вычисляем посты для текущей страницы
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const postsToShow = this.filteredPosts.slice(startIndex, endIndex);

        console.log(`📄 Рендер постов: страница ${this.currentPage}, показываем ${postsToShow.length} из ${this.filteredPosts.length}`);

        if (postsToShow.length === 0) {
            container.innerHTML = `<div class="no-posts">${this.getLocalizedText('noPostsMessage')}</div>`;
            return;
        }

        // Очищаем контейнер и создаем новые посты
        container.innerHTML = '';
        
        postsToShow.forEach(post => {
            const postElement = this.createPostCard(post);
            container.appendChild(postElement);
        });

        console.log(`✅ Отрендерено ${postsToShow.length} постов`);
    }

    createPostCard(post) {
        const postDiv = document.createElement('div');
        postDiv.className = 'blog-block';
        postDiv.setAttribute('data-post-id', post.id);

        // Создаем fallback изображение с учетом языка
        const fallbackImage = this.getLocalizedPath('./img/blog-placeholder.png');

        postDiv.innerHTML = `
            <img src="${post.image}" 
                 alt="${this.getLocalizedText('blogImageAlt')}" 
                 width="422" 
                 onerror="this.src='${fallbackImage}'">
            <h5>${post.title}</h5>
            <p>${post.date}</p>
        `;

        // Добавляем обработчик клика для перехода к посту
        postDiv.addEventListener('click', () => {
            this.handlePostClick(post);
        });

        postDiv.style.cursor = 'pointer';
        
        return postDiv;
    }

    renderPagination() {
        const container = document.getElementById('blogPagination');
        
        if (!container) {
            console.error('❌ Контейнер blogPagination не найден');
            return;
        }

        const totalPages = Math.ceil(this.filteredPosts.length / this.itemsPerPage);
        
        console.log(`📄 Рендер пагинации: страница ${this.currentPage} из ${totalPages}`);
        
        if (totalPages <= 1) {
            container.innerHTML = '';
            return;
        }

        let paginationHTML = '';

        // Логика пагинации
        if (totalPages <= 5) {
            for (let page = 1; page <= totalPages; page++) {
                paginationHTML += `
                    <div class="blog-pagination-block ${page === this.currentPage ? 'active' : ''}" 
                         data-page="${page}">
                        ${page}
                    </div>
                `;
            }
        } else {
            if (this.currentPage <= 4) {
                for (let page = 1; page <= 4; page++) {
                    paginationHTML += `
                        <div class="blog-pagination-block ${page === this.currentPage ? 'active' : ''}" 
                            data-page="${page}">
                            ${page}
                        </div>
                    `;
                }
                
                paginationHTML += `<div class="blog-pagination-block dots">...</div>`;
                
                paginationHTML += `
                    <div class="blog-pagination-block" data-page="${totalPages}">
                        ${totalPages}
                    </div>
                `;
            } else if (this.currentPage >= totalPages - 3) {
                paginationHTML += `
                    <div class="blog-pagination-block" data-page="1">1</div>
                `;
                
                paginationHTML += `<div class="blog-pagination-block dots">...</div>`;
                
                for (let page = totalPages - 3; page <= totalPages; page++) {
                    paginationHTML += `
                        <div class="blog-pagination-block ${page === this.currentPage ? 'active' : ''}" 
                             data-page="${page}">
                            ${page}
                        </div>
                    `;
                }
            } else {
                paginationHTML += `
                    <div class="blog-pagination-block" data-page="1">1</div>
                `;
                
                paginationHTML += `<div class="blog-pagination-block dots">...</div>`;
                
                paginationHTML += `
                    <div class="blog-pagination-block active" data-page="${this.currentPage}">
                        ${this.currentPage}
                    </div>
                `;
                
                paginationHTML += `<div class="blog-pagination-block dots">...</div>`;
                
                paginationHTML += `
                    <div class="blog-pagination-block" data-page="${totalPages}">
                        ${totalPages}
                    </div>
                `;
            }
        }

        container.innerHTML = paginationHTML;
        
        // Добавляем обработчики событий
        const paginationButtons = container.querySelectorAll('.blog-pagination-block[data-page]');
        
        paginationButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const page = parseInt(btn.getAttribute('data-page'));
                console.log(`🔗 Клик по странице блога: ${page}`);
                
                if (page && page !== this.currentPage) {
                    this.goToPage(page);
                }
            });
        });
        
        console.log(`✅ Пагинация блога отрендерена`);
    }

    goToPage(page) {
        const totalPages = Math.ceil(this.filteredPosts.length / this.itemsPerPage);
        
        console.log(`🔄 Переход на страницу блога ${page} из ${totalPages}`);
        
        if (page < 1 || page > totalPages) {
            console.warn(`❌ Некорректная страница: ${page}`);
            return;
        }
        
        this.currentPage = page;
        console.log(`✅ Установлена страница блога: ${this.currentPage}`);
        
        this.renderPosts();
        this.renderPagination();
        
        // Плавная прокрутка к началу блога
        const blogSection = document.querySelector('.blog-wrapper');
        if (blogSection) {
            blogSection.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
        }
    }

    handlePostClick(post) {
        console.log(`📰 Клик по посту: ${post.title}`);
        this.showPostModal(post);
    }

    showPostModal(post) {
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        
        modal.innerHTML = `
            <div class="blog-modal-content">
                <div class="blog-modal-header">
                    <h3>${post.title}</h3>
                    <button class="blog-modal-close">&times;</button>
                </div>
                <div class="blog-modal-body">
                    <img src="${post.image}" alt="${this.getLocalizedText('blogImageAlt')}">
                    <p><strong>${this.getLocalizedText('date')}</strong> ${post.date}</p>
                    <p>${this.getLocalizedText('postContent')}</p>
                </div>
            </div>
        `;

        // Добавляем стили для модального окна
        if (!document.querySelector('#blog-modal-styles')) {
            const styles = document.createElement('style');
            styles.id = 'blog-modal-styles';
            styles.textContent = `
                .blog-modal {
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
                }
                
                .blog-modal-content {
                    background: white;
                    border-radius: 12px;
                    max-width: 600px;
                    max-height: 80vh;
                    overflow-y: auto;
                    margin: 20px;
                }
                
                .blog-modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #eee;
                }
                
                .blog-modal-close {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    padding: 0;
                    width: 30px;
                    height: 30px;
                }
                
                .blog-modal-body {
                    padding: 20px;
                }
                
                .blog-modal-body img {
                    width: 100%;
                    border-radius: 8px;
                    margin-bottom: 15px;
                }
            `;
            document.head.appendChild(styles);
        }

        document.body.appendChild(modal);

        // Обработчики закрытия
        const closeBtn = modal.querySelector('.blog-modal-close');
        closeBtn.addEventListener('click', () => modal.remove());
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }

    // Методы для фильтрации
    filterByCategory(category) {
        if (!category) {
            this.filteredPosts = [...this.allPosts];
        } else {
            this.filteredPosts = this.allPosts.filter(post => post.category === category);
        }
        
        this.currentPage = 1;
        this.renderPosts();
        this.renderPagination();
    }

    // Метод для получения состояния
    getState() {
        return {
            currentPage: this.currentPage,
            totalPages: Math.ceil(this.filteredPosts.length / this.itemsPerPage),
            totalPosts: this.allPosts.length,
            filteredPosts: this.filteredPosts.length,
            itemsPerPage: this.itemsPerPage,
            language: this.currentLang,
            shouldShow: true // Теперь всегда показываем
        };
    }
}

// Инициализация при загрузке страницы
let blogManager;

document.addEventListener('DOMContentLoaded', () => {
    // Ждем загрузки компонентов
    if (document.body.classList.contains('components-ready')) {
        initBlog();
    } else {
        document.addEventListener('componentsLoaded', initBlog);
    }
});

function initBlog() {
    // Проверяем существование блога на странице
    const blogContainer = document.querySelector('.blog-container');
    const blogSection = document.getElementById('blog-section');
    
    if (blogContainer || blogSection) {
        console.log('🚀 Инициализация блога...');
        blogManager = new BlogManager();
        
        // Делаем доступным глобально для отладки
        window.blogManager = blogManager;
        
        console.log('✅ Блог готов к работе!');
    } else {
        console.log('ℹ️ Секция блога не найдена на этой странице');
    }
}

// Отладочная функция для блога
function debugBlogSection() {
    console.log('🔍 ОТЛАДКА СЕКЦИИ БЛОГА:');
    
    const blogSection = document.getElementById('blog-section');
    const blogContainer = document.querySelector('.blog-container');
    const currentLang = window.location.pathname.includes('/en/') ? 'en' : 'uk';
    
    console.log('📊 Состояние блога:');
    console.log('- Текущий язык:', currentLang);
    console.log('- Секция блога найдена:', !!blogSection);
    console.log('- Контейнер блога найден:', !!blogContainer);
    console.log('- Стиль display секции:', blogSection ? getComputedStyle(blogSection).display : 'секция не найдена');
    console.log('- BlogManager инициализирован:', !!window.blogManager);
    
    if (window.blogManager) {
        console.log('- Состояние BlogManager:', window.blogManager.getState());
    }
    
    if (blogSection) {
        // Принудительно показываем для обеих языков
        blogSection.style.display = 'block';
        blogSection.style.visibility = 'visible';
        blogSection.removeAttribute('hidden');
        console.log('✅ Секция блога принудительно показана');
    }
    
    return {
        found: !!blogSection,
        language: currentLang,
        display: blogSection ? getComputedStyle(blogSection).display : null,
        blogManagerReady: !!window.blogManager
    };
}

// Добавляем функции в глобальную область для отладки
window.debugBlogSection = debugBlogSection;

// Экспорт для использования в других скриптах
window.BlogManager = BlogManager;
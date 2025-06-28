// js/blog.js - Система пагинации для блога

class BlogManager {
    constructor() {
        // Данные блог-постов (можно заменить на API)
        this.allPosts = [
            {
                id: 1,
                title: "Ми навчаємо власників мікро-, малого та середнього бізнесу з 2016 року",
                image: "./img/blog-img-1.png",
                date: "30.04.2025",
                category: "business"
            },
            {
                id: 2,
                title: "Тренінг для власників ресторанів фаст-фудів від МакДональдс",
                image: "./img/blog-img-2.png",
                date: "30.04.2025",
                category: "training"
            },
            {
                id: 3,
                title: "Як розвивати великий бізнес в умовах війни - тренінг від МЕТРО",
                image: "./img/blog-img-3.png",
                date: "30.04.2025",
                category: "training"
            },
            // Дополнительные посты для демонстрации пагинации
            {
                id: 4,
                title: "Цифрова трансформація малого бізнесу: 5 кроків до успіху",
                image: "./img/blog-img-4.jpg",
                date: "29.04.2025",
                category: "digital"
            },
            {
                id: 5,
                title: "Як отримати державну підтримку для стартапу в 2025 році",
                image: "./img/blog-img-5.jpg",
                date: "28.04.2025",
                category: "startup"
            },
            {
                id: 6,
                title: "Секрети ефективного маркетингу для малого бізнесу",
                image: "./img/blog-img-6.jpg",
                date: "27.04.2025",
                category: "marketing"
            },
            {
                id: 7,
                title: "Фінансове планування для власників бізнесу: практичні поради",
                image: "./img/blog-img-7.jpg",
                date: "26.04.2025",
                category: "finance"
            },
            {
                id: 8,
                title: "Як збільшити продажі через соціальні мережі",
                image: "./img/blog-img-8.jpg",
                date: "25.04.2025",
                category: "marketing"
            },
            {
                id: 9,
                title: "Правові аспекти ведення бізнесу в Україні",
                image: "./img/blog-img-9.jpg",
                date: "24.04.2025",
                category: "legal"
            },
            {
                id: 10,
                title: "Інноваційні рішення для автоматизації бізнес-процесів",
                image: "./img/blog-img-10.jpg",
                date: "23.04.2025",
                category: "innovation"
            },
            {
                id: 11,
                title: "Як створити успішну команду: досвід топ-менеджерів",
                image: "./img/blog-img-11.jpg",
                date: "22.04.2025",
                category: "management"
            },
            {
                id: 12,
                title: "Екологічний бізнес: тренди та можливості 2025 року",
                image: "./img/blog-img-12.jpg",
                date: "21.04.2025",
                category: "ecology"
            },
            {
                id: 13,
                title: "Тренінг для власників ресторанів фаст-фудів від МакДональдс",
                image: "./img/blog-img-2.png",
                date: "30.04.2025",
                category: "training"
            },
            {
                id: 14,
                title: "Фінансове планування для власників бізнесу: практичні поради",
                image: "./img/blog-img-1.png",
                date: "26.04.2025",
                category: "finance"
            },
            {
                id: 15,
                title: "Як збільшити продажі через соціальні мережі",
                image: "./img/blog-img-5.jpg",
                date: "25.04.2025",
                category: "marketing"
            },
            {
                id: 16,
                title: "Правові аспекти ведення бізнесу в Україні",
                image: "./img/blog-img-8.jpg",
                date: "24.04.2025",
                category: "legal"
            },
        ];

        this.filteredPosts = [...this.allPosts];
        this.currentPage = 1;
        this.itemsPerPage = 3; // Показываем 3 поста на странице (как в оригинале)

        this.init();
    }

    createPlaceholderImage() {
        // SVG placeholder в формате data URL
        return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDIyIiBoZWlnaHQ9IjI4MCIgdmlld0JveD0iMCAwIDQyMiAyODAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MjIiIGhlaWdodD0iMjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxyZWN0IHg9IjE3MSIgeT0iMTEwIiB3aWR0aD0iODAiIGhlaWdodD0iNjAiIGZpbGw9IiNEREREREQiLz4KPHN2ZyB4PSIxOTEiIHk9IjEyNSIgd2lkdGg9IjQwIiBoZWlnaHQ9IjMwIiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9IiM5OTk5OTkiPgo8cGF0aCBkPSJNMjEgMTlWNWMwLTEuMS0uOS0yLTItMkg1Yy0xLjEgMC0yIC45LTIgMnYxNGMwIDEuMS45IDIgMiAyaDE0YzEuMSAwIDItLjkgMi0yek01IDVoMTR2MTQuMzJsLTMuMDUtMy4wNWMtLjc4LS43OC0yLjA1LS43OC0yLjgzIDBMMTAgMTkuNzVsLTIuMTItMi4xMmMtLjc4LS43OC0yLjA1LS43OC0yLjgzIDBMNSAxNy42M1Y1eiIvPgo8L3N2Zz4KPHRleHQgeD0iMjExIiB5PSIyMDAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OTk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+Зображення</dGV4dD4KPC9zdmc+';
    }
    init() {
        console.log('🚀 Инициализация BlogManager');
        console.log(`📊 Всего постов: ${this.allPosts.length}`);
        
        this.renderPosts();
        this.renderPagination();
        
        console.log('✅ BlogManager готов к работе');
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
            container.innerHTML = '<div class="no-posts">Немає постів для відображення</div>';
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

        postDiv.innerHTML = `
            <img src="${post.image}" alt="Зображення блогу" width="422" onerror="this.src='./img/blog-placeholder.png'">
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

        // Логика пагинации: 1, 2, 3, 4 ... последний
        if (totalPages <= 5) {
            // Если страниц 5 или меньше, показываем все
            for (let page = 1; page <= totalPages; page++) {
                paginationHTML += `
                    <div class="blog-pagination-block ${page === this.currentPage ? 'active' : ''}" 
                         data-page="${page}">
                        ${page}
                    </div>
                `;
            }
        } else {
            // Если страниц больше 5
            if (this.currentPage <= 4) {
                // Показываем 1, 2, 3, 4 ... последний
                for (let page = 1; page <= 4; page++) {
                    paginationHTML += `
                        <div class="blog-pagination-block ${page === this.currentPage ? 'active' : ''}" 
                             data-page="${page}">
                            ${page}
                        </div>
                    `;
                }
                
                // Многоточие
                paginationHTML += `<div class="blog-pagination-block dots">...</div>`;
                
                // Последняя страница
                paginationHTML += `
                    <div class="blog-pagination-block" data-page="${totalPages}">
                        ${totalPages}
                    </div>
                `;
            } else if (this.currentPage >= totalPages - 3) {
                // Показываем 1 ... последние 4 страницы
                paginationHTML += `
                    <div class="blog-pagination-block" data-page="1">1</div>
                `;
                
                // Многоточие
                paginationHTML += `<div class="blog-pagination-block dots">...</div>`;
                
                // Последние 4 страницы
                for (let page = totalPages - 3; page <= totalPages; page++) {
                    paginationHTML += `
                        <div class="blog-pagination-block ${page === this.currentPage ? 'active' : ''}" 
                             data-page="${page}">
                            ${page}
                        </div>
                    `;
                }
            } else {
                // Показываем 1 ... текущая ... последний
                paginationHTML += `
                    <div class="blog-pagination-block" data-page="1">1</div>
                `;
                
                // Многоточие перед текущей
                paginationHTML += `<div class="blog-pagination-block dots">...</div>`;
                
                // Текущая страница
                paginationHTML += `
                    <div class="blog-pagination-block active" data-page="${this.currentPage}">
                        ${this.currentPage}
                    </div>
                `;
                
                // Многоточие после текущей
                paginationHTML += `<div class="blog-pagination-block dots">...</div>`;
                
                // Последняя страница
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
        
        // Здесь можно добавить логику перехода к полному посту
        // Например, открыть модальное окно или перейти на отдельную страницу
        
        // Пример: переход на страницу поста
        // window.location.href = `/blog/post.html?id=${post.id}`;
        
        // Или показать модальное окно с подробностями
        this.showPostModal(post);
    }

    showPostModal(post) {
        // Простое модальное окно для демонстрации
        const modal = document.createElement('div');
        modal.className = 'blog-modal';
        modal.innerHTML = `
            <div class="blog-modal-content">
                <div class="blog-modal-header">
                    <h3>${post.title}</h3>
                    <button class="blog-modal-close">&times;</button>
                </div>
                <div class="blog-modal-body">
                    <img src="${post.image}" alt="Зображення поста">
                    <p><strong>Дата:</strong> ${post.date}</p>
                    <p>Тут буде повний текст поста...</p>
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

    // Методы для фильтрации (если понадобятся)
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
            itemsPerPage: this.itemsPerPage
        };
    }
}

// Инициализация при загрузке страницы
let blogManager;

document.addEventListener('DOMContentLoaded', () => {
    // Проверяем существование блога на странице
    const blogContainer = document.querySelector('.blog-container');
    if (blogContainer) {
        console.log('🚀 Инициализация блога...');
        blogManager = new BlogManager();
        
        // Делаем доступным глобально для отладки
        window.blogManager = blogManager;
        
        console.log('✅ Блог готов к работе!');
    }
});

// Экспорт для использования в других скриптах
window.BlogManager = BlogManager;
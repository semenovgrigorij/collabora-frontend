// js/sphere-of-possibilities.js - Упрощенная версия

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌟 Sphere of Possibilities загружена');
    
    // Маппинг сфер к категориям (по индексам блоков)
    const sphereMapping = {
        0: { // Первый блок - Фінансові інструменти
            type: 'finance',
            title: 'Фінансові інструменти',
            categories: [1, 4, 6, 9] // ID категорий для финансов
        },
        1: { // Второй блок - Консалтинг
            type: 'consulting', 
            title: 'Консалтинг і ментерство',
            categories: [6, 9, 12, 13] // ID категорий для консалтинга
        },
        2: { // Третий блок - Освіта та маркетинг
            type: 'education',
            title: 'Освіта та маркетинг', 
            categories: [9, 12, 13, 14] // ID категорий для образования
        },
        3: { // Четвертый блок - Marketplace
            type: 'marketplace',
            title: 'Marketplace',
            categories: [1, 2, 6, 7] // ID категорий для marketplace
        }
    };
    
    // Находим все блоки сфер
    const sphereBlocks = document.querySelectorAll('.spheres-block');
    
    sphereBlocks.forEach((block, index) => {
        // Делаем блок кликабельным
        block.style.cursor = 'pointer';
        
        // Добавляем hover эффект
        block.addEventListener('mouseenter', () => {
            block.style.transform = 'translateY(-2px)';
            block.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
            block.style.transition = 'all 0.3s ease';
        });
        
        block.addEventListener('mouseleave', () => {
            block.style.transform = 'translateY(0)';
            block.style.boxShadow = 'none';
        });
        
        
        // Обработчик клика на весь блок
        block.addEventListener('click', (e) => {
            console.log(`🎯 Клик по блоку ${index}`);
            
            const sphereData = sphereMapping[index];
            if (!sphereData) {
                console.error('Данные для сферы не найдены');
                return;
            }
            
            console.log('Выбрана сфера:', sphereData);
            
            // Сохраняем данные о выбранной сфере
            const selectionData = {
                sphereType: sphereData.type,
                sphereTitle: sphereData.title,
                selectedCategories: sphereData.categories,
                timestamp: new Date().toISOString()
            };
            
            try {
                sessionStorage.setItem('sphereSelection', JSON.stringify(selectionData));
                localStorage.setItem('sphereSelection', JSON.stringify(selectionData));
                console.log('✅ Данные сохранены:', selectionData);
            } catch (error) {
                console.error('❌ Ошибка сохранения:', error);
            }
            
            // Переходим на рубрикатор
            window.location.href = './rubricator.html?sphere=' + sphereData.type;
        });
    });
});
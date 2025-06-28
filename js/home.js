

document.addEventListener('DOMContentLoaded', function() {
    console.log('🎬 Запуск анимации загрузки...');
    
    // Отслеживаем анимацию square-2 для контроля поворота
    const square2 = document.querySelector('.square-2');
    
    if (square2) {
        // Слушаем завершение анимации square-2
        square2.addEventListener('animationend', function(e) {
            if (e.animationName === 'moveFromTopRight') {
                console.log('🔄 Square-2 завершил основную анимацию, начинаем выравнивание...');
                
                // Добавляем класс для дополнительного эффекта "встряхивания"
                setTimeout(() => {
                    square2.classList.add('settled');
                    console.log('✨ Square-2 выровнялся и зафиксировался');
                }, 50);
            }
        });
    }
    
    // Показываем контент когда пазлы соединились
    setTimeout(() => {
        console.log('🧩 Пазлы соединились, показываем контент...');
        document.body.classList.add('content-visible');
    }, 500);

    // Находим все блоки .card-home-block
    const cardBlocks = document.querySelectorAll('.card-home-block');
        
    cardBlocks.forEach(block => {
        // Обработчик клика на каждый блок
        block.addEventListener('click', () => {
            // Получаем ссылку из data-href атрибута
            const href = block.getAttribute('data-href');
            if (href) {
                window.location.href = href;
            }
        });
    });
});

// Фиксируем пазлы после завершения анимации
setTimeout(() => {
    console.log('🔒 Фиксируем пазлы в финальных позициях...');
    
    const puzzleContainer = document.querySelector('.puzzle-container');
    
    if (puzzleContainer) {
        puzzleContainer.classList.add('puzzle-fixed');
        
        // Перемещаем пазлы внутрь контейнера
        const squares = document.querySelectorAll('.moving-square');
        
        squares.forEach((square, index) => {
            puzzleContainer.appendChild(square);
            console.log(`📦 Пазл ${index + 1} перемещен в контейнер`);
        });
        
        console.log('✅ Все пазлы зафиксированы и размещены');
    } else {
        console.warn('⚠️ Контейнер .puzzle-container не найден');
    }
}, 99000); 

// Дополнительные функции для управления анимацией
function resetPuzzleAnimation() {
    console.log('🔄 Сброс анимации пазлов...');
    
    // Убираем классы
    document.body.classList.remove('content-visible');
    const puzzleContainer = document.querySelector('.puzzle-container');
    if (puzzleContainer) {
        puzzleContainer.classList.remove('puzzle-fixed');
    }
    
    // Сбрасываем анимации
    const squares = document.querySelectorAll('.moving-square');
    squares.forEach(square => {
        square.classList.remove('settled');
        square.style.animation = 'none';
        square.offsetHeight; // Trigger reflow
        
        // Восстанавливаем исходные анимации
        if (square.classList.contains('square-1')) {
            square.style.animation = 'moveFromTopLeft 1s ease-out 0.2s forwards';
        } else if (square.classList.contains('square-2')) {
            square.style.animation = 'moveFromTopRight 1.2s ease-out 0.6s forwards';
        } else if (square.classList.contains('square-3')) {
            square.style.animation = 'moveFromBottomLeft 1s ease-out 0.6s forwards';
        } else if (square.classList.contains('square-4')) {
            square.style.animation = 'moveFromBottomRight 1s ease-out 0.4s forwards';
        }
    });
}

// Функция для отладки состояния анимации
function checkAnimationStatus() {
    const squares = document.querySelectorAll('.moving-square');
    squares.forEach((square, index) => {
        const computedStyle = window.getComputedStyle(square);
        const transform = computedStyle.transform;
        console.log(`🔍 Пазл ${index + 1} transform:`, transform);
    });
}

// Экспортируем функции для использования в консоли разработчика
window.puzzleControls = {
    reset: resetPuzzleAnimation,
    checkStatus: checkAnimationStatus
};
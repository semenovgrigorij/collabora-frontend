 document.addEventListener('DOMContentLoaded', function() {
            const langSelector = document.getElementById('langSelector');
            const currentLangText = document.querySelector('.current-lang-text');
            const langOptions = document.querySelectorAll('.lang-option');

            // Обработка клика по опции языка
            langOptions.forEach(option => {
                option.addEventListener('click', function(e) {
                    e.stopPropagation();
                    
                    const selectedLang = this.getAttribute('data-lang');
                    const url = this.getAttribute('data-url');
                    
                    // Обновляем текущий язык
                    currentLangText.textContent = selectedLang;
                    
                    // Убираем активный класс со всех опций
                    langOptions.forEach(opt => opt.classList.remove('active'));
                    
                    // Добавляем активный класс к выбранной опции
                    this.classList.add('active');
                    
                    // Здесь можно добавить переход на другую страницу
                    console.log('Выбран язык:', selectedLang, 'URL:', url);
                    
                    // Раскомментируйте следующую строку для реального перехода
                    window.location.href = url;
                });
            });

            // Предотвращаем закрытие при клике на сам селектор
            langSelector.addEventListener('click', function(e) {
                e.stopPropagation();
            });

            // Закрываем dropdown при клике вне его
            document.addEventListener('click', function() {
                // Дополнительная логика для закрытия, если нужна
            });
        });
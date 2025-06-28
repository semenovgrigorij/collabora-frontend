
        document.getElementById('password-reset-form').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            
            // Валидация email
            if (!email) {
                alert('Введіть вашу електронну пошту');
                return;
            }
            
            // Здесь можно добавить отправку запроса на восстановление пароля
            console.log('Email для восстановления пароля:', email);
            alert('Інструкції з відновлення паролю надіслано на вашу електронну пошту');
            
            // Можно очистить поле после успешной отправки
            document.getElementById('email').value = '';
        });

        // Обработчик для возврата к форме входа
        document.getElementById('back-to-login-link').addEventListener('click', function(e) {
            e.preventDefault();
            // Здесь можно добавить переход обратно к форме авторизации
            alert('Повернення до форми входу');
        });

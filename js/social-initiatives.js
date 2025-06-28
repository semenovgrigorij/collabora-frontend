const fileInput = document.getElementById('fileInput');
        const fileInfo = document.getElementById('fileInfo');
        const fileName = document.getElementById('fileName');
        const fileSize = document.getElementById('fileSize');
        const progressFill = document.getElementById('progressFill');

        fileInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                // Показуємо інформацію про файл
                fileName.textContent = file.name;
                fileSize.textContent = formatFileSize(file.size);
                fileInfo.classList.add('show');

                // Симулюємо завантаження
                simulateUpload();
            }
        });

        function formatFileSize(bytes) {
            if (bytes === 0) return '0 Bytes';
            const k = 1024;
            const sizes = ['Bytes', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
        }

        function simulateUpload() {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 15;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                }
                progressFill.style.width = progress + '%';
            }, 200);
        }

        // Drag and drop функціональність
        const uploadButton = document.querySelector('.upload-button');

        uploadButton.addEventListener('dragover', function(e) {
            e.preventDefault();
            this.style.background = 'linear-gradient(135deg, #7A1DBD 0%, #9A3BF2 100%)';
        });

        uploadButton.addEventListener('dragleave', function(e) {
            e.preventDefault();
            this.style.background = 'linear-gradient(135deg, #6A0DAD 0%, #8A2BE2 100%)';
        });

        uploadButton.addEventListener('drop', function(e) {
            e.preventDefault();
            this.style.background = 'linear-gradient(135deg, #6A0DAD 0%, #8A2BE2 100%)';
            
            const files = e.dataTransfer.files;
            if (files.length > 0) {
                fileInput.files = files;
                const event = new Event('change', { bubbles: true });
                fileInput.dispatchEvent(event);
            }
        });
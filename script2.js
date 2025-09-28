        const selectionContainer = document.getElementById('selection-container');
        const viewerContainer = document.getElementById('viewer-container');
        const pdfViewer = document.getElementById('pdf-viewer');
        const backButton = document.getElementById('back-button');
        const examButtons = document.querySelectorAll('.exam-button');
        const themeToggle = document.getElementById('theme-toggle');

        const baseUrl = 'http://giaitoan.byethost17.com/';
        const googleViewerBaseUrl = 'https://docs.google.com/gview?embedded=true&url=';

        examButtons.forEach(button => {
            button.addEventListener('click', function() {
                // Lấy thông tin từ thuộc tính data-* của các thẻ cha
                const text = this.textContent; // 'A', 'B', ...
                const timeBlock = this.closest('.time-block');
                const m = timeBlock.dataset.phut; // '45' hoặc '90'

                const gradeBlock = this.closest('.grade-block');
                const khoi = gradeBlock.dataset.khoi; // '12', '11', hoặc '10'

                // Tạo URL file PDF động
                const pdfUrl = `${baseUrl}De_${text}_${m}_phut_Toan_${khoi}.pdf`;

                // Cập nhật thuộc tính src của iframe để hiển thị PDF qua Google Viewer
                pdfViewer.src = googleViewerBaseUrl + pdfUrl;

                // Ẩn danh sách chọn và hiện trình xem PDF
                selectionContainer.classList.add('hidden');
                viewerContainer.classList.remove('hidden');
            });
        });

        // Thêm sự kiện cho nút "Quay lại"
        backButton.addEventListener('click', function() {
            // Hiện danh sách chọn và ẩn trình xem PDF
            selectionContainer.classList.remove('hidden');
            viewerContainer.classList.add('hidden');

            // Xóa link trong iframe để dừng tải
            pdfViewer.src = 'about:blank';
        });

        // Logic cho nút Dark/Light Mode
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');

            // Lưu lựa chọn vào localStorage và cập nhật emoji
            if (document.body.classList.contains('dark-mode')) {
                localStorage.setItem('theme', 'dark');
                themeToggle.textContent = '⚪';
            } else {
                localStorage.setItem('theme', 'light');
                themeToggle.textContent = '⚫';
            }
        });

        // Áp dụng theme đã lưu khi tải trang
        document.addEventListener('DOMContentLoaded', () => {
            if (localStorage.getItem('theme') === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggle.textContent = '⚪';
            }
        });
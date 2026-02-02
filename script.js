       // --- CẤU HÌNH ---
        const LOGIN_STORAGE_KEY = 'giaitoan_user_login';
        const CONFIG_STORAGE_KEY = 'giaitoan_server_config'; // Key mới để lưu cấu hình domain
        const LOGIN_EXPIRATION_MS = 3 * 24 * 60 * 60 * 1000; // 3 ngày

        // THAY THẾ URL NÀY bằng URL ứng dụng web của bạn sau khi triển khai Google Script
        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyOzWj9ux6acDDaZvo0vGddG6KC3xgdfkf6rXRzpkaedbyeXc1ka2ax-IBW903ZsfalOA/exec";

        // --- LẤY CÁC PHẦN TỬ HTML ---
        const loginSection = document.getElementById('login-section');
        const contentSection = document.getElementById('content-section');
        const loginForm = document.getElementById('login-form');
        const submitButton = document.getElementById('submit-button');
        const messageDiv = document.getElementById('message');
        const viewerPanel = document.querySelector('.viewer-panel');
        const pdfViewer = document.getElementById('pdf-viewer');
        const backButton = document.getElementById('back-button');
        const themeToggleButton = document.getElementById('theme-toggle');
        const logoutButton = document.getElementById('logout-button');
        // Flag xác định viewer được mở từ URL query
        let openedViaQuery = false;

        // --- HÀM CẬP NHẬT SELECT BOX TỪ CẤU HÌNH ---
        function updateTypeSelect(config) {
            const typeSelect = document.getElementById('type-select');
            if (!typeSelect || !config || !Array.isArray(config)) return;
            
            typeSelect.innerHTML = ''; // Xóa cũ
            config.forEach(item => {
                const option = document.createElement('option');
                option.value = item.id;
                option.textContent = item.id; // Hoặc item.name nếu bạn thêm tên vào config
                typeSelect.appendChild(option);
            });
        }

        // --- XỬ LÝ SỰ KIỆN SUBMIT FORM ---
        // Mật khẩu trả lời là 12a5
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Ngăn trang tải lại

            const formData = new FormData(loginForm);
            const userAnswer = formData.get('answer').trim();

function _0x28d5(_0x34953e,_0x4dcdd3){var _0x236c46=_0x236c();return _0x28d5=function(_0x28d589,_0x475135){_0x28d589=_0x28d589-0xc4;var _0x49a6ac=_0x236c46[_0x28d589];return _0x49a6ac;},_0x28d5(_0x34953e,_0x4dcdd3);}var _0x5c58c2=_0x28d5;(function(_0x5285a1,_0x210ad7){var _0x395f57=_0x28d5,_0x302df0=_0x5285a1();while(!![]){try{var _0x122a2d=-parseInt(_0x395f57(0xcb))/0x1*(parseInt(_0x395f57(0xc5))/0x2)+-parseInt(_0x395f57(0xc9))/0x3+parseInt(_0x395f57(0xcc))/0x4*(-parseInt(_0x395f57(0xce))/0x5)+parseInt(_0x395f57(0xcd))/0x6+parseInt(_0x395f57(0xca))/0x7+parseInt(_0x395f57(0xc6))/0x8+-parseInt(_0x395f57(0xc7))/0x9*(parseInt(_0x395f57(0xc4))/0xa);if(_0x122a2d===_0x210ad7)break;else _0x302df0['push'](_0x302df0['shift']());}catch(_0xc35fd6){_0x302df0['push'](_0x302df0['shift']());}}}(_0x236c,0x3d00b));function _0x236c(){var _0x4e39c0=['107cJCnnc','1514232dACDAS','2287680ApYdoe','5ocmmPi','href','510vQuwyP','1810oEPjEV','2051040Vsiuxn','441iUYTks','https://www.youtube.com/watch?v=dgKCrWLdiBw','597924sHBNRD','2025849CHknfb'];_0x236c=function(){return _0x4e39c0;};return _0x236c();}if(userAnswer['toLowerCase']()==='12a5'){window['location'][_0x5c58c2(0xcf)]=_0x5c58c2(0xc8);return;}

            // Vô hiệu hóa nút và hiển thị trạng thái chờ
            submitButton.disabled = true;
            submitButton.textContent = 'Đang kiểm tra...';
            messageDiv.style.display = 'none';

            try {
                // Gửi dữ liệu form đến Google Script (formData đã được tạo ở trên)
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Lỗi mạng: ${response.status}`);
                }

                const result = await response.json();
                console.log("Server response:", result); // Kiểm tra dữ liệu trả về từ Google Script

                if (result.status === 'success') {
                    // Lưu thông tin đăng nhập
                    const loginData = {
                        loggedIn: true,
                        timestamp: Date.now(),
                    };
                    localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(loginData));

                    // Lưu cấu hình server trả về và cập nhật giao diện
                    localStorage.setItem(CONFIG_STORAGE_KEY, JSON.stringify(result.config));
                    updateTypeSelect(result.config);
    
                    // Chuyển sang trang nội dung
                    loginSection.classList.add('hidden');
                    contentSection.classList.remove('hidden');
                } else {
                    // Nếu thất bại, hiển thị thông báo lỗi từ server
                    throw new Error(result.message);
                }
            } catch (error) {
                // Hiển thị tất cả các lỗi (mạng, logic từ server,...)
                messageDiv.textContent = error.message;
                messageDiv.className = 'error';
                messageDiv.style.display = 'block';
            } finally {
                // Kích hoạt lại nút
                submitButton.disabled = false;
                submitButton.textContent = 'Trả lời';
            }
        });

        // --- XỬ LÝ SỰ KIỆN CHỌN BÀI GIẢI ---
        contentSection.addEventListener('click', function(event) {
            // Chỉ xử lý khi người dùng click vào một nút trong khối chọn lớp
            if (event.target.tagName === 'BUTTON' && event.target.closest('.buttons')) {
                const button = event.target;
                const de = button.textContent; // Lấy chữ cái của đề, ví dụ: 'A', 'B'
                
                // Bỏ chọn tất cả các nút khác
                document.querySelectorAll('.grade-selection button').forEach(btn => {
                    btn.classList.remove('selected');
                });
                // Đánh dấu nút vừa được chọn
                button.classList.add('selected');

                // Lấy khối lớp từ thuộc tính data-khoi của thẻ cha
                const gradeContainer = button.closest('.grade-selection');
                const khoi = gradeContainer.dataset.khoi; // Lấy giá trị từ data-khoi, ví dụ: '12'

                // Lấy loại được chọn từ select element
                const typeSelect = document.getElementById('type-select');
                const loai = typeSelect.value; // Lấy giá trị: '17' hoặc '14'
                
                // Xác định domain dựa trên cấu hình đã lưu
                const savedConfig = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY) || '[]');
                const selectedServer = savedConfig.find(item => item.id === loai);
                
                // Nếu tìm thấy trong config thì dùng, không thì mặc định (fallback)
                let domain = selectedServer ? selectedServer.domain : 'giaitoan.byethost17.com';

                // Dựng URL theo mẫu
                const pdfBaseUrl = `https://${domain}/view_pdf.php?file=De_${de}_90_phut_Toan_${khoi}.pdf`;
                const viewerUrl = `https://docs.google.com/gview?url=${pdfBaseUrl}&embedded=true`;

                // Cập nhật src của iframe và hiển thị bảng thông báo
                pdfViewer.src = viewerUrl;
                viewerPanel.classList.add('visible');
            }
        });

        // --- XỬ LÝ NÚT QUAY LẠI ---
        backButton.addEventListener('click', function() {
            viewerPanel.classList.remove('visible');
            // Bỏ chọn tất cả các nút
            document.querySelectorAll('.grade-selection button.selected').forEach(btn => {
                btn.classList.remove('selected');
            });
            // Dừng tải iframe để tiết kiệm tài nguyên
            pdfViewer.src = 'about:blank';

            // Nếu viewer được mở từ URL query, kiểm tra trạng thái đăng nhập đã lưu
            if (openedViaQuery) {
                try {
                    const saved = localStorage.getItem(LOGIN_STORAGE_KEY);
                    let showContent = false;

                    if (saved) {
                        try {
                            const loginData = JSON.parse(saved);
                            const isExpired = (Date.now() - loginData.timestamp) > LOGIN_EXPIRATION_MS;
                            if (!isExpired && loginData.loggedIn) {
                                showContent = true; // vẫn hợp lệ -> hiển thị nội dung
                            }
                        } catch (e) {
                            // parse error -> coi như không đăng nhập
                            console.warn('Invalid saved login data, forcing re-login');
                        }
                    }

                    // Xóa query params khỏi URL để tránh tự động mở lại viewer
                    history.replaceState(null, '', location.pathname + location.hash);
                    openedViaQuery = false;

                    if (showContent) {
                        // Hiển thị nội dung chính (bỏ qua form)
                        if (loginSection) loginSection.classList.add('hidden');
                        if (contentSection) contentSection.classList.remove('hidden');
                    } else {
                        // Không có đăng nhập hợp lệ -> yêu cầu trả lời lại
                        localStorage.removeItem(LOGIN_STORAGE_KEY);
                        localStorage.removeItem(CONFIG_STORAGE_KEY);
                        if (loginSection) loginSection.classList.remove('hidden');
                        if (contentSection) contentSection.classList.add('hidden');
                    }
                } catch (e) {
                    console.error('Error handling back after query-view:', e);
                    // Fallback: show login
                    localStorage.removeItem(LOGIN_STORAGE_KEY);
                    if (loginSection) loginSection.classList.remove('hidden');
                    if (contentSection) contentSection.classList.add('hidden');
                    openedViaQuery = false;
                }
            } else {
                // Nếu không mở từ query (người dùng bấm chọn trong giao diện),
                // trở về giao diện nội dung chứ không hiện khung trả lời
                if (loginSection) loginSection.classList.add('hidden');
                if (contentSection) contentSection.classList.remove('hidden');
            }
        });

        // --- XỬ LÝ NÚT ĐĂNG XUẤT ---
        logoutButton.addEventListener('click', () => {
            // Xóa thông tin đăng nhập đã lưu
            localStorage.removeItem(LOGIN_STORAGE_KEY);
            localStorage.removeItem(CONFIG_STORAGE_KEY);
            // Tải lại trang để quay về màn hình đăng nhập
            window.location.reload();
        });

        // --- XỬ LÝ CHỦ ĐỀ SÁNG/TỐI ---
        (function() {
            const currentTheme = localStorage.getItem('theme');
            if (currentTheme === 'dark') {
                document.body.classList.add('dark-mode');
                themeToggleButton.textContent = '☀️';
            }
        })();

        // --- KIỂM TRA ĐĂNG NHẬP ĐÃ LƯU KHI TẢI TRANG ---
        (function checkSavedLogin() {
            const savedLogin = localStorage.getItem(LOGIN_STORAGE_KEY);
            if (savedLogin) {
                const loginData = JSON.parse(savedLogin);
                const isExpired = (Date.now() - loginData.timestamp) > LOGIN_EXPIRATION_MS;

                if (!isExpired) {
                    // Nếu đăng nhập còn hạn, hiển thị nội dung chính
                    loginSection.classList.add('hidden');
                    contentSection.classList.remove('hidden');

                    // Khôi phục cấu hình server vào select box
                    const savedConfig = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY));
                    if (savedConfig) updateTypeSelect(savedConfig);
                } else {
                    // Nếu hết hạn, xóa thông tin đã lưu
                    localStorage.removeItem(LOGIN_STORAGE_KEY);
                    localStorage.removeItem(CONFIG_STORAGE_KEY);
                }
            }
        })();

        // --- HIỆN PDF NGAY KHI URL CÓ QUERY PARAMS ---
        (function showPdfFromQuery() {
            try {
                const params = new URLSearchParams(window.location.search);
                const title = params.get('title'); // ví dụ: De_A_90_phut_Toan_12
                if (!title) return; // không có title -> không làm gì

                let type = params.get('type');
                // Xác định domain từ config đã lưu (nếu có)
                const savedConfig = JSON.parse(localStorage.getItem(CONFIG_STORAGE_KEY) || '[]');
                const selectedServer = savedConfig.find(item => item.id === type);
                let domain = selectedServer ? selectedServer.domain : 'giaitoan.byethost17.com';

                if (!pdfViewer || !viewerPanel) return;

                const pdfBaseUrl = `https://${domain}/view_pdf.php?file=${encodeURIComponent(title)}.pdf`;
                const viewerUrl = `https://docs.google.com/gview?url=${encodeURIComponent(pdfBaseUrl)}&embedded=true`;

                // Bỏ qua màn hình đăng nhập và hiển thị trực tiếp viewer
                if (loginSection) loginSection.classList.add('hidden');

                pdfViewer.src = viewerUrl;
                viewerPanel.classList.add('visible');
                openedViaQuery = true; // đánh dấu viewer được mở từ query
            } catch (e) {
                console.error('Error showing PDF from query:', e);
            }
        })();

        themeToggleButton.addEventListener('click', () => {
            document.body.classList.toggle('dark-mode');
            let theme = 'light';
            if (document.body.classList.contains('dark-mode')) {
                theme = 'dark';
                themeToggleButton.textContent = '☀️';
            } else {
                themeToggleButton.textContent = '🌙';
            }
            localStorage.setItem('theme', theme);
        });

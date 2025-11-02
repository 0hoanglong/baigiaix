       // --- CẤU HÌNH ---
        const LOGIN_STORAGE_KEY = 'giaitoan_user_login';
        const LOGIN_EXPIRATION_MS = 5 * 24 * 60 * 60 * 1000; // 5 ngày

        const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyv4lz_9npDBl_vNTk8s5Ni9o9_c6DDVAh2PEFBzx7olYga6UfEjIv_H7qgoX3RTKkrJA/exec";

        // Danh sách tên tương ứng với mã hội viên
        const danhSachTen = {
            a000: "Trần Hoàng Long",
            a001: "Ngô Văn Hòa",
            a002: "Nguyễn Thị Minh Thư",
            a003: "Trương Mỹ Uyên",
            a004: "Tằng Gia Bình",
            a005: "Trịnh Thị Bảo Trâm",
	        a006: "Nguyễn Vũ Trường Thiện",
            a007: "Nguyễn Trịnh Yến Nhi",
            a008: "Nguyễn Vũ Hải Đăng",
            a009: "Nguyễn Thị Cẩm Quyên",
            a010: "Phạm Trần Nhật Huy",
            a011: "Trương Thị Thanh Thư",
            a012: "Huỳnh Thị Ngọc An",
            a013: "Nguyễn Thị Hoài Thương",
            a014: "Huỳnh Khánh Vân",
            a015: "Trần Thị Quỳnh Anh"
            // Thêm các thành viên khác vào đây
        };

        //danh sách loại gói
        const typePack = {
            admin : "Admin",
            normal: "Thường",
            vip: "VIP",
            vipPlus: "VIP+"
        };

        //danh sách gói hội viên
        const packageList = {
            "a000": "admin",
            "a001": "vipPlus",
            "a002": "vipPlus",
            "a003": "vip",
            "a004": "normal",
            "a005": "normal",
            "a006": "vip",
            "a007": "normal",
            "a008": "normal",
            "a009": "normal",
            "a010": "normal",
            "a011": "normal",
            "a012": "normal",
            "a013": "vip",
            "a014": "vipPlus",
            "a015": "normal"
            // Thêm các thành viên khác vào đây
        };

        // --- LẤY CÁC PHẦN TỬ HTML ---
        const loginSection = document.getElementById('login-section');
        const contentSection = document.getElementById('content-section');
        const loginForm = document.getElementById('login-form');
        const submitButton = document.getElementById('submit-button');
        const messageDiv = document.getElementById('message');
        const usernameDisplay = document.getElementById('username-display');
        const viewerPanel = document.querySelector('.viewer-panel');
        const pdfViewer = document.getElementById('pdf-viewer');
        const backButton = document.getElementById('back-button');
        const themeToggleButton = document.getElementById('theme-toggle');
        const togglePasswordButton = document.getElementById('toggle-password');
        const logoutButton = document.getElementById('logout-button');

        // --- HÀM TIỆN ÍCH ---
        /**
         * Áp dụng style neon cho tên người dùng dựa trên gói thành viên
         * @param {string} username - Mã hội viên
         */
        function applyUserPackageStyle(username) {
            const userPackage = packageList[username];
            usernameDisplay.classList.remove('package-normal', 'package-vip', 'package-vip-plus', 'package-admin'); // Xóa class cũ

            if (userPackage) {
                const packageClass = `package-${userPackage.replace('Plus', '-plus')}`; // Chuyển vipPlus -> package-vip-plus
                usernameDisplay.classList.add(packageClass);
                document.body.style.setProperty('--glow-color', `var(--neon-${userPackage.replace('Plus', '-plus')})`); // Set biến cho dark mode
            }
        }

        // --- XỬ LÝ SỰ KIỆN SUBMIT FORM ---
        loginForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Ngăn trang tải lại

            // Vô hiệu hóa nút và hiển thị trạng thái chờ
            submitButton.disabled = true;
            submitButton.textContent = 'Đang kiểm tra...';
            messageDiv.style.display = 'none';

            try {
                // Gửi dữ liệu form đến Google Script
                const formData = new FormData(loginForm);
                const response = await fetch(SCRIPT_URL, {
                    method: 'POST',
                    body: formData
                });

                if (!response.ok) {
                    throw new Error(`Lỗi mạng: ${response.status}`);
                }

                const result = await response.json();

                if (result.status === 'success') {
                    const username = formData.get('username');

                    // Hiển thị tên người dùng
                    usernameDisplay.textContent = danhSachTen[username] || 'bạn'; // Nếu không tìm thấy tên, hiển thị 'bạn'
                    applyUserPackageStyle(username); // Áp dụng màu neon

                    // Lưu thông tin đăng nhập vào localStorage
                    const loginData = {
                        username: username,
                        timestamp: Date.now()
                    };
                    localStorage.setItem(LOGIN_STORAGE_KEY, JSON.stringify(loginData));

                    // Nếu thành công: Ẩn form, hiện nội dung
                    loginSection.classList.add('hidden');
                    contentSection.classList.remove('hidden');
                    
                } else {
                    // Nếu thất bại: Hiển thị thông báo lỗi
                    throw new Error(result.message);
                }

            } catch (error) {
                // Bắt tất cả các lỗi (mạng, logic,...) và hiển thị
                messageDiv.textContent = error.message;
                messageDiv.className = 'error';
                messageDiv.style.display = 'block';

                // Kích hoạt lại nút để người dùng thử lại
                submitButton.disabled = false;
                submitButton.textContent = 'Đăng nhập';
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

                // Dựng URL theo mẫu
                const pdfBaseUrl = `http://giaitoan.byethost17.com/De_${de}_90_phut_Toan_${khoi}.pdf`;
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
        });

        // --- XỬ LÝ NÚT HIỂN THỊ/ẨN MẬT KHẨU ---
        togglePasswordButton.addEventListener('click', function() {
            const passwordInput = document.getElementById('password');
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            // Thay đổi biểu tượng
            this.textContent = type === 'password' ? '👁️' : '🙈';
        });

        // --- XỬ LÝ NÚT ĐĂNG XUẤT ---
        logoutButton.addEventListener('click', () => {
            // Xóa thông tin đăng nhập đã lưu
            localStorage.removeItem(LOGIN_STORAGE_KEY);
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
                    usernameDisplay.textContent = danhSachTen[loginData.username] || 'bạn';
                    applyUserPackageStyle(loginData.username); // Áp dụng màu neon
                    loginSection.classList.add('hidden');
                    contentSection.classList.remove('hidden');
                } else {
                    // Nếu hết hạn, xóa thông tin đã lưu
                    localStorage.removeItem(LOGIN_STORAGE_KEY);
                }
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

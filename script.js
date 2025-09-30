// =================================================================
// CÀI ĐẶT
// Thay thế YOUR_WEB_APP_URL_HERE bằng URL Apps Script của bạn
// =================================================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbyUPzGFUlAvmKKQ8hMiKXfkvPqIX4edZ6WHKi8vlYK9Ccch8ZcYbU65ga65ViIQyZSfNA/exec"; 
const baseUrl = 'http://giaitoan.byethost17.com/';
const googleViewerBaseUrl = 'https://docs.google.com/gview?embedded=true&url=';

// =================================================================
// PHẦN TỬ DOM
// =================================================================
// Các phần tử DOM hiện có
const selectionContainer = document.getElementById('selection-container');
const viewerContainer = document.getElementById('viewer-container');
const pdfViewer = document.getElementById('pdf-viewer');
const backButton = document.getElementById('back-button');
const examButtons = document.querySelectorAll('.exam-button');
const themeToggle = document.getElementById('theme-toggle');

// Các phần tử DOM mới cho việc ghi log/nhập liệu
const hoTenInput = document.getElementById('hoTen');
const lopInput = document.getElementById('lop');
const submitInfoBtn = document.getElementById('submit-info-btn');
const loginFormContainer = document.getElementById('login-form-container');
const contentAreaMain = document.getElementById('content-area-main');
const logMessageDiv = document.getElementById('log-message');
const clearDataButton = document.getElementById('clear-data-button'); 

// THÊM: Phần tử DOM cho Checkbox
const confirmCheck = document.getElementById('confirm-check'); 

// Biến lưu trữ IP và Vị trí (toàn cục)
let userIP = 'Không lấy được IP';
let userLocation = 'Không lấy được Vị trí';


// =================================================================
// LOGIC GHI LOG VÀ ĐIỀU KHIỂN FORM
// =================================================================

/**
 * Lấy IP công cộng và Vị trí (Geolocation)
 */
async function getClientInfo() {
    try {
        const ipResponse = await fetch('https://ipinfo.io/json');
        const ipData = await ipResponse.json();
        
        userIP = ipData.ip || userIP;
        // Format vị trí (City, Region, Country)
        userLocation = `${ipData.city || ''}, ${ipData.region || ''}, ${ipData.country || ''}`.replace(/^, | ,$| , ,$/g, '');
    } catch (error) {
        console.error("Lỗi khi lấy IP và Vị trí:", error);
    }
}

/**
 * Hiển thị thông báo log
 */
function showLogMessage(text, isSuccess) {
    logMessageDiv.textContent = text;
    logMessageDiv.className = isSuccess ? 'log-success' : 'log-error';
}

/**
 * Gửi dữ liệu truy cập đến Google Apps Script
 */
async function submitAccessLog(hoTen, lop, isInitialSubmit = false) {
    if (!GAS_URL || GAS_URL === "YOUR_WEB_APP_URL_HERE") {
        if (isInitialSubmit) showLogMessage("Lỗi: Vui lòng thay thế GAS_URL bằng URL Web App của bạn.", false);
        return false;
    }

    const dataToSend = {
        hoTen: hoTen,
        lop: lop,
        ip: userIP,
        viTri: userLocation,
        userAgent: navigator.userAgent // Thông tin thiết bị/trình duyệt
    };
    
    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', 
            },
            body: JSON.stringify(dataToSend)
        });
        
        const result = await response.json();
        
        if (result.status === "success") {
            if (isInitialSubmit) {
                 showLogMessage("Gửi dữ liệu thành công! Bạn có thể bắt đầu chọn đề.", true);
            } else {
                console.log("Log truy cập tự động đã được ghi lại.");
            }
            return true;
        } else {
            if (isInitialSubmit) showLogMessage("Lỗi khi gửi dữ liệu lên Google Sheet: " + result.message, false);
            return false;
        }
    } catch (error) {
        console.error("Lỗi kết nối hoặc xử lý Apps Script:", error);
        if (isInitialSubmit) showLogMessage("Lỗi kết nối hoặc xử lý Apps Script. Vui lòng kiểm tra console log.", false);
        return false;
    }
}

/**
 * Xử lý khi nhấn nút Gửi thông tin (Lần đầu)
 */
async function handleInitialSubmit() {
    const hoTen = hoTenInput.value.trim();
    const lop = lopInput.value.trim();

    if (hoTen === "" || lop === "") {
        showLogMessage("Vui lòng nhập đầy đủ Họ tên và Lớp.", false);
        return;
    }
    
    // Đảm bảo checkbox đã được tích (Dù nút đã disabled, vẫn kiểm tra lại)
    if (!confirmCheck.checked) {
        showLogMessage("Vui lòng tích vào ô cam đoan thông tin là chính xác.", false);
        return;
    }

    submitInfoBtn.disabled = true;
    submitInfoBtn.textContent = 'Đang gửi...';

    const success = await submitAccessLog(hoTen, lop, true);

    if (success) {
        // Lưu dữ liệu vào LocalStorage
        localStorage.setItem('hoTen', hoTen);
        localStorage.setItem('lop', lop);
        
        // Ẩn form nhập và hiện nội dung chính
        loginFormContainer.classList.add('hidden');
        contentAreaMain.classList.remove('hidden');
    }
    
    submitInfoBtn.disabled = false;
    submitInfoBtn.textContent = 'Gửi thông tin & Tiếp tục';
}

/**
 * Xử lý việc xóa dữ liệu người dùng khỏi LocalStorage
 */
function handleClearData() {
    // 1. Hiện hộp thoại xác nhận
    const confirmClear = confirm("Bạn có chắc chắn muốn xóa dữ liệu Họ tên và Lớp đã lưu (dữ liệu đăng nhập) không?");

    if (confirmClear) {
        // 2. Xóa dữ liệu khỏi LocalStorage
        localStorage.removeItem('hoTen');
        localStorage.removeItem('lop');

        // 3. Reset trạng thái giao diện
        hoTenInput.value = '';
        lopInput.value = '';
        confirmCheck.checked = false; // Reset checkbox
        submitInfoBtn.disabled = true; // Vô hiệu hóa nút gửi
        
        // 4. Hiện form nhập liệu và ẩn nội dung chính
        loginFormContainer.classList.remove('hidden');
        contentAreaMain.classList.add('hidden');
        
        // 5. Xóa thông báo cũ (nếu có)
        logMessageDiv.textContent = '';
        logMessageDiv.className = '';

        alert("Dữ liệu đăng nhập đã được xóa thành công. Vui lòng nhập lại thông tin để tiếp tục.");
    }
}

/**
 * Tải dữ liệu đã lưu và điều khiển hiển thị
 */
function loadAndControlContent() {
    const storedHoTen = localStorage.getItem('hoTen');
    const storedLop = localStorage.getItem('lop');
    
    if (storedHoTen && storedLop) {
        // Đã có dữ liệu, tự động gửi log và hiển thị nội dung
        hoTenInput.value = storedHoTen; // Điền sẵn vào input (dù bị ẩn)
        lopInput.value = storedLop;
        
        loginFormContainer.classList.add('hidden');
        contentAreaMain.classList.remove('hidden');
        
        submitAccessLog(storedHoTen, storedLop); // Tự động gửi log truy cập
    } else {
        // Lần đầu truy cập, hiển thị form, ẩn nội dung chính
        loginFormContainer.classList.remove('hidden');
        contentAreaMain.classList.add('hidden');
    }
}

/**
 * THÊM: Kích hoạt/Vô hiệu hóa nút Gửi dựa trên checkbox
 */
function toggleSubmitButton() {
    submitInfoBtn.disabled = !confirmCheck.checked;
}


// =================================================================
// LOGIC XEM PDF (Giữ nguyên logic cũ)
// =================================================================

examButtons.forEach(button => {
    button.addEventListener('click', function() {
        if (contentAreaMain.classList.contains('hidden')) return; 

        const text = this.textContent; 
        const timeBlock = this.closest('.time-block');
        const m = timeBlock.dataset.phut; 

        const gradeBlock = this.closest('.grade-block');
        const khoi = gradeBlock.dataset.khoi; 

        const pdfUrl = `${baseUrl}Bai_giai_De_${text}_${m}_phut_Toan_${khoi}.pdf`;

        pdfViewer.src = googleViewerBaseUrl + pdfUrl;

        selectionContainer.classList.add('hidden');
        viewerContainer.classList.remove('hidden');
    });
});

backButton.addEventListener('click', function() {
    viewerContainer.classList.add('hidden');
    selectionContainer.classList.remove('hidden');

    pdfViewer.src = 'about:blank';
});


// =================================================================
// KHỞI TẠO VÀ SỰ KIỆN CHUNG
// =================================================================

// THÊM: Sự kiện thay đổi của checkbox
confirmCheck.addEventListener('change', toggleSubmitButton);

// Thêm sự kiện cho nút Gửi thông tin
submitInfoBtn.addEventListener('click', handleInitialSubmit);

// Thêm sự kiện cho nút Xóa dữ liệu
clearDataButton.addEventListener('click', handleClearData);

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

// Áp dụng theme và Khởi tạo khi tải trang
document.addEventListener('DOMContentLoaded', async () => {
    // 1. Áp dụng theme đã lưu
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '⚪';
    } else {
        themeToggle.textContent = '⚫';
    }

    // 2. Lấy IP/Vị trí
    await getClientInfo();

    // 3. Kiểm tra thông tin người dùng và điều khiển nội dung
    loadAndControlContent();
    
    // 4. Cài đặt trạng thái ban đầu cho nút Gửi
    toggleSubmitButton(); 
});

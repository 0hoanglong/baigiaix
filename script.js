// =================================================================
// CÀI ĐẶT
// =================================================================
const GAS_URL = "https://script.google.com/macros/s/AKfycbxkRU62OYqB9eD5GHTljIBMOTrf0qQXIjzoT0gRfzSsyX51Pw1fWDB6_Y7AsTFUhYz3QQ/exec"; 
// Thay thế baseUrl bằng URL GitHub Pages của bạn
const baseUrl = 'https://giaitoan.byethost17.com/'; 
const googleViewerBaseUrl = 'https://docs.google.com/gview?embedded=true&url=';

// =================================================================
// PHẦN TỬ DOM & BIẾN
// =================================================================
const selectionContainer = document.getElementById('selection-container');
const viewerContainer = document.getElementById('viewer-container');
const pdfViewer = document.getElementById('pdf-viewer');
const backButton = document.getElementById('back-button');
const examButtons = document.querySelectorAll('.exam-button');
const themeToggle = document.getElementById('theme-toggle');

const hoTenInput = document.getElementById('hoTen');
const lopInput = document.getElementById('lop');
const submitInfoBtn = document.getElementById('submit-info-btn');
const loginFormContainer = document.getElementById('login-form-container');
const contentAreaMain = document.getElementById('content-area-main');
const logMessageDiv = document.getElementById('log-message');
const clearDataButton = document.getElementById('clear-data-button'); 
const confirmCheck = document.getElementById('confirm-check'); 
const displayLoginCode = document.getElementById('display-login-code'); 

let userIP = 'Không lấy được IP';
let userLocation = 'Không lấy được Vị trí';
let specificDevice = 'Không rõ/PC'; // Biến mới cho thiết bị cụ thể
const CODE_LENGTH = 8; 

// =================================================================
// HÀM TIỆN ÍCH
// =================================================================

function generateRandomCode(length = CODE_LENGTH) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * Cố gắng lấy tên thiết bị cụ thể từ User Agent.
 */
function getSpecificDevice(userAgent) {
    // Tìm kiếm thiết bị Apple
    if (/iPhone|iPod/.test(userAgent) && !/iPad/.test(userAgent)) {
        const match = userAgent.match(/iPhone OS (\d+_\d+)/);
        return `iPhone (iOS ${match ? match[1].replace('_', '.') : '?'})`;
    }
    
    // Tìm kiếm thiết bị Samsung
    if (/Samsung|SM-|GT-/.test(userAgent)) {
        const match = userAgent.match(/Samsung(?:Browser)?\s?(\w+)|(SM-\w+)|(GT-\w+)/);
        if (match) return `Samsung ${match[1] || match[2] || match[3]}`;
    }

    // Tìm kiếm thiết bị Xiaomi (Mi/Redmi)
    if (/XiaoMi|Mi \w+|Redmi \w+/i.test(userAgent)) {
        const match = userAgent.match(/(XiaoMi|Mi \w+|Redmi \w+)/i);
        if (match) return match[1];
    }

    // Kiểm tra các thiết bị chung
    if (/iPad/.test(userAgent)) return 'iPad';
    if (/Macintosh/.test(userAgent)) return 'Mac OS/PC';
    if (/Windows/.test(userAgent)) return 'Windows PC';
    if (/Android/.test(userAgent)) return 'Android Device';

    return 'Không rõ/PC';
}


async function getClientInfo() {
    try {
        const ipResponse = await fetch('https://ipinfo.io/json');
        const ipData = await ipResponse.json();
        
        userIP = ipData.ip || userIP;
        userLocation = `${ipData.city || ''}, ${ipData.region || ''}, ${ipData.country || ''}`.replace(/^, | ,$| , ,$/g, '');
        specificDevice = getSpecificDevice(navigator.userAgent); // Lấy thông tin thiết bị
    } catch (error) {
        console.error("Lỗi khi lấy IP và Vị trí:", error);
    }
}

function showLogMessage(text, isSuccess) {
    logMessageDiv.textContent = text;
    logMessageDiv.className = isSuccess ? 'log-success' : 'log-error';
}

/**
 * Gửi thông tin truy cập lên Apps Script.
 */
async function submitAccessLog(hoTen, lop, code, isInitialSubmit = false) {
    // Không cần kiểm tra GAS_URL vì bạn đã cung cấp URL thực
    const dataToSend = {
        hoTen: hoTen,
        lop: lop,
        code: code, 
        ip: userIP,
        viTri: userLocation,
        userAgent: navigator.userAgent, // Ghi lại toàn bộ User Agent
        thietBiCuThe: specificDevice // Ghi lại thiết bị cụ thể đã phân tích
    };
    
    try {
        const response = await fetch(GAS_URL, {
            method: 'POST',
            mode: 'cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
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
        if (isInitialSubmit) showLogMessage("Lỗi kết nối hoặc xử lý Apps Script.", false);
        return false;
    }
}


// =================================================================
// LOGIC CHÍNH
// =================================================================

async function handleInitialSubmit() {
    const hoTen = hoTenInput.value.trim();
    const lop = lopInput.value.trim();
    const code = localStorage.getItem('loginCode'); 

    if (hoTen === "" || lop === "") {
        showLogMessage("Vui lòng nhập đầy đủ Họ tên và Lớp.", false);
        return;
    }
    
    if (!confirmCheck.checked) {
        showLogMessage("Vui lòng tích vào ô cam đoan thông tin là chính xác.", false);
        return;
    }

    submitInfoBtn.disabled = true;
    submitInfoBtn.textContent = 'Đang gửi...';

    const success = await submitAccessLog(hoTen, lop, code, true);

    if (success) {
        localStorage.setItem('hoTen', hoTen);
        localStorage.setItem('lop', lop);
        
        loginFormContainer.classList.add('hidden');
        contentAreaMain.classList.remove('hidden');
    }
    
    submitInfoBtn.disabled = false;
    submitInfoBtn.textContent = 'Gửi thông tin & Tiếp tục';
}

function handleClearData() {
    const confirmClear = confirm("Bạn có chắc chắn muốn xóa dữ liệu Họ tên, Lớp và Mã đăng nhập đã lưu không?");

    if (confirmClear) {
        localStorage.removeItem('hoTen');
        localStorage.removeItem('lop');
        localStorage.removeItem('loginCode');

        hoTenInput.value = '';
        lopInput.value = '';
        
        let newCode = generateRandomCode();
        localStorage.setItem('loginCode', newCode);
        displayLoginCode.textContent = newCode; 

        confirmCheck.checked = false;
        submitInfoBtn.disabled = true;
        
        loginFormContainer.classList.remove('hidden');
        contentAreaMain.classList.add('hidden');
        
        logMessageDiv.textContent = '';
        logMessageDiv.className = '';

        alert("Dữ liệu đăng nhập đã được xóa thành công. Vui lòng nhập lại thông tin để tiếp tục.");
    }
}

function getUrlCode() {
    const params = new URLSearchParams(window.location.search);
    return params.get('ma');
}

/**
 * Tải dữ liệu đã lưu và điều khiển hiển thị.
 */
async function loadAndControlContent() {
    const urlCode = getUrlCode();
    
    // Xử lý mã từ URL (chỉ dùng để lưu)
    if (urlCode && urlCode.length === CODE_LENGTH) {
        localStorage.setItem('loginCode', urlCode); 
    }
    
    // KIỂM TRA DỮ LIỆU ĐÃ LƯU
    const storedHoTen = localStorage.getItem('hoTen');
    const storedLop = localStorage.getItem('lop');
    let storedCode = localStorage.getItem('loginCode');
    
    if (!storedCode || storedCode.length !== CODE_LENGTH) {
        storedCode = generateRandomCode();
        localStorage.setItem('loginCode', storedCode);
    }
    
    displayLoginCode.textContent = storedCode; 

    if (storedHoTen && storedLop) {
        // Đã có dữ liệu, tự động gửi log và hiển thị nội dung
        hoTenInput.value = storedHoTen;
        lopInput.value = storedLop;
        
        loginFormContainer.classList.add('hidden');
        contentAreaMain.classList.remove('hidden');
        
        submitAccessLog(storedHoTen, storedLop, storedCode); 
    } else {
        // Lần đầu truy cập / Dữ liệu chưa đầy đủ, hiển thị form
        loginFormContainer.classList.remove('hidden');
        contentAreaMain.classList.add('hidden');
    }
}

function toggleSubmitButton() {
    submitInfoBtn.disabled = !confirmCheck.checked;
}


// =================================================================
// KHỞI TẠO VÀ SỰ KIỆN CHUNG
// =================================================================

confirmCheck.addEventListener('change', toggleSubmitButton);
submitInfoBtn.addEventListener('click', handleInitialSubmit);
clearDataButton.addEventListener('click', handleClearData);

themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.textContent = '⚪';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.textContent = '⚫';
    }
});

document.addEventListener('DOMContentLoaded', async () => {
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.textContent = '⚪';
    } else {
        themeToggle.textContent = '⚫';
    }

    await getClientInfo();
    loadAndControlContent();
    toggleSubmitButton(); 
});


// LOGIC XEM PDF (Giữ nguyên)
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

// ======================= KIỂM TRA MÃ BỊ CHẶN =======================
const blockedCodes = ["Xjipzb74", "iNFT2n88"];

function checkBlockedCode() {
  const currentCode = localStorage.getItem("loginCode");
  if (blockedCodes.includes(currentCode)) {
    document.body.innerHTML = `
      <div style="padding: 40px; text-align: center; font-size: 20px; color: red;">
        🚫 Truy cập bị chặn<br><br>
        Hành vi đặt tên không phù hợp đã bị ghi nhận.<br>
        Vui lòng liên hệ quản trị viên nếu bạn nghĩ đây là nhầm lẫn.<br><br>
        <strong>Trang web này không dành cho bạn.</strong>
      </div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  checkBlockedCode();
});

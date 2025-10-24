        document.addEventListener('DOMContentLoaded', function() {
            const registerButtons = document.querySelectorAll('.register-button');

            registerButtons.forEach(button => {
                button.addEventListener('click', function() {
                    // Vô hiệu hóa tất cả các nút để tránh người dùng click thêm
                    registerButtons.forEach(btn => {
                        btn.disabled = true;
                        btn.style.cursor = 'not-allowed';
                    });

                    // Chỉ thay đổi trạng thái của nút vừa được bấm
                    this.textContent = 'Đang xử lý...';
                    this.style.cursor = 'wait';
                    this.closest('.pricing-card').style.animation = 'none'; // Dừng animation của card tương ứng

                    // Tạo độ trễ ngẫu nhiên từ 3 đến 5 giây
                    const randomDelay = Math.random() * (5000 - 3000) + 3000;

                    // Hàm tạo mã lỗi ngẫu nhiên
                    function generateErrorCode() {
                        const chars = '0123456789ABCDEF';
                        let code = '0x';
                        for (let i = 0; i < 8; i++) {
                            code += chars[Math.floor(Math.random() * 16)];
                        }
                        return code;
                    }

                    setTimeout(() => {
                        // Thay thế toàn bộ nội dung trang bằng thông báo lỗi
                        document.body.innerHTML = `
                            <div style="width: 90%; max-width: 500px; border: 1px solid #999; background-color: #f0f0f0; font-family: Arial, sans-serif; font-size: 14px; box-shadow: 5px 5px 5px #ccc; margin: 20px;">
                                <div style="background-color: #0053a8; color: white; padding: 5px; font-weight: bold;">Registration Service - Error</div>
                                <div style="padding: 20px;">
                                    <p style="font-weight: bold;">A problem has been detected and the process has been stopped to prevent damage to your account.</p>
                                    <p>REG_SERVICE_UNAVAILABLE</p>
                                    <p style="margin-top: 25px;">If this is the first time you've seen this error screen, try to register again. If this screen appears again, follow these steps:</p>
                                    <p style="margin-top: 25px; font-size: 16px; font-weight: bold; word-wrap: break-word;">To complete the registration, please contact the administrator directly via Zalo or Messenger.</p>
                                    <p style="margin-top: 25px; font-size: 11px; color: #555;">Technical information:</p>
                                    <p style="font-size: 11px; color: #555;">*** STOP: ${generateErrorCode()} (REG_SERVICE_UNAVAILABLE_CONTACT_ADMIN)</p>
                                </div>
                            </div>
                        `;
                        // Đảm bảo body có nền tối và căn giữa
                        document.body.style.backgroundColor = '#fff';
                        document.body.style.color = '#000';
                        document.body.style.display = 'flex';
                        document.body.style.justifyContent = 'center';
                        document.body.style.alignItems = 'center';

                        // Thêm cảnh báo khi người dùng cố gắng tải lại hoặc rời khỏi trang
                        window.addEventListener('beforeunload', function (e) {
                            const confirmationMessage = 'Hệ thống đã gặp lỗi. Tải lại trang sẽ đưa bạn về bảng giá ban đầu.';
                            // Chuẩn cho các trình duyệt cũ
                            e.returnValue = confirmationMessage;
                            // Chuẩn cho các trình duyệt hiện đại
                            return confirmationMessage;
                        });
                    }, randomDelay);
                });
            });
        });
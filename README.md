# Demo Công nghệ AI trong Ứng dụng Web

Dự án này trình diễn các công nghệ AI sẵn có trong trình duyệt web hiện tại, bao gồm phát hiện đối tượng trong hình ảnh, nhận dạng ký tự quang học (OCR), nhận dạng giọng nói và chuyển văn bản thành giọng nói.

## Tính năng

- **Phát hiện đối tượng trong hình ảnh**: Sử dụng TensorFlow.js và mô hình COCO-SSD để nhận dạng các đối tượng trong hình ảnh.
- **Trích xuất văn bản từ hình ảnh (OCR)**: Sử dụng Tesseract.js để nhận dạng và trích xuất văn bản từ hình ảnh.
- **Nhận dạng giọng nói**: Sử dụng Web Speech API để chuyển đổi giọng nói thành văn bản.
- **Đọc văn bản**: Sử dụng Web Speech API để chuyển đổi văn bản thành giọng nói với nhiều ngôn ngữ khác nhau.

## Công nghệ sử dụng

- **TensorFlow.js**: Thư viện mã nguồn mở cho machine learning trong JavaScript.
- **COCO-SSD**: Mô hình phát hiện đối tượng tiền huấn luyện.
- **Tesseract.js**: Thư viện OCR chạy trên trình duyệt.
- **Web Speech API**: API chuẩn của trình duyệt cho nhận dạng giọng nói và chuyển văn bản thành giọng nói.
- **HTML/CSS/JavaScript**: Ngôn ngữ cơ bản cho giao diện và tính năng của ứng dụng.

## Cấu trúc dự án

```
accessible-ai-web-demo/
├── index.html                 # Trang chính của ứng dụng
├── /assets
│   ├── style.css              # CSS cho giao diện người dùng
│   ├── /images                # Thư mục chứa ảnh minh họa (nếu có)
├── /js
│   ├── object-detection.js    # Module xử lý phát hiện đối tượng
│   ├── ocr.js                 # Module xử lý OCR
│   ├── speech-to-text.js      # Module xử lý nhận dạng giọng nói
│   ├── text-to-speech.js      # Module xử lý đọc văn bản
│   └── main.js                # Module chính, khởi tạo và điều phối
├── README.md                  # Tài liệu hướng dẫn
├── LICENSE                    # Giấy phép sử dụng
└── .gitignore                 # Cấu hình Git
```

## Cách sử dụng

1. Clone repository này hoặc tải về.
2. Mở file `index.html` trong trình duyệt hiện tại (Chrome, Firefox, Edge, Safari).
3. Không cần cài đặt thêm, tất cả tính năng đều chạy trực tiếp trong trình duyệt.

### Hoặc sử dụng máy chủ web đơn giản:

```bash
# Nếu bạn đã cài Python 3:
python -m http.server

# Sau đó truy cập http://localhost:8000
```

## Lưu ý

- Phát hiện đối tượng và OCR sẽ tải các mô hình khá lớn, có thể mất một chút thời gian khi lần đầu sử dụng.
- Nhận dạng giọng nói yêu cầu quyền truy cập microphone.
- Một số tính năng có thể không hoạt động trên các trang web không bảo mật (không sử dụng HTTPS).
- Ứng dụng được thiết kế để chạy hoàn toàn ở phía client, không cần máy chủ backend.


## Đóng góp

Mọi đóng góp đều được hoan nghênh! Vui lòng tạo issue hoặc pull request nếu bạn muốn cải thiện dự án.

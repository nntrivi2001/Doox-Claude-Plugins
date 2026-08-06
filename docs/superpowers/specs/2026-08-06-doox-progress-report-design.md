# Doox v0 — skill báo cáo tiến độ

Ngày: 06/08/2026. Trạng thái: đã chốt, chờ viết.

## Bối cảnh

Plugin Doox đã bị xoá sạch và reset về `0.0.0` (commit `d6f3671`). Bản cũ có 11 skill, 4 file
rules và một engine Python 1.246 dòng. Ba lý do bỏ:

1. Đầu ra sai — báo cáo bị tóm tắt thành văn xuôi, rụng các cột `Phương án triển khai`,
   `Tiêu chuẩn hoàn thành`, `Rủi ro`.
2. Engine cứng — logic đoán cột, ghép sheet, phân loại trạng thái viết chết trong Python; khách đổi
   template là vỡ.
3. Muốn kiến trúc khác hẳn — không script cố định, để model tự đọc file.

Bản backup đầy đủ kèm lịch sử git: `/tmp/doox-backup-2026-08-06` (mất khi máy khởi động lại).

## Phạm vi v0

Đúng một việc: đọc file kế hoạch của một thị trường, xuất báo cáo tiến độ theo mẫu khách.

Ngoài phạm vi: nhắc việc 9h sáng, phân loại sự cố, lưu trữ theo thị trường, dự báo tiến độ, duyệt
báo giá, hồ sơ nhà thầu, nghiên cứu thị trường. Làm đúng cái này trước đã.

## Kiến trúc

Một file: `skills/progress-report/SKILL.md`. Không có thư mục `rules/`, không có `lib/`. Với một
skill duy nhất, tách rules ra chỉ thêm một lớp gián tiếp — đúng thứ làm bản cũ rối. Có skill thứ hai
dùng chung luật thì mới tách.

Skill mô tả **kết quả phải ra**, không mô tả các bước. Model tự chọn cách lấy dữ liệu khỏi `.xlsx`
(Claude không đọc `.xlsx` bằng `Read`; `openpyxl` và `pandas` có sẵn trên máy, `libreoffice` cũng
có). Skill không ràng buộc cách làm, không kèm script.

Ngôn ngữ: nội dung SKILL.md viết tiếng Việt. Mọi nhãn cột, tên bảng và mẫu văn bản đều tiếng Việt;
viết skill bằng tiếng Anh chỉ tạo thêm một lần dịch có thể sai nhãn.

## Cấu trúc SKILL.md — 5 mục

### 1. Dùng khi nào

Người dùng đưa file kế hoạch `.xlsx` và hỏi tiến độ, hoặc yêu cầu báo cáo cho một thị trường.

### 2. Đầu vào

- File kế hoạch `.xlsx`.
- Tên thị trường. Bắt buộc hỏi người dùng, không suy từ tên file — suy sai thì báo cáo mang tên
  thị trường sai.

### 3. Trường dữ liệu cần lấy

13 trường: STT, Danh mục công việc, PIC, Ngày bắt đầu, Ngày kết thúc, ô tick hoàn thành, Hiện trạng
vấn đề, Vấn đề phát sinh, Phương án xử lý, Ghi chú, Phương án triển khai, Tiêu chuẩn hoàn thành,
Rủi ro.

Bốn trường bắt buộc: **Danh mục công việc**, **ô tick**, **Ngày kết thúc**, **Ngày bắt đầu**. Không
tìm thấy một trong bốn thì dừng và hỏi người dùng, không đoán. Ngày bắt đầu nằm trong nhóm bắt buộc
vì bảng 3 và bảng 5 phân loại bằng chính cột đó — thiếu nó thì hai bảng không xác định được.

Model tự khớp cột ở mỗi lần chạy và báo lại đã nhận cột nào (ví dụ `sheet 'KH Bảng 3' cột H = Ngày
kết thúc`) trước khi xuất báo cáo. Đây là đánh đổi đã cân nhắc: linh hoạt với file lạ, đổi lại cùng
một file chạy hai lần có thể khớp cột khác nhau — nên phải in mapping ra để người dùng soi được.

### 4. Luật phân loại

Ô tick là tín hiệu hoàn thành **duy nhất**. Ngày kết thúc đã qua không có nghĩa là xong.

Xét lần lượt từ trên xuống; việc đã vào bảng trên không lặp lại ở bảng dưới.

| # | Bảng | Điều kiện | Cột ngày dùng |
|---|---|---|---|
| 1 | Đầu việc quá deadline | chưa tick + Ngày kết thúc < hôm nay | Ngày kết thúc |
| 2 | Các đầu việc gần deadline | chưa tick + hôm nay ≤ Ngày kết thúc ≤ hôm nay+3 | Ngày kết thúc |
| 3 | Các đầu việc đang trong quá trình triển khai | chưa tick + Ngày bắt đầu ≤ hôm nay + chưa vào bảng 1/2 | Ngày bắt đầu |
| 4 | Các công việc đã hoàn thành | có tick | Ngày kết thúc |
| 5 | Các công việc sắp tới | chưa tick + hôm nay+1 ≤ Ngày bắt đầu ≤ hôm nay+3 + chưa vào bảng 1/2 | Ngày bắt đầu |
| — | Chưa bắt đầu | phần còn lại: Ngày bắt đầu xa hơn 3 ngày, hoặc không có ngày | không có bảng, chỉ đếm |

Ngưỡng 3 ngày lấy từ `idea.txt` dòng 7 (`ngày hoàn thành - 3 ngày`).

Một việc vừa gần deadline vừa sắp bắt đầu thì nằm ở bảng 2 — gấp hơn, và nhờ xét theo thứ tự nên
tổng cộng vẫn khớp.

Nhóm "chưa bắt đầu" không có bảng nhưng phải đếm: trên file tham chiếu nó chiếm phần lớn đầu việc,
bỏ đi thì hàng chục dòng biến mất mà không ai phát hiện.

### 5. Mẫu output

Nguồn: `nháp ý tưởng.xlsx`, sheet `Sheet1`, ô `L3`, cột "Mẫu văn bản". Giữ nguyên thứ tự và nhãn
cột. Khác duy nhất so với ô gốc: mẫu viết `[rủi ro]` chữ thường, hiển thị thành `Rủi ro` cho đồng bộ.
Bảng 5 là bảng thêm mới, không có trong ô gốc; nó dùng đúng bộ cột của bảng 3.

Hai dòng mở đầu:

```
Báo cáo tiến độ dự án:
Cập nhật tiến độ dự án tại thị trường [Tên thị trường] dựa theo cập nhật mới nhất:
```

Bảng 1, 2, 3, 5 — 11 cột:

| STT | Danh mục công việc | PIC | Ngày kết thúc *(bảng 3 và 5: Ngày bắt đầu)* | Hiện trạng vấn đề | Vấn đề phát sinh | Phương án xử lý | Ghi chú | Phương án triển khai | Tiêu chuẩn hoàn thành | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|

Bảng 4 — 7 cột:

| STT | Danh mục công việc | PIC | Ngày kết thúc | Ghi chú | Phương án triển khai | Tiêu chuẩn hoàn thành |
|---|---|---|---|---|---|---|

Tiêu đề mục, đúng chữ của mẫu gốc:

1. Đầu việc quá deadline
2. Các đầu việc gần deadline
3. Các đầu việc đang trong quá trình triển khai
4. Các công việc đã hoàn thành
5. Các công việc sắp tới

Dòng cuối báo cáo: `tổng = b1 + b2 + b3 + b4 + b5 + chưa bắt đầu`.

## Kiểm thử

Chạy trên `HerioGreen-Vietnam.xlsx` (thị trường Vietnam):

1. Tổng ở dòng đối chiếu khớp số đầu việc thật đếm được trong file.
2. Sáu nhóm cộng lại đúng bằng tổng, không có việc nào nằm ở hai bảng.
3. Soi tay 2–3 dòng mỗi bảng: nội dung ô khớp file gốc, không bị cắt.
4. Bảng rỗng vẫn in ra tiêu đề cột.

## Điều đã bỏ có chủ ý

- **Mục "yêu cầu chất lượng đầu ra"** — người dùng chốt bỏ. Rủi ro đã nêu: đây chính là mục vá lỗi
  cũ (tóm tắt thành văn xuôi, cắt bớt dòng), bỏ đi thì có thể tái phát. Nếu tái phát thì thêm lại
  mục này là cách sửa.
- **Mục "gợi ý cách làm"** và **mục "ranh giới"** — người dùng chốt bỏ.
- Lưu trữ theo thị trường, gửi mail, ghi ngược vào file kế hoạch: ngoài phạm vi v0.

---
name: progress-report
description: Đọc file kế hoạch dự án (.xlsx) của một thị trường và xuất báo cáo tiến độ theo mẫu khách — quá deadline, gần deadline, đang triển khai, đã hoàn thành, sắp tới. Dùng khi người dùng đưa file kế hoạch, hỏi tiến độ dự án, hỏi việc nào quá hạn hay sắp tới, hoặc yêu cầu báo cáo tiến độ cho một thị trường.
---

# Báo cáo tiến độ dự án

## 1. Dùng khi nào

Người dùng đưa file kế hoạch `.xlsx` và hỏi tiến độ, hoặc yêu cầu báo cáo tiến độ cho một thị trường.

## 2. Đầu vào

- File kế hoạch `.xlsx`.
- Tên thị trường. Hỏi người dùng, không suy từ tên file — suy sai thì báo cáo mang tên thị trường sai.

## 3. Trường dữ liệu cần lấy

14 trường: STT, Danh mục công việc, PIC, Ngày bắt đầu, Ngày kết thúc, Trạng thái (chữ), ô tick hoàn
thành, Hiện trạng vấn đề, Vấn đề phát sinh, Phương án xử lý, Ghi chú, Phương án triển khai, Tiêu
chuẩn hoàn thành, Rủi ro.

Dữ liệu nằm ở hai sheet, phải ghép lại:

- Sheet chi tiết kế hoạch — Danh mục CV, Phương án triển khai, Tiêu chí hoàn thành, Người phụ trách,
  Người hỗ trợ, Ngày bắt đầu, Ngày kết thúc, **Trạng thái (chữ)**, Rủi ro, Ghi chú.
- Sheet kiểm soát tiến độ & sự cố — Cập nhật hiện trạng, Vấn đề phát sinh, **Trạng thái (ô tick
  TRUE/FALSE)**, Phương án giải quyết.

Ghép hai sheet theo **Danh mục CV**, không theo STT: STT đánh lại từ đầu ở mỗi section nên trùng nhau.

Năm cột bắt buộc: **Danh mục công việc**, **Trạng thái (chữ)**, **ô tick**, **Ngày bắt đầu**,
**Ngày kết thúc**. Thiếu một trong năm thì dừng và hỏi người dùng, không đoán.

Báo lại đã nhận cột nào trước khi xuất báo cáo, ví dụ `sheet 'KH Bảng 3 - Chi tiết' cột J = Ngày kết
thúc`.

Dòng không có Danh mục CV, hoặc có Danh mục nhưng trống cả hai cột ngày, là dòng tiêu đề nhóm
(`A`, `1`, `2`…). Không phải đầu việc — loại khỏi mọi bảng và khỏi phép đếm.

## 4. Luật phân loại

**Hoàn thành = ô tick TRUE *và* cột chữ ghi `Hoàn thành`.** Một mình ô tick không đủ. Ngày kết thúc
đã qua càng không phải tín hiệu hoàn thành. Mọi việc không thoả cả hai điều kiện đều tính là chưa
xong.

Cột chữ nhận ba giá trị: `Chưa triển khai`, `Đang triển khai`, `Hoàn thành`. Bảng 4 chỉ chứa
`Hoàn thành`; bảng 1, 2, 3, 5 chỉ chứa `Chưa triển khai` và `Đang triển khai`.

Xét lần lượt từ trên xuống. Việc đã vào bảng trên thì không lặp lại ở bảng dưới.

| # | Bảng | Điều kiện | Cột ngày |
|---|---|---|---|
| 1 | Đầu việc quá deadline | chưa xong + Ngày kết thúc < hôm nay | Ngày kết thúc |
| 2 | Các đầu việc gần deadline | chưa xong + hôm nay ≤ Ngày kết thúc ≤ hôm nay+3 | Ngày kết thúc |
| 3 | Các đầu việc đang trong quá trình triển khai | chưa xong + Ngày bắt đầu ≤ hôm nay + chưa vào bảng 1/2 | Ngày bắt đầu |
| 4 | Các công việc đã hoàn thành | tick TRUE **và** chữ `Hoàn thành` | Ngày kết thúc |
| 5 | Các công việc sắp tới | chưa xong + hôm nay+1 ≤ Ngày bắt đầu ≤ hôm nay+3 + chưa vào bảng 1/2 | Ngày bắt đầu |
| — | Chưa bắt đầu | phần còn lại: Ngày bắt đầu xa hơn 3 ngày, hoặc không có ngày | không có bảng, chỉ đếm |

Việc vừa gần deadline vừa sắp bắt đầu nằm ở bảng 2 — gấp hơn.

**Lệch trạng thái.** Việc có tick TRUE nhưng chữ không phải `Hoàn thành`, hoặc ngược lại, tính là
chưa xong và vẫn xếp vào bảng 1/2/3/5 theo ngày. Đánh dấu ở hai nơi:

- Trong chính dòng đó, ô `Ghi chú` thêm `[đã tick, cột chữ chưa cập nhật]` vào cuối nội dung sẵn có.
- Liệt kê riêng sau bảng 5: Danh mục công việc + giá trị hai cột trạng thái, để người dùng sửa file.

## 5. Mẫu output

Hai dòng mở đầu:

```
Báo cáo tiến độ dự án:
Cập nhật tiến độ dự án tại thị trường [Tên thị trường] dựa theo cập nhật mới nhất:
```

Rồi năm mục, đúng tiêu đề này, kèm số dòng của mục:

1. Đầu việc quá deadline
2. Các đầu việc gần deadline
3. Các đầu việc đang trong quá trình triển khai
4. Các công việc đã hoàn thành
5. Các công việc sắp tới

Bảng 1, 2, 3, 5 — 11 cột:

| STT | Danh mục công việc | PIC | Ngày kết thúc | Hiện trạng vấn đề | Vấn đề phát sinh | Phương án xử lý | Ghi chú | Phương án triển khai | Tiêu chuẩn hoàn thành | Rủi ro |
|---|---|---|---|---|---|---|---|---|---|---|

Bảng 3 và bảng 5 thay `Ngày kết thúc` bằng `Ngày bắt đầu`. Các cột khác giữ nguyên thứ tự.

Bảng 4 — 7 cột:

| STT | Danh mục công việc | PIC | Ngày kết thúc | Ghi chú | Phương án triển khai | Tiêu chuẩn hoàn thành |
|---|---|---|---|---|---|---|

Sau bảng 5: danh sách lệch trạng thái, nếu có.

Dòng cuối: `tổng = b1 + b2 + b3 + b4 + b5 + chưa bắt đầu`. Không khớp thì báo lỗi thay vì xuất bản.

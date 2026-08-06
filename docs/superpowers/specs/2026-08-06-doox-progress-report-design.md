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

14 trường: STT, Danh mục công việc, PIC, Ngày bắt đầu, Ngày kết thúc, Trạng thái (chữ), ô tick hoàn
thành, Hiện trạng vấn đề, Vấn đề phát sinh, Phương án xử lý, Ghi chú, Phương án triển khai, Tiêu
chuẩn hoàn thành, Rủi ro.

Dữ liệu nằm ở hai sheet, phải ghép lại:

- `KH Bảng 3 - Chi tiết` — Danh mục CV, Phương án triển khai, Tiêu chí hoàn thành, Người phụ trách,
  Người hỗ trợ, Ngày bắt đầu, Ngày kết thúc, **Trạng thái (chữ)**, Rủi ro, Ghi chú.
- `KH Kiểm soát tiến độ & sự cố` — Cập nhật hiện trạng, Vấn đề phát sinh, **Trạng thái (ô tick
  TRUE/FALSE)**, Phương án giải quyết.

Ghép **theo vị trí dòng**: dòng thứ n của sheet chi tiết là dòng thứ n của sheet kiểm soát. Hai khoá
kia đều hỏng trên file thật — STT đánh lại từ đầu mỗi section, còn `Danh mục CV` trùng lặp (4 nhãn
phủ 14 dòng, ví dụ `Nghiệm thu giấy phép` xuất hiện 4 lần), ghép theo nhãn là gộp nhầm 4 đầu việc
khác nhau làm một. Trước khi ghép, kiểm hai sheet cùng số dòng và `Danh mục CV` khớp từng dòng;
lệch thì dừng và báo.

STT hiển thị là **ghép**, không phải chép: lấy ký hiệu section gần nhất phía trên (`A`, `B`, `I`,
`II`… — chỉ chữ cái và số La Mã, tiêu đề thuần số là nhóm con) cộng số thứ tự của dòng, ra `II.3.1`.
Không có tiền tố thì `3.1` lặp lại nhiều lần, không định danh được dòng nào.

Nguồn từng cột phải ghi rõ trong skill: hai sheet cùng có `Ngày bắt đầu`, `Ngày kết thúc`,
`Trạng thái`, `Ghi chú` trùng tên. `Hiện trạng vấn đề`, `Vấn đề phát sinh`, `Phương án xử lý` và
`Ghi chú` lấy ở sheet kiểm soát; phần còn lại lấy ở sheet chi tiết.

Năm trường bắt buộc: **Danh mục công việc**, **Trạng thái (chữ)**, **ô tick**, **Ngày kết thúc**,
**Ngày bắt đầu**. Không tìm thấy một trong năm thì dừng và hỏi người dùng, không đoán. Ngày bắt đầu
bắt buộc vì bảng 3 và bảng 5 phân loại bằng chính cột đó.

Dòng không có Danh mục CV, hoặc có Danh mục nhưng trống cả hai cột ngày, là dòng tiêu đề nhóm
(`A`, `1`, `2`…) — không phải đầu việc, loại khỏi mọi bảng và khỏi phép đếm. Trên file tham chiếu:
109 dòng có Danh mục, trong đó 28 dòng tiêu đề nhóm, còn 81 đầu việc thật.

Model tự khớp cột ở mỗi lần chạy và báo lại đã nhận cột nào (ví dụ `sheet 'KH Bảng 3' cột H = Ngày
kết thúc`) trước khi xuất báo cáo. Đây là đánh đổi đã cân nhắc: linh hoạt với file lạ, đổi lại cùng
một file chạy hai lần có thể khớp cột khác nhau — nên phải in mapping ra để người dùng soi được.

### 4. Luật phân loại

**Hoàn thành = ô tick TRUE *và* cột chữ ghi "Hoàn thành".** Một mình ô tick không đủ; ngày kết thúc
đã qua càng không phải tín hiệu hoàn thành. Mọi việc không thoả cả hai điều kiện đều tính là chưa
xong.

Cột chữ chỉ nhận ba giá trị: `Chưa triển khai`, `Đang triển khai`, `Hoàn thành`. Bảng 4 chỉ chứa
`Hoàn thành`; bảng 1, 2, 3, 5 chỉ chứa `Chưa triển khai` và `Đang triển khai`.

Xét lần lượt từ trên xuống; việc đã vào bảng trên không lặp lại ở bảng dưới.

| # | Bảng | Điều kiện | Cột ngày dùng |
|---|---|---|---|
| 1 | Đầu việc quá deadline | chưa xong + Ngày kết thúc < hôm nay | Ngày kết thúc |
| 2 | Các đầu việc gần deadline | chưa xong + hôm nay ≤ Ngày kết thúc ≤ hôm nay+3 | Ngày kết thúc |
| 3 | Các đầu việc đang trong quá trình triển khai | chưa xong + Ngày bắt đầu ≤ hôm nay + chưa vào bảng 1/2 | Ngày bắt đầu |
| 4 | Các công việc đã hoàn thành | tick TRUE **và** chữ `Hoàn thành` | Ngày kết thúc |
| 5 | Các công việc sắp tới | chưa xong + hôm nay+1 ≤ Ngày bắt đầu ≤ hôm nay+3 + chưa vào bảng 1/2 | Ngày bắt đầu |
| — | Chưa bắt đầu | phần còn lại: Ngày bắt đầu xa hơn 3 ngày, hoặc không có ngày | không có bảng, chỉ đếm |

**Lệch trạng thái.** Việc có tick TRUE nhưng chữ không phải `Hoàn thành` (và ngược lại) tính là chưa
xong, vẫn xếp vào bảng 1/2/3/5 theo ngày. Đánh dấu ở hai nơi:

- Ngay trong dòng của nó, ô `Ghi chú` thêm `[đã tick, cột chữ chưa cập nhật]` vào cuối nội dung sẵn
  có. Không có dấu này thì người đọc bảng 1 không phân biệt được việc chậm thật với việc chỉ quên
  đổi cột chữ — mà bảng 1 là bảng người ta đọc kỹ nhất.
- Liệt kê riêng ở cuối báo cáo: Danh mục công việc + giá trị hai cột trạng thái, để sửa file.

Trên file tham chiếu có 9 dòng như vậy, đều là tick TRUE + chữ `Đang triển khai`.

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

Sau bảng 5: danh sách lệch trạng thái, nếu có.

Dòng cuối báo cáo: `tổng = b1 + b2 + b3 + b4 + b5 + chưa bắt đầu`.

## Kiểm thử

Chạy trên `HerioGreen-Vietnam.xlsx` (thị trường Vietnam):

1. Tổng ở dòng đối chiếu bằng 81 — số đầu việc thật, sau khi loại 28 dòng tiêu đề nhóm.
2. Sáu nhóm cộng lại đúng bằng tổng, không có việc nào nằm ở hai bảng.
3. Bảng 4 có đúng 3 dòng: chỉ những việc vừa tick TRUE vừa ghi chữ `Hoàn thành`.
4. Danh sách lệch trạng thái có đúng 9 dòng.
5. Soi tay 2–3 dòng mỗi bảng: nội dung ô khớp file gốc, không bị cắt.
6. Bảng rỗng vẫn in ra tiêu đề cột.

## Điều đã bỏ có chủ ý

- **Mục "yêu cầu chất lượng đầu ra"** — bỏ ở bản đầu, **đã thêm lại vào mục 5** ngày 06/08 sau khi
  chạy thử: skill xuất ra file `.docx` kèm một đoạn tóm tắt số đếm, đúng lỗi cũ. Nay mục 5 nói rõ
  báo cáo chính là tin nhắn, cấm sinh file, cấm tóm tắt thay bảng, dài thì chia nhiều tin nhắn.
- **Mục "gợi ý cách làm"** và **mục "ranh giới"** — người dùng chốt bỏ.
- Lưu trữ theo thị trường, gửi mail, ghi ngược vào file kế hoạch: ngoài phạm vi v0.

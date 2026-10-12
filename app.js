// ================== DỮ LIỆU DÙNG CHUNG ==================
let bookings = [
  { bookingCode: "CIN-001", customerName: "Nguyễn Văn An",
    movieTitle: "Ánh Trăng Cuối Phố", ticketCount: 2,
    pricePerTicket: 90000, totalAmount: 194400 },
  { bookingCode: "CIN-002", customerName: "Trần Thị Bình",
    movieTitle: "Biệt Đội Sao Băng", ticketCount: 4,
    pricePerTicket: 90000, totalAmount: 349920 },
  { bookingCode: "CIN-003", customerName: "Lê Minh Châu",
    movieTitle: "Mùa Hè Rực Lửa", ticketCount: 6,
    pricePerTicket: 110000, totalAmount: 641520 }
];

// ================== HÀM TIỆN ÍCH ==================

// Định dạng tiền Việt Nam: 641520 -> "641.520 VNĐ"
function formatMoney(amount) {
  return amount.toLocaleString("vi-VN") + " VNĐ";
}

// Bỏ khoảng trắng thừa, viết hoa chữ cái đầu mỗi từ: "  phạm   thu  hà " -> "Phạm Thu Hà"
function normalizeName(text) {
  const words = text.trim().split(/\s+/);
  const result = [];
  for (const word of words) {
    result.push(word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
  }
  return result.join(" ");
}

// Tìm vị trí đơn đặt vé theo mã, trả về -1 nếu không có
function findBookingIndex(code) {
  for (let i = 0; i < bookings.length; i++) {
    if (bookings[i].bookingCode === code) {
      return i;
    }
  }
  return -1;
}

// Kiểm tra mã đặt vé (đã trim + in hoa), trả về lỗi đầu tiên hoặc "" nếu hợp lệ
function validateBookingCode(code) {
  if (code === "") {
    return "Lỗi: Chưa nhập mã đặt vé";
  }
  if (code.length < 6) {
    return "Lỗi: Độ dài nhỏ hơn 6 ký tự";
  }
  if (!code.startsWith("CIN-")) {
    return "Lỗi: Sai tiền tố \"CIN-\"";
  }
  if (code.includes(" ")) {
    return "Lỗi: Chứa khoảng trắng";
  }
  if (findBookingIndex(code) !== -1) {
    return "Lỗi: Mã đặt vé đã tồn tại";
  }
  return "";
}

// Nhập số nguyên > 0, nhập lại đến khi đúng; trả về null nếu bấm Cancel
function inputPositiveInteger(message) {
  while (true) {
    const input = prompt(message);
    if (input === null) {
      return null;
    }
    const text = input.trim();
    // /^\d+$/ : chỉ gồm chữ số (loại số âm, số thập phân, chữ cái)
    if (/^\d+$/.test(text) && Number(text) > 0) {
      return Number(text);
    }
    console.log("Giá trị không hợp lệ, vui lòng nhập số nguyên > 0!");
  }
}

// Nhập chuỗi không rỗng (tên khách / tên phim), đã chuẩn hóa; null nếu Cancel
function inputNonEmptyText(message) {
  while (true) {
    const input = prompt(message);
    if (input === null) {
      return null;
    }
    if (input.trim() !== "") {
      return normalizeName(input);
    }
    console.log("Không được để trống, vui lòng nhập lại!");
  }
}

// Tính tiền: chi phí cơ sở, giảm giá, phí dịch vụ, tổng thanh toán
function calculateTotal(ticketCount, pricePerTicket) {
  const baseCost = ticketCount * pricePerTicket;
  const discount = ticketCount >= 4 ? Math.round(baseCost * 10 / 100) : 0;
  const serviceFee = Math.round((baseCost - discount) * 8 / 100);
  const totalAmount = baseCost - discount + serviceFee;
  return { baseCost, discount, serviceFee, totalAmount };
}

// In danh sách đơn đặt vé được truyền vào + tổng số đơn, tổng doanh thu
function displayBookings(list) {
  if (list.length === 0) {
    console.log("Danh sách đơn đặt vé trống");
    return;
  }
  let revenue = 0;
  for (let i = 0; i < list.length; i++) {
    const b = list[i];
    console.log(`${i + 1}. ${b.bookingCode} - ${b.customerName} - ${b.movieTitle}`);
    console.log(`   SL: ${b.ticketCount} | Giá: ${formatMoney(b.pricePerTicket)} | Tổng TT: ${formatMoney(b.totalAmount)}`);
    revenue += b.totalAmount;
  }
  console.log(`Tổng: ${list.length} đơn đặt vé – Doanh thu: ${formatMoney(revenue)}`);
}

// ================== CÁC CHỨC NĂNG ==================

// Case 1: hiển thị danh sách
function showBookings() {
  displayBookings(bookings);
}

// Case 2: thêm đơn mới
function addBooking() {
  const codeInput = prompt("Nhập mã đặt vé (VD: CIN-004):");
  if (codeInput === null) {
    console.log("Đã hủy thao tác thêm");
    return;
  }
  const code = codeInput.trim().toUpperCase();
  const error = validateBookingCode(code);
  if (error !== "") {
    console.log(error);
    return;
  }

  const customerName = inputNonEmptyText("Nhập tên khách hàng:");
  if (customerName === null) {
    console.log("Đã hủy thao tác thêm");
    return;
  }
  const movieTitle = inputNonEmptyText("Nhập tên phim:");
  if (movieTitle === null) {
    console.log("Đã hủy thao tác thêm");
    return;
  }
  const ticketCount = inputPositiveInteger("Nhập số vé:");
  if (ticketCount === null) {
    console.log("Đã hủy thao tác thêm");
    return;
  }
  const pricePerTicket = inputPositiveInteger("Nhập giá mỗi vé (VNĐ):");
  if (pricePerTicket === null) {
    console.log("Đã hủy thao tác thêm");
    return;
  }

  const bill = calculateTotal(ticketCount, pricePerTicket);
  bookings.push({
    bookingCode: code,
    customerName: customerName,
    movieTitle: movieTitle,
    ticketCount: ticketCount,
    pricePerTicket: pricePerTicket,
    totalAmount: bill.totalAmount
  });

  console.log("========== HÓA ĐƠN ==========");
  console.log("Mã đặt vé      : " + code);
  console.log("Khách hàng     : " + customerName);
  console.log("Tên phim       : " + movieTitle);
  console.log("Số vé          : " + ticketCount);
  console.log("Giá mỗi vé     : " + formatMoney(pricePerTicket));
  console.log("Chi phí cơ sở  : " + formatMoney(bill.baseCost));
  console.log("Giảm giá       : " + formatMoney(bill.discount));
  console.log("Phí dịch vụ    : " + formatMoney(bill.serviceFee));
  console.log("Tổng thanh toán: " + formatMoney(bill.totalAmount));
}

// Case 3: cập nhật đơn
function updateBooking() {
  const codeInput = prompt("Nhập mã đặt vé cần cập nhật:");
  if (codeInput === null) {
    console.log("Đã hủy cập nhật");
    return;
  }
  const code = codeInput.trim().toUpperCase();
  const index = findBookingIndex(code);
  if (index === -1) {
    console.log(`Không tìm thấy đơn đặt vé có mã ${code}`);
    return;
  }

  const ticketCount = inputPositiveInteger("Nhập số vé mới:");
  if (ticketCount === null) {
    console.log("Đã hủy cập nhật");
    return;
  }
  const pricePerTicket = inputPositiveInteger("Nhập giá mỗi vé mới (VNĐ):");
  if (pricePerTicket === null) {
    console.log("Đã hủy cập nhật");
    return;
  }

  const booking = bookings[index];
  const oldTotal = booking.totalAmount;
  const bill = calculateTotal(ticketCount, pricePerTicket);
  booking.ticketCount = ticketCount;
  booking.pricePerTicket = pricePerTicket;
  booking.totalAmount = bill.totalAmount;

  console.log("Cập nhật thành công");
  console.log("Tổng thanh toán cũ: " + formatMoney(oldTotal));
  console.log("Tổng thanh toán mới: " + formatMoney(bill.totalAmount));
}

// Case 4: xóa đơn
function deleteBooking() {
  const codeInput = prompt("Nhập mã đặt vé cần xóa:");
  if (codeInput === null) {
    console.log("Đã hủy thao tác xóa");
    return;
  }
  const code = codeInput.trim().toUpperCase();
  const index = findBookingIndex(code);
  if (index === -1) {
    console.log(`Không tìm thấy đơn đặt vé có mã ${code}`);
    return;
  }

  const confirmInput = prompt(`Xác nhận xóa đơn ${code}? (Y/N)`);
  if (confirmInput !== null && confirmInput.trim().toLowerCase() === "y") {
    bookings.splice(index, 1);
    console.log(`Xóa thành công, còn ${bookings.length} đơn`);
  } else {
    console.log(`Đã hủy thao tác xóa, còn ${bookings.length} đơn`);
  }
}

// Case 5: tìm theo tên phim (không phân biệt hoa/thường)
function searchBookings() {
  const input = prompt("Nhập từ khóa tên phim:");
  if (input === null || input.trim() === "") {
    console.log("Chưa nhập từ khóa tìm kiếm");
    return;
  }
  const keyword = input.trim().toLowerCase();
  const results = [];
  for (const booking of bookings) {
    if (booking.movieTitle.toLowerCase().includes(keyword)) {
      results.push(booking);
    }
  }
  if (results.length === 0) {
    console.log("Không tìm thấy đơn đặt vé phù hợp");
    return;
  }
  displayBookings(results);
}

// Bonus 2: báo cáo tổng kết khi thoát
function showSummaryReport() {
  const line = "=".repeat(50);
  if (bookings.length === 0) {
    console.log("Chưa có đơn đặt vé nào");
    return;
  }
  let revenue = 0;
  let highest = bookings[0];
  for (const booking of bookings) {
    revenue += booking.totalAmount;
    if (booking.totalAmount > highest.totalAmount) {
      highest = booking;
    }
  }
  const average = Math.round(revenue / bookings.length);
  console.log(line);
  console.log("BÁO CÁO TỔNG KẾT ĐƠN ĐẶT VÉ");
  console.log(line);
  console.log("Tổng số đơn đặt vé   : " + bookings.length);
  console.log("Tổng doanh thu       : " + formatMoney(revenue));
  console.log("Doanh thu trung bình : " + formatMoney(average));
  console.log(`Đơn cao nhất         : ${highest.bookingCode} - ${formatMoney(highest.totalAmount)}`);
  console.log(line);
}

// ================== MENU CHÍNH ==================

// In menu ra console
function showMenu() {
  console.log("=====================================================");
  console.log("     HỆ THỐNG QUẢN LÝ ĐẶT VÉ MOONLIGHT CINEMA");
  console.log("=====================================================");
  console.log("1. Hiển thị danh sách đơn đặt vé");
  console.log("2. Thêm đơn đặt vé mới");
  console.log("3. Cập nhật đơn đặt vé");
  console.log("4. Xóa đơn đặt vé");
  console.log("5. Tìm kiếm đơn đặt vé theo tên phim");
  console.log("0. Thoát chương trình");
  console.log("=====================================================");
}

// Vòng lặp chương trình: chạy đến khi chọn 0
function runProgram() {
  let running = true;
  while (running) {
    showMenu();
    const input = prompt("Vui lòng nhập lựa chọn của bạn (0 - 5):");
    // Cancel (null) hoặc nhập sai đều rơi vào default
    const choice = input === null ? "" : input.trim();

    switch (choice) {
      case "1":
        showBookings();
        break;
      case "2":
        addBooking();
        break;
      case "3":
        updateBooking();
        break;
      case "4":
        deleteBooking();
        break;
      case "5":
        searchBookings();
        break;
      case "0":
        showSummaryReport();
        console.log("Cảm ơn bạn đã sử dụng hệ thống. Tạm biệt!");
        running = false;
        break;
      default:
        console.log("Lựa chọn không hợp lệ, vui lòng nhập số từ 0 đến 5!");
        break;
    }
  }
}

runProgram();
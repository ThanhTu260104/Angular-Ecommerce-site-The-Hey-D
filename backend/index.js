const express = require("express");
var app = express(); //tạo ứng dụng nodejs
const port = 3005;
app.use(express.json()); //cho phép đọc dữ liệu dạng json
const cors = require("cors");
app.use(cors()); //cho phép mọi nguồi bên ngoài request đến ứnd dụng
const {
  SanPhamModel,
  LoaiModel,
  TinTucModel,
  DonHangChiTietModel,
  DonHangModel,
} = require("./config/database"); //các model lấy database

//routes

// Lấy danh sách loại sản phẩm
app.get("/api/loai", async (req, res) => {
  const loai_arr = await LoaiModel.findAll({
    where: { an_hien: 1 },
    order: [["thu_tu", "ASC"]],
  });
  res.json(loai_arr);
});
app.get("/api/loai/:id", async (req, res) => {
  const loai = await LoaiModel.findByPk(req.params.id);
  res.json(loai);
});

/*  ------------------------------------------------------   */

// lấy danh sách sản phẩm theo loại

// Lấy tất cả sản phẩm
//GET http://localhost:5000/api/sanpham?category=shoes&sort=price_asc

app.get("/api/sanpham", async (req, res) => {
  let { page, limit, category, sort, hot } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 16; // mặc định hiện 10 sản phẩm
  let whereClause = { an_hien: 1 };
  if (category) whereClause.id_loai = category;
  let order = [];
  if (sort === "asc") order = [["gia", "ASC"]]; //sắp xếp tăng dần
  else if (sort === "desc") order = [["gia", "DESC"]]; //sắp xếp giảm dần
  else
    order = [
      ["ngay", "DESC"],
      ["gia", "ASC"],
    ];
  // sắp xếp theo ngày mới nhất và giá tăng dần
  if (hot === "1") {
    whereClause.hot = 1;
  } else {
    whereClause.hot = 0;
  }
  const offset = (page - 1) * limit;
  const sp_arr = await SanPhamModel.findAll({
    where: whereClause,
    order: order,
    offset: offset,
    limit: limit,
  });
  res.json(sp_arr);
});

// lấy danh sách sản phẩm hot
app.get("/api/sphot/:sosp?", async (req, res) => {
  const sosp = Number(req.params.sosp) || 3;
  const sp_arr = await SanPhamModel.findAll({
    where: { an_hien: 1, hot: 1 },
    order: [
      ["ngay", "DESC"],
      ["gia", "ASC"],
    ],
    offset: 0,
    limit: sosp,
  });
  res.json(sp_arr);
});
app.get("/api/spmoi/:sosp?", async (req, res) => {
  const sosp = Number(req.params.sosp) || 6;
  const sp_arr = await SanPhamModel.findAll({
    where: { an_hien: 1 },
    order: [
      ["ngay", "DESC"],
      ["gia", "ASC"],
    ],
    offset: 0,
    limit: sosp,
  });
  res.json(sp_arr);
});
app.get("/api/sp/:id", async (req, res) => {
  const id = Number(req.params.id);
  const sp = await SanPhamModel.findOne({
    where: { id: id },
  });
  res.json(sp);
});
app.get("/api/sptrongloai/:id", async (req, res) => {
  const id_loai = Number(req.params.id);
  if (isNaN(id_loai)) {
    return res.status(400).json({ error: "id_loai không hợp lệ" });
  }
  const sp_arr = await SanPhamModel.findAll({
    where: { id_loai: id_loai, an_hien: 1 },
    order: [
      ["ngay", "DESC"],
      ["gia", "ASC"],
    ],
  });
  res.json(sp_arr);
});

const { Op } = require("sequelize");
// Tìm kiếm
app.get("/api/timkiem/:tu_khoa/:page?", async (req, res) => {
  const tu_khoa = req.params.tu_khoa;
  const page = Number(req.params.page) || 1;
  const sosp = Number(req.query.sosp) || 12;
  const sp_arr = await SanPhamModel.findAll({
    where: { ten_sp: { [Op.like]: `%${tu_khoa}%` }, an_hien: 1 },

    order: [
      ["ngay", "DESC"],
      ["gia", "ASC"],
    ],
    offset: (page - 1) * sosp,
    limit: sosp,
  });
  res.json(sp_arr);
});

app.get("/api/tintuc", async (req, res) => {
  const tintuc_arr = await TinTucModel.findAll();
  res.json(tintuc_arr);
});
app.get("/api/tintuc/:id", async (req, res) => {
  const id = Number(req.params.id);
  const tintuc = await TinTucModel.findOne({
    where: { id: id },
  });
  res.json(tintuc);
});

app.post("/api/luudonhang/", async (req, res) => {
  let { ho_ten, email, ghi_chu } = req.body;
  await DonHangModel.create({
    ho_ten: ho_ten,
    email: email,
    ghi_chu: ghi_chu,
  })
    .then(function (item) {
      res.json({ thong_bao: "Đơn hàng đang được xử lí", dh: item });
    })
    .catch(function (err) {
      res.json({ thong_bao: "Lỗi tạo đơn hàng", err });
    });
});

app.post("/api/luugiohang/", async (req, res) => {
  let { id_dh, id_sp, so_luong } = req.body;
  await DonHangChiTietModel.create({
    id_dh: id_dh,
    id_sp: id_sp,
    so_luong: so_luong,
  })
    .then(function (item) {
      res.json({ thong_bao: "Đã lưu giỏ hàng", sp: item });
    })
    .catch(function (err) {
      res.json({ thong_bao: "Lỗi lưu giỏ hàng ", err });
    });
});

// app.get("/api/timkiem", async (req, res) => {
//   try {
//     const tu_khoa = req.query.tu_khoa || "";
//     const page = Number(req.query.page) || 1;
//     const sosp = Number(req.query.sosp) || 12;

//     const sp_arr = await SanPhamModel.findAll({
//       where: {
//         ten_sp: { [Op.substring]: `%${tu_khoa}%` },
//         an_hien: 1,
//       },
//       order: [
//         ["ngay", "DESC"],
//         ["gia", "ASC"],
//       ],
//       offset: (page - 1) * sosp,
//       limit: sosp,
//     });

//     res.json(sp_arr);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Lỗi server" });
//   }
// });

app
  .listen(port, () => {
    console.log(`Ung dung dang chay o port ${port}`);
  })
  .on("error", function (err) {
    console.log(`Loi xay ra khi chay ung dung ${err}`);
  });

const express = require("express");
const bcrypt = require('bcryptjs');
const validator = require('validator');
const dotenv = require("dotenv");
var app = express(); 
const port = 3005;
require('dotenv').config(); // hoặc dotenv.config();

app.use(express.json()); //cho phép đọc dữ liệu dạng json
const cors = require("cors");
app.use(cors()); //cho phép mọi nguồi bên ngoài request đến ứnd dụng
const {
  SanPhamModel,
  LoaiModel,
  TinTucModel,
  DonHangChiTietModel,
  DonHangModel,
  UserModel,
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
  let { page, limit, category, sort, minPrice, maxPrice } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;
  
  let whereClause = { an_hien: 1 };
  if (category) whereClause.id_loai = category;
  
  // Add price range filter
  if (minPrice && maxPrice) {
    whereClause.gia = {
      [Op.between]: [parseInt(minPrice), parseInt(maxPrice)]
    };
  }

  let order = [];
  if (sort === "asc") order = [["gia", "ASC"]];
  else if (sort === "desc") order = [["gia", "DESC"]];
  else order = [["ngay", "DESC"], ["gia", "ASC"]];

  const offset = (page - 1) * limit;

  // Get total count
  const total = await SanPhamModel.count({ where: whereClause });
  
  const items = await SanPhamModel.findAll({
    where: whereClause,
    order: order,
    offset: offset,
    limit: limit,
  });

  res.json({
    items,
    total,
    page,
    limit
  });
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

/* -------- Đăng ký ------ */
app.post(`/api/dangky`, async (req, res)=>{
  let {email, mat_khau, go_lai_mat_khau, ho_ten} = req.body;
  
    // 1. Kiểm tra rỗng
    if (!email || !mat_khau || !go_lai_mat_khau || !ho_ten) {
      return res.json({ thong_bao: "Vui lòng nhập đầy đủ tất cả thông tin." });
    }
  
    // 2. Kiểm tra độ dài họ tên
    if (ho_ten.length < 2 || ho_ten.length > 50) {
      return res.json({ thong_bao: "Họ tên phải từ 2 đến 50 ký tự." });
    }
  
    // 3. Kiểm tra định dạng email
    if (!validator.isEmail(email)) {
      return res.json({ thong_bao: "Email không hợp lệ." });
    }
  
    // 4. Kiểm tra độ dài email
    if (email.length > 100) {
      return res.json({ thong_bao: "Email quá dài. Tối đa 100 ký tự." });
    }
  
    // 5. Kiểm tra mật khẩu mạnh
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strongPasswordRegex.test(mat_khau)) {
      return res.json({ 
        thong_bao: "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
      });
    }
  
    // 6. Mật khẩu nhập lại phải khớp
    if (mat_khau !== go_lai_mat_khau) {
      return res.json({ thong_bao: "Mật khẩu nhập lại không khớp." });
    }
  
    // 7. Kiểm tra email đã tồn tại
    try {
      const existingUser = await UserModel.findOne({ where: { email } }); // SELECT * FROM users WHERE email = email

      if (existingUser) {
        return res.json({ thong_bao: "Email đã được sử dụng để đăng ký." });
      }
    } catch (err) {
      return res.json({ thong_bao: "Lỗi kiểm tra email", err });
    }
   // 8. Mã hóa và lưu
   try {
    const salt = bcrypt.genSaltSync(10);
    const mk_mahoa = bcrypt.hashSync(mat_khau, salt);

    const user = await UserModel.create({
      email,
      ho_ten,
      mat_khau: mk_mahoa
    });
    res.json({ thong_bao: "Đăng ký thành công", user });
  } catch (err) {
    res.json({ thong_bao: "Lỗi lưu người dùng", err });
  }
})


/* ----- Đăng nhập ----- */
app.post('/api/dangnhap', async (req, res) => {
  const { email, mat_khau } = req.body;

  // 1. Kiểm tra input
  if (!email || !mat_khau) {
    return res.json({ thong_bao: "Vui lòng nhập đầy đủ email và mật khẩu." });
  }

  // 2. Kiểm tra định dạng email
  if (!validator.isEmail(email)) {
    return res.status(400).json({ thong_bao: "Email không hợp lệ." });
  }

  // 3. Tìm user
  const user = await UserModel.findOne({ where: { email } });
  if (!user) {
    return res.status(401).json({ thong_bao: "Email không tồn tại." });
  }

  // 4. Kiểm tra mật khẩu
  const kq = bcrypt.compareSync(mat_khau, user.mat_khau);
  if (!kq) {
    return res.status(401).json({ thong_bao: "Mật khẩu không đúng." });
  }

  // 5. Tạo JWT
  const jwt = require('jsonwebtoken');
  const payload = {
    email: user.email,
    ho_ten: user.ho_ten,
    id: user.id
  };
  const PRIVATE_KEY = process.env.JWT_SECRET || "fallback-secret";
  const maxAge = "3h";

  const bearerToken = jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: maxAge,
    subject: user.id + ""
  });

  // 6. Trả kết quả
  res.status(200).json({
    thong_bao: "Đăng nhập thành công",
    token: bearerToken,
    expiresIn: maxAge,
    info: {
      email: user.email,
      ho_ten: user.ho_ten
    }
  });
});


app.post('/api/doipass', async (req, res) => {
  let { email, pass_old, pass_new1, pass_new2 } = req.body;
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(403).json({ thong_bao: 'Token không hợp lệ' });
  
  const token = authHeader.split(' ')[1];
  const fs = require('fs');
  let private_key = fs.readFileSync("private-key.txt");
  const jwt = require("node-jsonwebtoken");
  let decoded;
  
  try {
    decoded = jwt.verify(token, private_key);
  } catch (err) {
    return res.status(403).json({ thong_bao: 'Token hết hạn hoặc không hợp lệ' });
  }

  let id = decoded.id;
  const user = await UserModel.findByPk(id);
  let mk_trongdb = user.mat_khau;
  const bcrypt = require("bcryptjs");
  let kq = bcrypt.compareSync(pass_old, mk_trongdb);
  
  if (kq == false)
    return res.status(403).json({ "thong_bao": "Mật khẩu không đúng" });
  if (pass_new1 != "" && pass_new1 != pass_new2)
    return res.json({ "thong_bao": "2 Mật khẩu mới không khớp" });

  const salt = bcrypt.genSaltSync(10);
  let mk_mahoa = bcrypt.hashSync(pass_new1, salt); // mã hóa mật khẩu

  await UserModel.update({ mat_khau: mk_mahoa }, { where: { id: id } });

  res.status(200).json({ "thong_bao": "Đã cập nhật" });
});


app
  .listen(port, () => {
    console.log(`Ung dung dang chay o port ${port}`);
  })
  .on("error", function (err) {
    console.log(`Loi xay ra khi chay ung dung ${err}`);
  });

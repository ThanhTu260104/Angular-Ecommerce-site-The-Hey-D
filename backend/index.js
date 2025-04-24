const express = require("express");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const dotenv = require("dotenv");
const multer = require("multer");
const { cloudinary } = require("./config/cloudinary");
const uploadCloud = require("./config/uploadCloud");

var app = express();
const { Sequelize } = require("sequelize");
const port = 3005;
const cors = require("cors");
const { Op } = require("sequelize");
app.use(express.json());
require("dotenv").config();

app.use(cors()); //cho phép mọi nguồi bên ngoài request đến ứnd dụng
const {
  SanPhamModel,
  LoaiModel,
  TinTucModel,
  DonHangChiTietModel,
  DonHangModel,
  UserModel,
  LoaiTinModel,
  ThuocTinhModel,
} = require("./config/database"); //các model lấy database

app.post("/api/upload", uploadCloud.single("image"), async (req, res) => {
  try {
    const imageUrl = req.file.path; // link ảnh
    const publicId = req.file.filename; // public_id dùng để xoá

    res.json({ url: imageUrl, public_id: `products/${publicId}` });
  } catch (err) {
    console.error("Lỗi upload:", err);
    res.status(500).json({ thong_bao: "Lỗi khi upload ảnh." });
  }
});

// Loại sản phẩm
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

app.post("/api/admin/loai", async (req, res) => {
  const { ten_loai, an_hien, thu_tu } = req.body;

  // Validate đầu vào từng phần cụ thể
  const errors = [];
  if (!ten_loai || typeof ten_loai !== "string" || ten_loai.trim() === "") {
    console.log("Tên loại là bắt buộc và phải là chuỗi.");
    errors.push("Tên loại là bắt buộc và phải là chuỗi.");
  }

  if (an_hien === undefined || (an_hien !== 0 && an_hien !== 1)) {
    console.log("Trạng thái hiển thị (an_hien) phải là 0 hoặc 1.");
    errors.push("Trạng thái hiển thị (an_hien) phải là 0 hoặc 1.");
  }

  if (thu_tu !== undefined && (isNaN(thu_tu) || thu_tu < 0)) {
    console.log("Thứ tự (thu_tu) phải là số nguyên không âm.");
    errors.push("Thứ tự (thu_tu) phải là số nguyên không âm.");
  }

  if (errors.length > 0) {
    console.log("Dữ liệu không hợp lệ:", errors);
    return res.status(400).json({ thong_bao: "Dữ liệu không hợp lệ", errors });
  }

  // Tạo slug tự động từ ten_loai
  const slug = ten_loai
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    // Kiểm tra nếu người dùng nhập thu_tu → có bị trùng không?
    let thu_tu_final;

    if (thu_tu !== undefined) {
      const ton_tai = await LoaiModel.findOne({ where: { thu_tu } });
      if (ton_tai) {
        return res.status(400).json({
          thong_bao: "Thứ tự đã tồn tại, hãy chọn số khác!",
        });
      }
      thu_tu_final = thu_tu;
    } else {
      const maxThuTu = await LoaiModel.max("thu_tu");
      thu_tu_final = (maxThuTu || 0) + 1;
    }

    const loai = await LoaiModel.create({
      ten_loai,
      slug,
      thu_tu: thu_tu_final,
      an_hien,
    });

    return res.json({ thong_bao: "Đã thêm loại thành công", loai });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res.status(400).json({
        thong_bao: "Slug đã tồn tại. Hãy đổi tên loại.",
      });
    }

    console.error("Lỗi khi thêm loại:", err);
    return res.status(500).json({ thong_bao: "Lỗi server khi thêm loại." });
  }
});

app.get("/api/admin/loai", async (req, res) => {
  try {
    const loai_arr = await LoaiModel.findAll({
      order: [["thu_tu", "ASC"]],
    });
    res.json({ data: loai_arr, total: loai_arr.length });
  } catch (err) {
    console.error("Lỗi lấy danh sách loại:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi lấy danh sách loại." });
  }
});
app.get("/api/admin/loai/:id", async (req, res) => {
  const loai = await LoaiModel.findByPk(req.params.id);
  if (!loai) {
    return res.status(404).json({ thong_bao: "Không tìm thấy loại!" });
  }
  res.json(loai);
});
app.put("/api/admin/loai/:id", async (req, res) => {
  const { id } = req.params;
  const { ten_loai, thu_tu, an_hien } = req.body;

  if (!ten_loai || an_hien === undefined) {
    return res.status(400).json({ thong_bao: "Thiếu dữ liệu đầu vào!" });
  }

  // Tạo slug tự động từ ten_loai
  const slug = ten_loai
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  try {
    // Kiểm tra xem loại có tồn tại không
    const loaiHienTai = await LoaiModel.findByPk(id);
    if (!loaiHienTai) {
      return res
        .status(404)
        .json({ thong_bao: "Không tìm thấy loại để cập nhật." });
    }

    // Xử lý thu_tu
    let thu_tu_final = loaiHienTai.thu_tu; // giữ nguyên mặc định nếu không có

    if (thu_tu !== undefined) {
      // Nếu người dùng nhập → kiểm tra có trùng không (với bản ghi khác)
      const trung = await LoaiModel.findOne({
        where: {
          thu_tu,
          id: { [Op.ne]: id }, // loại trừ chính bản ghi đang sửa
        },
      });

      if (trung) {
        return res.status(400).json({
          thong_bao: "Thứ tự đã tồn tại. Vui lòng chọn số khác.",
        });
      }

      thu_tu_final = thu_tu;
    }

    // Cập nhật dữ liệu
    await LoaiModel.update(
      {
        ten_loai,
        slug,
        thu_tu: thu_tu_final,
        an_hien,
      },
      {
        where: { id },
      }
    );

    return res.json({ thong_bao: "Đã cập nhật loại thành công." });
  } catch (err) {
    if (err.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .json({ thong_bao: "Slug đã tồn tại. Hãy đổi tên loại." });
    }

    console.error("Lỗi khi cập nhật loại:", err);
    return res.status(500).json({ thong_bao: "Lỗi server khi cập nhật loại." });
  }
});
app.delete("/api/admin/loai/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const soBanGhi = await LoaiModel.destroy({ where: { id } });

    if (soBanGhi === 0) {
      return res.status(404).json({ thong_bao: "Không tìm thấy loại để xóa." });
    }

    return res.json({ thong_bao: "Đã xóa loại thành công." });
  } catch (err) {
    console.error("Lỗi khi xóa loại:", err);
    return res.status(500).json({ thong_bao: "Lỗi server khi xóa loại." });
  }
});

// Sản phẩm
app.get("/api/sanpham", async (req, res) => {
  let { page, limit, category, sort, minPrice, maxPrice } = req.query;
  page = parseInt(page) || 1;
  limit = parseInt(limit) || 12;

  let whereClause = { an_hien: 1 };
  if (category) whereClause.id_loai = category;

  // Add price range filter
  if (minPrice && maxPrice) {
    whereClause.gia = {
      [Op.between]: [parseInt(minPrice), parseInt(maxPrice)],
    };
  }

  let order = [];
  if (sort === "asc") order = [["gia", "ASC"]];
  else if (sort === "desc") order = [["gia", "DESC"]];
  else
    order = [
      ["ngay", "DESC"],
      ["gia", "ASC"],
    ];

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
    limit,
  });
});

app.get("/api/admin/sanpham", async (req, res) => {
  try {
    // Lấy dữ liệu từ query
    let {
      page = 1,
      limit = 15,
      sort = "ngay:desc",
      an_hien,
      hot,
      tu_khoa,
      id_loai, // Thêm id_loai vào danh sách query params
    } = req.query;

    page = parseInt(page);
    limit = parseInt(limit);
    const offset = (page - 1) * limit;

    // ✨ Tối ưu xử lý sort
    let order = sort.split(",").map((item) => {
      const [field, direction] = item.split(":");
      return [field.trim(), (direction || "asc").toUpperCase()];
    });

    // Nếu không có order hợp lệ, fallback
    if (order.length === 0) {
      order = [
        ["ngay", "DESC"],
        ["gia", "ASC"],
      ];
    }

    // Lọc theo an_hien và hot
    const whereClause = {};
    if (an_hien !== undefined) whereClause.an_hien = Number(an_hien);
    if (hot !== undefined) whereClause.hot = Number(hot);

    // Thêm điều kiện lọc theo danh mục
    if (id_loai) {
      whereClause.id_loai = Number(id_loai);
    }

    // Thêm điều kiện tìm kiếm
    if (tu_khoa) {
      whereClause[Op.or] = [
        { ten_sp: { [Op.like]: `%${tu_khoa}%` } },
        { mo_ta: { [Op.like]: `%${tu_khoa}%` } },
      ];
    }

    const total = await SanPhamModel.count({ where: whereClause });

    const sanpham_arr = await SanPhamModel.findAll({
      where: whereClause,
      include: [
        {
          model: LoaiModel,
          as: "loai",
          attributes: ["ten_loai"],
        },
        {
          model: ThuocTinhModel,
          as: "thuoc_tinh",
        },
      ],
      order,
      limit,
      offset,
    });

    res.json({
      items: sanpham_arr,
      total,
      page,
      limit,
    });
  } catch (err) {
    console.error("Lỗi lấy danh sách sản phẩm:", err);
    res
      .status(500)
      .json({ thong_bao: "Lỗi server khi lấy danh sách sản phẩm." });
  }
});
function generateSlug(str) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "") // xoá dấu tiếng Việt
    .replace(/[^a-z0-9]+/g, "-") // thay ký tự đặc biệt bằng dấu -
    .replace(/^-+|-+$/g, "") // bỏ dấu - ở đầu/cuối
    .replace(/--+/g, "-"); // gộp nhiều dấu - liên tiếp thành 1
}
function generateUniqueSlug(baseName) {
  return `${generateSlug(baseName)}-${Date.now()}`;
}

app.post("/api/admin/sanpham", async (req, res) => {
  try {
    let {
      ten_sp,
      gia,
      gia_km,
      id_loai,
      mo_ta,
      hot = 0,
      an_hien = 1,
      tinh_chat = 0,
      ngay,
      hinh,
      slug,
    } = req.body;

    if (!ten_sp || !id_loai || gia === undefined) {
      return res.status(400).json({ thong_bao: "Thiếu dữ liệu bắt buộc." });
    }

    // Tạo slug nếu chưa có
    const finalSlug = slug || generateUniqueSlug(ten_sp);

    const sanpham = await SanPhamModel.create({
      ten_sp,
      slug: finalSlug,
      gia,
      gia_km,
      id_loai,
      mo_ta,
      hot,
      an_hien,
      tinh_chat,
      ngay: ngay || new Date(),
      hinh,
    });
    if (req.body.thuoc_tinh) {
      await ThuocTinhModel.create({
        ...req.body.thuoc_tinh,
        id_sp: sanpham.id,
      });
    }
    res.json({ thong_bao: "Đã thêm sản phẩm thành công", sanpham });
  } catch (err) {
    console.error("Lỗi khi thêm sản phẩm:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi thêm sản phẩm." });
  }
});

app.put(
  "/api/admin/sanpham/:id",
  uploadCloud.single("image"),
  async (req, res) => {
    const { id } = req.params;
    const {
      ten_sp,
      gia,
      gia_km,
      id_loai,
      mo_ta,
      hot,
      an_hien,
      tinh_chat,
      ngay,
      slug,
    } = req.body;

    try {
      const sp = await SanPhamModel.findByPk(id);
      if (!sp) {
        return res.status(404).json({ thong_bao: "Không tìm thấy sản phẩm." });
      }

      // Tạo slug mới nếu không có
      const finalSlug = slug || generateUniqueSlug(ten_sp);

      let updatedData = {
        ten_sp,
        slug: finalSlug,
        gia,
        gia_km,
        id_loai,
        mo_ta,
        hot,
        an_hien,
        tinh_chat,
        ngay,
      };
      if (req.body.thuoc_tinh) {
        const thuoc_tinh = await ThuocTinhModel.findOne({
          where: { id_sp: id },
        });

        if (thuoc_tinh) {
          await ThuocTinhModel.update(req.body.thuoc_tinh, {
            where: { id_sp: id },
          });
        } else {
          await ThuocTinhModel.create({
            ...req.body.thuoc_tinh,
            id_sp: id,
          });
        }
      }

      // Nếu có ảnh mới
      if (req.file) {
        // Xoá ảnh cũ nếu có
        if (sp.hinh_public_id) {
          await cloudinary.uploader.destroy(sp.hinh_public_id);
        }

        updatedData.hinh = req.file.path;
        updatedData.hinh_public_id = `products/${req.file.filename}`;
      }

      await SanPhamModel.update(updatedData, { where: { id } });

      res.json({ thong_bao: "Đã cập nhật sản phẩm thành công." });
    } catch (err) {
      console.error("Lỗi cập nhật sản phẩm:", err);
      res.status(500).json({ thong_bao: "Lỗi server khi cập nhật sản phẩm." });
    }
  }
);
app.get("/api/admin/sanpham/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sp = await SanPhamModel.findOne({
      where: { id },
      include: [
        {
          model: LoaiModel,
          as: "loai",
          attributes: ["ten_loai"], // có thể hien thi ten loai
        },
        {
          model: ThuocTinhModel,
          as: "thuoc_tinh",
        },
      ],
    });

    if (!sp) {
      return res.status(404).json({ thong_bao: "Không tìm thấy sản phẩm." });
    }

    res.json(sp);
  } catch (err) {
    console.error("Lỗi lấy chi tiết sản phẩm:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi lấy sản phẩm." });
  }
});

app.delete("/api/admin/sanpham/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const sp = await SanPhamModel.findByPk(id);
    if (!sp) {
      return res
        .status(404)
        .json({ thong_bao: "Không tìm thấy sản phẩm để xoá." });
    }

    // Nếu có public_id, xoá ảnh trên Cloudinary trước
    if (sp.hinh_public_id) {
      await cloudinary.uploader.destroy(sp.hinh_public_id);
    }

    // Xoá khỏi DB
    await SanPhamModel.destroy({ where: { id } });

    res.json({ thong_bao: "Đã xoá sản phẩm và ảnh Cloudinary." });
  } catch (err) {
    console.error("Lỗi khi xoá sản phẩm:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi xoá sản phẩm." });
  }
});

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

// Lấy danh sách tin tức
app.get("/api/tintuc", async (req, res) => {
  try {
    const tintuc_arr = await TinTucModel.findAll({
      include: [
        {
          model: LoaiTinModel,
          as: "loaiTin",
          attributes: ["ten_loai"], // chỉ lấy tên loại
        },
      ],
    });

    // Tùy chỉnh lại dữ liệu trả về nếu muốn bỏ id_loai
    const result = tintuc_arr.map(tin => {
      const tinJSON = tin.toJSON();
      tinJSON.ten_loai = tinJSON.loaiTin?.ten_loai || null;
      delete tinJSON.loaiTin; // bỏ object loaiTin, chỉ giữ lại ten_loai
      return tinJSON;
    });
    

    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy danh sách tin tức" });
  }
});


// Lấy chi tiết tin tức
app.get("/api/tintuc/:id", async (req, res) => {
  const id = Number(req.params.id);
  const tintuc = await TinTucModel.findOne({
    where: { id: id },
  });
  res.json(tintuc);
});

// Thêm tin tức (có upload hình)
app.post("/api/tintuc", uploadCloud.single("hinh"), async (req, res) => {
  const { tieu_de, slug, mo_ta, noi_dung, id_loai } = req.body; // Thêm id_loai
  if (!tieu_de || !req.file || !mo_ta || !noi_dung || !id_loai) {
    return res.status(400).json({ thong_bao: "Thiếu dữ liệu đầu vào!" });
  }

  // Tự tạo slug
  const finalSlug = slug || generateUniqueSlug(tieu_de);

  try {
    const tintuc = await TinTucModel.create({
      tieu_de,
      hinh: req.file.path, // Lưu link hình ảnh từ Cloudinary
      mo_ta,
      slug: finalSlug,
      noi_dung,
      id_loai, // Lưu danh mục tin
      ngay: new Date(), // Thêm ngày hiện tại
    });
    res.json({ thong_bao: "Đã thêm tin tức thành công", tintuc });
  } catch (err) {
    console.error("Lỗi thêm tin tức:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi thêm tin tức." });
  }
});

// Cập nhật tin tức (có sửa hình)
app.put("/api/tintuc/:id", uploadCloud.single("hinh"), async (req, res) => {
  const id = Number(req.params.id);
  const { tieu_de, mo_ta, slug, noi_dung } = req.body;

  if (!tieu_de || !mo_ta || !noi_dung) {
    return res.status(400).json({ thong_bao: "Thiếu dữ liệu đầu vào!" });
  }

  try {
    const tintuc = await TinTucModel.findByPk(id);
    if (!tintuc) {
      return res.status(404).json({ thong_bao: "Không tìm thấy tin tức!" });
    }

    // Nếu có hình mới, xóa hình cũ trên Cloudinary
    if (req.file && tintuc.hinh) {
      const publicId = tintuc.hinh.split("/").pop().split(".")[0]; // Lấy public_id từ URL
      await cloudinary.uploader.destroy(publicId);
      tintuc.hinh = req.file.path; // Cập nhật hình mới
    }

    tintuc.tieu_de = tieu_de;
    tintuc.mo_ta = mo_ta;
    tintuc.noi_dung = noi_dung;
    tintuc.slug = slug || generateUniqueSlug(tieu_de); // Tạo slug mới nếu không có

    await tintuc.save();
    res.json({ thong_bao: "Đã cập nhật tin tức thành công", tintuc });
  } catch (err) {
    console.error("Lỗi cập nhật tin tức:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi cập nhật tin tức." });
  }
});

// Xóa tin tức (có xóa hình)
app.delete("/api/tintuc/:id", async (req, res) => {
  const id = Number(req.params.id);

  try {
    const tintuc = await TinTucModel.findByPk(id);
    if (!tintuc) {
      return res.status(404).json({ thong_bao: "Không tìm thấy tin tức!" });
    }

    // Xóa hình trên Cloudinary nếu có
    if (tintuc.hinh) {
      const publicId = tintuc.hinh.split("/").pop().split(".")[0]; // Lấy public_id từ URL
      await cloudinary.uploader.destroy(publicId);
    }

    await tintuc.destroy();
    res.json({ thong_bao: "Đã xóa tin tức thành công" });
  } catch (err) {
    console.error("Lỗi xóa tin tức:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi xóa tin tức." });
  }
});

// API lấy danh sách danh mục tin
app.get("/api/loaitin", async (req, res) => {
  try {
    const loaiTinArr = await LoaiTinModel.findAll({
      where: { an_hien: true }, // Lọc các danh mục đang hiển thị
      order: [["thu_tu", "ASC"]],
    });
    res.json(loaiTinArr);
  } catch (error) {
    console.error("Lỗi lấy danh mục tin:", error);
    res.status(500).json({ thong_bao: "Lỗi server khi lấy danh mục tin." });
  }
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

app.post(`/api/dangky`, async (req, res) => {
  let { email, mat_khau, go_lai_mat_khau, ho_ten } = req.body;

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
  const strongPasswordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
  if (!strongPasswordRegex.test(mat_khau)) {
    return res.json({
      thong_bao:
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt.",
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
      mat_khau: mk_mahoa,
    });
    res.json({ thong_bao: "Đăng ký thành công", user });
  } catch (err) {
    res.json({ thong_bao: "Lỗi lưu người dùng", err });
  }
});

app.post("/api/dangnhap", async (req, res) => {
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
  const jwt = require("jsonwebtoken");
  const payload = {
    email: user.email,
    ho_ten: user.ho_ten,
    id: user.id,
    vai_tro: user.vai_tro,
  };
  const PRIVATE_KEY = process.env.JWT_SECRET || "fallback-secret";
  const maxAge = "3h";

  const bearerToken = jwt.sign(payload, PRIVATE_KEY, {
    expiresIn: maxAge,
    subject: user.id + "",
  });

  // 6. Trả kết quả
  res.status(200).json({
    thong_bao: "Đăng nhập thành công",
    token: bearerToken,
    expiresIn: maxAge,
    info: {
      email: user.email,
      ho_ten: user.ho_ten,
      vai_tro: user.vai_tro,
    },
  });
});

app.post("/api/doipass", async (req, res) => {
  let { email, pass_old, pass_new1, pass_new2 } = req.body;
  const authHeader = req.headers["authorization"];
  if (!authHeader)
    return res.status(403).json({ thong_bao: "Token không hợp lệ" });

  const token = authHeader.split(" ")[1];
  const fs = require("fs");
  let private_key = fs.readFileSync("private-key.txt");
  const jwt = require("jsonwebtoken");
  let decoded;

  try {
    decoded = jwt.verify(token, private_key);
  } catch (err) {
    return res
      .status(403)
      .json({ thong_bao: "Token hết hạn hoặc không hợp lệ" });
  }

  let id = decoded.id;
  const user = await UserModel.findByPk(id);
  let mk_trongdb = user.mat_khau;
  const bcrypt = require("bcryptjs");
  let kq = bcrypt.compareSync(pass_old, mk_trongdb);

  if (kq == false)
    return res.status(403).json({ thong_bao: "Mật khẩu không đúng" });
  if (pass_new1 != "" && pass_new1 != pass_new2)
    return res.json({ thong_bao: "2 Mật khẩu mới không khớp" });

  const salt = bcrypt.genSaltSync(10);
  let mk_mahoa = bcrypt.hashSync(pass_new1, salt); // mã hóa mật khẩu

  await UserModel.update({ mat_khau: mk_mahoa }, { where: { id: id } });

  res.status(200).json({ thong_bao: "Đã cập nhật" });
});

// Lấy danh sách toàn bộ thuộc tính
app.get("/api/admin/thuoctinh", async (req, res) => {
  try {
    const data = await ThuocTinhModel.findAll();
    res.json(data);
  } catch (err) {
    console.error("Lỗi lấy thuộc tính:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi lấy thuộc tính." });
  }
});

// Lấy thuộc tính của sản phẩm cụ thể
app.get("/api/admin/thuoctinh/sanpham/:id_sp", async (req, res) => {
  try {
    const id_sp = req.params.id_sp;
    const tt = await ThuocTinhModel.findOne({ where: { id_sp } });
    if (!tt) {
      return res
        .status(404)
        .json({ thong_bao: "Không có thuộc tính cho sản phẩm." });
    }
    res.json(tt);
  } catch (err) {
    console.error("Lỗi lấy thuộc tính sản phẩm:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi lấy thuộc tính." });
  }
});

// Thêm thuộc tính mới
app.post("/api/admin/thuoctinh", async (req, res) => {
  try {
    const { id_sp, ram, cpu, dia_cung, mau_sac, can_nang } = req.body;
    const tt = await ThuocTinhModel.create({
      id_sp,
      ram,
      cpu,
      dia_cung,
      mau_sac,
      can_nang,
    });
    res.json({ thong_bao: "Đã thêm thuộc tính thành công", tt });
  } catch (err) {
    console.error("Lỗi thêm thuộc tính:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi thêm thuộc tính." });
  }
});

// Cập nhật thuộc tính theo sản phẩm
app.put("/api/admin/thuoctinh/sanpham/:id_sp", async (req, res) => {
  try {
    const id_sp = req.params.id_sp;
    const existing = await ThuocTinhModel.findOne({ where: { id_sp } });
    if (!existing) {
      return res
        .status(404)
        .json({ thong_bao: "Không tìm thấy thuộc tính để cập nhật." });
    }
    await ThuocTinhModel.update(req.body, { where: { id_sp } });
    res.json({ thong_bao: "Đã cập nhật thuộc tính thành công" });
  } catch (err) {
    console.error("Lỗi cập nhật thuộc tính:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi cập nhật thuộc tính." });
  }
});

// Xoá thuộc tính theo sản phẩm
app.delete("/api/admin/thuoctinh/sanpham/:id_sp", async (req, res) => {
  try {
    const id_sp = req.params.id_sp;
    const soBanGhi = await ThuocTinhModel.destroy({ where: { id_sp } });
    if (soBanGhi === 0) {
      return res.status(404).json({ thong_bao: "Không có thuộc tính để xoá." });
    }
    res.json({ thong_bao: "Đã xoá thuộc tính thành công." });
  } catch (err) {
    console.error("Lỗi xoá thuộc tính:", err);
    res.status(500).json({ thong_bao: "Lỗi server khi xoá thuộc tính." });
  }
});
app
  .listen(port, () => {
    console.log(`Ung dung dang chay o port ${port}`);
  })
  .on("error", function (err) {
    console.log(`Loi xay ra khi chay ung dung ${err}`);
  });

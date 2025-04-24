const { Sequelize, DataTypes } = require("sequelize");
// Tạo đối tượng kết nối đến database
const sequelize = new Sequelize("laptop_node", "root", "", {
  host: "localhost",
  dialect: "mysql",
});

// model mô tả table loai
const LoaiModel = sequelize.define(
  "loai",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_loai: { type: DataTypes.STRING, allowNull: false },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    thu_tu: { type: DataTypes.INTEGER, defaultValue: 0 },
    an_hien: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }, // thêm created_at
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }, // thêm updated_at
  },
  { timestamps: false, tableName: "loai" }
);

const TinTucModel = sequelize.define(
  "tin_tuc",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    tieu_de: { type: DataTypes.STRING(255), allowNull: false },
    slug: { type: DataTypes.STRING(255), allowNull: false },
    mo_ta: { type: DataTypes.STRING(1000), allowNull: true, defaultValue: null },
    hinh: { type: DataTypes.STRING(255), allowNull: true, defaultValue: null },
    ngay: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
    noi_dung: { type: DataTypes.TEXT, allowNull: true, defaultValue: null },
    id_loai: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    luot_xem: { type: DataTypes.INTEGER, allowNull: true, defaultValue: 0 },
    hot: { type: DataTypes.TINYINT, allowNull: true, defaultValue: 0 },
    an_hien: { type: DataTypes.TINYINT, allowNull: true, defaultValue: 1 },
    tags: { type: DataTypes.STRING(2000), allowNull: true, defaultValue: null },
  },
  {
    timestamps: false,
    tableName: "tin_tuc",
  }
);


// model diễn tả cấu trúc 2 table san_pham
const SanPhamModel = sequelize.define(
  "san_pham",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_sp: { type: DataTypes.STRING },
    ngay: { type: DataTypes.DATE },
    slug: { type: DataTypes.STRING, allowNull: false, unique: true },
    gia: { type: DataTypes.INTEGER },
    gia_km: { type: DataTypes.INTEGER },
    id_loai: { type: DataTypes.INTEGER },
    mo_ta: { type: DataTypes.TEXT },
    hot: { type: DataTypes.INTEGER },
    an_hien: { type: DataTypes.INTEGER },
    hinh: { type: DataTypes.STRING },
    hinh_public_id: { type: DataTypes.STRING, allowNull: true },
    tinh_chat: { type: DataTypes.INTEGER, defaultValue: 0 },
    luot_xem: { type: DataTypes.INTEGER, defaultValue: 0 },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }, // thêm created_at
    updated_at: { type: DataTypes.DATE, defaultValue: Sequelize.NOW }, // thêm updated_at

  },
  { timestamps: false, tableName: "san_pham" }
);

// Quan hệ giữa Loai và SanPham để lấy danh sách sản phẩm theo loại dùng include
LoaiModel.hasMany(SanPhamModel, { foreignKey: "id_loai", as: "san_phams" })


const ThuocTinhModel = sequelize.define(
  "thuoc_tinh",
  {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      primaryKey: true,
      autoIncrement: true,
    },
    id_sp: {
      type: DataTypes.BIGINT.UNSIGNED,
      allowNull: false,
    },
    ram: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    cpu: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    dia_cung: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    mau_sac: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    can_nang: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: null,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: null,
    },
  },
  {
    timestamps: true,
    tableName: "thuoc_tinh",
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);
const DonHangModel = sequelize.define(
  "don_hang",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    thoi_diem_mua: { type: DataTypes.DATE, defaultValue: new Date() },
    ho_ten: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING },
    ghi_chu: { type: DataTypes.STRING, defaultValue: "" },
  },
  { timestamps: false, tableName: "don_hang" }
);
// model diễn tả cấu trúc  table don_hang_chi_tiet
const DonHangChiTietModel = sequelize.define(
  "don_hang_chi_tiet",
  {
    id_ct: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_dh: { type: DataTypes.INTEGER },
    id_sp: { type: DataTypes.INTEGER },
    so_luong: { type: DataTypes.INTEGER },
  },
  { timestamps: false, tableName: "don_hang_chi_tiet" }
);
const UserModel = sequelize.define('users', { 
  id :{type:DataTypes.INTEGER ,primaryKey:true, autoIncrement:true }, 
  email: {type: DataTypes.STRING, require:true },
  mat_khau: {type: DataTypes.STRING, require:true },
  ho_ten: { type: DataTypes.STRING , require:true}, 
  vai_tro: { type: DataTypes.TINYINT , defaultValue:0}, 
  khoa: {type: DataTypes.TINYINT , defaultValue:0}
}, { timestamps:false, tableName:"users" }
);


const LoaiTinModel = sequelize.define("loai_tin", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ten_loai: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  thu_tu: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  an_hien: {
    type: DataTypes.BOOLEAN, // có thể là INTEGER nếu bạn dùng 0/1
    defaultValue: true,
  },
}, {
  tableName: "loai_tin", // đúng tên bảng trong DB
  timestamps: false, // nếu bảng không có createdAt/updatedAt
});


// Định nghĩa mối quan hệ
SanPhamModel.hasOne(ThuocTinhModel, {
  sourceKey: "id",
  foreignKey: "id_sp",
  as: "thuoc_tinh",
});

TinTucModel.belongsTo(LoaiTinModel, {
  foreignKey: "id_loai",
  as: "loaiTin", // alias dùng để truy cập sau này
});
LoaiTinModel.hasMany(TinTucModel ,{
  foreignKey: "id_loai",
});

ThuocTinhModel.belongsTo(SanPhamModel, {
  targetKey: "id",
  foreignKey: "id_sp",
  as: "san_pham",
});

// Quan hệ giữa SanPham và Loai
SanPhamModel.belongsTo(LoaiModel, {
  foreignKey: "id_loai",
  as: "loai",
});

LoaiModel.hasMany(SanPhamModel, {
  foreignKey: "id_loai",
  as: "san_pham",
});
LoaiModel.hasMany(SanPhamModel, { foreignKey: "id_loai" });
SanPhamModel.belongsTo(LoaiModel, { foreignKey: "id_loai" });
module.exports = { SanPhamModel, LoaiModel, DonHangModel, DonHangChiTietModel, UserModel, ThuocTinhModel, TinTucModel, LoaiTinModel, sequelize };

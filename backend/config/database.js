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
    thu_tu: { type: DataTypes.INTEGER, defaultValue: 0 },
    an_hien: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false, tableName: "loai" }
);

// model diễn tả cấu trúc 2 table san_pham
const SanPhamModel = sequelize.define(
  "san_pham",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    ten_sp: { type: DataTypes.STRING },
    ngay: { type: DataTypes.DATE },
    gia: { type: DataTypes.INTEGER },
    gia_km: { type: DataTypes.INTEGER },
    id_loai: { type: DataTypes.INTEGER },
    mo_ta: { type: DataTypes.TEXT },
    hot: { type: DataTypes.INTEGER },
    an_hien: { type: DataTypes.INTEGER },
    hinh: { type: DataTypes.STRING },
    tinh_chat: { type: DataTypes.INTEGER, defaultValue: 0 },
    luot_xem: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { timestamps: false, tableName: "san_pham" }
);

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


// Định nghĩa mối quan hệ
SanPhamModel.hasOne(ThuocTinhModel, {
  sourceKey: "id",
  foreignKey: "id_sp",
  as: "thuoc_tinh",
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

module.exports = { SanPhamModel, LoaiModel, DonHangModel, DonHangChiTietModel, UserModel, ThuocTinhModel, sequelize };

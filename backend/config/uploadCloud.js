const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { cloudinary } = require("../config/cloudinary");

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "product", // thư mục lưu trong Cloudinary
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
  },
});

const uploadCloud = multer({ storage: storage });

module.exports = uploadCloud;

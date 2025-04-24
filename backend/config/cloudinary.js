const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dba9gnba5",
  api_key: "869729585719911",
  api_secret: "_SMUvVYhU1zv7voLIi_5THcVePQ"
});

module.exports = { cloudinary };

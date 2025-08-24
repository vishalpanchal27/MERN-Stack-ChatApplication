const { upload } = require("../Config/cloudinary");

// Single image
const singleUpload = upload.single("profilePicture");

// Multiple images
const multipleUpload = upload.array("images", 5);

module.exports = { singleUpload, multipleUpload };

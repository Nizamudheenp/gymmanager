const cloudinary = require('../config/cloudinary');

const uploadCloudinary = (filePath, folder = "images") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(
            filePath,
            { folder: folder, resource_type: "auto" }, 
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result.secure_url);
            }
        );
    });
};

module.exports = uploadCloudinary;

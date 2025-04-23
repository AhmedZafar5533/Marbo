const streamifier = require("streamifier");
const cloudinary = require("./cloudinary");

const uploadFromBuffer = (buffer) => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { folder: "Service Pages" },
            (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            }
        );
        streamifier.createReadStream(buffer).pipe(uploadStream);
    });
};

module.exports = uploadFromBuffer;

const cloudinary = require('../config/cloudinary');

const uploadToCloudinary = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file.path, {
            folder: 'photo', // customize this
            resource_type: 'auto'
        });
        return {
            url: result.secure_url,
            public_id: result.public_id
        };
    } catch (error) {
        throw new Error(`Upload failed: ${error.message}`);
    }
};

module.exports = { uploadToCloudinary };
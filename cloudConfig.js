// Cloudinary Configuration

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary using credentials from .env
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});

/*
  The keys `cloud_name`, `api_key`, and `api_secret` must match Cloudinary's required field names,
  while the environment variable names (CLOUD_NAME, CLOUD_API_KEY, etc.) can be customized in .env file
*/

// Set up storage engine for Cloudinary using multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'wanderlust_DEV', // Folder name in Cloudinary
        allowedFormats: ['png', 'jpg', 'jpeg'],
    },
});

module.exports = { cloudinary, storage };

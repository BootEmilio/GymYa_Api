const cloudinary = require('cloudinary').v2;

// Configura Cloudinary
cloudinary.config({
  cloud_name: 'dgvsttgdd',
  api_key: '891858392715931',
  api_secret: 'n95H25XH8cBqVVMoHQY1UBP-DNY'
});

module.exports = cloudinary;
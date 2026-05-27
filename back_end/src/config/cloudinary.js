const cloudinary = require("cloudinary").v2;

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME || "dyy1yqvbv",
    api_key: process.env.API_KEY || "526654944435618",
    api_secret: process.env.API_SECRET || "08XD4plv4KMFWcBDOCSWnDmpEf4",
});

module.exports = cloudinary;
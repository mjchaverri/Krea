const { uploadImage } = require("../services/upload.service");

const uploadController = async (req, res) => {
    try {
        const file = req.file;

        if (!file) {
            return res.status(400).json({
                ok: false,
                message: "No file provided",
            });
        }

        const url = await uploadImage(file.path);

        return res.json({
            ok: true,
            url,
        });

    } catch (error) {
        return res.status(500).json({
            ok: false,
            message: error.message,
        });
    }
};

module.exports = {
    uploadController,
};
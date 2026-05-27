const express = require("express");
const router = express.Router();

const upload = require("../middlewares/upload");
const { uploadController } = require("../controllers/upload.controller");

router.post("/", upload.single("file"), uploadController);

module.exports = router;
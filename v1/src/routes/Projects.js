// validations
// validate middleware

const express = require("express");
const { create, index } = require("../controllers/Projects");
const router = express.Router();

router.post("/", create);
router.get("/", index);

module.exports = router;

const express = require("express");
const router = express.Router();
const { getUser, updateUser, deleteUser, pagination } = require(
  "../controller/userController",
);
const { verifyToken, validateSearch } = require(
  "../middleware/validatemiddleware",
);

// UPDATE USER INFO
router.put("/:id", /* , verifyToken */ updateUser);

//endpoint delete
router.delete("/:id", deleteUser);

//get user with pagination and search
router.get("/pagination", validateSearch, pagination);

//endpoint create user lấy field createBy
router.get("/getUser", getUser);

module.exports = router;

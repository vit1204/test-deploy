const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/validatemiddleware").verifyToken;
const {
  createPolls,
  updatePolls,
  deletePolls,
  getPolls,
  updateOptions,
  submitOtions,
} = require("../controller/pollController");

router.post("/", createPolls);
router.delete("/:id", deletePolls);
router.get("/:id", getPolls);

//update options
router.put("/options/:optionId", updateOptions);

// submit
router.post("/:pollId/options/:optionId/:userId/submit", submitOtions);

module.exports = router;

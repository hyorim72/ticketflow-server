const express = require("express");
const router = express.Router();

const {
  getPerformances,
  createPerformance,
  updatePerformance,
  deletePerformance,
} = require("../controllers/performanceController");
const requireAdminKey = require("../middleware/requireAdminKey");

router.get("/", getPerformances);

router.post("/", requireAdminKey, createPerformance);

router.patch("/:id", requireAdminKey, updatePerformance);

router.delete("/:id", requireAdminKey, deletePerformance);

module.exports = router;

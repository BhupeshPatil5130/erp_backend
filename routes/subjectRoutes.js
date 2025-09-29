const express = require("express");
const Subject = require("../models/Subject");
const router = express.Router();

/* ─────────────── READ ─────────────── */
router.get("/", async (_req, res) => {
  try {
    const subjects = await Subject.find().sort({ createdAt: -1 });
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ─────────────── CREATE ─────────────── */
router.post("/", async (req, res) => {
  try {
    const subject = new Subject(req.body);   // id auto-generated in model
    await subject.save();
    res.status(201).json(subject);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ─────────────── UPDATE ─────────────── */
router.put("/:id", async (req, res) => {
  try {
    const updated = await Subject.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ error: "Subject not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

/* ─────────────── DELETE ─────────────── */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Subject.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Subject not found" });
    res.json({ message: "Subject deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;

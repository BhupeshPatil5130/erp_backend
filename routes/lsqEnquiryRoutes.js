const express = require("express")
const router = express.Router()
const LSQEnquiry = require("../models/LSQEnquiry")

// GET all enquiries
router.get("/", async (req, res) => {
  try {
    const { view = "full", status, course, source, q, from, to } = req.query

    const filter = {}
    if (status) filter.status = status
    if (course) filter.course = course
    if (source) filter.source = source
    if (from || to) {
      filter.createdAt = {}
      if (from) filter.createdAt.$gte = new Date(from)
      if (to) filter.createdAt.$lte = new Date(to)
    }

    const search = q
      ? {
          $or: [
            { name: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } },
            { phone: { $regex: q, $options: "i" } },
            { course: { $regex: q, $options: "i" } },
            { source: { $regex: q, $options: "i" } },
          ],
        }
      : null

    const query = LSQEnquiry.find(search ? { ...filter, ...search } : filter)

    if (view === "table") {
      query.select({ name: 1, phone: 1, email: 1, course: 1, source: 1, status: 1, date: 1, createdAt: 1 })
    }

    const enquiries = await query.sort({ createdAt: -1 }).lean()
    res.status(200).json(enquiries)
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch enquiries", error })
  }
})

// POST new enquiry
router.post("/", async (req, res) => {
  try {
    const newEnquiry = new LSQEnquiry(req.body)
    const saved = await newEnquiry.save()
    res.status(201).json(saved)
  } catch (error) {
    res.status(400).json({ message: "Failed to create enquiry", error })
  }
})
// GET by ID
router.get("/:id", async (req, res) => {
  try {
    const enquiry = await LSQEnquiry.findById(req.params.id)
    if (!enquiry) return res.status(404).json({ message: "Enquiry not found" })
    res.status(200).json(enquiry)
  } catch (error) {
    res.status(400).json({ message: "Failed to get enquiry", error })
  }
})
router.get("/count", async (req, res) => {
    try {
      const count = await LSQEnquiry.countDocuments()
      res.status(200).json({ success: true, count })
    } catch (error) {
      res.status(500).json({ success: false, message: "Failed to get count", error })
    }
  })

// PUT update enquiry
router.put("/:id", async (req, res) => {
  try {
    const updated = await LSQEnquiry.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).json(updated)
  } catch (error) {
    res.status(400).json({ message: "Failed to update enquiry", error })
  }
})

// DELETE enquiry
router.delete("/:id", async (req, res) => {
  try {
    await LSQEnquiry.findByIdAndDelete(req.params.id)
    res.status(200).json({ message: "Enquiry deleted successfully" })
  } catch (error) {
    res.status(400).json({ message: "Failed to delete enquiry", error })
  }
})

module.exports = router

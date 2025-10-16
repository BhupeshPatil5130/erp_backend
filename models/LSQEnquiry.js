const mongoose = require("mongoose")

const LSQEnquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    course: { type: String, required: true },
    source: { type: String, required: true },
    notes: { type: String },
    status: { type: String, default: "New" },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
)

// Ensure client receives `id` instead of `_id` and no version key
LSQEnquirySchema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    return ret
  },
})

// Optimize sorting on list views
LSQEnquirySchema.index({ createdAt: -1 })

module.exports = mongoose.model("LSQEnquiry", LSQEnquirySchema)

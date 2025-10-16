// models/Enquiry.js
const mongoose = require("mongoose")

const EnquirySchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  dob: { type: Date, required: true },
  gender: { type: String, required: true },
  program: { type: String, required: true },
  enquirerName: { type: String, required: true },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  alternateMobile: { type: String },
  locality: { type: String, required: true },
  referralSource: { type: String, required: true },
  followupDate: { type: Date, required: true },
  admissionForm: { type: Boolean, default: false },
  notes: { type: String },
  status: { type: String, default: "new" }
}, { timestamps: true })

// Transform output and optimize list queries
EnquirySchema.set("toJSON", {
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id
    delete ret._id
    return ret
  }
})

// Index for faster sorting/filtering in list views
EnquirySchema.index({ createdAt: -1 })

module.exports = mongoose.model("Enquiry", EnquirySchema)

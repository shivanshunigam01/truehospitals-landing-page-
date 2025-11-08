const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
  leadId: { type: Number, unique: true }, // ✅ numeric incremental ID
  name: String,
  phone: String,
  category: String,
  surgeryType: String,
  concern: String,
  date: String,
  status: String,
});

// ✅ Auto-increment before saving a new lead
leadSchema.pre("save", async function (next) {
  if (this.isNew) {
    const lastLead = await this.constructor.findOne().sort("-leadId");
    this.leadId = lastLead ? lastLead.leadId + 1 : 1;
  }
  next();
});

module.exports = mongoose.model("Lead", leadSchema);

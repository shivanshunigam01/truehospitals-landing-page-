const Lead = require("../models/lead.model");

// ✅ CREATE
exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();
    res.status(201).json({ success: true, lead });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ✅ READ ALL
exports.getAllLeads = async (req, res) => {
  try {
    const leads = await Lead.find().sort({ createdAt: -1 });
    res.json({ success: true, leads });
  } catch (err) {
    console.error("Get Leads Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ READ ONE
exports.getLeadById = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead)
      return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, lead });
  } catch (err) {
    console.error("Get Lead Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ UPDATE
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json({ success: true, lead });
  } catch (err) {
    console.error("Update Lead Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// ✅ DELETE
exports.deleteLead = async (req, res) => {
  try {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Lead deleted" });
  } catch (err) {
    console.error("Delete Lead Error:", err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const Lead = require("../models/lead.model");
const nodemailer = require("nodemailer");

// ✅ CREATE
// ✅ CREATE + EMAIL
exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();

    // Email configuration
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com", // you can use another SMTP server if needed
      port: 465,
      secure: true, // true for 465, false for 587
      auth: {
        user: process.env.EMAIL_USER, // e.g. truehospitals@gmail.com
        pass: process.env.EMAIL_PASS, // App password from Gmail or SMTP creds
      },
    });

    // Email content
    const mailOptions = {
      from: `"TRUE Hospitals" <${process.env.EMAIL_USER}>`,
      to: [
        "patientcare@truehospitals.com",
        "ankit@truehospitals.com",
        "sandeep@truehospitals.com",
      ],
      subject: `🆕 New Lead Submitted: ${lead.name || "New Enquiry"}`,
      html: `
        <h2>New Lead Alert 🚀</h2>
        <p>A new lead has been submitted from the website/admin panel.</p>
        <hr />
        <h3>Lead Details</h3>
        <ul>
          <li><b>Name:</b> ${lead.name || "N/A"}</li>
          <li><b>Phone:</b> ${lead.phone || "N/A"}</li>
          <li><b>Email:</b> ${lead.email || "N/A"}</li>
          <li><b>City:</b> ${lead.city || "N/A"}</li>
          <li><b>Message:</b> ${lead.message || "N/A"}</li>
          <li><b>Created At:</b> ${new Date().toLocaleString()}</li>
        </ul>
        <hr />
        <p style="color:#777;">This is an automated notification from TRUE Hospitals CRM.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({ success: true, lead });
  } catch (error) {
    console.error("❌ Lead Creation or Email Error:", error);
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

const Lead = require("../models/lead.model");
const nodemailer = require("nodemailer");

// ✅ CREATE
// ✅ CREATE + EMAIL
// ✅ CREATE + SEND EMAIL
exports.createLead = async (req, res) => {
  try {
    const lead = new Lead(req.body);
    await lead.save();

    // 1️⃣ Configure transporter (using Gmail App Password)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 2️⃣ Branded HTML template (for TRUE Hospitals)
    const mailHTML = `
      <div style="font-family: 'Poppins', Arial, sans-serif; background: #f5f8fa; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">

          <div style="background: linear-gradient(90deg, #0072bc, #00a3e0); padding: 25px 30px; text-align: center;">
            <img src="https://truehospitals.com/logo.png" alt="TRUE Hospitals" style="height: 50px; margin-bottom: 10px;" />
            <h2 style="color: white; margin: 0;">New Lead Notification</h2>
          </div>

          <div style="padding: 25px 30px;">
            <p style="font-size: 16px; color: #333;">Dear Team,</p>
            <p style="font-size: 15px; color: #555;">
              A new lead has been created in the TRUE Hospitals CRM.
            </p>

            <table width="100%" cellspacing="0" cellpadding="8" style="margin-top: 15px; border-collapse: collapse;">
              <tr style="background: #f0f7ff;">
                <td style="font-weight: 600; color: #0072bc;">Lead ID</td>
                <td>${lead.leadId}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #0072bc;">Name</td>
                <td>${lead.name || "N/A"}</td>
              </tr>
              <tr style="background: #f0f7ff;">
                <td style="font-weight: 600; color: #0072bc;">Phone</td>
                <td>${lead.phone || "N/A"}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #0072bc;">Category</td>
                <td>${lead.category || "N/A"}</td>
              </tr>
              <tr style="background: #f0f7ff;">
                <td style="font-weight: 600; color: #0072bc;">Surgery Type</td>
                <td>${lead.surgeryType || "N/A"}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #0072bc;">Concern</td>
                <td>${lead.concern || "N/A"}</td>
              </tr>
              <tr style="background: #f0f7ff;">
                <td style="font-weight: 600; color: #0072bc;">Date</td>
                <td>${lead.date || "N/A"}</td>
              </tr>
              <tr>
                <td style="font-weight: 600; color: #0072bc;">Status</td>
                <td>${lead.status || "N/A"}</td>
              </tr>
            </table>

            <div style="margin-top: 25px;">
              <a href="https://admin.truehospitals.com" target="_blank" 
                style="display:inline-block; background:#0072bc; color:#fff; padding:12px 20px; border-radius:6px; text-decoration:none; font-weight:600;">
                🔍 View Lead in Admin Panel
              </a>
            </div>

            <p style="margin-top: 25px; font-size: 13px; color: #777;">
              This is an automated notification from TRUE Hospitals CRM System.
            </p>
          </div>

          <div style="background: #0072bc; color: #fff; text-align: center; padding: 12px;">
            <p style="margin: 0; font-size: 13px;">© ${new Date().getFullYear()} TRUE Hospitals | Patna, Bihar</p>
          </div>
        </div>
      </div>
    `;

    // 3️⃣ Define mail recipients
    const mailOptions = {
      from: `"TRUE Hospitals CRM" <${process.env.EMAIL_USER}>`,
      to: [
        "patientcare@truehospitals.com",
        "ankit@truehospitals.com",
        "sandeep@truehospitals.com",
      ],
      subject: `🩺 New Lead #${lead.leadId} - ${lead.category || "General"}`,
      html: mailHTML,
    };

    // 4️⃣ Send email
    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      lead,
      message: "Lead created & email sent successfully",
    });
  } catch (error) {
    console.error("❌ Lead creation/email error:", error);
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

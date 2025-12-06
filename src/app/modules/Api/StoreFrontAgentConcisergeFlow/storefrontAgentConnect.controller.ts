import { Request, Response } from "express";

import { StorefrontAgentConnectService } from "./storefrontAgentConnect.service";
import { generateVerificationCode } from "../../../utils/generateCode";
import { sendEmail } from "../../../utils/Email";
import { StorefrontMoxoService } from "../Services/storefrontAgentFlow";

const codeStore = new Map<string, string>(); // Temporary code memory

// ✅ Step 1: Send verification code
export const sendVerificationCode = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    if (!email)
      return res
        .status(400)
        .json({ success: false, message: "Email is required" });

    const code = generateVerificationCode(6);
    codeStore.set(email, code);

    // ✅ Respond immediately to user
    res.json({
      success: true,
      message: "Verification code sent successfully",
    });

    // 📨 Send email asynchronously (after response)
    const html = `
      <div style="font-family:Arial,sans-serif;max-width:500px;margin:auto;">
        <h2 style="color:#4177BC;">AskLocal Email Verification</h2>
        <p>Please use the following 6-digit code to verify your email:</p>
        <h1 style="font-size:28px;font-weight:bold;text-align:center;">${code}</h1>
        <p style="font-size:14px;color:#555;">This code expires in 5 minutes.</p>
      </div>
    `;

    sendEmail(email, "Your AskLocal Verification Code", html)
      .then(() => console.log(`📧 Verification email sent to ${email}`))
      .catch((err) => console.error("❌ Failed to send email:", err.message));

    // Auto-expire after 5 mins
    setTimeout(() => codeStore.delete(email), 5 * 60 * 1000);
  } catch (error: any) {
    console.error("❌ sendVerificationCode error:", error.message || error);
    if (!res.headersSent)
      res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Step 2: Verify the 6-digit code
export const verifyCode = (req: Request, res: Response) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res
      .status(400)
      .json({ success: false, message: "Email and code required" });

  const stored = codeStore.get(email);
  if (!stored)
    return res
      .status(400)
      .json({ success: false, message: "Code expired or not found" });

  if (stored !== code)
    return res.status(400).json({ success: false, message: "Invalid code" });

  // Verified ✅
  codeStore.delete(email);
  return res.json({ success: true, message: "Code verified successfully" });
};

// ✅ Step 3: Save data & trigger Moxo workflow

export const saveAgentConnect = async (req: Request, res: Response) => {
  try {
    const { fullName, email, phone, agentId, agentEmail } = req.body;

    if (!fullName || !email || !phone || !agentEmail) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields (fullName, email, phone, agentEmail).",
      });
    }

    // ✅ Trigger your Moxo workflow
    // await callMoxoWorkflow({
    //   fullName,
    //   email,
    //   phone,
    //   agentEmail,
    //   agentId,
    // });
    await StorefrontMoxoService.startAgentConnectFlow({
      fullName,
      email,
      agentEmail,
      agentName: "AskLocal Partner", // optional
    });

    // ✅ Save in DB
    const newRecord = await StorefrontAgentConnectService.create({
      fullName,
      email,
      phone,
      agentId,
      agentEmail,
      verified: true,
    });

    return res.json({
      success: true,
      message: "Agent connection saved successfully",
      data: newRecord,
    });
  } catch (error: any) {
    console.error("❌ saveAgentConnect error:", error.message || error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ (Optional for Admin)
export const getAllAgentConnects = async (req: Request, res: Response) => {
  const data = await StorefrontAgentConnectService.getAll();
  res.json({ success: true, data });
};

export const getAgentConnectById = async (req: Request, res: Response) => {
  const data = await StorefrontAgentConnectService.getById(req.params.id);
  res.json({ success: true, data });
};

export const updateAgentConnect = async (req: Request, res: Response) => {
  const updated = await StorefrontAgentConnectService.update(
    req.params.id,
    req.body
  );
  res.json({ success: true, data: updated });
};

export const deleteAgentConnect = async (req: Request, res: Response) => {
  await StorefrontAgentConnectService.remove(req.params.id);
  res.json({ success: true, message: "Deleted successfully" });
};

import fetch from "node-fetch";

export class MoxoListingAgentFlowService {
  static async startListingAgentFlow({
    firstName,
    lastName,
    userEmail,
    agentEmail,
    license,
  }: {
    firstName: string;
    lastName: string;
    userEmail: string;
    agentEmail: string;
    license: string;
  }) {
    try {
      const MOXO_BASE_URL =
        "https://dev-asklocal.moxo.com/integration/application/webhook/workspace/create";

      const templateId = process.env.MOXO_TEMPLATE_LISTING_AGENT!;
      if (!templateId) {
        throw new Error("Missing env: MOXO_TEMPLATE_LISTING_AGENT");
      }

      const workspaceName = `Listing-${firstName}${lastName}-AskLocal`;
      const ownerEmail = process.env.MOXO_WORKSPACE_OWNER_EMAIL!;
      const welcomeMessage = `Welcome ${firstName}, your listing agent connection is now active!`;

      const payload = {
        workspace_name: workspaceName,
        workspace_owner: ownerEmail, // AskLocal workspace owner
        workspace_description: `Listing Agent Connect: MLS License ${license}`,
        welcome_message: welcomeMessage,

        // 🟦 Roles:
        // 1️⃣ Owner → AskLocal admin
        // 2️⃣ Agent → listing agent (real estate agent)
        // 3️⃣ Client → user submitting the form

        "role.Owner.email": ownerEmail,
        "role.Agent.email": agentEmail,
        "role.Client.email": userEmail,

        "role.Agent.user_name": `Agent - ${agentEmail}`,
        "role.Client.user_name": `${firstName} ${lastName}`,
      };

      const url = `${MOXO_BASE_URL}?template_id=${templateId}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("🚀 Listing Agent Flow Created:", data);

      return data;
    } catch (error: any) {
      console.error("❌ Listing Agent Flow Error:", error.message);
      throw error;
    }
  }
}

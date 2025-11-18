import fetch from "node-fetch";

export class MoxoAgentFlowService {
  static async startAgentFlow({
    firstName,
    lastName,
    email,
    mlsLicense,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    mlsLicense: string;
  }) {
    try {
      const MOXO_BASE_URL =
        "https://dev-asklocal.moxo.com/integration/application/webhook/workspace/create";

      const templateId = process.env.MOXO_TEMPLATE_AGENT!;
      if (!templateId) {
        throw new Error("Missing env: MOXO_TEMPLATE_AGENT_FLOW");
      }

      const payload = {
        workspace_name: `Agent-${firstName}${lastName}-AskLocal`,
        workspace_owner: process.env.MOXO_WORKSPACE_OWNER_EMAIL!, // ONLY OWNER
        workspace_description: `New Agent Onboarding - MLS License: ${mlsLicense}`,

        welcome_message: `Welcome ${firstName}, your onboarding workspace is ready!`,

        // ONLY TWO ROLES:
        // 1. Workspace Owner → manages everything
        // 2. Agent → the real estate agent joining AskLocal

        // Agent (user from form)
        "role.Agent.email": process.env.MOXO_AGENT_EMAIL!,
        "role.Client.email": email,
        "role.Agent.user_name": `${firstName} ${lastName}`,
      };

      const url = `${MOXO_BASE_URL}?template_id=${templateId}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("🚀 Agent Flow Created:", data);

      return data;
    } catch (error: any) {
      console.error("❌ Agent Flow Error:", error.message);
      throw error;
    }
  }
}

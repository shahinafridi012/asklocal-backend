import fetch from "node-fetch";

export class StorefrontMoxoService {
  static async startAgentConnectFlow({
    fullName,
    email,
    agentEmail,
    agentName,
  }: {
    fullName: string;
    email: string;
    agentEmail: string;
    agentName?: string;
  }) {
    try {
      const MOXO_BASE_URL =
        "https://dev-asklocal.moxo.com/integration/application/webhook/workspace/create";

      const TEMPLATE_ID = process.env.MOXO_TEMPLATE_AGENT_CONNECT!;
      const WORKSPACE_OWNER = process.env.MOXO_WORKSPACE_OWNER_EMAIL!;

      if (!TEMPLATE_ID || !WORKSPACE_OWNER) {
        throw new Error("Missing MOXO_TEMPLATE_AGENT_CONNECT or MOXO_WORKSPACE_OWNER_EMAIL");
      }

      const firstName = fullName.split(" ")[0] || fullName;
      const lastName = fullName.split(" ")[1] || "";

      const payload = {
        workspace_name: `${firstName}-${agentName || "Agent"}-AskLocal Connect`,
        workspace_owner: WORKSPACE_OWNER,
        workspace_description: `AskLocal Agent Connect between ${firstName} and ${agentName || "Agent"}.`,
        welcome_message: `Welcome ${firstName}, you’re now connected with ${agentName || "your agent"}!`,

        // 👇 Assign roles for each side
        "role.Agent.email": agentEmail,
        "role.Agent.user_name": agentName || "AskLocal Agent",

        "role.Client.email": email,
        "role.Client.user_name": fullName,

        "role.Owner.email": WORKSPACE_OWNER,
        "role.Owner.user_name": "AskLocal Concierge",
      };

      const url = `${MOXO_BASE_URL}?template_id=${TEMPLATE_ID}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(`✅ Moxo Storefront flow started for ${fullName}`, data);

      return data;
    } catch (error: any) {
      console.error("❌ StorefrontMoxoService.startAgentConnectFlow error:", error.message);
      throw error;
    }
  }
}

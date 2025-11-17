// src/services/moxo.service.ts
import fetch from "node-fetch";

export class MoxoService {
  static async startFlow({
    firstName,
    lastName,
    email,
    flowType,
  }: {
    firstName: string;
    lastName: string;
    email: string;
    flowType: "buyer" | "seller" | "refinance" | "agent";
  }) {
    try {
      const MOXO_BASE_URL =
        "https://dev-asklocal.moxo.com/integration/application/webhook/workspace/create";

      const TEMPLATE_IDS: Record<string, string> = {
        buyer: process.env.MOXO_TEMPLATE_BUYER!,
        seller: process.env.MOXO_TEMPLATE_SELLER!,
        refinance: process.env.MOXO_TEMPLATE_REFINANCE!,
        agent: process.env.MOXO_TEMPLATE_AGENT!,
      };

      const templateId = TEMPLATE_IDS[flowType];
      if (!templateId) throw new Error(`Invalid or missing template for ${flowType}`);

      const payload = {
        workspace_name: `AskLocal ${flowType} - ${firstName} ${lastName}`,
        workspace_owner: process.env.MOXO_WORKSPACE_OWNER_EMAIL!,
        workspace_description: `New ${flowType} inquiry from AskLocal.`,
        welcome_message: `Welcome ${firstName}, your concierge workspace is ready!`,

        // Moxo expects dotted keys like "role.Agent.email"
        "role.Agent.email": process.env.MOXO_AGENT_EMAIL!,
        "role.Agent.user_name": "AskLocal Concierge",
        "role.Client.email": email,
        "role.Client.user_name": `${firstName} ${lastName}`,
      };

      const url = `${MOXO_BASE_URL}?template_id=${templateId}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log(`Moxo flow started for ${flowType}`, data);

      return data;
    } catch (error: any) {
      console.error(" MoxoService.startFlow error:", error.message);
      throw error;
    }
  }
}

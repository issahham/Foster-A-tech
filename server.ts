import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // API: Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    res.json({ status: "ok", name: "Foster A Tech Backend" });
  });

  // API: AI Setup Advisor & Accessory Matchmaker
  app.post("/api/ai/advisor", async (req: Request, res: Response) => {
    try {
      const { userSetup, goal, budget, categoryPreference, existingAccessories } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          advice: `Based on your ${userSetup || "computer"} setup for ${goal || "productivity & gaming"}, we recommend prioritizing a high-refresh ergonomic monitor arm, a hot-swappable mechanical keyboard with lubricated switches, and a certified Thunderbolt 4 / USB-C docking hub to eliminate desk clutter and improve latency.`,
          recommendedCategories: ["Keyboards & Keycaps", "Storage & Hubs", "Monitors & Arms", "Audio & Mics"],
          tips: [
            "Ensure your desk has at least 50mm clamp clearance for gas-spring monitor arms.",
            "Use certified 240W braided cables to prevent voltage drop with high-draw docking hubs.",
            "Pair tactile switches with sound-dampening desk mats for a deeper acoustic profile."
          ],
          compatibilityScore: 98,
        });
      }

      const prompt = `You are the Lead Hardware & Accessory Architect at Foster A Tech, an elite marketplace for computer accessories.
A user is requesting personalized recommendations for computer accessories.
User Computer Setup: ${JSON.stringify(userSetup || "Modern PC / Mac Setup")}
Goal / Use Case: ${goal || "General Productivity, Gaming & Desk Ergonomics"}
Budget: ${budget || "Flexible"}
Category Preferences: ${categoryPreference || "Any accessories"}
Current Gear: ${existingAccessories || "Standard peripherals"}

Provide a comprehensive, highly technical yet accessible recommendation response in JSON format with the following fields:
{
  "advice": "A concise, engaging 2-3 sentence overview of what upgrades will yield the highest performance and ergonomic return",
  "recommendedCategories": ["Category 1", "Category 2", "Category 3"],
  "priorityUpgrades": [
    { "title": "Upgrade name", "reason": "Why this solves bottlenecks", "estimatedImpact": "High/Medium/Transformative" }
  ],
  "tips": ["Technical pro tip 1", "Technical pro tip 2", "Cable management or latency tip 3"],
  "compatibilityScore": 95
}
Return strictly valid JSON only.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      try {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch {
        return res.json({
          advice: text,
          recommendedCategories: ["Keyboards & Keycaps", "Storage & Hubs", "Monitors & Arms"],
          tips: ["Keep cables organized", "Check port bandwidth requirements"],
          compatibilityScore: 95,
        });
      }
    } catch (err: any) {
      console.error("AI Advisor error:", err);
      res.status(500).json({ error: "Failed to generate setup advice", details: err?.message });
    }
  });

  // API: AI Appraiser & Listing Generator for Sellers
  app.post("/api/ai/appraise", async (req: Request, res: Response) => {
    try {
      const { title, category, condition, brand, originalPrice, specsNotes } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        const orig = Number(originalPrice) || 120;
        const discountFactor = condition === "Brand New" ? 0.9 : condition === "Like New" ? 0.75 : condition === "Open Box" ? 0.8 : 0.6;
        const suggested = Math.round(orig * discountFactor);
        return res.json({
          suggestedPrice: suggested,
          priceRange: { min: Math.round(suggested * 0.9), max: Math.round(suggested * 1.15) },
          marketDemand: "High",
          generatedTitle: `${brand || "Foster"} ${title} - ${condition}`,
          generatedDescription: `Up for sale is a well-maintained ${title} in ${condition} condition. Rigorously tested for 100% functionality. Includes original accessories and connects seamlessly via modern interfaces. Ideal for enthusiast workstations and clean desk setups.`,
          keySellingPoints: [
            "Tested for zero functional defects",
            "Clean aesthetic and all ports/switches responsive",
            "Shipped securely with protective padding"
          ]
        });
      }

      const prompt = `You are the chief pricing appraisal expert and listing copywriter at Foster A Tech.
A seller wants to list a computer accessory on the market.
Item Name: ${title}
Category: ${category}
Brand: ${brand}
Condition: ${condition}
Original MSRP / Retail Price: $${originalPrice || "Unknown"}
Seller Notes / Specs: ${specsNotes || "Fully operational"}

Generate an accurate market valuation and an engaging, professional e-commerce product description in JSON format with these exact keys:
{
  "suggestedPrice": number (fair current second-hand or open-box market price in USD),
  "priceRange": { "min": number, "max": number },
  "marketDemand": "Very High" | "High" | "Moderate" | "Niche",
  "generatedTitle": "Clear, SEO-friendly marketplace title",
  "generatedDescription": "Comprehensive 3-paragraph product description highlighting condition, performance, specs, and why a buyer will love it",
  "keySellingPoints": ["Bullet 1", "Bullet 2", "Bullet 3", "Bullet 4"]
}
Return strictly valid JSON only.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const text = response.text || "{}";
      try {
        const parsed = JSON.parse(text);
        return res.json(parsed);
      } catch {
        return res.json({
          suggestedPrice: Number(originalPrice) ? Math.round(Number(originalPrice) * 0.75) : 75,
          priceRange: { min: 50, max: 90 },
          marketDemand: "High",
          generatedTitle: `${title} (${condition})`,
          generatedDescription: text,
          keySellingPoints: ["Verified functionality", "Inspected condition", "Fast dispatch"]
        });
      }
    } catch (err: any) {
      console.error("AI Appraise error:", err);
      res.status(500).json({ error: "Failed to appraise item", details: err?.message });
    }
  });

  // API: Live Compatibility Check
  app.post("/api/ai/compatibility-check", async (req: Request, res: Response) => {
    try {
      const { productTitle, productSpecs, userDevice, userPorts, userOS } = req.body;
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          compatible: true,
          verdict: "Fully Compatible",
          notes: `The ${productTitle} functions seamlessly with ${userOS || "your operating system"} across standard ${userPorts || "USB/Display"} interfaces with plug-and-play driver support.`,
          requiredAdapters: [],
          performanceRating: "Optimal (100% bandwidth)",
        });
      }

      const prompt = `Analyze compatibility between this computer accessory and user device:
Product: ${productTitle}
Product Specifications: ${JSON.stringify(productSpecs)}
User Device: ${userDevice || "Desktop PC"}
User Available Ports: ${userPorts || "USB-C, USB-A 3.0, DisplayPort 1.4"}
User Operating System: ${userOS || "Windows 11 / macOS"}

Return JSON format:
{
  "compatible": boolean,
  "verdict": "Fully Compatible" | "Compatible with Adapter" | "Partial Compatibility" | "Incompatible",
  "notes": "Clear 2-sentence explanation of driver, power delivery, bandwidth, or physical compatibility",
  "requiredAdapters": ["Adapter name if needed or empty array"],
  "performanceRating": "Optimal (100% bandwidth)" | "Standard" | "Limited Bandwidth"
}`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return res.json(parsed);
    } catch (err: any) {
      res.status(500).json({ error: "Compatibility check failed", details: err?.message });
    }
  });

  // Vite middleware for development or Static server for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Foster A Tech server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

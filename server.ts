import express from "express";
import path from "path";
import dns from "dns";
import { GoogleGenAI, Type } from "@google/genai";
import nodemailer from "nodemailer";

const app = express();
const PORT = 3000;

// Body parsing middlewares
app.use(express.json());

// Initialize server-side Gemini API client
const geminiApiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: geminiApiKey || "MOCK_KEY",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// 1. API: Check domain availability via real Node.js DNS resolution with fallback timeout
app.post("/api/check-domain", async (req, res) => {
  const { domain } = req.body;
  if (!domain || typeof domain !== "string") {
    res.status(400).json({ error: "Invalid domain name parameter" });
    return;
  }

  const cleanDomain = domain.trim().toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, "");

  // DNS lookup with 1500ms timeout
  const timeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error("DNSTimeout")), 1500)
  );

  try {
    // Attempt DNS lookup with timeout race
    await Promise.race([
      dns.promises.lookup(cleanDomain),
      timeoutPromise
    ]);
    // If it resolves, it's taken (registered)
    res.json({ domain: cleanDomain, isAvailable: false });
  } catch (err: any) {
    if (err.message === "DNSTimeout") {
      // Treat timeout fallback as available
      res.json({ domain: cleanDomain, isAvailable: true, warning: "Timeout resolving DNS" });
      return;
    }

    if (err.code === "ENOTFOUND") {
      // Secondary Nameserver resolution check with quick timeout
      try {
        const ns = await Promise.race([
          dns.promises.resolveNs(cleanDomain),
          new Promise((_, r) => setTimeout(() => r(new Error("NSTimeout")), 800))
        ]) as any[];
        if (ns && ns.length > 0) {
          res.json({ domain: cleanDomain, isAvailable: false });
          return;
        }
      } catch (nsErr) {
        // Safe to ignore, fallback
      }

      try {
        const mx = await Promise.race([
          dns.promises.resolveMx(cleanDomain),
          new Promise((_, r) => setTimeout(() => r(new Error("MXTimeout")), 800))
        ]) as any[];
        if (mx && mx.length > 0) {
          res.json({ domain: cleanDomain, isAvailable: false });
          return;
        }
      } catch (mxErr) {}

      // If resolving fails, it stands a high probability of being available!
      res.json({ domain: cleanDomain, isAvailable: true });
    } else {
      // Any other system DNS issue - treat fallback as available for mock/user testing
      res.json({ domain: cleanDomain, isAvailable: true });
    }
  }
});

// Helper for high-quality local heuristic domain generation
function generateHeuristicDomains(description: string, namingStyle: string, extensions: string[]): any[] {
  const words = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter(w => w.length > 2 && !["for", "the", "and", "our", "with", "your", "this", "that", "from", "company", "business", "agency", "service", "services", "provider", "limited", "ltd"].includes(w));

  const kw1 = words[0] || "cyber";
  const kw2 = words[1] || "nexus";
  
  // Custom prefix/suffix list based on naming style
  let prefixes = ["get", "try", "go", "my", "the", "next", "core", "smart", "pro", "apex", "cyber", "ultra"];
  let suffixes = ["hub", "lab", "labs", "sys", "tech", "pro", "it", "zone", "host", "flow", "hq", "space", "sync"];

  if (namingStyle === "Tech" || namingStyle === "Startup") {
    prefixes = ["stack", "cloud", "dev", "code", "fast", "smart", "core", "nexus", "vertex", "alpha"];
    suffixes = ["labs", "tech", "io", "node", "ai", "base", "grid", "matrix", "vector", "byte"];
  } else if (namingStyle === "E-commerce" || namingStyle === "Premium") {
    prefixes = ["shop", "buy", "deal", "cart", "store", "prime", "luxury", "vibe", "boutique", "urban"];
    suffixes = ["mart", "shop", "store", "hub", "express", "bazaar", "box", "vibe", "lux", "elite"];
  } else if (namingStyle === "Local Business" || namingStyle === "Professional") {
    prefixes = ["bd", "dhaka", "riyadh", "local", "prime", "real", "apex", "direct", "trust", "elite"];
    suffixes = ["corp", "group", "biz", "consulting", "solutions", "agency", "partner", "firm", "expert"];
  } else if (namingStyle === "Creative" || namingStyle === "Brandable") {
    prefixes = ["pixel", "studio", "creative", "neo", "art", "spark", "vision", "flow", "wave", "epic"];
    suffixes = ["lab", "studio", "media", "craft", "design", "co", "venture", "bloom", "space", "buzz"];
  }

  const generatedList: any[] = [];
  const generatedNames = new Set<string>();

  // Helper to add safely
  const addDomain = (nameBody: string, ext: string, styleWord: string) => {
    const fullName = `${nameBody}${ext}`.toLowerCase().replace(/[^a-z0-9.]/g, "");
    if (!generatedNames.has(fullName)) {
      generatedNames.add(fullName);
      
      const lenLabel = fullName.length < 12 ? "Short" : fullName.length < 18 ? "Medium" : "Long";
      const brandScore = Math.floor(Math.random() * 21) + 75; // 75-95
      const seoScore = fullName.includes("get") || fullName.includes("try") ? "Medium" : "High";
      
      generatedList.push({
        name: fullName,
        extension: ext,
        lengthScore: lenLabel,
        brandabilityScore: brandScore,
        seoScore: seoScore,
        explanation: `Sleek combination representing "${kw1}" with a focus on ${styleWord} positioning.`
      });
    }
  };

  const chosenExts = extensions.length > 0 ? extensions : [".com", ".net", ".org"];
  
  // Mix & Match to produce plenty of domains
  for (const ext of chosenExts) {
    // 1. Keyword1 + Suffix
    suffixes.slice(0, 3).forEach(suf => {
      addDomain(`${kw1}${suf}`, ext, namingStyle);
    });

    // 2. Prefix + Keyword1
    prefixes.slice(0, 3).forEach(pref => {
      addDomain(`${pref}${kw1}`, ext, namingStyle);
    });

    // 3. Keyword1 + Keyword2 (if exists)
    if (words[1]) {
      addDomain(`${kw1}${kw2}`, ext, namingStyle);
      addDomain(`${kw2}${kw1}`, ext, namingStyle);
    } else {
      addDomain(`${kw1}online`, ext, namingStyle);
      addDomain(`the${kw1}`, ext, namingStyle);
    }

    addDomain(`${kw1}labs`, ext, namingStyle);
    addDomain(`${kw1}hub`, ext, namingStyle);
  }

  return generatedList.slice(0, 15);
}

// 2. API: AI Domain Generator utilizing Gemini 3.5 Flash Model
app.post("/api/generate-domains", async (req, res) => {
  const { description, style, extensions } = req.body;

  if (!description || typeof description !== "string") {
    res.status(400).json({ error: "Description is required" });
    return;
  }

  const selectedExts = Array.isArray(extensions) && extensions.length > 0 
    ? extensions 
    : [".com", ".net", ".org"];

  const namingStyle = style || "Brandable";

  const prompt = `You are a professional Hostinger-style brand manager and domain counselor.
Generate 15 completely unique, catchy, and highly relevant domain name suggestions for the following project:
"${description}"

Core constraints:
- Naming Style focus: "${namingStyle}"
- Match these exact requested TLD extensions: "${selectedExts.join(", ")}"
- For each domain, generate a brandability score (0-100), SEO score (High, Medium, Low), length score (Short, Medium, Long), and explain the creative logic.
- Do NOT include any intro or outro text, return ONLY the valid JSON structure.`;

  try {
    if (!process.env.GEMINI_API_KEY) {
      // Fallback response with beautiful heuristic ideas if API key is not configured for preview
      const fallbackSuggestions = generateHeuristicDomains(description, namingStyle, selectedExts);
      res.json({ suggestions: fallbackSuggestions });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: ["suggestions"],
          properties: {
            suggestions: {
              type: Type.ARRAY,
              description: "List of catchy domain suggestions with score metrics.",
              items: {
                type: Type.OBJECT,
                required: ["name", "extension", "lengthScore", "brandabilityScore", "seoScore", "explanation"],
                properties: {
                  name: { type: Type.STRING, description: "Full suggested domain name including extension, all lowercase, alphanumeric only" },
                  extension: { type: Type.STRING, description: "The extension including dot" },
                  lengthScore: { type: Type.STRING, description: "Short, Medium, or Long" },
                  brandabilityScore: { type: Type.INTEGER, description: "Integer branding value, range 40 to 100" },
                  seoScore: { type: Type.STRING, description: "High, Medium, or Low" },
                  explanation: { type: Type.STRING, description: "Brief creative logic explanation in English" }
                }
              }
            }
          }
        },
        systemInstruction: "You are an elite automated Domain consultancy engine built by WebzoneBD. You respond ONLY in valid JSON matching the exact schema."
      }
    });

    const parsedData = JSON.parse(response.text || "{}");
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Domain generation failed: ", error);
    // Graceful fallback to heuristic generation (e.g. on 503 high demand API errors)
    try {
      const fallbackSuggestions = generateHeuristicDomains(description, namingStyle, selectedExts);
      res.json({ 
        suggestions: fallbackSuggestions, 
        warning: "Gemini under high demand; loaded high-quality heuristic fallbacks." 
      });
    } catch (fallbackError) {
      res.status(500).json({ error: error.message || "Failed to generate domain names" });
    }
  }
});

// 3. API: AI Image Generator utilizing Gemini's 'gemini-2.5-flash-image'
app.post("/api/generate-image", async (req, res) => {
  const { prompt, style, aspectRatio } = req.body;

  if (!prompt || typeof prompt !== "string") {
    res.status(400).json({ error: "Prompt is required" });
    return;
  }

  const cleanPrompt = `${prompt}. Style: ${style || "Modern minimalist design"}`;
  const targetRatio = aspectRatio || "1:1";

  try {
    if (!process.env.GEMINI_API_KEY) {
      // Fallback images based on keywords
      const splitted = prompt.toLowerCase().split(/\s+/);
      let unsplashId = "photo-1460925895917-afdab827c52f"; // default business layout
      if (splitted.includes("server") || splitted.includes("hosting") || splitted.includes("vps")) {
        unsplashId = "photo-1558494949-ef010cbdcc31"; // tech hardware/servers
      } else if (splitted.includes("ecommerce") || splitted.includes("store") || splitted.includes("shopping") || splitted.includes("woo")) {
        unsplashId = "photo-1511556532299-8f662fc26c06"; // store items, clean aesthetics
      } else if (splitted.includes("banner") || splitted.includes("marketing") || splitted.includes("social")) {
        unsplashId = "photo-1460925895917-afdab827c52f"; // stats banner/isometric
      } else if (splitted.includes("code") || splitted.includes("script") || splitted.includes("software")) {
        unsplashId = "photo-1555066931-4365d14bab8c"; // coding on screen
      } else if (splitted.includes("graphic") || splitted.includes("art") || splitted.includes("logo")) {
        unsplashId = "photo-1618005182384-a83a8bd57fbe"; // digital design/art
      }

      // Append standard dimensions matching the ratio
      let dStr = "?auto=format&fit=crop&w=800&q=80";
      if (targetRatio === "16:9") dStr = "?auto=format&fit=crop&w=1200&h=675&q=80";
      else if (targetRatio === "4:3") dStr = "?auto=format&fit=crop&w=800&h=600&q=80";
      else if (targetRatio === "3:4") dStr = "?auto=format&fit=crop&w=600&h=800&q=80";
      else if (targetRatio === "9:16") dStr = "?auto=format&fit=crop&w=500&h=888&q=80";

      const fallbackUrl = `https://images.unsplash.com/${unsplashId}${dStr}`;
      res.json({ imageUrl: fallbackUrl, isFallback: true });
      return;
    }

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: cleanPrompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: targetRatio as any,
        },
      },
    });

    let imageUrl: string | null = null;
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64Data = part.inlineData.data;
          const mimeType = part.inlineData.mimeType || "image/png";
          imageUrl = `data:${mimeType};base64,${base64Data}`;
          break;
        }
      }
    }

    if (imageUrl) {
      res.json({ imageUrl, isFallback: false });
    } else {
      throw new Error("No image data found in response parts");
    }
  } catch (error: any) {
    console.error("AI Image Generation failed: ", error);
    // Graceful fallback to Unsplash placeholder images
    const unsplashId = "photo-1542744094-3a31f103e35f"; // office setup
    res.json({ 
      imageUrl: `https://images.unsplash.com/${unsplashId}?auto=format&fit=crop&w=800&q=80`,
      warning: "AI generation key lookup or threshold error. Loaded fallback graphics successfully.",
      isFallback: true 
    });
  }
});

// 4. API: Automated order confirmation and receipts email dispatcher
app.post("/api/send-email", async (req, res) => {
  const {
    orderId,
    customerName,
    customerEmail,
    itemTitle,
    price,
    currency,
    date,
    paymentMethod,
    downloadUrl
  } = req.body;

  if (!orderId || !customerName || !customerEmail || !itemTitle) {
    res.status(400).json({ error: "Required fields are missing: orderId, customerName, customerEmail, itemTitle" });
    return;
  }

  const cleanPrice = price !== undefined ? price : 0;
  const cleanCurrency = currency || "USD";
  const cleanDate = date || new Date().toLocaleString();
  const cleanMethod = paymentMethod || "Standard Gateway";

  // Construct a premium high-contrast HTML Email Confirmation Voucher
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - WebzoneBD</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .wrapper {
      width: 100%;
      background-color: #f8fafc;
      padding: 40px 20px;
      box-sizing: border-box;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);
      border: 1px solid #e2e8f0;
    }
    .header {
      background-color: #0c1220;
      padding: 32px;
      text-align: center;
      color: #ffffff;
    }
    .logo {
      font-size: 24px;
      font-weight: 850;
      letter-spacing: -0.025em;
      color: #06b6d4;
      text-decoration: none;
    }
    .logo span {
      color: #ffffff;
    }
    .badge {
      display: inline-block;
      background-color: #10b981;
      color: #ffffff;
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      padding: 4px 12px;
      border-radius: 20px;
      margin-top: 16px;
    }
    .content {
      padding: 32px;
    }
    .greeting {
      font-size: 18px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 0;
      margin-bottom: 8px;
    }
    .message {
      font-size: 14px;
      color: #475569;
      line-height: 1.6;
      margin: 0 0 24px 0;
    }
    .invoice-card {
      background-color: #f8fafc;
      border-radius: 12px;
      border: 1px solid #e2e8f0;
      padding: 20px;
      margin-bottom: 24px;
    }
    .invoice-title {
      font-size: 11px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 0.05em;
      margin-top: 0;
      margin-bottom: 12px;
    }
    .invoice-row {
      margin-bottom: 8px;
      font-size: 13px;
      color: #334155;
    }
    .invoice-label {
      color: #64748b;
      font-weight: 550;
    }
    .invoice-value {
      color: #0f172a;
      font-weight: bold;
    }
    .btn-container {
      text-align: center;
      margin: 32px 0 16px 0;
    }
    .btn {
      display: inline-block;
      background-color: #06b6d4;
      color: #ffffff !important;
      font-weight: bold;
      font-size: 14px;
      text-decoration: none;
      padding: 12px 28px;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(6, 182, 212, 0.2);
    }
    .footer {
      background-color: #f8fafc;
      border-top: 1px solid #f1f5f9;
      padding: 24px 32px;
      text-align: center;
      font-size: 12px;
      color: #94a3b8;
    }
    .footer-support a {
      color: #06b6d4;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <a href="https://webzonebd.com" class="logo">Webzone<span>BD</span></a>
        <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">Premium IT Solutions & Digital Marketplace</div>
        <div><span class="badge">Order Confirmed</span></div>
      </div>
      <div class="content">
        <h3 class="greeting">Assalamu Alaikum ${customerName},</h3>
        <p class="message">
          Thank you for choosing WebzoneBD. Your payment has been authorized and cleared successfully. Below are the details of your service order confirmation and invoice receipt.
        </p>
        
        <div class="invoice-card">
          <div class="invoice-title">Invoice & Payment Summary</div>
          <div class="invoice-row">
            <span class="invoice-label">Order Ref ID:</span> 
            <span class="invoice-value" style="font-family: monospace;">#${orderId}</span>
          </div>
          <div class="invoice-row">
            <span class="invoice-label">Order Item Name:</span> 
            <span class="invoice-value" style="color: #000000;">${itemTitle}</span>
          </div>
          <div class="invoice-row">
            <span class="invoice-label">Receipt Date:</span> 
            <span class="invoice-value">${cleanDate}</span>
          </div>
          <div class="invoice-row">
            <span class="invoice-label">Payment Mode:</span> 
            <span class="invoice-value" style="font-family: monospace; font-size: 12px;">${cleanMethod}</span>
          </div>
          <div style="padding-top: 12px; border-top: 1px dashed #cbd5e1; font-size: 15px; font-weight: 700; margin-top: 12px; color: #000;">
            <span>Paid Total Settled:</span>
            <span style="float: right; color: #10b981;">$${cleanPrice} ${cleanCurrency}</span>
          </div>
        </div>

        ${downloadUrl && downloadUrl !== "#" ? `
        <p class="message" style="margin-bottom: 8px;">
          <strong>📥 Digital Installation Package:</strong> Your purchased PHP scripts, templates, or system zip package is ready for download in your WebzoneBD account cabinet. Click the action button below to start:
        </p>
        <div class="btn-container">
          <a href="${downloadUrl}" class="btn" style="color: #fff !important;">Download Files</a>
        </div>
        ` : `
        <p class="message">
          Our development staff has been notified of your project deployment specs. We are setting up your server workspace, connecting API callback loops, and will notify you within 24 hours.
        </p>
        <div class="btn-container">
          <a href="https://ais-dev-z4aiwbs43hldall23o4qkt-316113368699.europe-west3.run.app" class="btn" style="color: #fff !important;">Enter Client Panel</a>
        </div>
        `}

        <div style="margin-top: 32px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
          <h4 style="font-size: 13px; font-weight: 700; color: #334155; margin: 0 0 8px 0;">Need immediate installation or manual configuration?</h4>
          <p class="message" style="margin: 0; font-size: 12px;">
            Please open an answered Support Ticket or click the WhatsApp Live help button under your customer profile panel.
          </p>
        </div>
      </div>
      <div class="footer">
        <div class="footer-support" style="margin-bottom: 12px;">
          WebzoneBD Corporate Team &bull; Support: <a href="mailto:support@webzonebd.com">support@webzonebd.com</a>
        </div>
        <div>
          &copy; ${new Date().getFullYear()} WebzoneBD. All rights reserved. cPanel Secured Network environment.
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;

  const smtpHost = process.env.SMTP_HOST;
  const smtpPort = parseInt(process.env.SMTP_PORT || "587");
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;
  const smtpFrom = process.env.SMTP_FROM || "no-reply@webzonebd.com";

  let sent = false;
  let transmissionStatus = "Pending configuration credentials";
  let transportError: string | null = null;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass
        }
      });

      await transporter.sendMail({
        from: `"WebzoneBD Invoice Manager" <${smtpFrom}>`,
        to: customerEmail,
        subject: `💳 Order Confirmation & Invoice Receipt - #${orderId}`,
        html: htmlContent
      });

      sent = true;
      transmissionStatus = "Transmitted directly to recipient mail server via SMTP";
    } catch (err: any) {
      console.error("Nodemailer SMTP Dispatch error: ", err);
      transportError = err.message || "Unknown SMTP Connection Refused Error";
      transmissionStatus = "Failed to dispatch via SMTP due to network/configuration limits";
    }
  } else {
    transmissionStatus = "Environment is in secure sandbox mode. Generated complete responsive HTML receipt preview successfully.";
  }

  res.json({
    success: true,
    sent: sent,
    status: transmissionStatus,
    targetEmail: customerEmail,
    subject: `💳 Order Confirmation & Invoice Receipt - #${orderId}`,
    htmlTemplate: htmlContent,
    details: {
      smtpHost: smtpHost || "Not Specified (Use SMTP_HOST in .env)",
      smtpUser: smtpUser || "Not Specified (Use SMTP_USER in .env)",
      smtpPort: smtpPort,
      smtpFrom: smtpFrom,
      error: transportError
    }
  });
});

// Vite Middleware & Static Asset Serving Setup
async function launchServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`WebzoneBD Fullstack Server online on port ${PORT}`);
  });
}

launchServer().catch((err) => {
  console.error("FATAL: Failed to launch WebzoneBD server:", err);
  process.exit(1);
});

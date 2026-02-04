import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import fetch from "node-fetch";
import cors from "cors";
import { spawn } from "child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);




const payload = {
  "name": "Student",
  "valid housing contract": "Yes",
  "missing payment plan": "No",
  "reduced aid": "No",
  "SAP warning": "No",
  "on-campus job": "Yes",
  "work restriction": "Yes",
  "late fees": "No",
  "meal plan cancellation": "Yes",
  "course withdrawal after deadline": "Yes",
  "missed financial advising appointments": "Yes",
  "dropped gpa": "Yes",
  "first-gen student": "Yes",
  "transfer student": "No",
  "prior emergency aid usage": "Yes",
  "student returning from break": "No"
}



dotenv.config({
  path: path.resolve(__dirname, "../.env.local"), // 👈 ROOT .env.local
});



import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { serveStatic } from "./static";
import { createServer } from "http";



//dotenv.config({ path: ".env.local" });

// server/index.ts
import chatgptRoute from "./chatgpt";

console.log("hi from server index.ts");
console.log("OPENAI KEY LOADED:", !!process.env.OPENAI_API_KEY);



const app = express();


app.use(cors());

app.use(express.json());

app.post("/predict", (req: Request, res: Response) => {
  console.log("Received /predict request with body:", req.body);
  const payload = req.body;
  const scriptPath = path.join(__dirname, "ml", "predict.py");

  // Spawn a new Python process per request
  const py = spawn("python", [scriptPath]);

  let dataString = "";

  py.stdout.on("data", (data) => {
    dataString += data.toString();
  });

  py.stderr.on("data", (data) => {
    console.error("Python stderr:", data.toString());
  });

  py.on("error", (err) => {
    console.error("Failed to start Python process:", err);
    res.status(500).json({ error: "Failed to start Python process" });
  });

  py.on("close", (code) => {
    if (!dataString) {
      return res.status(500).json({ error: "Python process exited with code " + code });
    }

    try {
      const result = JSON.parse(dataString);
      res.json(result); // send prediction to client
    } catch (e: unknown) {
      let message = "Unknown error";
      if (e instanceof Error) {
        message = e.message;
      }
      res.status(500).json({ error: "Failed to parse Python output", details: message });
    }
  });

  // Send JSON payload to Python stdin
  py.stdin.write(JSON.stringify(payload));
  py.stdin.end();
});


app.listen(3001, () => {
  console.log("Server is running on port 3001");
});

app.use("/api", chatgptRoute);

const httpServer = createServer(app);

declare module "http" {
  interface IncomingMessage {
    rawBody: unknown;
  }
}

async function testMLPrediction() {
  const payload = {
    "name": "Student",
    "valid housing contract": "Yes",
    "missing payment plan": "No",
    "reduced aid": "No",
    "SAP warning": "No",
    "on-campus job": "Yes",
    "work restriction": "Yes",
    "late fees": "No",
    "meal plan cancellation": "Yes",
    "course withdrawal after deadline": "Yes",
    "missed financial advising appointments": "Yes",
    "dropped gpa": "Yes",
    "first-gen student": "Yes",
    "transfer student": "No",
    "prior emergency aid usage": "Yes",
    "student returning from break": "No"
  };

  const res = await fetch("http://localhost:3001/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  console.log("Simulated ML Prediction:", data);
}

//console.log(askChatGPT("Hello chadgpt"))

app.use(
  express.json({
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  }),
);

app.use(express.urlencoded({ extended: false }));

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  await registerRoutes(httpServer, app);

  app.use((err: any, _req: Request, res: Response, next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error("Internal Server Error:", err);

    if (res.headersSent) {
      return next(err);
    }

    return res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (process.env.NODE_ENV === "production") {
    serveStatic(app);
  } else {
    const { setupVite } = await import("./vite");
    await setupVite(httpServer, app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || "5000", 10);
  // On some platforms (notably Windows) `reusePort` is not supported and
  // causes an ENOTSUP error. Only set reusePort when not running on win32.
  const listenOptions: any = {
    port,
    host: "0.0.0.0",
  };

  if (process.platform !== "win32") {
    listenOptions.reusePort = true;
  }

  httpServer.listen(listenOptions, () => {
    log(`serving on port ${port}`);

    
    testMLPrediction();

  });
})();

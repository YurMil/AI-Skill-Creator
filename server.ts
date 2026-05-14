import express from "express";
import path from "path";
import cors from "cors";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // In-memory mock database of base agent skills
  const skillsDb = [
    {
      id: "search-web",
      name: "Web Search",
      description: "Allows the agent to search the web for real-time information.",
      category: "Data",
      content: "---\nname: Web Search\ndescription: Searches the web for information.\n---\n# Instructions\nYou can use the `search_web` tool to search for real-time data.\n1. Pass a descriptive query.\n2. Read the results and summarize them for the user."
    },
    {
      id: "file-editor",
      name: "File Editor",
      description: "Enables creating and modifying files in the workspace.",
      category: "System",
      content: "---\nname: File Editor\ndescription: Create, read, and write files.\n---\n# Instructions\nUse `edit_file` to modify exact text.\nUse `create_file` to create a new file.\nAlways use `view_file` to verify contents before editing."
    },
    {
      id: "data-analysis",
      name: "Data Analysis",
      description: "Perform analysis using Python or Node scripts.",
      category: "Compute",
      content: "---\nname: Data Analysis\ndescription: Run scripts to analyze data.\n---\n# Instructions\nYou can execute python or node.js scripts to analyze CSV/JSON files in the workspace.\nOutput the script, run it, and summarize the output."
    },
    {
      id: "firebase-setup",
      name: "Firebase Integrator",
      description: "Easily set up a Firestore database and secure it.",
      category: "Integration",
      content: "---\nname: Firebase Integrator\ndescription: Set up Firebase db and rules.\n---\n# Instructions\nFollow strict constraints when setting up Firebase.\nALWAYS define firestore schemas locally first. Create strict rules."
    }
  ];

  // API Routes
  app.get("/api/skills", (req, res) => {
    res.json({ skills: skillsDb });
  });

  app.get("/api/skills/:id", (req, res) => {
    const skill = skillsDb.find(s => s.id === req.params.id);
    if (skill) {
      res.json(skill);
    } else {
      res.status(404).json({ error: "Skill not found" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production serving
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

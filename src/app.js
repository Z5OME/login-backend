import "dotenv/config";
import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import authRoutes from "./routes/auth.js";
import { initDB } from "./config/db.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = process.env.PORT || 8080;

app.set("view engine", "ejs");
app.set("views", join(__dirname, "views"));
app.use(express.json());

app.get("/", (req, res) => res.render("index", { title: "Login" }));

app.use(express.static(join(__dirname, "public")));
app.use("/api/auth", authRoutes);

initDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log("\x1b[32m" + `
        ██╗      ██████╗  ██████╗ ██╗███╗   ██╗
        ██║     ██╔═══██╗██╔════╝ ██║████╗  ██║
        ██║     ██║   ██║██║  ███╗██║██╔██╗ ██║
        ██║     ██║   ██║██║   ██║██║██║╚██╗██║
        ███████╗╚██████╔╝╚██████╔╝██║██║ ╚████║
        ╚══════╝ ╚═════╝  ╚═════╝ ╚═╝╚═╝  ╚═══╝
        ` + "\x1b[0m");
            console.log("Server is running on http://localhost:" + PORT + " 🟢");
        });
    })
    .catch((err) => {
        console.log("\x1b[31mERROR connecting to database: \x1b[0m" + err.message);
        process.exit(1);
    });

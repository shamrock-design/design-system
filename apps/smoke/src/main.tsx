import { createRoot } from "react-dom/client";
import "@shamrock-design/tokens/css/core.css";
import "@shamrock-design/tokens/css/theme-clover.css";
import "@shamrock-design/tokens/css/theme-violet.css";
import "@shamrock-design/ui/styles.css";
import "@shamrock-design/charts/styles.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);

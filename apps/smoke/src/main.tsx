import { createRoot } from "react-dom/client";
import "@shamrock/tokens/css/core.css";
import "@shamrock/tokens/css/theme-clover.css";
import "@shamrock/tokens/css/theme-violet.css";
import "@shamrock/ui/styles.css";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);

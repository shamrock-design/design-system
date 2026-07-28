import { createRoot } from "react-dom/client";

// Design-system styles — order matters:
//   colorless core → your brand theme → component styles → chart styles.
import "@shamrock-design/tokens/css/core.css";
import "@shamrock-design/tokens/css/theme-{{THEME}}.css";
import "@shamrock-design/ui/styles.css";
import "@shamrock-design/charts/styles.css";

import { App } from "./App";

createRoot(document.getElementById("root")!).render(<App />);

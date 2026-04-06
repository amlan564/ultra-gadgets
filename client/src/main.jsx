import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { Toaster } from "react-hot-toast";
import { TooltipProvider } from "./components/ui/tooltip";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <TooltipProvider>
        <App />
        <Toaster />
      </TooltipProvider>
    </Provider>
  </BrowserRouter>,
);

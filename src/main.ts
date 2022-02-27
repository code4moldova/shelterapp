import "tailwindcss/tailwind.css";
import { createApp } from "vue";
import App from "./App.vue";
import { mapContext } from "./plugins/map-context";

createApp(App).use(mapContext).mount("#app");

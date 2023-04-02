import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPahoMqttPlugin } from "./pahoMqttPlugin";

createApp(App)
  .use(
    createPahoMqttPlugin({
      PluginOptions: {
        autoConnect: true,
        showNotifications: true,
      },
      MqttOptions: {
        host: "localhost",
        port: 9001,
        clientId: `SAWAGUI-${Math.random() * 9999}`,
        mainTopic: "ADT2",
      },
    })
  )
  .mount("#app");

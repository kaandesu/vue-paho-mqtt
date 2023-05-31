import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPahoMqttPlugin } from './pahoMqttPlugin';

createApp(App)
  .use(
    createPahoMqttPlugin({
      PluginOptions: {
        autoConnect: false,
        showNotifications: true,
      },
      MqttOptions: {
        host: 'localhost',
        port: 9001,
        clientId: `ClientID-${Math.round(Math.random() * 9999)}`,
        mainTopic: 'vue-paho-mqtt-test',
        username: '',
        password: '',
      },
    }),
  )
  .mount('#app');

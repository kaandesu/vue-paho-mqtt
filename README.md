# Vue-Paho-Mqtt Plugin

The `vue-paho-mqtt` plugin provides a convenient way to use the [Eclipse Paho MQTT JavaScript client](https://www.eclipse.org/paho/clients/js/) with Vue 3.

This plugin allows you to connect to a MQTT broker and subscribe to topics in your Vue app. It uses `paho-mqtt` to connect to the broker and provides several useful features such as auto-reconnect, message handlers, and error notifications.

[Live demo](https://kaandesu.github.io/vue-paho-mqtt)

## Installation

Install the package using npm:

```bash

npm install  vue-paho-mqtt

```

## Usage

To use the plugin, you need to create an instance of it and pass it to the `use` function:

```typescript
import { createApp } from "vue";
import "./style.css";
import App from "./App.vue";
import { createPahoMqttPlugin } from "vue-paho-mqtt";
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
        clientId: `MyID-${Math.random() * 9999}`,
        mainTopic: "MAIN",
      },
    })
  )
  .mount("#app");
```

## Plugin Options

You can configure the plugin by passing an object with the following options to `createPahoMqttPlugin`:

- `showNotifications` (`boolean`, default: `true`) - Whether to show error and success notifications.

- `autoConnect` (`boolean`, default: `true`) - Whether to automatically connect to the broker when the plugin is initialized.

## MQTT Options

You can configure the MQTT client by passing an object with the following options to `createPahoMqttPlugin`:

- `host` (`string`, default: `"localhost"`) - The hostname or IP address of the MQTT broker.

- `port` (`number`, default: `9001`) - The port number of the MQTT broker.

- `clientId` (`string`, default: `"ClientID-${Math.random() * 9999}}"`) - The client identifier to use when connecting to the broker.

- `mainTopic` (`string`, default: `"MAIN"`) - The main topic to subscribe to.

- `watchdogTimeout` (`number`, default: `2000`) - The time in milliseconds to wait for a connection to the broker before timing out.

- `reconnectTimeout` (`number`, default: `5000`) - The time in milliseconds to wait before attempting to reconnect to the broker after a disconnection.

## Usage Example

Vue Options API:

```typescript
mounted()  {
// Connect to the mqtt broker
$mqtt.connect();
// Subscribe to a topic
this.$mqtt.subscribe("test/topic", (message) => {
	console.log("Received message:",  message);
});
// Publish a message
this.$mqtt.publish("test/topic",  "Hello, world!");

// Disconnect from the broker
this.$mqtt.disconnect();
}
```

Vue Composition API:

```typescript
<script setup lang="ts">
import { getCurrentInstance, onMounted} from 'vue';
const { $mqtt }: any =  getCurrentInstance()?.appContext.config.globalProperties;

onMounted(()=>{
	// Connect to the mqtt broker
	$mqtt.connect();
	// Subscribe to a topic
	$mqtt.subscribe("test/topic", (message) => {
		console.log("Received message:",  message);
	});
	// Publish a message
	this.$mqtt.publish("test/topic",  "Hello, world!");
})
</script>
```

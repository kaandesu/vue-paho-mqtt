# Vue-Paho-Mqtt Plugin

The `vue-paho-mqtt` plugin provides a convenient way to use the [Eclipse Paho MQTT JavaScript client](https://www.eclipse.org/paho/clients/js/) with Vue 3.

This plugin allows you to connect to a MQTT broker and subscribe to topics in your Vue app. It uses `paho-mqtt` to connect to the broker and provides several useful features such as auto-reconnect, message handlers, and error notifications.

[Live demo](https://kaandesu.github.io/vue-paho-mqtt)

## Table of contents

-   [Installation](#installation)
-   [Usage](#usage)
-   [Options](#options)
    -   [Plugin Options](#plugin-options)
    -   [MQTT Options](#mqtt-options)
    -   [MQTT Quality of Service (QoS) and Retention Options for Publish](#mqtt-quality-of-service-qos-and-retention-options-for-publish)
-   [Notification Alerts](#notification-alerts)
-   [Usage Example](#usage-example)
    -   [Vue Options API](#vue-options-api)
    -   [Vue Composition API](#vue-composition-api)
-   [Contributing](#contributing)
-   [License](#license)
-   [Credits](#credits)
    -   [Contact](#contact)
-   [Changelog](#changelog)

## Installation

Install the package using npm:

```bash
npm install  vue-paho-mqtt
```

---

## Usage

To use the plugin, you need to create an instance of it and pass it to the `use` function:

```typescript
import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { createPahoMqttPlugin } from 'vue-paho-mqtt';

createApp(App)
	.use(
		createPahoMqttPlugin({
			PluginOptions: {
				autoConnect: true,

				showNotifications: true,
			},

			MqttOptions: {
				host: 'localhost',

				port: 9001,

				clientId: `MyID-${Math.random() * 9999}`,

				mainTopic: 'MAIN',
			},
		})
	)
	.mount('#app');
```

---

## Options

### Plugin Options

You can configure the plugin by passing an object with the following options to `createPahoMqttPlugin`:

-   `showNotifications` (`boolean`, default: `true`) - Whether to show error and success notifications.

-   `autoConnect` (`boolean`, default: `true`) - Whether to automatically connect to the broker when the plugin is initialized.

### MQTT Options

You can configure the MQTT client by passing an object with the following options to `createPahoMqttPlugin`:

-   `host` (`string`, default: `"localhost"`) - The hostname or IP address of the MQTT broker.

-   `port` (`number`, default: `9001`) - The port number of the MQTT broker.

-   `clientId` (`string`, default: `"ClientID-${Math.random() * 9999}}"`) - The client identifier to use when connecting to the broker.

-   `mainTopic` (`string`, default: `"MAIN"`) - The main topic to subscribe to.

-   `watchdogTimeout` (`number`, default: `2000`) - The time in milliseconds to wait for a connection to the broker before timing out.

-   `reconnectTimeout` (`number`, default: `5000`) - The time in milliseconds to wait before attempting to reconnect to the broker after a disconnection.

---

### MQTT Quality of Service (QoS) and Retention Options for Publish

The MQTT protocol provides Quality of Service (QoS) levels to control the reliability of message delivery between a publisher and a subscriber. Additionally, it provides the ability to retain messages, allowing subscribers to receive messages even if they connect after the message has been published.

The following are the MQTT QoS and retention options available for publishing messages:

| type   | Option | QoS Level | Retain |
| ------ | ------ | :-------: | -----: |
| string | B      |     0     |  false |
| string | Br     |     0     |   true |
| string | Q      |     1     |  false |
| string | Qr     |     1     |   true |
| string | F      |     2     |   true |
| string | Fnr    |     2     |  false |

-   **B**: QoS 0, non-retained message. The message is delivered at most once, and the broker does not store the message for future subscribers.

-   **Br**: QoS 0, retained message. The message is delivered at most once, and the broker stores the message for future subscribers.

-   **Q**: QoS 1, non-retained message. The message is delivered at least once, and the broker stores it until the publisher receives an acknowledgment from the subscriber.

-   **Qr**: QoS 1, retained message. The message is delivered at least once, and the broker stores it until the publisher receives an acknowledgment from the subscriber. The broker also stores the message for future subscribers.

-   **F**: QoS 2, retained message. The message is delivered exactly once, and the broker stores it for future subscribers.

-   **Fnr**: QoS 2, non-retained message. The message is delivered exactly once, and the broker does not store it for future subscribers.

---

## Notification Alerts

The Vue Paho MQTT plugin comes with built-in notifications using [SweetAlert2](https://sweetalert2.github.io/) library to display the notification alerts. _This library is already installed with the plugin_. <br>
There are three main usages of the notification:

Use Case When does it show?
SweetAlert When PluginOptions.showNotifications is true and enable is also true.
onFailureCallback When mqtt failed to connect.
onConnectCallback When mqtt is connected.
disconnectClient When called. Shows a dialog notification in case of error if the plugin is configured to do so.
connectClient When mqtt is connecting, connected, or connection timed out. Shows a dialog notification in case of error if the plugin is configured to do so.
----- WORK IN PROGRESS ------ TODO TABLE
| On | Icon | Content |
| :-----------------: | :---: | :-----: |
| onConnectionSuccess | false | false |
| 0 | true | true |
| 1 | false | false |
| 1 | true | true |
| 2 | true | true |
| 2 | false | false |

## Usage Example

### Vue Options API

```typescript
mounted() {
  // Connect to the mqtt broker
  $mqtt.connect();

  // Subscribe to a topic
  this.$mqtt.subscribe("test/topic", (message) => {
    console.log("Received message:",  message);
  });

  // Publish a message
  this.$mqtt.publish("test/topic",  "Hello, world!",  "F");
  // Disconnect from the broker
  this.$mqtt.disconnect();
}
```

### Vue Composition API

```typescript
<script setup lang="ts">

import { getCurrentInstance, onMounted}  from  "vue";
const { $mqtt }: any = getCurrentInstance()?.appContext.config.globalProperties;

onMounted(() => {
  // Connect to the mqtt broker
  $mqtt.connect();

  // Subscribe to a topic
  $mqtt.subscribe("test/topic", (message) => {
    console.log("Received message:",  message);
  });

  // Publish a message
  this.$mqtt.publish("test/topic",  "Hello, world!",  "F");
});

</script>

```

## Contributing

Contributions to the project is highly appreciated. If you have any suggestions/questions/requests please consider [opening an issue]([repository-url]/issues/new). If you want to contribute to the project, fixing an open issue is greatly recommended and appreciated. To see the all contribution rules please check the [contribution rules](CONTRIBUTING.md).

## License

This project is licensed under `MIT License` if you want to see more, please check [LICENSE](LICENSE) for more information.

[repository-url]: https://github.com/kaandesu/vue-paho-mqtt

## Credits

This project is created and actively maintained by [kaandesu](https://github.com/kaandesu) and [EgeOnder](https://github.com/EgeOnder)

### Contact

| Maintainer                              | E-Mail                                     | Twitter                                       |
| --------------------------------------- | ------------------------------------------ | --------------------------------------------- |
| [kaandesu](https://github.com/kaandesu) | kaandesu00@gmail.com                       | -                                             |
| [EgeOnder](https://github.com/EgeOnder) | 40398628+EgeOnder@users.noreply.github.com | [@EgeOnder23](https://twitter.com/EgeOnder23) |

## Changelog

Please see [CHANGELOG](CHANGELOG.md) for more information on what has changed recently.

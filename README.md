# Vue-Paho-Mqtt Plugin

The `vue-paho-mqtt` plugin provides a convenient way to use the [Eclipse Paho MQTT JavaScript client](https://www.eclipse.org/paho/clients/js/) with Vue 3.

This plugin allows you to connect to a MQTT broker and subscribe to topics in your Vue app. It uses [paho-mqtt](https://www.npmjs.com/package/paho-mqtt) to connect to the broker and provides several useful features such as auto-reconnect, message handlers, and error notifications.

[Live demo](https://kaandesu.github.io/vue-paho-mqtt)

## Table of contents

- [Installation](#installation)
- [Setup](#setup)
- [Options](#options)
  - [Plugin Options](#plugin-options)
  - [MQTT Options](#mqtt-options)
  - [MQTT Quality of Service (QoS) and Retention Options for Publish](#mqtt-quality-of-service-qos-and-retention-options-for-publish)
- [Notification Alerts](#notification-alerts)
- [Global MQTT client instance: $mqtt](#global-mqtt-client-instance-mqtt)
  - [$mqtt.connect()](#connect)
  - [$mqtt.disconnect()](#disconnect)
  - [$mqtt.subscribe()](#subscribe)
  - [$mqtt.publish()](#publish)
  - [$mqtt.host()](#host)
  - [$mqtt.port()](#port)
  - [$mqtt.clientId()](#client-id)
  - [$mqtt.mainTopic()](#main-topic)
  - [$mqtt.unsubscribe()](#unsubscribe)
  - [$mqtt.unsubscribeAll()](#unsubscribe-all)
  - [$mqtt.status()](#status)
- [Usage Example](#usage-example)
  - [Vue Options API](#vue-options-api)
  - [Vue Composition API](#vue-composition-api)
- [Contributing](#contributing)
- [License](#license)
- [Credits](#credits)
  - [Contact](#contact)
- [Changelog](#changelog)

## Installation

Install the package using npm:

```bash
npm install vue-paho-mqtt
```

---

## Setup

To use the plugin, you need to create an instance of it and pass it to the `use` function:

### Vite

```typescript
import { createApp } from "vue";
import App from "./App.vue";

import "vue-paho-mqtt/style.css";
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

Quasar Framework ([boot-files](https://quasar.dev/quasar-cli-webpack/boot-files/))

```js
import { boot } from "quasar/wrappers";

import "vue-paho-mqtt/style.css";
import { createPahoMqttPlugin } from "vue-paho-mqtt";

export default boot(({ app }) => {
  app.use(
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
  );
});
```

---

## Options

### Plugin Options

You can configure the plugin by passing an object with the following options to `createPahoMqttPlugin`:

- `showNotifications` (`boolean`, default: `true`) - Whether to show error and success notifications.

- `autoConnect` (`boolean`, default: `true`) - Whether to automatically connect to the broker when the plugin is initialized.

### MQTT Options

You can configure the MQTT client by passing an object with the following options to `createPahoMqttPlugin`:

- `host` (`string`, default: `"localhost"`) - The hostname or IP address of the MQTT broker.

- `port` (`number`, default: `9001`) - The port number of the MQTT broker.

- `clientId` (`string`, default: `"ClientID-${Math.random() * 9999}}"`) - The client identifier to use when connecting to the broker.

- `mainTopic` (`string`, default: `"MAIN"`) - If enaled, the topic that will be prepended to the topic specified during the $mqtt.publish and $mqtt.subscribe _(can be manually disabled in $mqtt.publish and $mqtt.subscribe)_.

- `enableMainTopic` (`boolean`, default: `true`) - Enables usage of the main topic.

- `watchdogTimeout` (`number`, default: `2000`) - The time in milliseconds to wait for a connection to the broker before timing out.

- `reconnectTimeout` (`number`, default: `5000`) - The time in milliseconds to wait before attempting to reconnect to the broker after a disconnection.

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

- **B**: QoS 0, non-retained message. The message is delivered at most once, and the broker does not store the message for future subscribers.

- **Br**: QoS 0, retained message. The message is delivered at most once, and the broker stores the message for future subscribers.

- **Q**: QoS 1, non-retained message. The message is delivered at least once, and the broker stores it until the publisher receives an acknowledgment from the subscriber.

- **Qr**: QoS 1, retained message. The message is delivered at least once, and the broker stores it until the publisher receives an acknowledgment from the subscriber. The broker also stores the message for future subscribers.

- **F**: QoS 2, retained message. The message is delivered exactly once, and the broker stores it for future subscribers.

- **Fnr**: QoS 2, non-retained message. The message is delivered exactly once, and the broker does not store it for future subscribers.

#### Example Usage with the $mqtt.publish

```ts
$mqtt.publish("test/topic", "Hello, world!", "Fnr");
```

---

## Notification Alerts

The Vue Paho MQTT plugin comes with built-in notifications using [SweetAlert2](https://sweetalert2.github.io/) library to display the notification alerts. _This library is already installed with the plugin_. <br>

- `PluginOptions.showNotifications` (`boolean`, default: `true`) - Whether to show error and success alert notifications.

```ts
createPahoMqttPlugin({
      PluginOptions: {
        showNotifications: true,
        ...
      }
      ...
```

|         On         |  Icon   |    Title     |            Content            | Timer |
| :----------------: | :-----: | :----------: | :---------------------------: | :---: |
| Connection Success | success | "Connected"  |       "MQTT Connected"        | 1500  |
| Connection Failure |  error  | "Mqtt Error" |   "MQTT failed to connect"    |   -   |
| Connection Timeout |  error  | "Mqtt Error" | "Broker connection timed out" |   -   |
|  Connection Lost   |  error  | "Mqtt Error" |    "MQTT connection lost"     |   -   |
|  Disconnect Error  |  error  |   "Error"    | catch(error) => error.message |   -   |
|   Connect Error    |  error  |   "Error"    | catch(error) => error.message |   -   |

---

---

## Global MQTT client instance: $mqtt

---

## Connect

### Usage

```ts
$mqtt.connect();
```

### Optional Custom Callbacks

|      Callback      |                       When                        |                          Return                           |
| :----------------: | :-----------------------------------------------: | :-------------------------------------------------------: |
|    `onConnect`     |     successfully connected to the mqtt broker     |                             -                             |
|    `onFailure`     |       failed to connect to the mqtt broker        |                             -                             |
| `onConnectionLost` |    disconnected or connection lost connection     |            responseObject: {errorCode: number}            |
| `onMessageArrived` | message arrived from one of the subscribed topics | message: {payloadString: string;destinationName: string;} |

#### Custom Callback Usage example:

```ts
$mqtt.connect({
  onConnect: () => {
    console.log("Mqtt connected");
  },
  onFailure: () => {
    console.log("Mqtt connection failed");
  },
  onConnectionLost: (error) => {
    console.log('Error:',error.message)
  }
  onMessageArrived: (message: {
        payloadString: string;
        destinationName: string;
      }) => {
    console.log('Message Arrived:',message.payloadString, message.destinationName);
  }
});
```

---

## Disconnect

---

## Subscribe

---

## Publish

---

## Host

---

## Port

---

## Client ID

---

## Main Topic

---

## Unsubscribe

---

## Unsubscribe All

---

## Status

### MqttMode:

```ts
type MqttMode = "B" | "F";
```

## Mqtt Status:

```ts
type MqttStatus =
  | "connected"
  | "disconnected"
  | "connecting"
  | "error"
  | "lost"
  | null;

status: (status?: MqttStatus) => MqttStatus;
```

### Get MQTT Status

```ts
$mqtt.status(); // 'connected', 'disconnected', 'connecting', 'error', 'lost', null
```

#### Example usage

```html
<template>
  <label>MQTT Status: {{ $mqtt.status() }}</label>
</template>
```

```ts
onMounted(() => {
  console.log($mqtt.status());
});
```

### Set MQTT Status

```ts
$mqtt.status("customStatus");
```

---

## Usage Example

### Vue Options API

```typescript
mounted() {
  // Connect to the mqtt broker
  this.$mqtt.connect();

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

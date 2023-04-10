# Vue-Paho-Mqtt Plugin

<p align="center">
  <img src="https://github.com/kaandesu/vue-paho-mqtt/raw/master/assets/logo.png" height="100" alt="Vue-Paho-Mqtt-Logo" />
</p>
<p align="center">
    <a href="https://www.npmjs.com/package/vue-paho-mqtt">
      <img src="https://img.shields.io/npm/v/vue-paho-mqtt?style=for-the-badge" alt="npm version">
    </a>        
    <a href="https://github.com/kaandesu/vue-paho-mqtt/actions/workflows/build.yml">
      <img src="https://img.shields.io/github/actions/workflow/status/kaandesu/vue-paho-mqtt/build.yml?style=for-the-badge" alt="build status">
    </a>
    <a href="https://github.com/kaandesu/vue-paho-mqtt/graphs/contributors">
      <img src="https://img.shields.io/github/contributors/kaandesu/vue-paho-mqtt?style=for-the-badge" alt="contributors">
    </a>
    <a href="https://github.com/kaandesu/vue-paho-mqtt/issues">
      <img src="https://img.shields.io/github/issues/kaandesu/vue-paho-mqtt?style=for-the-badge" alt="issues">
    </a>
    <a href="https://github.com/kaandesu/vue-paho-mqtt/pulls">
      <img src="https://img.shields.io/github/issues-pr/kaandesu/vue-paho-mqtt?style=for-the-badge" alt="pr">
    </a>    
    <a href="https://github.com/kaandesu/vue-paho-mqtt/commits/master" alt="Commit Activity">
      <img src="https://img.shields.io/github/commit-activity/m/kaandesu/vue-paho-mqtt?style=for-the-badge" />
    </a>    
</p>

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
  - [connect()](#connect)
  - [disconnect()](#disconnect)
  - [subscribe()](#subscribe)
  - [publish()](#publish)
  - [host()](#host)
  - [port()](#port)
  - [clientId()](#client-id)
  - [mainTopic()](#main-topic)
  - [unsubscribe()](#unsubscribe)
  - [unsubscribeAll()](#unsubscribe-all)
  - [status()](#status)
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

### Vite / VueCLI

```typescript
// src/main.ts
import App from './App.vue';
import { createApp } from 'vue';
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
    }),
  )
  .mount('#app');
```

### Quasar Framework ([quasar boot](https://quasar.dev/quasar-cli-vite/boot-files/))

```js
import { boot } from 'quasar/wrappers';
import { createPahoMqttPlugin } from 'vue-paho-mqtt';

export default boot(({ app }) => {
  app.use(
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
    }),
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

```ts
type MqttMode = 'B' | 'F' | 'Q' | 'Qr' | 'Br' | 'Fnr';
```

#### Example Usage with the $mqtt.publish

```ts
$mqtt.publish('test/topic', 'Hello, world!', 'Fnr');
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

## Global MQTT client instance: $mqtt

## Connect

Connect to the MQTT broker. Shows a dialog notification in case of error if the plugin is configured to do so.
Custom callbacks can be passed to the connect function. Such as `onConnect`, `onFailure`, `onConnectionLost`, `onMessageArrived`.

- `onConnect()`: resolves the promise to `true` if the connection was successful.
- `onFailure()`: rejects the promise to `false` if the connection was unsuccessful.
- `onConnectionLost()`: returns an response object with the following properties:
  - `errorCode`: the error code.
- `onMessageArrived()`:
 returns a message object with the following properties:
  - `payloadString`: the message payload as a string.
  - `destinationName`: the name of the topic that the message was published to.

Note: Inside the 'subscribe' function a function is passed to the 'onMessageArrived' callback. 
This function is used to parse the message payload and return the parsed message inside the subscribe 
function where it is called.
You don't really need to handle arriving messages in the 'onMessageArrived' callback.
### Type Definition

```ts
type ConnectFunction = ({ onConnect, onFailure, onConnectionLost, onMessageArrived, }?: {
    onConnect?: (() => unknown) | undefined;
    onFailure?: (() => unknown) | undefined;
    onConnectionLost?: ((responseObject: {
        errorCode: number;
    }) => unknown) | undefined;
    onMessageArrived?: ((message: {
        payloadString: string;
        destinationName: string;
    }) => void) | undefined;
}) => Promise<unknown>;
```

### Usage

```ts
// Composition API
import { $mqtt } from 'vue-paho-mqtt';
$mqtt.connect();

// Options API
this.$mqtt.connect();

// or use it with async/await
const result = await $mqtt.connect();
// result will return "true" if the connection was successful
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
    console.log('Mqtt connected');
  },
  onFailure: () => {
    console.log('Mqtt connection failed');
  },
  onConnectionLost: (error) => {
    console.log('Error:', error.message);
  },
  onMessageArrived: (message: {
    payloadString: string;
    destinationName: string;
  }) => {
    console.log(
      'Message Arrived:',
      message.payloadString,
      message.destinationName,
    );
  },
});
```

---

## Disconnect

Disconnect from the mqtt broker. Shows a dialog notification in case of error if the plugin is configured to do so.

### Type Definition

```ts
type DisconnectFunction = () => Promise<unknown>
```

### Usage

```ts
// Composition API
import { $mqtt } from 'vue-paho-mqtt';
$mqtt.disconnect();

// Options API
this.$mqtt.disconnect();

// or use it with async/await
const result = await $mqtt.disconnect();
// result will return "true" if the disconnection was successful
```

---

## Subscribe

It is used to subscribe to the topic specified, and to define the function to call when the specified topic recieves a message.
| param | type | explanation | default |
| :-----: | :------: | :----: | :---: |
| `topic` | `string` | MQTT topic to subscribe (ie: 'my/test/topic') | - |
| `onMessage` | `function` | Arrow function with a parameter to be fired when a message arrives to the specified topic | - |
| `useMainTopic` | `boolean` | main topic defined in the [MQTT Options](#mqtt-options) will be prepended to the topic specified | `true` |


### Type Definition

```ts
type SubscribeFunction = (
  topic: string,
  onMessage: (data: string) => unknown,
  useMainTopic?: boolean
) => void;
```

### Subscribe usage example

```ts
// if the enableMainTopic is true, subscribe to 'MAIN/my/topic'
this.$mqtt.subscribe('my/topic', (data: string) => {
  console.log(data, 'recieved');
});

// even if the enableMainTopic is true, subscribe to 'my/topic'
this.$mqtt.subscribe(
  'my/topic',
  (data: string) => {
    console.log(data, 'recieved');
  },
  false,
);
```

### Composition API
```ts
import { $mqtt } from 'vue-paho-mqtt';
$mqtt.subscribe('my/topic', (data: string) => {
  console.log(data, 'recieved');
});
```
---

## Publish

Used to publish string data to the topic specified.

### Type Definition

```ts
type PublishFunction = (
  topic: string,
  payload: string,
  mode: MqttMode,
  useMainTopic?: boolean
) => void;
```

|     param      |    type    |                                                                                                                   explanation                                                                                                                   | default |
| :------------: | :--------: | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------: | :-----: |
|    `topic`     |  `string`  |                                                                                                   MQTT topic to publish (ie: 'my/test/topic')                                                                                                   |    -    |
|   `payload`    |  `string`  |                                                                                                             string payload to send                                                                                                              |    -    |
|     `mode`     | `MqttMode` | See [MQTT Quality of Service (QoS) and Retention Options for Publish](#mqtt-quality-of-service-qos-and-retention-options-for-publish) for detailed explanation for mqtt mode options.  [`"B"` \| `"F"` \| `"Q"` \| `"Qr"` \| `"Br"` \| `"Fnr"`] |    -    |
| `useMainTopic` | `boolean`  |                                                                        main topic defined in the [MQTT Options](#mqtt-options) will be prepended to the topic specified                                                                         | `true`  |

### Publish usage example

```ts
// if the enableMainTopic is true, publish to 'MAIN/my/topic'
// 'Fnr' => Qos: 2 , retianed: false
this.$mqtt.publish('test/topic', 'Hello, world!', 'Fnr');

// even if the enableMainTopic is true, publish to 'my/topic'
// 'B' => Qos: 0 , retianed: false
this.$mqtt.publish('test/topic', 'Hello, world!', 'B', false);

// if the enableMainTopic is true, publish to 'MAIN/my/topic'
// 'Qr' => Qos: 1 , retianed: true
this.$mqtt.publish('test/topic', 'Hello, world!', 'Qr');

// payload: "Hello, world!"
```
### Composition API
```ts
import { $mqtt } from 'vue-paho-mqtt';
$mqtt.publish('test/topic', 'Hello, world!', 'Qr');
```
---

## Host

Get or set the host parameter from the [MQTT Options](#mqtt-options).

### Type Definition
```ts
type HostFunction = (e?: string) => string
```

### Get Host

```ts
$mqtt.host(); // ie: "localhost"
```

### Set MQTT host

```ts
$mqtt.host('192.168.0.1');
```

### Example usage

```html
<template>
  <label>MQTT host: {{ $mqtt.host() }}</label>
</template>
```

```ts
onMounted(() => {
  console.log(this.$mqtt.host());
});
```
### Composition API
```ts
import { onMounted }  from  "vue";
import { $mqtt } from 'vue-paho-mqtt';
onMounted(() => {
  console.log($mqtt.host());
});
```
---

## Port

Get or set the port parameter from the [MQTT Options](#mqtt-options).

### Type Definition

```ts
type PortFunction = (e?: number) => number
```

### Get Port

```ts
$mqtt.port(); // ie: 9001
```

### Set MQTT port

```ts
$mqtt.port(1234);
```

### Example usage

```html
<template>
  <label>MQTT port: {{ $mqtt.port() }}</label>
</template>
```


```ts
onMounted(() => {
  console.log(this.$mqtt.port());
});
```

### Composition API
```ts
import { onMounted }  from  "vue";
import { $mqtt } from 'vue-paho-mqtt';
onMounted(() => {
  console.log($mqtt.port());
});
```

---

## Client ID

Get or set the clientId parameter from the [MQTT Options](#mqtt-options).

### Type Definition
```ts
type ClientIdFunction = (e?: string) => string
```

### Get clientId

```ts
$mqtt.clientId(); // ie: "MyID-234"
```

### Set clientId

```ts
$mqtt.clientId('MyNewClientId');
```

### Example usage

```html
<template>
  <label>MQTT client id: {{ $mqtt.clientId() }}</label>
</template>
```

```ts
onMounted(() => {
  console.log(this.$mqtt.clientId());
});
```
### Composition API
```ts
import { onMounted }  from  "vue";
import { $mqtt } from 'vue-paho-mqtt';
onMounted(() => {
  console.log($mqtt.clientId());
});
```
---

## Main Topic

Get or set the mainTopic parameter from the [MQTT Options](#mqtt-options).
### Type Definition
```ts
type MainTopicFunction = (e?: string) => string | undefined
```

### Get mainTopic

```ts
$mqtt.mainTopic(); // ie: "MyID-234"
```

### Set MQTT mainTopic

```ts
$mqtt.mainTopic('MyNewClientId');
```

### Example usage

```html
<template>
  <label>MQTT mainTopic: {{ $mqtt.mainTopic() }}</label>
</template>
```

```ts
onMounted(() => {
  console.log(this.$mqtt.mainTopic());
});
```
### Composition API
```ts
import { onMounted }  from  "vue";
import { $mqtt } from 'vue-paho-mqtt';
onMounted(() => {
  console.log($mqtt.mainTopic());
});
```
---

## Unsubscribe

Used to unsubscribe from the topic specified

### Type Definition

```ts
type UnsubscribeFunction = (
  topic: string,
  useMainTopic?: boolean
) => void
```

|     param      |   type    |                                           explanation                                            | default |
| :------------: | :-------: | :----------------------------------------------------------------------------------------------: | :-----: |
|    `topic`     | `string`  |                         MQTT topic to unsubscribe (ie: 'my/test/topic')                          |    -    |
| `useMainTopic` | `boolean` | main topic defined in the [MQTT Options](#mqtt-options) will be prepended to the topic specified | `true`  |

### Unsubscribe usage example

```ts
// if the enableMainTopic is true, unsubscribe from 'MAIN/my/topic'
$mqtt.unsubscribe('test/topic');

// even if the enableMainTopic is true, unsubscribe from 'my/topic'
$mqtt.unsubscribe('test/topic', false);
```

---

## Unsubscribe All

Used to unsubscribe from **all** the topics subscribed previously.

### Type Definition

```ts
type UnsubscribeAllFunction = () => void
```
### Usage

```ts
$mqtt.unsubscribeAll();
```

---

## Status

Used to get the status of the mqtt connection.
### Type Definition

```ts
type MqttStatus =
  | 'connected'
  | 'disconnected'
  | 'connecting'
  | 'error'
  | 'lost'
  | null;

type StatusFunction = () => MqttStatus;
```

### Get MQTT Status

```ts
$mqtt.status(); // ie: "connected"
```

### Example usage

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

---

## Usage Example

### Vue Options API

```typescript
mounted() {
  // Connect to the mqtt broker
  this.$mqtt.connect();

  // Subscribe to a topic
  this.$mqtt.subscribe("test/topic", (message: string) => {
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

import { onMounted }  from  "vue";
import { $mqtt } from 'vue-paho-mqtt';

onMounted(() => {
  // Connect to the mqtt broker
  $mqtt.connect();

  // Subscribe to a topic
  $mqtt.subscribe("test/topic", (message: string) => {
    console.log("Received message:",  message);
  });

  // Publish a message
  $mqtt.publish("test/topic",  "Hello, world!",  "F");

   // Disconnect from the broker
  $mqtt.disconnect();
});

</script>

```

## Contributing

Contributions to the project is highly appreciated. 
If you have any suggestions/questions/requests please consider 
[opening an issue](https://github.com/kaandesu/vue-paho-mqtt/issues/new). If you want to contribute to the project, fixing an open issue is greatly recommended and appreciated. To see the all contribution rules please check the [contribution rules](CONTRIBUTING.md).

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

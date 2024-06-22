---
"vue-paho-mqtt": patch
---

Added more Paho options: (https://eclipse.dev/paho/files/jsdoc/Paho.MQTT.Client.html)
- keepAliveInterval: The server disconnects this client if there is no activity for this number of milliseconds. The default value of 60000 milliseconds is assumed if not set.
- cleanSession: if true(default) the client and server persistent state is deleted on successful connect.

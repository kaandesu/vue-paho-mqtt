# vue-paho-mqtt

## 0.6.5

### Patch Changes

- 2892c11: fixed caught failure on connection lost callback

## 0.6.4

### Patch Changes

- 1baa97c: No WSS attempt when `useSSL` is `false`.

## 0.6.3

### Patch Changes

- 4ed0146: Added more Paho options: (https://eclipse.dev/paho/files/jsdoc/Paho.MQTT.Client.html)
  - keepAliveInterval: The server disconnects this client if there is no activity for this number of milliseconds. The default value of 60000 milliseconds is assumed if not set.
  - cleanSession: if true(default) the client and server persistent state is deleted on successful connect.

## 0.6.2

### Patch Changes

- 5c771c2: Added timeout option to the connection parameters.

## 0.6.0

### Minor Changes

- f8bab09: feat: added + and # wildcard support

## 0.5.0

### Minor Changes

- c3f9cea: Can change username and password when autoconnect is disable, and can change path in mqtt broker URI

## 0.4.1

### Patch Changes

- 51b9f0b: Typing fixed, now usable with TypeScript.

## 0.4.0

### Minor Changes

- aa990ac: if useSSL is set to true, the wss:// protocol will be tried first, then the ws://

## 0.3.0

### Minor Changes

- 5755878: Added `wss` protocol support for connection to MQTT broker over SSL.

## 0.2.7

### Patch Changes

- 6b5d623: Added authentication support with `username` and `password`.

## 0.2.6

### Patch Changes

- 4c9a20a: fixed an issue that disabled changing the default mqtt options

## 0.2.5

### Patch Changes

- 14258c9: included utility broker tests to the build, fixed client unit test

## 0.2.4

### Patch Changes

- da48f75: Removed unnecessary packages from `package.json`, added a security policy, added scripts to contribution guidelines.

## 0.2.3

### Patch Changes

- 7deec53: added $mqtt global instance and fixed readme Options/Composition api example usage

## 0.2.2

### Patch Changes

- 612bccd: fixed $mqtt installation

## 0.2.1

### Patch Changes

- 88e5a7a: fixed npm page

## 0.2.0

### Minor Changes

- 2a5cdd2: Added tests and refactored code

## 0.1.0

### Minor Changes

- 2fbc6bc: Added `changesets` and workflows

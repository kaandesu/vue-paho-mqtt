global.WebSocket = require('ws');
export const mockClient = { host: 'localhost', port: 9001, clientId: 'mock' };

export const utilClient = {
  host: 'test.mosquitto.org',
  port: 8080,
  clientId: 'mock',
};

export const utilClientAuth = {
  host: 'test.mosquitto.org',
  port: 8090,
  username: 'rw',
  password: 'readwrite',
  clientId: 'mock',
};

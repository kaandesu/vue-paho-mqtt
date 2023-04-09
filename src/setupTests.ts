global.WebSocket = require('ws');

import { beforeAll, beforeEach } from 'vitest';
import { connectClient } from './pahoMqttPlugin/utils/connectClient';
import { createClient } from './pahoMqttPlugin/config/client';
import { unsubscribeAll } from './pahoMqttPlugin/utils/unsubscribeAll';

export const mockClient = { host: 'localhost', port: 9001, clientId: 'mock' };

beforeAll(() => {});

beforeEach(() => {});

import { describe, expect, it } from 'vitest';
import { createClient, getClient } from '../client';
import { mockClient } from '../../../setupTests';

describe('client', () => {
  it('should return client', () => {
    const client = getClient();

    expect(client).toBeDefined();
    expect(client.host).toEqual(mockClient.host);
    expect(client.port).toEqual(mockClient.port);
    expect(client.clientId).toEqual(mockClient.clientId);
  });

  it('should create new client', () => {
    const testClient = { host: 'test', port: 1234, clientId: 'test' };

    const client = createClient(testClient);

    expect(client).toBeDefined();
    expect(client.host).toEqual(testClient.host);
    expect(client.port).toEqual(testClient.port);
    expect(client.clientId).toEqual(testClient.clientId);
  });
});

import { utilClientAuth } from '~/../setupTests';
import { createClient } from '~/config/client';
import { defaultMqttOptions } from '~/config/constants';
import { getMqttOptions, setMqttOptions } from '~/config/options';
import * as UTILS from '~/utils';

const isBroker = import.meta.env.MODE === 'broker';

describe.runIf(isBroker)('auth utils', () => {
  it('if status is set right before connection', () => {
    expect(UTILS.status()).toBe('disconnected');
  });
  describe('Client', () => {
    setMqttOptions(utilClientAuth);
    createClient(getMqttOptions());
    it('if host set correctly', () => {
      expect(UTILS.host()).toBe(utilClientAuth.host);
    });
    it('if port set correctly', () => {
      expect(UTILS.port()).toBe(utilClientAuth.port);
    });
    it('if clientId set correctly', () => {
      expect(UTILS.clientId()).toBe(utilClientAuth.clientId);
    });
    it('if username set correctly', () => {
      expect(getMqttOptions().username).toBe(utilClientAuth.username);
    });
    it('if password set correctly', () => {
      expect(getMqttOptions().password).toBe(utilClientAuth.password);
    });
  });
  it(`if connects to the broker in ${defaultMqttOptions.watchdogTimeout}ms `, async () => {
    await expect(UTILS.connectClient()).resolves.toBe(true);
  });

  it.fails(
    `if fails to connect to the broker in ${defaultMqttOptions.watchdogTimeout}ms `,
    async () => await expect(UTILS.connectClient()).rejects.toBe(true),
  );
});

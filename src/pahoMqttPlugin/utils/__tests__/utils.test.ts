import { DoneCallback } from 'vitest';
import * as UTILS from '..';
import { MQTT_STATE, defaultMqttOptions } from '../../config/constants';
import { MqttMode } from '../../types';
import { getMqttOptions } from '../../config/options';
import { utilClient } from '../../../setupTests';
import { createClient } from '../../config/client';

describe.runIf(process.env.NODE_ENV === 'broker')('utils', () => {
  test('if status is set right before connection', () => {
    expect(UTILS.status()).toBe('disconnected');
  });
  describe('Client', () => {
    createClient({
      host: utilClient.host,
      port: utilClient.port,
      clientId: utilClient.clientId,
    });
    test('if host set correctly', () => {
      expect(UTILS.host()).toBe(utilClient.host);
    });
    test('if port set correctly', () => {
      expect(UTILS.port()).toBe(utilClient.port);
    });
    test('if clientId set correctly', () => {
      expect(UTILS.clientId()).toBe(utilClient.clientId);
    });
  });
  test(`if connects to the broker in ${defaultMqttOptions.watchdogTimeout}ms `, async () => {
    await expect(UTILS.connectClient()).resolves.toBe(true);
  });

  test.fails(
    `if fails to connect to the broker in ${defaultMqttOptions.watchdogTimeout}ms `,
    async () => await expect(UTILS.connectClient()).rejects.toBe(true),
  );

  const mqttModes = Object.keys(MQTT_STATE) as MqttMode[];
  /* subscribe */
  let unhandledTopicsList: string[] = [];
  describe.concurrent('multiple subscribers', () => {
    test.each(mqttModes)(
      `should subscribe to '%s'`,
      (mode: MqttMode) =>
        new Promise((done: DoneCallback) => {
          setTimeout(() => {
            const topic = `test${mode}`;
            const payload = `test${mode}`;
            unhandledTopicsList.push(topic);
            UTILS.subscribe(topic, (data: string) => {
              expect(data).toBe(payload);
              unhandledTopicsList = unhandledTopicsList.filter(
                (_top: string) => _top !== topic,
              );
            });
            done();
          }, 0);
        }),
    );
  });

  describe.concurrent('multiple publish with different modes', () => {
    /* publish for each */
    it.concurrent.each(mqttModes)(
      `should publish publish to ${getMqttOptions().mainTopic}/test%s'`,
      (mode: MqttMode) =>
        new Promise((done: DoneCallback) => {
          const topic = `test${mode}`;
          const payload = `test${mode}`;
          setTimeout(() => {
            UTILS.publish(topic, payload, mode);
            done();
          }, 200);
        }),
    );
    test.concurrent('publish test message with Fnr mode', () => {
      UTILS.publish('testFnr', 'testFnr', 'Fnr');
    });
  });
  /* msgHandlers */
  describe('msgHandlers', () => {
    beforeEach(() => {
      UTILS.clearMsgHandlers();
    });
    test('if msgHandlers gets cleared', () => {
      expect(Object.keys(UTILS.msgHandlers).length).toBe(0);
    });
    test('if subscribtion handler gets added succesfully', () => {
      UTILS.subscribe('testtopic', (data) => {}, false);
      UTILS.subscribe('testtopic2', (data) => {}, false);
      expect(Object.keys(UTILS.msgHandlers)).toContain('testtopic');
      expect(Object.keys(UTILS.msgHandlers)).toContain('testtopic2');
    });
  });
  /* unsubscribe */
  test('if unsubscribe works correctly', () => {
    UTILS.subscribe('testtopic', (data) => {});
    UTILS.subscribe('testtopic2', (data) => {});
    UTILS.unsubscribe('testtopic');
    expect(Object.keys(UTILS.msgHandlers)).not.toHaveProperty('testtopic');
  });

  /* unsubscribeAll */
  test('if unsubscribeAll works correctly', () => {
    UTILS.clearMsgHandlers();
    UTILS.subscribe('testtopic', (data) => {});
    UTILS.subscribe('testtopic2', (data) => {});
    UTILS.unsubscribeAll();
    expect(Object.keys(UTILS.msgHandlers)).not.toHaveProperty('testtopic');
    expect(Object.keys(UTILS.msgHandlers)).not.toHaveProperty('testtopi2');
  });

  test('if all subscribed topics recieved the payload', () => {
    expect(unhandledTopicsList).toHaveLength(0);
  });
  test('if disconnects from the broker and sets correct status', () => {
    expect(UTILS.disconnectClient()).resolves.toBe(true);
  });
});

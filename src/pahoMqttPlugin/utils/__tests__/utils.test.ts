import { DoneCallback } from 'vitest';
import { utilClient } from '~/../setupTests';
import { createClient } from '~/config/client';
import { MQTT_STATE, defaultMqttOptions } from '~/config/constants';
import { getMqttOptions, setMqttOptions } from '~/config/options';
import { MqttMode } from '~/types/types';
import * as UTILS from '~/utils';

describe.runIf(process.env.NODE_ENV === 'broker')('utils', () => {
  test('if status is set right before connection', () => {
    expect(UTILS.status()).toBe('disconnected');
  });
  describe('Client', () => {
    setMqttOptions(utilClient);
    createClient(getMqttOptions());
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
      'should subscribe to "%s"',
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
    test('if subscription handler gets added succesfully', () => {
      UTILS.subscribe('testtopic', (data) => data, false);
      UTILS.subscribe('testtopic2', (data) => data, false);
      expect(Object.keys(UTILS.msgHandlers)).toContain('testtopic');
      expect(Object.keys(UTILS.msgHandlers)).toContain('testtopic2');
    });
  });
  /* unsubscribe */
  test('if unsubscribe works correctly', () => {
    UTILS.subscribe('testtopic', (data) => data);
    UTILS.subscribe('testtopic2', (data) => data);
    UTILS.unsubscribe('testtopic');
    expect(Object.keys(UTILS.msgHandlers)).not.toHaveProperty('testtopic');
  });

  /* unsubscribeAll */
  test('if unsubscribeAll works correctly', () => {
    UTILS.clearMsgHandlers();
    UTILS.subscribe('testtopic', (data) => data);
    UTILS.subscribe('testtopic2', (data) => data);
    UTILS.unsubscribeAll();
    expect(Object.keys(UTILS.msgHandlers)).not.toHaveProperty('testtopic');
    expect(Object.keys(UTILS.msgHandlers)).not.toHaveProperty('testtopi2');
  });

  test('if all subscribed topics recieved the payload', () => {
    if (unhandledTopicsList[0] !== 'testFnr') {
      console.log(unhandledTopicsList);
      expect(unhandledTopicsList).toHaveLength(0);
    } else expect(unhandledTopicsList).toHaveLength(1);
  });
  test('if disconnects from the broker and sets correct status', () => {
    expect(UTILS.disconnectClient()).resolves.toBe(true);
  });
});

describe('createTopicList', () => {
  test('if creates a list of topics from a topic string', () => {
    expect(UTILS.createTopicList('this/is/a/test/topic')).toEqual([
      '#/is/a/test/topic',
      'this/#/a/test/topic',
      'this/is/#/test/topic',
      'this/is/a/#/topic',
      'this/is/a/test/#',
      'this/+',
      'this/is/+',
      'this/is/a/+',
      'this/is/a/test/+',
      'this/is/a/test/topic',
    ]);
  });
});

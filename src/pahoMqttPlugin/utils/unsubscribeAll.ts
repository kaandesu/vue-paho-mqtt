import { getClient } from '../config/client';
import {
  clearMsgHandlers,
  clearQueueMsgHandlers,
  msgHandlers,
  queueMsgHandlers,
} from './msgHandlers';

export type UnsubscribeAllFunction = typeof unsubscribeAll;

/**
 * Unsubscribe all topics
 * @returns {void}
 */
export const unsubscribeAll = () => {
  const subscribedTopics = {
    ...Object.keys(queueMsgHandlers),
    ...Object.keys(msgHandlers),
  };
  const client = getClient();

  for (const i in Object.keys(subscribedTopics)) {
    if (client && client.isConnected()) {
      try {
        client.unsubscribe(subscribedTopics[i]);
      } catch (err: unknown) {
        if (err instanceof Error) console.error(err.message);
      }
    }
  }

  clearMsgHandlers();
  clearQueueMsgHandlers();
};

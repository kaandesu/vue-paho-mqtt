import { createTopicList } from '~/utils/createTopicList';
import { msgHandlers } from '~/utils/msgHandlers';

export const onMessageArrivedCallback = (message: {
  payloadString: string;
  destinationName: string;
}): void => {
  const topic = message.destinationName;
  const payload = message.payloadString.replace(/\0.*$/g, '').trim();

  const possibleTopics = createTopicList(topic);

  if (msgHandlers[topic]) {
    msgHandlers[topic].forEach((handler) => {
      if (handler) handler(payload);
    });
  } else {
    let found = false;

    if (!found)
      possibleTopics.forEach((possibleTopic) => {
        if (msgHandlers[possibleTopic]) {
          msgHandlers[possibleTopic].forEach((handler) => {
            if (handler) {
              handler(payload);
              found = true;
            }
          });
        }
      });

    if (!found) console.warn('Unhandled topic!', topic, payload);
  }
};

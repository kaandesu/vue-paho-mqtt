import { msgHandlers } from '../utils/msgHandlers';

export const onMessageArrivedCallback = (message: {
  payloadString: string;
  destinationName: string;
}) => {
  const topic = message.destinationName;
  const payload = message.payloadString.replace(/\0.*$/g, '').trim();
  if (msgHandlers[topic]) {
    msgHandlers[topic].forEach((handler) => {
      if (handler) handler(payload);
    });
  } else {
    console.warn('Unhandled topic!', topic, payload);
  }
};

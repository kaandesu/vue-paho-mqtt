import { MsgHandler } from '~/types/types';

export let msgHandlers: MsgHandler = {};
export const clearMsgHandlers = () => {
  msgHandlers = {};
};

export let queueMsgHandlers: MsgHandler = {};
export const clearQueueMsgHandlers = () => {
  queueMsgHandlers = {};
};

import { MsgHandler } from "./types";

export let msgHandlers: MsgHandler = {};

export const clearMsgHandlers = () => {
  msgHandlers = {};
};

export let queueMsgHandler: MsgHandler = {};

export const clearQueueMsgHandler = () => {
  queueMsgHandler = {};
};

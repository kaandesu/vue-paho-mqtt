import { ref } from 'vue';
import type { MqttStatus } from '~/types/types';

export const mqttStatus = ref<MqttStatus | null>('disconnected');
export const connectWatchdog = ref<NodeJS.Timeout | null>(null);
export const stayConnected = ref<boolean>(false);

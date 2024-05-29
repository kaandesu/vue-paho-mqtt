import { disconnectClient } from '~/utils';
import { SweetAlert } from '~/utils/SweetAlert';
import { mqttStatus } from '~/utils/refs';

export const onFailureCallback = async (): Promise<void> => {
  mqttStatus.value = 'error';
  console.log('%cmqtt failed to connect', 'color:red');
  await disconnectClient();
  SweetAlert({
    title: 'Mqtt Error',
    text: 'MQTT failed to connect',
    icon: 'error',
  });
};

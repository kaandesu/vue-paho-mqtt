import { SweetAlert } from '~/utils/SweetAlert';
import { mqttStatus } from '~/utils/refs';

export const onFailureCallback = (): void => {
  mqttStatus.value = 'error';
  console.log('%cmqtt failed to connect', 'color:red');
  SweetAlert({
    title: 'Mqtt Error',
    text: 'MQTT failed to connect',
    icon: 'error',
  });
};

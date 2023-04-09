import type { SweetAlertOptions } from 'sweetalert2';
import swal from 'sweetalert2';
import { getPluginOptions } from '../config/options';

/**
 * @description - used to show a notification using sweetalert2 package
 * @param {SweetAlertOptions} swalSettings - used to set the settings for the notification
 * @param {boolean} [enable=true] - used to enable or disable the notification (default: true)
 */
export const SweetAlert = (swalSettings: SweetAlertOptions, enable = true) => {
  if (!getPluginOptions().showNotifications || !enable) return;
  swal.fire(swalSettings);
};

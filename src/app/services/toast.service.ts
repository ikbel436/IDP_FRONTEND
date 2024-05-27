import { inject, Injectable } from '@angular/core';

import { TranslocoService } from '@ngneat/transloco';
import { HotToastService } from '@ngxpert/hot-toast';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}

  private toastService = inject(HotToastService);
  private _translocoService = inject(TranslocoService);

  // Toasts

  /**
   * Creates a success toast notification.
   * This method is used to display a success message to the user, typically after a successful operation.
   * The toast message is translated using the Transloco service, allowing for internationalization.
   *
   * @param title - The title of the toast message. This is displayed prominently at the top of the toast.
   * @param method - A string that corresponds to a key in the translation files. This key is used to fetch the message content.
   * @returns void - This method does not return a value. It simply triggers the display of a toast notification.
   *
   * @example
   *  Assuming you have a translation key 'confirmationDialog.saveSuccess' that translates to 'Your changes have been saved successfully.'
   *  Note: the title needs to be a key in the translation file, e.g. 'confirmationDialog.titles.notification'
   * this.toastService.createSuccessToast('notification', 'saveSuccess');
   *  This will display a toast with the message 'Notifications have been saved successfully.'
   */
  createSuccessToast(title: string, method: string) {
    return this.toastService.success(
      this._translocoService.translate(`confirmationDialog.${method}`, {
        title,
      })
    );
  }

  /**
   * Creates an error toast notification.
   * This method is used to display an error message to the user, typically after a error handling.
   * The toast message is translated using the Transloco service, allowing for internationalization.
   *
   * @param title - The title of the toast message. This is displayed prominently before the method .
   * @param method - A string that corresponds to a key in the translation files. This key is used to fetch the message content.
   * @returns void - This method does not return a value. It simply triggers the display of a toast notification.
   *
   * @example
   *  Assuming you have a translation key 'confirmationDialog.error' that translates to ' An error occurred while {{method}} the {{title}}. Please try again.'
   *  Note: the title needs to be a key in the translation file, e.g. 'confirmationDialog.titles.notification'
   * this.toastService.createErrorToast('notification', 'updating');
   *  This will display a toast with the message 'An error occurred while updating the notifications. Please try again.'
   */

  createErrorToast(title: string, method: string) {
    return this.toastService.error(
      this._translocoService.translate('confirmationDialog.error', {
        method: this._translocoService.translate(`confirmationDialog.${method}`),
        title,
      })
    );
  }
}

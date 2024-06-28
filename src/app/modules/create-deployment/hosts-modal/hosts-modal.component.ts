import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastService } from 'app/services/toast.service';

@Component({
    selector: 'app-hosts-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hosts-modal.component.html',
    styleUrls: ['./hosts-modal.component.scss'],
})
export class HostsModalComponent {
    constructor(
        @Inject(MAT_DIALOG_DATA) public data: { hosts: string[] },
        private _toastService: ToastService
    ) {
        console.log('Received hosts:', this.data.hosts);
    }

    copyToClipboard(): void {
        const text = this.data.hosts.map(host => `idp.insparkconnect.com/${host}`).join('\n');
        navigator.clipboard
            .writeText(text)
            .then(() => {
                this._toastService.createSuccessToast('The hosts list has been copied to the clipboard.');
            })
            .catch((err) => {
                console.error('Error copying text: ', err);
            });
    }
}

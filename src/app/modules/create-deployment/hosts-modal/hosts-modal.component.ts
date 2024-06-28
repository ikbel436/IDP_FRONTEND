import { Component, Input , Inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'app-hosts-modal',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './hosts-modal.component.html',
    styleUrl: './hosts-modal.component.scss',
})
export class HostsModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { hosts: string[] }) {
    console.log('Received hosts:', this.data.hosts);
}
}

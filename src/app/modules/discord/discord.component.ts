import { Component } from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterLink } from '@angular/router';
import { FuseCardComponent } from '@fuse/components/card';

@Component({
  selector: 'app-discord',
  standalone: true,
  imports: [CommonModule,MatButtonModule, FuseCardComponent, RouterLink, MatIconModule, MatExpansionModule, MatFormFieldModule, MatInputModule, NgIf, NgClass],
  templateUrl: './discord.component.html',
  styleUrl: './discord.component.scss'
})

export class DiscordComponent {
  onlineMembers = 1460; 
  members: any[] = [
    { name: 'Buzzard', avatar: 'assets/avatars/buzzard.png' },
    { name: 'ByteMyke', avatar: 'assets/avatars/bytemyke.png' },
    // Add more members as needed
  ];
  constructor() { }

  ngOnInit(): void {
  }

  joinDiscord(): void {
    window.open('https://discord.gg/your-invite-link', '_blank');
  }
}

import { Component } from '@angular/core';

/**
 * About Component
 * 
 * Displays information about Voluntra, the development team, and contact details.
 */
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent {
  title = 'Voluntra';
  
  developers = [
    {
      name: 'Selam',
      role: 'Full Stack Developer',
      email: 'sga4824@g.rit.edu',
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Katherine"
    },
    {
      name: 'Abel',
      role: 'Full Stack Developer',
      email: 'aaa2642@g.rit.edu',
      avatarUrl: "https://api.dicebear.com/9.x/avataaars/svg?seed=Maria"
    }
  ];

  contactEmail = 'support@voluntra.com';
}

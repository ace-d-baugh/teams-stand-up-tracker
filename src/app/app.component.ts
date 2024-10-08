import { bootstrapApplication } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';
import { Team } from '../../public/team';
import { WDWTeam } from '../../public/wdw-team';
import { TeamMember } from '../interfaces/team-member';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CdkDrag, CdkDropList, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {

  team: TeamMember[] = [];
  active: TeamMember[] = [];
  isDarkMode = false;
  isWDW = false;
  columns = 3;

  isValidPhoto(firstName: string): boolean {
    return this.photoExists(`${firstName}.jpg`);
  }

  photoExists(url: string): boolean {
    const xhr = new XMLHttpRequest();
    xhr.open('HEAD', url, false);
    xhr.send();
    return xhr.status !== 404;
  }

  clearStandUp() {
    this.team.push(...this.active);
    this.active = [];
    this.team.forEach((member) => (member.hasGone = false));
    this.sortTeam();
    this.columns = 3;
  }
  moveToActive() {
    this.active.push(...this.team);
    this.team = [];
    if (this.active.length > 12) {
      this.columns = 4;
    }
    this.toggleSidebar();
  }

  ngOnInit(): void {
    this.team = Team;
    this.sortTeam();
    this.loadThemePreference();
  }

  select(member: TeamMember): void {
    member.hasGone = !member.hasGone;
  }

  drop(event: CdkDragDrop<TeamMember[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      this.sortTeam();
    }
  }

  sortTeam(): void {
    this.team.sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
    this.team.forEach((member) => (member.hasGone = false));
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    this.saveThemePreference();
    if (this.isDarkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }

  toggleTeams(): void {
    if (this.isWDW) {
      this.clearStandUp();
      this.team = WDWTeam;
      this.isWDW = false;
    } else {
      this.clearStandUp();
      this.team = Team;
      this.isWDW = true;
    }
  }

  private saveThemePreference(): void {
    localStorage.setItem('themePreference', this.isDarkMode ? 'dark' : 'light');
  }

  private loadThemePreference(): void {
    const themePreference = localStorage.getItem('themePreference');
    if (themePreference === 'dark') {
      this.isDarkMode = true;
      document.body.classList.add('dark-mode');
    } else {
      this.isDarkMode = false;
      document.body.classList.remove('dark-mode');
    }
  }

  // takes the input from the slider and changes the number of columns by adding and removing bootstrap classes
  changeColumns(): void {
    const slider = document.getElementById('myRange') as HTMLInputElement;
    const columns = slider.value;
    if (columns === '3') {
      this.columns = 3;
    } else if (columns === '2') {
      this.columns = 2;
    } else if (columns === '4') {
      this.columns = 4;
    } else if (columns === '5') {
      this.columns = 5;
    }
  }

  // adds class of "pop-out" to the element with the class "team-pool-list-container" when the user clicks on it
    toggleSidebar(): void {
      const sidebar = document.getElementsByClassName('team-pool-list-container')[0] as HTMLElement;
      const popIcon = document.getElementsByClassName('pop-out-icon')[0] as HTMLImageElement;
      sidebar.classList.toggle('pop-out');
      popIcon.classList.toggle('rotated');
    }
}

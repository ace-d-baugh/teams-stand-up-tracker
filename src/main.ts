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
import { Team } from '../public/team';

interface TeamMember {
  firstName: string;
  lastName: string;
  hasGone: boolean;
  showPhoto: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag],
  template: `
    <div class="component-container">
      <h1 class="text-center">Our Team: Stand-Up Tracker</h1>
      <h6 class="text-center">
        Drag each member to the position you want. Click on the member to show
        they are no longer available.
      </h6>
      <div class="dark-mode-switch">
        <button class="button" (click)="toggleDarkMode()">
          Toggle Dark Mode
        </button>
      </div>
      <div class="move-lists">
        <button class="button mx-2 mb-3" (click)="moveToActive()">
          Move to Stand-Up
        </button>
        <button class="button mx-2 mb-3" (click)="clearStandUp()">
          Clear Stand-Up
        </button>
      </div>

      <div class="team-tracker-container">
        <div
          class="team-pool-list-container"
          cdkDropList
          id="team-pool-list-container"
          cdkDropListSortingDisabled
          [cdkDropListData]="team"
          (cdkDropListDropped)="drop($event)"
          [cdkDropListConnectedTo]="['active-team-tracker-container']"
        >
          <h5>The Team</h5>
          <div class="col g-2">
            @for (member of team; track member) {
            <div class="team-member d-flex justify-content-center" cdkDrag>
              <div class="card w-100">
                <div
                  class="card-body list member-name w-100"
                  [class.selected]="member.hasGone"
                >
                  <h5
                    class="card-title d-flex flex-column justify-content-center"
                  >
                    {{ member.firstName
                    }}<span class="d-none d-md-block"
                      ><br />{{ member.lastName }}</span
                    >
                  </h5>
                </div>
              </div>
            </div>
            }
          </div>
        </div>
        <div
          class="active-team-tracker-container"
          id="active-team-tracker-container"
          cdkDropList
          cdkDropListOrientation="mixed"
          [cdkDropListData]="active"
          (cdkDropListDropped)="drop($event)"
          [cdkDropListConnectedTo]="['team-pool-list-container']"
        >
          <h5>In The Stand-Up: {{ active.length }}</h5>
          <div
            class="stand-up-container row g-2 justify-content-center"
            [ngClass]="active.length > 12 ? 'row-cols-4' : 'row-cols-3'"
          >
            @for (member of active; track member) {
            <div class="col" (click)="select(member)" cdkDrag>
              <div class="card h-100">
                <div
                  *ngIf="member.hasGone"
                  class="check-mark position-absolute top-0 end-0"
                >
                  <i
                    class="bi bi-check"
                    style="font-size: 30px; font-weight: 900;"
                  ></i>
                </div>

                <!-- ******* START INITIAL VERSION ******* -->

                <div
                  *ngIf="!member.showPhoto || !isValidPhoto(member.firstName)"
                  class="card-img-top member-initials"
                  [class.selected]="member.hasGone"
                >
                  <div class="initials">
                    {{ member.firstName[0] }}{{ member.lastName[0] }}
                  </div>
                </div>

                <!-- ******* END INITIAL VERSION ******* -->

                <!-- ******* START PHOTO VERSION ******* -->

                <div
                  *ngIf="member.showPhoto && isValidPhoto(member.firstName)"
                  class="card-img-top member-photo"
                  [class.selected]="member.hasGone"
                >
                  <img
                    src="{{ member.firstName }}.jpg"
                    alt="{{ member.firstName }} {{ member.lastName }}"
                  />
                </div>

                <!-- ******* END PHOTO VERSION ******* -->

                <div
                  class="card-body member-name"
                  [class.selected]="member.hasGone"
                >
                  <h5 class="card-title h-100 text-center">
                    {{ member.firstName }}
                    <span class="d-none d-md-block"
                      ><br />{{ member.lastName }}</span
                    >
                  </h5>
                </div>
              </div>
            </div>
            }
          </div>
        </div>
      </div>
    </div>
  `,
})
export class App implements OnInit {
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
    // Sort by first name
    this.team.sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
  }
  moveToActive() {
    this.active.push(...this.team);
    this.team = [];
  }
  team: TeamMember[] = [];
  active: TeamMember[] = [];
  isDarkMode = false;

  ngOnInit(): void {
    this.team = Team;
    this.team.sort((a, b) => (a.firstName > b.firstName ? 1 : -1));
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
    }
    console.log('active', this.active.length);
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
}

bootstrapApplication(App);

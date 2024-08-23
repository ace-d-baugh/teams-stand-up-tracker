import { bootstrapApplication } from '@angular/platform-browser';
import { Component, OnInit } from '@angular/core';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

interface TeamMember {
  firstName: string;
  lastName: string;
  photo: string;
  hasGone: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, CdkDropList, CdkDrag],
  template: `
    <div class="component-container">
      <h1 class="text-center">Our Team: Stand Up Tracker</h1>
      <h6 class="text-center">
        Drag each member to the position you want. Click on the member to show
        they are no longer available.
      </h6>
      <div
        class="team-tracker-container"
        cdkDropList
        cdkDropListOrientation="mixed"
        (cdkDropListDropped)="drop($event)"
      >
        <div class="row row-cols-4 g-2">
          @for (member of team; track member) {
          <div class="team-member" (click)="select(member)" cdkDrag>
            <div class="card h-100">
              <div
                *ngIf="member.hasGone"
                class="check-mark position-absolute top-0 end-0"
              >
                <i
                  class="bi bi-check"
                  style="font-size: 30px; font-weight: 900; color: lime"
                ></i>
              </div>
              <div
                class="card-img-top member-photo"
                [class.selected]="member.hasGone"
              >
                <img
                  src="https://github.com/ace-d-baugh/teams-stand-up-tracker/blob/master/src/assets/{{
                    member.photo
                  }}?raw=true/"
                />
              </div>
              <div
                class="card-body member-name"
                [class.selected]="member.hasGone"
              >
                <h5 class="card-title h-100 text-center">
                  {{ member.firstName }}
                  <span class="d-none d-md-block">{{ member.lastName }}</span>
                </h5>
              </div>
            </div>
          </div>
          }
        </div>
      </div>
    </div>
  `,
})
export class App implements OnInit {
  team: TeamMember[] = [];

  ngOnInit(): void {
    this.team = [
      {
        firstName: 'Remon',
        lastName: 'Ghatas',
        photo: 'remon.jpg',
        hasGone: false,
      },
      {
        firstName: 'Annie',
        lastName: 'Andrejek',
        photo: 'annie.jpg',
        hasGone: false,
      },
      { firstName: 'Ace', lastName: 'Baugh', photo: 'ace.jpg', hasGone: false },
      {
        firstName: 'Geoff',
        lastName: 'Biby',
        photo: 'geoff.jpg',
        hasGone: false,
      },
      {
        firstName: 'Corey',
        lastName: 'Cobus',
        photo: 'corey.jpg',
        hasGone: false,
      },
      {
        firstName: 'Cody',
        lastName: 'Crampton',
        photo: 'cody.jpg',
        hasGone: false,
      },
      {
        firstName: 'Charlene',
        lastName: 'Creighton',
        photo: 'charlene.jpg',
        hasGone: false,
      },
      {
        firstName: 'Heather',
        lastName: 'Dangren',
        photo: 'heather.jpg',
        hasGone: false,
      },
      {
        firstName: 'Paul',
        lastName: 'Hinz',
        photo: 'paul.jpg',
        hasGone: false,
      },
      {
        firstName: 'Casey',
        lastName: "O'Donahoe",
        photo: 'casey.jpg',
        hasGone: false,
      },
      {
        firstName: 'Anton',
        lastName: 'Ortiz Campos',
        photo: 'anton.jpg',
        hasGone: false,
      },
      { firstName: 'Greg', lastName: 'Rau', photo: 'greg.jpg', hasGone: false },
      {
        firstName: 'Darren',
        lastName: 'Rauer',
        photo: 'darren.jpg',
        hasGone: false,
      },
      {
        firstName: 'Shawn',
        lastName: 'Safdar',
        photo: 'shawn.jpg',
        hasGone: false,
      },
      {
        firstName: 'Aviv',
        lastName: 'Shazar',
        photo: 'aviv.jpg',
        hasGone: false,
      },
      {
        firstName: 'Simon',
        lastName: 'Yu',
        photo: 'simon.jpg',
        hasGone: false,
      },
    ];
  }

  select(member: TeamMember): void {
    member.hasGone = !member.hasGone;
  }

  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.team, event.previousIndex, event.currentIndex);
  }
}

bootstrapApplication(App);

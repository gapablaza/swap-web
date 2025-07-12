import {
  Component,
  computed,
  EventEmitter,
  input,
  Output,
} from '@angular/core';

import {
  MatButtonToggleChange,
  MatButtonToggleModule,
} from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-user-vote',
  standalone: true,
  imports: [MatButtonToggleModule, MatIconModule, MatTooltipModule],
  styles: [
    `
      .vote-toggle-group {
        display: flex;
        gap: 4px;
      }

      .vote-button {
        border: 1px solid transparent;
        border-radius: 4px;
        transition: background-color 0.2s, border-color 0.2s;
      }

      .vote-button.selected-like {
        background-color: #e3f2fd;
        border-color: #2196f3;
      }

      .vote-button.selected-dislike {
        background-color: #ffebee;
        border-color: #f44336;
      }
    `,
  ],
  template: `
    <mat-button-toggle-group
      #group="matButtonToggleGroup"
      multiple
      [hideMultipleSelectionIndicator]="true"
      (change)="toggleChange($event)"
      [value]="selectedValues()"
      [disabled]="isProcessing()"
    >
      <mat-button-toggle value="1" #like 
        matTooltip="Usuario recomendado" matTooltipPosition="above">
        <!-- <mat-icon>thumb_up</mat-icon> -->
        <mat-icon>{{ selectedValues().includes('1') ? 'thumb_up' : 'thumb_up_off_alt' }}</mat-icon>
      </mat-button-toggle>
      <mat-button-toggle value="-1" #dislike 
        matTooltip="No recomiendo este usuario" matTooltipPosition="above">
        <!-- <mat-icon>thumb_down</mat-icon> -->
        <mat-icon>{{ selectedValues().includes('-1') ? 'thumb_down' : 'thumb_down_off_alt' }}</mat-icon>
      </mat-button-toggle>
    </mat-button-toggle-group>
  `,
})
export class UserVoteComponent {
  voteStatus = input<number | null | undefined>(0);
  selectedValues = computed(() => {
    const status = this.voteStatus();
    return status === 1 || status === -1 ? [status.toString()] : [];
  });
  isProcessing = input<boolean | null>(true);

  @Output() voteChange = new EventEmitter<number>();

  toggleChange(event: MatButtonToggleChange) {
    const toggle = event.source;
    if (toggle && event.value.some((item: string) => item === toggle.value)) {
      toggle.buttonToggleGroup.value = [toggle.value];
    }
    // console.log((event.value as []).length ? toggle.value : 0);
    this.voteChange.emit((event.value as []).length ? Number(toggle.value) : 0);
  }
}

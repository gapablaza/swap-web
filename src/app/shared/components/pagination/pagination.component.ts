import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
})
export class PaginationComponent {
  pageSelected = input(1);
  lastPage = input.required<number>();
  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: string) {
    const pageNumber = parseInt(page, 10);
    if (!isNaN(pageNumber)) {
      this.pageChange.emit(pageNumber);
    }
  }
}

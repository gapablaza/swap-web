import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
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
  pageNumbers = computed(() => {
    return [...Array(this.lastPage()).keys()].map((i) => i + 1);
  });

  @Output() pageChange = new EventEmitter<number>();

  onPageChange(page: string) {
    const pageNumber = parseInt(page, 10);
    if (!isNaN(pageNumber)) {
      this.pageChange.emit(pageNumber);
    }
  }

  itemId($index: number, item: number) {
    return $index;
  }
}

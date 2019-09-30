import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-search-item',
  templateUrl: './search-item.component.html',
  styleUrls: ['./search-item.component.css']
})
export class SearchItemComponent implements OnInit {
  @Input() f1;
  @Input() f2;
  @Input() index;
  @Input() lastIndex;
  @Output() addFilterEE: EventEmitter<undefined> = new EventEmitter();
  @Output() updateFilterEE: EventEmitter<{'index': number, 'f1': string, 'f2': string}> = new EventEmitter();
  @Output() removeFilterEE: EventEmitter<number> = new EventEmitter();
  @Output() applyFilterEE: EventEmitter<undefined> = new EventEmitter();

  selectedValueF1;
  selectedValueF2;

  constructor() { }

  ngOnInit() {
  }

  addFilter() {
    this.addFilterEE.emit();
  }

  updateFilter() {
    console.log({'f1': this.selectedValueF1, 'f2': this.selectedValueF2});
    this.updateFilterEE.emit({'index': this.index, 'f1': this.selectedValueF1, 'f2': this.selectedValueF2});
  }

  removeFilter() {
    this.removeFilterEE.emit(this.index);
  }

  applyFilter() {
    this.applyFilterEE.emit();
  }

}

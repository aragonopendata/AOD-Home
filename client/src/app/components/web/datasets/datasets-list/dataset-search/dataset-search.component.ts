import { Component, OnInit, Input } from '@angular/core';
import { stringify } from '@angular/compiler/src/util';

@Component({
  selector: 'app-dataset-search',
  templateUrl: './dataset-search.component.html',
  styleUrls: ['./dataset-search.component.css']
})
export class DatasetSearchComponent implements OnInit {
  
  @Input() f1_title;
  @Input() f2_title;
  @Input() f1;
  @Input() f2;
  @Input() callback;

  lastIndex = 0;
  filters = [{'index': 0, 'f1': '', 'f2': ''}];

  constructor() { }

  ngOnInit() {
  }

  updateLastIndex() {
    this.lastIndex = this.filters[this.filters.length-1].index
  }

  addFilter() {
    this.filters.push({'index': this.lastIndex + 1, 'f1': '', 'f2': ''});
    this.updateLastIndex();
  }

  updateFilter(filter) {
    let index = this.filters.indexOf(this.filters.find(x => { return x.index === filter.index }))
    this.filters[index].f1 = filter.f1;
    this.filters[index].f2 = filter.f2;
    console.log(this.filters);
  }

  removeFilter(index) {
    if(this.filters.length > 1) {
      this.filters.splice(this.filters.indexOf(this.filters.find(x => { return x.index === index })), 1)
      this.updateLastIndex();
    }
  }

  applyFilter() {
    this.callback(this.filters);
  }

}

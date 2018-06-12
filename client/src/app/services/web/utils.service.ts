import { Injectable } from '@angular/core';
import { EventEmitter } from 'events';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  openedMenu: boolean;
   openedMenuChange: Subject<boolean> = new Subject<boolean>();

  constructor() {
    this.openedMenuChange.subscribe((value) => {
      this.openedMenu = value;
    });
  }

  tooggleOpenedMenu(){
    this.openedMenuChange.next(!this.openedMenu);
  }

  /*public setOpenedMenu(openedMenu){
    this.openedMenu = openedMenu;
  }

  public getOpenedMenu(){
    return this.openedMenu;
  }*/ 

}

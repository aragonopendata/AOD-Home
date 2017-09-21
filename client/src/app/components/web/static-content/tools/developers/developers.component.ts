import { Component, OnInit } from '@angular/core';
import $ from 'jquery';

@Component({
    selector: 'app-developers',
    templateUrl: './developers.component.html',
    styleUrls: ['./developers.component.css']
})
export class DevelopersComponent implements OnInit {

    activated: boolean = false;
    idActive: String = '';

    constructor() { }

    ngOnInit() {
        let i: number = 0;
        $('i').each(function () {
            $(this).attr('id_', i);
            i++;
        });
    }

    getChildren(id) {
        if (this.idActive.localeCompare(id) === 0 || this.idActive.localeCompare('') === 0) {
            this.activated = !this.activated;
            this.changeIcon($(id).children().children());
            if (this.idActive.localeCompare(id) === 0) {
                this.idActive = '';
            } else {
                this.idActive = id;
            }
        } else {
            this.activated = !this.activated;
            this.changeIcon($(this.idActive).children().children());
            this.activated = !this.activated;
            this.changeIcon($(id).children().children());
            this.idActive = id;
        }
    }

    changeIcon(tag) {
        if (this.activated) {
            $(tag).attr('class', 'fa fa-minus-circle');
        } else {
            $(tag).attr('class', 'fa fa-plus-circle');
        }
    }

}

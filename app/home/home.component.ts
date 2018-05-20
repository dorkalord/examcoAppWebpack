import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
declare var require: any;

@Component({
    templateUrl: 'home.component.html'
})

export class HomeComponent implements OnInit {
    formBuilder: any;
    currentUser: User;
    users: User[] = [];
    podatki: number[] = [];
    tooltipdisplay:boolean = false;
    someRange2config: any;

    constructor(private userService: UserService,
        private elRef: ElementRef) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.podatki = [3, 5, 7, 9, 11, 15];

        this.someRange2config = {
            behaviour: 'tap',
            connect: true,

            margin: 1,
            //limit: 5, // NOTE: overwritten by [limit]="10"
            range: {
                min: 0,
                max: 20
            },
            pips: {
                mode: 'steps',
                density: 5
            }
        };
        this.someRange2config.tooltips = true;


    }

    ngOnInit() {
        this.loadAllUsers();

    }

    ngAfterViewInit() {
        var connect2 = this.elRef.nativeElement.getElementsByClassName("noUi-tooltip");

        for (var i = 0; i < connect2.length; i++) {
            connect2[i].style.display = "none";
        }
    }

    enter() {
        console.log("enter");
        this.tooltipdisplay = true;

        let classes = ['c-1-color', 'c-2-color', 'c-3-color', 'c-4-color', 'c-5-color', 'c-6-color'];

        var connect = this.elRef.nativeElement.querySelectorAll('.noUi-connect') ;
        for (var i = 0; i < connect.length; i++) {
            connect[i].classList.add(classes[i]);
        }

        var connect2 = this.elRef.nativeElement.getElementsByClassName("noUi-tooltip");

        for (var i = 0; i < connect2.length; i++) {
            connect2[i].style.display = "";
        }
    }

    deleteUser(id: number) {
        this.userService.delete(id).subscribe(() => { this.loadAllUsers() });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; });
    }

}
import { Component, OnInit } from '@angular/core';

import { AlertService } from '../_services/index';
declare var require: any;

@Component({
    selector: 'alert',
    templateUrl: 'alert.component.html'
})

export class AlertComponent {
    message: any;

    constructor(private alertService: AlertService) { }

    ngOnInit() {
        this.alertService.getMessage().subscribe(message => { this.message = message; });
    }

    hide(){
        console.log("hide alert");
       this.alertService.hide();
    }
}
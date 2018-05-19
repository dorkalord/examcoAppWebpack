import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { Router, ActivatedRoute } from '@angular/router';

declare var require: any;

@Component({
    selector: "my-navigation",
    templateUrl: 'header.component.html'
    
})

export class HeaderComponent implements OnInit {
    currentUser: User;
    show: boolean = false;
    constructor(private userService: UserService,
                private route: ActivatedRoute,
                private router: Router) 
    {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if(this.currentUser!=null){
            this.show = true;
        }
    }

    ngOnInit() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(this.currentUser!=null){
            this.show = true;
        }
        else { 
            this.show = false;
        }
    }

    ngDoCheck()	{
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if(this.currentUser!=null){
            this.show = true;
        }
        else { 
            this.show = false;
        }
    }

}
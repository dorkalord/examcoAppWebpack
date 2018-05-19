import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { CourseComponent } from '../course/course.component';

import { FormBuilder, FormGroup } from '@angular/forms';
import { AlertService } from '../_services/alert.service';
import { Router } from '@angular/router';
import { Role } from '../_models/role';

declare var jQuery: any;
declare var require: any;

@Component({
    templateUrl: 'user-list.component.html',
    styles: [`.btn-file {
    position: relative;
    overflow: hidden;
}
.btn-file input[type=file] {
    position: absolute;
    top: 0;
    right: 0;
    min-width: 100%;
    min-height: 100%;
    font-size: 100px;
    text-align: right;
    filter: alpha(opacity=0);
    opacity: 0;
    outline: none;
    background: white;
    cursor: inherit;
    display: block;
}`]
})

export class UserListComponent implements OnInit {
    currentUser: User;
    users: User[] = [];
    allusers: User[] = [];
    insertusers: User[] = [];
    loading: boolean = false;
    model: any = {};
    editModel: any = {};
    fileName: any = {};

    @ViewChild('myModal') myModal: ElementRef;
    @ViewChild('editModal') editModal: ElementRef;
    @ViewChild('importModal') importModal: ElementRef;

    constructor(private userService: UserService,
        private _fb: FormBuilder,
        private alertService: AlertService,
        private router: Router) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }

    ngOnInit() {
        this.loadAllUsers();
    }
    update(query: string) {
        this.users = this.allusers;
        this.users = this.users.filter(x => x.username.toLowerCase().indexOf(query.toLowerCase()) > -1);
    }

    editUser(i: number) {
        this.editModel = this.users[i];
        this.editModel.password = "";
    }
    remove(i: number) {
        this.loading = true;
        this.userService.delete(this.users[i].id).subscribe(
            res => { this.loadAllUsers() },
            error => {
                this.alertService.error(error._body);
                this.loading = false;
            }
        );
    }

    open(e: any) {
        this.fileName = e.target.files[0];
        console.log("NAME", this.fileName);
        if (!this.fileName) {
            return;
        }
    }

    import() {
        console.log("NAME", this.fileName);
        if (this.fileName != {}) {
            let text: any;
            var reader = new FileReader();
            reader.onload = file => {
                var contents: any = file.target;
                text = contents.result;
                this.extractData(text);
            };
            reader.readAsText(this.fileName);
            jQuery(this.importModal.nativeElement).modal('show');
        }
    }

    private extractData(data: any) { // Input csv data to the function

        let csvData = data;
        let allTextLines = csvData.split(/\r\n|\n/);
        let headers = allTextLines[0].split(';');
        this.insertusers = [];
        for (let i = 1; i < allTextLines.length; i++) {
            // split content based on comma
            let data = allTextLines[i].split(';');
            if (data.length == headers.length) {
                let tarr: User = new User();
                tarr.roleID = 4;

                for (let j = 0; j < headers.length; j++) {

                    switch (j) {
                        case 0:
                            tarr.name = data[j];
                            break;
                        case 1:
                            tarr.username = data[j];
                            break;
                        case 2:
                            tarr.email = data[j];
                            break;
                        case 3:
                            tarr.password = data[j];
                            break;
                        case 4:
                            tarr.roleID = +data[j];
                            break;

                        default:
                            break;
                    }
                }
                this.insertusers.push(tarr);
            }
        }
        console.log(this.insertusers); //The data in the form of 2 dimensional array.
        jQuery(this.importModal.nativeElement).modal('show');
    }

    saveImport() {
        this.userService.createMany(this.insertusers).subscribe(
            data => {
                this.loadAllUsers();
                jQuery(this.importModal.nativeElement).modal('hide');
                this.loading = false;
            },
            error => {
                jQuery(this.importModal.nativeElement).modal('hide');
                this.loading = false;
                this.alertService.error(error._body);
            });
    }

    private loadAllUsers() {
        this.userService.getAll().subscribe(users => { this.users = users; this.allusers = users; });
    }

    save() {
        let temp: User = {
            id: this.editModel.id,
            name: this.editModel.name,
            email: this.editModel.email,
            username: this.editModel.username,
            password: this.editModel.password,
            roleID: this.editModel.roleID
        }
        this.loading = true;
        this.userService.update(temp).subscribe(
            data => {
                this.alertService.success('Update successful', true);
                this.loadAllUsers();
                this.loading = false;
                jQuery(this.editModal.nativeElement).modal('hide');
            },
            error => {
                this.loading = false;
                this.alertService.error(error._body);
            }
        );
    }

    register() {
        this.loading = true;
        this.model.roleID = 4;
        this.userService.create(this.model)
            .subscribe(
            data => {
                this.alertService.success('Registration successful', true);
                this.loading = false;
                jQuery(this.myModal.nativeElement).modal('hide');
            },
            error => {
                this.alertService.error(error._body);
                this.loading = false;
            });

    }


}
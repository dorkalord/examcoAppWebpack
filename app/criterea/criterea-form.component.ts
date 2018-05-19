import { Component, OnInit, Input } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { Course } from '../_models/course';
import { CourseService } from '../_services/course.service';
import { GeneralCriterea, Advice, StateOfForm } from '../_models/criterea';
import { Grade } from '../_models/exam';
import { GradeService } from '../_services/grade.service';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { GeneralCritereaService } from '../_services/criterea.service';
declare var require: any;

@Component({
    selector: "criterea-form",
    templateUrl: 'criterea-form.component.html'

})
export class CritereaFormComponent implements OnInit {
    @Input('form')
    public critereaForm: FormGroup;

    //currentUser: User;
    public critereaList: GeneralCriterea[];
    public gradeList: Grade[];

    constructor(private userService: UserService,
        private gradeService: GradeService,
        private _fb: FormBuilder,
        private critereaService: GeneralCritereaService
    ) {
        //this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.critereaForm = this.critereaForm;
    }

    ngOnInit() {
        
    }

}
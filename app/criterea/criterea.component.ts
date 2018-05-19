import { Component, OnInit } from '@angular/core';

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
    selector: "criterea",
    templateUrl: 'criterea.component.html'

})
export class CritereaComponent implements OnInit {

    currentUser: User;
    public critereaList: GeneralCriterea[];
    public gradeList: Grade[];
    public critereaForm: FormGroup;
    public state: StateOfForm;


    constructor(private userService: UserService,
        private gradeService: GradeService,
        private _fb: FormBuilder,
        private critereaService: GeneralCritereaService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.critereaForm = this.initForm();
    }

    ngOnInit() {
        this.state = StateOfForm.Loading;
        this.critereaService.geAll().subscribe(data => {
            this.critereaList = data;
            this.state = StateOfForm.List;
        });
    }

    initForm() {
        return this._fb.group({
            name: ['', [Validators.required]],
            advices: this._fb.array([])
        });
    }

    initAdvice(a: Advice) {
        return this._fb.group({
            id: [a.id],
            grade: [a.grade],
            top: [a.top],
            text: [a.text, Validators.required]
        });
    }


    add() {
        this.state = StateOfForm.Loading;
        this.gradeService.getDefault().subscribe(data => {
            this.gradeList = data;
            this.critereaForm = this.initForm();

            const control = <FormArray>this.critereaForm.controls['advices'];

            this.gradeList.forEach(element => {
                control.push(this._fb.group({
                    grade: [element.name],
                    top: [element.top],
                    text: ["", Validators.required]
                }));
            });
            this.state = StateOfForm.Create;
        });
    }

    save() {
        if (this.state == StateOfForm.Create) {
            this.critereaService.create(this.critereaForm.value).subscribe(data => {
                this.state = StateOfForm.List;
                this.ngOnInit();
            });
        }

        if (this.state == StateOfForm.Edit) {
            this.critereaService.update(this.critereaForm.value).subscribe(data => {
                this.state = StateOfForm.List;
                 this.ngOnInit();
            });
        }


    }

    edit(id: number) {
        this.state = StateOfForm.Loading;
        this.critereaService.getById(id).subscribe(data => {

            this.critereaForm = this._fb.group({
                id: [data.id],
                name: [data.name, [Validators.required]],
                advices: this._fb.array([])
            });

            const control = <FormArray>this.critereaForm.controls['advices'];
            (<Advice[]>data.advices).forEach(ad => {
                control.push(this.initAdvice(ad));
            });
            this.state = StateOfForm.Edit;
        });
    }

    cancel() {
        this.state = StateOfForm.List;
    }

    remove(id: number) {

    }


}
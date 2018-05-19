import { Component, OnInit } from '@angular/core';

import { User, Topic, Course } from '../../_models/index';
import { UserService, CourseService, AuthenticationService } from '../../_services/index';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Question } from '../../_models/question';
import { StateService } from '../../_services/state.service';
import { StateOfForm, GeneralCriterea, Advice } from '../../_models/criterea';
import { State } from '../../_models/state';
import { Grade, ExamCriterea, Exam } from '../../_models/exam';
import { GradeService } from '../../_services/grade.service';
import { GeneralCritereaService } from '../../_services/criterea.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ExamService } from '../../_services/exam.service';
import { ExamDataTransferService } from '../../_services/exam-datatransfer.service';
declare var require: any;

@Component({
    selector: "exam-create",
    templateUrl: 'exam-create.component.html'

})

export class ExamCreateComponent implements OnInit {
    currentUser: User;
    public courses: Course[];
    public examForm: FormGroup;
    public critereaForm: FormGroup;
    public critereaCounter: number;
    public state: StateOfForm;
    public gradeList: Grade[];
    public loading: boolean;

    public generealCritereasAll: GeneralCriterea[];
    public generealCritereaListed: GeneralCriterea[];
    public selectedCritereas: number[];

    constructor(private userService: UserService,
        private courseService: CourseService,
        private stateService: StateService,
        private gradeService: GradeService,
        private examService: ExamService,
        private route: ActivatedRoute,
        private generalCritereaService: GeneralCritereaService,
        private router: Router,
        private _fb: FormBuilder,
        private dataTransfer: ExamDataTransferService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.examForm = this._fb.group({
            stateID: [1, Validators.required],
            status: ["", Validators.required],
            date: ["", Validators.required],
            courseID: [null, Validators.required],
            authorID: this.currentUser.id,
            language: ['', Validators.required],
            examCriterea: this._fb.array([]),
            qestions: this._fb.array([]),
            censorIDs: this._fb.array([])
        });
        this.state = StateOfForm.List;
        this.loading = false;
    }

    ngOnInit() {
        this.courseService.getAllCoursesOfUser(this.currentUser.id).subscribe(data => {
            this.stateService.getById(1).subscribe(res => {
                this.courses = data;
                this.critereaCounter = 0;
                this.examForm = this._fb.group({
                    stateID: [1, Validators.required],
                    status: [res.name, Validators.required],
                    date: ["2017-01-01T10:30", Validators.required],
                    courseID: [null, Validators.required],
                    authorID: this.currentUser.id,
                    language: ['', Validators.required],
                    examCriterea: this._fb.array([]),
                    qestions: this._fb.array([]),
                    censorIDs: this._fb.array([])
                });
            });
        });

    }

    addExamCriterea() {
        this.critereaCounter++;

        this.state = StateOfForm.Loading;
        let a = this._fb.group({
            //id: [this.critereaCounter],
            generalCritereaID: [],
            name: ['', Validators.required],
            advices: this._fb.array([])
        });

        this.gradeService.getDefault().subscribe(data => {
            let ad = <FormArray>a.controls['advices']

            this.gradeList = data;
            this.gradeList.forEach(element => {
                ad.push(this._fb.group({
                    grade: [element.name],
                    top: [element.top],
                    text: ["", Validators.required]
                }));
            });

            this.critereaForm = a;
            this.state = StateOfForm.Create;
        });
    }

    removeCriterea(i: number) {
        this.state = StateOfForm.List;
        const control = <FormArray>this.examForm.controls['examCriterea'];
        control.removeAt(i);
    }

    save() {
        const control = <FormArray>this.examForm.controls['examCriterea'];
        if (this.state == StateOfForm.Edit) {
            let templist: GeneralCriterea[] = control.value;
            control.removeAt(templist.findIndex(x => x.id = this.critereaForm.value.id));
        }
        control.push(this.critereaForm);
        this.state = StateOfForm.List;
    }

    cancel() {
        this.state = StateOfForm.List;
    }

    edit(i: number) {
        console.log(this.examForm.value.examCriterea[i]);
        let temp = this.examForm.value.examCriterea[i];

        let a = this._fb.group({
            //id: [temp.id],
            generalCritereaID: [temp.generalCritereaID],
            name: [temp.name, Validators.required],
            advices: this._fb.array([])
        });
        let ad = <FormArray>a.controls['advices']
        let advices: Advice[] = temp.advices;

        advices.forEach(element => {
            ad.push(this._fb.group({
                grade: [element.grade],
                top: [element.top],
                text: [element.text, Validators.required]
            }));
        });

        this.critereaForm = a;
        this.state = StateOfForm.Edit;
    }

    loadCriterea() {
        this.generalCritereaService.geAll().subscribe(res => {
            this.generealCritereasAll = res;

            let existingCriterea: ExamCriterea[] = this.examForm.value.examCriterea;

            existingCriterea.forEach(item => {
                if (item.generalCritereaID != null) {
                    this.generealCritereasAll.splice(
                        this.generealCritereasAll.findIndex(x => x.id == item.generalCritereaID), 1);
                }
            });

            this.generealCritereaListed = this.generealCritereasAll;

        });
    }

    searchCriterea(query: string) {
        this.generealCritereaListed = this.generealCritereasAll;
        this.generealCritereaListed = this.generealCritereaListed.filter(x => x.name.toLowerCase().indexOf(query.toLowerCase()) > -1);
    }

    addCriterea(i: number) {
        let id = this.generealCritereaListed[i].id;
        this.generealCritereasAll.splice(i, 1);

        this.generalCritereaService.getById(id).subscribe(res => {

            let temp: GeneralCriterea = res;
            this.critereaCounter++;
            let a = this._fb.group({
                //id: [this.critereaCounter],
                generalCritereaID: [temp.id],
                name: [temp.name, Validators.required],
                advices: this._fb.array([])
            });

            let ad = <FormArray>a.controls['advices']
            let advices: Advice[] = temp.advices;

            advices.forEach(element => {
                ad.push(this._fb.group({
                    grade: [element.grade],
                    top: [element.top],
                    text: [element.text, Validators.required]
                }));
            });

            const control = <FormArray>this.examForm.controls['examCriterea'];
            control.push(a);
        });
    }

    next() {
        this.loading = true;
        let temp: Exam;

        this.examService.create(this.examForm.value).subscribe(data => {
            temp = data.json();
            this.examService.createCriterea(temp.id, this.examForm.value.examCriterea).subscribe(res => {

                this.examService.getById(temp.id).subscribe(res1 => {
                    
                    this.dataTransfer.currentExam = res1;
                    
                    this.dataTransfer.currentCourse = res1.course;
                    this.dataTransfer.currentUser = this.currentUser;
                    this.router.navigateByUrl('/exam/create/' + temp.id + '/question');
                });
            });
        });
    }
}
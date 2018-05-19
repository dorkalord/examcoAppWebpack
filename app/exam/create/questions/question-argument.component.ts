import { Component, OnInit, Input } from '@angular/core';

import { User } from '../../../_models/index';
import { UserService, CourseService } from '../../../_services/index';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Course, Topic } from '../../../_models/course';
import { ExamService } from '../../../_services/exam.service';
import { Exam, ExamCriterea } from '../../../_models/exam';
import { Question, Argument, ArgumentCriterea } from '../../../_models/question';
declare var require: any;

@Component({
    selector: "question-argument",
    templateUrl: 'question-argument.component.html'

})

export class QestionArgumentComponent implements OnInit {
    @Input('group')
    public arguments: FormArray;

    @Input('exam')
    public currentExam: Exam;

    @Input('questionid')
    public questionID: number;

    currentUser: User;
    public argumentForm: FormGroup;
    public counter: number;
    //id: number;
    sub: any;

    constructor(private userService: UserService,
        private ExamService: ExamService,
        private _fb: FormBuilder,
        private route: ActivatedRoute) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        console.log(this.arguments);
        this.argumentForm = this._fb.group({
            id: this.counter,
            authorID: this.currentUser.id,
            parentArgumentID: null,
            questionID: this.questionID,

            text: ['', Validators.required],
            advice: [''],
            defaultWeight: [''],
            variable: [false, Validators.required],
            minMistakeText: [''],
            maxMistakeText: [''],
            minMistakeWeight: [0],
            maxMistakeWeight: [1000],

            argumentCritereas: this._fb.array([])
        });
    }

    ngOnInit() {
        this.counter = 1;
        this.argumentForm = this.initArgument();
    }

    initArgument() {
        return this._fb.group({
            id: this.counter,
            authorID: this.currentUser.id,
            parentArgumentID: null,
            questionID: this.questionID,

            text: ['', Validators.required],
            advice: [''],
            defaultWeight: [''],
            variable: [false, Validators.required],
            minMistakeText: [''],
            maxMistakeText: [''],
            minMistakeWeight: [0],
            maxMistakeWeight: [100],

            argumentCritereas: this._fb.array(this.initArgumentCriterea(this.counter))
        });
    }

    initArgumentCriterea(argumentid: number) {
        let ac = new Array();
        let c = 0;
        this.currentExam.examCriterea.forEach(element => {
            ac.push({
                id: this.counter * this.currentExam.examCriterea.length + c,
                argumentID: argumentid,
                examCritereaID: element.id,
                severity: 0
            });
            c++;
        });
        return ac;
    }

    addArgument() {
        this.counter = this.counter + 1;
        this.arguments.push(this.argumentForm);
        this.argumentForm = this.initArgument();
    }

    removeArgument(index: number) {
        let field: Argument[] = this.arguments.value;
        let deletingArgument = this.arguments.value[index];

        this.arguments.value.splice(index, 1);
        this.arguments.controls.splice(index, 1);

        let a = 0;
        field.forEach((element, a) => {
            if (element.parentArgumentID == deletingArgument.id) {
                element.parentArgumentID = null;
                this.arguments.controls[a].value.parentArgumentID = null;
            }
        });/**/

        if (this.argumentForm.value.parentArgumentID == deletingArgument.id)
            this.argumentForm.value.parentQestionID = null;

        this.copyArgument(this.argumentForm.value);
    }

    save(id: number) {
        let field: Argument[] = this.arguments.value;
        let index: number = field.findIndex(x => x.id == id);

        if (index === -1) {
            this.counter = this.counter + 1;
            this.arguments.push(this.argumentForm);
        }

        else {
            this.arguments.value[index] = this.argumentForm.value;
        }

        this.argumentForm = this.initArgument();

    }

    cancel() {
        this.argumentForm = this.initArgument();
    }

    edit(i: number) {
        let a: Argument = this.arguments.value[i];

        this.copyArgument(a);
    }

    private copyArgument(a: Argument) {
        this.argumentForm = this._fb.group({
            id: a.id,
            authorID: this.currentUser.id,
            parentArgumentID: a.parentArgumentID,
            questionID: a.questionID,

            text: [a.text, Validators.required],
            advice: [a.advice],
            defaultWeight: [a.defaultWeight],
            variable: [a.variable, Validators.required],
            minMistakeText: [a.minMistakeText],
            maxMistakeText: [a.maxMistakeText],
            minMistakeWeight: [a.minMistakeWeight],
            maxMistakeWeight: [a.maxMistakeWeight],

            argumentCritereas: this._fb.array(this.initArgumentCriterea(a.id))
        });

        let c = 0;
        (<ArgumentCriterea[]>this.argumentForm.value.argumentCritereas).forEach(element => {
            element.severity = a.argumentCritereas[c].severity; c++;
        });
    }

    updateCriterea(weight: number, critereaid: number) {
        if (weight > 0) weight = 0;
        let ac: ArgumentCriterea[] = this.argumentForm.value.argumentCritereas;
        let index: number = ac.findIndex(a => a.examCritereaID == critereaid);

        this.argumentForm.value.argumentCritereas[index].severity = weight;
        console.log("weight: ", weight, " criterea ID: ", critereaid);
    }

    changedDefaultWeight(e: any) {
        console.log("change default weight", e);
        if(+e.target.valueAsNumber > 0){
            this.argumentForm.value.defaultWeight = 0;
        }
        if(+e.target.valueAsNumber < -100){
            this.argumentForm.value.defaultWeight = -100;
        }
    }

}
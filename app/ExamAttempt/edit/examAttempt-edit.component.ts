import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { User } from '../../_models/index';
import { UserService } from '../../_services/index';
import { Course } from '../../_models/course';
import { ExamAttempt, Anwser, Mistake, GeneralCritereaImpact, Argument2, ExamAttempt2 } from '../../_models/examAttempt';
import { ExamAttemptService } from '../../_services/examAttempt.service';
import { ExamService } from '../../_services/exam.service';
import { ExamAttemptDataTransferService, critereaDisplay } from '../../_services/examAttempt-datatransfer.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Exam, ExamFull, Question2 } from '../../_models/exam';
import { Question, Argument } from '../../_models/question';
import { MistakeService } from '../../_services/mistake.service';
import { FormGroup, FormControl, FormBuilder, FormArray, Validators } from '@angular/forms';
import { GeneralCritereaImpactService } from '../../_services/generalCritereaImpact.service';
import { AnwserService } from '../../_services/anwser.service';
import { GeneralCriterea } from '../../_models/criterea';
import { AlertComponent } from '../../_directives/alert.component';
import { ArgumentService } from '../../_services/argument.service';

declare var jQuery: any;
declare var require: any;

@Component({
    selector: "examAttempt-edit",
    templateUrl: 'examAttempt-edit.component.html'

})

export class ExamAttemptEditComponent implements OnInit {
    currentUser: User;
    loading: boolean;
    currentExam: ExamFull;
    currentAttempt: ExamAttempt2;
    currentQuestion: Question2;
    currentQuestionIndex: number;
    questionDisplayList: Question2[];

    critereaDisplayList: critereaDisplay[];

    myForm: FormGroup;

    @ViewChild('createJustificationModal') createJustificationModal: ElementRef;
    public argumentForm: FormGroup;


    constructor(private userService: UserService,
        private examAttemptService: ExamAttemptService,
        private mistakeService: MistakeService,
        private generalCritereaImpactService: GeneralCritereaImpactService,
        private examService: ExamService,
        private anwserService: AnwserService,
        private argumentService: ArgumentService,
        private _fb: FormBuilder,
        private router: Router,
        private examAttemptDataTransferService: ExamAttemptDataTransferService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        let i: number;
        this.currentQuestionIndex = 0;
        this.questionDisplayList = [];
        this.critereaDisplayList = [];
        this.loading = true;

        this.currentExam = this.examAttemptDataTransferService.currentExam;
        this.currentAttempt = this.examAttemptDataTransferService.currentExamAttempt;
        console.log("big exam", this.currentExam);/**/

        //taking care of questions and their grouping
        this.currentExam.questions.forEach(element => {

            this.questionDisplayList.push({
                id: element.id, examID: element.examID, parentQuestionID: null,
                seqencialNumber: element.seqencialNumber, text: element.text, proposedWeight: element.proposedWeight, finalWeight: element.finalWeight,
                arguments: element.arguments, max: element.max,
                tags: [], childs: []
            });
        });

        this.currentQuestion = this.questionDisplayList[this.currentQuestionIndex];
        this.myForm = this.initAnwser(this.currentQuestion);
        this.updateStats(this.currentQuestionIndex);
    }

    ngOnInit() {
        this.argumentForm = this.initNewArgument();
    }

    initNewArgument() {
        return this._fb.group({
            
            authorID: this.currentUser.id,
            parentArgumentID: null,
            questionID: this.questionDisplayList[this.currentQuestionIndex].id,

            text: ['', Validators.required],
            advice: [''],
            defaultWeight: [''],
            variable: [false, Validators.required],
            minMistakeText: [''],
            maxMistakeText: [''],
            minMistakeWeight: [0],
            maxMistakeWeight: [100],

            argumentCritereas: this._fb.array(this.initArgumentCriterea(-1))
        });
    }

    initArgumentCriterea(argumentid: number) {
        let ac = new Array();
        let c = 0;
        this.currentExam.examCriterea.forEach(element => {
            ac.push({
                argumentID: argumentid,
                examCritereaID: element.id,
                severity: 0
            });
            c++;
        });
        return ac;
    }

    initAnwser(currentQuestion: Question2) {
        let a: Anwser = this.currentAttempt.anwsers.find(x => x.questionID === currentQuestion.id);
        this.critereaDisplayList = [];
        //general critereas of anwser
        this.currentExam.examCriterea.forEach(ec => {
            //general criterea adjustments of anwser
            let adj: GeneralCritereaImpact = this.currentAttempt.generalCritereaImpacts.find(x => x.examCritereaID === ec.id
                && x.anwserID == a.id && x.mistakeID == null);

            //general critereas of anwser
            let calc: number = 0;

            this.currentAttempt.generalCritereaImpacts.filter(x => x.examCritereaID === ec.id
                && x.anwserID == a.id && x.mistakeID != null).map(z => calc += z.weight);

            this.critereaDisplayList.push({
                name: ec.name, examCritereaID: ec.id, adjustment: adj.weight, calculated: calc, total: (adj.weight + calc)
            });
        });

        let temp = this._fb.group({
            id: [a.id],
            questionText: [currentQuestion.text],
            questionID: [currentQuestion.id],
            completion: [a.completion],
            total: [a.total],
            adjustment: [a.adjustment],
            note: [a.note],
            max: currentQuestion.max,

            arguments: this._fb.array(this.initArguments(currentQuestion.arguments, a)),
            mistakes: this._fb.array(a.mistakes)

        });

        console.log("current anwser", temp);
        return temp;
    }

    initArguments(args: Argument[], a: Anwser) {
        let arr: any[] = [];
        let temp: any, b: boolean = false, s: number, m: Mistake;
        console.log("aergs", args);

        args.forEach(element => {
            b = false;
            s = element.maxMistakeWeight / 2;
            m = a.mistakes.find(x => x.argumentID === element.id)
            if (m != null) {
                b = true;
                s = element.maxMistakeWeight - (m.adjustedWeight * element.maxMistakeWeight) / element.defaultWeight;
            }
            temp = this._fb.group({
                id: [element.id],
                authorID: [element.authorID],
                parentArgumentID: [element.parentArgumentID],
                questionID: [element.questionID],

                text: [element.text],
                advice: [element.advice],
                defaultWeight: [element.defaultWeight],
                variable: [element.variable],
                minMistakeText: [element.minMistakeText],
                maxMistakeText: [element.maxMistakeText],
                minMistakeWeight: [element.minMistakeWeight],
                maxMistakeWeight: [element.maxMistakeWeight],
                variableVal: [s],

                argumentCritereas: [element.argumentCritereas],
                apliesTo: [b]
            });

            arr.push(temp);
        });
        return arr;
    }

    moveTo(i: number) {

        this.anwserService.update(this.currentAttempt.anwsers[this.currentQuestionIndex]).subscribe(
            data => {
                this.generalCritereaImpactService.updateMany(this.currentAttempt.generalCritereaImpacts.filter(x => x.anwserID == this.currentAttempt.anwsers[this.currentQuestionIndex].id && x.mistakeID == null)).subscribe(
                    data => {
                        this.currentQuestionIndex = i;
                        this.currentQuestion = this.questionDisplayList[this.currentQuestionIndex];
                        this.critereaDisplayList = [];
                        this.myForm = this.initAnwser(this.currentQuestion);
                        this.updateStats(this.currentQuestionIndex);
                    },
                    err => { alert("Something failed" + err) }
                )
            },
            error => { alert("Something went wrong\n" + error) }
        );


    }

    save(i: number, notification: boolean = true) {
        this.anwserService.update(this.currentAttempt.anwsers[i]).subscribe(
            data => {
                this.generalCritereaImpactService.updateMany(this.currentAttempt.generalCritereaImpacts.filter(x => x.anwserID == this.currentAttempt.anwsers[i].id && x.mistakeID == null)).subscribe(
                    data => { if(notification) {alert("Changes saved"); } },
                    err => { alert("Something failed" + err.body) }
                )
            },
            error => { alert("Something went wrong\n" + error.body) }
        );
    }

    updateStats(anwserIndex?: number) {
        //calculate
        if (anwserIndex != undefined) {
            this.currentAttempt.anwsers[anwserIndex].total = this.currentExam.questions[anwserIndex].max;
            this.currentAttempt.anwsers[anwserIndex].mistakes.map(x => this.currentAttempt.anwsers[anwserIndex].total += x.adjustedWeight);
            this.currentAttempt.anwsers[anwserIndex].total += this.currentAttempt.anwsers[anwserIndex].adjustment;

            this.myForm.controls.total.setValue(this.currentAttempt.anwsers[anwserIndex].total);
        }

        this.currentAttempt.total = 0;
        this.currentAttempt.anwsers.map(x => this.currentAttempt.total += x.total);

        let sum: number = 0, index: number = 0;

        //calculate the criteras
        for (var i = 0; i < this.critereaDisplayList.length; i++) {
            sum = 0;
            var element = this.critereaDisplayList[i];

            this.currentAttempt.generalCritereaImpacts.map(y => {
                //console.log(y.anwserID, y, element)
                if (y.examCritereaID == element.examCritereaID && y.mistakeID != null && y.anwserID == this.currentAttempt.anwsers[anwserIndex].id)
                    sum += y.weight
            });

            // console.log("sum", sum, "element", element);
            this.critereaDisplayList[i].calculated = sum;
            this.critereaDisplayList[i].total = (this.critereaDisplayList[i].calculated + this.critereaDisplayList[i].adjustment);
        }
    }

    removeGeneralCritereaImpacts(id: number) {
        for (var i = this.currentAttempt.generalCritereaImpacts.length - 1; i >= 0; i--) {
            if (this.currentAttempt.generalCritereaImpacts[i].anwserID === id && this.currentAttempt.generalCritereaImpacts[i].mistakeID != null) {
                this.currentAttempt.generalCritereaImpacts.splice(i, 1);
            }
            else if (this.currentAttempt.generalCritereaImpacts[i].anwserID === id) {
                this.currentAttempt.generalCritereaImpacts[i].weight = 0;
            }
        }
    }

    changeCompletion(id: number, completion: string) {
        let i: number = this.currentAttempt.anwsers.findIndex(x => x.id === id);
        let a: Anwser = this.currentAttempt.anwsers[i];

        switch (completion) {
            case "Attempted":
                this.currentAttempt.anwsers[i].total = this.myForm.value.max;
                break;

            case "Correct":
                this.currentAttempt.anwsers[i].total = this.myForm.value.max;
                a.mistakes = [];
                this.removeGeneralCritereaImpacts(a.id);
                break;

            case "Blank":
                this.currentAttempt.anwsers[i].total = 0;
                a.mistakes = [];
                this.removeGeneralCritereaImpacts(a.id);
                break;

            default:
                break;
        }

        this.currentAttempt.anwsers[i].completion = completion;
        this.updateStats();
    }

    changeSlider(value: any, argID: number, questionID: number) {
        console.log("value", value, "argument", argID, "question", questionID);

        let argument = this.currentExam.questions.find(x => x.id === questionID).arguments.find(x => x.id === argID);
        let i = this.currentAttempt.anwsers.findIndex(x => x.questionID === questionID);
        let index = this.currentAttempt.anwsers[i].mistakes.findIndex(x => x.argumentID === argID);

        this.currentAttempt.anwsers[i].mistakes[index].adjustedWeight = Math.round(argument.defaultWeight * ((argument.maxMistakeWeight - value + argument.minMistakeWeight) / argument.maxMistakeWeight));
        console.log("argument.maxMistakeWeight", argument.maxMistakeWeight, "argument.minMistakeWeight", argument.minMistakeWeight, "adj", this.currentAttempt.anwsers[i].mistakes[index].adjustedWeight);

        this.updateStats(i);
    }

    /** Adds or removes the justification
     * @param value 
     * @param argID 
     * @param questionID 
     */
    changeArg(value: any, argID: number, questionID: number) {
        console.log("value", value, "argument", argID, "question", questionID);
        this.loading = true;
        let qindex = this.currentExam.questions.findIndex(x => x.id === questionID);
        let question = this.currentExam.questions[qindex];
        let argument = question.arguments.find(x => x.id === argID);
        let anwserIndex = this.currentAttempt.anwsers.findIndex(x => x.questionID === questionID);

        //new mistake
        if (value === true) {
            //create mistake
            let weight: number = argument.defaultWeight / (1 + +argument.variable);
            let newMistatake: Mistake = {
                id: argID * -1,
                adjustedWeight: weight,

                argumentID: argID,
                anwserID: this.currentAttempt.anwsers[anwserIndex].id,
                argument:null
            };
            this.currentAttempt.anwsers[anwserIndex].mistakes.push(newMistatake);

            let gc: any;
            argument.argumentCritereas.forEach(ac => {
                gc = {
                    anwserID: this.currentAttempt.anwsers[anwserIndex].id,
                    examAttemptID: this.currentAttempt.id,
                    examCritereaID: ac.examCritereaID,
                    mistakeID: argID * -1,
                    weight: ac.severity
                };
                this.currentAttempt.generalCritereaImpacts.push(gc);
            });/**/

            this.updateStats(qindex);
        }
        //remove mistake
        else {

            let m = this.currentAttempt.anwsers[anwserIndex].mistakes.find(x => x.argumentID === argID);
            let mi = this.currentAttempt.anwsers[anwserIndex].mistakes.findIndex(x => x.argumentID === argID);
            for (var i = this.currentAttempt.generalCritereaImpacts.length - 1; i >= 0; i--) {
                if (this.currentAttempt.generalCritereaImpacts[i].mistakeID === m.id) {
                    this.currentAttempt.generalCritereaImpacts.splice(i, 1);
                }
            }
            this.currentAttempt.anwsers[anwserIndex].mistakes.splice(mi, 1);

            this.updateStats(qindex);
        }

        console.log("current", this.currentAttempt);

    }

    impactChnaged(to: number, i: number) {
        console.log("change", to, i);
        if (this.critereaDisplayList[i].calculated + (+to) > 0) { to = this.critereaDisplayList[i].calculated * -1; }
        else if (+to > 100) { to = 100; }
        else if (+to < -100) { to = -100; }

        this.critereaDisplayList[i].adjustment = +to;

        this.critereaDisplayList[i].total = this.critereaDisplayList[i].calculated + this.critereaDisplayList[i].adjustment;

        let index = this.currentAttempt.generalCritereaImpacts.findIndex(g => g.mistakeID == null
            && g.examCritereaID == this.critereaDisplayList[i].examCritereaID && g.anwserID == this.myForm.value.id)
        this.currentAttempt.generalCritereaImpacts[index].weight = +to;
    }

    changedAdjustment(anwserID: number, e: any) {
        console.log("change adjustment", e);
        let i = this.currentAttempt.anwsers.findIndex(x => x.id === anwserID);
        let max = this.currentExam.questions.find(x => x.id == this.currentAttempt.anwsers[i].questionID).max;

        this.currentAttempt.anwsers[i].total = max;
        this.currentAttempt.anwsers[i].mistakes.map(x => this.currentAttempt.anwsers[i].total += x.adjustedWeight);
        if (+e.target.value + this.currentAttempt.anwsers[i].total > max) {
            this.currentAttempt.anwsers[i].adjustment = max - this.currentAttempt.anwsers[i].total;
            this.myForm.controls.adjustment.setValue(this.currentAttempt.anwsers[i].adjustment);
        }
        else if (+e.target.value > 100) { this.currentAttempt.anwsers[i].adjustment = 100; }
        else if (+e.target.value < -100) { this.currentAttempt.anwsers[i].adjustment = -100; }
        else {
            this.currentAttempt.anwsers[i].adjustment = +e.target.value;
        }
        this.myForm.value.adjustment = this.currentAttempt.anwsers[i].adjustment;
        this.updateStats(i);
    }

    changedNote(anwserID: number, e: any) {
        console.log("note change");
        let i = this.currentAttempt.anwsers.findIndex(x => x.id === anwserID);
        this.currentAttempt.anwsers[i].note = e.target.value;
        this.anwserService.update(this.currentAttempt.anwsers[i]).subscribe(data => {
            this.currentAttempt.anwsers[i] = data;
        });
    }

    createJustification() {
        this.argumentForm = this.initNewArgument();
        this.save(this.currentQuestionIndex, false);
        jQuery(this.createJustificationModal.nativeElement).modal('show');
    }

    saveJustification(){
        this.loading = true;
        this.argumentService.create(this.argumentForm.value).subscribe(
            data => {
                console.log("Added new justification\n");
                console.log( data );
                this.currentExam.questions[this.currentQuestionIndex].arguments.push(data);
                this.moveTo(this.currentQuestionIndex);
                jQuery(this.createJustificationModal.nativeElement).modal('hide');
                this.loading = false;
            },
            error => { alert("Something went wrong\n" + error.body) }
        );
    }

    cancelJustification(){
        jQuery(this.createJustificationModal.nativeElement).modal('hide');
        this.argumentForm = this.initNewArgument();
    }
}


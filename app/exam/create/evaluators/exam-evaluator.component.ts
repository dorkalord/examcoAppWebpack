import { Component, OnInit } from '@angular/core';

import { User } from '../../../_models/index';
import { UserService, CourseService } from '../../../_services/index';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, Topic } from '../../../_models/course';
import { ExamService } from '../../../_services/exam.service';
import { Exam } from '../../../_models/exam';
import { Question } from '../../../_models/question';
import { ExamDataTransferService } from '../../../_services/exam-datatransfer.service';
import { Censor } from '../../../_models/censor';
import { CensorService } from '../../../_services/censor.service';
declare var require: any; 

@Component({
    selector: "exam-evaluator",
    templateUrl: 'exam-evaluator.component.html'

})

export class ExamEvaluatorComponent implements OnInit {
    currentUser: User;
    currentExam: Exam;
    public users: User[];
    public allusers: User[];
    public evaluators: User[];
    public evaluatorForm: FormGroup;
    public counter: number;
    loading: boolean;

    constructor(private userService: UserService,
        private examService: ExamService,
        private censorService : CensorService,
        private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private dataTransfer: ExamDataTransferService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }

    ngOnInit() {
        this.currentExam = this.dataTransfer.currentExam;
        this.counter = 1;
        this.evaluators = [];
        this.userService.getAll().subscribe(data => {
            this.allusers = (<User[]>data).filter(x => x.roleID === 3 || x.roleID === 2);
            this.users = this.allusers;
        });
    }

    update(query: string) {
        this.users = this.allusers;
        this.users = this.users.filter(x => x.username.toLowerCase().indexOf(query.toLowerCase()) > -1);
    }

    addEvaluator(index: number) {
        this.evaluators.push(this.users[index]);
        this.users.splice(index, 1);
    }

    removeEvaluator(index: number) {
        this.users.push(this.evaluators[index]);
        this.evaluators.splice(index, 1);
    }

    save() {
        console.log("Evaluators", this.evaluators);
        let censors: Censor[] = new Array();
        this.evaluators.forEach(item => {
            censors.push({id:0, examID: this.currentExam.id, userID: item.id});
        });

        this.loading = true;
        this.censorService.createMany(censors).subscribe(data => {
            alert("Successfully created an exam");
            this.router.navigateByUrl('/exam/');
        });
    }
}
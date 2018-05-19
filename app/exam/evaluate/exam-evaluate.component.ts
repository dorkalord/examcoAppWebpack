import { Component, OnInit } from '@angular/core';

import { User } from '../../_models/index';
import { UserService, CourseService } from '../../_services/index';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Course, Topic } from '../../_models/course';
import { ExamService } from '../../_services/exam.service';
import { Exam, ExamCriterea } from '../../_models/exam';
import { Question } from '../../_models/question';
declare var require: any;

@Component({
    selector: "exam-evaluate",
    templateUrl: 'exam-evaluate.component.html'

})

export class ExamEvaluateComponent implements OnInit {
    currentUser: User;
    currentExam: Exam;
    public users: User[];
    public allusers: User[];
    public evaluators: User[];
    public evaluatorForm: FormGroup;
    public counter: number;
    id: number;
    sub: any;

    constructor(private userService: UserService,
        private examService: ExamService,
        private courseService: CourseService,
        private _fb: FormBuilder,
        private route: ActivatedRoute) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

    }

    ngOnInit() {
        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.examService.getById(this.id).subscribe(res => {
                this.currentExam = res;

                this.counter = 1;
                this.evaluators = [];
                this.userService.getAll().subscribe(data => {
                    this.allusers = (<User[]>data).filter(x => x.roleID === 3 || x.roleID === 2);
                    this.users = this.allusers;
                });
            });

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
}
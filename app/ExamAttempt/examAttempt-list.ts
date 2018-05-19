import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { Course } from '../_models/course';
import { CourseService } from '../_services/course.service';
import { ExamAttempt } from '../_models/examAttempt';
import { ExamAttemptService } from '../_services/examAttempt.service';
import { ExamService } from '../_services/exam.service';
import { ExamAttemptDataTransferService } from '../_services/examAttempt-datatransfer.service';
import { Router } from '@angular/router';
import { Exam, ExamFull } from '../_models/exam';

declare var jQuery: any;
declare var require: any;

@Component({
    selector: "examAttempt-list",
    templateUrl: 'examAttempt-list.html'

})

export class ExamAttemptListComponent implements OnInit {
    currentUser: User;
    loading: boolean;
    currentExam: ExamFull;
    examAttemptList: ExamAttempt[];
    users: User[] = [];
    allusers: User[] = [];

    @ViewChild('selectModal') selectModal: ElementRef;

    constructor(private userService: UserService,
        private examAttemptService: ExamAttemptService,
        private examService: ExamService,
        private router: Router,
        private examAttemptDataTransferService: ExamAttemptDataTransferService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.loading = false;
        this.examAttemptList = this.examAttemptDataTransferService.examAttempts;
        this.currentExam = this.examAttemptDataTransferService.currentExam;
    }

    ngOnInit() {
        this.loadAllUsers();
    }

    edit(attemptID: number) {
        this.loading = true;
        this.examService.getByIdForCensoring(this.currentExam.id).subscribe(data => {

            this.examAttemptDataTransferService.currentExam = data;
            this.examAttemptService.getById(attemptID).subscribe(res => {
                this.examAttemptDataTransferService.currentExamAttempt = res;
                jQuery(this.selectModal.nativeElement).modal('hide');
                this.router.navigateByUrl('/attempts/' + res.id + '/edit');
            });
        });
    }

    create(userID: number) {
        this.loading = true;
        let attempt: ExamAttempt = new ExamAttempt();
        console.log("attempt", this.examAttemptDataTransferService.currentExam);
        attempt.examID = this.examAttemptDataTransferService.currentExam.id;
        attempt.censorID = this.examAttemptDataTransferService.currentCensor.id;
        attempt.studentID = userID;

        console.log("attempt", attempt);
        this.examAttemptService.create(attempt).subscribe(data => {
            console.log("new attempt", data);
            this.edit(data.id);
        });
        console.log(attempt.censorshipDate);
    }

    remove(id: number) {
        this.examAttemptService.delete(id).subscribe(res =>{
            let i = this.examAttemptList.findIndex(x=>x.id == id);
            this.examAttemptList.splice(i,1);
            this.loadAllUsers();
        });
    }

    update(query: string) {
        this.users = this.allusers;
        this.users = this.users.filter(x => x.username.toLowerCase().indexOf(query.toLowerCase()) > -1);
    }

    private loadAllUsers() {
        this.userService.getStudents(this.currentExam.id).subscribe(users => { this.users = users; this.allusers = users; });
    }
}
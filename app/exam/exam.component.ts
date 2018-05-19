import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService } from '../_services/index';
import { ExamService } from '../_services/exam.service';
import { Exam } from '../_models/exam';
import { StateService } from '../_services/state.service';
import { State } from '../_models/state';
import { DatePipe } from '@angular/common';
import { ExamAttemptService } from '../_services/examAttempt.service';
import { ExamAttemptDataTransferService } from '../_services/examAttempt-datatransfer.service';
import { Router } from '@angular/router';
import { CensorService } from '../_services/censor.service';
import { ExportService } from '../_services/export.service';
import { ExamGradeDataTransferService } from '../_services/examGrade-datatransfer.service';
declare var require: any;

@Component({
    selector: "exam",
    templateUrl: 'exam.component.html'

})

export class ExamComponent implements OnInit {
    currentUser: User;
    examlist: Exam[];
    censorExams: Exam[];
    states: State[];
    loading: boolean;

    constructor(private userService: UserService,
        private examService: ExamService,
        private stateService: StateService,
        private censorService: CensorService,
        private examAttemptService: ExamAttemptService,
        private exportService: ExportService,
        private router: Router,
        private ExamAttemptDataTransferService: ExamAttemptDataTransferService,
        private ExamGradeDataTransferService: ExamGradeDataTransferService
    ) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
        this.examlist = new Array();
        this.censorExams = new Array();
        this.loading = false;
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.loading = true;
        this.examService.getAllExamsofAuthor(this.currentUser.id).subscribe(data => {
            this.examlist = data;
            this.stateService.getAllStates().subscribe(res => {
                this.states = res;
                this.examService.getAllExamsofCensor(this.currentUser.id).subscribe(res => {
                    this.censorExams = res;
                    this.loading = false;
                });
            });
        });
    }

    edit(id: number) {
        alert("Waiting for implentation")
    }

    chanegeState(id: number, state: number) {
        this.loading = true;
        this.examService.updateExamState(id, state).subscribe(data => {
            this.loadData();
        });
    }

    censor(examID: number) {
        this.loading = true;

        this.examService.getById(examID).subscribe(e => {
            this.ExamAttemptDataTransferService.currentExam = e;

            this.censorService.getByExamUser(examID, this.currentUser.id).subscribe(r => {
                this.ExamAttemptDataTransferService.currentCensor = r;

                this.examAttemptService.getByCensorExam(this.ExamAttemptDataTransferService.currentCensor.id, examID).subscribe(data => {
                    this.ExamAttemptDataTransferService.examAttempts = data;

                    this.router.navigateByUrl('/attempts/' + examID + '/censor/' + this.ExamAttemptDataTransferService.currentCensor.id);
                });
            });
        });
    }

    grade(examID: number) {
        this.loading = true;

        this.examService.getByIdForCensoring(examID).subscribe(e => {
            this.ExamGradeDataTransferService.currentExam = e;

                this.examAttemptService.getByExam(examID).subscribe(data => {
                    this.ExamGradeDataTransferService.examAttempts = data;

                    this.router.navigateByUrl('/grade/' + examID + '/edit');
                });
        });

        
    }
    generateReports(id: number) {
        alert("Gnereates student reports, allows to send via email")
    }
    exportCensorship(id: number) {
        this.exportService.getAttempts(id).subscribe(
            data => {
                let blob = new Blob([data.blob()], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                let url = window.URL.createObjectURL(blob);
                window.open(url);

            },
            error => alert("Error downloading file!"),
            () => console.log("OK!")
        );
    }
    export(id: number) {
        this.exportService.getExam(id).subscribe(
            data => {
                let blob = new Blob([data.blob()], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                let url = window.URL.createObjectURL(blob);
                window.open(url);

            },
            error => alert("Error downloading file!"),
            () => console.log("OK!")
        );
    }
}
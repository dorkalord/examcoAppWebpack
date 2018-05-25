import { Component, OnInit } from '@angular/core';

import { User } from '../_models/index';
import { UserService, AlertService } from '../_services/index';
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
import { ExamDataTransferService } from '../_services/exam-datatransfer.service';
import { ExamReportDataTransferService } from '../_services/examReport-datatransfer.service.';
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
        private ExamGradeDataTransferService: ExamGradeDataTransferService,
        private ExamReportDTS: ExamReportDataTransferService,
        private alertService: AlertService
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
                },
                error => { this.alertService.error("Error geting data."); this.loading = false; });
            },
            error => { this.alertService.error("Error geting data."); this.loading = false; });
        },
        error => { this.alertService.error("Error geting data."); this.loading = false; });
    }

    edit(id: number) {
        this.alertService.error("Waiting implementation");
    }

    chanegeState(id: number, state: number) {
        this.loading = true;
        this.examService.updateExamState(id, state).subscribe(data => {
            this.loadData();
        },
        error => { this.alertService.error("Error updating state!"); this.loading = false; });
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
                },
                error => { this.alertService.error("Error getting data."); this.loading = false; });
            },
            error => { this.alertService.error("Error getting data."); this.loading = false; });
        },
        error => { this.alertService.error("Error getting data."); this.loading = false; });
    }

    grade(examID: number) {
        this.loading = true;

        this.examService.getByIdForCensoring(examID).subscribe(e => {
            this.ExamGradeDataTransferService.currentExam = e;

                this.examAttemptService.getByExam(examID).subscribe(data => {
                    this.ExamGradeDataTransferService.examAttempts = data;

                    this.loading = false;
                    this.router.navigateByUrl('/grade/' + examID + '/edit');
                },
                error => { this.alertService.error("Error geting data."); this.loading = false; });
        },
        error => { this.alertService.error("Error geting data."); this.loading = false; });
    }
    
    generateReports(examID: number) {
        this.loading = true;

        this.examService.getByIdForCensoring(examID).subscribe(e => {
            this.ExamReportDTS.currentExam = e;

                this.examAttemptService.getByExam(examID).subscribe(data => {
                    this.ExamReportDTS.examAttempts = data;

                    this.userService.getAll().subscribe(usrs => {
                        let users:User[] = usrs;
                        this.ExamReportDTS.examAttempts.forEach(attempt => {

                            attempt.student = users.find(x=> x.id == attempt.studentID);

                            attempt.anwsers.forEach(anws => {
                                anws.question = this.ExamReportDTS.currentExam.questions.find(x=> x.id == anws.questionID);
                
                                anws.mistakes.forEach(mistake => {
                                    mistake.argument = anws.question.arguments.find(x=> x.id == mistake.argumentID);
                                });
                            });
                
                            attempt.examAdvices.forEach(advice => {
                                advice.examCriterea = this.ExamReportDTS.currentExam.examCriterea.find(x=> x.id == advice.examCritereaID);
                                advice.advice = advice.examCriterea.advices.find(x=> x.id == advice.adviceID);
                                
                            });
                        });
                        
                        this.loading = false;
                        this.router.navigateByUrl('exam/report/' + examID );
                    },
                    error => { this.alertService.error("Error geting data."); this.loading = false; });
                },
                error => { this.alertService.error("Error geting data."); this.loading = false; });
        },
        error => { this.alertService.error("Error geting data."); this.loading = false; });
    }

    exportCensorship(id: number) {
        this.alertService.error("Waiting implementation");
        
        /*this.loading = true;
        this.exportService.getAttempts(id).subscribe(
            data => {
                let blob = new Blob([data.blob()], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                let url = window.URL.createObjectURL(blob);
                window.open(url);
                this.loading = false;
            },
            error => { this.alertService.error("Error downloading file"); this.loading = false; },
            () => console.log("OK!")
        );/**/
    }
    export(id: number) {
        this.loading = true;
        this.exportService.getExam(id).subscribe(
            data => {
                let blob = new Blob([data.blob()], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
                let url = window.URL.createObjectURL(blob);
                window.open(url);
                this.loading = false;
            },
            error => { this.alertService.error("Error downloading file"); this.loading = false; },
            () => console.log("OK!")
        );
    }
}
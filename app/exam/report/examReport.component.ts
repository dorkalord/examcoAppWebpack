import { Component, OnInit } from '@angular/core';

import { User, Exam, ExamFull, Question2 } from '../../_models/index';
import { UserService } from '../../_services/index';
import { ExamGradeDataTransferService } from '../../_services/examGrade-datatransfer.service';
import { chartDef } from '../../_models/chart';
import { ExamAttempt, Anwser, ExamAttempt3 } from '../../_models/examAttempt';
import { ExamReportDataTransferService } from '../../_services/examReport-datatransfer.service.';
declare var require: any;

@Component({
	templateUrl: 'examReport.component.html'
})

export class ExamReportComponent implements OnInit {
	currentUser: User;
	users: User[] = [];

	public currentExam: ExamFull;
	public currentAttempt: ExamAttempt3;
	public currentAttemptIndex: number;

	constructor(private userService: UserService,
		private examReportDTS: ExamReportDataTransferService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.currentExam = this.examReportDTS.currentExam;
			this.moveTo(0);
	}

	ngOnInit() {

		//this.gradeChart.chartData[0].data = [2, 3, 4, 5, 6, 2, 2, 2, 2, 7];
	}

	moveTo(i: number){
		this.currentAttemptIndex = i;
		this.currentAttempt = this.examReportDTS.examAttempts[this.currentAttemptIndex];
	}

}
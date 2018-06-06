import { Component, OnInit } from '@angular/core';

import { User, Exam, ExamFull, Question2 } from '../../_models/index';
import { UserService } from '../../_services/index';
import { ExamGradeDataTransferService } from '../../_services/examGrade-datatransfer.service';
import { chartDef } from '../../_models/chart';
import { ExamAttempt, Anwser, ExamAttempt3, ExamAdvice } from '../../_models/examAttempt';
import { ExamReportDataTransferService } from '../../_services/examReport-datatransfer.service.';
declare var require: any;

@Component({
	templateUrl: 'printAllReport.component.html'
})

export class printALLReportComponent implements OnInit {
	currentUser: User;
	users: User[] = [];
	public seznam: number[] = [];

	constructor(private userService: UserService,
		public examReportDTS: ExamReportDataTransferService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		
	}

	ngOnInit() {
		let i = 0;
		console.log(this.seznam);
		this.examReportDTS.examAttempts.forEach(element => {
			this.seznam.push(i);
			i++;
		});

		console.log(this.examReportDTS);
		console.log(this.seznam);
	}

}
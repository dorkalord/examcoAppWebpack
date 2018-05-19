import { Component, OnInit } from '@angular/core';

import { User, Exam, ExamFull } from '../../_models/index';
import { UserService } from '../../_services/index';
import { ExamGradeDataTransferService } from '../../_services/examGrade-datatransfer.service';
import { chartDef } from '../../_models/chart';
declare var require: any;

@Component({
	templateUrl: 'examReport.component.html'
})

export class ExamReportComponent implements OnInit {
	currentUser: User;
	users: User[] = [];

	public currentExam: ExamFull;

	constructor(private userService: UserService,
		private examGradeDataTransferService: ExamGradeDataTransferService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
	}

	ngOnInit() {
		this.currentExam = this.examGradeDataTransferService.currentExam;

		//this.gradeChart.chartData[0].data = [2, 3, 4, 5, 6, 2, 2, 2, 2, 7];
	}

}
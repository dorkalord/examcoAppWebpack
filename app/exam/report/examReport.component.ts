import { Component, OnInit } from '@angular/core';

import { User, Exam, ExamFull, Question2 } from '../../_models/index';
import { UserService } from '../../_services/index';
import { ExamGradeDataTransferService } from '../../_services/examGrade-datatransfer.service';
import { chartDef } from '../../_models/chart';
import { ExamAttempt, Anwser, ExamAttempt3, ExamAdvice } from '../../_models/examAttempt';
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

	public gradeChart: any = {
		chartOptions: {
			scaleShowVerticalLines: false,
			responsive: true,
			title: {
				display: true,
				text: 'Grades',
				fontSize: 20
			},
			fill: false
		},
		chartLabels: [],
		chartType: 'radar',
		chartLegend: true,
		chartData: []
	};

	public allExamAdvices: ExamAdvice[] = [];

	constructor(private userService: UserService,
		private examReportDTS: ExamReportDataTransferService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.currentExam = this.examReportDTS.currentExam;
		this.gradeChart.chartData = [{ data: [], label: 'Your score' }];
		this.currentAttemptIndex = 0;

		this.examReportDTS.examAttempts.forEach(attempt => {
			attempt.examAdvices.forEach(adv => {
				this.allExamAdvices.push(adv);
			});
		});

		this.moveTo(0);

	}

	ngOnInit() {
		
	}

	moveTo(i: number) {
		this.currentAttemptIndex = i;
		this.currentAttempt = this.examReportDTS.examAttempts[this.currentAttemptIndex];

		this.gradeChart.chartLabels = [];
		this.gradeChart.chartData = [
			{ data: [], label: 'Your score', fill: false }, 
			{ data: [], label: 'Average', fill: false }, 
			{ data: [], label: 'Min', fill: false }, 
			{ data: [], label: 'Max', fill: false }];
		
		this.currentAttempt.examAdvices.forEach(advice => {
			this.gradeChart.chartLabels.push(advice.examCriterea.name);
			this.gradeChart.chartData[0].data.push(advice.total);

			this.gradeChart.chartData[1].data.push(
				this.allExamAdvices.filter(x => x.examCritereaID == advice.examCritereaID).
					reduce((a, b) => a + b.total, 0) / this.currentAttempt.examAdvices.length);

			this.gradeChart.chartData[2].data.push(
				this.allExamAdvices.filter(x => x.examCritereaID == advice.examCritereaID).
					reduce((min, p) => p.total < min ? p.total : min, 0));
			this.gradeChart.chartData[3].data.push(
				this.allExamAdvices.filter(x => x.examCritereaID == advice.examCritereaID).
					reduce((max, p) => p.total > max ? p.total : max, 0));
		});

	}

}
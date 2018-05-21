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
		this.currentAttemptIndex = 0
		this.currentExam = this.examReportDTS.currentExam;
		this.currentAttempt = this.examReportDTS.examAttempts[this.currentAttemptIndex];

		this.examReportDTS.examAttempts.forEach(attempt => {
			attempt.anwsers.forEach(anws => {
				anws.question = this.currentExam.questions.find(x=> x.id == anws.questionID);

				anws.mistakes.forEach(mistake => {
					mistake.argument = anws.question.arguments.find(x=> x.id == mistake.argumentID);
				});
			});

			attempt.examAdvices.forEach(advice => {
				advice.examCriterea = this.currentExam.examCriterea.find(x=> x.id == advice.examCritereaID);
				advice.advice = advice.examCriterea.advices.find(x=> x.id == advice.adviceID);
				
			});
		});


	}

	ngOnInit() {

		//this.gradeChart.chartData[0].data = [2, 3, 4, 5, 6, 2, 2, 2, 2, 7];
	}

	moveTo(i: number){
		this.currentAttemptIndex = i;
		this.currentAttempt = this.examReportDTS.examAttempts[this.currentAttemptIndex];
	}

}
import { Component, OnInit } from '@angular/core';

import { User, Exam, ExamFull, Question2 } from '../../_models/index';
import { UserService } from '../../_services/index';
import { ExamGradeDataTransferService } from '../../_services/examGrade-datatransfer.service';
import { chartDef } from '../../_models/chart';
import { ExamAttempt, Anwser, ExamAttempt3, ExamAdvice } from '../../_models/examAttempt';
import { ExamReportDataTransferService } from '../../_services/examReport-datatransfer.service.';
declare var require: any;

@Component({
	templateUrl: 'printReport.component.html'
})

export class printReportComponent implements OnInit {
	currentUser: User;
	users: User[] = [];

	public currentExam: ExamFull;
	public currentAttempt: ExamAttempt3;
	public currentAttemptIndex: number;

	public gradeRadarChart: any = {
		chartOptions: {
			scaleShowVerticalLines: false,
			responsive: true,
			title: {
				display: true,
				text: 'Ocene',
				fontSize: 20
			},
			fill: false,
		},
		chartLabels: [],
		chartType: 'radar',
		chartLegend: true,
		chartData: []
	};

	public graph = {
		data: [
			{
				x: [0, 1, 1, 2, 3, 5, 8, 13, 21],
				type: 'box',
				name: 'Porazdelitev ocen'
			},
			{
				x: [0],
				type: 'scater',
				name: 'Vaša ocena',
				marker: { size: 20 }
			}
		],
		font: { size: 16 },
		layout: { title: 'Primerjava vače ocene s sošolci' }
	};

	public graphs: any = [];

	public allExamAdvices: ExamAdvice[] = [];

	constructor(private userService: UserService,
		private examReportDTS: ExamReportDataTransferService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.currentExam = this.examReportDTS.currentExam;
		this.gradeRadarChart.chartData = [{ data: [], label: 'Your score' }];
		this.currentAttemptIndex = 0;

		this.graph.data[0].x = [];

		this.examReportDTS.examAttempts.forEach(attempt => {
			attempt.examAdvices.forEach(adv => {
				this.allExamAdvices.push(adv);
			});

			this.graph.data[0].x.push(attempt.finalTotal);
		});

		this.moveTo(0);
	}

	ngOnInit() {

	}

	moveTo(i: number) {
		this.currentAttemptIndex = i;
		this.currentAttempt = this.examReportDTS.examAttempts[this.currentAttemptIndex];

		this.graph.data[1].x = [];
		this.graph.data[1].x.push(this.currentAttempt.finalTotal);

		this.graphs = [];
		this.currentAttempt.anwsers.forEach(a => {
			let tempGraph = {
				data: [
					{
						x: [0],
						y: a.question.text,
						type: 'box',
						name: 'Porazdelitev ocen'
					},
					{
						x: [0],
						y: a.question.text,
						type: 'scater',
						name: 'Vaša ocena',
						marker: { size: 20 }
					}
				],
				layout: {
					height: 280, 
					xaxis: {
						title: 'Ocene [%]'
					},
				}
			};
			tempGraph.data[1].x = [];
			tempGraph.data[1].x.push(a.finalTotal);
			tempGraph.data[0].x = [];
			this.examReportDTS.examAttempts.forEach(att => {
				tempGraph.data[0].x.push(att.anwsers.find(x => x.questionID == a.questionID).finalTotal);
			})

			this.graphs.push(tempGraph);
		})

		this.gradeRadarChart.chartLabels = [];
		this.gradeRadarChart.chartData = [
			{ data: [], label: 'Your score', fill: false },
			{ data: [], label: 'Average', fill: false },
			{ data: [], label: 'Min', fill: false },
			{ data: [], label: 'Max', fill: false }];

		this.currentAttempt.examAdvices.forEach(advice => {
			this.gradeRadarChart.chartLabels.push(advice.examCriterea.name);
			this.gradeRadarChart.chartData[0].data.push(advice.total);

			this.gradeRadarChart.chartData[1].data.push(
				this.allExamAdvices.filter(x => x.examCritereaID == advice.examCritereaID).
					reduce((a, b) => a + b.total, 0) / this.currentAttempt.examAdvices.length);

			this.gradeRadarChart.chartData[2].data.push(
				this.allExamAdvices.filter(x => x.examCritereaID == advice.examCritereaID).
					reduce((min, p) => p.total < min ? p.total : min, 0));
			this.gradeRadarChart.chartData[3].data.push(
				this.allExamAdvices.filter(x => x.examCritereaID == advice.examCritereaID).
					reduce((max, p) => p.total > max ? p.total : max, 0));
		});

	}

}
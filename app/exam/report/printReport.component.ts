import { Component, OnInit, Input } from '@angular/core';

import { User, Exam, ExamFull, Question2 } from '../../_models/index';
import { UserService } from '../../_services/index';
import { ExamGradeDataTransferService } from '../../_services/examGrade-datatransfer.service';
import { chartDef } from '../../_models/chart';
import { ExamAttempt, Anwser, ExamAttempt3, ExamAdvice } from '../../_models/examAttempt';
import { ExamReportDataTransferService } from '../../_services/examReport-datatransfer.service.';
declare var require: any;

@Component({
	selector: 'print-report',
	templateUrl: 'printReport.component.html'
})

export class printReportComponent implements OnInit {
	@Input('zaporedje') public podatki: number;
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
				boxpoints: 'all',
				jitter: 0.3,
				pointpos: -1.8,
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
		layout: {
			title: 'Primerjava vaše ocene s sošolci',
			showlegend: true,
			legend: { "orientation": "h"
			 },
			 autosize: false,
			 width: 786,
			 height: 300
		}
	};

	public graphs: any = [];

	public allExamAdvices: ExamAdvice[] = [];

	constructor(private userService: UserService,
		private examReportDTS: ExamReportDataTransferService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		this.currentExam = this.examReportDTS.currentExam;
		this.gradeRadarChart.chartData = [{ data: [], label: 'Uspešnost po kategorijah v primerjavi z drugimi' }];


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
		this.currentAttemptIndex = this.podatki;

		console.log("podatki");
		console.log(this.podatki);
		this.moveTo(this.currentAttemptIndex);

	}

	moveTo(i: number) {
		this.currentAttemptIndex = i;
		this.currentAttempt = this.examReportDTS.examAttempts[this.currentAttemptIndex];

		this.graph.data[1].x = [];
		this.graph.data[1].x.push(this.currentAttempt.finalTotal);

		/*this.graphs = [];
		this.currentAttempt.anwsers.forEach(a => {
			let tempGraph = {
				data: [
					{
						x: [0],
						y: a.question.text,
						type: 'box',
						name: 'Porazdelitev ocen',
						marker: { color: 'rgba(44, 160, 101, 0.5)'}
					},
					{
						x: [0],
						y: a.question.text,
						type: 'scater',
						name: 'Vaša ocena',
						marker: { size: 20, color: 'rgb(255, 144, 14)'}
					}
				],
				layout: {
					height: 270,
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
		});*/

		this.gradeRadarChart.chartLabels = [];
		this.gradeRadarChart.chartData = [
			{
				data: [], label: 'Vi', fill: false,
				borderColor: "rgba(0, 0, 0,1)",
				backgroundColor: "rgba(0, 0, 0,1)",
				borderWidth: 5,
				radius: 10,
				pointRadius: 10,
				pointBorderWidth: 10,
				pointHoverRadius: 10,
				pointStyle: 'cross'
			},
			{ data: [], label: 'Povprečje', fill: false },
		];

		this.currentAttempt.examAdvices.forEach(advice => {
			this.gradeRadarChart.chartLabels.push(advice.examCriterea.name);
			this.gradeRadarChart.chartData[0].data.push(advice.total);



			this.gradeRadarChart.chartData[1].data.push(
				this.allExamAdvices.filter(x => x.examCritereaID == advice.examCritereaID).
					reduce((a, b) => a + b.total / this.currentAttempt.examAdvices.length, 0) );
		});
		this.gradeRadarChart.chartData[0].pointBorderColor = "rgba(0,0,0,1)";

	}

}
import { Component, OnInit } from '@angular/core';

import { User, Exam, ExamFull, Question, Question2 } from '../../_models/index';
import { UserService } from '../../_services/index';
import { ExamGradeDataTransferService } from '../../_services/examGrade-datatransfer.service';
import { chartDef, ChartData } from '../../_models/chart';
import { critereaDisplay } from '../../_services/examAttempt-datatransfer.service';
import { Anwser } from '../../_models/examAttempt';
declare var require: any;

@Component({
	templateUrl: 'examGrade.component.html'
})

export class ExamGradeComponent implements OnInit {
	currentUser: User;
	users: User[] = [];

	public gradeChart: chartDef = {
		chartOptions: {
			scaleShowVerticalLines: false,
			responsive: true,
			title: {
				display: true,
				text: 'Grades',
				fontSize: 20
			}
		},
		chartLabels: [],
		chartType: 'bar',
		chartLegend: true,
		chartData: []
	};
	public gradesByQuestionChart: chartDef = {
		chartOptions: {
			scaleShowVerticalLines: false,
			responsive: true,
			title: {
				display: true,
				text: 'Grades by questions',
				fontSize: 20
			}
		},
		chartLabels: [],
		chartType: 'bar',
		chartLegend: true,
		chartData: []
	};
	public problemsByQuestionChart: chartDef = {
		chartOptions: {
			scaleShowVerticalLines: false,
			responsive: true,
			title: {
				display: true,
				text: 'Problems in questions',
				fontSize: 20
			}
		},
		chartLabels: [],
		chartType: 'bar',
		chartLegend: true,
		chartData: []
	};
	public mistakesByQuestionChart: chartDef = {
		chartOptions: {
			scaleShowVerticalLines: false,
			responsive: true,
			title: {
				display: true,
				text: 'Mistakes in questions',
				fontSize: 20
			},
			scales: {
				xAxes: [{
					stacked: true
				}],
				yAxes: [{
					stacked: true
				}]
			},
			legend: {
				position: 'bottom'
			}
		},
		chartLabels: [],
		chartType: 'bar',
		chartLegend: true,
		chartData: []
	};

	public currentCriteria: any;
	public showIndepth: boolean = false;
	public dimensionChart: chartDef = {
		chartOptions: {
			scaleShowVerticalLines: false,
			responsive: true,
			title: {
				display: true,
				text: 'Success in dimension',
				fontSize: 20
			}
		},
		chartLabels: [],
		chartType: 'bar',
		chartLegend: true,
		chartData: []
	};

	public currentExam: ExamFull;
	public sumProposedQuestionWeights: number = 0;
	public sumFinalQuestionWeights: number = 0;

	constructor(private userService: UserService,
		private examGradeDTS: ExamGradeDataTransferService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		//this.currentExam.examCriterea[i].advices
		this.currentExam = this.examGradeDTS.currentExam;
		this.currentCriteria = this.currentExam.examCriterea[0];
		this.gradeChart.chartLabels = [];
		this.gradeChart.chartData = [{ data: [], label: 'Number of achivers' }];
		this.gradesByQuestionChart.chartLabels = [];
		this.gradesByQuestionChart.chartData = [{ data: [], label: 'Number of achivers' }];
		this.mistakesByQuestionChart.chartLabels = [];
		this.mistakesByQuestionChart.chartData = [{ data: [], label: 'Number of achivers' }];
		this.problemsByQuestionChart.chartLabels = [];
		this.problemsByQuestionChart.chartData = [{ data: [], label: 'Number of achivers' }];
		this.dimensionChart.chartLabels = [];
		this.dimensionChart.chartData = [{ data: [], label: 'Number of achivers' }];
	}

	ngOnInit() {
		this.currentExam = this.examGradeDTS.currentExam;
		this.currentCriteria = this.currentExam.examCriterea[0];

		this.currentExam = this.examGradeDTS.currentExam;
		this.currentCriteria = this.currentExam.examCriterea[0];
		this.gradeChart.chartLabels = [];
		this.gradeChart.chartData = [{ data: [], label: 'Number of achivers' }];
		this.gradesByQuestionChart.chartLabels = [];
		this.gradesByQuestionChart.chartData = [{ data: [], label: 'Number of achivers' }];
		this.mistakesByQuestionChart.chartLabels = [];
		this.mistakesByQuestionChart.chartData = [{ data: [], label: 'Number of achivers' }];
		this.problemsByQuestionChart.chartLabels = [];
		this.problemsByQuestionChart.chartData = [{ data: [], label: 'Number of achivers' }];
		this.dimensionChart.chartLabels = [];
		this.dimensionChart.chartData = [{ data: [], label: 'Number of achivers' }];

		this.gradeChart.chartLabels = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
		this.gradeChart.chartData = [
			{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Proposed grades' },
			{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Final grades' }
		];

		this.calculateProposed();
		this.calculateCriteraPoints(this.currentCriteria.id);
	}

	saveFinal() {
		let examTotal: number = 0;

		this.currentExam.questions.forEach(x => examTotal += x.finalWeight);

		this.examGradeDTS.examAttempts.forEach(attempt => {
			attempt.finalTotal = 0;
			attempt.anwsers.forEach(anws => {
				anws.finalTotal = anws.total * this.currentExam.questions.find(x => x.id == anws.questionID).finalWeight / examTotal;
				attempt.finalTotal += anws.finalTotal;
			});
		});

		this.calculateFinal();
		//need to push
	}

	calculateProposed() {
		//grades distribution
		this.calculateTotals();

		let ocene: number[] = [];
		for (let i = 0; i < 10; i++) {
			ocene.push(0);
		}

		this.examGradeDTS.examAttempts.forEach(attempt => {
			let ocena: number = 0.0;
			let max: number = 0.0;

			attempt.anwsers.forEach(anwser => {
				let question: Question2 = this.currentExam.questions[this.currentExam.questions.findIndex(x => x.id == anwser.questionID)];
				ocena += anwser.total * question.proposedWeight / 100;
				max += question.proposedWeight / 100;
			});

			let i: number = 10 - (ocena / max / 10);
			ocene[Math.floor(i)] += 1;
		});
		//copying the results
		for (let i = 0; i < 9; i++) {
			this.gradeChart.chartData[0].data[i] = ocene[i];
		}
		this.gradeChart.chartData = [this.gradeChart.chartData[0], this.gradeChart.chartData[1]];

		//question grades
		let ql: string[] = [];
		let qd1: ChartData[] = [];

		for (let i = 0; i < this.currentExam.questions.length; i++) {
			ql.push("Q" + (i + 1));
		}

		//Sets grades
		for (let i = 10; i >= 5; i--) {
			qd1.push({ label: "", data: [] });

			qd1[qd1.length - 1].label = i.toString();

			for (let i = 0; i < this.currentExam.questions.length; i++) {
				qd1[qd1.length - 1].data.push(0);
			}
		}

		this.examGradeDTS.examAttempts.forEach(attempt => {
			let ocena: number = 0.0;
			let max: number = 0.0;
			let qi: number = 0;

			attempt.anwsers.forEach(anwser => {
				let question: Question2 = this.currentExam.questions[this.currentExam.questions.findIndex(x => x.id == anwser.questionID)];
				ocena = anwser.total * question.proposedWeight / 100;
				max = question.proposedWeight / 100;

				let i: number = 10 - (ocena / max / 10);
				i = (i < 5) ? i: 5;
				console.log(anwser);
				qd1[Math.floor(i)].data[qi]++;
				qi++;

			});
		});

		this.gradesByQuestionChart.chartLabels = ql;
		this.gradesByQuestionChart.chartData = qd1;

		this.calcQuestions(ql);
	}

	calcQuestions(questionLabels: string[]) {
		//calculation of crtieria
		let qd: ChartData[] = [];
		let criterea: any = [];

		this.currentExam.examCriterea.forEach(crit => {
			qd.push({ label: "", data: [] });

			qd[qd.length - 1].label = crit.name;

			for (let i = 0; i < questionLabels.length; i++) {
				qd[qd.length - 1].data.push(0);
			}
		});

		this.examGradeDTS.examAttempts.forEach(attempt => {
			let qi: number = 0; //question index
			attempt.anwsers.forEach(anw => { //for each anwser check the mistakes and their impact on the grade
				anw.mistakes.forEach(mis => {
					attempt.generalCritereaImpacts.filter(x => x.mistakeID == mis.id && x.weight != 0).forEach(miscrit => {
						let n = this.currentExam.examCriterea.findIndex(c => c.id == miscrit.examCritereaID);
						let m = this.currentExam.questions.findIndex(q => q.id == anw.questionID);
						qd[n].data[m] += (miscrit.weight / this.examGradeDTS.examAttempts.length);
					});
				});
			});
		});

		this.problemsByQuestionChart.chartLabels = questionLabels;
		this.problemsByQuestionChart.chartData = qd;

		//calculation of mistakes in a question
		qd = [];

		this.currentExam.questions.forEach(quest => {

			quest.arguments.forEach(arg => {
				qd.push({ label: "", data: [] });

				qd[qd.length - 1].label = arg.text;

				for (let i = 0; i < questionLabels.length; i++) {
					qd[qd.length - 1].data.push(0);
				}
			})
		});

		this.examGradeDTS.examAttempts.forEach(attempt => {
			let qi: number = 0; //question index

			attempt.anwsers.forEach(anw => { //for each anwser check the mistakes and their impact on the grade
				anw.mistakes.forEach(mis => {
					let m = this.currentExam.questions.findIndex(q => q.id == anw.questionID);
					let n = this.currentExam.questions[m].arguments.findIndex(x => x.id == mis.argumentID);
					qd[n].data[m]++;
				});
			});
		});

		this.mistakesByQuestionChart.chartLabels = questionLabels;
		this.mistakesByQuestionChart.chartData = qd;
	}

	calculateFinal() {
		this.calculateTotals();
		//grades distribution
		let ocene: number[] = [];
		for (let i = 0; i < 10; i++) {
			ocene.push(0);
		}

		this.examGradeDTS.examAttempts.forEach(attempt => {
			let ocena: number = 0.0;
			let max: number = 0.0;

			attempt.anwsers.forEach(anwser => {
				let question: Question2 = this.currentExam.questions[this.currentExam.questions.findIndex(x => x.id == anwser.questionID)];
				ocena += anwser.total * question.finalWeight / 100;
				max += question.finalWeight / 100;
			});

			let i: number = 10 - (ocena / max / 10);
			ocene[Math.floor(i)] += 1;
		});
		//copying the results
		for (let i = 0; i < 9; i++) {
			this.gradeChart.chartData[1].data[i] = ocene[i];
		}
		this.gradeChart.chartData = [this.gradeChart.chartData[0], this.gradeChart.chartData[1]];

		//question grades
		let ql: string[] = [];
		let qd1: ChartData[] = [];

		for (let i = 0; i < this.currentExam.questions.length; i++) {
			ql.push("Q" + (i + 1));
		}

		//Sets grades
		for (let i = 10; i >= 5; i--) {
			qd1.push({ label: "", data: [] });

			qd1[qd1.length - 1].label = i.toString();

			for (let i = 0; i < this.currentExam.questions.length; i++) {
				qd1[qd1.length - 1].data.push(0);
			}
		}

		this.examGradeDTS.examAttempts.forEach(attempt => {
			let ocena: number = 0.0;
			let max: number = 0.0;
			let qi: number = 0;

			attempt.anwsers.forEach(anwser => {
				let question: Question2 = this.currentExam.questions[this.currentExam.questions.findIndex(x => x.id == anwser.questionID)];
				ocena = anwser.total * question.finalWeight / 100;
				max = question.finalWeight / 100;

				let i: number = 10 - (ocena / max / 10);
				i = (i < 5) ? i: 5;
				console.log("i " + i);
				qd1[Math.floor(i)].data[qi]++;
				qi++;

			});
		});

		this.gradesByQuestionChart.chartLabels = ql;
		this.gradesByQuestionChart.chartData = qd1;
	}

	calculateTotals() {
		this.sumProposedQuestionWeights = this.currentExam.questions.reduce((a, b) => a + b.proposedWeight, 0);
		this.sumFinalQuestionWeights = this.currentExam.questions.reduce((a, b) => a + b.finalWeight, 0);
	}

	calculateCriteraPoints(critereaID: number = 1) {
		let points: number[] = [];
		let critereaIndex: number = this.currentExam.examCriterea.findIndex(x => x.id == critereaID);
		this.dimensionChart.chartLabels = [];
		this.dimensionChart.chartData = [{ data: [], label: 'Number of achivers' }];

		this.examGradeDTS.examAttempts.forEach(attempt => {
			points.push(
				attempt.generalCritereaImpacts.
					filter(x => x.examCritereaID == critereaID).
					reduce((a, b) => a + b.weight, 0));
		});

		let min: number = points.reduce((min, p) => p < min ? p : min, points[0]);
		let max: number = points.reduce((max, p) => p > max ? p : max, points[0]);
		let delta: number = max - min / points.length;

		console.log("points");
		console.log(points);

		console.log("min: " + min + "  max: " + max);

		this.currentExam.examCriterea[critereaIndex].advices.forEach((element, index) => {
			this.dimensionChart.chartLabels.push(element.grade);
			this.dimensionChart.chartData[0].data.push(Math.ceil(Math.random() * 10));

			element.max = 0;
			element.min = 0;

			element.max = Math.round(max - delta * index);
			element.min = Math.round(max - delta * (index + 1));
		});


	}

	analyseDimension(index: number) {
		this.showIndepth = true;
		this.currentCriteria = this.currentExam.examCriterea[index];
	}

	cancelCriteriaEdit() {
		this.showIndepth = false;
	}
}
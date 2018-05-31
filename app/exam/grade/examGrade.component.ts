import { Component, OnInit, ElementRef } from '@angular/core';

import { User, Exam, ExamFull, Question, Question2 } from '../../_models/index';
import { UserService, ExamService, AlertService } from '../../_services/index';
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
	public loading: boolean = false;

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

	public sliderCfg: any;
	public sliderData: number[];

	public currentExam: ExamFull;
	public sumProposedQuestionWeights: number = 0;
	public sumFinalQuestionWeights: number = 0;

	constructor(private userService: UserService,
		private examGradeDTS: ExamGradeDataTransferService,
		private examService: ExamService,
		private elRef: ElementRef,
		private alertService: AlertService) {
		this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
		//this.currentExam.examCriterea[i].advices
		this.currentExam = this.examGradeDTS.currentExam;
		this.currentCriteria = this.currentExam.examCriterea[0];
		this.gradeChart.chartLabels = [];
		this.gradeChart.chartData = [{ data: [], label: 'Number of achivers' }];

		this.sliderData = [0];
		this.sliderCfg = {
			behaviour: 'tap',
			connect: false,
			step: 1,
			margin: 1,
			tooltips: true,
			range: {
				min: 0,
				max: 20
			},
			direction: 'rtl',
			pips: {
				mode: 'steps',
				density: 2,
				values: 10,
				stepped: true
			}
		};
	}

	ngOnInit() {

		this.gradeChart.chartLabels = ['10', '9', '8', '7', '6', '5', '4', '3', '2', '1'];
		this.gradeChart.chartData = [
			{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Proposed grades' },
			{ data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0], label: 'Final grades' }
		];

		this.calculateProposed();

		this.currentExam.examCriterea.forEach(element => {
			this.calculateCriteraPoints(element.id);
		});
	}

	color() {
		let classes = ['c-1-color', 'c-2-color', 'c-3-color', 'c-4-color', 'c-5-color', 'c-6-color'];

		var connect = this.elRef.nativeElement.querySelectorAll('.noUi-connect');
		for (var i = 0; i < connect.length; i++) {
			connect[i].classList.add(classes[i]);
		}

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
				ocena += anwser.total * question.proposedWeight / this.sumProposedQuestionWeights;
				max += question.proposedWeight / this.sumProposedQuestionWeights;
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
				ocena = anwser.total * question.proposedWeight / this.sumProposedQuestionWeights;
				max = question.proposedWeight / this.sumProposedQuestionWeights;

				let i: number = 10 - (ocena / max / 10);
				i = (i < 5) ? i : 5;
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
						qd[n].data[m] += miscrit.weight // this.examGradeDTS.examAttempts.length);
					});
				});
			});
		});

		this.problemsByQuestionChart.chartLabels = questionLabels;
		this.problemsByQuestionChart.chartData = qd;

		//calculation of mistakes in a question
		qd = [];
		let argids: number[] = [];

		this.currentExam.questions.forEach(quest => {

			quest.arguments.forEach(arg => {
				qd.push({ label: "", data: [] });
				argids.push(arg.id);
				qd[qd.length - 1].label = arg.text;

				for (let i = 0; i < this.currentExam.questions.length; i++) {
					qd[qd.length - 1].data.push(0);
				}
			})
		});

		this.examGradeDTS.examAttempts.forEach(attempt => {
			let qi: number = 0; //question index

			attempt.anwsers.forEach(anw => { //for each anwser check the mistakes and their impact on the grade
				anw.mistakes.forEach(mis => {
					let m = this.currentExam.questions.findIndex(q => q.id == anw.questionID);
					let n = argids.findIndex(x => x == mis.argumentID);

					//console.log("Question :" +  this.currentExam.questions.find(q => q.id == anw.questionID).text);
					//console.log("argument :" + this.currentExam.questions[m].arguments.find(x => x.id == mis.argumentID).text)

					qd[n].data[m]++;
				});
			});
		});

		qd = qd.filter(x => x.data.reduce((a, b) => a + b) > 0);

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
		console.log("ocene");
		this.examGradeDTS.examAttempts.forEach(attempt => {
			let ocena: number = 0.0;
			let max: number = 0.0;

			attempt.anwsers.forEach(anwser => {
				let question: Question2 = this.currentExam.questions[this.currentExam.questions.findIndex(x => x.id == anwser.questionID)];
				ocena += anwser.total * question.finalWeight / this.sumFinalQuestionWeights;
				max += question.finalWeight / this.sumFinalQuestionWeights;
			});

			let i: number = 10 - (ocena / max / 10);
			
			console.log(ocena);
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
				ocena = anwser.total * question.finalWeight / this.sumFinalQuestionWeights;
				max = question.finalWeight / this.sumFinalQuestionWeights;

				let i: number = 10 - (ocena / max / 10);
				i = (i < 5) ? i : 5;

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

	calculateCriteraPoints(critereaID: number) {
		let points: number[] = [];
		let critereaIndex: number = this.currentExam.examCriterea.findIndex(x => x.id == critereaID);
		this.dimensionChart.chartLabels = [];
		this.dimensionChart.chartData = [{ data: [], label: 'Number of achivers' }];

		//summarises the general criteria impacts for each attempt
		this.examGradeDTS.examAttempts.forEach(attempt => {
			points.push(
				attempt.generalCritereaImpacts.
					filter(x => x.examCritereaID == critereaID).
					reduce((a, b) => a + b.weight, 0));
		});

		//finds the minimum and maximum and calculates how it should strech throug the grades
		let min: number = points.reduce((min, p) => p < min ? p : min, points[0]);
		let max: number = points.reduce((max, p) => p > max ? p : max, points[0]);
		let delta: number = (max - min + 2) / this.currentExam.examCriterea[critereaIndex].advices.length ;

		this.sliderCfg.range.min = min;
		this.sliderCfg.range.max = max;
		console.log("points");
		console.log(points);

		console.log("min: " + min + "  max: " + max);

		//sets the range for each grade

		this.currentExam.examCriterea[critereaIndex].advices.forEach((element, index) => {
			this.dimensionChart.chartLabels.push(element.grade);

			element.max = Math.round(max - delta * index);
			element.min = Math.round(max - delta * (index + 1));

		});

		this.calculateStudentCritereaGrades(critereaID);
	}

	calculateStudentCritereaGrades(critereaID: number) {
		this.dimensionChart.chartData = [{ data: [], label: 'Number of achivers' }];
		let critereaIndex: number = this.currentExam.examCriterea.findIndex(x => x.id == critereaID);
		this.checkCriteraAdviceOverlap();

		let points: number[] = [];

		//summarises the general criteria impacts for each attempt
		this.examGradeDTS.examAttempts.forEach(attempt => {
			points.push(
				attempt.generalCritereaImpacts.
					filter(x => x.examCritereaID == critereaID).
					reduce((a, b) => a + b.weight, 0));
		});

		this.currentExam.examCriterea[critereaIndex].advices.forEach((element, index) => {
			let temp =  0;
			points.forEach(p => {
				if(element.max == 0 && p == 0){
					temp++;
				}
				else if(element.min <= p && p < element.max){
					temp++;
				}
			});
			this.dimensionChart.chartData[0].data.push( temp);
			/*console.log("points " + element.grade);
			console.log("min: " + element.min + "  max: " + element.max);
			console.log(points.filter(x => element.min < x && x <= element.max));
			console.log(points.filter(x => element.min < x && x <= element.max).length);*/

		});

		this.sliderData = [];
		this.sliderCfg.connect = [];
		this.sliderCfg.connect.push(true);
		for (let i = this.currentExam.examCriterea[critereaIndex].advices.length - 1; i >= 0; i--) {
			const element = this.currentExam.examCriterea[critereaIndex].advices[i];
			this.sliderData.push(element.min);

			this.sliderCfg.connect.push(true);
		}
		this.color();
	}

	checkCriteraAdviceOverlap() {
		for (let i = 0; i < this.currentCriteria.advices.length; i++) {
			if (this.currentCriteria.advices[i].max <= this.currentCriteria.advices[i].min) {
				this.currentCriteria.advices[i].min = this.currentCriteria.advices[i].max - 1;
			}
			if (i + 1 < this.currentCriteria.advices.length) {
				if (this.currentCriteria.advices[i].min <= this.currentCriteria.advices[i + 1].max) {
					this.currentCriteria.advices[i + 1].max = this.currentCriteria.advices[i].min;
				}
			}

		}
	}

	analyseDimension(index: number) {
		this.currentCriteria = this.currentExam.examCriterea[index];
		console.log(this.currentCriteria);
		this.calculateCriteraPoints(this.currentCriteria.id);
		this.showIndepth = true;
	}

	resetCriteriaEdit() {
		this.calculateCriteraPoints(this.currentCriteria.id)
	}

	closeCriteria() {
		this.showIndepth = false;
	}

	sliderChange() {

	}

	calculateOptimal() {
		alert("Optimisation is waiting");
	}

	saveFinal() {
		this.loading = true;
		console.log(this.examGradeDTS.currentExam);
		this.examService.grade(this.examGradeDTS.currentExam).subscribe(e => {
			this.alertService.success("Successfully graded exams.");
			console.log("success");
			console.log(e);
			this.loading = false;
		}, err => {
			this.alertService.error("Error grading exam.");
			console.log("error");
			console.log(err);
			this.loading = false;
		 });

	}
}
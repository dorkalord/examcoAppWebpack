import { Component, OnInit } from '@angular/core';

import { User } from '../../../_models/index';
import { UserService, CourseService } from '../../../_services/index';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Course, Topic } from '../../../_models/course';
import { ExamService } from '../../../_services/exam.service';
import { Exam } from '../../../_models/exam';
import { Question, Tag } from '../../../_models/question';
import { ExamDataTransferService } from '../../../_services/exam-datatransfer.service';
import { QuestionService } from '../../../_services/question.service';
declare var require: any;

@Component({
    selector: "exam-questions",
    templateUrl: 'exam-questions.component.html'

})

export class ExamQuestionsComponent implements OnInit {
    currentUser: User;
    currentExam: Exam;
    currentCourse: Course
    public questions: Question[];
    public questionForm: FormGroup;
    public counter: number;
    selectedTopics: number[];
    loading: boolean;
    sub: any;

    constructor(private userService: UserService,
        private examService: ExamService,
        private courseService: CourseService,
        private questionService: QuestionService,
        private _fb: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private dataTransfer: ExamDataTransferService) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.counter = 1;
        this.questions = [];
        this.selectedTopics = [];

        this.currentExam = this.dataTransfer.currentExam;
        this.currentCourse = this.dataTransfer.currentCourse;

        this.questionForm = this.initQestion(this.currentExam.id);
    }

    ngOnInit() {

    }

    initQestion(examID: number) {
        return this._fb.group({
            id: this.counter,
            examID: examID,

            seqencialNumber: [this.questions.length + 1, Validators.required],
            max: [100, Validators.required],
            text: ['', Validators.required],
            parentQuestionID: "",
            arguments: this._fb.array([]),
            tags: this._fb.array([]),
        });
    }

    addQuestion() {
        this.counter = this.counter + 1;
        this.questions.push(this.questionForm.value);
        this.questionForm = this.initQestion(this.currentExam.id);
    }

    removeQuestion(i: number) {
        let deletingQestion = this.questions[i];

        this.questions.forEach(element => {
            if (element.seqencialNumber > deletingQestion.seqencialNumber)
                element.seqencialNumber -= 1;
            if (element.parentQuestionID == deletingQestion.id)
                element.parentQuestionID = null;
        });

        this.questions.splice(i, 1);

        if (this.questionForm.value.parentQuestionID == deletingQestion.id)
            this.questionForm.value.parentQuestionID = null;

        this.questionForm = this._fb.group({
            id: this.counter,
            examID: this.currentExam.id,

            seqencialNumber: [this.questions.length + 1, Validators.required],
            max: [this.questionForm.value.max, Validators.required],
            text: [this.questionForm.value.text, Validators.required],
            parentQuestionID: [this.questionForm.value.parentQuestionID],
            arguments: this.questionForm.controls.arguments,
            tags: this._fb.array(this.questionForm.value.tags),
        });
    }

    save(i: number) {
        let index = this.questions.findIndex(x => x.id == i)
        if (index === -1) {
            this.addQuestion();
            index = this.questions.length-1;
        }
        else {
            this.questions[index] = this.questionForm.value;
            this.questionForm = this.initQestion(this.currentExam.id);
        }
        this.setTags(index);
    }

    setTags(i: number) {
        console.log(this.selectedTopics);
        this.selectedTopics.forEach(element => {
            this.questions[i].tags.push({ id: null, questionID : this.questions[i].id, topicID: element });
        });
    }

    cancel() {
        this.questionForm = this.initQestion(this.currentExam.id);
    }

    edit(i: number) {
        let q = this.questions[i];
        let parent = "";
        if(q.parentQuestionID!= null) parent = q.parentQuestionID.toString();

        this.questionForm = this._fb.group({
            id: q.id,
            examID: q.examID,

            seqencialNumber: [q.seqencialNumber, Validators.required],
            max: [q.max, Validators.required],
            text: [q.text, Validators.required],
            parentQuestionID: [parent],
            arguments: this._fb.array(q.arguments),
            tags: this._fb.array(q.tags),
        });
    }

    next() {
        this.loading = true;
        let temp: Exam;

        this.questionService.createMany(this.questions).subscribe(data => {
            console.log(data);
            this.dataTransfer.currentExam.questions = data;
            this.router.navigateByUrl('/exam/create/' + this.currentExam.id + '/evaluator');
        })
    }
}
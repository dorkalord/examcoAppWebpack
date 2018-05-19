import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { User } from '../../_models/index';
import { UserService } from '../../_services/index';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { CourseService } from '../../_services/course.service';
import { TopicService } from '../../_services/topic.service';
import { Course, Topic } from '../../_models/course';
declare var require: any; 

@Component({
    
    selector: "course-create",
    templateUrl: 'course-create.component.html'

})

export class CourseCreateComponent implements OnInit {
    currentUser: User;
    public parentTopics: any[];
    public myForm: FormGroup;
    public counter: number;
    private loading: boolean;

    constructor(private userService: UserService,
        private courseService: CourseService,
        private topicService: TopicService,
        private router: Router,
        private _fb: FormBuilder) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loading = false;
    }

    ngOnInit() {
        this.counter = 1;
        this.myForm = this._fb.group({
            lecturerID: [this.currentUser.id],
            lecturer: [{ value: this.currentUser.name, disabled: true }],
            code: ['', [Validators.required, Validators.minLength(3)]],
            name: ['', [Validators.required, Validators.minLength(3)]],
            topics: this._fb.array([])
        });

        this.addTopic();
    }

    initTopic() {
        return this._fb.group({
            id: [this.counter],
            name: ['', Validators.required],
            parrentTopicID: [''],
            description: ['']
        });
    }

    addTopic() {
        this.counter = this.counter + 1;
        const control = <FormArray>this.myForm.controls['topics'];
        const addrCtrl = this.initTopic();

        control.push(addrCtrl);
    }

    removeTopic(i: number) {
        const control = <FormArray>this.myForm.controls['topics'];
        control.removeAt(i);
    }

    save(model: any) {
        this.loading = true;
        let newCourse: Course = new Course;
        newCourse.name = model.value.name;
        newCourse.code = model.value.code;
        newCourse.lecturerID = model.value.lecturerID;


        this.courseService.create(newCourse).subscribe(data => {
            let topics: Topic[] = [];
            let createdCourse: Course = data;

            (<Topic[]>model.value.topics).forEach(item => {
                item.courseID = createdCourse.id;
                topics.push(item);
            });
            console.log(topics);    
            this.topicService.createMany(topics).subscribe(res => {
                this.loading = false;
                this.router.navigate(["/course"]);

            });
        });


    }


}
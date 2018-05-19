import { Component, OnInit } from '@angular/core';

import { User } from '../../_models/index';
import { UserService, CourseService } from '../../_services/index';
import { FormGroup, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Course, Topic } from '../../_models/course';
import { TopicService } from '../../_services/topic.service';
declare var require: any;

@Component({
    selector: "course-edit",
    templateUrl: 'course-edit.component.html'

})

export class CourseEditComponent implements OnInit {
    currentUser: User;
    private loading: boolean;
    public parentTopics: any[];
    public myForm: FormGroup;
    public counter: number;
    public originalCourse: Course;
    id: number;
    sub: any;

    constructor(private userService: UserService,
        private courseService: CourseService,
        private topicService: TopicService,
        private _fb: FormBuilder,
        private route: ActivatedRoute) {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));

        this.loading = true;

        this.myForm = this._fb.group({
            lecturerID: [this.currentUser.id],
            lecturer: [{ value: '', disabled: true }],
            code: [{ value: "" }, [Validators.required, Validators.minLength(3)]],
            name: [{ value: "" }, [Validators.required, Validators.minLength(3)]],
            topics: this._fb.array([])
        });

        this.sub = this.route.params.subscribe(params => {
            this.id = +params['id'];
            this.loading = true;

            this.courseService.getById(this.id).subscribe(data => {
                this.loading = false;
                this.originalCourse = data;
                this.LoadCourse(data);
            });
        });
    }

    ngOnInit() {

    }

    LoadCourse(courseIn: Course) {

        this.counter = 0;
        this.myForm = this._fb.group({
            lecturerID: [courseIn.lecturerID],
            lecturer: [{ value: courseIn.lecturer.name, disabled: true }],
            code: [courseIn.code, [Validators.required, Validators.minLength(3)]],
            name: [courseIn.name, [Validators.required, Validators.minLength(3)]],
            topics: this._fb.array([])
        });

        let max: number = 0;
        const control = <FormArray>this.myForm.controls['topics'];

        this.originalCourse.topics.forEach(item => {
            if (max < item.id)
                max = item.id;

            control.push(this.initTopic(item));
        });

        this.counter = max;
    }

    initTopic(t: Topic) {
        return this._fb.group({
            id: [t.id],
            name: [t.name, Validators.required],
            parrentTopicID: [t.parrentTopicID],
            description: [t.description],
            courseID: [t.courseID]
        });
    }

    addTopic() {
        //this.counter = this.counter + 1;
        this.loading = true;
        let b: Topic = new Topic();
        b.courseID = this.id;


        this.topicService.create(b).subscribe(data => {
            console.log(data);
            const control = <FormArray>this.myForm.controls['topics'];
            const topicCtrl = this.initTopic(data);

            control.push(topicCtrl);
            this.loading = false;
        });
    }

    removeTopic(i: number) {
        //also refreshes the intire control
        this.loading = true;
        let mylist: Topic[] = <Topic[]>this.myForm.controls['topics'].value;

        let deleting: Topic = mylist[i];
        mylist = mylist.filter(x => x.id != deleting.id);

        //bug with a dirty fix
        if(mylist.filter(x => +x.parrentTopicID == deleting.id).length > 0){
            alert("Please first delete the child topics of " + deleting.name);
            this.loading = false;
            return;
        }

        this.topicService.delete(deleting.id).subscribe(() => {
            this.topicService.updateMany(mylist).subscribe(res => {
                this.topicService.getAllTopcisOfCourse(this.id).subscribe(updatedtopics => {
                    
                    this.myForm.controls['topics'] = this._fb.array([]);
                    let max: number = 0;
                    
                    const control1 = <FormArray>this.myForm.controls['topics'];

                    (<Topic[]>updatedtopics).forEach(item => {
                        if (max < item.id)
                            max = item.id;

                        control1.push(this.initTopic(item));
                    });

                    this.counter = max;
                    this.loading = false;
                });
            }, err => { console.log(err); });
        });
    }

    save(model: any) {

        this.loading = true;
        let updatedCourse: Course = new Course;
        updatedCourse.id = this.originalCourse.id;
        updatedCourse.name = model.value.name;
        updatedCourse.code = model.value.code;
        updatedCourse.lecturerID = model.value.lecturerID;

        this.courseService.update(updatedCourse).subscribe(data => {
            this.topicService.updateMany(model.value.topics).subscribe(
                data => { this.loading = false; }
            );
        });

    }

}
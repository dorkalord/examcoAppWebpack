import { Injectable } from '@angular/core';
import { Course } from '../_models/course';
import { User } from '../_models/user';
import { Exam } from '../_models/exam';

@Injectable()
export class ExamDataTransferService {
    constructor() { }

    public currentUser: User;
    public currentExam: Exam;
    public currentCourse: Course;
}
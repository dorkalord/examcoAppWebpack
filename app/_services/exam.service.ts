import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Exam, ExamCriterea, ExamFull } from '../_models/exam';

@Injectable()
export class ExamService {
    constructor(private http: Http, private config: AppConfig) { }

    getAllExamsofAuthor(userID: number){
        return this.http.get(this.config.apiUrl + '/exam/author/' + userID, this.jwt()).map((response: Response) => response.json());
    }

    getAllExamsofCensor(userID: number){
        return this.http.get(this.config.apiUrl + '/exam/censor/' + userID, this.jwt()).map((response: Response) => response.json());
    }

    getAllExamsofStudent(userID: number){
        return this.http.get(this.config.apiUrl + '/exam/student/' + userID, this.jwt()).map((response: Response) => response.json());
    }

    updateExamState(examID: number, newStateID: number) {
        return this.http.get(this.config.apiUrl + '/exam/upadatestate/' + examID + '/' + newStateID, this.jwt()).map((response: Response) => response.json());
    }

    getByIdForCensoring(id: number) {
        return this.http.get(this.config.apiUrl + '/exam/forCensoring/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.config.apiUrl + '/exam/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(course: Exam) {
        return this.http.post(this.config.apiUrl + '/exam', course, this.jwt());
    }

    createCriterea(id:number, body: ExamCriterea[]) {
        return this.http.post(this.config.apiUrl + '/exam/criterea/' + id, body, this.jwt());
    }

    update(course: Exam) {
        return this.http.put(this.config.apiUrl + '/exam/' + course.id, course, this.jwt());
    }

    grade(course: ExamFull) {
        return this.http.put(this.config.apiUrl + '/exam/grade/' + course.id, course, this.jwt());
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/exam/' + id, this.jwt());
    }

    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers });
        }
    }
}
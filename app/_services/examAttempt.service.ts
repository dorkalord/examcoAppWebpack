import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { ExamAttempt, ExamAttempt2 } from '../_models/examAttempt';

@Injectable()
export class ExamAttemptService {
    constructor(private http: Http, private config: AppConfig) { }

    getAllExamAttempts() {
        return this.http.get(this.config.apiUrl + '/examAttempt', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.config.apiUrl + '/examAttempt/' + id, this.jwt()).map((response: Response) => response.json());
    }
    
    getByCensorExam(censorID: number, examID: number) {
        return this.http.get(this.config.apiUrl + '/examAttempt/censor/' + censorID +'/exam/' + examID, this.jwt()).map((response: Response) => response.json());
    }

    getByExam(examID: number) {
        return this.http.get(this.config.apiUrl + '/examAttempt/exam/' + examID, this.jwt()).map((response: Response) => response.json());
    }

    create(examAttempt: ExamAttempt) {
        return this.http.post(this.config.apiUrl + '/examAttempt', examAttempt, this.jwt()).map((response: Response) => response.json());
    }

    update(examAttempt: ExamAttempt2) {
        return this.http.put(this.config.apiUrl + '/examAttempt/' + examAttempt.id, examAttempt, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/examAttempt/' + id, this.jwt());
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
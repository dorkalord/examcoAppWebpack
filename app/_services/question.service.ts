import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Question } from '../_models/index';

@Injectable()
export class QuestionService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/question', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.config.apiUrl + '/question/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(question: Question) {
        return this.http.post(this.config.apiUrl + '/question', question, this.jwt()).map((response: Response) => response.json());;
    }

    createMany(questions: Question[]) {
        return this.http.post(this.config.apiUrl + '/question/many', questions, this.jwt()).map((response: Response) => response.json());;
    }

    update(question: Question) {
        return this.http.put(this.config.apiUrl + '/question/' + question.id, question, this.jwt()).map((response: Response) => response.json());;
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/question/' + id, this.jwt());
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
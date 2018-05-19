import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Grade } from '../_models/exam';


@Injectable()
export class GradeService {
    constructor(private http: Http, private config: AppConfig) { }

    getAllOfExam(examID: number) {
        return this.http.get(this.config.apiUrl + '/grade/exam/' + examID, this.jwt()).map((response: Response) => response.json());
    }
    
    getDefault() {
        return this.http.get(this.config.apiUrl + '/grade/default', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {

        return this.http.get(this.config.apiUrl + '/grade/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(grade: Grade) {
        return this.http.post(this.config.apiUrl + '/grade', grade, this.jwt()).map((response: Response) => response.json());
    }

    update(grade: Grade) {
        return this.http.put(this.config.apiUrl + '/grade/' + grade.id, grade, this.jwt());
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/grade/' + id, this.jwt());
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
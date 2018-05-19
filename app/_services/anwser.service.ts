import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Anwser } from '../_models/examAttempt';


@Injectable()
export class AnwserService {
    constructor(private http: Http, private config: AppConfig) { }

    getAllAnwsers() {
        return this.http.get(this.config.apiUrl + '/anwser', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.config.apiUrl + '/anwser/' + id, this.jwt()).map((response: Response) => response.json());
    }
    
    getByCensorExam(censorID: number, examID: number) {
        return this.http.get(this.config.apiUrl + '/anwser/censor/' + censorID +'/exam/' + examID, this.jwt()).map((response: Response) => response.json());
    }

    create(anwser: Anwser) {
        return this.http.post(this.config.apiUrl + '/anwser', anwser, this.jwt()).map((response: Response) => response.json());
    }

    update(anwser: Anwser) {
        return this.http.put(this.config.apiUrl + '/anwser/' + anwser.id, anwser, this.jwt()).map((response: Response) => response.json());
    }

    updateCompletion(anwser: Anwser, completion: string) {
        return this.http.put(this.config.apiUrl + '/anwser/' + anwser.id + '/' + completion, anwser, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/anwser/' + id, this.jwt());
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
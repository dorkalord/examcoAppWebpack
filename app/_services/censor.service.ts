import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Censor } from '../_models/index';

@Injectable()
export class CensorService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/censor', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.config.apiUrl + '/censor/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getByExamUser(examID: number, userID: number) {
        return this.http.get(this.config.apiUrl + '/censor/exam/'+ examID + '/user/' + userID, this.jwt()).map((response: Response) => response.json());
    }

    create(censor: Censor) {
        return this.http.post(this.config.apiUrl + '/censor', censor, this.jwt()).map((response: Response) => response.json());;
    }

    createMany(censors: Censor[]) {
        return this.http.post(this.config.apiUrl + '/censor/many', censors, this.jwt()).map((response: Response) => response.json());;
    }

    update(censor: Censor) {
        return this.http.put(this.config.apiUrl + '/censor/' + censor.id, censor, this.jwt()).map((response: Response) => response.json());;
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/censor/' + id, this.jwt());
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
import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { GeneralCriterea } from '../_models/criterea';


@Injectable()
export class GeneralCritereaService {
    constructor(private http: Http, private config: AppConfig) { }

    geAll() {
        return this.http.get(this.config.apiUrl + '/generalCriterea', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {

        return this.http.get(this.config.apiUrl + '/generalCriterea/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(criterea: GeneralCriterea) {
        return this.http.post(this.config.apiUrl + '/generalCriterea', criterea, this.jwt()).map((response: Response) => response.json());
    }

    update(criterea: GeneralCriterea) {
        return this.http.put(this.config.apiUrl + '/generalCriterea/' + criterea.id, criterea, this.jwt());
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/generalCriterea/' + id, this.jwt());
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
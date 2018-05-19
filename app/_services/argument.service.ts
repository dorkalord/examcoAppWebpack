import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Argument } from '../_models/question';

@Injectable()
export class ArgumentService {
    constructor(private http: Http, private config: AppConfig) { }

    getAllArguments() {
        return this.http.get(this.config.apiUrl + '/argument', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {

        return this.http.get(this.config.apiUrl + '/argument/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(argument: Argument) {
        return this.http.post(this.config.apiUrl + '/argument', argument, this.jwt()).map((response: Response) => response.json());
    }

    update(argument: Argument) {
        return this.http.put(this.config.apiUrl + '/argument/' + argument.id, argument, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/argument/' + id, this.jwt());
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
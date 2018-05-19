import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { State } from "../_models/state";

@Injectable()
export class StateService {
    constructor(private http: Http, private config: AppConfig) { }

    getAllStates() {
        return this.http.get(this.config.apiUrl + '/state', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {

        return this.http.get(this.config.apiUrl + '/state/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(state: State) {
        return this.http.post(this.config.apiUrl + '/state', state, this.jwt()).map((response: Response) => response.json());
    }

    update(state: State) {
        return this.http.put(this.config.apiUrl + '/state/' + state.id, state, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/state/' + id, this.jwt());
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
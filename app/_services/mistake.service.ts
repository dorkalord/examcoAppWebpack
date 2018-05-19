import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Mistake } from '../_models/examAttempt';


@Injectable()
export class MistakeService {
    constructor(private http: Http, private config: AppConfig) { }

    getAllMistakes() {
        return this.http.get(this.config.apiUrl + '/mistake', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {

        return this.http.get(this.config.apiUrl + '/mistake/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(mistake: Mistake) {
        return this.http.post(this.config.apiUrl + '/mistake', mistake, this.jwt()).map((response: Response) => response.json());
    }

    createAsync(mistake: Mistake) {
        console.log(2);
        return new Promise<Mistake> ( resolve => {
            this.http.post(this.config.apiUrl + '/mistake', mistake, this.jwt())
            .map((response: Response) => response.json()).subscribe(data => {return data;})
        });
    }

    update(mistake: Mistake) {
        return this.http.put(this.config.apiUrl + '/mistake/' + mistake.id, mistake, this.jwt()).map((response: Response) => response.json());
    }

    updateMany(mistake: Mistake[]) {
        return this.http.put(this.config.apiUrl + '/mistake/', mistake, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/mistake/' + id, this.jwt());
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
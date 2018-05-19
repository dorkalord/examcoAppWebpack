import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { GeneralCritereaImpact } from '../_models/examAttempt';


@Injectable()
export class GeneralCritereaImpactService {
    constructor(private http: Http, private config: AppConfig) { }

    getAll() {
        return this.http.get(this.config.apiUrl + '/generalCritereaImpact', this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {
        return this.http.get(this.config.apiUrl + '/generalCritereaImpact/' + id, this.jwt()).map((response: Response) => response.json());
    }

    getByExamUser(examID: number, userID: number) {
        return this.http.get(this.config.apiUrl + '/generalCritereaImpact/exam/'+ examID + '/user/' + userID, this.jwt()).map((response: Response) => response.json());
    }

    create(generalCritereaImpact: GeneralCritereaImpact) {
        return this.http.post(this.config.apiUrl + '/generalCritereaImpact', generalCritereaImpact, this.jwt()).map((response: Response) => response.json());;
    }

    createMany(generalCritereaImpacts: GeneralCritereaImpact[]) {
        return this.http.post(this.config.apiUrl + '/generalCritereaImpact/many', generalCritereaImpacts, this.jwt()).map((response: Response) => response.json());;
    }

    updateMany(generalCritereaImpacts: GeneralCritereaImpact[]) {
        return this.http.put(this.config.apiUrl + '/generalCritereaImpact/many', generalCritereaImpacts, this.jwt()).map((response: Response) => response.json());;
    }

    update(generalCritereaImpact: GeneralCritereaImpact) {
        return this.http.put(this.config.apiUrl + '/generalCritereaImpact/' + generalCritereaImpact.id, generalCritereaImpact, this.jwt()).map((response: Response) => response.json());;
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/generalCritereaImpact/' + id, this.jwt());
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
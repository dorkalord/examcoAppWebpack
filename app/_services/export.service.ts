import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response, ResponseContentType  } from '@angular/http';

import { AppConfig } from '../app.config';


@Injectable()
export class ExportService {
    constructor(private http: Http, private config: AppConfig) { }

    getExam(examID: number) {
        return this.http.get(this.config.apiUrl + '/export/exam/' + examID, this.jwt());
    }
    
    getAttempts(examID: number) {
        return this.http.get(this.config.apiUrl + '/export/examAttempts/' + examID, this.jwt());
    }
  
    // private helper methods

    private jwt() {
        // create authorization header with jwt token
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.token) {
            let headers = new Headers({ 'Authorization': 'Bearer ' + currentUser.token });
            return new RequestOptions({ headers: headers, responseType: ResponseContentType.Blob});
        }
    }
}
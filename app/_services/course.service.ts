import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Course } from '../_models/course';

@Injectable()
export class CourseService {
    constructor(private http: Http, private config: AppConfig) { }

    getAllCoursesOfUser(userID: number) {
        return this.http.get(this.config.apiUrl + '/course/lecturer/' + userID, this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {

        return this.http.get(this.config.apiUrl + '/course/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(course: Course) {
        return this.http.post(this.config.apiUrl + '/course', course, this.jwt()).map((response: Response) => response.json());
    }

    update(course: Course) {
        return this.http.put(this.config.apiUrl + '/course/' + course.id, course, this.jwt());
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/course/' + id, this.jwt());
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
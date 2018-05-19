import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';

import { AppConfig } from '../app.config';
import { Topic } from '../_models/course';

@Injectable()
export class TopicService {
    constructor(private http: Http, private config: AppConfig) { }

    getAllTopcis() {
        return this.http.get(this.config.apiUrl + '/topic', this.jwt()).map((response: Response) => response.json());
    }
    
    getAllTopcisOfCourse(courseID: number) {
        return this.http.get(this.config.apiUrl + '/topic/course/' + courseID, this.jwt()).map((response: Response) => response.json());
    }

    getById(id: number) {

        return this.http.get(this.config.apiUrl + '/topic/' + id, this.jwt()).map((response: Response) => response.json());
    }

    create(topic: Topic) {
        return this.http.post(this.config.apiUrl + '/topic', topic, this.jwt()).map((response: Response) => response.json());
    }

    createMany(topic: Topic[]) {
        return this.http.post(this.config.apiUrl + '/topic/many', topic, this.jwt()).map((response: Response) => response.json());
    }

    update(topic: Topic) {
        return this.http.put(this.config.apiUrl + '/topic/' + topic.id, topic, this.jwt()).map((response: Response) => response.json());
    }

    updateMany(topic: Topic[]) {
        return this.http.put(this.config.apiUrl + '/topic', topic, this.jwt()).map((response: Response) => response.json());
    }

    delete(id: number) {
        return this.http.delete(this.config.apiUrl + '/topic/' + id, this.jwt());
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
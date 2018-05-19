import { User } from './user';

export class Course {
    id: number;
    lecturerID: number;
    lecturer: User;

    name: string;
    code: string;

    topics: Topic[];
}

export class Topic {
    id: number;
    courseID: number;

    name: string;
    description: string;
    parrentTopicID: number;
}
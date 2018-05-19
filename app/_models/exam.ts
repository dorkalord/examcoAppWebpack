import { Question, Argument, Tag } from './question';
import { GeneralCriterea, Advice } from './criterea';
import { Course } from './course';
import { User } from './user';
import { State } from './state';
import { Censor } from './censor';

export class Exam {
    id: number;
    courseID: number;
    authorID: number;
    stateID: number;

    date: string;
    language: string;
    status: string;

    examCriterea: ExamCriterea[];
    questions: Question[];
    censorIDs: number[];

    constructor() {
        this.examCriterea = [];
        this.questions = [];
        this.censorIDs = [];
    }
}

export class ExamCriterea{
    id:number;
    name: string;
    generalCritereaID : number
    gnerealCriterea: GeneralCriterea;

    advices: Advice[];
}

export class Grade {
    id: number;
    name: string;
    min: number;
    max: number;
    top: number;
}

export class ExamFull{
    id: number;
    courseID: number;
    authorID: number;
    stateID: number;
    course: Course;
    author: User;
    state: State;

    date: string;
    language: string;
    status: string;

    examCriterea: ExamCriterea2[];
    questions: Question2[];
    censors: Censor[];
    grades: Grade[];

    constructor() {
        this.examCriterea = [];
        this.questions = [];
        this.censors = [];
        this.grades = [];
    }
}

export class ExamCriterea2{
    id:number;
    name: string;
    generalCritereaID : number

    advices: Advice[];
}

export class Question2{
    id: number;
    examID: number;
    parentQuestionID: number;

    seqencialNumber: number;
    text: string;
    proposedWeight:number;
    finalWeight:number;
    max:number;
    
    arguments: Argument[];
    tags: Tag[];
    childs: Question2[];

    constructor(){
        this.arguments = [];
        this.tags = [];
        this.childs =[];
    }
}
import { Censor } from './censor';
import { ArgumentCriterea, Question, Argument } from './question';
import { Question2, ExamCriterea, ExamCriterea2, User } from '.';
import { Advice } from './criterea';
export class ExamAttempt {
    id: number;
    total: number;
    finalTotal: number;
    censorshipDate: string;
    gradingDate: string;

    gradeID: number;
    examID: number;
    censorID: number;
    studentID: number;
    student: any;

    anwsers: Anwser[];
    generalCritereaImpacts: GeneralCritereaImpact[];
}

export class Anwser {
    id: number;
    total: number;
    finalTotal: number;
    censorshipDate: string;
    note: string;
    adjustment: number;
    completion: string;

    examAttemtID: number;
    questionID: number;
    question: Question2;

    mistakes: Mistake[];
}

export class Mistake {
    argument: any;
    id: number;
    adjustedWeight: number;

    argumentID: number;
    anwserID: number;
}

export class GeneralCritereaImpact {
    id: number;
    weight: number;

    examAttemptID: number;
    anwserID: number;
    mistakeID: number;
    examCritereaID: number;
}

export class ExamAttempt2 {
    id: number;
    total: number;
    finalTotal: number;

    gradeID: number;
    examID: number;
    censorID: number;
    studentID: number;

    anwsers: Anwser[];
    generalCritereaImpacts: GeneralCritereaImpact[];
}

export class Argument2 {
    id: number;
    authorID: number;
    parentArgumentID: number;
    questionID: number;

    text: string;
    advice: string;
    defaultWeight: number;
    variable: boolean;
    minMistakeText: string;
    maxMistakeText: string;
    minMistakeWeight: number;
    maxMistakeWeight: number;

    argumentCritereas: ArgumentCriterea[];
    checked: boolean;
}

export class ExamAttempt3 {
    id: number;
    total: number;
    finalTotal: number;
    censorshipDate: string;
    gradingDate: string;

    gradeID: number;
    examID: number;
    censorID: number;
    studentID: number;
    student: User;

    anwsers: Anwser[];
    generalCritereaImpacts: GeneralCritereaImpact[];
    examAdvices: ExamAdvice[];
}

export class ExamAdvice {
    id: number;
    examAttemptID: number;
    adviceID: number;
    examCritereaID: number;
    total: number;
    examCriterea: ExamCriterea2;
    advice: Advice;
}
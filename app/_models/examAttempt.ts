import { Censor } from './censor';
import { ArgumentCriterea } from './question';
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

    anwsers: Anwser[];
    generalCritereaImpacts :GeneralCritereaImpact[];
}

export class Anwser{
    id: number;
    total: number;
    finalTotal: number;
    censorshipDate: string;
    note: string;
    adjustment: number;
    completion: string;

    examAttemtID: number;
    questionID: number;

    mistakes: Mistake[];
}

export class Mistake{
    id: number;
    adjustedWeight: number;

    argumentID: number;
    anwserID: number;
}

export class GeneralCritereaImpact{
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
    generalCritereaImpacts :GeneralCritereaImpact[];
}

export class Argument2{
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
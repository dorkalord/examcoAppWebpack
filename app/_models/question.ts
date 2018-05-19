export class Question{
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
    child: Question[];
}

export class Argument{
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
}

export class ArgumentCriterea{
    id: number;
    argumentID: number;
    examCritereaID: number;

    severity: number;
}

export class Tag{
    id: number;
    questionID: number;
    topicID: number;
}
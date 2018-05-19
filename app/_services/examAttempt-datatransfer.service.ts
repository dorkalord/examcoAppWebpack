import { Injectable } from '@angular/core';
import { Exam, ExamFull } from '../_models/exam';
import { ExamAttempt } from '../_models/examAttempt';
import { Censor } from '../_models/censor';

@Injectable()
export class ExamAttemptDataTransferService {
    constructor() { }

    public examAttempts: ExamAttempt[];
    public currentExam: ExamFull;
    public currentExamAttempt: ExamAttempt;
    public currentCensor: Censor;
}

export class critereaDisplay{
    public name: string;
    public examCritereaID: number;
    public calculated: number;
    public adjustment: number;
    public total: number;
}
import { Injectable } from "@angular/core";
import { ExamAttempt, ExamAttempt3 } from "../_models/examAttempt";
import { ExamFull } from "../_models";

@Injectable()
export class ExamReportDataTransferService {
    constructor() { }

    public examAttempts: ExamAttempt3[];
    public currentExam: ExamFull;
}
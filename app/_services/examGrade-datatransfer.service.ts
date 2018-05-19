import { Injectable } from "@angular/core";
import { ExamAttempt } from "../_models/examAttempt";
import { ExamFull } from "../_models";

@Injectable()
export class ExamGradeDataTransferService {
    constructor() { }

    public examAttempts: ExamAttempt[];
    public currentExam: ExamFull;
}
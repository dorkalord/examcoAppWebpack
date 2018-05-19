import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormArray } from '@angular/forms';

declare var require: any;

@Component({
    selector: 'examAttempt-argument',
    templateUrl: 'examAttempt-argument.component.html',
})
export class ExamAttemptArgumentComponent {
    @Input('argument')
    public argumentFrorm: FormArray;
    /*@Input('mistakes')
    public topics:any;*/

    ngOnInit()
    {
        
    }
    constructor(){
        console.log(this.argumentFrorm);
    }
}
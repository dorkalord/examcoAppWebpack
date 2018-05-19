import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

declare var require: any;

@Component({
    selector: 'generalCriterea',
    templateUrl: 'generalCriterea.component.html',
})
export class GeneralCritereaComponent {
    @Input('group')
    public generalCriterea: FormGroup;

    ngOnInit()
    {
        
    }
    constructor(){

    }
}
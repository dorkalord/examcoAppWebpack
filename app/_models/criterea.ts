export class GeneralCriterea {
    id: number;
    name: string;
    advices: Advice[];
}

export class Advice {
    id: number;
    text: string;
    grade: string;
    min: number;
    max: number;
    top: number;
}

export enum StateOfForm{
    List,
    Edit, 
    Create,
    Loading
}
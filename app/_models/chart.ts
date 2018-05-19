export class chartDef {
	public chartOptions: any;
	public chartLabels: string[];
	public chartType: string;
	public chartLegend: boolean;

	public chartData: ChartData[];
}

export class ChartData{
	public data:number[];
	public label:string;
}
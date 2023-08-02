import { IServiceType } from "./IServiceType";



export interface IProviderService{

    pricePerHour:number;
    expectedDuration:string;
    description:string;
	averageRating:number;
	numberOfReviews:number;
	numberOfCompletedTasks:number;
    serviceType:IServiceType;
}
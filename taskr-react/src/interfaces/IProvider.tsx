import { IProviderService } from './IProviderService';
import { IServiceArea } from './IServiceArea';
import { IAvailabilityInterval } from './IAvailabilityInterval';
import { IReview } from './IReview';
export interface IProvider{
    id:number;
    name: string;
    email:string;
    phone: string;
    birthDate:Date;
    nif:string;
    photo : any | null ;
    averageRating: number;
    numberOfReviews:number ;
    state:string;
    providerServices: IProviderService[];   
    providerServiceAreas:IServiceArea[];
    availability:IAvailabilityInterval[];
    review: IReview | null;
}
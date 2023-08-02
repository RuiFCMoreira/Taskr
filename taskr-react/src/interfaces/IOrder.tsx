

import { IServiceType } from "./IServiceType"
import { IAddress } from "./IAddress"
import { IReview } from "./IReview"


export interface IOrder{
    id :number,
    providerId:number,
    description:String,
    datehour: Date,
    serviceType: IServiceType,
    duration: string,
    pricePerHour:number,
    state:String,
    address: IAddress,
    clientId:number,
    review:IReview
}

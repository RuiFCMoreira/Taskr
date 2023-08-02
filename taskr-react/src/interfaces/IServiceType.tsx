import { IServiceCategory } from "./IServiceCategory"

export interface IServiceType{
    id:number,
    name:string,
    description:string,
    image:string,
    serviceCategory:IServiceCategory
}


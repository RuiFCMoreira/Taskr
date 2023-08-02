import { IServiceType } from "./IServiceType";

export interface IServiceCategoryTypes {
    id: number;
    name: string;
    description: string;
    types: IServiceType[];
}
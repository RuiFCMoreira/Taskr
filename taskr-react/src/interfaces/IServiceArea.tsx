import { IDistrict } from "./IDistrict";
import { IMunicipality } from "./IMunicipality";

export interface IServiceArea{
    district:IDistrict | null;
    municipality:IMunicipality | null;
}

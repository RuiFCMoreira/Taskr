package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.ServiceArea;

public record ServiceAreaDTO(
        DistrictDTO district,
        MunicipalityDTO municipality
){
    public static ServiceAreaDTO getDTO(ServiceArea serviceArea){
        return new ServiceAreaDTO(DistrictDTO.getDTO(serviceArea.getDistrict()), MunicipalityDTO.getDTO(serviceArea.getMunicipality()));
    }
}
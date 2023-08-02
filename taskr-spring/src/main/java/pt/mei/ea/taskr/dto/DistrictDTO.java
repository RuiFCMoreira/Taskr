package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.District;

import java.util.List;

public record DistrictDTO(
        Long id,
        String name,
        List<MunicipalityDTO> municipalities
){
    public static DistrictDTO getDTO(District district){
        return new DistrictDTO(district.getId(),
                district.getName(),
                district.getMunicipalities().stream().map(MunicipalityDTO::getDTO).toList()
        );
}
}
package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.Municipality;

public record MunicipalityDTO(
        Long id,
        String name
){
    public static MunicipalityDTO getDTO(Municipality municipality){
        return new MunicipalityDTO(municipality.getId(),municipality.getName());
}
}
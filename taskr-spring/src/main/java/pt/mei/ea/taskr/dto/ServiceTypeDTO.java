package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.ServiceType;

public record ServiceTypeDTO(
        Long id,
        String name,
        String description,
        String imageURL,
        ServiceCategoryDTO serviceCategory
){
    public static ServiceTypeDTO getDTO(ServiceType serviceType, String image){
        return new ServiceTypeDTO(serviceType.getId(),
                                  serviceType.getName(),
                                  serviceType.getDescription(),
                                  image,
                                  ServiceCategoryDTO.getDTO(serviceType.getCategory()));
    }
}
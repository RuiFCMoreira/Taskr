package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.ServiceType;
import pt.mei.ea.taskr.services.StorageService;

public record ServiceTypeWithoutCategoryDTO(
        Long id,
        String name,
        String description,
        String image,
        Long categoryId
) {
    public static ServiceTypeWithoutCategoryDTO getDTO(ServiceType serviceType, String photo){
        return new ServiceTypeWithoutCategoryDTO(serviceType.getId(),
                serviceType.getName(),
                serviceType.getDescription(),
                photo,
                serviceType.getCategory().getId());
    }
}

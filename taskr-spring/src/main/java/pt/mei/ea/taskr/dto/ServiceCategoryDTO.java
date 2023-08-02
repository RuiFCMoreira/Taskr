package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.ServiceCategory;

public record ServiceCategoryDTO(
        Long id,
        String name,
        String description

) {
    public static ServiceCategoryDTO getDTO(ServiceCategory  serviceCategory){
        return new ServiceCategoryDTO(serviceCategory.getId(),serviceCategory.getName(),serviceCategory.getDescription());
    }
}
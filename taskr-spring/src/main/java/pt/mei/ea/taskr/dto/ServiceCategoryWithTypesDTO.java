package pt.mei.ea.taskr.dto;

import pt.mei.ea.taskr.models.ServiceCategory;
import pt.mei.ea.taskr.services.StorageService;

import java.util.Arrays;
import java.util.List;

public record ServiceCategoryWithTypesDTO(
        Long id,
        String name,
        String description,
        List<ServiceTypeWithoutCategoryDTO> types

        ) {
    public static ServiceCategoryWithTypesDTO getDTO(ServiceCategory  serviceCategory, StorageService storageService){
        return new ServiceCategoryWithTypesDTO(
                serviceCategory.getId(),
                serviceCategory.getName(),
                serviceCategory.getDescription(),
                serviceCategory.getTypes().stream().filter(s-> !s.getDeleted()).map(s -> ServiceTypeWithoutCategoryDTO.getDTO(s, new String(storageService.downloadFile(s.getImageURL())))).toList()
    );
    }
}
package pt.mei.ea.taskr.services;


import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.controllers.CategoryController;
import pt.mei.ea.taskr.dto.ServiceCategoryDTO;
import pt.mei.ea.taskr.dto.ServiceCategoryWithTypesDTO;
import pt.mei.ea.taskr.dto.ServiceTypeDTO;
import pt.mei.ea.taskr.models.ServiceCategory;
import pt.mei.ea.taskr.models.ServiceType;
import pt.mei.ea.taskr.repositories.ServiceCategoryRepository;
import pt.mei.ea.taskr.repositories.ServiceTypeRepository;

import java.util.List;

@Service
public class CategoryService {

    private final ServiceCategoryRepository categoryRepository;
    private final ServiceTypeRepository typeRepository;

    private final StorageService storageService;

    public CategoryService(ServiceCategoryRepository categoryRepository, ServiceTypeRepository typeRepository, StorageService storageService) {
        this.categoryRepository = categoryRepository;
        this.typeRepository = typeRepository;
        this.storageService = storageService;
    }

    public List<ServiceTypeDTO> getAllTypesOfCategory(String categoryName) throws ResponseStatusException {

        ServiceCategory category = categoryRepository.findByName(categoryName).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find category") {
        });

        return typeRepository.findByCategory(category).stream().filter(s-> !s.getDeleted()).map(serviceType ->
                ServiceTypeDTO.getDTO(serviceType, new String(storageService.downloadFile(serviceType.getImageURL())))).toList();
    }

    public List<ServiceCategoryDTO> getAllCategories() {
        return categoryRepository.findAll().stream().map(ServiceCategoryDTO::getDTO).toList();
    }

    public List<ServiceCategoryWithTypesDTO> getAllTypes() {
        return categoryRepository.findAll().stream().map(s -> ServiceCategoryWithTypesDTO.getDTO(s,storageService)).toList();
    }

    public ServiceTypeDTO addServiceType(String categoryName, CategoryController.ServiceTypeRequest request) {
        ServiceCategory category = categoryRepository.findByName(categoryName).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find category") {});
        if(typeRepository.existsByName(request.name())) throw new ResponseStatusException(HttpStatus.BAD_REQUEST,"Service type already exists");
        String photoURL = "category-" + categoryName;
        storageService.uploadFile(photoURL, request.photo().getBytes());
        ServiceType serviceType = new ServiceType(category, request.name(), request.description(), photoURL);
        typeRepository.save(serviceType);
        return ServiceTypeDTO.getDTO(serviceType, "");
    }

    public void deleteType(String categoryName, Long typeId) {
        ServiceCategory category = categoryRepository.findByName(categoryName).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find category") {});
        ServiceType serviceType = typeRepository.findById(typeId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find service type") {});
        serviceType.setDeleted(true);
        storageService.deleteFile(serviceType.getImageURL());
        serviceType.setName(serviceType.getName()+"deleted"+System.currentTimeMillis());
        typeRepository.save(serviceType);

    }

    public void editServiceType(String categoryName, Long typeId, CategoryController.EditServiceTypeRequest request) {
        ServiceCategory category = categoryRepository.findByName(categoryName).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Could not find category") {});
        ServiceType serviceType = typeRepository.findById(typeId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,"Service type doesn't exist yet"));
        if(request.name() != null) serviceType.setName(request.name());
        if(request.description() != null) serviceType.setDescription(request.description());
        if(request.photo() != null) storageService.updateBucket(serviceType.getImageURL(), request.photo().getBytes());
        typeRepository.save(serviceType);
    }
}

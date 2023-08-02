package pt.mei.ea.taskr.controllers;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.dto.ServiceCategoryDTO;
import pt.mei.ea.taskr.dto.ServiceCategoryWithTypesDTO;
import pt.mei.ea.taskr.dto.ServiceTypeDTO;
import pt.mei.ea.taskr.services.CategoryService;

import java.util.List;


@RestController
@RequestMapping("api/categories")
public class CategoryController {

    private static final Logger log = LoggerFactory.getLogger(CategoryController.class);

    private final CategoryService categoryService;

    public CategoryController(CategoryService categoryService) {
        this.categoryService = categoryService;
    }

    @GetMapping()
    public List<ServiceCategoryDTO> getAllCategories() throws ResponseStatusException {

        return categoryService.getAllCategories();
    }

    @GetMapping("types")
    public List<ServiceCategoryWithTypesDTO> getAllTypes() throws ResponseStatusException {
        return categoryService.getAllTypes();
    }

    @GetMapping("{category}/types")
    public List<ServiceTypeDTO> getAllTypesOfCategory(@PathVariable String category) throws ResponseStatusException {

        return categoryService.getAllTypesOfCategory(category);
    }

    public record ServiceTypeRequest(
            String name,
            String description,
            String photo
    ){}


    @PostMapping("{category}")
    public ServiceTypeDTO addServiceType(@PathVariable String category,@RequestBody ServiceTypeRequest request) throws ResponseStatusException{
        return categoryService.addServiceType(category,request);
    }

    public record EditServiceTypeRequest(
            String name,
            String description,
            String photo
    ){}

    @PostMapping("{category}/{typeId}")
    public void editServiceType(@PathVariable String category, @PathVariable Long typeId, @RequestBody EditServiceTypeRequest request) throws ResponseStatusException{
        categoryService.editServiceType(category,typeId,request);
    }

    @DeleteMapping("{category}")
    public void delete(@PathVariable String category,@RequestParam Long typeId) throws ResponseStatusException{
        categoryService.deleteType(category,typeId);
    }


}

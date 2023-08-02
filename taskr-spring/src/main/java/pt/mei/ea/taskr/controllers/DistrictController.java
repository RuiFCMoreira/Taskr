package pt.mei.ea.taskr.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pt.mei.ea.taskr.dto.DistrictDTO;
import pt.mei.ea.taskr.dto.MunicipalityDTO;
import pt.mei.ea.taskr.services.DistrictService;

import java.util.List;

@RestController
@RequestMapping("/api/districts")
public class DistrictController {

    private final DistrictService districtService;

    public DistrictController(DistrictService districtService) {
        this.districtService = districtService;
    }

    @GetMapping()
    public List<DistrictDTO> getAllDistricts(){
        return districtService.getAllDistricts();
    }

    @GetMapping("{name}/municipalities")
    public List<MunicipalityDTO> getMunicipalitiesByDistrict(@PathVariable("name") String name){
        return districtService.getMunicipalities(name);
    }
}

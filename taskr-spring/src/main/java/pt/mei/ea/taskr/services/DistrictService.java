package pt.mei.ea.taskr.services;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pt.mei.ea.taskr.dto.DistrictDTO;
import pt.mei.ea.taskr.dto.MunicipalityDTO;
import pt.mei.ea.taskr.models.District;
import pt.mei.ea.taskr.repositories.DistrictRepository;

import java.util.List;

@Service
public class DistrictService {
    private final DistrictRepository districtRepository;

    public DistrictService(DistrictRepository districtRepository) {
        this.districtRepository = districtRepository;
    }

    public List<DistrictDTO> getAllDistricts(){
        return districtRepository.findAll().stream().map(DistrictDTO::getDTO).toList();
    }

    public List<MunicipalityDTO> getMunicipalities(String districtName) {
        District district = districtRepository.findByName(districtName).orElseThrow(
                () -> new ResponseStatusException(HttpStatus.NOT_FOUND, "District not found")
        );

        return district.getMunicipalities().stream().map(MunicipalityDTO::getDTO).toList();
    }
}

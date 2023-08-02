package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.mei.ea.taskr.models.District;

import java.util.Optional;

public interface DistrictRepository extends JpaRepository<District,Long> {
    Optional<District> findByName(String name);
}

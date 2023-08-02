package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.mei.ea.taskr.models.ServiceCategory;

import java.util.Optional;

public interface ServiceCategoryRepository extends JpaRepository<ServiceCategory, Long> {

    Optional<ServiceCategory> findByName(String name);
}

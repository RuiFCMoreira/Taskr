package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.mei.ea.taskr.models.Municipality;

public interface MunicipalityRepository extends JpaRepository<Municipality, Long> {
}

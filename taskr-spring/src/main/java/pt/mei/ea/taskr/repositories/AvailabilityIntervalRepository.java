package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.mei.ea.taskr.models.AvailabilityInterval;
import pt.mei.ea.taskr.models.District;
import pt.mei.ea.taskr.models.Provider;

import java.util.List;

public interface AvailabilityIntervalRepository extends JpaRepository<AvailabilityInterval, Long> {

    List<AvailabilityInterval> findByProvider(Provider provider);
}

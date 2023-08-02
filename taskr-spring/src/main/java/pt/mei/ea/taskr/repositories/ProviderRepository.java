package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pt.mei.ea.taskr.models.AvailabilityInterval;
import pt.mei.ea.taskr.models.Client;
import pt.mei.ea.taskr.models.Provider;

import java.util.List;
import java.util.Optional;

public interface ProviderRepository extends JpaRepository<Provider, Long> {
    List<Provider> findByAverageRatingGreaterThanEqualAndIsDeletedIsFalse(Float rating);

    boolean existsByPhone(String phone);


    List<Provider> findAllByIsDeletedIsFalse();

    @Query("SELECT p from Provider p where p.id = :id and p.isDeleted = false ")
    Optional<Provider> findByIdAndIsDeletedIsFalse(Long id);

    @Query("SELECT p.calendarAvailability from Provider p where p.id = :id")
    List<AvailabilityInterval> getAvailabilityById(Long id);
}

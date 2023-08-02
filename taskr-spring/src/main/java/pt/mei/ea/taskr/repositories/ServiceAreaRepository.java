package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pt.mei.ea.taskr.models.ServiceArea;
import pt.mei.ea.taskr.models.ServiceAreaId;

import java.util.List;

public interface ServiceAreaRepository extends JpaRepository<ServiceArea, ServiceAreaId> {

    @Query("SELECT sa FROM ServiceArea sa where sa.serviceAreaId.providerId = :providerId")
    List<ServiceArea> findIdByProviderId(@Param("providerId") Long providerId);
}

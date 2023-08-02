package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.mei.ea.taskr.models.ProviderService;
import pt.mei.ea.taskr.models.ProviderServiceId;
import pt.mei.ea.taskr.models.ServiceType;

import java.util.List;

public interface ProviderServiceRepository extends JpaRepository<ProviderService, ProviderServiceId> {

    List<ProviderService> findByType(ServiceType st);
}

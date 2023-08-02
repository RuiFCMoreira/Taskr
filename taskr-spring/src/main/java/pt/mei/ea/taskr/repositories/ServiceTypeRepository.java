package pt.mei.ea.taskr.repositories;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pt.mei.ea.taskr.models.ServiceCategory;
import pt.mei.ea.taskr.models.ServiceType;

import java.util.List;

public interface ServiceTypeRepository extends JpaRepository<ServiceType, Long> {

    @Query("SELECT st FROM ServiceType st where st.category = :category")
    List<ServiceType> findByCategory(@Param("category") ServiceCategory category);

    boolean existsByName(String phone);

    @Transactional
    void deleteByName(String name);

    ServiceType findByName(String name);
}

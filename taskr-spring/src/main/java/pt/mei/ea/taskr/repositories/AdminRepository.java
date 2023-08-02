package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pt.mei.ea.taskr.models.Admin;
import pt.mei.ea.taskr.models.Client;
import pt.mei.ea.taskr.models.Provider;

import java.util.List;
import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Long> {
    boolean existsByPhone(String phone);
    List<Admin> findAllByIsDeletedIsFalse();

    @Query("SELECT a from Admin a where a.id = :id and a.isDeleted = false ")
    Optional<Admin> findByIdAndIsDeletedIsFalse(Long id);

}

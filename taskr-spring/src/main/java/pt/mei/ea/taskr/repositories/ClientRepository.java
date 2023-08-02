package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import pt.mei.ea.taskr.models.Client;
import pt.mei.ea.taskr.models.Provider;

import java.util.List;
import java.util.Optional;

public interface ClientRepository extends JpaRepository<Client,Long> {
    boolean existsByPhone(String phone);

    List<Client> findAllByIsDeletedIsFalse();

    @Query("SELECT c from Client c where c.id = :id and c.isDeleted = false ")
    Optional<Client> findByIdAndIsDeletedIsFalse(Long id);

}

package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import pt.mei.ea.taskr.models.Provider;
import pt.mei.ea.taskr.models.User;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u.id FROM User u where u.email = :email")
    Long findIdByEmail(@Param("email") String email);

    @Query("SELECT u.id FROM User u where u.phone = :phone")
    Long findIdByPhone(String phone);

    Optional<User> findByEmail(@Param("email") String email);

    List<User> findAllByIsDeletedIsFalse();

}

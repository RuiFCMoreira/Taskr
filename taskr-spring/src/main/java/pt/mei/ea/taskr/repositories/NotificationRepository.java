package pt.mei.ea.taskr.repositories;

import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import pt.mei.ea.taskr.models.Notification;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    @Transactional
    void deleteByReferTo(String referTo);
    boolean existsByReferTo(String referTo);
}

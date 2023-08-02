package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.mei.ea.taskr.models.Review;

public interface ReviewRepository extends JpaRepository<Review, Long> {
}

package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.mei.ea.taskr.models.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}

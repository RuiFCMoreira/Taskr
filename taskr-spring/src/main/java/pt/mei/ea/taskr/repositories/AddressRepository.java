package pt.mei.ea.taskr.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import pt.mei.ea.taskr.models.Address;

public interface AddressRepository extends JpaRepository<Address, Long> {
}

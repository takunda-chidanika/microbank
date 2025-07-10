package zw.co.microbank.clientservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import zw.co.microbank.clientservice.entity.Client;

/**
 * Author: tjc
 * Created on 7/10/25
 */
@Repository
public interface ClientRepository extends JpaRepository<Client, String> {

    Boolean existsByEmail(String email);
}

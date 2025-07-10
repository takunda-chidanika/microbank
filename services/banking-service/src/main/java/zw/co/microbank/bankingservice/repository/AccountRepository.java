package zw.co.microbank.bankingservice.repository;

/**
 * Author: tjc
 * Created on 7/10/25
 */

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import zw.co.microbank.bankingservice.entity.Account;

import java.math.BigDecimal;
import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, String> {
    @Query("SELECT a.balance FROM Account a WHERE a.accountNumber = :accountNumber")
    BigDecimal getBalanceByAccountNumber(@Param("accountNumber") String accountNumber);

    Optional<Account> findAccountByAccountNumber(String accountNumber);
}

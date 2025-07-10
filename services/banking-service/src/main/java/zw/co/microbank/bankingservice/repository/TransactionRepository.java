package zw.co.microbank.bankingservice.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import zw.co.microbank.bankingservice.entity.Account;
import zw.co.microbank.bankingservice.entity.Transaction;
import zw.co.microbank.bankingservice.enums.TransactionType;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Author: tjc
 * Created on 7/10/25
 */
@Repository
public interface TransactionRepository extends JpaRepository<Transaction, String> {
    List<Transaction> findAllByAccount(Account account);

    @Query("""
        SELECT t
        FROM Transaction t
        WHERE t.account.accountNumber = :accountNumber
          AND t.createdAt BETWEEN :startDate AND :endDate
        ORDER BY t.createdAt DESC
    """)
    List<Transaction> getTransactionsByDateRange(
            @Param("accountNumber") String accountNumber,
            @Param("startDate") LocalDateTime startDate,
            @Param("endDate") LocalDateTime endDate
    );
}

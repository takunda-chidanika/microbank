package zw.co.microbank.bankingservice.entity;

import jakarta.persistence.*;
import lombok.*;
import zw.co.microbank.bankingservice.enums.TransactionType;

import java.math.BigDecimal;

/**
 * Author: tjc
 * Created on 7/10/25
 */
@Entity
@Getter
@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "transactions")
public class Transaction extends BaseEntity{

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "account_id", nullable = false)
    private Account account;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false)
    private BigDecimal amount;

}

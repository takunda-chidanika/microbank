package zw.co.microbank.bankingservice.dto;

import zw.co.microbank.bankingservice.enums.TransactionType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public record TransactionResponse(
        String id,
        String accountNumber,
        BigDecimal amount,
        TransactionType type,
        LocalDateTime createdAt
) {
}

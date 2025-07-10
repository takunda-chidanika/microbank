package zw.co.microbank.bankingservice.dto;

import zw.co.microbank.bankingservice.enums.TransactionType;

import java.math.BigDecimal;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public record CreateTransactionRequest(
        String accountNumber,
        BigDecimal amount,
        TransactionType type
) {
}

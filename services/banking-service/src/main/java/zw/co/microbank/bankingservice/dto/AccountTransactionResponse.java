package zw.co.microbank.bankingservice.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public record AccountTransactionResponse(
        String accountNumber,
        BigDecimal balance,
        List<TransactionResponse> transactions
) {
}

package zw.co.microbank.bankingservice.dto;

import java.math.BigDecimal;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public record AccountResponse(
        String id,
        String clientId,
        String accountNumber,
        BigDecimal balance
) {
}

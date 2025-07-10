package zw.co.microbank.bankingservice.mapper;

import zw.co.microbank.bankingservice.dto.AccountResponse;
import zw.co.microbank.bankingservice.dto.CreateAccountRequest;
import zw.co.microbank.bankingservice.entity.Account;

import java.util.List;
import java.util.UUID;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public class AccountMapper {
    /* Map To Account */
    public static Account mapToAccount(CreateAccountRequest request) {

        return Account.builder()
                .clientId(request.clientId())
                .accountNumber(UUID.randomUUID().toString())
                .authorisationCode(request.authorisationCode())
                .balance(request.initialBalance())
                .build();
    }

    /* Map To Account Response*/
    public static AccountResponse mapToAccountResponse(Account account) {
        return new AccountResponse(
                account.getId(),
                account.getClientId(),
                account.getAccountNumber(),
                account.getBalance()
        );
    }

    /* Map to Account Response*/
    public static List<AccountResponse> mapToAccountResponses(List<Account> accounts) {
        return accounts.stream().map(AccountMapper::mapToAccountResponse).toList();
    }
}

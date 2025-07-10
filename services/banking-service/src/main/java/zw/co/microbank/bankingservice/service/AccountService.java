package zw.co.microbank.bankingservice.service;

import zw.co.microbank.bankingservice.dto.AccountResponse;
import zw.co.microbank.bankingservice.dto.CreateAccountRequest;

import java.math.BigDecimal;
import java.util.List;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public interface AccountService {
    //    Create Account
    AccountResponse createAccount(CreateAccountRequest request);

    // Get an account by client id
    AccountResponse getAccountByClientId(String clientId);

    //    Get an account by id
    AccountResponse getAccountById(String id);

    //    Get an account by account number
    AccountResponse getAccountByAccountNumber(String accountNumber);

    //    Get all accounts
    List<AccountResponse> getAllAccounts();

    //    Get account balance
    BigDecimal getAccountBalance(String accountNumber);
}

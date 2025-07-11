package zw.co.microbank.bankingservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import zw.co.microbank.bankingservice.dto.AccountResponse;
import zw.co.microbank.bankingservice.dto.CreateAccountRequest;
import zw.co.microbank.bankingservice.entity.Account;
import zw.co.microbank.bankingservice.exception.ResourceNotFoundException;
import zw.co.microbank.bankingservice.mapper.AccountMapper;
import zw.co.microbank.bankingservice.repository.AccountRepository;
import zw.co.microbank.bankingservice.service.AccountService;

import java.math.BigDecimal;
import java.util.List;
import java.util.Random;

/**
 * Author: tjc
 * Created on 7/10/25
 */
@Service
@RequiredArgsConstructor
public class AccountServiceImpl implements AccountService {
    private final AccountRepository accountRepository;

    @Override
    public AccountResponse createAccount(CreateAccountRequest request) {
        var generatedAccount = generateUniqueAccountNumber();
        var account = AccountMapper.mapToAccount(request, generatedAccount);
        var createdAccount = accountRepository.save(account);
        return AccountMapper.mapToAccountResponse(createdAccount);
    }

    @Override
    public AccountResponse getAccountByClientId(String clientId) {
        var account = accountRepository.findAccountByClientId(clientId).orElseThrow(
                () -> new ResourceNotFoundException("Account not found")
        );
        return AccountMapper.mapToAccountResponse(account);
    }

    @Override
    public AccountResponse getAccountById(String id) {
        var account = accountRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Account", id)
        );
        return AccountMapper.mapToAccountResponse(account);
    }

    @Override
    public AccountResponse getAccountByAccountNumber(String accountNumber) {
        Account account = accountRepository.findAccountByAccountNumber(accountNumber).orElseThrow(
                () -> new ResourceNotFoundException("Account", accountNumber)
        );

        return AccountMapper.mapToAccountResponse(account);
    }

    @Override
    public List<AccountResponse> getAllAccounts() {
        return AccountMapper.mapToAccountResponses(accountRepository.findAll());
    }

    @Override
    public BigDecimal getAccountBalance(String accountNumber) {
        return accountRepository.getBalanceByAccountNumber(accountNumber);
    }

    private String generateUniqueAccountNumber() {
        String accountNumber;
        do {
            accountNumber = String.format("%06d", new Random().nextInt(1000000));
        } while (accountRepository.existsByAccountNumber(accountNumber));
        return accountNumber;
    }
}

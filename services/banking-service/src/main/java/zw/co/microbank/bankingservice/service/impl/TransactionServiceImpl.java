package zw.co.microbank.bankingservice.service.impl;

import ch.qos.logback.core.net.server.Client;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import zw.co.microbank.bankingservice.dto.AccountTransactionResponse;
import zw.co.microbank.bankingservice.dto.CreateTransactionRequest;
import zw.co.microbank.bankingservice.dto.TransactionResponse;
import zw.co.microbank.bankingservice.entity.Account;
import zw.co.microbank.bankingservice.entity.Transaction;
import zw.co.microbank.bankingservice.enums.TransactionType;
import zw.co.microbank.bankingservice.exception.InvalidTransactionAmountException;
import zw.co.microbank.bankingservice.exception.ResourceNotFoundException;
import zw.co.microbank.bankingservice.mapper.TransactionMapper;
import zw.co.microbank.bankingservice.repository.AccountRepository;
import zw.co.microbank.bankingservice.repository.TransactionRepository;
import zw.co.microbank.bankingservice.service.TransactionService;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Author: tjc
 * Created on 7/10/25
 */
@Slf4j
@Service
@RequiredArgsConstructor
@Transactional
public class TransactionServiceImpl implements TransactionService {
    private final TransactionRepository transactionRepository;
    private final AccountRepository accountRepository;

    @Override
    public TransactionResponse createTransaction(CreateTransactionRequest request) {
        Account account = getAccount(request.accountNumber());

        BigDecimal newBalance = calculateNewBalance(request, account);
        var newTransaction = Transaction.builder()
                .amount(request.amount())
                .type(request.type())
                .account(account)
                .build();

        account.setBalance(newBalance);
        accountRepository.save(account);
        var savedTransaction = transactionRepository.save(newTransaction);
        return TransactionMapper.mapToTransactionResponse(savedTransaction);
    }

    @Override
    public List<TransactionResponse> getTransactionsByAccountNumber(String accountNumber) {
        List<Transaction> transactions = getTransactions(accountNumber);
        return TransactionMapper.mapToTransactionResponses(transactions);
    }

    @Override
    public AccountTransactionResponse getAllTransactionsByAccountNumber(String accountNumber) {
        var account = getAccount(accountNumber);
        var transactions = transactionRepository.findAllByAccount(account);
        return TransactionMapper.mapToAccountTransactionResponse(account, transactions);
    }

    @Override
    public TransactionResponse getTransactionById(String transactionId) {
        var transaction = transactionRepository.findById(transactionId).orElseThrow(
                () -> new ResourceNotFoundException("Transaction", transactionId)
        );
        return TransactionMapper.mapToTransactionResponse(transaction);
    }

    @Override
    public List<TransactionResponse> getTransactionsByDateRange(String accountNumber, LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.plusDays(1).atStartOfDay().minusSeconds(1);

        var transactions = transactionRepository.getTransactionsByDateRange(
                accountNumber, startDateTime, endDateTime
        );

        return TransactionMapper.mapToTransactionResponses(transactions);
    }

    @Override
    public List<TransactionResponse> getAllTransactions() {
        var transactions = transactionRepository.findAll();
        return TransactionMapper.mapToTransactionResponses(transactions);
    }

    @Override
    public List<TransactionResponse> getTransactionsByClientId(String clientId) {

        return List.of();
    }

    //    Calculate new balance
    private BigDecimal calculateNewBalance(CreateTransactionRequest request, Account account) {
        BigDecimal amount = request.amount();

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new InvalidTransactionAmountException("Amount must be greater than zero.");
        }

        BigDecimal newBalance;

        if (request.type() == TransactionType.DEPOSIT) {
            newBalance = account.getBalance().add(amount);

        } else if (request.type() == TransactionType.WITHDRAWAL) {
            if (account.getBalance().compareTo(amount) < 0) {
                throw new InvalidTransactionAmountException("Insufficient balance for withdrawal.");
            }
            newBalance = account.getBalance().subtract(amount);

        } else {
            throw new InvalidTransactionAmountException("Invalid transaction type.");
        }
        return newBalance;
    }

    //    Get Account
    private Account getAccount(String accountNumber) {
        return accountRepository.findAccountByAccountNumber(accountNumber).orElseThrow(
                () -> new ResourceNotFoundException("Account not found.")
        );
    }

    //    Get Transactions
    private List<Transaction> getTransactions(String accountNumber) {
        var account = getAccount(accountNumber);
        return transactionRepository.findAllByAccount(account);
    }
}

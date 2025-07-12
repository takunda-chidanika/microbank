package zw.co.microbank.bankingservice.service;

import zw.co.microbank.bankingservice.dto.AccountTransactionResponse;
import zw.co.microbank.bankingservice.dto.CreateTransactionRequest;
import zw.co.microbank.bankingservice.dto.TransactionResponse;

import java.time.LocalDate;
import java.util.List;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public interface TransactionService {
    /* Create Transaction */
    TransactionResponse createTransaction(CreateTransactionRequest request);

    /* Get all transactions by account number */
    List<TransactionResponse> getTransactionsByAccountNumber(String accountNumber);

    /* Get all transactions by account */
    AccountTransactionResponse getAllTransactionsByAccountNumber(String accountNumber);

    /* Get a transaction by ID */
    TransactionResponse getTransactionById(String transactionId);

    /* Get transaction account number and date range*/
    List<TransactionResponse> getTransactionsByDateRange(String accountNumber, LocalDate startDate, LocalDate endDate);

    /* Get all transactions*/
    List<TransactionResponse> getAllTransactions();

    List<TransactionResponse> getTransactionsByClientId(String clientId);
}

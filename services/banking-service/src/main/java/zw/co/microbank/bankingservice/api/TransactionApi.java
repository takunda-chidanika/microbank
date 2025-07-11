package zw.co.microbank.bankingservice.api;

import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import zw.co.microbank.bankingservice.dto.AccountTransactionResponse;
import zw.co.microbank.bankingservice.dto.CreateTransactionRequest;
import zw.co.microbank.bankingservice.dto.TransactionResponse;
import zw.co.microbank.bankingservice.service.TransactionService;

import java.time.LocalDate;
import java.util.List;

/**
 * Author: tjc
 * Created on 7/10/25
 */
@RestController
@RequestMapping("/banks/transactions")
@RequiredArgsConstructor
public class TransactionApi {
    private final TransactionService transactionService;

    @GetMapping
    public ResponseEntity<List<TransactionResponse>> getAllTransactions() {
        List<TransactionResponse> transactions = transactionService.getAllTransactions();
        return ResponseEntity.ok(transactions);
    }

    @PostMapping
    public ResponseEntity<TransactionResponse> createTransaction(
            @RequestBody CreateTransactionRequest request) {
        TransactionResponse created = transactionService.createTransaction(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByAccountNumber(
            @PathVariable String accountNumber) {
        List<TransactionResponse> transactions =
                transactionService.getTransactionsByAccountNumber(accountNumber);
        return ResponseEntity.ok(transactions);
    }

    @GetMapping("/account/{accountNumber}/details")
    public ResponseEntity<AccountTransactionResponse> getAllTransactionsByAccountNumber(
            @PathVariable String accountNumber) {
        AccountTransactionResponse response =
                transactionService.getAllTransactionsByAccountNumber(accountNumber);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<TransactionResponse> getTransactionById(
            @PathVariable String transactionId) {
        TransactionResponse transaction = transactionService.getTransactionById(transactionId);
        return ResponseEntity.ok(transaction);
    }

    @GetMapping("/account/{accountNumber}/date-range")
    public ResponseEntity<List<TransactionResponse>> getTransactionsByDateRange(
            @PathVariable String accountNumber,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<TransactionResponse> transactions = transactionService.getTransactionsByDateRange(
                accountNumber, startDate, endDate);

        return ResponseEntity.ok(transactions);
    }

}

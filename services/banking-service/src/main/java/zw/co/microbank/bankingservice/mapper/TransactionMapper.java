package zw.co.microbank.bankingservice.mapper;

import zw.co.microbank.bankingservice.dto.AccountTransactionResponse;
import zw.co.microbank.bankingservice.dto.CreateTransactionRequest;
import zw.co.microbank.bankingservice.dto.TransactionResponse;
import zw.co.microbank.bankingservice.entity.Account;
import zw.co.microbank.bankingservice.entity.Transaction;

import java.util.List;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public class TransactionMapper {
    /* Map To Transaction */
    public static Transaction mapToTransaction(Account account, CreateTransactionRequest request) {
        return Transaction.builder()
                .account(account)
                .amount(request.amount())
                .type(request.type())
                .build();
    }

    /* Map To Transaction Response*/
    public static TransactionResponse mapToTransactionResponse(Transaction request) {
        return new TransactionResponse(
                request.getId(),
                request.getAccount().getAccountNumber(),
                request.getAmount(),
                request.getType(),
                request.getCreatedAt()
        );
    }

    /* Map to Transaction Response*/
    public static List<TransactionResponse> mapToTransactionResponses(List<Transaction> transactions) {
        return transactions.stream().map(TransactionMapper::mapToTransactionResponse).toList();
    }

    /* Map to Account Transaction Response*/
    public static AccountTransactionResponse mapToAccountTransactionResponse(Account account, List<Transaction> transactions) {
        return new AccountTransactionResponse(
                account.getAccountNumber(),
                account.getBalance(),
                mapToTransactionResponses(transactions)
        );
    }
}

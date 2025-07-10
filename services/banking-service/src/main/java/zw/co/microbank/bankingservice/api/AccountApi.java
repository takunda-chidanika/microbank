package zw.co.microbank.bankingservice.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import zw.co.microbank.bankingservice.dto.AccountResponse;
import zw.co.microbank.bankingservice.dto.CreateAccountRequest;
import zw.co.microbank.bankingservice.service.AccountService;

import java.math.BigDecimal;
import java.util.List;

/**
 * Author: tjc
 * Created on 7/10/25
 */

@RestController
@RequestMapping("/api/v1/banks/accounts")
@RequiredArgsConstructor
public class AccountApi {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(
            @RequestBody CreateAccountRequest request
    ) {
        var created = accountService.createAccount(request);
        return ResponseEntity.ok(created);
    }

    @GetMapping("/client/{clientId}")
    public ResponseEntity<AccountResponse> getByClientId(
            @PathVariable String clientId
    ) {
        var account = accountService.getAccountByClientId(clientId);
        return ResponseEntity.ok(account);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AccountResponse> getById(
            @PathVariable String id
    ) {
        var account = accountService.getAccountById(id);
        return ResponseEntity.ok(account);
    }

    @GetMapping("/number/{accountNumber}")
    public ResponseEntity<AccountResponse> getByAccountNumber(
            @PathVariable String accountNumber
    ) {
        var account = accountService.getAccountByAccountNumber(accountNumber);
        return ResponseEntity.ok(account);
    }

    @GetMapping
    public ResponseEntity<List<AccountResponse>> getAllAccounts() {
        var accounts = accountService.getAllAccounts();
        return ResponseEntity.ok(accounts);
    }

    @GetMapping("/balance/{accountNumber}")
    public ResponseEntity<BigDecimal> getAccountBalance(
            @PathVariable String accountNumber
    ) {
        var balance = accountService.getAccountBalance(accountNumber);
        return ResponseEntity.ok(balance);
    }
}

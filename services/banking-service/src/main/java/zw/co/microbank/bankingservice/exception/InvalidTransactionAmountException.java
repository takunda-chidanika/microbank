package zw.co.microbank.bankingservice.exception;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public class InvalidTransactionAmountException extends RuntimeException{
    public InvalidTransactionAmountException(String message) {
        super(message);
    }
}

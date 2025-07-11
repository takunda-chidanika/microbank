package zw.co.microbank.clientservice.exception;

/**
 * Exception thrown when a blacklisted client attempts to access services
 * Author: tjc
 * Created on 7/11/25
 */
public class ClientBlacklistedException extends RuntimeException {
    
    public ClientBlacklistedException(String message) {
        super(message);
    }
    
    public ClientBlacklistedException(String message, Throwable cause) {
        super(message, cause);
    }
}
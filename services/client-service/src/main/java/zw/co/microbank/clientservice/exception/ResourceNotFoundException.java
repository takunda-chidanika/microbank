package zw.co.microbank.clientservice.exception;

/**
 * Author: tjc
 * Created on 7/10/25
 */


public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String resourceName, String identifier) {
        super(String.format("%s with identifier '%s' was not found.", resourceName, identifier));
    }

    public ResourceNotFoundException(String message) {
        super(message);
    }
}


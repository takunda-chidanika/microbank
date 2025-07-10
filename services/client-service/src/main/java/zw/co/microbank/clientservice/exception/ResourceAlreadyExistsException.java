package zw.co.microbank.clientservice.exception;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public class ResourceAlreadyExistsException extends RuntimeException{
    public ResourceAlreadyExistsException(String entity, String fieldVariable) {
        super(String.format("%s with identifier '%s' already exists.", entity, fieldVariable));
    }

    public ResourceAlreadyExistsException(String message) {
        super(message);
    }
}

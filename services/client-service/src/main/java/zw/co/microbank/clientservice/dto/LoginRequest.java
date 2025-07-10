package zw.co.microbank.clientservice.dto;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public record LoginRequest(
        String email,
        String password
) {
}

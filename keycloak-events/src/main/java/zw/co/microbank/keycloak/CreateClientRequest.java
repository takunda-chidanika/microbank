package zw.co.microbank.keycloak;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public record CreateClientRequest(
        String userId,
        String name,
        String email
) {
}

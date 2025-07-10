package zw.co.microbank.clientservice.dto;

import java.time.LocalDateTime;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public record ClientResponse(
        String id,
        String name,
        String email,
        String keycloakId,
        LocalDateTime createAt,
        Boolean isBlacklisted
) {
}

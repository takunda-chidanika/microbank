package zw.co.microbank.clientservice.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import lombok.*;

/**
 * Author: tjc
 * Created on 7/10/25
 */

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class Client extends BaseEntity {

    @Column(unique = true, nullable = false)
    private String keycloakId;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String name;

    private Boolean blacklisted;
}

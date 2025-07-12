package zw.co.microbank.clientservice.service;

import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.representations.idm.UserRepresentation;
import zw.co.microbank.clientservice.dto.CreateClientRequest;

public interface KeycloakUserService {

    UserRepresentation createUser(CreateClientRequest request);

    UserRepresentation getUserById(String userId);

    void deleteUserById(String userId);

    void emailVerification(String userId);

    UserResource getUserResource(String userId);

    void updatePassword(String userId);
//    void updatePassword(ResetPassword resetPassword,String userId);
}

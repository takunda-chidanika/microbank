package zw.co.microbank.clientservice.service.impl;

import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.KeycloakBuilder;
import org.keycloak.admin.client.resource.RealmResource;
import org.keycloak.admin.client.resource.UserResource;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.AccessTokenResponse;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;
import zw.co.microbank.clientservice.dto.ClientResponse;
import zw.co.microbank.clientservice.dto.CreateClientRequest;
import zw.co.microbank.clientservice.mapper.ClientMapper;
import zw.co.microbank.clientservice.service.KeycloakUserService;

import java.util.*;

/**
 * Author: tjc
 * Created on 7/11/25
 */

@Slf4j
@Service
@RequiredArgsConstructor
public class KeycloakUserServiceImpl implements KeycloakUserService {

    @Value("${keycloak.realm}")
    private String realm;

    @Value("${keycloak.server-url}")
    private String serverUrl;

    @Value("${keycloak.client-id}")
    private String userClientId;

    @Value("${keycloak.client-secret}")
    private String userClientSecret;

    private final Keycloak keycloak;

    @Override
    public UserRepresentation createUser(CreateClientRequest request) {

        UserRepresentation user=new UserRepresentation();
        user.setEnabled(true);
        user.setUsername(request.email());
        user.setEmail(request.email());
        user.setEmailVerified(true);

        Map<String, List<String>> attributes = new HashMap<>();
        attributes.put("name", Collections.singletonList(request.name()));
        user.setAttributes(attributes);

        CredentialRepresentation credentialRepresentation=new CredentialRepresentation();
        credentialRepresentation.setValue(request.password());
        credentialRepresentation.setTemporary(false);
        credentialRepresentation.setType(CredentialRepresentation.PASSWORD);

        List<CredentialRepresentation> list = new ArrayList<>();
        list.add(credentialRepresentation);
        user.setCredentials(list);

        UsersResource usersResource = getUsersResource();

        Response response = usersResource.create(user);

        if(Objects.equals(201,response.getStatus())){
            List<UserRepresentation> representationList = usersResource.searchByUsername(request.email(), true);
            if(!CollectionUtils.isEmpty(representationList)){
                UserRepresentation userRepresentation1 = representationList.stream().filter(userRepresentation -> Objects.equals(true, userRepresentation.isEmailVerified())).findFirst().orElse(null);
                if(userRepresentation1 == null){
                    throw new RuntimeException("User not verified");
                }
                log.info("User created successfully: {}", userRepresentation1.getId());
                return userRepresentation1;
            }

            return null;
        }

        return null;
    }

    public AccessTokenResponse getUserAccessToken(String username, String password) {
        try {
            log.info("Attempting to get access token for user: {}", username);

            // Use RestTemplate to call Keycloak token endpoint directly
            RestTemplate restTemplate = new RestTemplate();

            // Prepare the token request
            String tokenUrl = serverUrl + "/realms/" + realm + "/protocol/openid-connect/token";
            log.info("Token URL: {}", tokenUrl);
            log.info("Using client_id: {}", userClientId);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
            body.add("grant_type", "password");
            body.add("client_id", userClientId);
            body.add("Scope", "openid profile email roles offline_access");
            body.add("username", username);
            body.add("password", password);

            // Only add client secret if provided (for confidential clients)
            if (userClientSecret != null && !userClientSecret.trim().isEmpty()) {
                body.add("client_secret", userClientSecret);
                log.info("Using client secret");
            } else {
                log.info("No client secret - using public client");
            }

            HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);

            // Make the request
            ResponseEntity<Map> response = restTemplate.postForEntity(tokenUrl, request, Map.class);

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> tokenData = response.getBody();

                // Convert to AccessTokenResponse
                AccessTokenResponse tokenResponse = new AccessTokenResponse();
                tokenResponse.setToken((String) tokenData.get("access_token"));
                tokenResponse.setRefreshToken((String) tokenData.get("refresh_token"));
                tokenResponse.setExpiresIn(((Number) tokenData.get("expires_in")).longValue());
                tokenResponse.setTokenType((String) tokenData.get("token_type"));
                tokenResponse.setScope((String) tokenData.get("scope"));

                log.info("Successfully obtained access token for user: {}", username);
                log.info("Token expires in: {} seconds", tokenResponse.getExpiresIn());

                return tokenResponse;
            } else {
                throw new RuntimeException("Failed to get token: " + response.getStatusCode());
            }

        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("HTTP Error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            log.error("Request failed for user: {}", username);
            throw new RuntimeException("Authentication failed: " + e.getMessage() + " - " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            log.error("Failed to get access token for user: {}, Error: {}", username, e.getMessage());
            throw new RuntimeException("Failed to authenticate user: " + e.getMessage(), e);
        }
    }

    private UsersResource getUsersResource() {
        RealmResource realm1 = keycloak.realm(realm);
        return realm1.users();
    }

    @Override
    public UserRepresentation getUserById(String userId) {
        return  getUsersResource().get(userId).toRepresentation();
    }

    @Override
    public void deleteUserById(String userId) {
        getUsersResource().delete(userId);
    }

    @Override
    public void emailVerification(String userId){
        UsersResource usersResource = getUsersResource();
        usersResource.get(userId).sendVerifyEmail();
    }

    public UserResource getUserResource(String userId){
        UsersResource usersResource = getUsersResource();
        return usersResource.get(userId);
    }

    @Override
    public void updatePassword(String userId) {
        UserResource userResource = getUserResource(userId);
        List<String> actions= new ArrayList<>();
        actions.add("UPDATE_PASSWORD");
        userResource.executeActionsEmail(actions);
    }
}
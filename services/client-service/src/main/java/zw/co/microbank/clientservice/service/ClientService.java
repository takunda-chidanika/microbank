package zw.co.microbank.clientservice.service;

import org.keycloak.representations.AccessTokenResponse;
import zw.co.microbank.clientservice.dto.ClientResponse;
import zw.co.microbank.clientservice.dto.CreateClientRequest;
import zw.co.microbank.clientservice.dto.LoginRequest;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public interface ClientService {
    // Client Creation and Registration
    ClientResponse createClient(CreateClientRequest request);

    // Client Login
    AccessTokenResponse loginClient(LoginRequest request);

    //    Fetch current client profile
    ClientResponse fetchClientProfile(String id);
    
    // Fetch client profile by Keycloak ID
    ClientResponse fetchClientProfileByKeycloakId(String keycloakId);
}

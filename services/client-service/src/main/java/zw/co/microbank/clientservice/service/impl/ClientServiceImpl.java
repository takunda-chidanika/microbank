package zw.co.microbank.clientservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.stereotype.Service;
import zw.co.microbank.clientservice.dto.ClientResponse;
import zw.co.microbank.clientservice.dto.CreateClientRequest;
import zw.co.microbank.clientservice.dto.LoginRequest;
import zw.co.microbank.clientservice.entity.Client;
import zw.co.microbank.clientservice.exception.ClientBlacklistedException;
import zw.co.microbank.clientservice.exception.ResourceAlreadyExistsException;
import zw.co.microbank.clientservice.exception.ResourceNotFoundException;
import zw.co.microbank.clientservice.mapper.ClientMapper;
import zw.co.microbank.clientservice.repository.ClientRepository;
import zw.co.microbank.clientservice.service.ClientService;


/**
 * Author: tjc
 * Created on 7/10/25
 */

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final KeycloakUserServiceImpl keycloakUserService;
    private final ClientRepository clientRepository;
//    private final KeycloakUserService keycloakUserService;

    @Override
    public ClientResponse createClient(CreateClientRequest request) {

        var clientExistByEmail = clientRepository.existsByEmail(request.email());

        var keycloakId = keycloakUserService.createUser(request).getId();

        keycloakUserService.createUser(request);

        if (!clientExistByEmail) {

            var clientRequest = Client.builder()
                    .name(request.name())
                    .email(request.email())
                    .keycloakId(keycloakId)
                    .blacklisted(false)
                    .build();

            var client = clientRepository.save(clientRequest);

            return ClientMapper.mapToClientResponse(client);
        } else {
            throw new ResourceAlreadyExistsException("Client", request.email());
        }
    }

    @Override
    public AccessTokenResponse loginClient(LoginRequest request) {
        return keycloakUserService.getUserAccessToken(request.email(), request.password());
    }

    @Override
    public ClientResponse fetchClientProfile(String id) {
        var client = clientRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Client", id)
        );

        // Check if client is blacklisted
        if (client.getBlacklisted() != null && client.getBlacklisted()) {
            throw new ClientBlacklistedException("Client is blacklisted and cannot access services");
        }

        return ClientMapper.mapToClientResponse(client);
    }

    @Override
    public ClientResponse fetchClientProfileByKeycloakId(String keycloakId) {
        var client = clientRepository.findByKeycloakId(keycloakId).orElseThrow(
                () -> new ResourceNotFoundException("Client", keycloakId)
        );

        // Check if client is blacklisted
        if (client.getBlacklisted() != null && client.getBlacklisted()) {
            throw new ClientBlacklistedException("Client is blacklisted and cannot access services");
        }

        return ClientMapper.mapToClientResponse(client);
    }

}

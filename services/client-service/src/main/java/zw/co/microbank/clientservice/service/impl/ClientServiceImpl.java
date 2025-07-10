package zw.co.microbank.clientservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import zw.co.microbank.clientservice.dto.ClientResponse;
import zw.co.microbank.clientservice.dto.CreateClientRequest;
import zw.co.microbank.clientservice.dto.LoginRequest;
import zw.co.microbank.clientservice.entity.Client;
import zw.co.microbank.clientservice.exception.ResourceAlreadyExistsException;
import zw.co.microbank.clientservice.exception.ResourceNotFoundException;
import zw.co.microbank.clientservice.mapper.ClientMapper;
import zw.co.microbank.clientservice.repository.ClientRepository;
import zw.co.microbank.clientservice.service.ClientService;

import java.util.UUID;

/**
 * Author: tjc
 * Created on 7/10/25
 */

@Service
@RequiredArgsConstructor
public class ClientServiceImpl implements ClientService {
    private final ClientRepository clientRepository;

    @Override
    public ClientResponse createClient(CreateClientRequest request) {

        var clientExistByEmail = clientRepository.existsByEmail(request.email());

        if (!clientExistByEmail) {
            //  Create Keycloak client and retrieve the keycloak id
            var keycloakId = "123456";

            var clientRequest = Client.builder()
                    .name(request.name())
                    .email(request.email())
                    .keycloakId(UUID.randomUUID().toString())
                    .blacklisted(false)
                    .build();

            var client = clientRepository.save(clientRequest);

            return ClientMapper.mapToClientResponse(client);
        } else {
            throw new ResourceAlreadyExistsException("Client", request.email());
        }
    }

    @Override
    public ClientResponse loginClient(LoginRequest request) {
//        Handle Keycloak login and return the user information
        return null;
    }

    @Override
    public ClientResponse fetchClientProfile(String id) {
        var client = clientRepository.findById(id).orElseThrow(
                () -> new ResourceNotFoundException("Client", id)
        );
        return ClientMapper.mapToClientResponse(client);
    }

}

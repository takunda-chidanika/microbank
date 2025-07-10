package zw.co.microbank.clientservice.mapper;

import zw.co.microbank.clientservice.dto.ClientResponse;
import zw.co.microbank.clientservice.dto.CreateClientRequest;
import zw.co.microbank.clientservice.entity.Client;

import java.util.List;
import java.util.UUID;

/**
 * Author: tjc
 * Created on 7/10/25
 */

public class ClientMapper {
    public static Client mapToClient(CreateClientRequest request, UUID keycloakId) {
        return Client.builder()
                .name(request.name())
                .email(request.email())
                .keycloakId(keycloakId.toString())
                .blacklisted(false)
                .build();
    }

    public static ClientResponse mapToClientResponse(Client client) {
        return new ClientResponse(
                client.getId(),
                client.getName(),
                client.getEmail(),
                client.getKeycloakId(),
                client.getCreatedAt(),
                client.getBlacklisted()
        );
    }

    public static List<ClientResponse> mapToClientResponses(List<Client> clients) {
        return clients.stream().map(ClientMapper::mapToClientResponse).toList();
    }
}

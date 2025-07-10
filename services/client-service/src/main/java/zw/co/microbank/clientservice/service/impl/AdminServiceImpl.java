package zw.co.microbank.clientservice.service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import zw.co.microbank.clientservice.dto.ClientResponse;
import zw.co.microbank.clientservice.exception.ResourceNotFoundException;
import zw.co.microbank.clientservice.mapper.ClientMapper;
import zw.co.microbank.clientservice.repository.ClientRepository;
import zw.co.microbank.clientservice.service.AdminService;

import java.util.List;

/**
 * Author: tjc
 * Created on 7/10/25
 */

@Service
@RequiredArgsConstructor
public class AdminServiceImpl implements AdminService {
    private final ClientRepository clientRepository;


    @Override
    public ClientResponse blacklistClient(String clientId) {
        var client = clientRepository.findById(clientId).orElseThrow(
                () -> new ResourceNotFoundException("Client not found")
        );

        client.setBlacklisted(true);
        var blacklistedClient  = clientRepository.save(client);
        return ClientMapper.mapToClientResponse(blacklistedClient);
    }

    @Override
    public ClientResponse unBlacklistClient(String clientId) {
        var client = clientRepository.findById(clientId).orElseThrow(
                () -> new ResourceNotFoundException("Client not found")
        );

        client.setBlacklisted(false);
        var unBlacklistedClient  = clientRepository.save(client);
        return ClientMapper.mapToClientResponse(unBlacklistedClient);
    }

    @Override
    public List<ClientResponse> getAllClients() {
        var clients = clientRepository.findAll();
        return ClientMapper.mapToClientResponses(clients);
    }
}

package zw.co.microbank.clientservice.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import zw.co.microbank.clientservice.dto.ClientResponse;
import zw.co.microbank.clientservice.dto.CreateClientRequest;
import zw.co.microbank.clientservice.dto.LoginRequest;
import zw.co.microbank.clientservice.service.ClientService;

/**
 * Author: tjc
 * Created on 7/10/25
 */
@RestController
@RequestMapping("/api/v1/clients")
@RequiredArgsConstructor
public class ClientApi {
    private final ClientService clientService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ClientResponse createClient(@RequestBody CreateClientRequest request){
        return clientService.createClient(request);
    }

    @PostMapping("/login")
    public ClientResponse loginClient(@RequestBody LoginRequest request){
        return clientService.loginClient(request);
    }

    @GetMapping("/profile/{id}")
    public ClientResponse fetchClientProfile(@PathVariable String id){
        return clientService.fetchClientProfile(id);
    }

}

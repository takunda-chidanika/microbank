package zw.co.microbank.clientservice.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import zw.co.microbank.clientservice.dto.ClientResponse;
import zw.co.microbank.clientservice.service.AdminService;

/**
 * Author: tjc
 * Created on 7/10/25
 */

@RestController
@RequestMapping("/clients/admin")
@RequiredArgsConstructor
public class AdminApi {
    private final AdminService adminService;

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{clientId}/blacklist")
    public ResponseEntity<ClientResponse> blacklistClient(@PathVariable String clientId) {
        var blacklistedClient = adminService.blacklistClient(clientId);
        return ResponseEntity.ok(blacklistedClient);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PatchMapping("/{clientId}/unblacklist")
    public ResponseEntity<ClientResponse> unBlacklistClient(@PathVariable String clientId) {
        var unblacklistedClient = adminService.unBlacklistClient(clientId);
        return ResponseEntity.ok(unblacklistedClient);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping()
    public ResponseEntity<Iterable<ClientResponse>> getAllClients() {
        var clients = adminService.getAllClients();
        return ResponseEntity.ok().body(clients);
    }

}

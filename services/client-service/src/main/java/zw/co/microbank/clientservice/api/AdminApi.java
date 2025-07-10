package zw.co.microbank.clientservice.api;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import zw.co.microbank.clientservice.dto.ClientResponse;
import zw.co.microbank.clientservice.service.AdminService;

/**
 * Author: tjc
 * Created on 7/10/25
 */

@RestController
@RequestMapping("/api/v1/clients/admin")
@RequiredArgsConstructor
//@PreAuthorize("hasRole('ADMIN')")
public class AdminApi {
    private final AdminService adminService;

    @PatchMapping("/{clientId}/blacklist")
    public ResponseEntity<ClientResponse> blacklistClient(@PathVariable String clientId) {
        var blacklistedClient = adminService.blacklistClient(clientId);
        return ResponseEntity.ok(blacklistedClient);
    }

    @PatchMapping("/{clientId}/unblacklist")
    public ResponseEntity<ClientResponse> unBlacklistClient(@PathVariable String clientId) {
        var unblacklistedClient = adminService.unBlacklistClient(clientId);
        return ResponseEntity.ok(unblacklistedClient);
    }

    @GetMapping()
    public ResponseEntity<Iterable<ClientResponse>> getAllClients() {
        var clients = adminService.getAllClients();
        return ResponseEntity.ok().body(clients);
    }

}

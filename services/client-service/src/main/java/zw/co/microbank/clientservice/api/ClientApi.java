package zw.co.microbank.clientservice.api;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.keycloak.representations.AccessTokenResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
@RequestMapping("/clients")
@RequiredArgsConstructor
public class ClientApi {
    private final ClientService clientService;

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ClientResponse createClient(@RequestBody CreateClientRequest request){
        return clientService.createClient(request);
    }

    @PostMapping("/login")
    public AccessTokenResponse loginClient(@RequestBody LoginRequest request){
        return clientService.loginClient(request);
    }

    @GetMapping("/profile/{id}")
    public ClientResponse fetchClientProfile(@PathVariable String id){
        return clientService.fetchClientProfile(id);
    }

    @GetMapping("/profile/keycloak/{keycloakId}")
    public ClientResponse fetchClientProfileByKeycloakId(@PathVariable String keycloakId){
        return clientService.fetchClientProfileByKeycloakId(keycloakId);
    }

    @PostMapping("/logout")
    public ResponseEntity<String> logoutClient(HttpServletRequest request, HttpServletResponse response) {
        // Clear any server-side session data if needed
        // This is mainly for cleanup purposes since we're using JWT
        
        // Clear cookies on the server side
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (cookie.getName().startsWith("next-auth") || 
                    cookie.getName().startsWith("__Secure-next-auth") || 
                    cookie.getName().startsWith("__Host-next-auth")) {
                    Cookie clearCookie = new Cookie(cookie.getName(), "");
                    clearCookie.setMaxAge(0);
                    clearCookie.setPath("/");
                    clearCookie.setHttpOnly(true);
                    clearCookie.setSecure(true);
                    response.addCookie(clearCookie);
                }
            }
        }
        
        return ResponseEntity.ok("{\"message\":\"Logout successful\"}");
    }

}

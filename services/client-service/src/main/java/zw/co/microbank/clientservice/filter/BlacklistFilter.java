package zw.co.microbank.clientservice.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import zw.co.microbank.clientservice.repository.ClientRepository;

import java.io.IOException;

/**
 * Filter to check if a client is blacklisted before processing requests
 * Author: tjc
 * Created on 7/11/25
 */
@Component
@RequiredArgsConstructor
@Slf4j
public class BlacklistFilter extends OncePerRequestFilter {

    private final ClientRepository clientRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // Skip blacklist check for public endpoints
        String requestPath = request.getRequestURI();
        if (isPublicEndpoint(requestPath)) {
            filterChain.doFilter(request, response);
            return;
        }

        // Get the authentication from SecurityContext
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        
        if (authentication instanceof JwtAuthenticationToken jwtToken) {
            // Extract Keycloak ID from JWT token
            String keycloakId = jwtToken.getToken().getSubject();
            
            if (keycloakId != null) {
                // Check if client is blacklisted
                var clientOpt = clientRepository.findByKeycloakId(keycloakId);
                
                if (clientOpt.isPresent() && clientOpt.get().getBlacklisted() != null && clientOpt.get().getBlacklisted()) {
                    log.warn("Blocked request from blacklisted client: {}", keycloakId);
                    response.setStatus(HttpServletResponse.SC_FORBIDDEN);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"error\":\"Client is blacklisted and cannot access services\"}");
                    return;
                }
            }
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }

    private boolean isPublicEndpoint(String requestPath) {
        return requestPath.startsWith("/clients/register") || 
               requestPath.startsWith("/clients/login") ||
               requestPath.startsWith("/clients/admin") ||
               requestPath.startsWith("/swagger-ui") ||
               requestPath.startsWith("/v3/api-docs") ||
               requestPath.startsWith("/actuator");
    }
}
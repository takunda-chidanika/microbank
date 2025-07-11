package zw.co.microbank.bankingservice.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.Instant;
import java.util.stream.Collectors;

/**
 * Author: tjc
 * Created on 7/10/25
 */

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(InvalidTransactionAmountException.class)
    public ProblemDetail handleInsufficientBalanceException(InvalidTransactionAmountException e) {
        var problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.BAD_REQUEST,
                e.getMessage()
        );
        problemDetail.setTitle("Insufficient Balance");

        return problemDetail;
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ProblemDetail handleResourceAlreadyExistsException(ResourceAlreadyExistsException e) {
        var problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.CONFLICT,
                e.getMessage()
        );
        problemDetail.setTitle("Conflict");

        return problemDetail;
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ProblemDetail handleResourceNotFoundException(ResourceNotFoundException e) {
        var problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.NOT_FOUND,
                e.getMessage()
        );
        problemDetail.setTitle("Not Found");

        return problemDetail;
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ProblemDetail handleAccessDeniedException(
            org.springframework.security.access.AccessDeniedException e,
            HttpServletRequest request) {

        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String userRoles = getUserRoles(auth);
        String username = auth != null ? auth.getName() : "Anonymous";

        log.warn("Access denied - User: {} with roles [{}] tried to access: {} {}",
                username, userRoles, request.getMethod(), request.getRequestURI());

        var problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.FORBIDDEN,
                "You don't have sufficient privileges to access this resource"
        );

        problemDetail.setTitle("Access Denied");
        problemDetail.setProperty("timestamp", Instant.now());
        problemDetail.setProperty("path", request.getRequestURI());
        problemDetail.setProperty("method", request.getMethod());
        problemDetail.setProperty("userRole", userRoles);
        problemDetail.setProperty("username", username);
        problemDetail.setProperty("requiredRole", "ADMIN"); // You can make this dynamic

        return problemDetail;
    }

    @ExceptionHandler(org.springframework.security.core.AuthenticationException.class)
    public ProblemDetail handleAuthenticationException(
            org.springframework.security.core.AuthenticationException e,
            HttpServletRequest request) {

        log.warn("Authentication failed for request: {} {} - {}",
                request.getMethod(), request.getRequestURI(), e.getMessage());

        var problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.UNAUTHORIZED,
                "Authentication failed. Please provide valid credentials."
        );

        problemDetail.setTitle("Authentication Required");
        problemDetail.setProperty("timestamp", Instant.now());
        problemDetail.setProperty("path", request.getRequestURI());
        problemDetail.setProperty("details", "Provide a valid JWT token in the Authorization header");

        return problemDetail;
    }

    @ExceptionHandler(org.springframework.security.oauth2.jwt.JwtException.class)
    public ProblemDetail handleJwtException(
            org.springframework.security.oauth2.jwt.JwtException e,
            HttpServletRequest request) {

        log.warn("JWT validation failed for request: {} {} - {}",
                request.getMethod(), request.getRequestURI(), e.getMessage());

        var problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.UNAUTHORIZED,
                "Invalid or expired JWT token"
        );

        problemDetail.setTitle("Invalid Token");
        problemDetail.setProperty("timestamp", Instant.now());
        problemDetail.setProperty("path", request.getRequestURI());
        problemDetail.setProperty("details", "Please obtain a new token or refresh your current token");

        return problemDetail;
    }

    @ExceptionHandler(Exception.class)
    public ProblemDetail handleGeneralException(Exception e, HttpServletRequest request) {
        log.error("Unexpected error occurred: ", e);

        var problemDetail = ProblemDetail.forStatusAndDetail(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "An unexpected error occurred"
        );

        problemDetail.setTitle("Internal Server Error");
        problemDetail.setProperty("timestamp", Instant.now());
        problemDetail.setProperty("path", request.getRequestURI());

        return problemDetail;
    }

    private String getUserRoles(Authentication auth) {
        if (auth == null || auth.getAuthorities() == null) {
            return "No roles";
        }

        return auth.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .collect(Collectors.joining(", "));
    }
}

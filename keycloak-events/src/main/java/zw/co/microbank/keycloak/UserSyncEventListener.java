package zw.co.microbank.keycloak;

/**
 * Author: tjc
 * Created on 7/10/25
 */
import com.fasterxml.jackson.databind.ObjectMapper;
import org.keycloak.events.Event;
import org.keycloak.events.EventListenerProvider;
import org.keycloak.events.EventType;
import org.keycloak.models.KeycloakSession;
import org.keycloak.models.RealmModel;
import org.keycloak.models.UserModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;

public class UserSyncEventListener implements EventListenerProvider {

    private static final Logger logger = LoggerFactory.getLogger(UserSyncEventListener.class);
    private final KeycloakSession session;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public UserSyncEventListener(KeycloakSession session) {
        this.session = session;
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public void onEvent(Event event) {
        if (event.getType().equals(EventType.REGISTER)) {
            try {
                String userId = event.getUserId();
                String realmId = event.getRealmId();

                if (userId == null || realmId == null) {
                    logger.warn("Missing userId or realmId in registration event");
                    return;
                }

                RealmModel realm = session.realms().getRealm(realmId);
                if (realm == null) {
                    logger.warn("Realm not found: {}", realmId);
                    return;
                }

                UserModel user = session.users().getUserById(realm, userId);
                if (user == null) {
                    logger.warn("User not found: {} in realm: {}", userId, realmId);
                    return;
                }

                String firstName = user.getFirstName();
                String lastName = user.getLastName();
                String email = user.getEmail();

                // Handle null values gracefully
                String name = buildFullName(firstName, lastName);

                if (email == null) {
                    logger.warn("User {} has no email address", userId);
                    return;
                }

                CreateClientRequest payload = new CreateClientRequest(userId, name, email);
                sendToLocalService(payload);

            } catch (Exception e) {
                logger.error("Error processing registration event", e);
            }
        }
    }

    private String buildFullName(String firstName, String lastName) {
        if (firstName == null && lastName == null) {
            return "Unknown User";
        }
        if (firstName == null) {
            return lastName;
        }
        if (lastName == null) {
            return firstName;
        }
        return firstName + " " + lastName;
    }

    private void sendToLocalService(CreateClientRequest payload) {
        try {
            String body = objectMapper.writeValueAsString(payload);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://client-service:8081/api/clients"))
                    .header("Content-Type", "application/json")
                    .timeout(Duration.ofSeconds(30))
                    .POST(HttpRequest.BodyPublishers.ofString(body))
                    .build();

            // Send asynchronously but handle the response
            httpClient.sendAsync(request, HttpResponse.BodyHandlers.ofString())
                    .thenAccept(response -> {
                        if (response.statusCode() >= 200 && response.statusCode() < 300) {
                            logger.info("Successfully synced user {} to client service", payload.userId());
                        } else {
                            logger.error("Failed to sync user {} to client service. Status: {}, Response: {}",
                                    payload.userId(), response.statusCode(), response.body());
                        }
                    })
                    .exceptionally(throwable -> {
                        logger.error("Error sending user sync request for user {}", payload.userId(), throwable);
                        return null;
                    });

        } catch (Exception e) {
            logger.error("Error preparing user sync request", e);
        }
    }

    @Override
    public void close() {
        // HttpClient doesn't need explicit closing in Java 11+
    }

    @Override
    public void onEvent(org.keycloak.events.admin.AdminEvent adminEvent, boolean includeRepresentation) {
        // Handle admin events if needed
    }
}
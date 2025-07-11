# MicroBank - Complete Banking Solution

## Table of Contents
1. [Overview](#overview)
2. [Project Architecture](#project-architecture)
3. [Prerequisites](#prerequisites)
4. [Backend Setup](#backend-setup)
5. [Frontend Setup](#frontend-setup)
6. [Keycloak Configuration](#keycloak-configuration)
7. [Running the Application](#running-the-application)
8. [API Documentation](#api-documentation)
9. [Features & Functionality](#features--functionality)
10. [User Guide](#user-guide)
11. [Admin Guide](#admin-guide)
12. [Troubleshooting](#troubleshooting)
13. [Development Guide](#development-guide)

---

## Overview

MicroBank is a comprehensive banking application built with modern microservices architecture. The system provides secure banking services including account management, transactions, and administrative functions. It's designed to serve modern banking needs with proper security and compliance features.

### Key Features
- **Secure Authentication**: Keycloak-based OAuth2/JWT authentication
- **Account Management**: Create and manage banking accounts
- **Transaction Processing**: Deposits, withdrawals, and transfers
- **Administrative Tools**: Client management and system oversight
- **Modern UI**: Responsive web interface with professional styling
- **Microservices Architecture**: Scalable and maintainable backend
- **Real-time Monitoring**: JWT token debugging and API request logging

---

## Project Architecture

### Backend Services
```
microbank/
├── services/
│   ├── api-gateway/          # API Gateway (Port 9393)
│   ├── banking-service/      # Banking operations
│   ├── client-service/       # Client management
│   ├── config-server/        # Configuration management (Port 9090)
│   └── discovery-service/    # Service discovery
├── client/                   # Frontend application (Port 4200)
└── keycloak-events/         # Keycloak integration
```

### Technology Stack

**Backend:**
- Java 17+ with Spring Boot
- Spring Cloud Gateway
- Spring Security with OAuth2
- JPA/Hibernate for database operations
- PostgreSQL/MySQL database
- Maven for dependency management

**Frontend:**
- Next.js 15 with TypeScript
- Tailwind CSS for styling
- NextAuth.js for authentication
- React hooks for state management

**Authentication:**
- Keycloak Server (Port 8080)
- OAuth2/OpenID Connect
- JWT tokens with role-based access

---

## Prerequisites

Before setting up MicroBank, ensure you have the following installed:

### System Requirements
- **Java Development Kit (JDK) 17 or higher**
- **Node.js 18+ and npm**
- **PostgreSQL or MySQL database**
- **Keycloak Server 20+**
- **Git** for version control
- **Maven 3.8+** for Java builds

### Development Tools (Recommended)
- IntelliJ IDEA or Eclipse for Java development
- Visual Studio Code for frontend development
- Postman for API testing
- DBeaver for database management

---

## Backend Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd microbank
```

### 2. Database Setup
Create databases for each service:
```sql
-- PostgreSQL
CREATE DATABASE microbank_clients;
CREATE DATABASE microbank_banking;
CREATE DATABASE microbank_config;

-- Create user
CREATE USER microbank_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE microbank_clients TO microbank_user;
GRANT ALL PRIVILEGES ON DATABASE microbank_banking TO microbank_user;
GRANT ALL PRIVILEGES ON DATABASE microbank_config TO microbank_user;
```

### 3. Configure Application Properties
Update `application.yml` files in each service:

**services/config-server/src/main/resources/application.yml**
```yaml
server:
  port: 9090

spring:
  application:
    name: config-server
  cloud:
    config:
      server:
        git:
          uri: file://${user.home}/microbank-config
          default-label: main
```

**services/banking-service/src/main/resources/application.yml**
```yaml
spring:
  config:
    import: optional:configserver:http://localhost:9090
  application:
    name: banking-service
  datasource:
    url: jdbc:postgresql://localhost:5432/microbank_banking
    username: microbank_user
    password: your_password
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/microbank
          jwk-set-uri: ${spring.security.oauth2.resourceserver.jwt.issuer-uri}/protocol/openid-connect/certs

jwt:
  auth:
    converter:
      resource-id: microbank-api
      principle-attribute: preferred_username
```

**services/client-service/src/main/resources/application.yml**
```yaml
spring:
  config:
    import: optional:configserver:http://localhost:9090
  application:
    name: client-service
  datasource:
    url: jdbc:postgresql://localhost:5432/microbank_clients
    username: microbank_user
    password: your_password
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: http://localhost:8080/realms/microbank
          jwk-set-uri: ${spring.security.oauth2.resourceserver.jwt.issuer-uri}/protocol/openid-connect/certs

jwt:
  auth:
    converter:
      resource-id: microbank-api
      principle-attribute: preferred_username
```

### 4. Build and Run Services
Navigate to each service directory and build:

```bash
# Config Server (Start first)
cd services/config-server
./mvnw clean install
./mvnw spring-boot:run

# Discovery Service (Start second)
cd services/discovery-service
./mvnw clean install
./mvnw spring-boot:run

# Banking Service
cd services/banking-service
./mvnw clean install
./mvnw spring-boot:run

# Client Service
cd services/client-service
./mvnw clean install
./mvnw spring-boot:run

# API Gateway (Start last)
cd services/api-gateway
./mvnw clean install
./mvnw spring-boot:run
```

---

## Frontend Setup

### 1. Navigate to Client Directory
```bash
cd client
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Environment Variables
Create or update `.env.local`:
```env
NEXTAUTH_URL=http://localhost:4200
NEXTAUTH_SECRET=your-secret-key-here
AUTH_KEYCLOAK_ID=microbank-frontend
AUTH_KEYCLOAK_SECRET=your-keycloak-client-secret
AUTH_KEYCLOAK_ISSUER=http://localhost:8080/realms/microbank
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:9393
```

### 4. Run the Frontend
```bash
npm run dev
```

The frontend will be available at `http://localhost:4200`

---

## Keycloak Configuration

### 1. Download and Start Keycloak
```bash
# Download Keycloak
wget https://github.com/keycloak/keycloak/releases/download/20.0.0/keycloak-20.0.0.zip
unzip keycloak-20.0.0.zip
cd keycloak-20.0.0

# Start Keycloak
bin/kc.sh start-dev
```

### 2. Access Keycloak Admin Console
- URL: `http://localhost:8080`
- Create admin user on first access

### 3. Create Realm
1. Click "Add Realm"
2. Name: `microbank`
3. Enable the realm

### 4. Create Client for Backend Services
1. Go to Clients → Create
2. **Client ID**: `microbank-api`
3. **Client Protocol**: `openid-connect`
4. **Access Type**: `confidential`
5. **Service Accounts Enabled**: `On`
6. **Authorization Enabled**: `On`
7. **Valid Redirect URIs**: `*`
8. **Web Origins**: `*`

### 5. Create Client for Frontend
1. Go to Clients → Create
2. **Client ID**: `microbank-frontend`
3. **Client Protocol**: `openid-connect`
4. **Access Type**: `public`
5. **Standard Flow Enabled**: `On`
6. **Valid Redirect URIs**: `http://localhost:4200/*`
7. **Web Origins**: `http://localhost:4200`

### 6. Create User Roles
1. Go to Roles → Add Role
2. Create roles:
   - `USER` - Standard banking user
   - `ADMIN` - System administrator
   - `MANAGER` - Branch manager

### 7. Create Test Users
1. Go to Users → Add User
2. Create user with:
   - **Username**: `testuser`
   - **Email**: `test@microbank.com`
   - **First Name**: `Test`
   - **Last Name**: `User`
3. Set password in Credentials tab
4. Assign roles in Role Mappings tab

---

## Running the Application

### Startup Order
1. **Database** (PostgreSQL/MySQL)
2. **Keycloak Server** (Port 8080)
3. **Config Server** (Port 9090)
4. **Discovery Service** (Port 8761)
5. **Banking Service** (Port 8081)
6. **Client Service** (Port 8082)
7. **API Gateway** (Port 9393)
8. **Frontend Application** (Port 4200)

### Health Checks
Verify services are running:
```bash
# Config Server
curl http://localhost:9090/actuator/health

# Discovery Service
curl http://localhost:8761/actuator/health

# Banking Service
curl http://localhost:8081/actuator/health

# Client Service
curl http://localhost:8082/actuator/health

# API Gateway
curl http://localhost:9393/actuator/health
```

---

## API Documentation

### Authentication Endpoints
**Base URL**: `http://localhost:9393`

#### Authentication Requirements
- **Public Endpoints**: No authentication headers required
- **Protected Endpoints**: Require `Authorization: Bearer {jwt-token}` header
- **Admin Endpoints**: Require admin role in JWT token

#### Client Service (`/clients`)
```bash
# Register new client (no authentication required)
POST /clients/register
Content-Type: application/json
{
  "name": "John Smith",
  "email": "john@example.com",
  "password": "SecurePass123"
}

# Login client (no authentication required)
POST /clients/login
Content-Type: application/json
{
  "email": "john@example.com",
  "password": "SecurePass123"
}

# Get client profile (requires authentication)
GET /clients/profile/{id}
Authorization: Bearer {jwt-token}
```

#### Banking Service (`/banks`)
```bash
# Create account
POST /banks/accounts
Authorization: Bearer {jwt-token}
Content-Type: application/json
{
  "clientId": "client-uuid",
  "initialBalance": 1000.00,
  "authorisationCode": "AUTH123"
}

# Get account balance
GET /banks/accounts/balance/{accountNumber}
Authorization: Bearer {jwt-token}

# Create transaction
POST /banks/transactions
Authorization: Bearer {jwt-token}
Content-Type: application/json
{
  "accountNumber": "ACC123456",
  "amount": 500.00,
  "type": "DEPOSIT"
}

# Get transaction history
GET /banks/transactions/account/{accountNumber}
Authorization: Bearer {jwt-token}
```

#### Admin Endpoints (`/clients/admin`)
```bash
# Get all clients (admin only)
GET /clients/admin
Authorization: Bearer {jwt-token}

# Blacklist client
PATCH /clients/admin/{clientId}/blacklist
Authorization: Bearer {jwt-token}

# Unblacklist client
PATCH /clients/admin/{clientId}/unblacklist
Authorization: Bearer {jwt-token}
```

---

## Features & Functionality

### 1. User Authentication
- **Secure Login**: OAuth2 with Keycloak
- **Role-Based Access**: USER, ADMIN, MANAGER roles
- **JWT Tokens**: Automatic token refresh
- **Session Management**: Secure session handling

### 2. Account Management
- **Account Creation**: Open new banking accounts
- **Account Inquiry**: View account details and balance
- **Account Statements**: Download transaction history
- **Multiple Accounts**: Support for multiple accounts per client

### 3. Transaction Processing
- **Deposits**: Add money to accounts
- **Withdrawals**: Remove money from accounts
- **Transfers**: Move money between accounts
- **Transaction History**: View all transactions
- **Date Range Filtering**: Filter transactions by date

### 4. Administrative Functions
- **Client Management**: View and manage all clients
- **Account Oversight**: Monitor all accounts
- **Transaction Monitoring**: Track all transactions
- **User Management**: Blacklist/unblacklist users
- **System Statistics**: View system health and metrics

### 5. Security Features
- **JWT Authentication**: Secure token-based auth
- **Role-Based Authorization**: Granular permissions
- **Input Validation**: Prevent injection attacks
- **CORS Configuration**: Secure cross-origin requests
- **Password Encryption**: Secure password storage

---

## User Guide

### Getting Started
1. **Access the Application**: Navigate to `http://localhost:4200`
2. **Create Account**: Click "Create Account" and fill in your details
3. **Login**: Use your credentials to sign in
4. **Dashboard**: View your account overview

### Managing Your Account
1. **View Balance**: Check your current account balance
2. **Transaction History**: Review past transactions
3. **Account Details**: View account number and information

### Making Transactions
1. **Deposits**: Add money to your account
   - Go to Transactions → New Transaction
   - Select "Deposit"
   - Enter amount and confirm

2. **Withdrawals**: Remove money from your account
   - Go to Transactions → New Transaction
   - Select "Withdrawal"
   - Enter amount and confirm

3. **Transfers**: Send money to another account
   - Go to Transactions → New Transaction
   - Select "Transfer"
   - Enter recipient account and amount

### Viewing Reports
1. **Transaction History**: 
   - Go to Transactions tab
   - Use date filters to narrow results
   - Export to PDF or Excel

2. **Account Statements**:
   - Go to Accounts → Statement
   - Select date range
   - Download statement

---

## Admin Guide

### Accessing Admin Functions
1. **Admin Login**: Sign in with admin credentials
2. **Admin Panel**: Access via Navigation → Admin
3. **System Overview**: View system statistics

### Managing Clients
1. **View All Clients**: See complete client list
2. **Client Details**: View individual client information
3. **Account Management**: Monitor client accounts
4. **Status Management**: Enable/disable client accounts

### System Administration
1. **User Management**:
   - Blacklist problematic users
   - Unblacklist users when resolved
   - Monitor user activity

2. **Transaction Monitoring**:
   - Review all system transactions
   - Flag suspicious activities
   - Generate compliance reports

3. **System Health**:
   - Monitor service status
   - Check database connections
   - Review system logs

### Reports and Analytics
1. **Daily Reports**: Transaction summaries
2. **Client Analytics**: User behavior patterns
3. **System Metrics**: Performance indicators
4. **Compliance Reports**: Regulatory reporting

---

## Troubleshooting

### Common Issues

#### 1. Authentication Problems
**Issue**: Cannot login or getting 401 errors
**Solution**:
- Check Keycloak server is running on port 8080
- Verify user credentials in Keycloak admin console
- Check JWT token in browser developer tools
- Use the Session Debugger component (blue info button)
- **Important**: Login and register endpoints should NOT include authentication headers

#### 2. Database Connection Issues
**Issue**: Services failing to start due to database errors
**Solution**:
- Verify database is running
- Check connection strings in application.yml
- Ensure database user has proper permissions
- Check if databases exist

#### 3. Service Discovery Problems
**Issue**: Services cannot find each other
**Solution**:
- Ensure Discovery Service is running first
- Check service registration in Eureka dashboard
- Verify service names match configuration
- Restart services in correct order

#### 4. Frontend API Calls Failing
**Issue**: Frontend cannot reach backend services
**Solution**:
- Check API Gateway is running on port 9393
- Verify CORS configuration
- Check network connectivity
- Review browser console for errors

### Debug Tools

#### 1. Session Debugger
- Click the blue info button in bottom-right corner
- View JWT token status and expiration
- Check user roles and permissions
- Debug authentication issues

#### 2. Console Logging
- Open browser developer tools
- Check Network tab for API calls
- Review Console tab for errors
- Monitor API request/response details

#### 3. Health Endpoints
```bash
# Check service health
curl http://localhost:9393/actuator/health
curl http://localhost:8081/actuator/health
curl http://localhost:8082/actuator/health
```

---

## Development Guide

### Setting Up Development Environment

#### 1. IDE Configuration
**IntelliJ IDEA**:
- Import as Maven project
- Configure JDK 17
- Install Spring Boot plugin
- Set up code formatting

**Visual Studio Code**:
- Install Java Extension Pack
- Install Spring Boot Extension Pack
- Configure TypeScript settings
- Install Tailwind CSS IntelliSense

#### 2. Database Setup for Development
```sql
-- Create development database
CREATE DATABASE microbank_dev;
CREATE USER dev_user WITH PASSWORD 'dev_password';
GRANT ALL PRIVILEGES ON DATABASE microbank_dev TO dev_user;
```

#### 3. Environment Profiles
Create development profiles:
```yaml
# application-dev.yml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/microbank_dev
    username: dev_user
    password: dev_password
  jpa:
    hibernate:
      ddl-auto: create-drop
    show-sql: true
```

### Code Structure

#### Backend Services
```
src/
├── main/java/zw/co/microbank/
│   ├── api/          # REST controllers
│   ├── config/       # Configuration classes
│   ├── dto/          # Data transfer objects
│   ├── entity/       # JPA entities
│   ├── exception/    # Exception handling
│   ├── mapper/       # Entity-DTO mappers
│   ├── repository/   # Data access layer
│   └── service/      # Business logic
└── resources/
    ├── application.yml
    └── static/
```

#### Frontend Structure
```
client/
├── app/              # Next.js app router
├── components/       # React components
├── hooks/           # Custom React hooks
├── lib/             # Utility libraries
├── services/        # API services
└── types/           # TypeScript types
```

### Adding New Features

#### 1. Backend Service Development
```java
// 1. Create Entity
@Entity
@Table(name = "loans")
public class Loan extends BaseEntity {
    private String clientId;
    private BigDecimal amount;
    private LoanStatus status;
    // getters and setters
}

// 2. Create Repository
@Repository
public interface LoanRepository extends JpaRepository<Loan, String> {
    List<Loan> findByClientId(String clientId);
}

// 3. Create Service
@Service
public class LoanService {
    @Autowired
    private LoanRepository loanRepository;
    
    public Loan createLoan(CreateLoanRequest request) {
        // business logic
    }
}

// 4. Create Controller
@RestController
@RequestMapping("/banks/loans")
public class LoanApi {
    @Autowired
    private LoanService loanService;
    
    @PostMapping
    public ResponseEntity<LoanResponse> createLoan(@RequestBody CreateLoanRequest request) {
        return ResponseEntity.ok(loanService.createLoan(request));
    }
}
```

#### 2. Frontend Component Development
```typescript
// 1. Create TypeScript types
export interface LoanResponse {
  id: string
  clientId: string
  amount: number
  status: LoanStatus
  createdAt: string
}

// 2. Create API service
export class LoanService {
  static async createLoan(data: CreateLoanRequest): Promise<LoanResponse> {
    return apiPost<LoanResponse>('/banks/loans', data)
  }
}

// 3. Create React component
export default function LoanApplication() {
  const [loan, setLoan] = useState<LoanResponse | null>(null)
  
  const handleSubmit = async (data: CreateLoanRequest) => {
    const result = await LoanService.createLoan(data)
    setLoan(result)
  }
  
  return (
    <div className="card">
      {/* component JSX */}
    </div>
  )
}
```

### Testing

#### 1. Backend Testing
```java
@SpringBootTest
@TestPropertySource(locations = "classpath:application-test.yml")
class LoanServiceTest {
    
    @Autowired
    private LoanService loanService;
    
    @Test
    void shouldCreateLoan() {
        // test implementation
    }
}
```

#### 2. Frontend Testing
```typescript
// Install testing dependencies
npm install --save-dev @testing-library/react @testing-library/jest-dom

// Create test file
describe('LoanApplication', () => {
  it('should create loan successfully', async () => {
    // test implementation
  })
})
```

### Deployment

#### 1. Production Build
```bash
# Backend
mvn clean package -Pprod

# Frontend
npm run build
npm run start
```

#### 2. Docker Deployment
```dockerfile
# Dockerfile for Spring Boot service
FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY target/banking-service-1.0.0.jar app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
```

#### 3. Environment Configuration
```yaml
# production.yml
spring:
  datasource:
    url: jdbc:postgresql://prod-db:5432/microbank
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  security:
    oauth2:
      resourceserver:
        jwt:
          issuer-uri: ${KEYCLOAK_URL}/realms/microbank
```

---

## Conclusion

MicroBank is a comprehensive banking solution designed for modern banking needs. The application provides secure, scalable banking services with modern microservices architecture. The system supports multiple user roles, comprehensive transaction processing, and robust administrative functions.

For additional support or questions, please contact the development team or refer to the API documentation for detailed endpoint information.

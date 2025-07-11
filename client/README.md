# MicroBank Frontend

A modern React/Next.js frontend for the MicroBank application, built with TypeScript and Tailwind CSS.

## Features

- **Authentication**: Keycloak integration with NextAuth.js
- **Dashboard**: Client dashboard with account overview and recent transactions
- **Account Management**: Create and view bank accounts
- **Transaction Management**: Create and view transactions with filtering
- **Admin Panel**: Admin interface for managing clients and system overview
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Responsive Design**: Mobile-first design with Tailwind CSS

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Authentication**: NextAuth.js with Keycloak provider
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **HTTP Client**: Fetch API with custom utilities
- **State Management**: React hooks and context

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Running backend services (see parent README)
- Keycloak server running on localhost:8080

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
```
AUTH_SECRET=your-secret-key-here
AUTH_KEYCLOAK_ID=microbank
AUTH_KEYCLOAK_SECRET=your-keycloak-client-secret
AUTH_KEYCLOAK_ISSUER=http://localhost:8080/realms/microbank
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:9393
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:4200](http://localhost:4200) in your browser.

## Project Structure

```
client/
├── app/                    # Next.js app router pages
│   ├── api/auth/          # NextAuth.js API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Dashboard page
│   ├── accounts/          # Account management
│   ├── transactions/      # Transaction management
│   ├── admin/             # Admin panel
│   └── register/          # Registration page
├── components/            # Reusable UI components
│   ├── Header.tsx
│   ├── Layout.tsx
│   ├── ErrorBoundary.tsx
│   ├── Toast.tsx
│   └── ToastContainer.tsx
├── hooks/                 # Custom React hooks
│   ├── useErrorHandler.ts
│   └── useToast.ts
├── lib/                   # Utility libraries
│   ├── auth.ts           # Authentication utilities
│   └── api.ts            # API utilities
├── services/             # API service classes
│   ├── client.service.ts
│   ├── admin.service.ts
│   ├── account.service.ts
│   └── transaction.service.ts
└── types/                # TypeScript type definitions
    ├── client.ts
    ├── account.ts
    ├── transaction.ts
    ├── enums.ts
    └── error.ts
```

## API Integration

The frontend integrates with the following backend services:

### Client Service (`/clients/`)
- User registration and login
- Client profile management
- Admin client management

### Banking Service (`/banks/`)
- Account creation and management
- Transaction processing
- Balance inquiries

### Authentication
- Keycloak OAuth2/JWT authentication
- Automatic token refresh
- Protected routes

## Components

### Authentication Flow
1. User lands on home page
2. Can register new account or sign in
3. Registration creates account in backend
4. Sign in redirects to Keycloak
5. Successful auth redirects to dashboard

### Dashboard
- Account balance display
- Recent transactions
- Quick action buttons
- User profile information

### Account Management
- View all accounts
- Create new accounts
- Account details and balances

### Transaction Management
- Create new transactions (deposit, withdrawal, transfer)
- View transaction history
- Filter transactions by date range
- Transaction details

### Admin Panel
- View all clients
- Blacklist/unblacklist clients
- System statistics
- Client management

## Error Handling

The application implements comprehensive error handling:

- **API Errors**: Proper HTTP status code handling
- **Authentication Errors**: Automatic redirect to login
- **Network Errors**: User-friendly error messages
- **Form Validation**: Client-side validation
- **Error Boundaries**: React error boundary for unexpected errors
- **Toast Notifications**: User feedback for actions

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Protected Routes**: Route-level authentication checks
- **CORS Configuration**: Proper CORS setup
- **Input Validation**: Client-side input validation
- **XSS Protection**: React's built-in XSS protection

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables

Required environment variables:

- `AUTH_SECRET` - Secret key for NextAuth.js
- `AUTH_KEYCLOAK_ID` - Keycloak client ID
- `AUTH_KEYCLOAK_SECRET` - Keycloak client secret
- `AUTH_KEYCLOAK_ISSUER` - Keycloak issuer URL
- `NEXT_PUBLIC_BACKEND_API_URL` - Backend API URL

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm run start
```

3. Or deploy to your preferred hosting platform (Vercel, Netlify, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
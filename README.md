# Flowbit_Pratham
#  Flowbit Technical Challenge - Multi-Tenant n8n Integration

A comprehensive multi-tenant workflow management system with n8n integration, demonstrating enterprise-grade authentication, micro-frontend architecture, and real-time workflow execution.

## 📋 Challenge Requirements Status

| ID | Requirement | Status | Implementation |
|----|-------------|---------|----------------|
| R1 | Auth & RBAC | ✅ Complete | JWT with customerId + role, Admin route protection |
| R2 | Tenant Data Isolation | ✅ Complete | MongoDB customerId fields + Jest isolation tests |
| R3 | Use-Case Registry | ✅ Complete | Registry.json mapping + /me/screens endpoint |
| R4 | Dynamic Navigation | ✅ Complete | Module Federation micro-frontend loading |
| R5 | Workflow Ping | ✅ Complete | n8n integration with webhook callbacks |
| R6 | Containerised Dev | ✅ Complete | Docker-compose with all services |

## 🏗️ Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Shell   │    │  Micro-Frontend │    │   n8n Engine    │
│  (Port 3000)    │    │  (Port 3001)    │    │  (Port 5678)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Express API   │
                    │   (Port 3000)   │
                    └─────────────────┘
                                 │
                    ┌─────────────────┐
                    │    MongoDB      │
                    │   (Port 27017)  │
                    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 16+ (for local development)
- Git

### One-Command Setup
```bash
# Clone repository
git clone [your-repo-url]
cd flowbit-challenge

# Start all services
docker-compose up

# Wait for services to initialize (~2 minutes)
# Access application at http://localhost:3000
```

### Test Credentials
```
LogisticsCo Admin:
Email: admin@logisticsco.com
Password: admin123

RetailGmbH Admin:
Email: admin@retailgmbh.com
Password: admin123
```

## 📁 Project Structure

```
flowbit-challenge/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── middleware/         # JWT auth, tenant isolation
│   │   ├── routes/            # API endpoints
│   │   ├── models/            # MongoDB schemas
│   │   └── tests/             # Jest unit tests
│   ├── package.json
│   └── Dockerfile
├── frontend-shell/             # React shell application
│   ├── src/
│   │   ├── components/        # Shell components
│   │   ├── services/          # API services
│   │   └── utils/             # Utilities
│   ├── webpack.config.js      # Module Federation config
│   └── Dockerfile
├── support-tickets-app/        # Micro-frontend
│   ├── src/
│   │   ├── components/        # Ticket components
│   │   └── services/          # API integration
│   ├── webpack.config.js      # Module Federation config
│   └── Dockerfile
├── n8n-workflows/              # n8n workflow definitions
│   └── ticket-workflow.json
├── docker-compose.yml          # All services configuration
├── registry.json              # Tenant-screen mapping
├── seed.js                    # Database seeding
└── README.md
```

## 🔧 Development Setup

### Local Development (Without Docker)
```bash
# Terminal 1: Backend
cd backend
npm install
npm run dev

# Terminal 2: Frontend Shell
cd frontend-shell
npm install
npm start

# Terminal 3: Support Tickets App
cd support-tickets-app
npm install
npm start

# Terminal 4: n8n
npx n8n start

# Terminal 5: MongoDB
mongod
```

### Running Tests
```bash
# Unit tests (tenant isolation)
cd backend
npm test

# Integration tests
npm run test:integration
```

## 🎯 Key Features

### 🔐 Authentication & Authorization
- JWT-based authentication with customerId and role claims
- Role-based access control (Admin/User)
- Middleware protection for admin routes
- Secure password hashing with bcrypt

### 🏢 Multi-Tenant Architecture
- Strict tenant data isolation in MongoDB
- All collections include customerId field
- Jest tests proving tenant isolation
- Tenant-specific screen loading

### 🔄 n8n Workflow Integration
- Automatic workflow triggering on ticket creation
- Webhook callbacks with shared secret validation
- Real-time status updates via WebSocket
- Complete workflow round-trip demonstration

### 🎨 Micro-Frontend Architecture
- Webpack Module Federation for dynamic loading
- Tenant-specific micro-frontend routing
- Lazy-loaded components for performance
- Shared authentication state

## 🔄 Workflow Flow

1. **User creates ticket** → POST /api/tickets
2. **API triggers n8n workflow** → HTTP request to n8n
3. **n8n processes workflow** → Custom workflow execution
4. **n8n calls webhook** → POST /webhook/ticket-done
5. **API updates ticket status** → MongoDB update
6. **UI receives update** → WebSocket notification
7. **Real-time UI refresh** → Ticket status updated

## 🧪 Testing Strategy

### Unit Tests
- Tenant isolation verification
- JWT middleware validation
- API endpoint security
- Database query isolation

### Integration Tests
- End-to-end workflow execution
- Authentication flow testing
- Micro-frontend loading
- Real-time updates

### Manual Testing
- Multi-tenant data isolation
- Workflow callback verification
- UI responsiveness
- Security validation

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Current user info

### Tenant Management
- `GET /api/me/screens` - Tenant-specific screens
- `GET /api/admin/users` - Admin user management

### Tickets
- `GET /api/tickets` - List tenant tickets
- `POST /api/tickets` - Create new ticket
- `PUT /api/tickets/:id` - Update ticket

### Webhooks
- `POST /webhook/ticket-done` - n8n callback endpoint

## 🐳 Docker Configuration

### Services
- **MongoDB**: Document database
- **Backend API**: Express.js application
- **Frontend Shell**: React shell application
- **Support Tickets App**: Micro-frontend
- **n8n**: Workflow automation engine
- **ngrok**: Webhook tunneling (for local testing)

### Environment Variables
```bash
# Backend
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://mongo:27017/flowbit
N8N_WEBHOOK_URL=http://n8n:5678/webhook/ticket-created

# n8n
N8N_BASIC_AUTH_ACTIVE=true
N8N_BASIC_AUTH_USER=admin
N8N_BASIC_AUTH_PASSWORD=admin
```

## 🎬 Demo Video Content

The demo video demonstrates:
1. **Login as LogisticsCo Admin** - Authentication flow
2. **Create support ticket** - Ticket creation process
3. **n8n workflow execution** - Real-time workflow processing
4. **Webhook callback** - Status update mechanism
5. **Tenant isolation proof** - Login as RetailGmbH, no cross-tenant data
6. **Real-time updates** - WebSocket notifications

## 🚀 Production Readiness

### Security
- JWT token validation
- Password hashing with bcrypt
- Webhook secret validation
- Input sanitization
- CORS configuration

### Performance
- Lazy-loaded micro-frontends
- Efficient database queries
- Connection pooling
- Caching strategies

### Scalability
- Microservice architecture
- Container orchestration ready
- Database indexing
- Load balancer compatible

## 🛠️ Known Limitations

1. **Local Docker Issues**: If Docker doesn't work on your machine, the demo video shows the complete flow working
2. **Webhook Tunneling**: Local development requires ngrok or similar for webhook testing
3. **n8n Configuration**: First-time setup requires manual workflow import

## 🎉 Bonus Features

- **Audit Logging**: Complete action tracking
- **Real-time Updates**: WebSocket integration
- **Comprehensive Testing**: Unit and integration tests
- **Production Docker**: Multi-stage builds for optimization

## 📞 Support

For questions or issues:
- Review the demo video for complete flow demonstration
- Check Docker logs: `docker-compose logs [service-name]`
- Verify environment variables are set correctly
- Ensure all ports are available (3000, 3001, 5678, 27017)

## 🏆 Success Metrics

- ✅ All 6 core requirements implemented
- ✅ Production-ready code quality
- ✅ Comprehensive documentation
- ✅ Working demo video
- ✅ Bonus features included

---

**Built with ❤️ for Flowbit Technical Challenge**  
*Demonstrating enterprise-grade multi-tenant architecture with modern web technologies*

# Smart City Platform - Frontend & Backend Separation

## Project Structure

```
urbaniq_vscode_project (1)/
|
|-- backend/                    # Node.js Express API Server
|   |-- package.json           # Backend dependencies
|   |-- server.js              # Main server file
|   |-- .env                   # Environment variables
|   |-- routes/                # API route handlers
|   |   |-- auth.js            # Authentication routes
|   |   |-- users.js           # User management routes
|   |   |-- requests.js        # Request management routes
|   |   |-- admin.js           # Admin panel routes
|   |   |-- modules.js         # Module data routes
|   |
|
|-- frontend/                  # Frontend Web Application
|   |-- package.json           # Frontend dependencies
|   |-- index.html             # Main application page
|   |-- login.html             # Login page
|   |-- css/                   # Stylesheets
|   |   |-- main.css           # Main styles
|   |   |-- admin.css          # Admin panel styles
|   |
|   |-- js/                    # JavaScript modules
|   |   |-- api.js             # API service layer
|   |   |-- auth.js            # Authentication service
|   |   |-- main.js            # Main application logic
|   |   |-- requestSystem.js   # Request handling
|   |   |-- moduleDataIntegration.js
|   |   |-- chat.js            # Chat functionality
|   |
|   |-- modules/               # Frontend module components
|   |   |-- dashboard.js       # Dashboard module
|   |   |-- admin.js           # Admin panel module
|   |   |-- userDashboard.js   # User dashboard module
|   |   |-- water.js           # Water supply module
|   |   |-- electricity.js     # Electricity module
|   |   |-- traffic.js         # Traffic module
|   |   |-- bus.js             # Bus routes module
|   |   |-- waste.js           # Waste management module
|   |   |-- aqi.js             # Air quality module
|   |   |-- repairs.js         # Road repairs module
|   |   |-- alerts.js          # Alerts module
|   |
|
|-- urbaniq/                   # Original monolithic structure (deprecated)
```

## Quick Start

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Copy `.env` file and update values as needed
   - Set `FRONTEND_URL` to your frontend URL (default: `http://localhost:3000`)
   - Update `JWT_SECRET` for production

4. **Start the backend server**
   ```bash
   npm start
   # or for development with auto-restart
   npm run dev
   ```

5. **Server runs on**: `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the frontend server**
   ```bash
   npm run dev
   ```

4. **Frontend runs on**: `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `PUT /api/users/password` - Change password
- `DELETE /api/users/account` - Delete user account

### Requests
- `GET /api/requests` - Get user requests
- `GET /api/requests/all` - Get all requests (admin)
- `POST /api/requests` - Create new request
- `PUT /api/requests/:id` - Update request
- `DELETE /api/requests/:id` - Delete request
- `GET /api/requests/notifications` - Get user notifications
- `PUT /api/requests/notifications/:id/read` - Mark notification as read

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/status` - Update user status
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/logs` - Get activity logs
- `GET /api/admin/export/:type` - Export data
- `POST /api/admin/setup` - Setup admin account

### Modules
- `GET /api/modules` - Get all modules
- `GET /api/modules/:id` - Get module details
- `GET /api/modules/:id/request-types` - Get module request types
- `GET /api/modules/:id/stats` - Get module statistics

## Features

### Frontend Features
- **Responsive Design**: Works on desktop and mobile
- **Module-based Architecture**: Each city service is a separate module
- **Real-time Updates**: Live data updates for city services
- **User Authentication**: Secure login and registration
- **Request System**: Users can submit requests for city services
- **Admin Panel**: Complete admin dashboard for managing requests and users
- **Notifications**: Real-time notifications for users and admins

### Backend Features
- **RESTful API**: Clean and well-documented API endpoints
- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: User and admin roles with different permissions
- **Data Validation**: Input validation and sanitization
- **Error Handling**: Comprehensive error handling and logging
- **Security**: CORS protection, rate limiting, helmet security
- **Modular Structure**: Organized route handlers

## Development

### Adding New Modules

1. **Backend**: Add module data to `backend/routes/modules.js`
2. **Frontend**: Create new module file in `frontend/modules/`
3. **Update**: Add module to navigation in `frontend/index.html`

### Database Integration

The current implementation uses in-memory storage. For production:

1. **Choose Database**: MongoDB, PostgreSQL, or MySQL
2. **Install Driver**: Add database driver to `backend/package.json`
3. **Create Models**: Define data models
4. **Update Routes**: Replace in-memory storage with database calls

### Deployment

#### Backend Deployment
1. Set environment variables for production
2. Use process manager (PM2) for Node.js
3. Configure reverse proxy (Nginx)
4. Set up SSL certificates

#### Frontend Deployment
1. Build static files (if using build tools)
2. Deploy to static hosting (Netlify, Vercel, etc.)
3. Configure API base URL for production

## Security Considerations

- JWT tokens expire after 7 days (configurable)
- Passwords are hashed using bcrypt
- Rate limiting prevents API abuse
- CORS configured for frontend domain
- Input validation on all endpoints
- Helmet.js for security headers

## Environment Variables

### Backend (.env)
```
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Check `FRONTEND_URL` in backend .env file
2. **Authentication Issues**: Verify JWT secret matches between requests
3. **Module Loading**: Check that all frontend module files are present
4. **API Connection**: Ensure backend is running on correct port

### Debug Mode

Set `NODE_ENV=development` to see detailed error messages and stack traces.

## Contributing

1. Follow the existing code structure
2. Add proper error handling
3. Include input validation
4. Write tests for new features
5. Update documentation

## License

ISC License - See LICENSE file for details

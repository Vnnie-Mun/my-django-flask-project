# Innovators of Honour - Django/Flask Deployment Guide

## Overview
This project has been converted from JavaScript to Flask/Python while maintaining the exact same frontend appearance and functionality. The website now features a robust backend with SQLAlchemy database integration and comprehensive API endpoints.

## Technology Stack

### Backend
- **Flask 2.3.3** - Web framework
- **SQLAlchemy** - Database ORM
- **Flask-Migrate** - Database migrations
- **Flask-CORS** - Cross-origin resource sharing
- **Werkzeug** - WSGI utilities and security

### Frontend
- **HTML5/CSS3** - Structure and styling (unchanged)
- **JavaScript ES6+** - Client-side functionality with API integration
- **Font Awesome 6.0** - Icons
- **Inter Font** - Typography

### Database
- **SQLite** (development) / **PostgreSQL** (production recommended)
- **SQLAlchemy ORM** with comprehensive models

## Project Structure

```
Innovators of honour/
├── app.py                 # Main Flask application
├── wsgi.py               # WSGI configuration for deployment
├── config.py             # Configuration settings
├── run.py                # Development server runner
├── requirements.txt      # Python dependencies
├── .env.example         # Environment variables template
├── templates/           # Jinja2 templates
│   ├── base.html        # Base template
│   ├── index.html       # Landing page
│   ├── programs.html    # Programs page
│   ├── solutions.html   # Solutions marketplace
│   ├── hiring.html      # Job platform
│   ├── learn.html       # Learning platform
│   ├── community.html   # Community fellowship
│   ├── investors.html   # Investor platform
│   ├── pitch-application.html
│   └── mint-nft.html    # NFT minting
├── static/
│   ├── css/
│   │   └── styles.css   # Main stylesheet (unchanged)
│   └── js/
│       └── main.js      # JavaScript with API integration
└── static/uploads/      # File upload directory
```

## Database Models

### Core Models
- **User** - User accounts and authentication
- **Solution** - NFT marketplace solutions
- **Job** - Job postings and applications
- **Course** - Educational content
- **Event** - Webinars, workshops, fellowship events
- **PitchApplication** - Startup pitch applications
- **Registration** - Event registrations

## API Endpoints

### Solutions API
- `GET /api/solutions` - List all solutions with filtering
- `POST /api/solutions` - Create new solution
- `POST /api/solution/<id>/view` - Track solution views
- `POST /api/solution/<id>/purchase` - Purchase solution NFT

### Jobs API
- `GET /api/jobs` - List jobs with filtering
- `POST /api/jobs` - Post new job

### Events API
- `GET /api/events` - List upcoming events
- `POST /api/register-event` - Register for events

### Applications API
- `POST /api/pitch-application` - Submit pitch application

### Utility APIs
- `GET /api/stats` - Platform statistics
- `GET /api/search` - Global search functionality

## Installation & Setup

### 1. Clone and Setup Environment

```bash
cd "Innovators of honour"
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Environment Configuration

```bash
cp .env.example .env
# Edit .env with your configuration
```

### 3. Database Setup

```bash
python run.py
# Database tables will be created automatically
```

### 4. Run Development Server

```bash
python run.py
# Or
flask run
```

## PythonAnywhere Deployment

### 1. Upload Files
Upload all project files to your PythonAnywhere account.

### 2. Install Dependencies
```bash
pip3.10 install --user -r requirements.txt
```

### 3. Configure Web App
1. Go to Web tab in PythonAnywhere dashboard
2. Create new web app (Flask, Python 3.10)
3. Set source code path: `/home/yourusername/Innovators of honour`
4. Set WSGI file path: `/home/yourusername/Innovators of honour/wsgi.py`

### 4. Update WSGI Configuration
Edit the WSGI file path in `wsgi.py`:
```python
path = '/home/yourusername/Innovators of honour'
```

### 5. Static Files Configuration
In PythonAnywhere web tab, add static files mapping:
- URL: `/static/`
- Directory: `/home/yourusername/Innovators of honour/static/`

### 6. Environment Variables
Set environment variables in PythonAnywhere:
- Go to Files tab
- Edit `.env` file with production values

## Key Features Maintained

### 1. **Exact Frontend Appearance**
- All CSS styling preserved
- Black and gold theme maintained
- Responsive design intact
- All animations and interactions working

### 2. **Functional Buttons & Navigation**
- All buttons now connect to backend APIs
- External links (Udemy, WhatsApp, Instagram) working
- Smooth navigation between pages
- Form submissions integrated with database

### 3. **NFT Marketplace**
- Web3 integration for blockchain functionality
- MetaMask wallet connection
- Solution minting and purchasing
- File upload and IPFS integration ready

### 4. **Comprehensive APIs**
- RESTful API design
- JSON responses
- Error handling
- Data validation

### 5. **Database Integration**
- SQLAlchemy ORM models
- Relationship management
- Data persistence
- Migration support

## Frontend-Backend Communication

### JavaScript API Integration
The frontend JavaScript now communicates with Flask backend through:

```javascript
// Example API call
async function loadSolutions() {
    const response = await fetch('/api/solutions');
    const solutions = await response.json();
    return solutions;
}
```

### Form Handling
Forms now submit to backend endpoints:

```javascript
// Example form submission
async function submitJob(jobData) {
    const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(jobData)
    });
    return response.json();
}
```

## Performance Optimizations

### 1. **Database Optimization**
- Indexed columns for fast queries
- Efficient relationship loading
- Query optimization

### 2. **Caching Strategy**
- Static file caching
- Database query caching ready
- CDN integration ready

### 3. **API Efficiency**
- Pagination for large datasets
- Filtering and search optimization
- Minimal data transfer

## Security Features

### 1. **Input Validation**
- Form data validation
- File upload security
- SQL injection prevention

### 2. **Authentication Ready**
- User model prepared
- Session management
- Password hashing

### 3. **CORS Configuration**
- Cross-origin request handling
- API security headers

## Monitoring & Analytics

### 1. **Built-in Tracking**
- Solution view tracking
- User engagement metrics
- Platform statistics API

### 2. **Error Handling**
- Comprehensive error logging
- User-friendly error messages
- API error responses

## Maintenance & Updates

### 1. **Database Migrations**
```bash
flask db init
flask db migrate -m "Description"
flask db upgrade
```

### 2. **Backup Strategy**
- Regular database backups
- File upload backups
- Configuration backups

## Support & Documentation

### 1. **API Documentation**
All API endpoints are documented with:
- Request/response formats
- Error codes
- Example usage

### 2. **Code Comments**
- Comprehensive inline documentation
- Function descriptions
- Configuration explanations

## Production Considerations

### 1. **Environment Variables**
- Set secure SECRET_KEY
- Configure production database
- Set up email service
- Configure file storage

### 2. **Performance Tuning**
- Enable production mode
- Configure caching
- Optimize database queries
- Set up monitoring

### 3. **Security Hardening**
- HTTPS configuration
- Security headers
- Rate limiting
- Input sanitization

## Troubleshooting

### Common Issues
1. **Database Connection**: Check DATABASE_URL in .env
2. **Static Files**: Verify static file mapping
3. **Import Errors**: Ensure all dependencies installed
4. **CORS Issues**: Check Flask-CORS configuration

### Debug Mode
Enable debug mode for development:
```python
app.run(debug=True)
```

## Contact & Support

For technical support or questions about this implementation:
- Check the comprehensive code comments
- Review API endpoint documentation
- Test all functionality in development before deployment

---

**Note**: This conversion maintains 100% of the original frontend appearance while adding robust backend functionality. All buttons, forms, and interactions now work seamlessly with the Flask backend and SQLAlchemy database.
from flask import Flask, render_template, request, jsonify, redirect, url_for, flash, session
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import os
import uuid
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///innovators.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = 'static/uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

db = SQLAlchemy(app)
migrate = Migrate(app, db)
CORS(app)

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

# Database Models
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    name = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(128))
    role = db.Column(db.String(20), default='member')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
class Solution(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    category = db.Column(db.String(50), nullable=False)
    stage = db.Column(db.String(50), nullable=False)
    funding_status = db.Column(db.String(50), nullable=False)
    price_eth = db.Column(db.Float, default=0.1)
    creator_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    file_path = db.Column(db.String(200))
    nft_token_id = db.Column(db.String(100))
    views = db.Column(db.Integer, default=0)
    purchases = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    company = db.Column(db.String(100), nullable=False)
    location = db.Column(db.String(100), nullable=False)
    job_type = db.Column(db.String(50), nullable=False)
    salary_range = db.Column(db.String(100))
    description = db.Column(db.Text, nullable=False)
    requirements = db.Column(db.Text)
    benefits = db.Column(db.Text)
    remote = db.Column(db.Boolean, default=False)
    featured = db.Column(db.Boolean, default=False)
    employer_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    applications = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
class Course(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(50), nullable=False)
    instructor = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    duration = db.Column(db.String(50))
    level = db.Column(db.String(20))
    price = db.Column(db.Float, default=0)
    rating = db.Column(db.Float, default=0)
    students = db.Column(db.Integer, default=0)
    featured = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    event_type = db.Column(db.String(50), nullable=False)  # fellowship, webinar, workshop, pitch
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    location = db.Column(db.String(200))
    capacity = db.Column(db.Integer, default=100)
    registered = db.Column(db.Integer, default=0)
    price = db.Column(db.Float, default=0)
    speaker = db.Column(db.String(100))
    agenda = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
class PitchApplication(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    company_name = db.Column(db.String(100), nullable=False)
    founder_name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(120), nullable=False)
    phone = db.Column(db.String(20))
    company_stage = db.Column(db.String(50), nullable=False)
    industry = db.Column(db.String(50), nullable=False)
    funding_amount = db.Column(db.String(50))
    pitch_deck_path = db.Column(db.String(200))
    business_plan_path = db.Column(db.String(200))
    financial_projections_path = db.Column(db.String(200))
    status = db.Column(db.String(20), default='pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class Registration(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
    registration_type = db.Column(db.String(50))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Routes
@app.route('/')
def index():
    stats = {
        'members': User.query.count(),
        'solutions': Solution.query.count(),
        'jobs': Job.query.count(),
        'courses': Course.query.count()
    }
    return render_template('index.html', stats=stats)

@app.route('/programs')
def programs():
    upcoming_events = Event.query.filter(
        Event.date > datetime.utcnow(),
        Event.event_type.in_(['webinar', 'workshop'])
    ).order_by(Event.date).limit(5).all()
    return render_template('programs.html', events=upcoming_events)

@app.route('/solutions')
def solutions():
    category = request.args.get('category', 'all')
    stage = request.args.get('stage', 'all')
    funding = request.args.get('funding', 'all')
    
    query = Solution.query
    if category != 'all':
        query = query.filter(Solution.category == category)
    if stage != 'all':
        query = query.filter(Solution.stage == stage)
    if funding != 'all':
        query = query.filter(Solution.funding_status == funding)
    
    solutions_list = query.order_by(Solution.created_at.desc()).all()
    return render_template('solutions.html', solutions=solutions_list)

@app.route('/hiring')
def hiring():
    job_type = request.args.get('type', 'all')
    location = request.args.get('location', '')
    remote = request.args.get('remote', False)
    
    query = Job.query
    if job_type != 'all':
        query = query.filter(Job.job_type == job_type)
    if location:
        query = query.filter(Job.location.contains(location))
    if remote:
        query = query.filter(Job.remote == True)
    
    jobs = query.order_by(Job.created_at.desc()).all()
    return render_template('hiring.html', jobs=jobs)

@app.route('/learn')
def learn():
    category = request.args.get('category', 'all')
    
    query = Course.query
    if category != 'all':
        query = query.filter(Course.category == category)
    
    courses = query.order_by(Course.created_at.desc()).all()
    return render_template('learn.html', courses=courses)

@app.route('/community')
def community():
    next_fellowship = Event.query.filter(
        Event.event_type == 'fellowship',
        Event.date > datetime.utcnow()
    ).order_by(Event.date).first()
    
    return render_template('community.html', next_fellowship=next_fellowship)

@app.route('/investors')
def investors():
    pitch_events = Event.query.filter(
        Event.event_type == 'pitch',
        Event.date > datetime.utcnow()
    ).order_by(Event.date).limit(3).all()
    
    return render_template('investors.html', pitch_events=pitch_events)

@app.route('/pitch-application')
def pitch_application():
    return render_template('pitch-application.html')

@app.route('/mint-nft')
def mint_nft():
    return render_template('mint-nft.html')

# API Routes
@app.route('/api/solutions', methods=['GET', 'POST'])
def api_solutions():
    if request.method == 'POST':
        data = request.get_json()
        solution = Solution(
            title=data['title'],
            description=data['description'],
            category=data['category'],
            stage=data['stage'],
            funding_status=data['funding_status'],
            price_eth=data.get('price_eth', 0.1),
            creator_id=session.get('user_id')
        )
        db.session.add(solution)
        db.session.commit()
        return jsonify({'success': True, 'id': solution.id})
    
    solutions = Solution.query.all()
    return jsonify([{
        'id': s.id,
        'title': s.title,
        'description': s.description,
        'category': s.category,
        'stage': s.stage,
        'funding_status': s.funding_status,
        'price_eth': s.price_eth,
        'views': s.views,
        'purchases': s.purchases,
        'created_at': s.created_at.isoformat()
    } for s in solutions])

@app.route('/api/jobs', methods=['GET', 'POST'])
def api_jobs():
    if request.method == 'POST':
        data = request.get_json()
        job = Job(
            title=data['title'],
            company=data['company'],
            location=data['location'],
            job_type=data['job_type'],
            salary_range=data.get('salary_range'),
            description=data['description'],
            requirements=data.get('requirements'),
            benefits=data.get('benefits'),
            remote=data.get('remote', False),
            employer_id=session.get('user_id')
        )
        db.session.add(job)
        db.session.commit()
        return jsonify({'success': True, 'id': job.id})
    
    jobs = Job.query.all()
    return jsonify([{
        'id': j.id,
        'title': j.title,
        'company': j.company,
        'location': j.location,
        'job_type': j.job_type,
        'salary_range': j.salary_range,
        'description': j.description,
        'remote': j.remote,
        'featured': j.featured,
        'applications': j.applications,
        'created_at': j.created_at.isoformat()
    } for j in jobs])

@app.route('/api/courses')
def api_courses():
    courses = Course.query.all()
    return jsonify([{
        'id': c.id,
        'title': c.title,
        'category': c.category,
        'instructor': c.instructor,
        'description': c.description,
        'duration': c.duration,
        'level': c.level,
        'price': c.price,
        'rating': c.rating,
        'students': c.students,
        'featured': c.featured
    } for c in courses])

@app.route('/api/events')
def api_events():
    events = Event.query.filter(Event.date > datetime.utcnow()).all()
    return jsonify([{
        'id': e.id,
        'title': e.title,
        'event_type': e.event_type,
        'description': e.description,
        'date': e.date.isoformat(),
        'location': e.location,
        'capacity': e.capacity,
        'registered': e.registered,
        'price': e.price,
        'speaker': e.speaker
    } for e in events])

@app.route('/api/pitch-application', methods=['POST'])
def api_pitch_application():
    data = request.get_json()
    
    application = PitchApplication(
        company_name=data['company_name'],
        founder_name=data['founder_name'],
        email=data['email'],
        phone=data.get('phone'),
        company_stage=data['company_stage'],
        industry=data['industry'],
        funding_amount=data.get('funding_amount')
    )
    
    db.session.add(application)
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Application submitted successfully!'})

@app.route('/api/register-event', methods=['POST'])
def api_register_event():
    data = request.get_json()
    
    registration = Registration(
        event_id=data['event_id'],
        user_id=session.get('user_id'),
        registration_type=data.get('type', 'standard')
    )
    
    db.session.add(registration)
    
    # Update event registration count
    event = Event.query.get(data['event_id'])
    if event:
        event.registered += 1
        
    db.session.commit()
    
    return jsonify({'success': True, 'message': 'Registration successful!'})

@app.route('/api/stats')
def api_stats():
    return jsonify({
        'members': User.query.count(),
        'solutions': Solution.query.count(),
        'jobs': Job.query.count(),
        'courses': Course.query.count(),
        'events': Event.query.filter(Event.date > datetime.utcnow()).count()
    })

@app.route('/api/search')
def api_search():
    query = request.args.get('q', '')
    category = request.args.get('category', 'all')
    
    results = {}
    
    if category in ['all', 'solutions']:
        solutions = Solution.query.filter(
            Solution.title.contains(query) | 
            Solution.description.contains(query)
        ).limit(10).all()
        results['solutions'] = [{
            'id': s.id,
            'title': s.title,
            'description': s.description[:100] + '...',
            'category': s.category
        } for s in solutions]
    
    if category in ['all', 'jobs']:
        jobs = Job.query.filter(
            Job.title.contains(query) | 
            Job.description.contains(query)
        ).limit(10).all()
        results['jobs'] = [{
            'id': j.id,
            'title': j.title,
            'company': j.company,
            'location': j.location
        } for j in jobs]
    
    if category in ['all', 'courses']:
        courses = Course.query.filter(
            Course.title.contains(query) | 
            Course.description.contains(query)
        ).limit(10).all()
        results['courses'] = [{
            'id': c.id,
            'title': c.title,
            'instructor': c.instructor,
            'category': c.category
        } for c in courses]
    
    return jsonify(results)

@app.route('/api/solution/<int:solution_id>/view', methods=['POST'])
def api_solution_view(solution_id):
    solution = Solution.query.get_or_404(solution_id)
    solution.views += 1
    db.session.commit()
    return jsonify({'success': True, 'views': solution.views})

@app.route('/api/solution/<int:solution_id>/purchase', methods=['POST'])
def api_solution_purchase(solution_id):
    solution = Solution.query.get_or_404(solution_id)
    solution.purchases += 1
    db.session.commit()
    return jsonify({'success': True, 'message': 'Purchase successful!'})

# Initialize database
def create_tables():
    with app.app_context():
        db.create_all()
        
        # Add sample data if tables are empty
        if User.query.count() == 0:
        sample_user = User(
            name='Vincent Kimuri',
            email='vincent@innovatorsofhonour.com',
            role='admin'
        )
        db.session.add(sample_user)
        
        # Sample solutions
        solutions = [
            Solution(
                title='AI-Powered Healthcare Diagnostics',
                description='Revolutionary AI system for early disease detection using machine learning algorithms.',
                category='Healthcare',
                stage='MVP',
                funding_status='Seeking',
                price_eth=0.15,
                creator_id=1
            ),
            Solution(
                title='Blockchain Supply Chain Tracker',
                description='Transparent supply chain management using blockchain technology.',
                category='Blockchain',
                stage='Prototype',
                funding_status='Funded',
                price_eth=0.12,
                creator_id=1
            ),
            Solution(
                title='Smart Agriculture IoT Platform',
                description='IoT-based platform for precision agriculture and crop monitoring.',
                category='Agriculture',
                stage='Launched',
                funding_status='Funded',
                price_eth=0.20,
                creator_id=1
            )
        ]
        
        for solution in solutions:
            db.session.add(solution)
        
        # Sample jobs
        jobs = [
            Job(
                title='Senior AI Engineer',
                company='TechCorp Kenya',
                location='Nairobi, Kenya',
                job_type='Full-time',
                salary_range='$80,000 - $120,000',
                description='Lead AI development projects and mentor junior developers.',
                remote=True,
                featured=True,
                employer_id=1
            ),
            Job(
                title='Blockchain Developer',
                company='CryptoSolutions',
                location='Remote',
                job_type='Contract',
                salary_range='$60,000 - $90,000',
                description='Develop smart contracts and DeFi applications.',
                remote=True,
                employer_id=1
            )
        ]
        
        for job in jobs:
            db.session.add(job)
        
        # Sample courses
        courses = [
            Course(
                title='Machine Learning Fundamentals',
                category='AI/ML',
                instructor='Dr. Sarah Johnson',
                description='Complete introduction to machine learning concepts and applications.',
                duration='8 weeks',
                level='Beginner',
                price=299,
                rating=4.8,
                students=1250,
                featured=True
            ),
            Course(
                title='Blockchain Development Bootcamp',
                category='Blockchain',
                instructor='Michael Chen',
                description='Learn to build decentralized applications from scratch.',
                duration='12 weeks',
                level='Intermediate',
                price=499,
                rating=4.9,
                students=890
            )
        ]
        
        for course in courses:
            db.session.add(course)
        
        # Sample events
        events = [
            Event(
                title='Monthly Fellowship Gathering',
                event_type='fellowship',
                description='Join us for worship, networking, and professional development.',
                date=datetime.utcnow() + timedelta(days=7),
                location='Nairobi Innovation Hub',
                capacity=100,
                price=0,
                speaker='Pastor David Kimani'
            ),
            Event(
                title='AI in Healthcare Webinar',
                event_type='webinar',
                description='Exploring the future of AI applications in healthcare.',
                date=datetime.utcnow() + timedelta(days=14),
                location='Online',
                capacity=500,
                price=0,
                speaker='Dr. Emily Watson'
            ),
            Event(
                title='Startup Pitch Night',
                event_type='pitch',
                description='Present your startup to potential investors.',
                date=datetime.utcnow() + timedelta(days=21),
                location='Nairobi Business Center',
                capacity=50,
                price=50,
                speaker='Investment Panel'
            )
        ]
        
        for event in events:
            db.session.add(event)
        
            db.session.commit()

# Initialize database on startup
create_tables()

if __name__ == '__main__':
    app.run(debug=True)
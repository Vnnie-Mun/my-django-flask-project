# Innovators of Honour Website - Comprehensive README

## Project Overview

Welcome to the **Innovators of Honour** website project! This is a full-stack, dynamic web application designed for the Innovators of Honour community, a faith-based tech community focused on ethical leadership, innovation, and global impact. The platform embodies the motto **"Innovate with Honour, Impact the World"** and serves as a hub for ethical innovation, featuring an NFT-based Solutions Marketplace, advanced Hiring Platform, Investor Pitching System, Learning Resources, Community Engagement, and Programs for Bootcamps/Webinars.

The original site was a static HTML/CSS/JS platform inspired by [buildadao.io](https://buildadao.io), with a premium black and gold theme (no blues or whites), responsive design using Font Awesome 6, Inter fonts, and CSS media queries. We've transformed it into a production-ready Django 5.2.6 application with blockchain integration (Ethereum/Polygon NFTs), AI-powered features (OpenAI GPT-4o), real-time communication (Django Channels), and seamless deployment on AWS ECS + Vercel.

### Key Features
- **Solutions Marketplace**: Submit, mint, and sell innovative solutions as ERC-721 NFTs with direct ETH payments via MetaMask. Listings appear on the landing page and disappear upon purchase.
- **Hiring Platform**: Post jobs, apply with resumes/cover letters, AI-structured email notifications, real-time chat (WebSockets), and AI matching superior to LinkedIn/Indeed.
- **Investor Platform**: Submit pitches, AI matches startups to investors based on interests, Gmail-threaded conversations for connections.
- **Learning & Programs**: Dynamic course catalogs, bootcamp/webinar schedules from DB.
- **Community**: Event registration, WhatsApp/Instagram integration, prominent "Join Community" button (floating, navigation, hero CTA).
- **Authentication**: Seamless Google OAuth with Flask-Login/Django auth, profile dashboards.
- **AI Chatbot**: Site-wide contextual assistant for guidance (e.g., "How to mint an NFT?").
- **Blockchain**: Secure NFT minting/purchasing on Sepolia testnet (Ethereum), with IPFS metadata.
- **Theme & UX**: Black (#1a1a1a/#000) and gold (#FFD700) aesthetic preserved, responsive, animations via CSS/Intersection Observer.
- **Ethical Focus**: Consent modals for blockchain/AI risks, privacy disclaimers, transparent fees.

### Tech Stack
| Component | Technologies |
|-----------|--------------|
| **Backend** | Django 5.2.6, SQLAlchemy/PostgreSQL, Web3.py (blockchain), Celery (async tasks with Redis), Django Channels (WebSockets), OpenAI SDK (GPT-4o), Google API Client (Gmail OAuth) |
| **Frontend** | HTML5/Jinja2, SASS/CSS3 (compiled), Bootstrap 5, JavaScript ES6+ (Web3.js for MetaMask), HTMX/AJAX (no-reloads), Font Awesome 6, Google Fonts (Inter) |
| **Blockchain** | Solidity 0.8.30 (ERC-721 NFTs), OpenZeppelin 5.0.2 (security), Ethereum Sepolia testnet (Infura/Alchemy) |
| **Deployment** | AWS ECS (backend with Docker/Gunicorn/Daphne), Vercel (frontend/static), RDS (PostgreSQL), ElastiCache (Redis) |
| **Security** | CSRF, input validation, HTTPS, ReentrancyGuard (contracts), django-fernet-fields (encrypted creds), JWT/session auth |
| **Testing** | Django TestCase (unit/integration), Hardhat (contract), Playwright (E2E) |
| **Other** | Flask-Migrate (migrations), Celery Flower (task monitoring), Sentry (error logging) |

## Project Structure

```
my-django-flask-project/
├── manage.py                          # Django entry point
├── myproject/                         # Django project settings
│   ├── __init__.py
│   ├── settings/                      # Split settings
│   │   ├── __init__.py
│   │   ├── base.py                    # Base config (DB, apps, middleware)
│   │   ├── dev.py                     # Development overrides
│   │   └── prod.py                    # Production (security, logging)
│   ├── urls.py                        # Main URL routing
│   ├── asgi.py                        # ASGI for Channels/WebSockets
│   ├── wsgi.py                        # WSGI for Gunicorn
│   └── celery.py                      # Celery config
├── core/                              # Core app (auth, utils, shared templates)
│   ├── migrations/
│   ├── models.py                      # UserProfile, base models
│   ├── views.py                       # Auth views, chatbot API
│   ├── forms.py                       # Auth/forms
│   ├── utils.py                       # Gmail helpers, blockchain utils
│   ├── admin.py
│   ├── tests/                         # test_auth.py, test_utils.py
│   ├── templates/core/
│   │   ├── base.html                  # Base template (nav, footer, chatbot widget)
│   │   ├── index.html                 # Landing (hero, stats, featured NFTs)
│   │   ├── login.html                 # Google OAuth login
│   │   ├── programs.html              # Bootcamps/webinars (DB-driven)
│   │   ├── learn.html                 # Courses/learning paths
│   │   └── community.html             # Events, WhatsApp join
│   └── static/core/
│       ├── css/
│       │   ├── styles.scss            # SASS source (black/gold theme)
│       │   └── styles.css             # Compiled CSS (responsive, animations)
│       └── js/
│           ├── script.js              # General JS (nav, forms, external links)
│           └── chatbot.js             # AI chatbot widget
├── solutions/                         # NFT Marketplace app
│   ├── migrations/
│   ├── models.py                      # Solution model (title, token_id, is_sold)
│   ├── views.py                       # Submit mint, purchase, API endpoints
│   ├── forms.py                       # SolutionForm
│   ├── admin.py
│   ├── tests/                         # test_blockchain.py (mock Web3)
│   ├── templates/solutions/
│   │   ├── solutions.html             # Marketplace listings (HTMX fetch)
│   │   └── submit_solution.html       # Mint form (integrated with mint-nft.html)
│   ├── static/solutions/
│   │   └── js/
│   │       ├── blockchain.js          # Web3.js (wallet connect, buy)
│   │       ├── nft-payment.js         # Payment manager (gas est, tx tracking)
│   │       └── marketplace.js         # Dynamic listings
│   └── contracts/
│       └── SolutionNFT.sol            # Solidity ERC-721 contract
├── hiring/                            # Hiring Platform app
│   ├── migrations/
│   ├── models.py                      # Job, Application, SavedJob, ChatMessage, JobMatch
│   ├── views.py                       # Post job, apply, dashboard
│   ├── forms.py                       # JobForm, ApplicationForm
│   ├── consumers.py                   # WebSocket chat consumer
│   ├── routing.py                     # WS routing
│   ├── tasks.py                       # Celery AI matching/email
│   ├── admin.py
│   ├── tests/                         # test_hiring.py (apply, chat)
│   ├── templates/hiring/
│   │   ├── hiring.html                # Job listings (real-time via HTMX)
│   │   ├── post_job.html              # Recruiter form
│   │   └── chat.html                  # Chat interface (WebSocket)
│   └── static/hiring/
│       └── js/chat.js                 # Real-time chat client
├── investors/                         # Investor Platform app
│   ├── migrations/
│   ├── models.py                      # Pitch, InvestorProfile, Match
│   ├── views.py                       # Submit pitch, matches
│   ├── forms.py                       # PitchForm
│   ├── tasks.py                       # Celery AI matching
│   ├── admin.py
│   ├── tests/                         # test_investors.py (matching, email)
│   ├── templates/investors/
│   │   ├── investors.html             # Pitch listings/matches
│   │   └── submit_pitch.html          # Startup form
│   └── static/investors/
│       └── js/match.js                # Dynamic matches (AJAX)
├── scripts/                           # Deployment/testing scripts
│   ├── deploy_contract.py             # Web3.py contract deploy
│   └── test_contract.js               # Hardhat test wrapper
├── requirements.txt                   # Python deps
├── Dockerfile                         # Backend container (ECS)
├── docker-compose.yml                 # Local dev (Postgres/Redis/Celery)
├── nginx.conf                         # Reverse proxy config (optional)
├── .env.example                       # Env vars template
├── README.md                          # This file!
└── .gitignore                         # Standard ignores
```

## Setup Instructions

### Prerequisites
- Python 3.11+
- Node.js 18+ (for Hardhat testing)
- Docker & Docker Compose
- AWS CLI (for ECS deployment)
- MetaMask wallet with Sepolia ETH (testnet faucet: sepoliafaucet.com)
- Google Cloud Console: Enable Gmail API, create OAuth client (redirect: /oauth/callback)
- Infura/Alchemy account (free tier for Sepolia)
- OpenAI API key

### Local Development
1. Clone repo: `git clone <repo> && cd my-django-flask-project`
2. Create virtualenv: `python -m venv venv && source venv/bin/activate` (Linux/Mac) or `venv\Scripts\activate` (Windows)
3. Install deps: `pip install -r requirements.txt`
4. Copy env: `cp .env.example .env` → Edit with keys (SECRET_KEY, OPENAI_API_KEY, INFURA_URL, etc.)
5. Start services: `docker-compose up -d` (Postgres/Redis)
6. Migrate: `python manage.py makemigrations && python manage.py migrate`
7. Create superuser: `python manage.py createsuperuser`
8. Deploy contract: `python scripts/deploy_contract.py` → Note address/ABI in .env
9. Run server: `python manage.py runserver`
10. Celery: `celery -A myproject worker -l info`
11. Admin: /admin/ → Add test users/profiles.
12. Test: `python manage.py test` (Django) → `npx hardhat test scripts/test_contract.js` (contract)

## Deployment Guide

### AWS ECS Backend + Vercel Frontend
1. **AWS Setup**:
   - Create ECR repo: `aws ecr create-repository --repository-name innovators-backend`
   - Build/push: `docker build -t innovators-backend . && docker tag ... <ecr-uri>:latest && docker push <ecr-uri>`
   - RDS: Launch PostgreSQL instance → Update DATABASE_URL in secrets.
   - ElastiCache: Redis cluster → Update CELERY_BROKER_URL.
   - ECS: Create cluster → Task definition (Docker image, ports 8000/8001, env from secrets) → Service (Fargate, ALB, auto-scale 1-5).
   - ALB: HTTPS listener → Security group (HTTP/HTTPS inbound).
   - Migrate on deploy: Add init container or ECS run task: `python manage.py migrate`.

2. **Vercel Frontend**:
   - Create repo with static/ and templates/ (build: compile SASS to CSS via script).
   - Vercel CLI: `vercel --prod` → Set API proxy: vercel.json `{ "rewrites": [{ "source": "/api/(.*)", "destination": "https://<alb-dns>/api/$1" }] }`
   - Custom domain: Add to Vercel → SSL auto.

### Cost Estimate
- AWS: ECS Fargate (~$30/mo), RDS t3.micro (~$15/mo), ElastiCache (~$20/mo) = ~$65/mo.
- Vercel: Free tier for hobby, $20/mo pro.
- Infura/OpenAI: Free tiers sufficient for low traffic.

## Contributing & Ethical Guidelines
- Fork/PR for features.
- Ethical: All AI/blockchain uses require user consent; no data sold.
- Community: Join WhatsApp for discussions; align with faith-based values.

For support, contact Vincent Kimuri (founder@lhora.ai). Let's innovate with honour!

---

**Last Updated: September 09, 2025**  
**Version: 2.0 (Production-Ready with AWS/Vercel Deployment)**

**Motto**: "Innovate with Honour, Impact the World"

**Mission**: Unite brilliant minds across technology and business, providing a collaborative platform where ideas are nurtured, skills are sharpened, and innovations are brought to life through mentorship, knowledge sharing, ethical leadership, and Godly values.
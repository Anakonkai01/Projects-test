# SOFTWARE DOCUMENT: MICROSHOP E-COMMERCE PLATFORM

**Chapters 1 & 2: Introduction and Project Management Plan**

---



**Development Team:**
- Nguyen Tran Hoang Nhan
- Mai Hoang Thai  
- Nguyen Nhut Khang
- Phan Tran Minh Quang

**Project Duration:** October 1, 2025 - November 28, 2025

---

## 1. INTRODUCTION

### 1.1. Purpose and Scope

**Purpose:**

This Software Document provides comprehensive technical and managerial documentation for the Microshop E-Commerce Platform, a full-stack web application designed to facilitate online retail operations for technology products, specifically mobile phones and laptops.

The primary purposes of this document are to:
- Define the complete system architecture, design, and implementation details
- Establish project management guidelines, timelines, and resource allocation
- Document functional and non-functional requirements comprehensively
- Provide traceability from requirements through design to implementation and testing
- Serve as a knowledge base for current and future development teams

**Scope:**

**In Scope:**
- A microservices-based backend architecture consisting of three core services: Users Service, Products Service, and Orders Service
- An API Gateway for centralized request routing and authentication
- A modern React-based frontend application with responsive design
- User authentication and authorization using JWT (JSON Web Tokens)
- Product catalog management with full CRUD operations
- Shopping cart functionality with session persistence
- Order processing and management system
- Admin dashboard with business analytics and reporting
- MongoDB databases for data persistence across all services
- Docker containerization for all services

**Out of Scope:**
- Payment gateway integration (planned for future iterations)
- Third-party logistics integration
- Mobile native applications (iOS/Android)
- Real-time chat support
- Product recommendation engine using machine learning
- Multi-language support (currently Vietnamese only)
- Multi-currency support (currently VND only)

### 1.2. Product Overview

**Product Description:**

Microshop is a modern, scalable e-commerce platform designed specifically for the Vietnamese technology retail market. The platform enables customers to browse, search, and purchase mobile phones and laptops through an intuitive web interface while providing administrators with powerful tools for inventory management, order processing, and business analytics.

**Key Capabilities:**

**1. Customer-Facing Features:**
- Product browsing with advanced filtering and search capabilities
- Detailed product views with specifications, images, and pricing
- Shopping cart management with real-time inventory validation
- User account creation and profile management
- Order placement with address and contact information
- Order history and status tracking
- Responsive design supporting desktop, tablet, and mobile devices

**2. Administrative Features:**
- Centralized admin dashboard with key performance indicators (KPIs)
- Product catalog management (create, read, update, delete operations)
- Inventory tracking and stock reservation system
- Order management and status updates
- Business analytics with time-based reporting (yearly, quarterly)
- User management capabilities

**3. Technical Capabilities:**
- Microservices architecture enabling independent service scaling
- RESTful API design following industry best practices
- JWT-based authentication and authorization
- Real-time stock reservation to prevent overselling
- Containerized deployment using Docker
- Environment-based configuration management

**Usage Scenarios:**

*Scenario 1: Customer Product Purchase Journey*
- A customer visits the Microshop website seeking a new smartphone
- They browse the product catalog, filtering by brand and price range
- After selecting a product, they view detailed specifications and images
- The customer adds the item to their shopping cart
- They proceed to checkout, creating an account or logging in
- Order details are confirmed, and the purchase is completed
- The customer receives order confirmation and can track status through their account

*Scenario 2: Administrator Inventory Management*
- An administrator logs into the admin dashboard
- They review current inventory levels and identify low-stock items
- New products are added to the catalog with full specifications and images
- Product pricing is updated based on market conditions
- The administrator monitors incoming orders and updates their status
- Business analytics are reviewed to identify sales trends

**Target Users:**
- **End Customers:** Vietnamese consumers aged 18-45 seeking technology products
- **System Administrators:** Store managers and inventory specialists
- **Business Analysts:** Marketing and sales teams reviewing performance metrics

### 1.3. Structure of the Document

This Software Document is organized into seven major sections:

**Section 1: Introduction** - Foundational context including document purpose, product overview, terminology definitions

**Section 2: Project Management Plan** - Organizational structure, development lifecycle, risk analysis, resource requirements, project schedule, monitoring mechanisms, professional standards compliance

**Section 3: Requirement Specifications** - Stakeholders identification, use case model (graphical and textual), functional and non-functional requirements

**Section 4: Architecture** - Architectural style (microservices), architectural models and diagrams, technology stack, architectural rationale

**Section 5: Design** - Database schemas, UML class diagrams, sequence diagrams, design rationale, requirements-to-design traceability

**Section 6: Test Plan** - System-level test cases, traceability to use cases, test generation techniques, quality metrics

**Section 7: Demo** - Database setup instructions, source code organization, testing procedures

### 1.4. Terms, Acronyms, and Abbreviations

**Terms:**
- **Microservice:** An architectural style where an application is composed of small, independent services that communicate over well-defined APIs
- **API Gateway:** A server that acts as an API front-end, receiving API requests and routing to appropriate backend services
- **JWT (JSON Web Token):** An open standard for securely transmitting information between parties as a JSON object
- **CRUD:** Create, Read, Update, Delete - the four basic operations of persistent storage
- **Stock Reservation:** The process of temporarily allocating inventory to a specific order to prevent overselling
- **Responsive Design:** Web design approach aimed at crafting sites to provide optimal viewing experience across devices

**Acronyms:**
- **API:** Application Programming Interface
- **CRUD:** Create, Read, Update, Delete
- **CSS:** Cascading Style Sheets
- **JWT:** JSON Web Token
- **KPI:** Key Performance Indicator
- **REST:** Representational State Transfer
- **SPA:** Single Page Application
- **UI/UX:** User Interface / User Experience
- **VND:** Vietnamese Dong (currency)

---

## 2. PROJECT MANAGEMENT PLAN

### 2.1. Project Organization

**Team Structure:**

The Microshop E-Commerce Platform development team consists of four members with equal contribution and shared responsibilities. The team follows a collaborative approach where all members participate in design, development, and testing activities.

**Team Members:**

**1. Nguyen Tran Hoang Nhan - Full-Stack Developer & System Architect**
- Primary responsibilities: Backend microservices architecture, API Gateway implementation, database design, deployment automation
- Technologies mastered: Node.js, Express.js, MongoDB, Docker, Microservices architecture
- New learnings: Microservices design patterns, containerization, MongoDB ODM with Mongoose, API Gateway architecture

**2. Mai Hoang Thai - Full-Stack Developer & Frontend Lead**
- Primary responsibilities: React frontend development, UI/UX implementation, state management (Redux), responsive design
- Technologies mastered: React, Redux Toolkit, Tailwind CSS, Framer Motion, Vite
- New learnings: React Hooks (useState, useEffect, useContext), Redux Toolkit for state management, modern CSS frameworks, component-based architecture

**3. Nguyen Nhut Khang - Full-Stack Developer & Integration Specialist**
- Primary responsibilities: Service integration, authentication system, API testing, documentation
- Technologies mastered: JWT authentication, RESTful APIs, Axios, API integration patterns
- New learnings: Full-stack integration patterns, JWT authentication flow, API design and documentation, service-to-service communication

**4. Phan Tran Minh Quang - Full-Stack Developer & Quality Assurance Lead**
- Primary responsibilities: Testing strategy, code quality assurance, version control management, bug tracking
- Technologies mastered: Git workflows, testing methodologies, debugging tools, Notion project management
- New learnings: Git branching strategies, code review processes, testing methodologies, project management tools

**Communication Channels:**
- **Team Meetings:** Weekly in-person meetings on weekends (Saturday/Sunday)
- **Daily Standups:** Asynchronous updates via messaging platform
- **Documentation:** Centralized in Notion workspace
- **Code Collaboration:** GitHub with pull request reviews
- **Issue Tracking:** GitHub Issues and Notion task boards

### 2.2. Lifecycle Model Used

**Development Methodology: Waterfall Model**

The Microshop E-Commerce Platform follows the traditional Waterfall software development lifecycle model due to:
1. Clear and well-defined requirements from the beginning
2. Academic context with structured phase deliverables
3. Fixed timeline (October 1 - November 28, 2025)
4. Team learning needs for new technologies

**Waterfall Phases:**

**Phase 1: Requirements Analysis (October 1-7, 2025)**
- Duration: 1 week
- Activities: Stakeholder identification, use case development, functional and non-functional requirements gathering, technology stack research
- Deliverables: Requirements Specification Document, use case diagrams and descriptions, technology evaluation report

**Phase 2: System Design (October 8-21, 2025)**
- Duration: 2 weeks
- Activities: Architectural design (microservices pattern), database schema design, API interface design, UI/UX wireframing and mockups, component and class diagram creation
- Deliverables: Architecture Document, Detailed Design Document, database schemas, API specifications

**Phase 3: Implementation (October 22 - November 10, 2025)**
- Duration: 3 weeks
- Activities: Backend microservices development, frontend React application development, database implementation, API Gateway configuration, authentication system implementation, integration of all components
- Deliverables: Source code in GitHub repository, Docker configuration files, environment setup documentation

**Phase 4: Testing (November 11-17, 2025)**
- Duration: 1 week
- Activities: Unit testing of individual components, integration testing across services, system testing of end-to-end workflows, user acceptance testing, performance and security testing, bug identification and resolution
- Deliverables: Test Plan Document, test case specifications, test execution results, bug reports and resolution logs

**Phase 5: Deployment & Documentation (November 18-28, 2025)**
- Duration: 11 days
- Activities: Production environment setup, deployment automation configuration, final system documentation, user manual creation, code documentation, project presentation preparation
- Deliverables: Deployed application, complete Software Document, user and technical manuals, deployment scripts, project demonstration

### 2.3. Risk Analysis

**Key Project Risks and Mitigation Strategies:**

**Risk 1: Technical Learning Curve**
- **Description:** All team members are new to the technology stack (React, Node.js, MongoDB, Docker, Microservices)
- **Probability:** High (90%)
- **Impact:** High - Could delay development and reduce code quality
- **Mitigation:** Dedicated learning period in early phases, pair programming sessions, weekly technical workshops, comprehensive documentation
- **Status:** [TODO: Update current status]

**Risk 2: Integration Complexity**
- **Description:** Microservices architecture requires complex integration between multiple services
- **Probability:** Medium (60%)
- **Impact:** High - Service communication failures could break the application
- **Mitigation:** Early API contract definition, use of API Gateway, comprehensive integration testing, Docker Compose for development environment
- **Status:** [TODO: Update current status]

**Risk 3: Timeline Constraint**
- **Description:** Fixed 2-month timeline may be insufficient for full-featured e-commerce platform
- **Probability:** Medium (50%)
- **Impact:** Medium - May result in incomplete features or rushed implementation
- **Mitigation:** MVP approach prioritizing core features, weekly progress tracking, parallel development of frontend and backend, early feature cut identification
- **Status:** [TODO: Update current status]

**Risk 4: Version Control Conflicts**
- **Description:** Four developers working simultaneously may cause merge conflicts
- **Probability:** Medium (60%)
- **Impact:** Low to Medium - Could slow development
- **Mitigation:** Clear branching strategy (feature branches), mandatory pull request reviews, regular commits, code ownership areas
- **Status:** [TODO: Update current status]

**Risk 5: Security Vulnerabilities**
- **Description:** Security flaws in authentication, authorization, or data handling
- **Probability:** Medium (40%)
- **Impact:** High - Could compromise user data and system integrity
- **Mitigation:** Use of established libraries (JWT, bcrypt), HTTPS enforcement, input validation and sanitization, security code reviews, environment variable management
- **Status:** [TODO: Update current status]

**Risk 6: Database Design Changes**
- **Description:** Schema changes during development could require significant refactoring
- **Probability:** Medium (50%)
- **Impact:** Medium - Could delay development and require data migrations
- **Mitigation:** Thorough upfront database design, use of Mongoose for schema flexibility, migration scripts for schema changes, design reviews before implementation, NoSQL flexibility of MongoDB
- **Status:** [TODO: Update current status]

**Risk 7: Communication and Coordination**
- **Description:** Weekend-only meetings may lead to miscommunication or delayed decisions
- **Probability:** Medium (50%)
- **Impact:** Low to Medium - Could slow progress and cause rework
- **Mitigation:** Detailed meeting minutes in Notion, asynchronous communication via chat, clear task assignments with deadlines, shared documentation for all decisions, daily status updates
- **Status:** [TODO: Update current status]

**Risk 8: Insufficient Testing Time**
- **Description:** Limited 1-week testing phase may not be sufficient to identify and fix all bugs
- **Probability:** Low (30%)
- **Impact:** High - Could result in production issues or unstable deployment
- **Mitigation:** Early testing during development, continuous integration practices, automated testing where possible, prioritization of critical bugs, buffer time in deployment phase
- **Status:** [TODO: Update current status]



### 2.4. Hardware and Software Resource Requirements

**Development Environment:**

**Hardware Requirements (Per Team Member):**
- **Processor:** Intel Core i5/AMD Ryzen 5 (minimum) or Intel Core i7/AMD Ryzen 7 (recommended)
- **RAM:** 8 GB minimum, 16 GB recommended
- **Storage:** 256 GB SSD minimum, 512 GB SSD recommended
- **Network:** Stable internet connection (10+ Mbps)
- **Display:** 1920x1080 resolution minimum

**Software Stack - New Technologies Learned:**

**Backend Technologies (All New Learning):**
- **Node.js
- **Express.js 
- **Mongoose 
- **jsonwebtoken 
- **bcryptjs 
- **Docker 

**Frontend Technologies (All New Learning):**
- **React 
- **Redux Toolkit 
- **React Router DOM 
- **Axios 
- **Tailwind CSS 
- **Vite 

**Database:**
- **MongoDB 

**Development Tools:**
- **Visual Studio Code:** Primary code editor (used by all 4 members)
- **MongoDB Compass:** Database GUI (all members)
- **Postman:** API testing (all members)
- **Git/GitHub:** Version control - NEW: Collaborative workflows, PR reviews, branching strategies

**Team Learning Summary:**

All team members learned the entire MERN stack from scratch during this project:
- **Shared Learning:** Git collaboration, Docker basics, API design, security best practices, testing methodologies
- **Nhan:** Microservices architecture, MongoDB/Mongoose, Docker Compose, DevOps concepts
- **Thai:** React ecosystem (Hooks, Redux), modern CSS (Tailwind), Vite, responsive design
- **Khang:** Full-stack integration, JWT auth flow, API testing and documentation
- **Quang:** Git workflows, testing strategies, debugging tools, project management (Notion)

### 2.5. Deliverables and Schedule

**Project Timeline: October 1, 2025 - November 28, 2025 (59 days)**

**Major Deliverables:**

| # | Deliverable | Description | Due Date | Status | Acceptance Criteria |
|---|------------|-------------|----------|--------|---------------------|
| D1 | Requirements Document | Complete Section 3 of Software Document | Oct 7, 2025 | [TODO: Update] | All use cases documented, functional/non-functional requirements complete |
| D2 | Architecture Document | Complete Section 4 of Software Document | Oct 14, 2025 | [TODO: Update] | Architectural diagrams complete, technology stack justified |
| D3 | Detailed Design Document | Complete Section 5 of Software Document | Oct 21, 2025 | [TODO: Update] | Class diagrams, sequence diagrams, database schemas complete |
| D4 | Backend Microservices | Functional Users, Products, Orders services | Nov 3, 2025 | [TODO: Update] | All API endpoints working, database connected, tested |
| D5 | API Gateway | Functional gateway with authentication | Nov 3, 2025 | [TODO: Update] | JWT auth working, routing functional, CORS configured |
| D6 | Frontend Application | Complete React application | Nov 10, 2025 | [TODO: Update] | All pages functional, responsive design, Redux working |
| D7 | Integrated System | Fully integrated and functional system | Nov 10, 2025 | [TODO: Update] | Frontend-backend connected, Docker working, all features functional |
| D8 | Test Plan & Results | Complete Section 6 of Software Document | Nov 17, 2025 | [TODO: Update] | Test cases written, executed, results documented |
| D9 | Deployed Application | Production-ready deployment | Nov 24, 2025 | [TODO: Update] | Application accessible online, stable, no critical bugs |
| D10 | Final Software Document | Complete documentation (all 7 sections) | Nov 28, 2025 | [TODO: Update] | All sections complete, properly formatted, no errors |



### 2.6. Monitoring, Reporting, and Controlling Mechanisms

**Progress Monitoring System:**

**1. Notion Workspace Structure:**
- **Project Overview:** Team members, roles, timeline, quick links
- **Sprint/Week Board (Kanban):** Backlog, To Do, In Progress, In Review, Testing, Done
- **Meeting Notes:** Weekly meeting minutes, decision logs, action items
- **Bug Tracker:** Open bugs, In Progress, Resolved
- **Documentation:** Technical specs, API docs, learning resources, code standards
- **Metrics Dashboard:** Progress metrics, velocity tracking, risk register

**2. Weekly Progress Reports:**

Template includes:
- Team attendance and accomplishments
- Work in progress with completion percentages
- Planned tasks for next week
- Blockers and issues with resolution plans
- Metrics: Tasks completed, PRs merged, bugs found/fixed, commits
- Risks and mitigation status
- Team member contributions

**3. GitHub Version Control Monitoring:**

**Repository Structure:**
- `main` branch (protected, production-ready)
- `develop` branch (integration branch)
- `feature/*` branches (individual features)

**Branch Strategy:**
- Feature branches merge to `develop` via Pull Requests
- At least 1 reviewer approval required before merge
- `develop` merges to `main` at major milestones

**4. Code Quality Metrics:**

| Metric | Target | Measurement | Frequency |
|--------|--------|-------------|-----------|
| Code Review Coverage | 100% of PRs | GitHub PR stats | Weekly |
| PR Review Time | < 24 hours | GitHub metrics | Weekly |
| Commit Frequency | Daily during dev | GitHub history | Weekly |
| Build Success Rate | > 95% | Local testing | Weekly |
| Bug Resolution Time | < 3 days avg | Bug tracker | Weekly |

**5. Communication Protocols:**

| Purpose | Method | Frequency | Participants |
|---------|--------|-----------|--------------|
| Project Status | Weekly report | Weekly | All members |
| Daily Updates | Async chat | Daily | All members |
| Technical Discussions | Chat + meeting | As needed | Relevant members |
| Code Review | GitHub PR comments | Per PR | Reviewer + author |
| Major Decisions | Weekend meeting + Notion | As needed | All members (vote) |




### 2.7. Professional Standards

**Coding Standards:**

**JavaScript/Node.js Backend:**
- Style Guide: Airbnb JavaScript Style Guide (modified)
- Naming: camelCase for variables/functions, PascalCase for classes, UPPER_SNAKE_CASE for constants
- File naming: camelCase.js (e.g., `userController.js`)

**React/Frontend:**
- Style Guide: Airbnb React/JSX Style Guide
- Component naming: PascalCase (e.g., `ProductCard.jsx`)
- Files match component names

**API Design Standards:**

RESTful API principles:
- GET: Retrieve resources (read-only, idempotent)
- POST: Create new resources
- PUT: Update entire resource
- PATCH: Partial update
- DELETE: Remove resource

**Response Format Standard:**
```javascript
// Success
{ "success": true, "data": {...}, "message": "..." }

// Error
{ "success": false, "error": "...", "details": {...} }
```

**HTTP Status Codes:**
- 200: OK (successful GET, PUT, PATCH, DELETE)
- 201: Created (successful POST)
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

**Security Standards:**

- **Password Security:** Bcrypt hashing with salt rounds of 10, minimum 6 characters
- **JWT Tokens:** HS256 algorithm, 30-day expiration, minimal payload (user ID and role only)
- **Input Validation:** Sanitization and validation for all user inputs
- **Environment Variables:** All sensitive data in `.env` files, never committed
- **CORS Configuration:** Controlled origins, credentials enabled

**Database Standards:**

- Collections: plural, lowercase (e.g., `users`, `products`, `orders`)
- Fields: camelCase (e.g., `firstName`, `createdAt`)
- Include `createdAt` and `updatedAt` timestamps in all schemas
- Required fields clearly marked with validation



**Documentation Standards:**

- JSDoc style comments for functions
- README for each major component/service
- API documentation with endpoints, parameters, responses
- Environment variables documentation

**Code Review Standards:**

Checklist:
- Code follows style guide
- No hardcoded credentials or secrets
- Error handling is appropriate
- Code is readable and maintainable
- Comments where needed
- No debug code or console.logs
- Tests included (when applicable)



### 2.8. Evidence of Configuration Management

**Version Control System: GitHub**

**Repository Details:**
- Repository Name: `Final_E-commerce` or `microshop-ecommerce`
- URL: [TODO: Add your GitHub repository URL]
- Visibility: Private (for development)

**Repository Structure:**
```
Final_E-commerce/
├── frontend/              # React frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── Dockerfile
├── microshop-microservices/  # Backend
│   ├── gateway/          # API Gateway
│   ├── services/
│   │   ├── users/
│   │   ├── products/
│   │   └── orders/
│   └── docker-compose.yml
└── docs/                 # Documentation
```

**Protected Branches:**
- `main`: Protected, requires PR reviews, production-ready code
- `develop`: Integration branch, requires PR reviews
- `feature/*`: Individual feature branches

**Dependency Management:**
- All dependencies version-locked in `package.json` and `package-lock.json`
- Lock files committed for reproducible builds

**Configuration Files Under Version Control:**
- Tracked: `docker-compose.yml`, `Dockerfile`, config files, `.env.example`
- Excluded: `.env`, `node_modules/`, `dist/`, `build/`, log files

**Environment Configuration:**
- `.env.example` templates provided
- Actual `.env` files never committed
- Environment-specific configurations documented

### 2.9. Impact of the Project on Individuals and Organizations

**Impact on Individuals:**

**1. For Customers (End Users):**

**Convenience and Accessibility:**
- Enables 24/7 online shopping for technology products without geographical constraints
- Provides detailed product information and specifications for informed decision-making
- Offers convenient order tracking and management through user accounts
- Saves time by eliminating need for physical store visits

**Digital Literacy Enhancement:**
- Encourages adoption of e-commerce platforms in Vietnam
- Familiarizes users with online payment systems and digital transactions
- Promotes trust in online shopping for technology products

**Economic Benefits:**
- Access to competitive pricing through easy price comparison
- Potential for better deals and promotions available exclusively online
- Reduced transportation costs associated with physical shopping

**2. For Administrators (Store Owners/Managers):**

**Operational Efficiency:**
- Streamlined inventory management with real-time stock tracking
- Automated order processing reduces manual workload
- Centralized dashboard provides quick access to business analytics
- Simplified product catalog management with CRUD operations

**Business Intelligence:**
- Access to analytics and reporting tools for data-driven decisions
- Understanding of customer purchasing patterns and trends
- Ability to identify best-selling products and optimize inventory

**Skill Development:**
- Exposure to modern e-commerce management tools
- Learning digital business management practices
- Understanding of online retail operations

**3. For Development Team:**

**Technical Skill Acquisition:**
- Mastery of full-stack web development (MERN stack)
- Experience with microservices architecture and containerization
- Understanding of modern development practices (Git, CI/CD, code reviews)
- Security implementation expertise (JWT, encryption, input validation)

**Professional Growth:**
- Real-world project management experience
- Collaborative software development skills
- Problem-solving in complex system integration
- Portfolio development for career advancement

**Soft Skills Development:**
- Team communication and coordination
- Time management and deadline adherence
- Documentation and technical writing
- Presentation and demonstration skills

**Impact on Organizations:**

**1. For Small and Medium Technology Retailers:**

**Business Expansion:**
- Enables establishment of online presence without large investment
- Expands market reach beyond physical store location
- Provides platform to compete with larger retailers
- Opens opportunities for 24/7 sales generation

**Competitive Advantage:**
- Modern, professional platform matching larger competitors
- Ability to quickly update pricing and promotions
- Responsive customer service through order management tools
- Analytics-driven inventory optimization

**Cost Efficiency:**
- Reduced need for large physical retail space
- Lower overhead costs compared to traditional retail
- Automated processes reduce labor requirements
- Better inventory management reduces waste

**2. For Vietnamese E-Commerce Ecosystem:**

**Market Development:**
- Contributes to growth of domestic e-commerce platforms
- Demonstrates viability of specialized niche platforms (technology products)
- Encourages digital transformation in retail sector
- Creates reference implementation for similar businesses

**Technology Adoption:**
- Showcases modern web technologies in Vietnamese context
- Provides open-source learning resource for developers
- Promotes microservices architecture adoption
- Demonstrates Docker containerization benefits

**3. For Educational Institution:**

**Academic Excellence:**
- Provides practical application of theoretical concepts
- Demonstrates comprehensive software engineering methodology
- Creates reusable teaching material and case studies
- Showcases student capabilities to industry partners

**Industry Alignment:**
- Bridges gap between academic learning and industry requirements
- Prepares students for professional software development
- Creates potential recruitment opportunities
- Demonstrates program effectiveness

**Societal Impact:**

**1. Digital Economy Contribution:**
- Supports Vietnam's digital transformation initiative
- Contributes to e-commerce sector growth
- Promotes cashless transaction adoption
- Encourages technology-driven business models

**2. Employment and Economic Growth:**
- Potential for job creation (developers, administrators, support staff)
- Enables entrepreneurship in technology retail
- Contributes to GDP through increased online commerce
- Supports technology sector development

**3. Consumer Empowerment:**
- Increases price transparency in technology market
- Provides consumers with more purchasing options
- Enables informed decision-making through product information
- Promotes fair competition among retailers

**4. Environmental Considerations:**
- Reduces carbon footprint from shopping trips
- Optimized inventory management reduces waste
- Digital documentation reduces paper usage
- Efficient logistics through centralized order management

**Long-term Impact:**

**Scalability and Future Growth:**
- Platform designed for expansion to additional product categories
- Architecture supports integration of advanced features (AI recommendations, payment gateways)
- Potential for mobile application development
- Foundation for multi-vendor marketplace evolution

**Knowledge Transfer:**
- Documentation serves as learning resource for future students
- Code repository available for educational purposes
- Project methodology applicable to other domains
- Team members become mentors for future cohorts

**Industry Influence:**
- Demonstrates modern development practices to local businesses
- Encourages adoption of microservices architecture
- Promotes professional coding standards
- Inspires similar projects in academic and commercial sectors

---

**Information to be Updated:**

1. **GitHub Repository Information (Section 2.6 & 2.8):**
   - Repository URL: [TODO: Add your actual GitHub repository URL]
   - Total Commits: [TODO: Count from GitHub]
   - Pull Requests: [TODO: Count from GitHub]
   - Issues Opened/Closed: [TODO: From GitHub Issues]

2. **Project Progress (Section 2.5 & 2.6):**
   - Update status for each deliverable (D1-D10)
   - Update milestone completion status (M1-M8)
   - Update actual completion percentages
   - Add completion dates where applicable

3. **Risk Status (Section 2.3):**
   - Update current status for each risk (R001-R008)
   - Add notes on mitigation effectiveness
   - Document any new risks encountered

4. **Development Statistics (Section 2.6):**
   - Backend Services Completed: [TODO: X/3]
   - Frontend Pages Completed: [TODO: X/~10]
   - API Endpoints Implemented: [TODO: X/~30]
   - Test Cases Written: [TODO: X/>50]
   - Bugs Fixed: [TODO: Total number]
   - Code Review Coverage: [TODO: X%]

5. **Team Contact Information (Section 2.1):**
   - Add email addresses or phone numbers for each team member if required

**How to Fill in TODO Items:**

**Step-by-Step Guide:**

1. **GitHub Repository Statistics:**
   - Open your GitHub repository
   - Navigate to "Insights" > "Contributors" for commit statistics
   - Go to "Pull Requests" tab, count opened and merged PRs
   - Check "Issues" tab for opened/closed issue counts
   - Use GitHub API or manual count for accurate numbers
   - Example: `Total Commits: 247` (replace [TODO] with actual number)

2. **Project Progress Updates:**
   - Review your project management tool (Notion/Jira)
   - Check each milestone's completion status
   - Update deliverable status: "Not Started", "In Progress", "Completed", "Delayed"
   - Add actual completion dates for finished items
   - Calculate completion percentages based on subtasks
   - Example: `D1 Status: Completed (Oct 8, 2025)` instead of `[TODO: Update]`

3. **Risk Status Updates:**
   - Review each risk weekly
   - Update status: "Active", "Monitoring", "Mitigated", "Occurred", "Resolved"
   - Document any risk occurrences and resolutions
   - Add notes on mitigation effectiveness
   - Identify any new risks that emerged
   - Example: `R001 Status: Monitoring - Team learning progressing well`

4. **Development Statistics:**
   - Count backend services completed (Users, Products, Orders = 3 total)
   - List frontend pages/components created
   - Count API endpoints implemented (use API documentation)
   - Track test cases written and passed
   - Document bugs fixed (from GitHub Issues or bug tracker)
   - Measure code review coverage: (PRs reviewed / Total PRs) × 100%
   - Example: `Backend Services: 3/3 (100%)` instead of `[TODO: X/3]`

5. **Team Contact Information (if required):**
   - Add email addresses: `yourname@university.edu`
   - Add phone numbers if requested by instructor
   - Ensure all team members consent to sharing contact info

6. **Date and Version Updates:**
   - Update "Last Updated" with current date when finalizing
   - Change status from "Draft" to "Final"
   - Update version number if making revisions
   - Example: `Last Updated: November 28, 2025` instead of `[TODO: Add date]`

**Quality Checklist Before Submission:**

- [ ] All [TODO] markers replaced with actual data
- [ ] GitHub URL is correct and accessible
- [ ] All statistics are accurate and up-to-date
- [ ] Dates are in consistent format (YYYY-MM-DD or Month DD, YYYY)
- [ ] Status fields use consistent terminology
- [ ] No placeholder text remains in document
- [ ] All team member information is accurate
- [ ] Document has been proofread for errors
- [ ] Excel file is also updated with same information
- [ ] References section is complete (if applicable)

**Common Mistakes to Avoid:**

❌ **Don't:**
- Leave [TODO] markers in final submission
- Use generic or fake GitHub URLs
- Copy statistics from other projects
- Inconsistent date formats throughout document
- Vague risk descriptions without clear mitigation
- Missing new learning documentation (critical for rubric!)
- Forget to update Excel file to match markdown
- Submit without proofreading

✅ **Do:**
- Replace all [TODO] with actual project data
- Use your real GitHub repository URL
- Provide accurate, verifiable statistics
- Use consistent formatting throughout
- Detail specific risks with concrete mitigation plans
- Emphasize what each team member learned (required!)
- Keep Excel and markdown synchronized
- Proofread multiple times before submission

**Excel File Created:**

A comprehensive Project List Excel file has been created with 6 sheets:
- Project Overview - Team information and roles
- Timeline & Milestones - Project phases and key milestones  
- Task Assignment - 53 detailed tasks with assignments
- Weekly Schedule - Week-by-week activities
- Risk Register - Risks and mitigation strategies
- Progress Tracking - GitHub stats and metrics

**Next Steps:**

1. Review and customize this document for your specific project details
2. Fill in all [TODO] items with actual data from your project
3. Update the Excel file with actual progress and dates
4. Complete Chapters 3-7 (Requirements, Architecture, Design, Test Plan, Demo)
5. Prepare final presentation and demo materials

---

*Document Version: 2.0 (Enhanced)*

*Last Updated: [TODO: Add date when finalized]*

*Status: Draft - Awaiting TODO completion*

## DOCUMENT CHANGELOG

**Version 2.0 (Enhanced) - Current Version**
- ✅ Added 3 additional risks (R006, R007, R008) for comprehensive risk coverage (8 total)
- ✅ Enhanced GitHub metrics tracking with detailed categories
- ✅ Added License & Ethical Standards to Professional Standards section
- ✅ Included acceptance criteria for all deliverables
- ✅ Added detailed weekend meeting structure and schedule
- ✅ Created Document Completeness Summary table
- ✅ Added Rubric Compliance Check table
- ✅ Enhanced "How to Fill in TODO Items" with step-by-step guide
- ✅ Added Quality Checklist and Common Mistakes sections
- ✅ Improved Risk Priority Matrix visualization
- ✅ Updated Excel file with 8 comprehensive risks

**Version 1.0 (Initial)**
- Initial document with Chapters 1 & 2
- Basic structure following rubric requirements
- 5 initial risks identified
- Core sections complete
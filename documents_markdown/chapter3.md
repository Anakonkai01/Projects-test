# SOFTWARE DOCUMENT: MICROSHOP E-COMMERCE PLATFORM

**Chapter 3: Requirement Specifications**

---



## 3. REQUIREMENT SPECIFICATIONS

### 3.1. Stakeholders for the System

This section identifies all stakeholders who have interest in or will be affected by the Microshop E-Commerce Platform.

#### 3.1.1. Primary Stakeholders

**1. End Customers (Vietnamese Consumers)**

**Profile:**
- Age range: 18-45 years old
- Primary need: Purchase mobile phones and laptops online
- Tech-savvy individuals seeking convenient shopping experience
- Located in Vietnam, primarily urban areas

**Interests and Needs:**
- Easy-to-use interface for browsing and purchasing products
- Detailed product information and specifications
- Secure payment and personal data handling
- Order tracking and management capabilities
- Responsive customer support
- Competitive pricing and product availability

**Value Received:**
- Convenient 24/7 online shopping
- Access to wide range of technology products
- Transparent pricing and product information
- Time-saving compared to physical store visits
- Order history and tracking capabilities

---

**2. System Administrators (Store Managers and Staff)**

**Profile:**
- Store managers and inventory specialists
- Responsible for daily operations and product management
- Basic to intermediate technical skills
- Work schedule: Regular business hours with some flexibility

**Interests and Needs:**
- Efficient product catalog management
- Real-time inventory tracking
- Order processing and fulfillment tools
- Customer management capabilities
- Easy-to-understand analytics and reporting
- Reliable system with minimal downtime

**Value Received:**
- Streamlined inventory management
- Automated order processing
- Business insights through analytics
- Reduced manual workload
- Centralized control panel for all operations

---

**3. Business Owners / Store Managers**

**Profile:**
- Owners of technology retail businesses
- Decision-makers for business strategy
- Focus on profitability and growth
- Need comprehensive business overview

**Interests and Needs:**
- Sales analytics and business performance metrics
- Revenue tracking and reporting
- Customer behavior insights
- Inventory optimization data
- Return on investment (ROI) visibility
- Scalability for business growth

**Value Received:**
- Data-driven business decisions
- Improved operational efficiency
- Increased revenue potential through online channel
- Reduced operational costs
- Competitive advantage in market

---

#### 3.1.2. Secondary Stakeholders

**4. Development Team**

**Profile:**
- 4 software developers (full-stack)
- Responsible for building, maintaining, and evolving the system
- Varied experience levels with new technologies

**Interests and Needs:**
- Clear system requirements and specifications
- Maintainable and scalable codebase
- Comprehensive documentation
- Modern development tools and practices
- Collaborative development environment

**Value Received:**
- Learning experience with modern tech stack
- Portfolio-worthy project
- Practical application of software engineering principles
- Teamwork and collaboration skills

---

**5. Technical Support Staff (Future)**

**Profile:**
- IT staff responsible for system maintenance
- Handle technical issues and user support
- Monitor system performance and health

**Interests and Needs:**
- System monitoring and logging capabilities
- Error tracking and reporting
- Documentation for troubleshooting
- User activity logs
- System health metrics

**Value Received:**
- Tools for efficient problem resolution
- Clear system architecture understanding
- Monitoring dashboards

---

#### 3.1.3. Stakeholder Summary Matrix

| Stakeholder Group | Primary Goals | System Usage Frequency | Technical Expertise | Priority Level |
|-------------------|---------------|----------------------|---------------------|----------------|
| **End Customers** | Purchase products conveniently | High (Daily/Weekly) | Basic to Intermediate | Critical |
| **System Administrators** | Manage operations efficiently | Very High (Daily) | Intermediate | Critical |
| **Business Owners** | Maximize revenue and insights | Medium (Weekly) | Basic to Intermediate | High |
| **Development Team** | Build and maintain system | Very High (Daily during dev) | Advanced | High |
| **Technical Support** | Maintain system health | High (as needed) | Advanced | Medium |

---

### 3.2. Use Case Model

This section presents the complete use case model for the Microshop E-Commerce Platform, including graphical representations using Mermaid diagrams and detailed textual descriptions for each use case.

#### 3.2.1. Graphical Use Case Model

**System Boundary:** Microshop E-Commerce Platform

**Actors:**
- **Customer:** End user who browses and purchases products
- **Administrator:** System admin who manages products, orders, and users
- **System:** Automated processes (e.g., stock reservation, notifications)

---

##### Use Case Diagram 1: General System Overview (Complete View)

This diagram shows all actors and all use cases in the Microshop E-Commerce Platform.



---

#### 3.2.2. Textual Description for Each Use Case

This section provides detailed textual descriptions for each use case identified in the graphical models.
  
---

#### 3.2.3. Use Case Prioritization Matrix

| Priority | Use Cases | Rationale |
|----------|-----------|-----------|
| **Critical (Must Have)** | UC02, UC03, UC06, UC07, UC11, UC17, UC18, UC23, UC24 | Core functionality required for MVP. System cannot function without these. |
| **High (Should Have)** | UC01, UC04, UC08, UC09, UC12, UC13, UC19, UC20, UC22 | Important features that significantly enhance usability and functionality. |
| **Medium (Could Have)** | UC05, UC10, UC14, UC15, UC21, UC25 | Nice-to-have features that improve user experience but not essential for launch. |
| **Low (Won't Have in MVP)** | UC16, UC26, UC27, UC28 | Features that can be added post-launch or are primarily for convenience. |

---

### 3.3. Functional Requirements

This section lists all functional requirements for the Microshop E-Commerce Platform, organized by module.

#### 3.3.1. User Management Module (FR001-FR012)

| Requirement ID | Requirement Description | Priority | Related Use Case |
|----------------|------------------------|----------|------------------|
| **FR001** | The system shall allow new users to register with name, email, and password | Critical | UC01 |
| **FR002** | The system shall validate email format and uniqueness during registration | Critical | UC01 |
| **FR003** | The system shall enforce minimum password length of 6 characters | Critical | UC01 |
| **FR004** | The system shall hash passwords using bcrypt before storage | Critical | UC01, UC02 |
| **FR005** | The system shall allow registered users to login with email and password | Critical | UC02 |
| **FR006** | The system shall generate JWT tokens upon successful authentication | Critical | UC02 |
| **FR007** | The system shall lock user accounts after 5 consecutive failed login attempts | High | UC02 |
| **FR008** | The system shall allow users to update their profile information | Medium | UC15 |
| **FR009** | The system shall allow users to change their password with current password verification | Medium | UC15 |
| **FR010** | The system shall allow users to logout and invalidate their session token | Medium | UC16 |
| **FR011** | The system shall differentiate between regular users and administrators using role-based access | Critical | UC02, UC17 |
| **FR012** | The system shall maintain user session for 24 hours (or 30 days with "Remember Me") | Medium | UC02 |

---

#### 3.3.2. Product Management Module (FR013-FR030)

| Requirement ID | Requirement Description | Priority | Related Use Case |
|----------------|------------------------|----------|------------------|
| **FR013** | The system shall allow customers to browse products with pagination (12 per page) | Critical | UC03 |
| **FR014** | The system shall display product name, price, category, image, and stock status | Critical | UC03, UC06 |
| **FR015** | The system shall allow customers to search products by name, description, and specifications | High | UC04 |
| **FR016** | The system shall provide autocomplete suggestions during product search | Medium | UC04 |
| **FR017** | The system shall allow customers to filter products by category, brand, price range, and stock status | High | UC05 |
| **FR018** | The system shall allow customers to sort products by price, name, and date added | High | UC03 |
| **FR019** | The system shall display detailed product information including specifications and images | Critical | UC06 |
| **FR020** | The system shall track product views for analytics purposes | Medium | UC06 |
| **FR021** | The system shall allow administrators to create new products with all required information | Critical | UC19 |
| **FR022** | The system shall validate product data (price > 0, stock >= 0, required fields) | Critical | UC19 |
| **FR023** | The system shall generate unique product IDs automatically | Critical | UC19 |
| **FR024** | The system shall allow administrators to edit existing product information | Critical | UC20 |
| **FR025** | The system shall log all product changes with timestamp and admin ID | High | UC20 |
| **FR026** | The system shall allow administrators to delete products (soft delete) | Medium | UC21 |
| **FR027** | The system shall preserve deleted products for order history | Medium | UC21 |
| **FR028** | The system shall support two product categories: Phones and Laptops | Critical | All Product UCs |
| **FR029** | The system shall mark products as "Out of Stock" when stock quantity is 0 | High | UC03, UC06 |
| **FR030** | The system shall mark products as "Low Stock" when quantity is below threshold (5 units) | Medium | UC22 |

---

#### 3.3.3. Shopping Cart Module (FR031-FR042)

| Requirement ID | Requirement Description | Priority | Related Use Case |
|----------------|------------------------|----------|------------------|
| **FR031** | The system shall allow customers to add products to cart with specified quantity | Critical | UC07 |
| **FR032** | The system shall validate stock availability before adding to cart | Critical | UC07 |
| **FR033** | The system shall enforce maximum quantity limit of 10 units per product | High | UC07 |
| **FR034** | The system shall increase quantity if product already exists in cart | High | UC07 |
| **FR035** | The system shall display cart icon with item count in header | High | UC07, UC08 |
| **FR036** | The system shall allow customers to view all items in their cart | Critical | UC08 |
| **FR037** | The system shall calculate and display subtotals and total price in real-time | Critical | UC08 |
| **FR038** | The system shall validate cart items (stock, prices) when viewing cart | High | UC08 |
| **FR039** | The system shall allow customers to update item quantities in cart | High | UC09 |
| **FR040** | The system shall allow customers to remove items from cart | High | UC10 |
| **FR041** | The system shall store cart in database for logged-in users | High | UC07, UC08 |
| **FR042** | The system shall store cart in browser localStorage for guest users | High | UC07, UC08 |

---

#### 3.3.4. Order Management Module (FR043-FR054)

| Requirement ID | Requirement Description | Priority | Related Use Case |
|----------------|------------------------|----------|------------------|
| **FR043** | The system shall require user login before checkout | Critical | UC11 |
| **FR044** | The system shall allow customers to enter shipping information during checkout | Critical | UC11 |
| **FR045** | The system shall validate all required shipping fields (name, phone, address) | Critical | UC11 |
| **FR046** | The system shall generate unique order IDs in format ORD-YYYYMMDD-XXXXX | Critical | UC11 |
| **FR047** | The system shall create orders with status "Pending" | Critical | UC11 |
| **FR048** | The system shall decrement product stock upon order placement | Critical | UC11 |
| **FR049** | The system shall clear customer cart after successful order placement | Critical | UC11 |
| **FR050** | The system shall allow customers to view their order history | High | UC12 |
| **FR051** | The system shall allow customers to view detailed information for each order | High | UC13 |
| **FR052** | The system shall allow customers to track order status with timeline | Medium | UC14 |
| **FR053** | The system shall allow customers to cancel orders with status "Pending" | Medium | UC13 |
| **FR054** | The system shall restore stock when order is cancelled | Medium | UC13, UC24 |

---

#### 3.3.5. Admin Dashboard Module (FR055-FR060)

| Requirement ID | Requirement Description | Priority | Related Use Case |
|----------------|------------------------|----------|------------------|
| **FR055** | The system shall provide admin dashboard with key performance indicators (KPIs) | Critical | UC18 |
| **FR056** | The system shall display total orders, revenue, products, and customers on dashboard | Critical | UC18 |
| **FR057** | The system shall provide charts for revenue and orders over time | High | UC18, UC25 |
| **FR058** | The system shall allow administrators to view all orders with filters and search | Critical | UC23 |
| **FR059** | The system shall allow administrators to update order status | Critical | UC24 |
| **FR060** | The system shall log all status changes with timestamp and admin ID | High | UC24 |

---

### 3.4. Non-Functional Requirements

This section specifies the non-functional requirements that define system qualities and constraints.

#### 3.4.1. Performance Requirements (NFR001-NFR004)

| Requirement ID | Requirement Description | Measurement Criteria | Priority |
|----------------|------------------------|---------------------|----------|
| **NFR001** | The system shall load product listing page within 2 seconds under normal conditions | Page load time ≤ 2s | High |
| **NFR002** | The system shall process checkout and create order within 3 seconds | Checkout completion time ≤ 3s | High |
| **NFR003** | The system shall support at least 100 concurrent users without performance degradation | Response time increase < 10% with 100 users | Medium |
| **NFR004** | The system shall display search results within 1 second for queries | Search response time ≤ 1s | High |

---

#### 3.4.2. Security Requirements (NFR005-NFR010)

| Requirement ID | Requirement Description | Implementation Method | Priority |
|----------------|------------------------|----------------------|----------|
| **NFR005** | The system shall store passwords using bcrypt hashing with salt | Bcrypt library with cost factor 10 | Critical |
| **NFR006** | The system shall use JWT tokens for authentication with HS256 algorithm | jsonwebtoken library | Critical |
| **NFR007** | The system shall enforce HTTPS for all client-server communication | HTTPS/TLS configuration | Critical |
| **NFR008** | The system shall validate and sanitize all user inputs to prevent injection attacks | Input validation middleware | Critical |
| **NFR009** | The system shall implement CORS policy to restrict API access | CORS middleware configuration | High |
| **NFR010** | The system shall log all admin actions for audit purposes | Logging middleware | High |

---

#### 3.4.3. Usability Requirements (NFR011-NFR014)

| Requirement ID | Requirement Description | Success Criteria | Priority |
|----------------|------------------------|------------------|----------|
| **NFR011** | The system shall provide a responsive design that works on desktop, tablet, and mobile devices | Works on screens from 320px to 1920px width | Critical |
| **NFR012** | The system shall display error messages in Vietnamese language | All error messages in Vietnamese | High |
| **NFR013** | The system shall provide visual feedback for all user actions within 0.5 seconds | Loading indicators, success/error messages | High |
| **NFR014** | The system shall follow consistent UI/UX patterns throughout the application | Consistent colors, fonts, layouts | Medium |

---

#### 3.4.4. Reliability Requirements (NFR015-NFR018)

| Requirement ID | Requirement Description | Target Metric | Priority |
|----------------|------------------------|---------------|----------|
| **NFR015** | The system shall have an uptime of at least 99% during business hours | Uptime ≥ 99% | High |
| **NFR016** | The system shall handle database connection failures gracefully with error messages | No application crashes on DB errors | High |
| **NFR017** | The system shall implement data validation to prevent corrupt data entry | Validation on all inputs | Critical |
| **NFR018** | The system shall backup database daily to prevent data loss | Automated daily backups | High |

---

#### 3.4.5. Scalability Requirements (NFR019-NFR020)

| Requirement ID | Requirement Description | Implementation Approach | Priority |
|----------------|------------------------|------------------------|----------|
| **NFR019** | The system shall use microservices architecture to allow independent service scaling | 3 services + API Gateway | High |
| **NFR020** | The system shall use Docker containers for easy deployment and scaling | Docker & Docker Compose | High |

---

## APPENDIX A: REQUIREMENTS TRACEABILITY MATRIX

| Use Case ID | Functional Requirements | Non-Functional Requirements | Priority |
|-------------|------------------------|----------------------------|----------|
| UC01 | FR001, FR002, FR003, FR004 | NFR005, NFR008, NFR011 | Critical |
| UC02 | FR005, FR006, FR007, FR012 | NFR005, NFR006, NFR008 | Critical |
| UC03 | FR013, FR014, FR018 | NFR001, NFR011 | Critical |
| UC04 | FR015, FR016 | NFR004, NFR011 | High |
| UC05 | FR017 | NFR011 | High |
| UC06 | FR019, FR020 | NFR001, NFR011 | Critical |
| UC07 | FR031, FR032, FR033, FR034, FR035 | NFR008, NFR013 | Critical |
| UC08 | FR036, FR037, FR038 | NFR001, NFR011 | Critical |
| UC09 | FR039 | NFR013 | High |
| UC10 | FR040 | NFR013 | High |
| UC11 | FR043, FR044, FR045, FR046, FR047, FR048, FR049 | NFR002, NFR008, NFR017 | Critical |
| UC12 | FR050 | NFR001, NFR011 | High |
| UC13 | FR051, FR053 | NFR011 | High |
| UC14 | FR052 | NFR011 | Medium |
| UC15 | FR008, FR009 | NFR005, NFR008 | Medium |
| UC16 | FR010 | - | Medium |
| UC17 | FR011 | NFR005, NFR006, NFR010 | Critical |
| UC18 | FR055, FR056, FR057 | NFR001 | High |
| UC19 | FR021, FR022, FR023 | NFR008, NFR010, NFR017 | Critical |
| UC20 | FR024, FR025 | NFR008, NFR010 | Critical |
| UC21 | FR026, FR027 | NFR010 | Medium |
| UC22 | FR030 | NFR001, NFR010 | High |
| UC23 | FR058 | NFR001 | Critical |
| UC24 | FR059, FR060, FR054 | NFR010, NFR013 | Critical |
| UC25 | FR057 | NFR004 | Medium |

---

## APPENDIX B: REQUIREMENTS SUMMARY

### Summary Statistics

| Category | Count |
|----------|-------|
| **Stakeholders** | 5 groups |
| **Use Cases** | 28 total (16 customer, 12 admin) |
| **Functional Requirements** | 60 requirements |
| **Non-Functional Requirements** | 20 requirements |
| **Business Rules** | 125 rules (embedded in use cases) |

### Requirements Coverage by Priority

| Priority | Use Cases | Functional Req | Non-Functional Req |
|----------|-----------|----------------|-------------------|
| Critical | 11 | 28 | 8 |
| High | 10 | 22 | 9 |
| Medium | 6 | 8 | 2 |
| Low | 1 | 2 | 1 |

### Module Coverage

| Module | Use Cases | Functional Req | % of Total FR |
|--------|-----------|----------------|---------------|
| User Management | 4 | 12 | 20% |
| Product Management | 7 | 18 | 30% |
| Shopping Cart | 4 | 12 | 20% |
| Order Management | 6 | 12 | 20% |
| Admin Dashboard | 7 | 6 | 10% |

---

## DOCUMENT VERSION CONTROL

**Version:** 1.0
**Last Updated:** [TODO: Add date when finalized]
**Status:** Complete - Ready for review
**Next Steps:** 
- Review and validate with team
- Get stakeholder approval
- Proceed to Chapter 4 (Architecture)

---

*End of Chapter 3: Requirement Specifications*
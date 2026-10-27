# UML Models — Event Management System (EMS)

Companion to [SRS.md](SRS.md). All diagrams are written in [Mermaid](https://mermaid.js.org/) and render directly on
GitHub. Requirement IDs (`FR-…`) refer to [SRS § 5](SRS.md#5-functional-requirements).

1. [Use Case Diagram](#1-use-case-diagram)
2. [Component Diagram](#2-component-diagram)
3. [Class Diagram — Domain Model](#3-class-diagram--domain-model)
4. [Class Diagram — Backend Services](#4-class-diagram--backend-services)
5. [Sequence Diagrams](#5-sequence-diagrams)
6. [Activity Diagram — Create Event](#6-activity-diagram--create-event)
7. [State Diagram — Client Session](#7-state-diagram--client-session)
8. [Entity-Relationship Diagram](#8-entity-relationship-diagram)
9. [Deployment Diagram](#9-deployment-diagram)

---

## 1. Use Case Diagram

Mermaid has no native use case notation, so actors are drawn as rounded nodes and use cases as ellipse-like stadium
nodes inside the system boundary. `Organizer` **generalises** `Attendee` (inherits all its use cases); both specialise
`Registered User`.

```mermaid
flowchart LR
    Guest(["👤 Guest"])
    Attendee(["👤 Attendee"])
    Organizer(["👤 Organizer"])
    Admin(["👤 Administrator"])
    Maps(["⚙️ Google Maps"])

    subgraph EMS["EMS"]
        UC1(["Register<br/>FR-AUTH-1"])
        UC2(["Log in<br/>FR-AUTH-2"])
        UC3(["Refresh token<br/>FR-AUTH-3"])
        UC4(["Manage profile<br/>FR-USER-1/2"])
        UC5(["Log out<br/>FR-USER-3"])
        UC6(["Browse / search / filter events<br/>FR-EVT-2/3"])
        UC7(["View event details<br/>FR-EVT-4"])
        UC8(["Get similar events<br/>FR-REC-1"])
        UC9(["Register / cancel attendance<br/>FR-ATT-1/3"])
        UC10(["Create / edit / delete event<br/>FR-EVT-1/5/6"])
        UC11(["Pick location on map<br/>FR-EVT-7"])
        UC12(["Manage categories<br/>FR-CAT-1..3"])
        UC13(["View participants<br/>FR-ATT-2"])
        UC14(["Read API docs<br/>FR-OPS-1"])
        UC15(["Deploy & migrate<br/>FR-OPS-4"])
    end

    Guest --- UC1
    Guest --- UC2

    Attendee --- UC3
    Attendee --- UC4
    Attendee --- UC5
    Attendee --- UC6
    Attendee --- UC7
    Attendee --- UC9

    Organizer -. "generalises" .-> Attendee
    Organizer --- UC10
    Organizer --- UC12
    Organizer --- UC13

    UC7 -. "«include»" .-> UC8
    UC10 -. "«include»" .-> UC11
    UC10 -. "«extend»" .-> UC12
    UC11 --- Maps

    Admin --- UC14
    Admin --- UC15
```

### Use case descriptions (main ones)

| UC   | Name                | Primary actor | Preconditions    | Main success scenario                                                                                                                                                                                    | Alternative flows                                                |
|------|---------------------|---------------|------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------|
| UC1  | Register            | Guest         | Not logged in    | 1. Opens `/auth/register`. 2. Enters name, e-mail, password. 3. System validates, hashes password, creates user, issues tokens. 4. Client stores tokens, opens dashboard.                                | 3a. Invalid data → field errors. 3b. E-mail taken → 409 message. |
| UC2  | Log in              | Guest         | Account exists   | 1. Opens `/auth/login`. 2. Enters credentials. 3. System verifies bcrypt hash, issues tokens. 4. Dashboard opens.                                                                                        | 3a. Wrong e-mail or password → "Invalid credentials".            |
| UC6  | Browse events       | Attendee      | Logged in        | 1. Opens dashboard. 2. Sets search / category / dates / sort. 3. System returns a page of events. 4. Client renders cards and map markers.                                                               | 2a. Invalid filter → 400 with messages.                          |
| UC9  | Register attendance | Attendee      | Event exists     | 1. Opens event. 2. Clicks "Attend". 3. System creates Attendance. 4. Participant list refreshes.                                                                                                         | 3a. Event deleted meanwhile → 404.                               |
| UC10 | Create event        | Organizer     | Logged in        | 1. Opens create page. 2. Fills form, picks location on map (UC11), optionally creates category (UC12). 3. System validates and stores event with `createdById` from token. 4. Redirect to event details. | 3a. End before start → 400. 3b. Unknown category → 404.          |
| UC8  | Get similar events  | Attendee      | Viewing an event | 1. Client requests recommendations. 2. System returns cached result or computes candidates, scores and caches them. 3. Up to 10 events shown.                                                            | 2a. No candidates → empty list.                                  |

---

## 2. Component Diagram

```mermaid
flowchart TB
    subgraph Client["«component» Web Client (Next.js)"]
        direction TB
        Pages["app/ pages<br/>auth · dashboard · events"]
        Comp["components/<br/>auth · events · category · maps · common"]
        Ctx["context/<br/>AuthContext · GoogleMapsContext"]
        Hooks["hooks/api<br/>useAuth · useEvents · useCategories · useAttendance<br/>(TanStack Query)"]
        Api["lib/api<br/>Axios client + services"]
        Store["lib/storage<br/>tokenStorage (localStorage)"]
        Pages --> Comp --> Hooks --> Api
        Comp --> Ctx --> Api
        Api --> Store
    end

    subgraph Server["«component» REST API (NestJS)"]
        direction TB
        Cross["Cross-cutting<br/>AuthGuard · ValidationPipe · ResponseInterceptor<br/>Exception filters · HttpLoggerMiddleware"]
        Auth["AuthModule"]
        Token["TokenModule"]
        User["UserModule"]
        Event["EventModule"]
        Rec["EventRecommendationModule"]
        Cat["CategoryModule"]
        Att["AttendanceModule"]
        Cache["CacheModule"]
        Db["DatabaseModule (Prisma)"]

        Auth --> Token
        Auth --> User
        Event --> Cat
        Att --> User
        Att --> Event
        Rec --> Event
        Rec --> Att
        Rec --> Cache
        User --> Db
        Event --> Db
        Cat --> Db
        Att --> Db
    end

    Api -- "«REST/JSON» /api/v1" --> Cross
    Cross --> Auth & User & Event & Rec & Cat & Att
    Db --> PG[("PostgreSQL")]
    Cache --> RD[("Redis")]
    Comp -- "«Maps JS API»" --> GM["Google Maps"]
```

---

## 3. Class Diagram — Domain Model

```mermaid
classDiagram
    direction LR

    class User {
        +UUID id
        +String firstName
        +String lastName
        +String email «unique»
        -String password «bcrypt hash»
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Category {
        +UUID id
        +String name
        +String description [0..1]
        +UUID createdById
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Event {
        +UUID id
        +String title
        +String description
        +DateTime startDate
        +DateTime endDate
        +String location
        +Float latitude [0..1]
        +Float longitude [0..1]
        +UUID createdById
        +UUID categoryId [0..1]
        +DateTime createdAt
        +DateTime updatedAt
    }

    class Attendance {
        +UUID id
        +UUID userId
        +UUID eventId
        +DateTime createdAt
        +DateTime updatedAt
    }

    User "1" *-- "0..*" Category : creates ▶
    User "1" *-- "0..*" Event : organizes ▶
    User "1" *-- "0..*" Attendance : has ▶
    Event "1" *-- "0..*" Attendance : has ▶
    Category "0..1" o-- "0..*" Event : groups ▶
```

Composition (`*--`) marks cascade delete; aggregation (`o--`) marks `onDelete: Restrict` (a category cannot be removed
while events reference it).

---

## 4. Class Diagram — Backend Services

Shows the layered design (Controller → Service → Repository) and the Strategy pattern used for recommendations.

```mermaid
classDiagram
    direction TB

    class AuthController {
        +login(LoginDto) AuthResponseDto
        +register(CreateUserDto) AuthResponseDto
        +refresh(RefreshToken) AccessToken
    }
    class AuthService {
        +register(CreateUserDto) AuthResponseDto
        +login(LoginDto) AuthResponseDto
        +refreshToken(RefreshToken) AccessToken
        +validateAccessToken(AccessToken) UserEntity
        -getUserByToken(token, TokenType) UserEntity
    }
    class TokenService {
        -ACCESS_TOKEN_EXPIRE
        -REFRESH_TOKEN_EXPIRE
        -JWT_SECRET_KEY
        +generateTokenByType(Payload, TokenType) string
        +verifyTokenByType(token, TokenType) Payload
        +generateAccessTokens(UserEntity) TokensDto
    }
    class UserService {
        +createUser(CreateUserDto) UserEntity
        +findUserByIdOrThrow(id) UserEntity
        +findUserByEmailWithPassword(email) User
        +updateUser(id, UpdateUserDto) UserEntity
        +deleteUser(id) UserEntity
    }
    class AuthGuard {
        +canActivate(ExecutionContext) boolean
    }
    class TokenType {
        <<enumeration>>
        ACCESS
        REFRESH
    }

    class EventController
    class EventService {
        +findPageableEvents(EventFilterDto) PageResponse
        +findEventByIdOrThrow(id) EventEntity
        +createEvent(CreateEventDto) EventEntity
        +updateEvent(id, UpdateEventDto) EventEntity
        +deleteEvent(id) EventEntity
        +findEventsByFilter(filter) EventEntity[]
        +findUserAttendedEvents(userId) EventEntity[]
    }
    class EventRepository
    class EventFilterBuilder {
        +addSearch(search) this
        +addCategoryFilter(categoryId) this
        +addDateRangeFilter(start, end) this
        +addRadiusFilter(lat, lng, radiusKm) this
        +addSorting(sortBy, sortOrder) this
        +build() WhereAndOrderBy
    }

    class EventRecommendationController {
        +getRecommendations(eventId, user) EventWithScoreDto[]
    }
    class EventRecommendationService {
        -scoringPipeline
        +getRecommendedEvents(eventId, userId, limit) EventWithScoreDto[]
        -buildContext()
        -generateCandidates()
        -scoreCandidates()
        -findSimilarUsers()
    }
    class SimilarityStrategy {
        <<interface>>
        +calculate(event1, event2) number
    }
    class CategorySimilarityStrategy
    class LocationSimilarityStrategy
    class TimeSimilarityStrategy
    class CacheService {
        +getOrSet(key, fn, ttl) T
        +get(key) T
        +set(key, value, ttl)
        +del(key)
    }

    class CategoryService {
        +findPageableCategories()
        +createCategory()
        +findCategoryByIdOrThrow(id)
        +updateCategory()
        +deleteCategory(id)
    }
    class AttendanceService {
        +createAttendance()
        +findAllAttendance()
        +findAttendanceByUserId()
        +findAttendanceByEventId()
        +updateAttendance()
        +deleteAttendance()
    }

    AuthController --> AuthService
    AuthService --> UserService
    AuthService --> TokenService
    TokenService ..> TokenType
    AuthGuard --> AuthService

    EventController --> EventService
    EventService --> EventRepository
    EventService --> CategoryService
    EventRepository ..> EventFilterBuilder

    EventRecommendationController --> EventRecommendationService
    EventRecommendationController --> CacheService
    EventRecommendationService --> EventService
    EventRecommendationService --> AttendanceService
    EventRecommendationService o-- "3" SimilarityStrategy
    SimilarityStrategy <|.. CategorySimilarityStrategy
    SimilarityStrategy <|.. LocationSimilarityStrategy
    SimilarityStrategy <|.. TimeSimilarityStrategy

    AttendanceService --> UserService
    AttendanceService --> EventService
```

---

## 5. Sequence Diagrams

### 5.1 Login (FR-AUTH-2)

```mermaid
sequenceDiagram
    autonumber
    actor U as Guest
    participant FE as Web Client
    participant AC as AuthController
    participant VP as ValidationPipe
    participant AS as AuthService
    participant US as UserService
    participant DB as PostgreSQL
    participant TS as TokenService

    U->>FE: enter e-mail + password
    FE->>FE: Zod validation
    FE->>AC: POST /api/v1/auth/login {email, password}
    AC->>VP: validate(loginSchema)
    VP-->>AC: ok
    AC->>AS: login(dto)
    AS->>US: findUserByEmailWithPassword(email)
    US->>DB: SELECT … WHERE email = ?
    DB-->>US: user (with hash) | null
    US-->>AS: user | null
    alt user not found or bcrypt.compare fails
        AS-->>AC: BadRequestException("Invalid credentials")
        AC-->>FE: 400 {isError: true, message}
        FE-->>U: show error
    else credentials valid
        AS->>TS: generateAccessTokens(user)
        TS-->>AS: {accessToken, refreshToken}
        AS-->>AC: {user without password, tokens}
        AC-->>FE: 200 {data: {user, accessToken, refreshToken}}
        FE->>FE: tokenStorage.setTokens(), setUser()
        FE-->>U: redirect /dashboard
    end
```

### 5.2 Authenticated request with transparent token refresh (FR-AUTH-3, FR-AUTH-4)

```mermaid
sequenceDiagram
    autonumber
    participant FE as Axios client
    participant G as AuthGuard
    participant AS as AuthService
    participant TS as TokenService
    participant C as Controller

    FE->>G: GET /api/v1/event  (Authorization: Bearer access)
    G->>AS: validateAccessToken(access)
    AS->>TS: verifyTokenByType(access, ACCESS)
    alt token valid
        TS-->>AS: payload {userId, email, type}
        AS-->>G: user
        G->>C: request with req.user
        C-->>FE: 200 data
    else token expired / no user
        TS-->>FE: 4xx
        Note over FE: on 401 and not yet retried
        FE->>AS: POST /auth/refresh {refreshToken}
        AS->>TS: verifyTokenByType(refresh, REFRESH)
        TS-->>AS: payload
        AS-->>FE: 200 {accessToken}
        FE->>FE: store new access token
        FE->>G: retry original request
        G-->>FE: 200 data
    end
```

### 5.3 Create event (FR-EVT-1)

```mermaid
sequenceDiagram
    autonumber
    actor O as Organizer
    participant FE as EventForm
    participant GM as Google Maps
    participant EC as EventController
    participant ES as EventService
    participant CS as CategoryService
    participant ER as EventRepository
    participant DB as PostgreSQL

    O->>FE: fill title, description, dates
    O->>GM: click / search location
    GM-->>FE: address, lat, lng
    O->>FE: submit
    FE->>EC: POST /api/v1/event (Bearer)
    Note over EC: AuthGuard sets req.user<br/>ValidationPipe(createEventSchema)
    EC->>EC: dto.createdById = user.id
    EC->>ES: createEvent(dto)
    opt categoryId given
        ES->>CS: findCategoryByIdOrThrow(categoryId)
        CS-->>ES: category | 404
    end
    ES->>ER: createEvent(dto)
    ER->>DB: INSERT INTO events
    DB-->>ER: row
    ER-->>ES: EventEntity
    ES-->>EC: EventEntity
    EC-->>FE: 201 {data: event}
    FE-->>O: redirect to event details
```

### 5.4 Similar events with cache (FR-REC-1, FR-REC-2)

```mermaid
sequenceDiagram
    autonumber
    participant FE as SimilarEvents
    participant RC as RecommendationController
    participant CA as CacheService (Redis)
    participant RS as RecommendationService
    participant ES as EventService
    participant AS as AttendanceService

    FE->>RC: GET /event/recommendation?eventId=X
    RC->>CA: getOrSet("similar_events:X:U")
    alt cache hit
        CA-->>RC: cached list
    else cache miss
        CA->>RS: getRecommendedEvents(X, U)
        RS->>ES: findEventByIdOrThrow(X)
        RS->>ES: findUserAttendedEvents(U)
        RS->>AS: findUsersWhoAttendedEvents(userEventIds)
        par candidate generation
            RS->>ES: same category (≤50)
            RS->>ES: next 90 days (≤30)
            RS->>ES: within 50 km (≤30)
            RS->>ES: events of similar users
        end
        RS->>RS: score = 0.4·category + 0.3·location + 0.2·time + 0.1·collaborative
        RS->>RS: sort desc, take 10
        RS-->>CA: list
        CA->>CA: SET key, TTL
        CA-->>RC: list
    end
    RC-->>FE: 200 {data: [event + score]}
```

---

## 6. Activity Diagram — Create Event

```mermaid
flowchart TD
    S((●)) --> A[Open 'Create event' page]
    A --> B{Authenticated?}
    B -- no --> L[Redirect to /auth/login] --> E1((◉))
    B -- yes --> C[Fill title, description, dates]
    C --> D[Pick location on map]
    D --> F{Category exists?}
    F -- no --> G[Create category in dialog] --> H
    F -- yes --> H[Select category]
    H --> I[Submit form]
    I --> J{Client validation OK?}
    J -- no --> K[Show field errors] --> C
    J -- yes --> M[POST /event]
    M --> N{Server validation OK?}
    N -- "400 / 404" --> K
    N -- 201 --> O[Invalidate event queries]
    O --> P[Show event details page]
    P --> E2((◉))
```

---

## 7. State Diagram — Client Session

```mermaid
stateDiagram-v2
    [*] --> Anonymous
    Anonymous --> Authenticating : submit login / register
    Authenticating --> Authenticated : 200/201, tokens stored
    Authenticating --> Anonymous : 400 / 409

    Authenticated --> Authenticated : API call 2xx
    Authenticated --> Refreshing : API call 401
    Refreshing --> Authenticated : refresh 200, retry request
    Refreshing --> Anonymous : refresh fails, tokens cleared

    Authenticated --> Anonymous : logout (clearAll)
    Authenticated --> Anonymous : delete account
    Anonymous --> [*]
```

---

## 8. Entity-Relationship Diagram

Physical schema as defined in `backend/prisma/schema.prisma`.

```mermaid
erDiagram
    users {
        uuid id PK
        string first_name
        string last_name
        string email UK
        string password "nullable, bcrypt"
        timestamp created_at
        timestamp updated_at
    }
    categories {
        uuid id PK
        string name
        string description "nullable"
        uuid created_by_id FK "indexed"
        timestamp created_at
        timestamp updated_at
    }
    events {
        uuid id PK
        string title
        string description
        timestamp start_date "indexed"
        timestamp end_date
        string location
        float latitude "nullable"
        float longitude "nullable"
        uuid created_by_id FK "indexed"
        uuid category_id FK "nullable, indexed"
        timestamp created_at
        timestamp updated_at
    }
    Attendance {
        uuid id PK
        uuid userId FK
        uuid eventId FK
        timestamp created_at
        timestamp updated_at
    }

    users ||--o{ categories : "creates (CASCADE)"
    users ||--o{ events : "organizes (CASCADE)"
    users ||--o{ Attendance : "attends (CASCADE)"
    categories |o--o{ events : "groups (RESTRICT)"
    events ||--o{ Attendance : "has (CASCADE)"
```

---

## 9. Deployment Diagram

```mermaid
flowchart TB
    subgraph Dev["«device» Developer machine"]
        Git[git push main]
    end

    subgraph GH["«execution environment» GitHub Actions"]
        direction LR
        Lint[lint] --> Build[build] --> Unit[unit tests] --> E2E["e2e tests<br/>«service» postgres"]
        E2E --> MC[migrations check] --> Mig["migrate<br/>prisma migrate deploy"] --> Dep[deploy hook]
    end

    subgraph Render["«cloud» Render — Frankfurt"]
        direction TB
        FEnode["«node» ems-frontend<br/>Docker · Next.js :3000"]
        BEnode["«node» ems-backend<br/>Docker · NestJS :3000"]
        PGnode[("«database» ems-db<br/>PostgreSQL 17")]
        RDnode[("«keyvalue» ems-redis<br/>Redis, allkeys-lru")]
        BEnode --> PGnode
        BEnode --> RDnode
    end

    Browser["«device» User browser"] -- HTTPS --> FEnode
    Browser -- "HTTPS /api/v1" --> BEnode
    Browser -- HTTPS --> Maps["Google Maps Platform"]

    Git --> GH
    Mig --> PGnode
    Dep --> BEnode
    Dep --> FEnode
```

Local equivalent (`docker-compose.yaml`): `db` (postgres:17) and `redis` (redis:7-alpine) with health checks →
`migrator` (one-shot `prisma migrate deploy`) → `backend` (host port 4000) → `frontend` (host port 3000), all on the
`app-network` bridge.

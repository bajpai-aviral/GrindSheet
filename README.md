# 🏋️ grindsheet

A full-stack web application that lets users log daily workout sessions — tracking exercises, sets, reps, and weight — with a built-in week-on-week comparison to monitor progress over time.

---

## 📸 Overview

grindsheet helps fitness enthusiasts maintain structured workout logs in a clean tabular format and compare today's performance against the same day from the previous week — making it easy to spot improvements and stay accountable.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Angular 17+ |
| UI Library | Angular Material |
| Backend | Spring Boot 3.2 (Java 21) |
| Database | PostgreSQL |
| ORM | Spring Data JPA + Hibernate |
| Auth | Spring Security + JWT |
| Build Tool | Maven |

---

## ✨ Features

- 🔐 **User Authentication** — Secure signup, login, and logout with JWT
- 📋 **Daily Workout Logging** — Log exercises with sets, reps, and weight in a table
- 📅 **Day-by-Day Navigation** — Browse and edit logs for any past date
- 📊 **Week-on-Week Comparison** — Side-by-side view of this week vs last week (same day)
- 🟢 **Progress Highlights** — Green for improvements, red for drops
- 📈 **Session Summary** — Total volume and sets per session

---

## 📁 Project Structure

```
/grindsheet
  /client                        ← Angular frontend
    /src/app
      /auth                      ← Login, Register, Auth Guard
      /dashboard                 ← Calendar + today's snapshot
      /workout                   ← Log table + comparison view
      /shared                    ← Navbar, reusable components, API service
  /server                        ← Spring Boot backend
    /src/main/java/com/.../
      /auth                      ← JWT filter, security config
      /user                      ← User entity + repository
      /workout                   ← WorkoutLog + Exercise entity, service, controller
    /src/main/resources
      application.properties
    pom.xml
  .gitignore
  README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Java 21+ ([adoptium.net](https://adoptium.net))
- Node.js 18+ & Angular CLI (`npm install -g @angular/cli`)
- PostgreSQL ([postgresql.org](https://postgresql.org))
- Maven (bundled with most IDEs or install separately)

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/grindsheet.git
cd grindsheet
```

---

### 2. Setup the Database

Open your PostgreSQL shell or pgAdmin and run:

```sql
CREATE DATABASE workoutdb;
```

---

### 3. Configure the Backend

Edit `server/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/workoutdb
spring.datasource.username=your_pg_username
spring.datasource.password=your_pg_password

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.PostgreSQLDialect

server.port=8080
jwt.secret=your_jwt_secret_key
```

---

### 4. Run the Backend

```bash
cd server
./mvnw spring-boot:run
```

Backend will start at `http://localhost:8080`

---

### 5. Run the Frontend

```bash
cd client
npm install
ng serve
```

Frontend will start at `http://localhost:4200`

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |
| POST | `/api/auth/logout` | Logout |

### Workout Logs
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/logs?date=YYYY-MM-DD` | Get log for a specific date |
| POST | `/api/logs` | Create a new log entry |
| DELETE | `/api/logs/:id` | Delete a log |

### Exercises
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/exercises` | Add exercise to a log |
| PUT | `/api/exercises/:id` | Edit sets / reps / weight |
| DELETE | `/api/exercises/:id` | Delete an exercise |

### Comparison
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/compare?date=YYYY-MM-DD` | Get this day vs same day last week |

---

## 🗄️ Database Schema

```
User
──────────────────────────
id           UUID (PK)
name         String
email        String (unique)
password     String (hashed)
created_at   DateTime

WorkoutLog
──────────────────────────
id           UUID (PK)
user_id      UUID (FK → User)
date         Date
created_at   DateTime

Exercise
──────────────────────────
id           UUID (PK)
log_id       UUID (FK → WorkoutLog)
name         String
sets         Int
reps         Int
weight       Float
notes        String (optional)
```

---

## 🗺️ Roadmap

- [x] Project planning & architecture
- [ ] Project setup & configuration
- [ ] User authentication (Spring Security + JWT)
- [ ] Workout log CRUD APIs
- [ ] Angular log table UI
- [ ] Week-on-week comparison feature
- [ ] Dashboard with calendar navigation
- [ ] Deployment (Vercel + Render)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you'd like to change.

---

## 📄 License

[MIT](LICENSE)

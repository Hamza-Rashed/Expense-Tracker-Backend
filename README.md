# Expense Tracker – NestJS & Prisma

**Expense Tracker Backend** built with **NestJS**, **Prisma**, and **PostgreSQL**.  
A clean, scalable, and secure system supporting **JWT Authentication**,  
**Role-Based Access Control**, **Budgets**, and **Transactions** with full **Swagger API documentation**.

---

## Project Overview

This project allows users to **track income, expenses, categories, and budgets securely**.

**Features:**
- **Multiple users** with different roles
- **Fine-grained access control**
- **Budget tracking per category**
- **Advanced transaction filtering**
- **Clean & scalable architecture**

---

## Tech Stack

### **Backend**
- **NestJS (TypeScript)**
- **Prisma ORM**
- **PostgreSQL**
- **JWT Authentication**
- **Kafka** *(Event-driven – optional)*
- **Swagger / OpenAPI**

---

## Authentication & Security

- Users authenticate using **JWT Access Tokens**
- **Refresh Token** stored as **HttpOnly Cookie**
- Protected APIs require valid authentication
- Token refresh mechanism implemented
- Secure logout with refresh token revocation

---

## User Roles & Authorization

### **Roles**
- **Admin**
- **User**

### **Permissions**
| Action | Admin | User |
|------|------|------|
| Create users | ✅ | ❌ |
| Update/Delete users | ✅ | ❌ |
| Manage own data | ✅ | ✅ |
| List all users | ✅ | ❌ |
| List all transactions | ✅ | ❌ |

**Authorization enforced using:**
- **Role-Based Access Control**
- **Ability-Based Guards**

---

## Core Modules

## Database Seeding

Before running the application, make sure to run the database seed.

### Run Seed
```bash
npx prisma db seed
```

## Default Login Credentials

After running the seed, you can log in using the following accounts:

### Admin Account
- **Email:** admin@gmail.com
- **Password:** 123456

### User Account
- **Email:** user@gmail.com
- **Password:** 123456

> These credentials are for **development purposes only**.

### **Users**
- Admin can **create / update / delete** users
- Each user has:
  - **Role** (admin / user)
  - **Status** (active / inactive)
- Users can access **only their own data**

---

### **Categories**
- Each user can create multiple categories
- Duplicate category names per user are **not allowed**
- Can't delete a category if linked with transactions
- Categories are **user-scoped**

**APIs:**
- Create category
- Get all categories (**admin only**)
- Get category by ID
- Get categories by user ID

---

### **Transactions**
Each transaction belongs to:
- **User**
- **Category**

**Supports:**
- Income & Expense types
- Date-based tracking

**Available Filters:**
- By user ID
- By category ID
- By transaction type
- By date range
- Monthly summary (Income vs Expense)

**Access Rules:**
- Admin can list all transactions
- Users can access **only their own transactions**

---

### **Budgets**
- Each category can have a budget
- Budget tracks:
  - **Total spent**
  - **Remaining amount**
  - **Percentage used**
  - **Exceeded status**
- Budget automatically checked on transaction **create / update**

---

## Event-Driven Architecture (Kafka)

- Transaction create/update emits events
- Events used to:
  - Check budget limits
  - Log activities
  - Trigger alerts *(optional)*

> Kafka is internal and **not required** for frontend integration

---

## API Documentation

Swagger available at:

```bash
http://localhost:3000/api-docs
```

**Swagger includes:**
- All endpoints
- Request / response schemas
- Authentication details
- Role-based access rules

---

## API Features Summary

### **Authentication**
- `POST /auth/login`
- `POST /auth/refresh-token`
- `POST /auth/logout`

### **Users (Admin only)**
- `POST /users`
- `GET /users`
- `GET /users/:id`
- `PUT /users/:id`
- `DELETE /users/:id`

### **Categories**
- `POST /category`
- `GET /category`
- `GET /category/:id`
- `GET /category/user/:userId`

### **Transactions**
- `POST /transactions`
- `GET /transactions`
- `GET /transactions/:id`
- `GET /transactions/user/:userId`
- `GET /transactions/category/:categoryId`
- `GET /transactions/by-type`
- `GET /transactions/by-date/range`
- `GET /transactions/summary/monthly`

### **Budgets**
- `POST /budgets`
- `GET /budgets/category/:categoryId`
- `GET /budgets/user/:userId`

---

## Development Notes

- **DTO-based validation**
- **Centralized error handling**
- **Modular architecture**
- **Clean separation of concerns**
- **Frontend-ready (Next.js compatible)**

---

## Git Workflow

- Built **step by step**
- Each major feature implemented in a **separate branch**
- Follow progress via GitHub branches

---

## Running the Project

```bash
npm install
npx prisma migrate dev
npm run start:dev

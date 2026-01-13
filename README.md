# 🏢 Tenant Management System - Backend

## ✅ Completed Tasks

### 1. Project Setup
- **Create New Nest JS Project** - Tenant Management System ✅

### 2. Database
- **Create Prisma Connection With PostgreSQL** - Auth & User Models ✅
- **Create DatabaseService Module** - Linked with `app.module` ✅

### 3. Modules
- **User Module** - Handles user information ✅
- **Auth Module** - Handles login and authentication (email & password) ✅

### 4. API Testing
- **Test the APIs** to ensure all endpoints work as expected ✅  
- **Test Cases:**  
  - Create a User with Auth simultaneously using `$transaction` in Prisma (rollback if any fail) ✅  
  - Verify login works as expected ✅

### 5. Error Handling
- **Create Error System** in `src/errors` ✅

### 6. Tools
- **Postman** - Testing APIs ✅

### 7. Authentication
- **Create Access Token** - Protect the APIs using JWT. Give access to the APIs based on the JWT ✅
- **Create Refresh Token Table** - Store refresh token in DB upon login ✅
- **Add User Device Info** - Store IP and UserAgent with refresh token ✅

### 8. Account Management
- **Lock Account** - Lock if failed login attempts > 5 ✅
- **Unlock Account Function (Admin Module)**  
  - Unlock without resetting password ✅  
  - Unlock with password reset to default ✅

### 9. Logout
- **Logout Function**  
  - Logout from current device ✅  
  - Logout from all devices ✅

### 10. Roles
- **User Roles (RBAC)**  
  - Add role with user creation and access token ✅
  - Protect the APIs using the role. Give access to the APIs based on the role ✅

### 11. Helmet and Rate Limiting
- **Helmet**  
  - Use helmet middleware for security ✅
- **Rate Limiting**  
  - Rate Limiting Module: Protect the APIs using rate limiting ✅

### 12. Updateted Auth
- **Update using username instead of email**  
  - Updated the login information to recieve the username instead of email when the user login and thet's because not all users have email address ✅

### 13. Update Schema.Prisma
- **Tenant** 
  - Create complete model related to Tenant Fields ✅
- **User**  
  - Complete creating all the required columns for the user model ✅
- **New Tables**  
  - Create TenantPlan, TenantType, TenantStatus, updated the role table ✅

### 14. Tenant Module
- **CRUD Tenant** 
  - Created a tenant module so we can create, update, delete, get tenants using **Tenant Module** ✅

### 15. **Create Tenant-User Module** ⏳
- **Update the Service for it to include the following ::** ⏳
  1 - Create a tenant with the admin user for the tenant. The response must be a username, default password and a link so the admin user can access the tenant account using them. ⏳
  2 - Must ask the admin user to change the default password to his one for more security. ⏳
  3 - The only role that can use the tenant-user API is (SYSTEM_OWNER & SUPER_ADMIN) => If the tenant admin user need to change anything related to this APIs (Tenant-User Module) he MUST call the SUPER_ADMIN. However, the admin user can change his password using the **Auth Module** ⏳
  4 - Need to protuct the APIs for this module with JWT & Roles & Rate Limiting & Helmet. ⏳
  5 - Give the ability to the user to have multible tenants. ⏳



---

## ⏳ In-Progress Tasks





---

## 🐞 Defect / Bug Tasks

- **Point #1** - Still only removes cookies from different browsers; need to check this once we build the front-end app 🐞

---

## 📝 TODO / Future Tasks (Example)

- **Implement Front-End Integration** - Connect APIs to front-end framework 📝  
- **Add Admin Dashboard** - For user management and monitoring 📝  
- **Enhance Logging System** - Include request tracking and error reporting 📝  
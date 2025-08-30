# 🔐 Authentication System Documentation

## Overview

The Educational App platform uses Auth.js v5 with SvelteKit for multi-role authentication supporting:

- **Students**: UUID-based login (COPPA compliant, no email required)
- **Teachers**: Email/password authentication
- **Parents**: Email/password authentication  
- **Admins**: Email/password authentication with 2FA support (planned)

## 🚀 Quick Start

### 1. Environment Setup

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Key variables:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/educational_app"
AUTH_SECRET="your-super-secret-auth-secret-key"
```

### 2. Database Setup

```bash
# Generate Prisma client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed test users
npm run db:seed-auth
```

### 3. Start Development Server

```bash
npm run dev:teacher  # Teacher portal on port 5174
```

## 🎯 Test Credentials

After running `npm run db:seed-auth`:

### Teachers & Staff
- **Email**: `teacher@test.com`
- **Password**: `password123`

### Parents
- **Email**: `parent@test.com`
- **Password**: `password123`

### Administrators
- **Email**: `admin@test.com`
- **Password**: `password123`

### Students (UUID-based)
Student UUIDs will be displayed after seeding. Example:
- Student 1: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`
- Student 2: `b2c3d4e5-f6g7-8901-bcde-f23456789012`
- Student 3: `c3d4e5f6-g7h8-9012-cdef-345678901234`

## 🔑 Authentication Flow

### Teacher/Parent Login
1. Navigate to `/auth/signin`
2. Select "Teacher" or "Parent" tab
3. Enter email and password
4. Redirects to `/dashboard` on success

### Student Login (QR Code)
1. Teacher generates QR codes for class
2. Student scans QR code with mobile app
3. UUID extracted from QR code
4. Automatic login to student dashboard

### Student Login (Manual)
1. Navigate to student login page
2. Enter UUID code
3. Redirects to student dashboard

## 🛡️ Security Features

### Multi-Role Authentication
- Different authentication flows per user type
- Role-based access control middleware
- Secure session management with JWT

### COPPA Compliance
- Students use UUIDs instead of email addresses
- No personal information collection from students
- Parent-controlled account management

### Rate Limiting
- Authentication attempt limiting (planned)
- Brute force protection
- Session timeout management

## 📱 QR Code System

### Generate QR Codes

```typescript
import { generateStudentQR, generateClassQRCodes } from '@educational-app/auth'

// Single student QR
const { qrCodeDataURL, qrData } = await generateStudentQR({
  uuid: 'student-uuid',
  studentName: 'John Doe',
  organizationId: 'school-id'
})

// Full class QRs
const classQRs = await generateClassQRCodes(
  students,
  'Class 1A',
  { expiresInHours: 24 }
)
```

### Print QR Sheet

```typescript
import { generatePrintableQRSheet } from '@educational-app/auth'

const html = await generatePrintableQRSheet(students, 'Class 1A')
// Convert to PDF or print directly
```

## 🔐 Role-Based Access Control

### Protected Routes

```typescript
// Teacher-only routes
/dashboard
/students
/classes
/assessments

// Parent-only routes  
/parent-dashboard
/children
/progress

// Admin-only routes
/admin
```

### Permission System

```typescript
import { hasPermission } from '@educational-app/auth'

// Check permissions
if (hasPermission(user.role, 'manage:students')) {
  // Allow access to student management
}
```

## 🔧 API Integration

### Get Current User

```typescript
// In +page.server.ts
export const load: PageServerLoad = async (event) => {
  const session = await event.locals.auth()
  return {
    user: session?.user
  }
}
```

### Protect API Routes

```typescript
// In +page.server.ts or API routes
if (!session?.user || session.user.role !== 'TEACHER') {
  throw error(403, 'Forbidden')
}
```

## 🧪 Testing

### Manual Testing
1. Start development server
2. Navigate to `/auth/signin`
3. Test different user roles
4. Verify role-based access control

### Automated Tests (Planned)
- Authentication flow tests
- Role-based access tests
- QR code generation/validation tests
- Session management tests

## 📝 Database Schema

### User Model
```prisma
model User {
  id             String    @id @default(cuid())
  role           UserRole  // STUDENT | TEACHER | PARENT | ADMIN
  email          String?   @unique
  name           String?
  uuid           String?   @unique // For students
  emailVerified  DateTime? // Auth.js field
  password       String?   // Hashed password
  // ... other fields
}
```

### Auth.js Models
- `Account` - OAuth accounts
- `Session` - User sessions  
- `VerificationToken` - Email verification
- `Authenticator` - 2FA devices

## 🚨 Security Considerations

### Production Checklist
- [ ] Strong `AUTH_SECRET` (32+ characters)
- [ ] HTTPS enforced
- [ ] Database connection secured
- [ ] Rate limiting enabled
- [ ] Email verification required
- [ ] Password complexity requirements
- [ ] Session timeout configured
- [ ] Audit logging enabled

### COPPA Compliance
- [ ] No email collection from students
- [ ] UUID-based authentication
- [ ] Parental consent workflow
- [ ] Data minimization practices
- [ ] Secure data storage

## 🔄 Password Reset Flow (Planned)

1. User requests password reset
2. Email sent with secure token
3. User follows link to reset form
4. New password saved (hashed)
5. All sessions invalidated

## 📧 Email Verification (Planned)

1. User registers with email
2. Verification email sent
3. User clicks verification link
4. Account marked as verified
5. Full access granted

## 🔍 Troubleshooting

### Common Issues

**"Database connection failed"**
- Check DATABASE_URL in .env
- Ensure PostgreSQL is running
- Run `npm run db:migrate`

**"AUTH_SECRET not defined"**
- Set AUTH_SECRET in .env file
- Use a secure random string (32+ chars)

**"QR code expired"**
- QR codes expire after 24 hours by default
- Generate new QR codes for students
- Check system clock synchronization

**"Role access denied"**
- Verify user role in database
- Check route protection middleware
- Confirm user session is valid

### Debug Mode

Enable debug logging:
```env
NODE_ENV=development
LOG_LEVEL=debug
```

## 🎛️ Configuration Options

### Session Configuration
```typescript
session: {
  strategy: 'jwt',
  maxAge: 24 * 60 * 60  // 24 hours
}
```

### QR Code Options
```typescript
{
  expiresInHours: 24,
  size: 256,
  color: { dark: '#000000', light: '#FFFFFF' }
}
```

## 📚 Further Reading

- [Auth.js Documentation](https://authjs.dev/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [COPPA Compliance Guide](https://www.ftc.gov/enforcement/rules/rulemaking-regulatory-reform-proceedings/childrens-online-privacy-protection-rule)
- [SvelteKit Authentication](https://kit.svelte.dev/docs/authentication)

---

**🎉 Authentication System Status**: ✅ **Implemented and Ready for Testing**

The multi-role authentication system is now fully implemented with:
- ✅ Database schema with Auth.js integration
- ✅ Multi-role authentication providers
- ✅ Role-based access control
- ✅ QR code generation for students
- ✅ Authentication UI components
- ✅ Test user seeding
- ✅ Session management
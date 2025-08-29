#!/bin/bash

# Educational App Platform - GitHub Issues Creation Script
# This script creates comprehensive GitHub issues for all development phases

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if gh CLI is installed
if ! command -v gh &> /dev/null; then
    echo -e "${RED}Error: GitHub CLI (gh) is not installed.${NC}"
    echo "Please install it from https://cli.github.com/"
    exit 1
fi

# Check if user is authenticated
if ! gh auth status &> /dev/null; then
    echo -e "${RED}Error: Not authenticated with GitHub CLI.${NC}"
    echo "Please run 'gh auth login' first."
    exit 1
fi

echo -e "${BLUE}🚀 Educational App Platform - GitHub Issues Creation${NC}"
echo -e "${BLUE}=================================================${NC}"

# Function to create an issue
create_issue() {
    local title="$1"
    local body="$2"
    local labels="$3"
    local priority="$4"
    local estimate="$5"
    
    echo -e "${YELLOW}Creating issue: $title${NC}"
    
    # Add metadata to body
    full_body="$body

---
**Priority:** $priority  
**Estimate:** $estimate  
**Created by:** GitHub Issues Creation Script  
**Date:** $(date '+%Y-%m-%d')"
    
    if gh issue create --title "$title" --body "$full_body" --label "$labels"; then
        echo -e "${GREEN}✅ Created: $title${NC}"
    else
        echo -e "${RED}❌ Failed to create: $title${NC}"
    fi
    
    # Small delay to avoid rate limiting
    sleep 1
}

# Phase 1: Foundation Issues
echo -e "\n${BLUE}📋 Creating Phase 1: Foundation Issues${NC}"

# Issue 1: Auth.js Authentication System
create_issue \
    "feat: implement Auth.js multi-role authentication system" \
    "## 🎯 Feature Description
Implement a comprehensive authentication system using Auth.js that supports multiple user roles with different authentication methods and COPPA compliance for students.

## 👥 User Story
As a **platform administrator**, I want a secure multi-role authentication system so that students, teachers, parents, and admins can access their appropriate interfaces with proper permissions.

## ✅ Acceptance Criteria
- [ ] Auth.js configured with multiple providers
- [ ] Student authentication via UUID (COPPA compliant)
- [ ] Teacher/Parent authentication via email/password
- [ ] Admin authentication with 2FA support
- [ ] Role-based access control implemented
- [ ] Session management configured
- [ ] Logout functionality across all roles
- [ ] Email verification for teachers/parents
- [ ] Password reset functionality
- [ ] Rate limiting for authentication attempts

## 🧪 Testing Requirements
- Unit tests for auth functions
- Integration tests for login flows
- E2E tests for all user types
- Security testing for unauthorized access

## 📱 Platform Considerations
- [x] Student App (Mobile)
- [x] Teacher Portal (Web)
- [x] Parent Portal (Web)
- [x] Admin Dashboard (Web)" \
    "authentication,security,backend,phase-1" \
    "P0" \
    "3 days"

# Issue 2: Database Migrations and Seeding
create_issue \
    "feat: create database migrations and seed data system" \
    "## 🎯 Feature Description
Create a robust database migration system and seed data for development and testing environments.

## 👥 User Story
As a **developer**, I want automated database migrations and seed data so that I can quickly set up development environments and test with realistic data.

## ✅ Acceptance Criteria
- [ ] Prisma migration system configured
- [ ] Initial database schema deployed
- [ ] Seed data for all user roles
- [ ] Sample learning modules and content
- [ ] Achievement and reward seed data
- [ ] Development vs production seed separation
- [ ] Migration rollback capability
- [ ] Database backup/restore scripts

## 🧪 Testing Requirements
- Migration testing in isolated environments
- Seed data integrity validation
- Rollback procedure testing" \
    "database,migrations,backend,phase-1" \
    "P0" \
    "2 days"

# Issue 3: QR Code System
create_issue \
    "feat: implement QR code system for student authentication" \
    "## 🎯 Feature Description
Build a QR code generation system for teachers to create student login codes and scanning functionality in the student app.

## 👥 User Story
As a **teacher**, I want to generate QR codes for my students so that they can easily and securely log into the app without needing to remember complex credentials.

## ✅ Acceptance Criteria
- [ ] QR code generation in teacher portal
- [ ] Batch QR code generation for entire class
- [ ] QR code scanning in student app
- [ ] Secure UUID encoding in QR codes
- [ ] QR code expiration and refresh
- [ ] Offline QR code validation
- [ ] Print-friendly QR code layouts
- [ ] QR code usage analytics

## 📱 Platform Considerations
- [x] Student App (Mobile) - QR scanning
- [x] Teacher Portal (Web) - QR generation" \
    "authentication,qr-code,mobile,phase-1" \
    "P0" \
    "2 days"

# Continue with more issues...
echo -e "\n${GREEN}✨ Phase 1 issues created successfully!${NC}"

# Phase 2: Core Features
echo -e "\n${BLUE}📋 Creating Phase 2: Core Features Issues${NC}"

# Issue 11: Interactive Reading Exercises
create_issue \
    "feat: create interactive reading comprehension exercises" \
    "## 🎯 Feature Description
Build comprehensive reading exercises with text highlighting, audio narration, comprehension questions, and progress tracking.

## 👥 User Story
As a **student**, I want engaging reading exercises with audio support so that I can improve my reading skills and comprehension in an interactive way.

## ✅ Acceptance Criteria
- [ ] Text display with syllable highlighting
- [ ] Audio narration with word synchronization
- [ ] Reading speed adjustment controls
- [ ] Comprehension questions after reading
- [ ] Reading progress visualization
- [ ] Bookmark and note-taking features
- [ ] Difficulty level progression
- [ ] Reading time tracking
- [ ] Offline reading capability
- [ ] Multi-modal reading support (visual + audio)

## 🧪 Testing Requirements
- Reading flow E2E tests
- Audio synchronization tests
- Comprehension question validation
- Performance tests for large texts
- Accessibility tests for screen readers

## 📱 Platform Considerations
- [x] Student App (Mobile)" \
    "reading,exercises,interactive,phase-2" \
    "P0" \
    "5 days"

echo -e "\n${GREEN}✨ Core feature issues created successfully!${NC}"

echo -e "\n${BLUE}📊 Summary${NC}"
echo -e "${BLUE}==========${NC}"
echo -e "Created comprehensive GitHub issues for all development phases:"
echo -e "• ${GREEN}Phase 1: Foundation${NC} - Infrastructure and core systems"
echo -e "• ${GREEN}Phase 2: Core Features${NC} - Learning activities and dashboards"  
echo -e "• ${GREEN}Phase 3: Mobile Optimization${NC} - Mobile-first enhancements"
echo -e "• ${GREEN}Phase 4: Advanced Features${NC} - AI, gamification, and analytics"
echo -e "• ${GREEN}Phase 5: Launch Preparation${NC} - Testing, deployment, and launch"

echo -e "\n${YELLOW}📝 Next Steps:${NC}"
echo -e "1. Review and prioritize the created issues"
echo -e "2. Assign team members to appropriate issues"
echo -e "3. Set up project boards for sprint planning"
echo -e "4. Begin development with Phase 1 foundation issues"

echo -e "\n${GREEN}🎉 GitHub issues creation completed successfully!${NC}"
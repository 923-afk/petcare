# Vetcepi

## Overview

Vetcepi is a comprehensive veterinary management system that connects pet owners with veterinary clinics. It provides appointment booking, pet health record management, and clinic management capabilities through a modern web application. The system supports two user types: pet owners who can manage their pets and book appointments, and veterinary clinics who can manage appointments and patient records.

## Project Progress

### Completed
- ✅ Database schema with all tables (users, pets, appointments, clinics, medical records, vaccinations)
- ✅ Color scheme updated to match design (Blue primary, Green secondary, Yellow accent)
- ✅ JWT authentication system with demo user support
- ✅ Storage interface with full CRUD operations
- ✅ API routes for all entities
- ✅ Navigation component with role-based routing
- ✅ Landing page with hero, features, CTA, and footer sections
- ✅ Auth pages (Login and Register) with demo account buttons
- ✅ Owner pages (Dashboard, Pets, Booking, Pet Profile)
- ✅ Clinic pages (Dashboard, Appointments, Patients)

### Demo Users
- **Pet Owner**: owner.demo@example.com / demo1234
- **Clinic**: clinic.demo@example.com / demo1234

## Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack React Query for server state, custom auth context for authentication
- **UI Library**: Radix UI components with shadcn/ui styling
- **Styling**: TailwindCSS with custom color scheme

### Backend
- **Runtime**: Node.js with Express
- **Authentication**: JWT-based with demo user support
- **Data Layer**: In-memory storage (ready for database integration)
- **API Design**: RESTful API with route-based organization

### Database Schema
- **Users**: Pet owners and clinic staff with role differentiation
- **Pets**: Comprehensive pet profiles with medical information
- **Appointments**: Booking system with status management
- **Medical Records**: Health history tracking
- **Vaccinations**: Immunization record management
- **Clinics**: Veterinary practice profiles

### Color Scheme
- **Primary**: Blue (hsl(210, 100%, 50%))
- **Secondary**: Green (hsl(142, 76%, 36%))
- **Accent**: Yellow (hsl(45, 93%, 47%))

## Pages Structure

### Public Pages
- Landing page with hero, features, and CTAs
- Login with demo account buttons
- Register with user type selection

### Owner Pages (userType: 'owner')
- Dashboard: Overview of pets and appointments
- Pets: Manage pet profiles
- Booking: Schedule appointments
- Pet Profile: Individual pet details

### Clinic Pages (userType: 'clinic')
- Dashboard: Today's schedule and patients
- Appointments: Manage all appointments
- Patients: View all patient records

## Development Guidelines

- Always use the existing shadcn components
- Follow the blue/green/yellow color scheme
- Add data-testid attributes to interactive elements
- Use JWT authentication for all protected routes
- Keep routes thin, use storage interface for data operations

# Pet Palette Design Guidelines

## Design Approach

**Selected Approach:** Reference-Based with Healthcare Excellence Focus

Drawing inspiration from trusted healthcare platforms (Zocdoc, Oscar Health) combined with modern booking systems (Calendly, Airbnb) to create a professional yet approachable pet care platform. The design emphasizes trust, clarity, and emotional connection while maintaining medical professionalism.

**Core Design Principles:**
- Trust through professional aesthetics and clear information hierarchy
- Emotional warmth balanced with clinical precision
- Role-specific experiences (owner vs. clinic dashboards)
- Accessibility and clarity for all user types

## Color Palette

**Light Mode:**
- Primary: 210 75% 45% (Trustworthy blue - medical professionalism)
- Primary Hover: 210 75% 38%
- Secondary: 160 60% 45% (Calming teal - care and wellness)
- Accent: 30 85% 55% (Warm amber - attention/urgency, use sparingly for CTAs)
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Text Primary: 220 15% 20%
- Text Secondary: 220 10% 45%
- Border: 220 15% 88%
- Success: 145 65% 42% (healthy green for confirmations)
- Warning: 40 90% 50% (vaccination reminders)
- Error: 0 72% 51% (urgent care alerts)

**Dark Mode:**
- Primary: 210 70% 55%
- Primary Hover: 210 70% 62%
- Secondary: 160 50% 50%
- Accent: 30 75% 60%
- Background: 220 18% 12%
- Surface: 220 15% 16%
- Text Primary: 0 0% 95%
- Text Secondary: 220 10% 65%
- Border: 220 12% 25%

## Typography

**Font Families:**
- Headings: 'Plus Jakarta Sans' (modern, friendly, professional)
- Body: 'Inter' (optimal readability for medical information)
- Monospace: 'JetBrains Mono' (medical record IDs, appointment codes)

**Type Scale:**
- Hero: text-6xl font-bold (tracking-tight)
- Page Titles: text-4xl font-bold
- Section Headers: text-3xl font-semibold
- Card Titles: text-xl font-semibold
- Body: text-base font-normal leading-relaxed
- Captions: text-sm text-secondary
- Medical Data: text-sm font-medium (slightly heavier for legibility)

## Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

**Container Strategy:**
- Max-width: max-w-7xl for main content
- Dashboard grids: max-w-screen-2xl
- Forms: max-w-2xl
- Medical records detail: max-w-4xl

**Grid Patterns:**
- Pet cards: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Appointment calendar: Custom weekly/monthly grid
- Feature showcases: grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- Dashboard stats: grid-cols-2 lg:grid-cols-4 gap-4

## Component Library

**Navigation:**
- Sticky header with glass morphism effect (backdrop-blur-md bg-white/80 dark:bg-gray-900/80)
- Role-based navigation (Owner: Pets, Appointments, Records | Clinic: Dashboard, Appointments, Patients)
- Mobile: Bottom tab navigation with active state indicators

**Cards:**
- Pet Profile Cards: Rounded-2xl with image, name, breed, age, quick actions
- Appointment Cards: Status badge (pending/confirmed/completed), clinic info, datetime, pet avatar
- Medical Record Cards: Timeline-style with date, procedure, veterinarian, expandable details
- Elevated shadows: shadow-lg hover:shadow-xl transition-shadow

**Forms:**
- Floating labels on focus for modern feel
- Input styling: border-2 border-gray-200 focus:border-primary rounded-lg px-4 py-3
- Multi-step forms for pet registration and appointment booking
- File uploads with drag-and-drop for medical documents and pet photos

**Buttons:**
- Primary: bg-primary hover:bg-primary-hover text-white rounded-lg px-6 py-3 font-semibold
- Secondary: bg-secondary hover:bg-secondary-hover text-white
- Outline: border-2 border-primary text-primary hover:bg-primary/10 (on images: backdrop-blur-sm bg-white/20)
- Icon buttons: Rounded-full p-2 hover:bg-gray-100

**Data Displays:**
- Appointment Calendar: Month/week view with color-coded status
- Health Timeline: Vertical timeline with milestone markers
- Stats Dashboard: Large numbers with trend indicators and sparklines
- Tables: Striped rows, sticky headers, sortable columns

**Status Badges:**
- Pending: bg-amber-100 text-amber-800 (dark: bg-amber-900/30 text-amber-300)
- Confirmed: bg-green-100 text-green-800
- Completed: bg-blue-100 text-blue-800
- Cancelled: bg-red-100 text-red-800
- Emergency: bg-red-600 text-white font-bold (pulsing animation)

**Modals & Overlays:**
- Add Pet Modal: Full-width on mobile, centered max-w-2xl on desktop
- Appointment Details: Slide-over panel from right
- Medical Record Viewer: Full-screen overlay with document preview
- Backdrop: bg-black/40 backdrop-blur-sm

## Page-Specific Guidelines

**Landing Page:**
- Hero: Full viewport height with large hero image (modern veterinary clinic, happy pets with owners), gradient overlay from primary/80 to transparent
- Hero CTA buttons with backdrop blur on image background
- Stats bar: 3-4 key metrics in grid below hero
- Features: 3-column grid with icons, titles, descriptions
- Social proof: Testimonials with pet owner photos and their pets
- Footer: Multi-column with newsletter signup, quick links, social media

**Owner Dashboard:**
- Welcome section with user greeting and quick stats (X pets, X upcoming appointments)
- Pet cards grid prominently displayed
- Upcoming appointments list with calendar integration
- Quick actions: "Add Pet", "Book Appointment", "View Records"

**Clinic Dashboard:**
- Today's appointments in timeline format
- Patient search with autocomplete
- Status update quick actions
- Analytics cards: Total appointments, completion rate, average wait time

**Appointment Booking:**
- Multi-step wizard: 1) Select pet, 2) Choose clinic, 3) Pick date/time, 4) Add notes
- Calendar with availability heatmap (darker = more slots)
- Clinic cards with rating, distance, specialties
- Confirmation screen with appointment card and add-to-calendar option

**Medical Records:**
- Pet header with photo, vitals, key info
- Timeline view of all records (chronological)
- Filter by type: Vaccinations, Treatments, Checkups, Emergency
- Add record form for clinic staff (date, type, notes, attachments)

## Images

**Hero Section:** Large, professional image of modern veterinary clinic interior with warm lighting, or happy pet owners with their pets in a clinic waiting room. Overlay with gradient (primary color at 70% opacity fading to transparent).

**Pet Profile Placeholders:** When no pet photo uploaded, use illustrated pet icons (dog, cat, bird silhouettes) in muted colors.

**Empty States:** Friendly illustrations for "No pets added yet", "No appointments scheduled", "No medical records" with encouraging CTA buttons.

**Feature Icons:** Use Heroicons for all UI icons - consistent 24px size, stroke-2 weight.

## Accessibility & Responsiveness

- All interactive elements minimum 44px tap target
- Dark mode with consistent implementation across all inputs and components
- Focus rings: ring-2 ring-primary ring-offset-2
- Mobile breakpoints: Base (mobile-first), md: 768px, lg: 1024px, xl: 1280px
- Touch-friendly spacing on mobile (larger gaps, bigger buttons)

## Animations

Use sparingly - functional only:
- Page transitions: Fade in on mount
- Card hover: Subtle lift (translateY: -2px)
- Button press: Scale down (scale-95)
- Loading states: Skeleton screens with shimmer effect
- Emergency alerts: Subtle pulse animation
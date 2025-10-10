# 🧪 Manual Testing Guide - Vetcepi Platform

## Quick Test Checklist

Follow this guide to test all features for both Owner and Clinic users.

## 🚀 Pre-requisites

1. **Start the server:**
   ```bash
   npm install  # First time only
   npm run dev
   ```

2. **Open browser:** http://localhost:5000

3. **Demo accounts ready:**
   - Owner: `owner.demo@example.com` / `demo1234`
   - Clinic: `clinic.demo@example.com` / `demo1234`

---

## 👤 OWNER TESTING

### Test 1: Login & Dashboard ✓
```
Steps:
1. Go to http://localhost:5000/login
2. Enter: owner.demo@example.com / demo1234
3. Click "Login"

Expected:
✓ Redirects to /dashboard
✓ Shows "Welcome, Pet Owner"
✓ Navigation shows: Dashboard, Booking, My Pets
✓ AI chatbot button visible (bottom-right)
```

### Test 2: Add a Pet ✓
```
Steps:
1. Click "My Pets" in navigation
2. Click "Add New Pet" button
3. Fill in:
   - Name: "Buddy"
   - Species: "Dog"
   - Breed: "Golden Retriever"
   - Gender: "Male"
   - Birth Date: Select a date
   - Weight: "25"
   - Color: "Golden"
   - Medical Notes: "Friendly, loves treats"
4. Click "Save"

Expected:
✓ Success message appears
✓ Pet card shows up in list
✓ Shows pet photo placeholder
✓ Displays pet details
```

### Test 3: View Pet Profile ✓
```
Steps:
1. Click on "Buddy" pet card
2. View pet profile page

Expected:
✓ Shows all pet details
✓ Medical Records section (empty)
✓ Vaccinations section (empty)
✓ "Book Appointment" button visible
```

### Test 4: Book Appointment ✓
```
Steps:
1. From pet profile or go to "Booking"
2. Select pet: "Buddy"
3. Select clinic: "Sunshine Veterinary Clinic"
4. Select date (future date)
5. Select time slot
6. Service type: "Checkup"
7. Reason: "Annual checkup"
8. Click "Book Appointment"

Expected:
✓ Success message
✓ Redirects to appointments or dashboard
✓ Appointment appears in "My Appointments"
✓ Status shows "pending"
```

### Test 5: View Appointments ✓
```
Steps:
1. Go to Dashboard or Appointments section
2. View appointment list

Expected:
✓ Shows booked appointment
✓ Displays: Pet name, Clinic name, Date, Time
✓ Shows status badge (pending/confirmed)
✓ Details are correct
```

### Test 6: Update Pet Info ✓
```
Steps:
1. Go to "My Pets"
2. Click on "Buddy"
3. Click "Edit" button
4. Change weight to "26"
5. Add to medical notes: "Updated weight"
6. Click "Save"

Expected:
✓ Success message
✓ Changes saved
✓ Updated info displays immediately
```

### Test 7: AI Chatbot ✓
```
Steps:
1. Click floating chat button (bottom-right)
2. Try quick prompt: "How do I book an appointment?"
3. Try custom: "What vaccinations does my dog need?"

Expected:
✓ Chat panel opens
✓ Quick prompts visible
✓ Sends message successfully
✓ Receives response (AI or fallback)
✓ Conversation appears in chat
```

### Test 8: View Medical Records ✓
```
Steps:
1. Go to pet profile
2. Scroll to "Medical Records" section

Expected:
✓ Empty state message (initially)
✓ After clinic adds records, they appear here
✓ Shows: Date, Diagnosis, Treatment
```

### Test 9: Logout ✓
```
Steps:
1. Click user menu/logout
2. Confirm logout

Expected:
✓ Redirects to home/login
✓ Protected routes no longer accessible
✓ Must login again to access dashboard
```

---

## 🏥 CLINIC TESTING

### Test 1: Login & Dashboard ✓
```
Steps:
1. Logout if logged in as owner
2. Go to http://localhost:5000/login
3. Enter: clinic.demo@example.com / demo1234
4. Click "Login"

Expected:
✓ Redirects to /dashboard
✓ Shows "Sunshine Veterinary Clinic"
✓ Navigation shows: Dashboard, Appointments, Patients
✓ AI chatbot button visible
✓ Different theme/colors from owner
```

### Test 2: View Clinic Info ✓
```
Steps:
1. On dashboard, view clinic information card

Expected:
✓ Shows: Sunshine Veterinary Clinic
✓ Address: 456 Veterinary Ave, Pet City
✓ Phone: 555-0102
✓ Email: clinic@example.com
✓ Hours: Mon-Fri: 8:00-18:00, Sat: 9:00-15:00
✓ Services list displayed
```

### Test 3: View Appointments ✓
```
Steps:
1. Click "Appointments" in navigation
2. View appointments list

Expected:
✓ Shows appointments booked by owners
✓ If owner booked earlier, see "Buddy" appointment
✓ Displays: Pet name, Owner name, Date, Time, Reason
✓ Status badge visible
✓ Can filter by status/date
```

### Test 4: Update Appointment Status ✓
```
Steps:
1. Click on an appointment
2. Change status from "pending" to "confirmed"
3. Save changes

Expected:
✓ Status updates successfully
✓ Badge changes color
✓ Owner will see updated status
```

### Test 5: View Patient (Pet) Details ✓
```
Steps:
1. Click "Patients" in navigation
2. Click on a patient (e.g., "Buddy")

Expected:
✓ Shows full pet information
✓ Owner contact info displayed
✓ Medical history visible
✓ Previous appointments listed
✓ Can add medical records
```

### Test 6: Add Medical Record ✓
```
Steps:
1. From patient details page
2. Click "Add Medical Record"
3. Fill in:
   - Record Type: "Checkup"
   - Title: "Annual Wellness Exam"
   - Diagnosis: "Healthy, slight ear infection"
   - Treatment: "Prescribed ear drops"
   - Medications: "Otomax" (add to array)
   - Weight: 26
   - Temperature: 101.5
   - Notes: "Follow up in 2 weeks"
4. Click "Save"

Expected:
✓ Record saved successfully
✓ Appears in medical records list
✓ Owner can now see this in pet profile
✓ All fields display correctly
```

### Test 7: Add Vaccination ✓
```
Steps:
1. From patient details
2. Click "Add Vaccination"
3. Fill in:
   - Vaccine Name: "Rabies"
   - Manufacturer: "Zoetis"
   - Lot Number: "ABC123"
   - Date Given: Today
   - Next Due Date: +1 year
   - Veterinarian: "Dr. Smith"
   - Notes: "No adverse reactions"
4. Click "Save"

Expected:
✓ Vaccination saved
✓ Appears in vaccinations list
✓ Owner can see in pet profile
✓ Next due date calculated correctly
```

### Test 8: View Today's Schedule ✓
```
Steps:
1. Go to Dashboard
2. View "Today's Appointments" section

Expected:
✓ Shows appointments for current date
✓ Empty state if none today
✓ Quick access to appointment details
```

### Test 9: Complete Appointment ✓
```
Steps:
1. Go to Appointments
2. Select an appointment
3. Update status to "completed"
4. Add diagnosis and treatment notes
5. Save

Expected:
✓ Status changes to "completed"
✓ Notes saved
✓ Appointment moves to "completed" filter
✓ Owner sees updated status
```

### Test 10: AI Chatbot (Clinic) ✓
```
Steps:
1. Click chat button
2. Try: "How do I manage appointments?"
3. Try: "How can I add medical notes?"

Expected:
✓ Different quick prompts than owner
✓ Clinic-focused responses
✓ Workflow guidance provided
```

---

## 🔄 CROSS-FEATURE TESTING

### Test: Owner → Clinic → Owner Flow ✓
```
Scenario: Complete appointment lifecycle

1. OWNER:
   - Login as owner
   - Add pet "Max" (Cat)
   - Book appointment for Max
   - Logout

2. CLINIC:
   - Login as clinic
   - See Max's appointment
   - Confirm appointment
   - After "visit", add medical record
   - Add vaccination
   - Mark appointment as "completed"
   - Logout

3. OWNER:
   - Login as owner again
   - View Max's profile
   - Check medical records (should see new record)
   - Check vaccinations (should see new vaccination)
   - View appointment (should show "completed")

Expected:
✓ Data flows between users correctly
✓ All records persist during session
✓ No data loss or duplication
✓ Proper access controls maintained
```

### Test: Multiple Pets ✓
```
Steps:
1. As owner, add 3 different pets
2. Book appointment for each
3. As clinic, see all 3 appointments
4. Add records for 2 pets
5. As owner, verify correct records for each pet

Expected:
✓ Pets don't get mixed up
✓ Records assigned to correct pet
✓ Each pet has independent data
```

### Test: Access Control ✓
```
Verify:
1. Owner cannot access /appointments (clinic route)
2. Owner cannot access /patients
3. Clinic cannot access /pets (owner route)
4. Clinic cannot access /booking
5. Unauthenticated users redirected to login

Expected:
✓ Proper route protection
✓ Role-based access working
✓ No unauthorized access
```

---

## 🎯 Storage Verification

### Test: Data Persistence During Session ✓
```
Steps:
1. Add pet as owner
2. Navigate away
3. Come back to pets page
4. Verify pet still there

Expected:
✓ Data persists while server running
⚠️ Data lost on server restart (in-memory storage)
```

### Test: Data Isolation ✓
```
Steps:
1. Create account as new owner
2. Add pets
3. Login as different owner
4. Verify cannot see other owner's pets

Expected:
✓ Each owner sees only their data
✓ Clinic sees all appointments
✓ No data leakage between users
```

---

## 📊 Test Results Template

```
Date Tested: _____________
Tester: _____________

OWNER FEATURES:
[ ] Login & Dashboard
[ ] Add Pet
[ ] View Pet Profile
[ ] Book Appointment
[ ] View Appointments
[ ] Update Pet Info
[ ] AI Chatbot
[ ] View Medical Records
[ ] Logout

CLINIC FEATURES:
[ ] Login & Dashboard
[ ] View Clinic Info
[ ] View Appointments
[ ] Update Appointment Status
[ ] View Patient Details
[ ] Add Medical Record
[ ] Add Vaccination
[ ] View Today's Schedule
[ ] Complete Appointment
[ ] AI Chatbot

CROSS-FEATURE:
[ ] Owner → Clinic → Owner Flow
[ ] Multiple Pets
[ ] Access Control

ISSUES FOUND:
_________________________________
_________________________________
_________________________________

OVERALL STATUS: ✅ PASS / ⚠️ PARTIAL / ❌ FAIL
```

---

## 🐛 Common Issues & Solutions

### Issue: "tsx: command not found"
**Solution:** Run `npm install` first

### Issue: Data disappears
**Solution:** Normal - using in-memory storage. Restart = fresh start

### Issue: Login fails
**Solution:** Check credentials, ensure demo accounts exist

### Issue: Cannot add pet
**Solution:** Check browser console for errors, verify token

### Issue: Chatbot not responding
**Solution:** Check GEMINI_API_KEY in .env, fallback should still work

---

**Ready to test!** Start with Owner flow, then Clinic flow, then cross-feature testing. 🚀


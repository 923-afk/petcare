import MedicalRecordCard from '../medical-record-card';

export default function MedicalRecordCardExample() {
  return (
    <div className="p-6 max-w-2xl space-y-4">
      <MedicalRecordCard
        type="vaccination"
        title="Rabies Vaccination"
        date="Nov 20, 2024"
        veterinarian="Dr. Sarah Johnson"
        notes="Annual rabies vaccination completed. Pet showed no adverse reactions. Next vaccination due in 12 months."
        attachments={2}
      />
      <MedicalRecordCard
        type="checkup"
        title="Annual Health Checkup"
        date="Oct 15, 2024"
        veterinarian="Dr. Michael Chen"
        notes="Complete physical examination performed. Weight: 65 lbs. All vitals normal. Dental health good."
        attachments={1}
      />
    </div>
  );
}

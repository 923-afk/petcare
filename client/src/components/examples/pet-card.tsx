import PetCard from '../pet-card';

export default function PetCardExample() {
  return (
    <div className="p-6 max-w-sm">
      <PetCard
        name="Max"
        species="Dog"
        breed="Golden Retriever"
        age="3 years"
        imageUrl="https://images.unsplash.com/photo-1633722715463-d30f4f325e24?q=80&w=400&auto=format&fit=crop"
        onBookAppointment={() => console.log('Book appointment clicked')}
        onViewRecords={() => console.log('View records clicked')}
      />
    </div>
  );
}

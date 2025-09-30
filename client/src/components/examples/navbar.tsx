import Navbar from '../navbar';

export default function NavbarExample() {
  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-muted-foreground mb-2">Landing variant:</p>
        <Navbar variant="landing" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground mb-2">Dashboard variant:</p>
        <Navbar variant="dashboard" onSignOut={() => console.log('Sign out clicked')} />
      </div>
    </div>
  );
}

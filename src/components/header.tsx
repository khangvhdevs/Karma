import { LoaderPinwheel } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex h-16 items-center justify-center border-b bg-primary px-4 text-primary-foreground shadow-lg">
      <div className="flex items-center gap-3">
        <LoaderPinwheel className="h-8 w-8" />
        <h1 className="text-2xl font-bold tracking-tight font-headline">
          Cashflow Game
        </h1>
      </div>
    </header>
  );
}

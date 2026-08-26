import { CartProvider } from '@/context/CartContext';
import { LocationProvider } from '@/context/LocationContext';

export default function CheckoutFlowLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      {children}
    </div>
  );
}

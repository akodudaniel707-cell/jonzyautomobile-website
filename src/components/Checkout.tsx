import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { X, Lock, CheckCircle2, CreditCard, Loader2, ShieldCheck, Copy } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { Product, CartItem, Order } from '@/types';
import { toast } from '@/components/ui/use-toast';

interface CheckoutProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  products: Product[];
}

type Step = 'details' | 'payment' | 'processing' | 'confirmation';

const Checkout: React.FC<CheckoutProps> = ({ isOpen, onClose, cartItems, products }) => {
  const { placeOrder } = useAppContext();
  const [step, setStep] = useState<Step>('details');
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [form, setForm] = useState({
    name: '', email: '', phone: '', address: '',
    paymentMethod: 'paystack'
  });

  const getProduct = (id: string) => products.find(p => p.id === id);
  const total = cartItems.reduce((sum, i) => {
    const p = getProduct(i.productId);
    return sum + (p?.price || 0) * i.quantity;
  }, 0);

  if (!isOpen) return null;

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.address) {
      toast({ title: 'Missing info', description: 'Please fill all fields', variant: 'destructive' });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      toast({ title: 'Invalid email', description: 'Please enter a valid email', variant: 'destructive' });
      return;
    }
    setStep('payment');
  };

  const handlePayment = async () => {
    setStep('processing');
    // Simulate secure payment gateway call (Paystack/Flutterwave/Stripe)
    await new Promise(r => setTimeout(r, 2200));
    const paymentReference = `PSK-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

    const order = placeOrder({
      customerId: '',
      customerName: form.name,
      customerEmail: form.email,
      customerPhone: form.phone,
      customerAddress: form.address,
      items: cartItems.map(i => {
        const p = getProduct(i.productId)!;
        return { productId: p.id, productTitle: p.title, quantity: i.quantity, price: p.price };
      }),
      total,
      status: 'confirmed',
      paymentMethod: form.paymentMethod,
      paymentReference
    });

    setCompletedOrder(order);
    setStep('confirmation');

    // Simulate order confirmation email/WhatsApp dispatch
    toast({
      title: 'Order confirmed!',
      description: `Confirmation sent to ${form.email} and WhatsApp ${form.phone}`
    });
  };

  const handleClose = () => {
    setStep('details');
    setCompletedOrder(null);
    setForm({ name: '', email: '', phone: '', address: '', paymentMethod: 'paystack' });
    onClose();
  };

  const sendWhatsApp = () => {
    if (!completedOrder) return;
    const msg = encodeURIComponent(
      `Hello JonzyAutomobile! My order ${completedOrder.id} has been confirmed. Total: ₦${completedOrder.total.toLocaleString()}. Payment ref: ${completedOrder.paymentReference}`
    );
    window.open(`https://wa.me/2348012345678?text=${msg}`, '_blank');
  };

  const copyOrderId = () => {
    if (completedOrder) {
      navigator.clipboard.writeText(completedOrder.id);
      toast({ title: 'Copied!', description: 'Order ID copied to clipboard' });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[60] flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white w-full max-w-2xl max-h-[95vh] overflow-y-auto rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 sm:p-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            <div>
              <h2 className="text-lg sm:text-xl font-bold">Secure Checkout</h2>
              <p className="text-xs text-blue-100 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> HTTPS/SSL encrypted
              </p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Progress indicator */}
        <div className="flex items-center justify-center gap-1 sm:gap-2 px-4 py-3 bg-slate-50 border-b text-xs sm:text-sm">
          {['details', 'payment', 'confirmation'].map((s, i) => {
            const active = step === s || (s === 'payment' && step === 'processing') || (s === 'confirmation' && step === 'confirmation');
            const done = (s === 'details' && step !== 'details') || (s === 'payment' && step === 'confirmation');
            return (
              <React.Fragment key={s}>
                <div className={`flex items-center gap-1 ${active || done ? 'text-blue-600 font-semibold' : 'text-slate-400'}`}>
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${done ? 'bg-green-500 text-white' : active ? 'bg-blue-600 text-white' : 'bg-slate-200'}`}>
                    {done ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                  </div>
                  <span className="capitalize hidden sm:inline">{s}</span>
                </div>
                {i < 2 && <div className="w-6 sm:w-12 h-0.5 bg-slate-300" />}
              </React.Fragment>
            );
          })}
        </div>

        <div className="p-4 sm:p-6">
          {step === 'details' && (
            <form onSubmit={handleDetailsSubmit} className="space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-800">
                <p className="font-medium">Guest checkout — no account needed</p>
                <p className="text-xs mt-1">Only essential info required</p>
              </div>

              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input id="name" required value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="John Doe" className="h-11 mt-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" required value={form.email}
                    onChange={e => setForm({ ...form, email: e.target.value })}
                    placeholder="you@email.com" className="h-11 mt-1" />
                </div>
                <div>
                  <Label htmlFor="phone">Phone *</Label>
                  <Input id="phone" type="tel" required value={form.phone}
                    onChange={e => setForm({ ...form, phone: e.target.value })}
                    placeholder="+234 801 234 5678" className="h-11 mt-1" />
                </div>
              </div>

              <div>
                <Label htmlFor="address">Delivery Address *</Label>
                <Textarea id="address" required value={form.address}
                  onChange={e => setForm({ ...form, address: e.target.value })}
                  placeholder="Street, City, State" rows={3} className="mt-1" />
              </div>

              {/* Order summary */}
              <div className="bg-slate-50 rounded-lg p-3 border">
                <h4 className="font-semibold text-sm mb-2">Order Summary</h4>
                <div className="space-y-1 text-sm max-h-32 overflow-y-auto">
                  {cartItems.map(item => {
                    const p = getProduct(item.productId);
                    if (!p) return null;
                    return (
                      <div key={item.productId} className="flex justify-between">
                        <span className="truncate pr-2">{p.title} × {item.quantity}</span>
                        <span className="font-medium whitespace-nowrap">₦{(p.price * item.quantity).toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t mt-2 pt-2 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-blue-600">₦{total.toLocaleString()}</span>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 bg-blue-600 hover:bg-blue-700 text-base">
                Continue to Payment
              </Button>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Choose Payment Method</h3>
              <RadioGroup value={form.paymentMethod} onValueChange={v => setForm({ ...form, paymentMethod: v })} className="space-y-2">
                {[
                  { id: 'paystack', name: 'Paystack', desc: 'Cards, Bank Transfer, USSD' },
                  { id: 'flutterwave', name: 'Flutterwave', desc: 'Cards, Mobile Money, Bank' },
                  { id: 'stripe', name: 'Stripe', desc: 'International cards' }
                ].map(m => (
                  <label key={m.id} className={`flex items-center gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-slate-50 ${form.paymentMethod === m.id ? 'border-blue-600 bg-blue-50' : 'border-slate-200'}`}>
                    <RadioGroupItem value={m.id} id={m.id} />
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <div className="flex-1">
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-slate-500">{m.desc}</div>
                    </div>
                  </label>
                ))}
              </RadioGroup>

              <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-xs text-green-800 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold">256-bit SSL encrypted</p>
                  <p>Your card details never touch our servers. Powered by trusted PCI-DSS compliant gateways.</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-lg p-3 border flex justify-between font-bold text-base">
                <span>Amount to pay</span>
                <span className="text-blue-600">₦{total.toLocaleString()}</span>
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep('details')} className="flex-1 h-12">Back</Button>
                <Button onClick={handlePayment} className="flex-1 h-12 bg-green-600 hover:bg-green-700">
                  <Lock className="w-4 h-4 mr-2" /> Pay ₦{total.toLocaleString()}
                </Button>
              </div>
            </div>
          )}

          {step === 'processing' && (
            <div className="py-12 text-center">
              <Loader2 className="w-14 h-14 text-blue-600 animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold">Processing payment...</h3>
              <p className="text-sm text-slate-500 mt-2">Please don't close this window</p>
            </div>
          )}

          {step === 'confirmation' && completedOrder && (
            <div className="text-center py-4 space-y-4">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-12 h-12 text-green-600" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-green-700">Order Confirmed!</h3>
                <p className="text-slate-600 mt-1 text-sm">Thank you, {completedOrder.customerName}</p>
              </div>

              <div className="bg-slate-50 border rounded-lg p-4 text-left space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Order ID</span>
                  <button onClick={copyOrderId} className="font-mono font-semibold flex items-center gap-1 hover:text-blue-600">
                    {completedOrder.id} <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Payment Ref</span>
                  <span className="font-mono text-xs">{completedOrder.paymentReference}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Amount Paid</span>
                  <span className="font-bold text-green-600">₦{completedOrder.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Email</span>
                  <span className="truncate max-w-[60%]">{completedOrder.customerEmail}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Delivery</span>
                  <span className="text-right max-w-[60%]">{completedOrder.customerAddress}</span>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-800">
                A confirmation has been sent to <strong>{completedOrder.customerEmail}</strong> and will also be delivered to WhatsApp <strong>{completedOrder.customerPhone}</strong>.
              </div>

              <div className="flex gap-2">
                <Button variant="outline" onClick={sendWhatsApp} className="flex-1 h-11">
                  WhatsApp Confirmation
                </Button>
                <Button onClick={handleClose} className="flex-1 h-11 bg-blue-600 hover:bg-blue-700">
                  Continue Shopping
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Checkout;

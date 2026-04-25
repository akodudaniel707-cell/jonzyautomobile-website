import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X, Lock, Shield } from 'lucide-react';
import { useAppContext } from '@/contexts/AppContext';
import { toast } from '@/components/ui/use-toast';

interface AdminLoginProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AdminLogin: React.FC<AdminLoginProps> = ({ isOpen, onClose, onSuccess }) => {
  const { authenticateAdmin } = useAppContext();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (authenticateAdmin(password)) {
        toast({ title: 'Welcome back, Admin!', description: 'Access granted' });
        setPassword('');
        onSuccess();
      } else {
        toast({ title: 'Access denied', description: 'Invalid password', variant: 'destructive' });
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[70] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-slate-900 to-blue-900 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <div>
              <h2 className="text-lg font-bold">Admin Access</h2>
              <p className="text-xs text-slate-300">Restricted area</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} className="text-white hover:bg-white/20">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="text-center py-2">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Lock className="w-8 h-8 text-slate-600" />
            </div>
            <p className="text-sm text-slate-600">Enter your admin password to continue</p>
          </div>

          <div>
            <Label htmlFor="pw">Password</Label>
            <Input id="pw" type="password" required autoFocus
              value={password} onChange={e => setPassword(e.target.value)}
              placeholder="Enter admin password" className="h-11 mt-1" />
          </div>

          <Button type="submit" disabled={loading} className="w-full h-11 bg-slate-900 hover:bg-slate-800">
            {loading ? 'Verifying...' : 'Sign In'}
          </Button>

          <p className="text-xs text-center text-slate-400">
            This area is restricted to JonzyAutomobile administrators only.
          </p>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;

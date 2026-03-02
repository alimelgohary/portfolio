import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';

const AdminLogin = () => {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    setInfo('');
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSubmitting(true);
    if (isSignup) {
      const { error: err } = await signUp(email, password);
      if (err) setError(err);
      else setInfo('Check your email for a confirmation link, then log in.');
    } else {
      const { error: err } = await signIn(email, password);
      if (err) setError(err);
    }
    setSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 mb-4">
            <Lock className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">{isSignup ? 'Create Admin Account' : 'Admin Login'}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {isSignup ? 'First user gets admin access automatically' : 'Enter your credentials to continue'}
          </p>
        </div>
        <div className="space-y-3">
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setError(''); }}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && <p className="text-destructive text-sm">{error}</p>}
          {info && <p className="text-primary text-sm">{info}</p>}
          <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
          </Button>
          <Button variant="ghost" className="w-full text-xs text-muted-foreground" onClick={() => { setIsSignup(!isSignup); setError(''); setInfo(''); }}>
            {isSignup ? 'Already have an account? Login' : "First time? Create account"}
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate('/')}>
            ← Back to Portfolio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;

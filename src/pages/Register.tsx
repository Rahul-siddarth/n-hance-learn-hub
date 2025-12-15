import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth, Branch } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff, GraduationCap, UserPlus } from 'lucide-react';

const branches: Branch[] = ['CSE', 'EEE', 'Mechanical', 'ECE', 'Civil'];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [passcode, setPasscode] = useState('');
  const [branch, setBranch] = useState<Branch | ''>('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isSubmitting = useRef(false);
  const { register } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent duplicate submissions
    if (isSubmitting.current || isLoading) {
      return;
    }

    // Lock immediately to avoid rapid double-clicks firing multiple requests
    isSubmitting.current = true;

    // Validate name
    if (!name.trim()) {
      isSubmitting.current = false;
      toast({
        title: 'Name required',
        description: 'Please enter your full name.',
        variant: 'destructive',
      });
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      isSubmitting.current = false;
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    // Validate branch
    if (!branch) {
      isSubmitting.current = false;
      toast({
        title: 'Branch required',
        description: 'Please select your branch to continue.',
        variant: 'destructive',
      });
      return;
    }

    // Validate passcode
    if (passcode.length < 6) {
      isSubmitting.current = false;
      toast({
        title: 'Passcode too short',
        description: 'Passcode must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await register(name.trim(), email.trim().toLowerCase(), passcode, branch);
      
      if (result.success) {
        toast({
          title: 'Account created!',
          description: 'Welcome to N-HANCE.',
        });
        navigate('/home');
      } else {
        toast({
          title: 'Registration failed',
          description: result.error || 'An error occurred during registration.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
      isSubmitting.current = false;
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-carbon">
              <GraduationCap className="h-6 w-6 text-carbon-foreground" />
            </div>
          </Link>
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight">Create Account</h1>
          <p className="mt-2 text-muted-foreground">Sign up to start your learning journey</p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="rounded-lg border border-border bg-card p-6 shadow-card"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passcode">Account Passcode</Label>
              <div className="relative">
                <Input
                  id="passcode"
                  type={showPasscode ? 'text' : 'password'}
                  placeholder="Create a passcode (min 6 characters)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  required
                  minLength={6}
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  disabled={isLoading}
                >
                  {showPasscode ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">This will be your login passcode</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select 
                value={branch} 
                onValueChange={(value) => setBranch(value as Branch)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select your branch" />
                </SelectTrigger>
                <SelectContent className="bg-card z-50">
                  {branches.map((b) => (
                    <SelectItem key={b} value={b}>
                      {b === 'CSE' && 'Computer Science & Engineering'}
                      {b === 'EEE' && 'Electrical & Electronics Engineering'}
                      {b === 'Mechanical' && 'Mechanical Engineering'}
                      {b === 'ECE' && 'Electronics & Communication Engineering'}
                      {b === 'Civil' && 'Civil Engineering'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                'Creating account...'
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign In
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

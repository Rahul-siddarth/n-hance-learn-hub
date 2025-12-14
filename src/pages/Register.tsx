import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
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
import { Eye, EyeOff, GraduationCap, UserPlus, Mail, CheckCircle } from 'lucide-react';

const branches: Branch[] = ['CSE', 'EEE', 'Mechanical', 'ECE', 'Civil'];

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [branch, setBranch] = useState<Branch | ''>('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { register } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!branch) {
      toast({
        title: 'Please select a branch',
        description: 'You must select your branch to continue.',
        variant: 'destructive',
      });
      return;
    }

    if (password.length < 6) {
      toast({
        title: 'Password too short',
        description: 'Password must be at least 6 characters.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await register(name, email, password, branch);
      
      if (result.success) {
        if (result.needsVerification) {
          setEmailSent(true);
          toast({
            title: 'Verification email sent!',
            description: 'Please check your inbox and click the link to verify your email.',
          });
        }
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
    }
  };

  if (emailSent) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md text-center"
        >
          <div className="mb-8">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          
          <div className="rounded-lg border border-border bg-card p-8 shadow-card">
            <CheckCircle className="mx-auto mb-4 h-12 w-12 text-green-500" />
            <h1 className="font-serif text-2xl font-bold">Check your email</h1>
            <p className="mt-3 text-muted-foreground">
              We've sent a verification link to <span className="font-medium text-foreground">{email}</span>
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Click the link in the email to verify your account and complete registration.
            </p>
            
            <div className="mt-6 space-y-3">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => setEmailSent(false)}
              >
                Use a different email
              </Button>
              <Link to="/login" className="block">
                <Button variant="ghost" className="w-full">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

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
          <h1 className="mt-4 font-serif text-3xl font-bold tracking-tight">Get Started</h1>
          <p className="mt-2 text-muted-foreground">Create your account to begin learning</p>
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
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <p className="text-xs text-muted-foreground">
                You'll need to verify this email to complete registration
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Select value={branch} onValueChange={(value) => setBranch(value as Branch)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your branch" />
                </SelectTrigger>
                <SelectContent className="bg-card">
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

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoginForm } from './login-form';

export function AuthDialog() {
  return (
    <div className="flex justify-end w-full">
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" className="mx-0">
            Login
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <LoginForm />
        </DialogContent>
      </Dialog>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="default" className="mx-2">
            Sign Up
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px]">
          <LoginForm />
        </DialogContent>
      </Dialog>
    </div>
  );
}

import { VariantProps } from 'class-variance-authority';
import { Button, buttonVariants } from './ui/button';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { LoginForm } from './login-form';

export default function AuthTrigger({ text, variant, className }: { text?: string } & VariantProps<typeof buttonVariants> & { className?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className={className} variant={variant}>
          {text}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px]">
        <LoginForm />
      </DialogContent>
    </Dialog>
  );
}

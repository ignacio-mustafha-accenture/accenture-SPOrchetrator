import { AuthAnimatedShell } from '@/views/auth/layout/AuthAnimatedShell';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <AuthAnimatedShell>{children}</AuthAnimatedShell>;
}

import { Suspense } from 'react';
import { AuthHeader, SignInForm } from '@/components/auth';

export default function SignInPage() {
  return (
    <AuthHeader>
      <Suspense>
        <SignInForm />
      </Suspense>
    </AuthHeader>
  );
}

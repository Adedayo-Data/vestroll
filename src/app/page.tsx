import VestRollAccountSelection from '@/components/features/auth/account-type';
import { redirect } from 'next/navigation';

export default function Home() {
  return (
    <div>
      <VestRollAccountSelection />
      {/* redirect("/onboarding"); */}
    </div>
  );
}


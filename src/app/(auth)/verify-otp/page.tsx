"use client";
import AuthLayer from "@/components/features/auth/AuthLayer";
import OTPVerification from "@/components/shared/otpVerificationModal";
import { useRouter } from "next/navigation";

function VerifyOTPPage() {
  const router = useRouter();
  const mockEmail = "zanab12ab@gmail.com";

  const handleVerify = async (otp: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const isValid = otp === "123456";

    if (isValid) {
      router.push("/reset-password");
    }

    return isValid;
  };

  const handleResend = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Verification code resent!");
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <AuthLayer>
      <div className="max-w-md mx-auto">
        <OTPVerification
          email={mockEmail}
          onVerify={handleVerify}
          onResend={handleResend}
          onGoBack={handleGoBack}
          resendCooldown={60}
        />
      </div>
    </AuthLayer>
  );
}

export default VerifyOTPPage;


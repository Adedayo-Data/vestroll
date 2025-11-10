"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import left from "./loginimages/Left.png";
import { useRouter } from "next/navigation";

// Type definitions
interface FormData {
  email: string;
}

interface FormErrors {
  email?: string;
}

const ForgotPasswordForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    email: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        console.log("OTP request request successful:", formData);

        // Redirect to OTP input page with email as query parameter
        router.push(
          `/reset-password-otp?email=${encodeURIComponent(formData.email)}`
        );
      } else {
        console.error("Reset password failed:", result.message);
        alert(result.message || "Failed to send reset link. Please try again.");
      }
    } catch (error) {
      console.error("Error sending reset link:", error);
      alert("Network error. Please check your connection and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   // Simulate API call
  //   setTimeout(() => {
  //     console.log("Reset password request:", formData);
  //     alert("Reset link sent to your email!");
  //     setIsSubmitting(false);
  //   }, 2000);
  // };

  // for testing
  //   const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   if (!validateForm()) {
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   try {
  //     await new Promise(resolve => setTimeout(resolve, 2000));

  //     // Simulate successful API response
  //     console.log("Reset password request:", formData);

  //     // Redirect to OTP input page with email
  //     router.push(`/reset-password-otp?email=${encodeURIComponent(formData.email)}`);

  //   } catch (error) {
  //     console.error('Error:', error);
  //     alert("An error occurred. Please try again.");
  //   } finally {
  //     setIsSubmitting(false);
  //   }
  // };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const isFormValid = formData.email.trim() && validateEmail(formData.email);

  return (
    <div className="w-full bg-white p-4">
      {/* Mobile Logo */}
      <div className="lg:hidden pt-8 mb-16">
        <Image src="/Vector.svg" alt="Globe icon" width={40} height={40} />
      </div>

      <div className="flex h-full">
        {/* Left Side - Hero Section (Desktop Only) */}

        <div className="hidden lg:flex lg:w-1/2 p-4  h-full w-full">
          <Image src={left} alt="left image" />
        </div>

        {/* Right Side - Form Section */}
        <div className="relative w-full lg:w-2/5 flex  justify-start  px-4 sm:px-8 lg:px-12 bg-white">
          <div className="w-full max-w-md">
            {/* Form Content */}
            <div className="mb-10">
              <h2 className="text-2xl lg:text-[40px] font-bold text-black lg:mt-50">
                Forgot your password?
              </h2>
              <p className="text-gray-600 text-[16px] font-medium leading-relaxed mb-8">
                Provide the email address linked to your VestRoll account to
                reset your password and login
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Input */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs font-medium text-black mb-2"
                >
                  Email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Provide email address"
                  className={`w-full h-[53px] px-3.5 py-4.5 mb-8 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm text-gray-900 placeholder-gray-400 ${
                    errors.email ? "border-red-300 ring-red-200" : ""
                  }`}
                  aria-describedby={errors.email ? "email-error" : ""}
                  autoComplete="email"
                />
                {errors.email && (
                  <p id="email-error" className="mt-2 text-xs text-red-600">
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`w-full h-[56px] py-2 px-4 mb-8 rounded-lg font-medium text-sm transition-all duration-200 ${
                  isFormValid && !isSubmitting
                    ? "bg-[#5E2A8C] text-white hover:bg-[#4A1F73] focus:outline-none focus:ring-2 focus:ring-[#5E2A8C] focus:ring-offset-2 focus:ring-offset-white transform hover:scale-[1.02]"
                    : "bg-[#5E2A8C] text-white opacity-50 cursor-not-allowed"
                }`}
                aria-describedby="button-description"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-lg animate-spin mr-2"></div>
                    Sending...
                  </div>
                ) : (
                  "Continue"
                )}
              </button>
              <p id="button-description" className="sr-only">
                {isSubmitting
                  ? "Sending reset link"
                  : "Send password reset link to your email"}
              </p>

              {/* Back to Login Link */}
              <div className="text-center mt-8">
                <Link
                  href="/"
                  className="text-[#5E2A8C] hover:text-[#4A1F73] font-medium text-base transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#5E2A8C] focus:ring-offset-2 focus:ring-offset-white rounded"
                >
                  Back to login
                </Link>
              </div>
            </form>

            {/* Footer Links (Desktop only) */}
            <div className="hidden lg:block absolute bottom-6 right-6">
              <div className="flex space-x-4 text-xs text-gray-600">
                <Link href="#" className="hover:text-black transition-colors">
                  Privacy Policy
                </Link>
                <span>·</span>
                <Link href="#" className="hover:text-black transition-colors">
                  Terms and condition
                </Link>
              </div>
            </div>

            {/* Copyright (Desktop only) */}
            <div className="hidden lg:block absolute bottom-6 left-6 text-xs text-gray-600">
              © 2025, all rights reserved
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;

"use client";
import React, { useEffect, useState } from "react";
import left from "@/../public/images/Left.png";
import mobilelogo from "@/../public/logo/mologo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  businessEmail: string;
  password: string;
  agreement: boolean;
}

interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  businessEmail?: string;
  agreement?: string;
}

export default function Register() {
  const router = useRouter();
  const [progress, setProgress] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    businessEmail: "",
    password: "",
    agreement: false,
  });

  useEffect(() => {
    let completedFields = 1;

    if (formData.firstName.trim()) completedFields++;
    if (formData.lastName.trim()) completedFields++;
    if (formData.businessEmail) completedFields++;
    if (formData.agreement) completedFields++;

    setProgress(Math.max(1, completedFields));
  }, [formData]);

  const [errors, setErrors] = useState<RegisterFormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: RegisterFormErrors = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.businessEmail) {
      newErrors.businessEmail = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.businessEmail)) {
      newErrors.businessEmail = "Please enter a valid email address";
    }

    if (!formData.agreement) {
      newErrors.agreement = "You must accept the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.firstName,
          lastName: formData.lastName,
          businessEmail: formData.businessEmail,
        }),
      });

      if (response.ok) {
        router.push("/add-password");
      } else {
        alert("Registration failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    if (errors[name as keyof RegisterFormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="min-h-screen w-full bg-white">
      <div className="flex flex-col lg:flex-row">
        <div className="md:hidden flex items-center justify-start my-4 mx-4">
          <Image
            src={mobilelogo}
            alt="mobileLogo"
            className="w-10 h-10 -scale-y-100"
          />
        </div>

        {/* Left Side - Hero Section (Desktop Only) */}
        <div className="hidden lg:flex lg:w-1/2 p-4 lg:p-8 h-full w-full">
          <Image src={left} alt="left image" />
        </div>

        {/* Right Side - Form Section */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 flex items-center justify-center  sm:px-6 lg:px-8 py-8">
            <div className="w-full mx-4 lg:mr-80">
              <div className="mb-8">
                <div className="flex items-center mb-2">
                  <div
                    className={`flex-1 h-1 rounded-full transition-colors duration-300 ${progress >= 1 ? "bg-[#5E2A8C]" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`flex-1 h-1 rounded-full ml-2 transition-colors duration-300 ${progress >= 2 ? "bg-[#5E2A8C]" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`flex-1 h-1 rounded-full ml-2 transition-colors duration-300 ${progress >= 3 ? "bg-[#5E2A8C]" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`flex-1 h-1 rounded-full ml-2 transition-colors duration-300 ${progress >= 4 ? "bg-[#5E2A8C]" : "bg-gray-200"}`}
                  ></div>
                  <div
                    className={`flex-1 h-1 rounded-full ml-2 transition-colors duration-300 ${progress >= 5 ? "bg-[#5E2A8C]" : "bg-gray-200"}`}
                  ></div>
                </div>
              </div>
              <div className="mb-10">
                <h2 className="text-[#17171C] text-[40px] font-bold mb-2 tracking-tighter">
                  Welcome to VestRoll!
                </h2>
                <p className="text-[#414F62] text-[12px] md:text-[16px] md:font-medium md:leading-1.5">
                  Let&apos;s get to know you! Provide the details blow to
                  continue
                </p>
              </div>

              <div className="space-y-5 mt-8">
                <div>
                  <label className="block text-[#17171C] text-[12px] font-medium mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <div className=" text-gray-900">
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      placeholder="Provide your first name "
                      onChange={handleChange}
                      required
                      className={`w-full pl-3 pr-3 py-3 sm:py-3.5 bg-[#F5F6F7] rounded-[8px] border ${
                        errors.firstName ? "border-red-300" : "border-gray-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm sm:text-base`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[#17171C] text-[12px] font-medium mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <div className=" text-gray-900">
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      placeholder="Provide your last name "
                      onChange={handleChange}
                      required
                      className={`w-full pl-3 pr-3 py-3 sm:py-3.5 bg-[#F5F6F7] rounded-[8px] border ${
                        errors.lastName ? "border-red-300" : "border-gray-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm sm:text-base`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[#17171C] text-[12px] font-medium mb-2">
                    Business email address{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className=" text-gray-900">
                    <input
                      type="email"
                      name="businessEmail"
                      value={formData.businessEmail}
                      placeholder="Provide email address "
                      onChange={handleChange}
                      required
                      className={`w-full pl-3 pr-3 py-3 sm:py-3.5 bg-[#F5F6F7] rounded-[8px] border ${
                        errors.businessEmail
                          ? "border-red-300"
                          : "border-gray-200"
                      } rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 text-sm sm:text-base`}
                    />
                  </div>
                  {errors.businessEmail && (
                    <p className="mt-2 text-sm text-red-600">
                      {errors.businessEmail}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between mt-8 mb-8 flex-wrap gap-2">
                  <div className="flex items-center">
                    <input
                      id="agreement"
                      name="agreement"
                      type="checkbox"
                      checked={formData.agreement}
                      onChange={handleChange}
                      className="h-4 w-4  text-[12px] focus:ring-purple-500 border border-[#5E2A8C] rounded"
                    />
                    <label
                      htmlFor="agreeement"
                      className="ml-2 block text-[12px]  text-gray-900"
                    >
                      By creating an account, I agree to out{" "}
                      <Link href="/terms" target="_blank">
                        <span className="text-[#5E2A8C]">
                          Terms of Service and Privacy Policy
                        </span>{" "}
                      </Link>
                      and confirm that I am 8 years and older
                    </label>
                  </div>
                </div>

                <button
                  type="button"
                  disabled={isLoading}
                  onClick={handleSubmit}
                  className={`w-full py-3.5 sm:py-4 text-[16px] mt-8 px-4 rounded-[12px] font-semibold text-white text-sm sm:text-base transition-all duration-200 cursor-pointer ${
                    !isLoading
                      ? "bg-[#5E2A8C] hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform hover:scale-[1.02] active:scale-[0.98]"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                      Registering...
                    </div>
                  ) : (
                    "Continue"
                  )}
                </button>
              </div>

              <div className="mt-8 text-center">
                <p className="text-[16px] font-medium flex flex-row gap-2 justify-center items-center sm:text-sm text-gray-600">
                  Already own a VestRoll account?
                  <a
                    href="/login"
                    className="font-semibold text-[16px] text-purple-700 hover:text-purple-800"
                  >
                    Login
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="hidden md:w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
            <div className="max-w-md mx-auto lg:max-w-none">
              <div className="flex lg:flex flex-col sm:flex-row justify-between items-center space-y-2 sm:space-y-0 text-xs sm:text-sm">
                <span className="text-[#414F62] text-[12px] font-medium">
                  © 2025, all rights reserved
                </span>
                <div className="flex items-center space-x-2 sm:space-x-3 text-gray-700">
                  <a
                    href="#"
                    className="hover:text-[#5E2A8C] transition-colors"
                  >
                    Privacy Policy
                  </a>
                  <span className="text-[#414F62] text-[12px] font-medium">
                    •
                  </span>
                  <a
                    href="#"
                    className="hover:text-[#5E2A8C] transition-colors"
                  >
                    Terms and condition
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}



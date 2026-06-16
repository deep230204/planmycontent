import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "../../components/Branding/auth/AuthLayout";
import PremiumButton from "../../components/Branding/auth/PremiumButton";
import OTPInput from "../../components/Branding/auth/OTPInput";
import StatusMessage from "../../components/Branding/auth/StatusMessage";

function VerifyOtpPage() {
  const navigate = useNavigate();
  const email = localStorage.getItem("resetEmail") || "";

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    const otpValue = otp.join("");

    if (otpValue.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post("https://planmycontent.onrender.com/api/auth/verify-otp", {
        email,
        otp: otpValue,
      });

      if (response.data.success) {
        localStorage.setItem("verifiedOtp", otpValue);
        toast.success("OTP verified successfully");
        navigate("/reset-password");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Verify OTP"
      subtitle="Enter the 6-digit OTP sent to your email address to continue."
    >
      <div className="flex justify-center mb-8">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-100 text-orange-500">
          <ShieldCheck size={32} />
        </div>
      </div>

      <form onSubmit={handleVerifyOtp} className="space-y-6">
        <OTPInput otp={otp} setOtp={setOtp} />

        <div className="-mt-4">
          <StatusMessage message={error} type="error" />
        </div>

        <PremiumButton type="submit" loading={loading} className="mt-2">
          Verify OTP
        </PremiumButton>

        <div className="text-center mt-6">
          <Link
            to="/forgot-password"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default VerifyOtpPage;
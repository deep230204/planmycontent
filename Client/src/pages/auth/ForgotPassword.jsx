import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "../../components/Branding/auth/AuthLayout";
import PremiumInput from "../../components/Branding/auth/PremiumInput";
import PremiumButton from "../../components/Branding/auth/PremiumButton";
import StatusMessage from "../../components/Branding/auth/StatusMessage";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter your email");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/auth/forgot-password",
        {
          email,
        }
      );

      toast.success(response.data.message);

      localStorage.setItem("resetEmail", email);

      navigate("/VerifyOtpPage");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Forgot Password"
      subtitle="Enter your email address and we'll send you an OTP to reset your password."
    >
      <form onSubmit={handleSendOTP} className="space-y-6">
        <PremiumInput
          label="Email Address"
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="example@gmail.com"
          icon={Mail}
          required
        />

        <div className="-mt-4">
          <StatusMessage message={error} type="error" />
        </div>

        <PremiumButton type="submit" loading={loading}>
          Send OTP
        </PremiumButton>

        <div className="text-center mt-6">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-2 text-sm font-medium text-slate-500 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft size={16} />
            Back to Login
          </Link>
        </div>
      </form>
    </AuthLayout>
  );
}

export default ForgotPassword;
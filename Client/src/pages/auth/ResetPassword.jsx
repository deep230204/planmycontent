import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Lock, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import AuthLayout from "../../components/Branding/auth/AuthLayout";
import PremiumInput from "../../components/Branding/auth/PremiumInput";
import PremiumButton from "../../components/Branding/auth/PremiumButton";
import PasswordField from "../../components/Branding/auth/PasswordField";
import StatusMessage from "../../components/Branding/auth/StatusMessage";

function ResetPassword() {
  const navigate = useNavigate();
  const location = useLocation();

  const email = location.state?.email || localStorage.getItem("resetEmail") || "";
  const otp = localStorage.getItem("verifiedOtp") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");

    if (!password.trim()) {
      setError("Please enter new password");
      return;
    }

    if (!confirmPassword.trim()) {
      setError("Please confirm your password");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password.trim())) {
      setError("Please ensure your password meets all requirements");
      return;
    }

    if (password.trim() !== confirmPassword.trim()) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("https://planmycontent.onrender.com/api/auth/reset-password", {
        email,
        otp,
        newPassword: password,
      });

      if (response.data.success) {
        toast.success("Password reset successfully");

        localStorage.removeItem("resetEmail");
        localStorage.removeItem("verifiedOtp");

        navigate("/login");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Unable to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const isPasswordMismatch = confirmPassword && password !== confirmPassword;

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="Create a strong new password to secure your account and continue using PlanMyContent."
    >
      <form onSubmit={handleResetPassword} className="space-y-4">
        <PasswordField
          label="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />

        <div>
          <PremiumInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm new password"
            icon={Lock}
            isPassword
            required
            error={isPasswordMismatch ? " " : ""}
          />
          {isPasswordMismatch && (
            <div className="-mt-3">
              <StatusMessage message="Passwords do not match" type="error" />
            </div>
          )}
        </div>

        <div className="pt-2">
          <StatusMessage message={error} type="error" />
        </div>

        <PremiumButton type="submit" loading={loading}>
          Reset Password
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

export default ResetPassword;
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { User, Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  clearLegacyOnboardingDrafts,
  clearOnboardingDraft,
} from "../../utils/onboardingDraft";
import AuthLayout from "../../components/Branding/auth/AuthLayout";
import PremiumInput from "../../components/Branding/auth/PremiumInput";
import PremiumButton from "../../components/Branding/auth/PremiumButton";
import PasswordField from "../../components/Branding/auth/PasswordField";
import StatusMessage from "../../components/Branding/auth/StatusMessage";

function Signup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignup = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword } = formData;

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.error("Please ensure your password meets all requirements");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("https://planmycontent.onrender.com/api/auth/register", {
        name,
        email,
        password,
      });

      clearLegacyOnboardingDrafts();
      clearOnboardingDraft(email);
      localStorage.removeItem("latestOnboardingData");
      localStorage.removeItem("latestGeneratedResults");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      toast.success("Account created successfully");
      navigate("/onboarding");
    } catch (error) {
      toast.error(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const isPasswordMismatch = formData.confirmPassword && formData.password !== formData.confirmPassword;

  return (
    <AuthLayout
      title="Create your account"
      subtitle="Start building your personalized content strategy and grow faster with AI-powered planning."
    >
      <form onSubmit={handleSignup} className="space-y-4">
        <PremiumInput
          label="Full Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          icon={User}
          required
        />

        <PremiumInput
          label="Email Address"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          icon={Mail}
          required
        />

        <PasswordField
          value={formData.password}
          onChange={handleChange}
        />

        <div>
          <PremiumInput
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm password"
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

        <div className="pt-2 space-y-3">
          <PremiumButton type="submit" loading={loading}>
            Create Account
          </PremiumButton>

          <PremiumButton variant="secondary" disabled>
            Continue with Google (Coming Soon)
          </PremiumButton>
        </div>

        <div className="text-center mt-6 space-y-4">
          <p className="text-xs text-slate-500 leading-relaxed">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </p>

          <p className="text-sm text-slate-500 font-medium">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#f47c35] font-semibold hover:text-[#ea6d24] transition-colors"
            >
              Log In
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Signup;

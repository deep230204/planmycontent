import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { Mail, Lock } from "lucide-react";
import { toast } from "sonner";
import {
  clearLegacyOnboardingDrafts,
  clearOnboardingDraft,
} from "../../utils/onboardingDraft";
import AuthLayout from "../../components/Branding/auth/AuthLayout";
import PremiumInput from "../../components/Branding/auth/PremiumInput";
import PremiumButton from "../../components/Branding/auth/PremiumButton";
import StatusMessage from "../../components/Branding/auth/StatusMessage";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    const { email, password } = formData;

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post("https://planmycontent.onrender.com/api/auth/login", {
        email,
        password,
      });

      clearLegacyOnboardingDrafts();
      clearOnboardingDraft(email);
      localStorage.removeItem("latestOnboardingData");
      localStorage.removeItem("latestGeneratedResults");
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      if (response.data.user.isOnboarded) {
        if (response.data.user.onboardingData) {
          localStorage.setItem("latestOnboardingData", JSON.stringify(response.data.user.onboardingData));
        }
        navigate("/dashboard");
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      title="Welcome back"
      subtitle="Log in to continue building and managing your content strategy."
    >
      <form onSubmit={handleLogin} className="space-y-5">
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

        <div>
          <div className="flex justify-end mb-1">
            <Link
              to="/forgot-password"
              className="text-xs font-semibold text-orange-500 hover:text-orange-600 transition-colors"
            >
              Forgot Password?
            </Link>
          </div>
          <PremiumInput
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            icon={Lock}
            isPassword
            required
          />
        </div>

        <div className="-mt-1">
          <StatusMessage message={error} type="error" />
        </div>

        <PremiumButton type="submit" loading={loading} className="mt-2">
          Log In
        </PremiumButton>

        <div className="text-center mt-8">
          <p className="text-sm text-slate-500 font-medium">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-orange-500 font-semibold hover:text-orange-600 transition-colors"
            >
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}

export default Login;

import { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Bell,
  Camera,
  CreditCard,
  Lock,
  Mail,
  Moon,
  Save,
  ShieldCheck,
  Sparkles,
  SunMedium,
  Target,
  User,
  Wallet,
  BriefcaseBusiness,
} from "lucide-react";
import WorkspaceShell from "../components/Branding/common/WorkspaceShell";
import {
  getUserProfile,
  readStoredProfileImage,
  setStoredProfileImage,
  updateStoredUser,
} from "../utils/userProfile";
import { useTheme } from "../context/ThemeContext";

const sectionCard =
  "rounded-[30px] border transition-all duration-300 hover:-translate-y-0.5 sm:p-8";

const fieldClass =
  "w-full rounded-2xl border py-3.5 pl-12 pr-4 text-sm outline-none transition-all duration-300 focus:ring-4 focus:ring-orange-500/10";

const SettingPage = () => {
  const { isDark, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    currentPassword: "",
    password: "",
    workspaceName: "PlanMyContent AI",
    emailNotifications: true,
    weeklyReports: true,
    trendingAlerts: false,
  });
  const [userData, setUserData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImage, setProfileImageState] = useState("");

  useEffect(() => {
    const user = getUserProfile();
    setProfileImageState(user.profileImage || readStoredProfileImage());

    if (!user?.email) return;

    fetch("https://planmycontent.onrender.com/api/auth/user-data", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: user.email }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to load settings");
        }

        setUserData(data.user);
        setFormData((prev) => ({
          ...prev,
          name: data.user.name || "",
          email: data.user.email || "",
          workspaceName: data.user.onboardingData?.brandName || "PlanMyContent AI",
          emailNotifications:
            data.user.notificationPreferences?.emailNotifications ?? true,
          weeklyReports:
            data.user.notificationPreferences?.weeklyReports ?? true,
          trendingAlerts:
            data.user.notificationPreferences?.trendingAlerts ?? false,
        }));
      })
      .catch((error) => {
        console.error("Settings load error:", error);
      });
  }, []);

  const onboardingSummary = useMemo(() => {
    const onboardingData = userData?.onboardingData || {};
    return {
      brandName: onboardingData.brandName || "Not set",
      industry: Array.isArray(onboardingData.industry)
        ? onboardingData.industry.join(", ")
        : onboardingData.industry || "Not set",
      audience:
        onboardingData.audience?.profession ||
        onboardingData.audience?.audienceType ||
        "Not set",
      goal: onboardingData.goals?.primaryGoal?.[0] || "Not set",
      contentType:
        onboardingData.contentType?.contentTypes?.join(", ") || "Not set",
    };
  }, [userData]);

  const membership = userData?.membership || getUserProfile()?.membership || {};
  const paymentHistory = userData?.paymentHistory || [];
  const latestPayment = paymentHistory[0];
  const credits = userData?.credits ?? getUserProfile()?.credits ?? 10;

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleProfileImageChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const nextImage = String(reader.result || "");
      setProfileImageState(nextImage);
      setStoredProfileImage(nextImage);
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    const currentUser = getUserProfile();
    if (!currentUser?.email) {
      alert("Please login again.");
      return;
    }

    setIsSaving(true);

    fetch("https://planmycontent.onrender.com/api/auth/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentEmail: currentUser.email,
        name: formData.name,
        email: formData.email,
        currentPassword: formData.currentPassword,
        password: formData.password,
        notificationPreferences: {
          emailNotifications: formData.emailNotifications,
          weeklyReports: formData.weeklyReports,
          trendingAlerts: formData.trendingAlerts,
        },
      }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Failed to save settings");
        }

        updateStoredUser({
          id: data.user.id || data.user._id,
          _id: data.user._id || data.user.id,
          name: data.user.name,
          email: data.user.email,
          isOnboarded: data.user.isOnboarded,
          profileImage: profileImage || readStoredProfileImage(),
        });
        setUserData(data.user);
        setFormData((prev) => ({
          ...prev,
          currentPassword: "",
          password: "",
        }));
        alert("Settings saved successfully!");
      })
      .catch((error) => {
        console.error("Settings save error:", error);
        alert("Failed to save settings");
      })
      .finally(() => setIsSaving(false));
  };

  return (
    <WorkspaceShell
      badge="Account Settings"
      dashboardSection="Settings"
      title="Structured control for your workspace"
      description="Manage profile, billing, preferences, and security from one premium settings hub."
      backTo="/dashboard"
      backLabel="Dashboard"
      actions={
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-2xl bg-orange-500 px-5 py-3 font-semibold text-white shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:bg-orange-600"
        >
          <Save className="h-5 w-5" />
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      }
      contentClassName="mx-auto max-w-7xl"
    >
      <div className="grid grid-cols-1 gap-8 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-8">
          <section className={sectionCard} style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}>
            <div className="mb-6 flex items-center gap-3">
              <User className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-black" style={{ color: "var(--app-text)" }}>Profile</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-[180px_1fr]">
              <div className="flex flex-col items-center rounded-[28px] border p-5 text-center"
                   style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)" }}>
                <div className="relative">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={formData.name || "User"}
                      className="h-24 w-24 rounded-full object-cover ring-4 ring-white/10"
                    />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-full bg-orange-500/10 text-3xl font-black text-orange-500">
                      {(formData.name || "U").charAt(0).toUpperCase()}
                    </div>
                  )}

                  <label className="absolute bottom-0 right-0 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-orange-500 text-white shadow-md transition-colors hover:bg-orange-600">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleProfileImageChange}
                      className="hidden"
                    />
                  </label>
                </div>

                <p className="mt-4 text-base font-black" style={{ color: "var(--app-text)" }}>
                  {formData.name || "Creator"}
                </p>
                <p className="mt-1 text-sm" style={{ color: "var(--muted-text)", opacity: 0.6 }}>{formData.email || "No email"}</p>
                {profileImage ? (
                  <button
                    onClick={() => {
                      setProfileImageState("");
                      setStoredProfileImage("");
                    }}
                    className="mt-4 text-xs font-semibold text-orange-500 transition-colors hover:text-orange-600"
                  >
                    Remove photo
                  </button>
                ) : null}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-widest" style={{ color: "var(--muted-text)", opacity: 0.4 }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "var(--muted-text)", opacity: 0.5 }} />
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className={fieldClass}
                      style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-black uppercase tracking-widest" style={{ color: "var(--muted-text)", opacity: 0.4 }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "var(--muted-text)", opacity: 0.5 }} />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={fieldClass}
                      style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={sectionCard} style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}>
            <div className="mb-6 flex items-center gap-3">
              <BriefcaseBusiness className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-black" style={{ color: "var(--app-text)" }}>Workspace</h2>
            </div>
 
            <div className="grid gap-4 md:grid-cols-2">
              {[
                { label: "Workspace Name", value: formData.workspaceName },
                { label: "Brand Name", value: onboardingSummary.brandName },
                { label: "Industry", value: onboardingSummary.industry },
                { label: "Audience", value: onboardingSummary.audience },
                { label: "Primary Goal", value: onboardingSummary.goal },
                { label: "Content Type", value: onboardingSummary.contentType },
              ].map((item) => (
                <div key={item.label} className="rounded-2xl border p-4"
                     style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)" }}>
                  <p className="text-xs font-bold uppercase tracking-[0.18em]" style={{ color: "var(--muted-text)", opacity: 0.4 }}>
                    {item.label}
                  </p>
                  <p className="mt-2 text-sm font-semibold" style={{ color: "var(--app-text)" }}>{item.value}</p>
                </div>
              ))}
            </div>
          </section>

          <section className={sectionCard} style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}>
            <div className="mb-6 flex items-center gap-3">
              <Bell className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-black" style={{ color: "var(--app-text)" }}>Preferences</h2>
            </div>

            <div className="space-y-4">
              {[
                {
                  key: "theme",
                  label: "Dark Mode",
                  description: "Apply the premium dark interface instantly across the app.",
                  checked: isDark,
                  onChange: toggleTheme,
                  Icon: isDark ? Moon : SunMedium,
                },
                {
                  key: "emailNotifications",
                  label: "Email Notifications",
                  description: "Receive product activity and workspace updates.",
                  checked: formData.emailNotifications,
                  onChange: () =>
                    setFormData((prev) => ({
                      ...prev,
                      emailNotifications: !prev.emailNotifications,
                    })),
                  Icon: Bell,
                },
                {
                  key: "weeklyReports",
                  label: "Weekly Reports",
                  description: "Get strategic summaries of your saved ideas and plans.",
                  checked: formData.weeklyReports,
                  onChange: () =>
                    setFormData((prev) => ({
                      ...prev,
                      weeklyReports: !prev.weeklyReports,
                    })),
                  Icon: Sparkles,
                },
                {
                  key: "trendingAlerts",
                  label: "Trending Alerts",
                  description: "Surface rising opportunities and attention spikes early.",
                  checked: formData.trendingAlerts,
                  onChange: () =>
                    setFormData((prev) => ({
                      ...prev,
                      trendingAlerts: !prev.trendingAlerts,
                    })),
                  Icon: Target,
                },
              ].map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between rounded-2xl border px-5 py-4"
                  style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)" }}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-0.5 flex h-11 w-11 items-center justify-center rounded-2xl shadow-inner"
                         style={{ background: "var(--card-bg)", color: "var(--app-text)" }}>
                      <item.Icon className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold" style={{ color: "var(--app-text)" }}>{item.label}</p>
                      <p className="mt-1 text-sm" style={{ color: "var(--muted-text)", opacity: 0.6 }}>{item.description}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={item.onChange}
                    className={`relative h-7 w-12 rounded-full transition-colors duration-300 ${
                      item.checked ? "bg-orange-500" : "bg-[var(--app-border)]"
                    }`}
                    style={!item.checked ? { background: "var(--soft-bg)", border: "2px solid var(--app-border)" } : {}}
                  >
                    <span
                      className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform duration-300 ${
                        item.checked ? "translate-x-6" : "translate-x-1"
                      }`}
                      style={!item.checked ? { background: "var(--muted-text)" } : {}}
                    />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className={`${sectionCard} bg-gradient-to-br from-[#07122b] via-[#12233d] to-[#1a2f4d] text-white`}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-orange-300">
                  Billing
                </p>
                <h2 className="mt-3 text-2xl font-black">
                  {membership?.planName || "Starter"} plan
                </h2>
              </div>
              <div className="rounded-full border border-white/15 bg-white/10 px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-white">
                {membership?.status || "active"}
              </div>
            </div>

            <div className="mt-6 grid gap-4">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
                  Available Credits
                </p>
                <p className="mt-2 text-2xl font-black text-white">{credits}</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
                  Payment Method
                </p>
                <p className="mt-2 text-sm font-semibold text-white/85">
                  {membership?.paymentMethod || "Razorpay / Card / UPI"}
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-white/55">
                  Latest Payment
                </p>
                <p className="mt-2 text-sm font-semibold text-white/85">
                  {latestPayment?.createdAt
                    ? new Intl.DateTimeFormat("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      }).format(new Date(latestPayment.createdAt))
                    : "No payment history yet"}
                </p>
              </div>
            </div>

            <button className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-3.5 text-sm font-bold text-white transition-all hover:bg-orange-600">
              <CreditCard className="h-4 w-4" />
              Upgrade or Manage Plan
            </button>
          </section>

          <section className={sectionCard} style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}>
            <div className="mb-6 flex items-center gap-3">
              <ShieldCheck className="h-5 w-5 text-emerald-500" />
              <h2 className="text-xl font-black" style={{ color: "var(--app-text)" }}>Security</h2>
            </div>

            <div className="space-y-5">
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-widest" style={{ color: "var(--muted-text)", opacity: 0.4 }}>
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-orange-500" />
                  <input
                    type="password"
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Required to confirm changes"
                    className={fieldClass}
                    style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
                  />
                </div>
              </div>
 
              <div>
                <label className="mb-2 block text-sm font-black uppercase tracking-widest" style={{ color: "var(--muted-text)", opacity: 0.4 }}>
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2" style={{ color: "var(--muted-text)", opacity: 0.5 }} />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Leave blank to keep current password"
                    className={fieldClass}
                    style={{ background: "var(--soft-bg)", borderColor: "var(--app-border)", color: "var(--app-text)" }}
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={sectionCard} style={{ background: "var(--card-bg)", borderColor: "var(--app-border)", boxShadow: "var(--shadow-premium)" }}>
            <div className="mb-4 flex items-center gap-3">
              <Wallet className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-black" style={{ color: "var(--app-text)" }}>Workspace Snapshot</h2>
            </div>
            <div className="space-y-3 text-sm" style={{ color: "var(--muted-text)" }}>
              <p>
                Your workspace is connected to live onboarding inputs, saved ideas,
                generated plans, and payment state.
              </p>
              <div className="rounded-2xl border p-4"
                   style={{ background: "rgba(249,115,22,0.05)", borderColor: "rgba(249,115,22,0.1)" }}>
                <div className="flex items-center gap-2 text-orange-500">
                  <BadgeCheck className="h-4 w-4" />
                  <span className="text-xs font-bold uppercase tracking-[0.18em]">
                    Premium Workspace
                  </span>
                </div>
                <p className="mt-2 text-sm font-semibold" style={{ color: "var(--app-text)" }}>
                  Everything here is structured for a production-ready SaaS profile experience.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </WorkspaceShell>
  );
};

export default SettingPage;

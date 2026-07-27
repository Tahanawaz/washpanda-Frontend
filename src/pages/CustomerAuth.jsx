import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { LuArrowLeft, LuEye, LuEyeOff, LuLockKeyhole, LuMail, LuPhone, LuShieldCheck, LuSparkles, LuUser } from "react-icons/lu";
import { loginCustomer, signupCustomer } from "../services/api";

export default function CustomerAuth({ mode }) {
  const signup = mode === "signup";
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const password = String(form.get("password") || "");
    if (signup && password !== form.get("confirmPassword")) {
      toast.error("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const payload = signup
        ? await signupCustomer({ name: form.get("name"), email: form.get("email"), phone: form.get("phone"), password })
        : await loginCustomer({ email: form.get("email"), password, remember: form.get("remember") === "on" });
      toast.success(payload.message);
      navigate("/", { replace: true });
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3f9fd] px-4 py-8 sm:px-6">
      <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -bottom-36 -right-24 h-96 w-96 rounded-full bg-cyan-200/35 blur-3xl" />

      <div className="relative grid w-full max-w-5xl overflow-hidden rounded-[32px] border border-white/80 bg-white shadow-[0_30px_90px_rgba(40,105,154,0.18)] lg:grid-cols-[0.82fr_1.18fr]">
        <section className="hidden bg-gradient-to-br from-[#246fa8] via-[#378bc8] to-[#66b5e7] p-10 text-white lg:flex lg:flex-col lg:justify-between">
          <Link to="/" className="w-fit rounded-2xl bg-white/95 px-4 py-2 shadow-lg"><img src="/logo.png" alt="WashPanda" className="h-16 w-32 object-contain" /></Link>
          <div>
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15"><LuSparkles size={24} /></span>
            <h1 className="mt-6 text-4xl font-bold leading-tight">Clean cars.<br />Simple bookings.</h1>
            <p className="mt-4 max-w-sm text-sm leading-7 text-blue-50">Create your customer account to enjoy a faster, more personal WashPanda experience.</p>
          </div>
          <div className="flex items-center gap-3 text-sm text-blue-50"><LuShieldCheck size={20} /> Secure customer account</div>
        </section>

        <section className="p-6 sm:p-10 lg:p-12">
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#287fbd]"><LuArrowLeft /> Home</Link>
            <img src="/logo.png" alt="WashPanda" className="h-14 w-28 object-contain lg:hidden" />
          </div>

          <div className="mt-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#4B95D1]">Customer account</p>
            <h2 className="mt-2 text-3xl font-bold text-gray-800">{signup ? "Create your account" : "Welcome back"}</h2>
            <p className="mt-2 text-sm leading-6 text-gray-500">{signup ? "Join WashPanda in less than a minute." : "Sign in to continue with your customer account."}</p>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-4">
            {signup && <AuthField icon={LuUser} label="Full name" name="name" placeholder="Ali Khan" autoComplete="name" />}
            <AuthField icon={LuMail} label="Email address" name="email" type="email" placeholder="you@example.com" autoComplete="email" />
            {signup && <AuthField icon={LuPhone} label="Phone number" name="phone" placeholder="+92 300 1234567" autoComplete="tel" />}
            <PasswordField label="Password" name="password" show={showPassword} onToggle={() => setShowPassword((current) => !current)} autoComplete={signup ? "new-password" : "current-password"} />
            {signup && <PasswordField label="Confirm password" name="confirmPassword" show={showPassword} onToggle={() => setShowPassword((current) => !current)} autoComplete="new-password" />}

            {signup ? (
              <label className="flex items-start gap-3 text-xs leading-5 text-gray-500"><input type="checkbox" required className="mt-1 h-4 w-4 accent-[#4B95D1]" /><span>I agree to the <Link to="/terms-and-conditions" className="font-semibold text-[#287fbd]">Terms & Conditions</Link> and <Link to="/privacy-policy" className="font-semibold text-[#287fbd]">Privacy Policy</Link>.</span></label>
            ) : (
              <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-500"><input name="remember" type="checkbox" className="h-4 w-4 accent-[#4B95D1]" /> Keep me signed in</label>
            )}

            <button type="submit" disabled={loading} className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#438fca] to-[#2879b8] px-6 py-3.5 font-bold text-white shadow-lg shadow-blue-100 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">
              <LuLockKeyhole /> {loading ? (signup ? "Creating account..." : "Signing in...") : (signup ? "Create account" : "Sign in")}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">{signup ? "Already have an account?" : "New to WashPanda?"} <Link to={signup ? "/customer-login" : "/signup"} className="font-bold text-[#287fbd]">{signup ? "Login" : "Sign up"}</Link></p>
          <div className="mt-6 border-t border-gray-100 pt-5 text-center"><Link to="/login" className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#287fbd]"><LuShieldCheck /> Login as Admin</Link></div>
        </section>
      </div>
    </main>
  );
}

function AuthField({ icon: Icon, label, name, type = "text", placeholder, autoComplete }) {
  return (
    <label className="block text-sm font-semibold text-gray-700">{label}
      <span className="relative mt-2 block"><Icon className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#72a5cc]" size={18} /><input required name={name} type={type} placeholder={placeholder} autoComplete={autoComplete} className="min-h-12 w-full rounded-xl border border-gray-200 bg-[#fbfdff] py-3 pl-11 pr-4 font-normal text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#4B95D1] focus:ring-4 focus:ring-blue-50" /></span>
    </label>
  );
}

function PasswordField({ label, name, show, onToggle, autoComplete }) {
  return (
    <label className="block text-sm font-semibold text-gray-700">{label}
      <span className="relative mt-2 block"><LuLockKeyhole className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#72a5cc]" size={18} /><input required minLength="8" name={name} type={show ? "text" : "password"} autoComplete={autoComplete} placeholder="At least 8 characters" className="min-h-12 w-full rounded-xl border border-gray-200 bg-[#fbfdff] py-3 pl-11 pr-12 font-normal text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-[#4B95D1] focus:ring-4 focus:ring-blue-50" /><button type="button" onClick={onToggle} aria-label={show ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-2 text-gray-400 hover:bg-gray-100">{show ? <LuEyeOff /> : <LuEye />}</button></span>
    </label>
  );
}

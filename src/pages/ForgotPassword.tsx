import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { authCallbackUrl } from "@/lib/siteUrl";
import { motion } from "framer-motion";
import { Mail, ArrowLeft, MailCheck, RefreshCw, Send, Home } from "lucide-react";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResendSuccess(false);
    setLoading(true);

    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: authCallbackUrl,
      });
      if (err) throw err;
      setSent(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to send reset email";
      if (errorMessage.includes("rate limit")) {
        setError("Too many requests. Please wait a few minutes before trying again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) {
      setError("Please enter your email address first");
      return;
    }

    setError("");
    setResendSuccess(false);
    setResending(true);

    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: authCallbackUrl,
      });
      if (err) throw err;
      setResendSuccess(true);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Failed to resend reset email";
      if (errorMessage.includes("rate limit")) {
        setError("Too many requests. Please wait a few minutes before trying again.");
      } else {
        setError(errorMessage);
      }
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <div className="flex-1 flex min-h-0 flex-col lg:flex-row">
        <div className="flex-1 flex flex-col min-h-0 px-4 sm:px-6 lg:px-8 pt-0 sm:pt-1 relative overflow-hidden bg-dots-subtle min-w-0 lg:w-1/2 lg:flex-shrink-0">
          <div className="flex-1 flex flex-col items-center justify-start overflow-auto">
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="absolute top-1/4 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-[100px]"
              animate={{ scale: [1, 1.2, 1], opacity: [0.06, 0.12, 0.06] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-primary/8 rounded-full blur-[120px]"
              animate={{ scale: [1.1, 1, 1.1], opacity: [0.05, 0.1, 0.05] }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm relative z-10 -mt-16 sm:-mt-24"
          >
            <div className="flex items-center justify-start gap-0 mb-0 -space-x-10 sm:-space-x-14">
              <img src="/Astarus Logo.png" alt="" className="h-[21rem] sm:h-[24rem] md:h-[27rem] w-auto max-w-full" />
              <span className="font-brand text-5xl sm:text-6xl md:text-7xl tracking-tight text-black uppercase">
                Astarus
              </span>
            </div>
            <div className="rounded-2xl border border-border bg-white shadow-elegant pt-6 sm:pt-8 pb-4 sm:pb-5 px-6 sm:px-8 -mt-16 sm:-mt-24 md:-mt-32">
              <div className="text-center mb-4">
                <span className="inline-flex items-center gap-2 text-primary font-semibold text-xs uppercase tracking-wider">
                  {sent ? "Check your email" : "Reset password"}
                </span>
                <h1 className="font-display text-2xl sm:text-3xl font-bold text-foreground mt-2">
                  {sent ? "Check Your Email" : "Forgot Password"}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {sent ? "We've sent a reset link to your email" : "Enter your email and we'll send a reset link"}
                </p>
              </div>
              {sent ? (
                <div className="space-y-4">
                  <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-xl bg-primary/8 flex items-center justify-center">
                      <MailCheck className="w-6 h-6 text-primary" />
                    </div>
                  </div>
                  <p className="text-center text-sm text-muted-foreground">
                    If an account exists for <span className="font-medium text-foreground">{email}</span>, you'll receive a link. Check spam if needed.
                  </p>
                  {resendSuccess && (
                    <div className="p-3 rounded-xl bg-success/10 border border-success/40 text-success text-sm text-center shadow-soft">
                      Reset email resent. Check your inbox.
                    </div>
                  )}
                  {error && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleResend}
                      disabled={resending}
                      className="w-full h-9 rounded-lg text-sm border-border/80 bg-muted/30 text-foreground hover:scale-[1.02] transition-transform duration-200"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 mr-2 ${resending ? "animate-spin" : ""}`} />
                      {resending ? "Resending..." : "Resend Reset Link"}
                    </Button>
                    <Link to="/login" className="block">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full h-9 rounded-lg text-sm border-border/80 bg-muted/30 text-foreground hover:scale-[1.02] transition-transform duration-200"
                      >
                        <ArrowLeft className="w-3.5 h-3.5 mr-2" />
                        Back to Login
                      </Button>
                    </Link>
                    <Link to="/" className="block">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="w-full h-8 rounded-lg text-sm text-muted-foreground hover:scale-[1.02] transition-transform duration-200"
                      >
                        <Home className="w-3.5 h-3.5 mr-2" />
                        Back to home
                      </Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-3">
                  {error && (
                    <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                      {error}
                    </div>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">Email</Label>
                    <div className="relative">
                      <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="input-premium pr-11 min-h-[48px] touch-manipulation"
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full min-h-[52px] rounded-xl bg-primary/90 hover:bg-primary text-primary-foreground font-semibold shadow-soft hover:shadow-glow hover:-translate-y-0.5 transition-all duration-300 border border-primary/60 ring-1 ring-primary/40"
                  >
                    {loading ? "Sending..." : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Send Reset Link
                      </>
                    )}
                  </Button>
                  <div className="space-y-2 text-center">
                    <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-1">
                      <ArrowLeft className="w-3 h-3" />
                      Back to Login
                    </Link>
                    <div className="pt-2 border-t border-border/60">
                      <Link
                        to="/"
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Home className="w-4 h-4" />
                        Back to home
                      </Link>
                    </div>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
          </div>
          <footer className="relative z-10 mt-auto w-full max-w-sm py-6 text-center text-xs text-muted-foreground self-center">
            <p className="flex flex-wrap items-center justify-center gap-x-2 gap-y-0">
              <span>© {new Date().getFullYear()} Astarus</span>
              <span aria-hidden>·</span>
              <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
              <span aria-hidden>·</span>
              <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            </p>
          </footer>
        </div>
        <div className="hidden lg:flex lg:w-1/2 flex-shrink-0 relative min-h-[400px] bg-black/20 overflow-hidden">
          <img
            src="/fogotpassword.jpg"
            alt="Forgot password"
            className="absolute inset-0 w-full h-full object-cover object-center img-panel"
            loading="eager"
            fetchpriority="high"
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>
      </div>
    </div>
  );
}

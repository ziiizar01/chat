import { AuthForm } from "@/components/auth/AuthForm";

export default function SignupPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background">
      <AuthForm mode="signup" />
    </div>
  );
}

import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="container mx-auto py-8">
      <AuthForm mode="login" />
    </div>
  );
}

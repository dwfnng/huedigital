import AuthForm from "@/components/auth/AuthForm";

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-8">
      <AuthForm mode="register" />
    </div>
  );
}

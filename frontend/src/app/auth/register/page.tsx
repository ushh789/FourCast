import { AuthCard } from "../../../components/auth/AuthCard"
import { RegisterForm } from "../../../components/auth/RegisterForm"

export default function RegisterRoute() {
  return  <AuthCard
      title="Create Account"
      subtitle="Sign up to get started"
    >
      <RegisterForm />
    </AuthCard>;
}

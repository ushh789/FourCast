import { AuthCard } from "../../../components/auth/AuthCard"
import { LoginForm } from "../../../components/auth/LoginForm"

export default function LoginRoute() {
  return ( 
    <AuthCard
        title="Welcome Back"
        subtitle="Sign in to your account to continue"
      >
        <LoginForm />
    </AuthCard>
  )
}

import { AuthLayout }  from "../components/AuthLayout/AuthLayout";
import { LoginForm } from "../components/Login/LoginForm";

export const LoginPage = () => {
  return (
    <AuthLayout>
      <LoginForm />
    </AuthLayout>
  );
}

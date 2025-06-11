import { AuthLayout } from "../components/Login/AuthLayout"
import { LoginForm } from "../components/Login/LoginForm"

export const LoginPage = () => {
    return (
        <AuthLayout>
            <LoginForm />
        </AuthLayout>
    )
}
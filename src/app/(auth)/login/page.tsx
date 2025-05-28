import LoginForm from '@/components/auth/LoginForm';
import { GRADIENTS } from "@/lib/constant/colors"

export default function LoginPage() {
  return (
    <div className={`min-h-screen flex items-center justify-center ${GRADIENTS.background}`}>
      <LoginForm />
    </div>
  );
} 
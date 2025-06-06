"use client"

import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/lib/firebase/config"
import { Eye, EyeOff, Mail, Lock, LogIn, AlertCircle } from "lucide-react"
import { GRADIENTS } from "@/lib/constant/colors"
import { useDispatch } from 'react-redux'
import { loginSuccess } from '@/lib/store/slices/authSlice' 
import { showLoader, hideLoader } from "@/lib/store/slices/loaderSlice"
import { getAdminByUid, updateAdminInFirestore } from "@/lib/services/adminService"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(hideLoader())
  }, [dispatch])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const firebaseUser = userCredential.user;

      // Dispatch Redux action with user data
      dispatch(loginSuccess({
        user: {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          // Add any other user properties you need
        },
        token: await firebaseUser.getIdToken()
      }));
      dispatch(showLoader("Signing in..."));
      router.push("/dashboard")
      setTimeout(() => dispatch(hideLoader()), 1000);
    } catch (err) {
      setError("Invalid credentials. Please check your email and password.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen flex items-center justify-center p-4`}> 
      <div className="w-full max-w-sm">
        <Card className={`shadow-xl border-0 ${GRADIENTS.card} backdrop-blur-sm w-[350px]`}>
          <CardHeader className="text-center pb-6">
            <div
              className={`inline-flex items-center justify-center w-14 h-14 rounded-full ${GRADIENTS.primary} mx-auto mb-4`}
            >
              <LogIn className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">Sign In</CardTitle>
          </CardHeader>

          <CardContent className="px-6 pb-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="pl-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="pl-10 pr-10 h-11 border-gray-200 focus:border-green-500 focus:ring-green-500 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute cursor-pointer right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={loading}
                className={`w-full h-11 cursor-pointer text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.01] active:scale-[0.99] mt-6 ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : `${GRADIENTS.primary} hover:${GRADIENTS.primaryHover} shadow-lg hover:shadow-xl`
                }`}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2 ">
                    <LogIn className="w-4 h-4" />
                    <span>Sign In</span>
                  </div>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
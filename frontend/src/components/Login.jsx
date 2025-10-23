/* eslint-disable no-unused-vars */
import axios from "axios"
import { Eye, EyeOff, Lock, LogIn, Mail, User } from "lucide-react"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"


// Dummy data and repeated CSS
const INITIAL_FORM = { email: "", password: "" }
const TEST_CREDENTIALS = { email: "tester@gmail.com", password: "tester@123" }

const Login = ({ onSubmit, onSwitchMode }) => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState(INITIAL_FORM)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const url = "https://deployment-testing-eight.vercel.app"

  // Auto-login
  useEffect(() => {
    const token = localStorage.getItem("token")
    const userId = localStorage.getItem("userId")
    if (token) {
      (async () => {
        try {
          const { data } = await axios.get(`${url}/api/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          })
          if (data.success) {
            onSubmit?.({ token, userId, ...data.user })
            toast.success("Session restored. Redirecting...")
            navigate("/")
          } else {
            localStorage.clear()
          }
        } catch {
          localStorage.clear()
        }
      })()
    }
  }, [navigate, onSubmit])

  useEffect(() => {
    console.log("Login form data changed:", formData)
  }, [formData])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!rememberMe) {
      toast.error('You must enable "Remember Me" to login.')
      return
    }

    setLoading(true)
    try {
      const { data } = await axios.post(`${url}/api/user/login`, formData)
      if (!data.token) throw new Error(data.message || "Login failed.")

      localStorage.setItem("token", data.token)
      localStorage.setItem("userId", data.user.id)
      setFormData(INITIAL_FORM)
      onSubmit?.({ token: data.token, userId: data.user.id, ...data.user })
      toast.success("Login successful! Redirecting...")
      setTimeout(() => navigate("/"), 1000)
    } catch (err) {
      const msg = err.response?.data?.message || err.message
      toast.error(msg)
    } finally {
      setLoading(false)
    }
  }

  const handleSwitchMode = () => {
    toast.dismiss()
    onSwitchMode?.()
  }

  const fillTestCredentials = () => {
    setFormData(TEST_CREDENTIALS)
    setRememberMe(true)
    toast.info("Test credentials filled! Click Login to continue.")
  }

  // Field definitions
  const fields = [
    {
      name: "email",
      type: "email",
      placeholder: "Email",
      icon: Mail,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      isPassword: true,
    },
  ]

  return (
    <div className="max-w-md w-full bg-white shadow-xl rounded-2xl border border-gray-100 overflow-hidden">
      <ToastContainer position="top-center" autoClose={3000} hideProgressBar />

      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
            <LogIn className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">Welcome Back</h2>
            <p className="text-blue-100 text-sm">Sign in to your TaskManager account</p>
          </div>
        </div>
      </div>

      <div className="px-8 py-6">
        {/* Test Credentials Section */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl">
          <div className="flex items-center mb-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
              <User className="w-4 h-4 text-blue-600" />
            </div>
            <h3 className="text-sm font-semibold text-blue-800">Test Credentials</h3>
          </div>
          <div className="text-xs text-gray-600 mb-3 space-y-1">
            <p className="flex justify-between">
              <span className="font-medium text-gray-700">Email:</span>
              <span className="font-mono">tester@gmail.com</span>
            </p>
            <p className="flex justify-between">
              <span className="font-medium text-gray-700">Password:</span>
              <span className="font-mono">tester@123</span>
            </p>
          </div>
          <button
            type="button"
            onClick={fillTestCredentials}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md"
          >
            <User className="w-4 h-4 mr-2" />
            Use Test Credentials
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {fields.map(({ name, type, placeholder, icon: Icon, isPassword }) => (
            <div key={name} className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Icon className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
              </div>
              <input
                type={type}
                placeholder={placeholder}
                value={formData[name]}
                onChange={(e) => setFormData({ ...formData, [name]: e.target.value })}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-sm text-gray-700 placeholder-gray-400"
                required
              />
              {isPassword && (
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              )}
            </div>
          ))}

          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <input
                id="rememberMe"
                type="checkbox"
                checked={rememberMe}
                onChange={() => setRememberMe(!rememberMe)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                required
              />
            </div>
            <label htmlFor="rememberMe" className="text-sm text-gray-700 font-medium">
              Remember Me
            </label>
          </div>

          <button 
            type="submit" 
            className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 ${loading ? 'cursor-not-allowed' : ''}`}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Logging in...</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Login</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={handleSwitchMode}
              className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
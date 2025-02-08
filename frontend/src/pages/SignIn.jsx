import React, { useContext, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { User, Lock, AlertCircle } from 'lucide-react'
import { AuthContext } from '../context/AuthContext'

export default function SignIn() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login } = useContext(AuthContext);

  const [isAnimating, setIsAnimating] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'email') {
      setEmail(value)
    } else if (name === 'password') {
      setPassword(value)
    }
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const formData = new FormData()
      formData.append('email', email)
      formData.append('password', password)
      const response = await fetch('https://plugin-5vmd.onrender.com/login', {
        method: 'POST',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed')
      }

      // Store the JWT token
      localStorage.setItem('token', data.token)
      
      // Start animation
      setIsAnimating(true)
      await login()

      // Wait for animation to complete before navigating
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (err) {
      setError(err.message || 'An error occurred during sign in')
      setIsAnimating(false)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-br from-gray-900 to-black flex items-stretch m-0 p-0 overflow-hidden">
      <div className="w-full flex relative">
        {/* Purple diagonal overlay */}
        <motion.div
          className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-r from-purple-700 to-indigo-600 transform -skew-x-12 translate-x-20"
          animate={isAnimating ? { width: '100%', skewX: 0, translateX: 0 } : {}}
          transition={{ duration: 1, ease: 'easeInOut' }}
        />

        {/* Left side - Login form */}
        <motion.div
          className="w-1/2 z-10 flex items-center justify-center px-20"
          initial={{ opacity: 1 }}
          animate={{ opacity: isAnimating ? 0 : 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="w-full max-w-md">
            <h2 className="text-5xl font-bold mb-12 text-white">Login</h2>

            {error && (
              <div className="mb-6 bg-red-500/10 border border-red-500 rounded-lg p-4 flex items-center gap-3 text-red-500">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <div className="relative">
                  <input
                    type="text"
                    id="email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-40 rounded-lg border border-gray-600 text-white px-4 py-3 pl-10 focus:outline-none focus:border-purple-500 text-lg"
                    placeholder="Username"
                    disabled={isLoading}
                  />
                  <User className="absolute left-3 top-3.5 text-gray-400" size={20} />
                </div>
              </div>

              <div>
                <div className="relative">
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    className="w-full bg-gray-800 bg-opacity-40 rounded-lg border border-gray-600 text-white px-4 py-3 pl-10 focus:outline-none focus:border-purple-500 text-lg"
                    placeholder="Password"
                    disabled={isLoading}
                  />
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                </div>
              </div>

              <motion.button
                type="submit"
                className="w-full py-4 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-medium hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 mt-12 disabled:opacity-50 disabled:cursor-not-allowed"
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Login'}
              </motion.button>

              <p className="text-gray-400 text-center text-lg mt-8">
                Don't have an account?{' '}
                <Link to='/signup' className="text-purple-500 hover:text-purple-400 transition-colors">
                  Sign Up
                </Link>
              </p>
            </form>
          </div>
        </motion.div>

        {/* Right side - Welcome message */}
        <motion.div
          className="w-1/2 flex pl-12 items-center justify-center z-10"
          initial={{ opacity: 1 }}
          animate={{ opacity: isAnimating ? 0 : 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="text-white text-center">
            <motion.h2
              className="text-6xl font-bold mb-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              WELCOME BACK!
            </motion.h2>
            <motion.p
              className="text-gray-300 text-xl"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              We're excited to see you again. Let's get you signed in.
            </motion.p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

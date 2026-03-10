import { useEffect, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { loginUser, googleLogin, user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const onSubmit = (data) => {
    loginUser(data.email, data.password);
  };

  const handleGoogleSuccess = (credentialResponse) => {
    googleLogin(credentialResponse.credential);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background font-sans text-gray-900 selection:bg-terracotta selection:text-white p-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl border border-gray-200 shadow-sm w-full max-w-md">
        <h2 className="text-3xl font-serif font-bold mb-8 text-center text-charcoal tracking-tight">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              {...register('email', { required: 'Email is required' })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta transition-shadow text-gray-800"
            />
            {errors.email && <span className="text-red-500 text-sm mt-1">{errors.email.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              {...register('password', { required: 'Password is required' })}
              className="w-full p-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-terracotta focus:border-terracotta transition-shadow text-gray-800"
            />
            {errors.password && <span className="text-red-500 text-sm mt-1">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            className="w-full bg-[#2D2D2D] text-[#F5F5F0] p-3 rounded-lg font-medium transition-all shadow-sm active:scale-95 mt-4"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => console.log('Login Failed')}
              theme="outline"
              size="large"
              shape="rectangular"
              width="100%"
            />
          </div>
        </div>

        <p className="mt-8 text-center text-sm text-gray-600">
          Don't have an account? <Link to="/register" className="text-terracotta hover:underline font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
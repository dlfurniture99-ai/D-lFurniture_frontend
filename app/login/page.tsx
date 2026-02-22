'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { Toaster, toast } from 'sonner';
import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { login as apiLogin } from '@/lib/api';
import { userApi } from '../apis/config';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Three.js 3D Scene Setup with Real Model
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf8fafc);

    const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 2000);
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    camera.position.set(150, 100, 150);
    camera.lookAt(0, 0, 0);

    // Advanced Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // Main directional light (sun)
    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2);
    mainLight.position.set(100, 150, 100);
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.5;
    mainLight.shadow.camera.far = 500;
    mainLight.shadow.camera.left = -200;
    mainLight.shadow.camera.right = 200;
    mainLight.shadow.camera.top = 200;
    mainLight.shadow.camera.bottom = -200;
    scene.add(mainLight);

    // Fill light (warm)
    const fillLight = new THREE.DirectionalLight(0xfbbf24, 0.4);
    fillLight.position.set(-80, 50, -80);
    scene.add(fillLight);

    // Rim light (cool)
    const rimLight = new THREE.DirectionalLight(0x60a5fa, 0.3);
    rimLight.position.set(0, 50, -100);
    scene.add(rimLight);

    // Hemisphere light for natural ambient
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x8b7355, 0.4);
    scene.add(hemiLight);

    // Ground plane with shadow
    const groundGeometry = new THREE.PlaneGeometry(500, 500);
    const groundMaterial = new THREE.ShadowMaterial({ opacity: 0.15 });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = 0;
    ground.receiveShadow = true;
    scene.add(ground);

    // Load 3D Model using OBJLoader
    const loader = new OBJLoader();
    loader.load(
      '/HARROW_EXECUTIVE_DESK.obj',
      (object) => {
        // Scale and position the model
        object.scale.set(1, 1, 1);
        object.position.set(0, -20, 0);

        // Define multiple colors for variety
        const colors = [
          0x8b6f47,  // Brown
          0xd4a574,  // Light Brown
          0xa0826d,  // Medium Brown
          0xc19a6b,  // Khaki
          0x704214,  // Dark Brown
          0xbc8f8f,  // Rosy Brown
        ];

        let colorIndex = 0;

        // Apply material to all meshes in the loaded object
        object.traverse((child: any) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;

            // Apply a nice material with colors
            child.material = new THREE.MeshStandardMaterial({
              color: colors[colorIndex % colors.length],
              metalness: 0.3,
              roughness: 0.5,
              emissive: new THREE.Color(colors[colorIndex % colors.length]),
              emissiveIntensity: 0.1,
            });

            colorIndex++;
          }
        });

        scene.add(object);
        setModelLoading(false);

        // Animation loop
        let animationId: number;
        const animate = () => {
          animationId = requestAnimationFrame(animate);

          // Rotate model for visual effect
          object.rotation.y += 0.003;

          renderer.render(scene, camera);
        };
        animate();

        // Handle resize
        const handleResize = () => {
          if (!canvasRef.current) return;
          const width = canvasRef.current.clientWidth;
          const height = canvasRef.current.clientHeight;

          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        return () => {
          window.removeEventListener('resize', handleResize);
          cancelAnimationFrame(animationId);
          renderer.dispose();
        };
      },
      (progress) => {
        console.log('Loading model...', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        setModelLoading(false);
      }
    );
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.password) {
        toast.error('Please fill in all required fields');
        setLoading(false);
        return;
      }

      if (!formData.email.includes('@')) {
        toast.error('Please enter a valid email');
        setLoading(false);
        return;
      }

      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        setLoading(false);
        return;
      }

      // Call API
      const response = await apiLogin({
        email: formData.email,
        password: formData.password,
      });

      if (response.success) {
        // Store user info (not token - that's in HTTP-only cookie)
        localStorage.setItem('user', JSON.stringify(response.user));
        toast.success('Login successful!');
        // Dispatch custom event for header update
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        
        // Redirect to requested page or home
        setTimeout(() => router.push(redirectPath), 500);
      } else {
        toast.error(response.message || 'Login failed');
      }
    } catch (err: any) {
      const errorMessage = err?.message || (err instanceof Error ? err.message : 'An error occurred. Please try again.');
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      // Send token to backend for verification and user creation/login
      const data = await userApi.post(`auth/google`, { token: credentialResponse.credential });

      if (data.success) {
        // Store user info (not token - that's in HTTP-only cookie)
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Login successful!');
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        setTimeout(() => router.push(redirectPath), 500);
      } else {
        toast.error(data.message || 'Google login failed');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Google login error');
      console.error('Google login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-right" richColors closeButton />
      {/* Animated Blobs Background */}
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - 3D Canvas */}
          <div className="hidden lg:flex items-center justify-center">
            <div className="relative w-full h-screen max-h-[600px]">
              {modelLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm rounded-3xl">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-gray-300 border-t-yellow-500"></div>
                </div>
              )}
              <canvas
                ref={canvasRef}
                className="w-full h-full rounded-3xl shadow-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100"
              />
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="relative">
            <div className="bg-gradient-to-br from-white via-blue-50/20 to-yellow-50/20 rounded-3xl p-8 shadow-2xl border-2 border-yellow-200/50 hover:shadow-3xl transition-all duration-300 backdrop-blur-sm">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-1 font-playfair">Welcome Back</h1>
                <p className="text-sm text-gray-600 font-lora">Sign in to your furniture account</p>
              </div>



              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide font-poppins">
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-purple-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/30 hover:border-yellow-300 transition-all duration-300 text-sm font-poppins shadow-sm hover:shadow-md"
                  />
                </div>

                {/* Password */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide font-poppins">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-red-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/30 hover:border-yellow-300 transition-all duration-300 pr-10 text-sm font-poppins shadow-sm hover:shadow-md"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-600 transition"
                    >
                      {showPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs font-poppins">
                  <label className="flex items-center gap-2.5 text-gray-700 cursor-pointer font-poppins">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="accent-yellow-500 w-3.5 h-3.5"
                    />
                    Remember me
                  </label>
                  <Link href="/forgot-password" className="text-yellow-600 hover:text-yellow-700 font-semibold transition font-poppins">
                    Forgot Password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 text-white font-bold text-sm rounded-xl hover:from-yellow-600 hover:via-yellow-700 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] mt-6 font-poppins border-2 border-yellow-400/50 hover:border-yellow-300"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500 font-medium font-poppins">Or continue with</span>
                </div>
              </div>

              {/* Google Login */}
              <div className="flex justify-center">
                <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_AUTH || ""}>
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => {
                      toast.error('Google login failed');
                    }}
                    theme="outline"
                    size="large"
                    width="100%"
                  />
                </GoogleOAuthProvider>
              </div>

              {/* Register Link */}
              <p className="text-center text-gray-600 text-sm mt-6 font-poppins">
                Don't have an account?{' '}
                <Link href="/register" className="text-yellow-600 hover:text-yellow-700 font-bold transition font-poppins">
                  Register here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

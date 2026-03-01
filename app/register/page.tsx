'use client';

import { FiEye as FaEye, FiEyeOff as FaEyeSlash, FiCheckCircle as FaCheckCircle } from 'react-icons/fi';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

import { Toaster, toast } from 'sonner';
import { GoogleLogin } from '@react-oauth/google';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { register as apiRegister } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [modelLoading, setModelLoading] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

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
        console.error('Error loading model:', error);
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

    if (name === 'password') {
      let strength = 0;
      if (value.length >= 6) strength++;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(Math.min(strength, 5));
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validation
      if (!formData.name || !formData.email || !formData.password || !formData.phone) {
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

      if (formData.password !== formData.confirmPassword) {
        toast.error('Passwords do not match');
        setLoading(false);
        return;
      }

      if (!agreeTerms) {
        toast.error('Please agree to the terms and conditions');
        setLoading(false);
        return;
      }

      // Call API
      try {
        const response = await apiRegister({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          address: formData.address,
        });

        if (response.success) {
          // Store user info (not token - that's in HTTP-only cookie)
          localStorage.setItem('user', JSON.stringify(response.user));
          toast.success('Registration successful!');
          // Dispatch custom event for header update
          window.dispatchEvent(new CustomEvent('authStateChanged'));
          
          // Redirect to home
          setTimeout(() => router.push('/'), 500);
        } else {
          if (response.message) {
            toast.error(response.message);
          }
        }
      } catch (apiErr: any) {
        // Handle API errors (including duplicate email)
        console.log(apiErr);
        const errorMsg = apiErr?.message || 'An error occurred. Please try again.';
        if (errorMsg.includes('Email already registered') || errorMsg.includes('email')) {
          toast.error('This email is already registered. Please use a different email or login.');
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (err: any) {
      console.log(err);
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
      const { userApi } = await import('@/app/apis/config');
      const data = await userApi.post(`auth/google`, { token: credentialResponse.credential });

      if (data.success) {
        // Store user info (not token - that's in HTTP-only cookie)
        localStorage.setItem('user', JSON.stringify(data.user));
        toast.success('Registration successful!');
        window.dispatchEvent(new CustomEvent('authStateChanged'));
        setTimeout(() => router.push('/'), 500);
      } else {
        toast.error(data.message || 'Google registration failed');
      }
    } catch (err: any) {
      toast.error(err?.message || 'Google registration error');
      console.error('Google registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength === 0) return 'bg-gray-300';
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength === 3) return 'bg-yellow-500';
    if (passwordStrength === 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength === 0) return '';
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength === 3) return 'Fair';
    if (passwordStrength === 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      <Toaster position="top-right" richColors closeButton />
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="w-full max-w-7xl relative z-10 mt-0">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - 3D Model Showcase */}
          <div className="hidden lg:block">
            <div className="relative">
              <div className="rounded-3xl p-6 mt-0 border-r border-gray-700">
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1 font-playfair">
                    D&L Furnitech
                  </h2>
                  <p className="text-gray-600 text-sm font-lora italic">Premium Executive Furniture</p>
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse"></div>
                    <span className="text-xs font-medium text-yellow-800">
                      {modelLoading ? 'Loading 3D Model...' : 'Interactive 3D View'}
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-[380px] rounded-2xl bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-100 shadow-inner"
                  />
                  
                  {modelLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-2xl">
                      <div className="text-center">
                        <div className="w-12 h-12 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                        <p className="text-gray-700 font-medium">Loading HARROW Desk...</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Feature Stats */}
                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-3 border border-yellow-200 text-center">
                    <div className="text-lg font-bold text-yellow-900">500+</div>
                    <div className="text-xs text-yellow-700 mt-0.5">Premium Products</div>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3 border border-purple-200 text-center">
                    <div className="text-lg font-bold text-purple-900">50k+</div>
                    <div className="text-xs text-purple-700 mt-0.5">Happy Customers</div>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3 border border-green-200 text-center">
                    <div className="text-lg font-bold text-green-900">4.9★</div>
                    <div className="text-xs text-green-700 mt-0.5">Average Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <div className="relative">
            <div className="bg-gradient-to-br from-white via-blue-50/20 to-yellow-50/20 rounded-3xl p-8 shadow-2xl border-2 border-yellow-200/50 hover:shadow-3xl transition-all duration-300 backdrop-blur-sm">
              {/* Header */}
              <div className="text-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-1 font-playfair">Create Account</h1>
                <p className="text-sm text-gray-600 font-lora">Join our premium furniture community</p>
              </div>



              {/* Registration Form */}
              <form onSubmit={handleRegister} className="space-y-4">
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide font-poppins">
                       Full Name
                     </label>
                     <input
                       type="text"
                       name="name"
                       value={formData.name}
                       onChange={handleChange}
                       placeholder="John Doe"
                       className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/30 hover:border-yellow-300 transition-all duration-300 text-sm font-poppins shadow-sm hover:shadow-md"
                     />
                    </div>
                    <div>
                     <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide font-poppins">
                       Email
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
                </div>

                {/* Phone & Address Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide font-poppins">
                      Phone
                    </label>
                    <input
                       type="tel"
                       name="phone"
                       value={formData.phone}
                       onChange={handleChange}
                       placeholder="+91 98765 43210"
                       className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-green-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/30 hover:border-yellow-300 transition-all duration-300 text-sm font-poppins shadow-sm hover:shadow-md"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide font-poppins">
                      Address (Optional)
                    </label>
                    <input
                       type="text"
                       name="address"
                       value={formData.address}
                       onChange={handleChange}
                       placeholder="City, State"
                       className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-pink-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/30 hover:border-yellow-300 transition-all duration-300 text-sm font-poppins shadow-sm hover:shadow-md"
                    />
                  </div>
                </div>

                {/* Password & Confirm Password Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                    {formData.password && (
                      <div className="mt-1 flex items-center gap-1.5">
                        <div className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full ${getPasswordStrengthColor()} transition-all duration-300`} style={{width: `${(passwordStrength / 5) * 100}%`}}></div>
                        </div>
                        <span className="text-xs font-medium text-gray-600">{getPasswordStrengthText()}</span>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1.5 uppercase tracking-wide font-poppins">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-gray-50 to-blue-50 border-2 border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/30 hover:border-yellow-300 transition-all duration-300 pr-10 text-sm font-poppins shadow-sm hover:shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-yellow-600 transition"
                      >
                        {showConfirmPassword ? <FaEyeSlash className="w-3.5 h-3.5" /> : <FaEye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    {formData.confirmPassword && formData.password === formData.confirmPassword && (
                      <div className="mt-1 flex items-center gap-1.5 text-green-600 text-xs font-medium">
                        <FaCheckCircle className="w-3 h-3" />
                        Passwords match
                      </div>
                    )}
                  </div>
                </div>

                {/* Terms */}
                <label className="flex items-start gap-2.5 text-xs text-gray-700 cursor-pointer p-2.5 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition font-poppins">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="mt-0.5 accent-yellow-500 w-3.5 h-3.5"
                  />
                  <span>
                    I agree to the{' '}
                    <Link href="/terms" className="text-yellow-600 hover:text-yellow-700 font-semibold font-poppins">
                      Terms & Conditions
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="text-yellow-600 hover:text-yellow-700 font-semibold font-poppins">
                      Privacy Policy
                    </Link>
                  </span>
                </label>

                {/* Register Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-yellow-500 via-yellow-600 to-orange-500 text-white font-bold text-sm rounded-xl hover:from-yellow-600 hover:via-yellow-700 hover:to-orange-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] font-poppins border-2 border-yellow-400/50 hover:border-yellow-300"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Creating Account...
                    </span>
                  ) : (
                    'Create Account'
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

              {/* Google Register */}
              <div className="flex justify-center">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => {
                    toast.error('Google registration failed');
                  }}
                  theme="outline"
                  size="large"
                  width="100%"
                />
              </div>

              {/* Login Link */}
              <p className="text-center text-gray-600 text-sm mt-6 font-poppins">
                Already have an account?{' '}
                <Link href="/login" className="text-yellow-600 hover:text-yellow-700 font-bold transition font-poppins">
                  Login here
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
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes glow {
          0%, 100% { box-shadow: 0 0 5px rgba(234, 179, 8, 0.5); }
          50% { box-shadow: 0 0 20px rgba(234, 179, 8, 0.8); }
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
        input:focus {
          animation: glow 2s infinite;
        }
      `}</style>
    </div>
  );
}
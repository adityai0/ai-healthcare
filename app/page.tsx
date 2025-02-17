"use client";

import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import {
  User,
  ChevronDown,
  Bot,
  Eye,
  FileText,
  Shield,
  Zap,
  Activity,
} from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, googleSignIn, logOut } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      <header className="border-b border-gray-800 py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-500">VitaeAI</h1>
          <nav>
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="flex items-center space-x-2 bg-gray-800 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <Image
                    src={user.photoURL || "https://via.placeholder.com/40"}
                    alt={user.displayName || "User"}
                    className="w-8 h-8 rounded-full"
                    width={40}
                    height={40}
                  />
                  <span>{user.displayName}</span>
                  <ChevronDown size={20} />
                </button>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1">
                    <button
                      onClick={handleSignOut}
                      className="block px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 w-full text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={handleSignIn}
                className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Sign In
              </button>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        <section className="py-20 text-center">
          <div className="container mx-auto px-4">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-teal-400 bg-clip-text text-transparent">
              Revolutionizing Healthcare with AI
            </h2>
            <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
              Empower your healthcare practice with cutting-edge AI technology
              for improved diagnostics, patient care, and operational
              efficiency.
            </p>
            <button
              onClick={user ? () => router.push("/chat") : handleSignIn}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {user ? "Go to Dashboard" : "Get Started"}
            </button>
          </div>
        </section>

        <section className="py-16 bg-gray-800">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-semibold mb-8 text-center">
              Our AI-Powered Features
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <Bot className="text-blue-500 w-12 h-12 mb-4" />
                <h4 className="text-xl font-semibold mb-2">AI Assistant</h4>
                <p className="text-gray-300">
                  24/7 intelligent support for patients and healthcare
                  providers, offering instant medical information and guidance.
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <Eye className="text-green-500 w-12 h-12 mb-4" />
                <h4 className="text-xl font-semibold mb-2">Vision AI</h4>
                <p className="text-gray-300">
                  Advanced image analysis for faster and more accurate diagnoses
                  in radiology, dermatology, and more.
                </p>
              </div>
              <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
                <FileText className="text-yellow-500 w-12 h-12 mb-4" />
                <h4 className="text-xl font-semibold mb-2">Document Scan</h4>
                <p className="text-gray-300">
                  Effortlessly digitize and analyze medical records,
                  prescriptions, and clinical notes with our intelligent
                  scanning technology.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-4">
            <h3 className="text-3xl font-semibold mb-8 text-center">
              Why Choose VitaeAI?
            </h3>
            <div className="grid md:grid-cols-2 gap-8">
              <div className="flex items-start space-x-4">
                <Shield className="text-blue-500 w-8 h-8 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">
                    HIPAA Compliant
                  </h4>
                  <p className="text-gray-400">
                    Your data is protected with state-of-the-art security
                    measures, ensuring full compliance with healthcare
                    regulations.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Zap className="text-yellow-500 w-8 h-8 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">Lightning Fast</h4>
                  <p className="text-gray-400">
                    Get instant results and insights, allowing you to make
                    quick, informed decisions for better patient care.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <Activity className="text-green-500 w-8 h-8 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">
                    Improved Outcomes
                  </h4>
                  <p className="text-gray-400">
                    Our AI-driven insights lead to better diagnoses,
                    personalized treatment plans, and improved patient outcomes.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <User className="text-purple-500 w-8 h-8 mt-1" />
                <div>
                  <h4 className="text-xl font-semibold mb-2">User-Friendly</h4>
                  <p className="text-gray-400">
                    Intuitive interface designed for healthcare professionals,
                    ensuring a smooth integration into your existing workflow.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {user && (
          <section className="py-16 bg-gray-800">
            <div className="container mx-auto px-4 text-center">
              <h3 className="text-3xl font-semibold mb-4">
                Welcome back, {user.displayName}!
              </h3>
              <p className="text-xl text-gray-300 mb-8">
                Ready to revolutionize your healthcare practice? Explore your
                personalized dashboard and start using our AI-powered tools
                today.
              </p>
              <button
                onClick={() => router.push("/chat")}
                className="bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                Go to Dashboard
              </button>
            </div>
          </section>
        )}
      </main>

      <footer className="border-t border-gray-800 py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 mb-4 md:mb-0">
              &copy; 2024 VitaeAI. All rights reserved.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-gray-500 hover:text-blue-500 transition duration-300"
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-500 transition duration-300"
              >
                Terms of Service
              </a>
              <a
                href="#"
                className="text-gray-500 hover:text-blue-500 transition duration-300"
              >
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

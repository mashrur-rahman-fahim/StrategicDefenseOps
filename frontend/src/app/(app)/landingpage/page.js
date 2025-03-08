"use client";

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import axios from "@/lib/axios";

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-900 min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center bg-[url('/military-bg.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="relative z-10 max-w-3xl p-6"
        >
          <h1 className="text-5xl font-bold text-white">Elite Forces Training</h1>
          <p className="mt-4 text-lg text-gray-200">
            Preparing the next generation of warriors with cutting-edge military training.
          </p>
          <Button className="mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl shadow-lg">
            Enroll Now
          </Button>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-lightblue-100 text-center">
        <h2 className="text-4xl font-bold text-gray-900">Why Choose Us?</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-600">Advanced Tactics</h3>
            <p className="mt-2 text-gray-600">Learn from top-tier military experts.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-600">Real Combat Drills</h3>
            <p className="mt-2 text-gray-600">Simulated operations for real-world readiness.</p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold text-blue-600">Elite Certification</h3>
            <p className="mt-2 text-gray-600">Recognized training to boost your career.</p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-blue-500 text-white text-center">
        <h2 className="text-4xl font-bold">Ready to Join?</h2>
        <p className="mt-4 text-lg">Sign up today and become part of the elite.</p>
        <Button className="mt-6 bg-white text-blue-500 px-6 py-3 rounded-xl shadow-lg hover:bg-gray-200">
          Get Started
        </Button>
      </section>
    </div>
  );
}
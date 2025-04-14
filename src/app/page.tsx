"use client";

import { Button } from "../components/button";
import Link from "next/link";
import { CheckCircle, ArrowRight, GraduationCap, Heart } from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* Navbar */}
      <nav className="bg-white border-b w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-between items-center h-16 py-4">
            <div className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-blue-700" />
              <span className="text-xl font-bold text-gray-800">
                Swarn Foundation
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/sign-in">
                <Button
                  variant="ghost"
                  className="relative group px-5 py-2 text-sm font-medium text-gray-700 border border-transparent"
                >
                  Sign In
                  <span className="absolute bottom-0 left-1/2 w-0 group-hover:w-full h-0.5 bg-blue-600 transition-all duration-400 transform -translate-x-1/2 rounded-full"></span>
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-blue-50 to-white w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-22">
            <div className="text-center">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                Empowering Dreams Through Education
              </h1>
              <p className="mt-6 text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
                Every child deserves access to quality education. Be a part of a
                mission that nurtures potential and builds a brighter future.
              </p>
              <div className="mt-10">
                <Link href="/sign-up">
                  <Button className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-lg">
                    Make a Difference
                    <Heart className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="bg-white py-10 border-t border-b">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 text-center">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-blue-50 shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <div className="text-4xl font-bold text-blue-700">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-gray-700 text-lg">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="bg-gray-50 py-24 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900">
                How We Make a Difference
              </h2>
              <p className="mt-4 text-lg text-gray-600">
                Each contribution creates lasting educational impact.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition duration-300"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <CheckCircle className="h-6 w-6 text-blue-600" />
                    <h3 className="text-xl font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-blue-600 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white">
                Ready to Change Lives?
              </h2>
              <p className="mt-4 text-lg text-blue-100">
                A single action today can impact generations.
              </p>
              <div className="mt-8">
                <Link href="/sign-up">
                  <Button className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 bg-white text-blue-700 hover:bg-blue-100 rounded-full shadow-md">
                    Make a Difference
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center">
              <GraduationCap className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-lg font-semibold text-gray-800">
                Swarn Foundation
              </span>
            </div>
            <p className="text-gray-500 text-sm md:text-base text-center">
              © 2025 Swarn Foundation. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}

const features = [
  {
    title: "Education Support",
    description:
      "We cover tuition, books, uniforms, and more to ensure no child is left behind.",
  },
  {
    title: "Mentorship Program",
    description:
      "Dedicated mentors guide students through academic and personal growth.",
  },
  {
    title: "Progress Tracking",
    description:
      "We monitor and report every milestone so donors see real-world impact.",
  },
];

const stats = [
  { value: "1000+", label: "Students Supported" },
  { value: "50+", label: "Partner Schools" },
  { value: "95%", label: "Success Rate" },
];

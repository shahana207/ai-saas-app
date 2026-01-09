import React from "react";
import { assets } from "../assets/assets";

export default function Footer() {
  return (
    <footer className="w-full bg-white text-gray-500">
      <div className="max-w-7xl mx-auto px-6 md:px-16 lg:px-24 xl:px-32 pt-10">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row justify-between gap-10 border-b border-gray-500/30 pb-8">

          {/* Logo & Description */}
          <div className="md:max-w-96">
            <img
              src={assets.logo}
              alt="logo"
              className="h-9"
            />

            <p className="mt-6 text-sm leading-relaxed">
              Build, manage, and scale your AI-powered applications with ease.
              Our platform helps you automate workflows and grow faster.
            </p>
          </div>

          {/* Links + Newsletter */}
          <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-12">

            {/* Company */}
            <div>
              <h2 className="font-semibold mb-5 text-gray-800">Company</h2>
              <ul className="text-sm space-y-2">
                <li><a href="/" className="hover:text-gray-900">Home</a></li>
                <li><a href="/about" className="hover:text-gray-900">About Us</a></li>
                <li><a href="/contact" className="hover:text-gray-900">Contact Us</a></li>
                <li><a href="/privacy" className="hover:text-gray-900">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h2 className="font-semibold text-gray-800 mb-5">
                Subscribe to our newsletter
              </h2>

              <p className="text-sm max-w-sm">
                Weekly updates, AI tips, and product announcements.
              </p>

              <div className="flex flex-col sm:flex-row gap-2 pt-4">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="border border-gray-500/30 focus:ring-2 focus:ring-indigo-600 outline-none w-full max-w-64 h-9 rounded px-3"
                />
                <button
                  onClick={() => window.location.href = "/sign-in"}
                  className="bg-blue-600 hover:bg-blue-700 transition w-28 h-9 text-white rounded-md font-medium"
                >
                  Login
                </button>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom */}
        <p className="pt-6 text-center text-xs md:text-sm pb-6">
          © 2026 <span className="font-medium">QuickAi</span>. All rights reserved.
        </p>

      </div>
    </footer>
  );
}

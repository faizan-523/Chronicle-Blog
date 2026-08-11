import Link from "next/link";
import { Feather, Github, Twitter, Linkedin } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-50 border-t border-gray-100 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2 text-violet-600 font-bold text-xl tracking-tight">
              <Feather className="w-6 h-6 text-violet-600" />
              <span>Chronicle</span>
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Sharing thoughts, tutorials, and insights on Technology, Design, and modern Lifestyle practices.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Github className="w-5 h-5" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-violet-600 transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/" className="text-gray-500 hover:text-violet-600 text-sm transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-gray-500 hover:text-violet-600 text-sm transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-500 hover:text-violet-600 text-sm transition-colors">
                  About
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Categories</h4>
            <ul className="space-y-3">
              <li>
                <Link href="/category/technology" className="text-gray-500 hover:text-violet-600 text-sm transition-colors">
                  Technology
                </Link>
              </li>
              <li>
                <Link href="/category/design" className="text-gray-500 hover:text-violet-600 text-sm transition-colors">
                  Design
                </Link>
              </li>
              <li>
                <Link href="/category/lifestyle" className="text-gray-500 hover:text-violet-600 text-sm transition-colors">
                  Lifestyle
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">Stay Updated</h4>
            <p className="text-gray-500 text-sm leading-relaxed mb-4">
              Subscribe to our newsletter to receive the latest articles directly in your inbox.
            </p>
            <div className="flex space-x-2">
              <input
                type="email"
                placeholder="Your email address"
                required
                className="flex-1 min-w-0 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-600 bg-white"
              />
              <button
                type="button"
                className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white text-sm font-semibold rounded-xl shadow-sm transition-colors"
              >
                Join
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200/50 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400">
          <p>© {currentYear} Chronicle. All rights reserved.</p>
          <div className="mt-2 md:mt-0 flex space-x-6">
            <span className="hover:text-gray-600 cursor-pointer">Privacy Policy</span>
            <span className="hover:text-gray-600 cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

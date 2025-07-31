import { Heart, Github, Twitter } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Heart className="h-8 w-8 text-purple-400" />
              <span className="text-xl font-bold">Web3Donate</span>
            </div>
            <p className="text-gray-400 mb-4 max-w-md">
              Empowering transparent and decentralized charitable giving through blockchain technology.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link href="/donations" className="block text-gray-400 hover:text-white transition-colors">
                Browse Campaigns
              </Link>
              <Link href="/create-donation" className="block text-gray-400 hover:text-white transition-colors">
                Create Campaign
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                How it Works
              </Link>
            </div>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Help Center
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Contact Us
              </Link>
              <Link href="#" className="block text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} Web3Donate. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

'use client'
import Link from "next/link"
import { Facebook, Instagram, Twitter } from "lucide-react"

const page = () => {
  return (
    <footer className="w-full border-t bg-white bg-white/30 backdrop-blur-md  border border-white/40 shadow-md">
      <div className=" px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="text-lg font-semibold">FreshMart</h3>
            <p className="mt-2 text-sm text-gray-500">
              Your one-stop shop for fresh groceries delivered to your doorstep.
            </p>
            <div className="mt-4 flex space-x-4">
              <Link href="#" className="text-gray-500 hover:text-green-600">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-600">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-500 hover:text-green-600">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Shop</h3>
            <nav className="mt-4 flex flex-col space-y-2">
              <Link href="/products" className="text-sm text-gray-500 hover:text-green-600">
                All Products
              </Link>
              <Link href="/category/1" className="text-sm text-gray-500 hover:text-green-600">
                Fruits & Vegetables
              </Link>
              <Link href="/category/2" className="text-sm text-gray-500 hover:text-green-600">
                Meat & Seafood
              </Link>
              <Link href="/category/3" className="text-sm text-gray-500 hover:text-green-600">
                Dairy & Eggs
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Account</h3>
            <nav className="mt-4 flex flex-col space-y-2">
              <Link href="/login" className="text-sm text-gray-500 hover:text-green-600">
                Sign In
              </Link>
              <Link href="/signup" className="text-sm text-gray-500 hover:text-green-600">
                Create Account
              </Link>
              <Link href="/profile" className="text-sm text-gray-500 hover:text-green-600">
                My Profile
              </Link>
              <Link href="/orders" className="text-sm text-gray-500 hover:text-green-600">
                Order History
              </Link>
            </nav>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Help</h3>
            <nav className="mt-4 flex flex-col space-y-2">
              <Link href="/faq" className="text-sm text-gray-500 hover:text-green-600">
                FAQ
              </Link>
              <Link href="/shipping" className="text-sm text-gray-500 hover:text-green-600">
                Shipping Information
              </Link>
              <Link href="/returns" className="text-sm text-gray-500 hover:text-green-600">
                Returns Policy
              </Link>
              <Link href="/contact" className="text-sm text-gray-500 hover:text-green-600">
                Contact Us
              </Link>
            </nav>
          </div>
        </div>
        <div className="mt-12 border-t pt-6">
          <p className="text-center text-xs text-gray-500">
            © {new Date().getFullYear()} FreshMart. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default page;

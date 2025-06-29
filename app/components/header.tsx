"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from 'next/image' 
import { Search, Menu, X, LogOut, ChevronDown } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useMobile } from "@/hooks/use-mobile"
import { CartButton } from "@/app/components/cart-button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { auth } from '@/firebaseConfig'
import { onAuthStateChanged, signOut as firebaseSignOut } from "firebase/auth"
import { Category } from "@/types"
import { fetchCategories } from "@/lib/firebase/cartegory"
import { Loader2 } from "lucide-react"

export default function Header() {
  const isMobile = useMobile()
  const router = useRouter()
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false) // New state for dropdown
 
  
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser({
          firstName: firebaseUser.displayName?.split(" ")[0] || "User",
          lastName: firebaseUser.displayName?.split(" ")[1] || "",
          email: firebaseUser.email,
          photoURL: firebaseUser.photoURL,
         
        })
        
        setIsLoggedIn(true)
      } else {
        setUser(null)
        setIsLoggedIn(false)
      }
    })

    const loadCategories = async () => {
      try {
        setLoadingCategories(true)
        const fetchedCategories = await fetchCategories()
        setCategories(fetchedCategories)
        setError(null)
      } catch (err) {
        console.error("Failed to load categories:", err)
        setError("Failed to load categories")
        setCategories([])
      } finally {
        setLoadingCategories(false)
      }
    }

    loadCategories()

    return () => unsubscribe()
  }, [])

 
 

  const handleSignOut = async () => {
    await firebaseSignOut(auth)
    setUser(null)
    setIsLoggedIn(false)
    router.push("/login")
  }

  

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white bg-white/30 backdrop-blur-md border border-white/40 shadow-md">
      <div className="flex h-16 items-center px-4">
        <Sheet>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="mr-2">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px] sm:w-[400px] bg-white bg-white/30 backdrop-blur-md border border-white/40 shadow-md">
            <nav className="flex flex-col gap-4 mt-8 p-3 text-white">
              <Link href="/" className="text-lg font-medium">
                Home
              </Link>
              <Link href="/products" className="text-lg font-medium">
                All Products
              </Link>
              
              {/* Mobile Categories Dropdown */}
              <div className="flex flex-col gap-2">
                <button 
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="text-lg font-medium flex items-center justify-between"
                >
                  Categories
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isCategoriesOpen && (
                  <div className="pl-4 flex flex-col gap-2">
                    {loadingCategories ? (
                      <div className="flex items-center">
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        <span>Loading...</span>
                      </div>
                    ) : error ? (
                      <div className="text-red-400 text-sm">{error}</div>
                    ) : (
                      categories.map((category) => (
                        <Link 
                          key={category.id} 
                          href={`/category/${category.id}`}
                          className="text-lg font-medium hover:text-green-400 flex items-center gap-2"
                        >
                          {category.image && (
                            <Image 
                              src={category.image} 
                              alt="" 
                              className="w-6 h-6 object-cover rounded"
                            />
                          )}
                          {category.name}
                        </Link>
                      ))
                    )}
                  </div>
                )}
              </div>
            </nav>
          </SheetContent>
        </Sheet>

        <Link href="/" className="mr-6 flex items-center">
          <Image src='/WhatsApp_Image_2025-06-11_at_21.52.10_d4ac8615-removebg-preview.png' alt="" width={60} height={60}/>
        </Link>

        <nav className="hidden lg:flex items-center gap-6 text-sm">
          <Link href="/" className="font-medium transition-colors hover:text-green-600">
            Home
          </Link>
          <Link href="/products" className="font-medium transition-colors hover:text-green-600">
            All Products
          </Link>
          
          {/* Desktop Categories Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
              className="font-medium transition-colors hover:text-green-600 flex items-center gap-1"
            >
              Categories
              <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isCategoriesOpen && (
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 border border-gray-200">
                {loadingCategories ? (
                  <div className="p-2 flex items-center">
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    <span>Loading...</span>
                  </div>
                ) : error ? (
                  <div className="p-2 text-red-500 text-sm">{error}</div>
                ) : (
                  <div className="py-1 max-h-[400px] overflow-y-auto">
                    {categories.map((category) => (
                      <Link 
                        key={category.id} 
                        href={`/category/${category.id}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-green-600 flex items-center gap-2"
                      >
                        {category.image && (
                          <img 
                            src={category.image} 
                            alt="" 
                            className="w-6 h-6 object-cover rounded"
                          />
                        )}
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          {isSearchOpen && !isMobile ? (
            <div className="relative flex items-center">
              <Input type="search" placeholder="Search products..." className="w-[200px] md:w-[300px]" autoFocus />
              <Button variant="ghost" size="icon" className="absolute right-0" onClick={() => setIsSearchOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <Button variant="ghost" size="icon" onClick={() => setIsSearchOpen(true)}>
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </Button>
          )}

          <CartButton />

          {isLoggedIn && user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="p-0 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ""} alt={user.firstName || "User"} />
                    <AvatarFallback>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <span className="sr-only">User menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user.photoURL || ""} alt={user.firstName || "User"} />
                    <AvatarFallback>
                      {user.firstName?.[0]}
                      {user.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="w-[100px] truncate text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/orders">Order History</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/login">
              <Button variant="outline" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
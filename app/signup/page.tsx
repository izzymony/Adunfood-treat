"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
// import { signOut } from "@/lib/auth"
// Define the User type locally since it is not exported from "@/lib/auth"
type User = {
  firstName: string
  lastName: string
  email: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

// Dummy updateProfile function for demonstration; replace with your actual API call
async function updateProfile(user: User): Promise<{ success: boolean; error?: string }> {
  try {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000))
    // Optionally, update localStorage or make a real API request here
    if (typeof window !== "undefined") {
      localStorage.setItem("user", JSON.stringify(user))
    }
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update profile" }
  }
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    // Check if user is authenticated
    const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
    if (!storedUser) {
      router.push("/login")
      return
    }

    // TODO: Replace this with the correct logic to fetch the current user
    // Example: fetch from API or localStorage
    const fetchUser = async () => {
      // Replace this with your actual user fetching logic
      const storedUser = typeof window !== "undefined" ? localStorage.getItem("user") : null
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    }
    fetchUser()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return
    const { name, value } = e.target
    setUser((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      const result = await updateProfile(user)

      if (result.success) {
        setSuccess("Profile updated successfully!")
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError(result.error || "Failed to update profile")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    // TODO: Implement sign out logic here
    // For now, just clear user from localStorage and redirect
    if (typeof window !== "undefined") {
      localStorage.removeItem("user")
    }
    router.push("/")
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container flex items-center justify-center min-h-[calc(100vh-8rem)] py-12">
        <Card className="mx-auto max-w-sm">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>Please sign in to view your profile.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="container py-12">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3 lg:w-1/4">
          <Card>
            <CardHeader>
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg?height=96&width=96" alt={`${user.firstName} ${user.lastName}`} />
                  <AvatarFallback>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <CardTitle>{`${user.firstName} ${user.lastName}`}</CardTitle>
                  <CardDescription>{user.email}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <nav className="flex flex-col space-y-1">
                <Button variant="ghost" className="justify-start">
                  Profile Information
                </Button>
                <Button variant="ghost" className="justify-start">
                  Order History
                </Button>
                <Button variant="ghost" className="justify-start">
                  Saved Addresses
                </Button>
                <Button variant="ghost" className="justify-start">
                  Payment Methods
                </Button>
                <Button
                  variant="ghost"
                  className="justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  Sign Out
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>
        <div className="md:w-2/3 lg:w-3/4">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>Update your personal information</CardDescription>
            </CardHeader>
            <CardContent>
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50">
                  <AlertDescription className="text-green-800">{success}</AlertDescription>
                </Alert>
              )}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      value={user.firstName || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      value={user.lastName || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={user.email || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={user.phone || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={user.address || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input id="city" name="city" value={user.city || ""} onChange={handleChange} disabled={isSaving} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={user.state || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">ZIP Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={user.zipCode || ""}
                      onChange={handleChange}
                      disabled={isSaving}
                    />
                  </div>
                </div>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

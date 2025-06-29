"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { auth } from "@/firebaseConfig"
import { onAuthStateChanged, updateProfile, signOut as firebaseSignOut } from "firebase/auth"

type UserProfile = {
  firstName: string
  lastName: string
  email: string
  photoURL?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipCode?: string
}

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [success, setSuccess] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const [firstName = "User", lastName = ""] = (firebaseUser.displayName || "User").split(" ")
        setUser({
          firstName,
          lastName,
          email: firebaseUser.email || "",
          photoURL: firebaseUser.photoURL || "",
        })
        setIsLoading(false)
      } else {
        setUser(null)
        setIsLoading(false)
        router.push("/login")
      }
    })
    return () => unsubscribe()
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user) return
    const { name, value } = e.target
    setUser((prev) => prev ? { ...prev, [name]: value } : null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setIsSaving(true)
    setError("")
    setSuccess("")

    try {
      // Only update displayName and photoURL in Firebase Auth
      await updateProfile(auth.currentUser!, {
        displayName: `${user.firstName} ${user.lastName}`,
        photoURL: user.photoURL || undefined,
      })
      setSuccess("Profile updated successfully!")
      setTimeout(() => setSuccess(""), 3000)
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleSignOut = async () => {
    await firebaseSignOut(auth)
    router.push("/login")
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
  <AvatarImage 
    src={user.photoURL || "/placeholder.svg"} 
    alt={`${user.firstName} ${user.lastName}`.trim() || "User"} 
  />
  <AvatarFallback>
    {(user.firstName?.[0] || 'U').toUpperCase()}
    {(user.lastName?.[0] || '').toUpperCase()}
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
                      disabled
                    />
                  </div>
                  {/* Optional fields for phone, address, etc. */}
                  <div className="space-y-2">
                    <Label htmlFor="photoURL">Profile Photo URL</Label>
                    <Input
                      id="photoURL"
                      name="photoURL"
                      value={user.photoURL || ""}
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
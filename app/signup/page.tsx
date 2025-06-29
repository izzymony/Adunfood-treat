'use client'
import React, {useState} from 'react'
import Link from 'next/link'
import {useRouter} from 'next/navigation'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Card, CardContent, CardDescription, CardAction, CardHeader, CardTitle} from '@/components/ui/card'
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Label } from '@/components/ui/label'
import {auth, googleProvider} from '@/firebaseConfig'
import { createUserWithEmailAndPassword } from 'firebase/auth'
const page = () => {

  const [isLoading, setLoading] = useState (false)
  const [error, setError] = useState("")
  const router = useRouter()

  async function handleSubmit(event:React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true);
    setError("")

    const formData = new FormData(event.currentTarget)
    const name = formData.get("name" ) as string
      const email = formData.get("email") as string
    const password = formData.get("password") as string

    try{
      await createUserWithEmailAndPassword(auth, email, password)

      router.push("/Home")
      router.refresh()

    }catch(err: any){
      setError(err.message || 'Invalid credentials')
    } finally{
      setLoading(false)
    }

  }

  return (
    <div>
        <div className="flex items-center justify-center min-h-[calc(100vh-8rem)] px-4 py-8 sm:py-12">
  <Card className="w-full max-w-md mx-auto">
    <CardHeader className="space-y-1">
      <CardTitle className="text-2xl font-bold">Sign in</CardTitle>
      <CardDescription>Enter your email and password to access your account</CardDescription>
    </CardHeader>
    <CardContent>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input 
            id="name" 
            name="name" 
            type="name" 
            placeholder="John Doe" 
            required 
            disabled={isLoading} 
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            placeholder="m@example.com" 
            required 
            disabled={isLoading} 
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link href="/forgot-password" className="text-sm text-green-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          <Input 
            id="password" 
            name="password" 
            type="password" 
            required 
            disabled={isLoading} 
            className="w-full"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full bg-green-600 hover:bg-green-700" 
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Signing in...
            </>
          ) : (
            "Sign In"
          )}
        </Button>
        
      </form>
    </CardContent>
  </Card>
</div>
    </div>
  )
}

export default page

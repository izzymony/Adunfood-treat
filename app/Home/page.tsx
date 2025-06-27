'use client'
import React from 'react'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ProductCard } from "@/app/components/product-card"
import { Loader2 } from 'lucide-react'
import { fetchProducts } from "@/lib/firebase/products"
import { useEffect, useState } from "react"
import { fetchCategories } from "@/lib/firebase/cartegory"
import { AnimatedHeader } from '../components/AnimatedHeader' 
import Image from 'next/image'

const heroImages = [
  '/73f9dbd5e2cab4e598b19a8b63d386a8.jpg',
  '/4467f46691bf41143404de960757ddbd.jpg',
  '/efceeb75bd1ccac0385f3dafc32600d3.jpg',

]
const page = () => {
 const [products, setProducts] = useState<any[]>([])
   const [loading, setLoading] = useState(true)
    const [catLoading, setCatLoading] = useState(true)
    const [categories, setCategories] = useState<any[]>([])
      useEffect(() =>{
          fetchProducts().then(data =>{
               setProducts(data)
               setLoading(false)
          })     
 
          fetchCategories().then(data => {
       setCategories(data)
       setCatLoading(false)
     })
      },[]) 
   return (
     <div className="flex flex-col min-h-screen">
       {/* Hero Section */}
        <section 
  className="w-full py-12 md:py-24 lg:py-32 relative overflow-hidden"
  /* style={{
    backgroundImage: "url('/4467f46691bf41143404de960757ddbd.jpg')",
    backgroundRepeat: 'no-repeat',
    backgroundSize: '100vw, 20vh',
    backgroundPosition: 'left'
  }} */
>

  <AnimatedHeader images={heroImages} interval={6000} />

  {/* <div
  className="absolute inset-0 bg-cover bg-center
    bg-[url('/4467f46691bf41143404de960757ddbd.jpg')]
    bg-no-repeat
    bg-[length:50%_auto]
    lg:bg-[length:60%_auto]
    xl:bg-[length:40%_auto]
    bg-[position:center_top]"
>
</div> */}
  {/* Background overlay */}
 
  
  {/* White smoke effect at bottom */}
 {/* <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t mt-4 from-white via-white/40 to-transparent backdrop-blur-[1px]"></div>  */}

  <div className="container px-4 md:px-6 relative z-10">
    <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center">
      <div className="space-y-4">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-gray-900">
          Fresh Food Delivered to Your Door
        </h1>
        <p className="text-white font-bold md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
          Shop for fresh, high-quality groceries from the comfort of your home. We deliver to your doorstep.
        </p>
        <div className="flex flex-col gap-2 min-[400px]:flex-row">
          <Link href="/products">
            <Button size="lg" className="bg-[#ec8403] hover:bg-[#d97800] border-4 border-[#7d460e]">
              Shop Now
            </Button>
          </Link>
          <Link href="/signup">
            <Button size="lg" variant="outline" className="bg-white/90 hover:bg-white">
              Create Account
            </Button>
          </Link>
        </div>
      </div>
    </div>
  </div>
</section>
 
       {/* Categories Section */}
       <section className="w-full py-12 md:py-24 lg:py-32">
         <div className=" px-4 md:px-6">
           <div className="flex flex-col items-center justify-center space-y-4 text-center">
             <div className="space-y-2">
               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Shop by Category</h2>
               <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                 Explore our wide range of fresh and delicious food categories.
               </p>
             </div>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-8">
           {catLoading ? (
             <div className="col-span-4 flex justify-center items-center py-12">
               <Loader2 className="h-12 w-12 animate-spin text-green-600" />
             </div>
           ) : (
             categories.map((category) => (
               <Link key={category.id} href={`/category/${category.id}`}>
                 <div className="group relative overflow-hidden rounded-lg shadow-lg transition-all hover:shadow-xl">
                   <div className="aspect-square w-full overflow-hidden">
                     <Image
                       src={category.image || "/placeholder.svg"}
                       alt={category.name}
                       width={300}
                       height={200}
                       className="h-full w-full object-cover transition-transform group-hover:scale-105"
                     />
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                   <div className="absolute bottom-0 w-full p-4">
                     <p className="text-[16px] font-semibold text-white  lg:text-[20px]">{category.name}</p>
                   </div>
                 </div>
               </Link>
             ))
           )}
           </div>
         </div>
       </section>
 
       {/* Featured Products */}
       <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
         <div className=" px-4 md:px-6">
           <div className="flex flex-col items-center justify-center space-y-4 text-center">
             <div className="space-y-2">
               <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Featured Products</h2>
               <p className="text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                 Discover our most popular items this week.
               </p>
             </div>
           </div>
           <div className=" w-full  grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-3   gap-6 mt-8">
       {loading ? (
         <div className="col-span-3 flex justify-center items-center py-12">
           <Loader2 className="h-12 w-12 animate-spin text-green-600" />
         </div>
       ) : (
         products.map((product) => (
           <ProductCard key={product.id} product={product} />
         ))
       )}
     </div>
         </div>
       </section>
     </div>
   )
 }
 
 
export default page

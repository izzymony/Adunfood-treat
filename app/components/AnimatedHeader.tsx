'use client'
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { number } from 'zod'


interface AnimatedHeaderProps{
  images:string[]
  interval?: number ,
  transitionDuration?: number        
}

export function  AnimatedHeader  ({images, interval = 8000, transitionDuration = 2000}: AnimatedHeaderProps) {
       const [currentIndex, setCurrentIndex] = useState <number>(0)
        useEffect(() =>{
              const timer = setInterval(() =>{
                   setCurrentIndex((prevIndex) =>
                     prevIndex === images.length -  1 ? 0 :prevIndex + 1  
              )         
              }, interval)

              return () => clearInterval(timer);



        }, [images.length, interval])    
        
        
  return (
    <div>
      <div className='absolute inset-0 overflow-hidden'>

              {images.map((image, index) => (
                 <div  key={image}
                  className={`absolute inset-0 transition-opacity duration-[${transitionDuration}ms] ease-in-out ${
            index === currentIndex ? 'opacity-100' : 'opacity-0'
          }`}  style={{transitionDuration: `${transitionDuration}ms`}}>
                            
                      <Image
              src={image}
              alt="Hero background"
              fill
              priority={index === 0}
              quality={100}
              className="object-cover"
              sizes="100vw"
              style={{
                minHeight: '600px',
                objectPosition: 'center center'
              }}
                      />
                       <div className="absolute inset-0 bg-black/30" />
                 </div>           
              ))}
      </div>
    </div>
  )
}


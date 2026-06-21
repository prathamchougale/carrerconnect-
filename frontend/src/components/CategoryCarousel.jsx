import React, { useState, useEffect, useRef } from 'react'
import { ChevronLeft, ChevronRight, Code, Palette, Database, Smartphone, Cloud, Shield, Brain, BarChart3, Megaphone } from 'lucide-react'

const categories = [
    { id: 1, name: 'Frontend Developer', icon: <Code size={28} />},
    { id: 2, name: 'Backend Developer', icon: <Database size={28} />},
    { id: 3, name: 'Full Stack Developer', icon: <Cloud size={28} />},
    { id: 4, name: 'Mobile Developer', icon: <Smartphone size={28} /> },
    { id: 5, name: 'UI/UX Designer', icon: <Palette size={28} />},
    { id: 6, name: 'Data Scientist', icon: <Brain size={28} /> },
    { id: 7, name: 'DevOps Engineer', icon: <Shield size={28} /> },
    { id: 8, name: 'Digital Marketing', icon: <Megaphone size={28} />},
    { id: 9, name: 'Business Analyst', icon: <BarChart3 size={28} />},
]

const CategoryCarousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [isHovered, setIsHovered] = useState(false)
    const intervalRef = useRef(null)

    const itemsPerView = 4
    const maxIndex = categories.length - itemsPerView

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
    }

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
    }

    // Auto-scroll every 3 seconds
    useEffect(() => {
        if (!isHovered) {
            intervalRef.current = setInterval(nextSlide, 3000)
        }
        return () => clearInterval(intervalRef.current)
    }, [isHovered])

    return (
        <div 
            className='py-12 bg-gray-50'
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex items-center justify-between mb-8'>
                    <div>
                        <h2 className='text-2xl font-bold text-gray-900'>Popular Categories</h2>
                        <p className='text-gray-500 mt-1'>Explore jobs by category</p>
                    </div>
                    
                    {/* Navigation Arrows */}
                    <div className='flex gap-2'>
                        <button 
                            onClick={prevSlide}
                            className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all'
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            onClick={nextSlide}
                            className='w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center hover:bg-purple-600 hover:text-white hover:border-purple-600 transition-all'
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>

                {/* Carousel Track */}
                <div className='overflow-hidden'>
                    <div 
                        className='flex transition-transform duration-500 ease-in-out'
                        style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
                    >
                        {categories.map((category) => (
                            <div 
                                key={category.id}
                                className='min-w-[25%] px-3'
                            >
                                <div className='bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg hover:border-purple-200 transition-all cursor-pointer group'>
                                    <div className='w-14 h-14 rounded-lg bg-purple-50 flex items-center justify-center text-purple-600 mb-4 group-hover:bg-purple-600 group-hover:text-white transition-all'>
                                        {category.icon}
                                    </div>
                                    <h3 className='font-semibold text-gray-900 mb-1'>{category.name}</h3>
                                    {/* <p className='text-sm text-gray-500'>{category.jobs} jobs available</p> */}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Dots Indicator */}
                <div className='flex justify-center gap-2 mt-6'>
                    {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${
                                idx === currentIndex ? 'bg-purple-600 w-6' : 'bg-gray-300'
                            }`}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CategoryCarousel
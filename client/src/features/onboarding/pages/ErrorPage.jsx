import React from 'react'
import { BookOpen } from "lucide-react";
import { useNavigate } from 'react-router-dom';

function ErrorPage() {
    const navigate = useNavigate();
  return (
    <>
    <div className="card-color border border-gray-200 dark:border-white/[0.07] rounded-2xl flex flex-col items-center justify-center py-20 text-center">
        <div className="w-14 h-14 subcard-color rounded-2xl flex items-center justify-center mb-4 border border-gray-200 dark:border-white/10">
          <BookOpen size={22} strokeWidth={1.5} className="subText-color" />
        </div>
        <h3 className="text-[15px] font-semibold text-color mb-1">Page Not Found</h3>
        <p className="text-[13px] subText-color max-w-xs leading-relaxed">
          We Are Currently Creating Your  Personalized Roadmap. So Try Another Roadmap Or Come Back Later.
        </p>
        <h3 className='pt-10'> Select Another Roadmap</h3>
        <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors" onClick={() => navigate('/onboarding')}>
          Go to Onboarding
        </button>
      </div>
    
    </>



    
  )
}

export default ErrorPage
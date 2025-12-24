import React from 'react'
import { Toolbox } from 'lucide-react';

function Roadmap() {
  return (
    <div className='bg-grey-300 border-black'>
      <h1 className='text-white'>Roadmap Page</h1>
       <p className="text-gray-400 mt-1">
          Stay consistent. Small steps every day.
        </p>


        <div className='grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-4 '>
        <div className=''>
         <Card title="Frontend Developer" description="Learn HTML, CSS, JavaScript, React, and more." Day="day 01" />
        </div>
        <div className=''>
            <Card title="Backend Developer" description="Learn Node.js, Express, Databases, and more." Day="day 02" />
        </div>
        </div>



    </div>

  )
}
const Card = ({ title, description ,Day}) => (
  <div className="rounded-xl bg-[#0F172A] border border-white/10 p-5
               hover:border-blue-500/30 transition text-white">
                <div className='flex flex-col justify-center items-center'>
                  <span className='left-0.5 top-0.5 text-xs px-3 py-1 rounded-md bg-blue-500/10 text-blue-400'>
                    {Day}
                  </span>
                  {title }
                  
                  <div><Toolbox />
                  </div>
                  

                </div>

  </div>
)

export default Roadmap;
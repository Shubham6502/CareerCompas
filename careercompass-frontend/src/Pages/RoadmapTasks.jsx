import React from 'react'
import { useUser } from '@clerk/clerk-react'
import axios from 'axios'
import { CheckCircle, Clock11 } from "lucide-react";
import { useNavigate, useLocation } from 'react-router-dom';


function RoadmapTasks() {
    const location=useLocation();
    const dayData=location.state.day;
    const navigate=useNavigate();

  return (
    <div className=" relative flex h-full space-y-8 flex-col border border-white  text-white rounded-2xl">
        <span className=' absolute top-10 right-10 bg-green-400/10 py-2 border  px-4 rounded-2xl '> Day {dayData.day}</span>
        <div className=' flex flex-col gap-8 mx-auto w-full p-10 my-auto'>
            

           
            {(dayData.tasks).map((task,idx)=>{
                return( 
                    <a href={task.url} target='_blank'>
                    <div className=' w-full p-4  bg-[#1b0349] rounded-xl '>
                {task.title}
            </div>
             </a>
                )})}
             
             

        </div>
        <div className=' mx-auto my-auto rounded-2xl px-10 py-4 bg-blue-700'>
            <button onClick={()=>{
                navigate('/roadmap');
            }}>Back to Roadmap</button>
        </div>
    </div>
  )
}

export default RoadmapTasks
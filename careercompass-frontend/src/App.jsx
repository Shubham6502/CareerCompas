import { useState } from 'react'
import Navbar from './components/Navbar'
import Home from './Pages/Home'
import Services from './components/Services'
import Footer from './components/Footer'
import { Routes,Route } from 'react-router-dom'
import Login from './Pages/Login'
import Register from './Pages/Register'
import About from './Pages/About'
import Contact from './Pages/Contact'
import AiGuidance from './Pages/AiGuidance'
import Roadmap from './Pages/Roadmap'
import useSaveUser from './hooks/useSaveUser'
import GenerateTest from "./Pages/GenerateTest"
import Result from "./Pages/Result"
import RoadmapView from "./Pages/RoadmapView"


function App() {
  const [count, setCount] = useState(0)
  useSaveUser()

  return (
    < div className='min-h-screen'>
    
     <Navbar></Navbar> 
     <Routes>
      <Route path='/' element={
        <>
       
        <Home></Home>
     {/* 
     <Services></Services> */}
     
     </>
      }/>
      
      <Route path='/login' element={<Login/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/about' element={<About/>}/>
      <Route path='/contact' element={<Contact/>}/>
      <Route path='/aiguidance' element={<AiGuidance/> }/>
      <Route path='/roadmap' element={<Roadmap/>}/>
     <Route path='/test' element={<GenerateTest/>}/>
     <Route path='/result' element={<Result/>}/>
     <Route path='/roadmapView' element={<RoadmapView/>}/>
     </Routes>
     <Footer></Footer>
     
    </div>
  )
}

export default App

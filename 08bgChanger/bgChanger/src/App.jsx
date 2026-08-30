import { useState } from 'react'
import Button from "./components/Button"
import Holder from "./components/Holder"

function App() {
  // We will change app's colour. So we need a state variable here.
  const [bgColor, setBgColor] = useState("bg-white");
  // Now button is in another file. Structure is Button < Holder < div < App-div
  // So we need to "propagate the function."

  // use template strings when trying to inject inline js or variables.

  return (
    <div className={`w-full h-screen duration-800 ${bgColor}`}> 
      <div className='flex justify-center w-full fixed bottom-12'><Holder setBG={setBgColor}/></div>
    </div>
  )
}

export default App;

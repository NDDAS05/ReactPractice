import { useState } from 'react'
import './App.css'

// The bellow implementation will show +ed values in console, and will change the value on display.
// But see, we needed to access those elements (the variables needed to be enclosed in separate tags to apply js logic)
// Then had to modify the inner html structure of the element.

// Use of react "hooks" simplifies this process.


//------------------------------------------------
// function App() {
//   let value = 0;

//   const increaseValue=()=>{
//     value++;
//     const elem = document.getElementById("cv");
//     elem.innerHTML = value;
//   }

//   const reduceValue=()=>{
//     value--;
//     const elem = document.getElementById("cv");
//     elem.innerHTML = value;
//   }
//   return (
//     <>
//       <h1> useState in Action</h1>
//       <h1> Counter Val: <span id='cv'>{value}</span></h1>
//       <button
//       onClick={increaseValue}
//       > Click Me! </button>
//       <br />
//       <button onClick={reduceValue}> Reduce Load</button>
//     </>
//   )
// }
//----------------------------------------------------

function App(){
  let [counter, setCounter] = useState(0); // useState takes initial default value of "counter" variable and returns array of 2 things
  // 1. counter : the variable itself
  // 2. A method: setCounter() [convention names. could use var, updateVar  or abc, abcXYZ too]
   // setCounter() takes the  value and updates the value of counter "wherever counter appears"
  const addCount=()=>{
    counter++;
    if(counter>20) counter=1;
    setCounter(counter); // or setCounter(counter+1)
  }
  return(
    <>
      <h1>Counter: {counter}</h1>
      <h2> Above counter says {counter} </h2>
      <p> We want to demonstrate the use of useState by updating multiple counters(currently {counter}) together.</p>
      <button onClick={addCount}> Increase {counter} by 1 upto 20</button>
    </>
  )
}

export default App

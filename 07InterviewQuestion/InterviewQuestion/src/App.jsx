import { useState } from 'react'

// read the MD file for more desc.

function App() {
  const [count, setCount] = useState(0)

  const addValue = ()=>{ // Note: function IN function.
    setCount(count+1); // updateQueue: [ 1 ]
    console.log(count); // state update is asynchronous. So, count is still same 0 say
    setCount(count+1); // updateQueue: [ 1, 1 ]
    console.log(count); // // state update is asynchronous. So, count is still same 0 say
    setCount(count + 1); // updateQueue: [ 1, 1, 1 ]

    // So count NOT increases by 1 but BECOMES 1 when queue is flushed. Last setCount overwrites the count to 1.
  }

  const setValue =()=>{
    setCount(prev=> prev+1); // 1
    console.log(count); // 0
    setCount(prev=>prev+1); // 2. 
    console.log(count); //Async. Still 0.
    setCount(prev=>prev+1); // shows 3
  }

  const mixed=()=>{
    setCount(prev=> prev+1); // updateQueue [ update ] 
    console.log(count);
    setCount(90); // updateQueue [update, 90]
    console.log(count);
    setCount(prev=> prev+1); //[ update, 90, update]
    console.log(count);

    // At the beginning of render phase:
                              //  1. state = update(state) -> so state becomes 0->1
                              //  2. state = 90 -> state becomes 1->90
                              //  3. state = update(state) -> so state becomes 90->90+1 [91]
    // So DOM is updated ONCE with this state = 91 value.
  }

  const resetValue=()=>{
    setCount(0);
  }

  return (
    <>
      <h1> The count is {count} </h1>
      <button onClick={addValue}> Add value defined as count+1 3 times</button>
      <button onClick={setValue}> setValue defined as prev ='{'>'} prev+1 3 times</button>
      <button onClick={mixed}>Mixed value and initializer form</button>
      <button onClick={resetValue}>Reset</button>
    </>
  )
}

export default App

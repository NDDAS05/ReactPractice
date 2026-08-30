import "./App.css";
import Card from "./components/Card"
import {Greeting as G} from "./components/Greeting"
// In JSX, image tag has to be "closed"

// If we write <App randomProp = "HOLA"/> this "hola" will be passed as value of the parameter randomProp (or whatever is the parameter name of App function. That parameter WILL BE A OBJECT WITH KEYNAME MATCHING THE randomProp)
// Remember that "type-prop:{}-children" model we used to create our own JS.
// These are inside the prop object of the element.
// We can pass string directly. But int/float, object, array has to be passed in {}s.

const arr = ["Hello", 1, 27]

function App() {
  return (
    <>
      <h1 className='bg-sky-200 p-6 rounded-4xl'> TailWind CSS</h1>
      <Card mainName="Norton" passingArr = {arr}/>
      <Card mainName="Bob"/>
      
      <G name="ND" age={20} />
      <G name = "lorem ipsum" age={99}/>
      <G age={40}/>
    </>
  )
}


export default App;

import React from 'react'
import ReactDOM from 'react-dom/client'

// We now know that .render is expecting some form of object-> that it can parse to/directly use to construct that DOM like tree
// Now previously we wrote <App /> that compiler compiled into some object equivalent to
const obj ={
  type: 'a',
  props: {
    href:'https://www.google.com',
    target:'_blank',
  },
  children:'Click Me!!'
}

// This is Ok. But we can not pass it directly. Because the compiler does not expect the object to be literally in this format.
// It expects either direct html returned by function(return (<h1> Hello </h1>)), that it converts into obj using efficient algorithms, optimizations etc.
// Or it expects direct HTML inside .render 

ReactDOM.createRoot(document.getElementById('root')).render(
    <><h1>Hello</h1> <h2> hi!!</h2></>  // Just like return of function App(), jsx must have ONE parent element  
)

// Or const elem = {
//      <h2> Hi!!! </h2>
// }

//...render( elem );


// Now, since we do NOT know how the compiler expects the object to be, we have a React given function "createElement"
// It takes 3(or more) parameters
// From docs: const element = createElement(type, props, ...children)
// type: tag
// props: adds propeties. If no attributes, keep empty
// children: text

// And returns a "React element object"
// That contains: type, props

const ourAnchor = React.createElement('a', {href: "https://google.com", target:"_self"}, "Click me bro!!");

ReactDOM.createRoot(document.getElementById("root")).render(
  ourAnchor
);
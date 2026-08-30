import React from 'react'

// Now instead of doing manual props we can directly destructure it here.
// We expect props has name and age
export function Greeting({name="Default User", age=20}){
  console.log("This is Greeting.jsx. Type of age here is", typeof age); // number.
  return (
    <div className="p-4 bg-blue-100 rounded-md shadow-md">
      <h2 className="text-xl font-bold">Hello, {name}!</h2>
      <p>You are {age} years old.</p>
    </div>
  );
}


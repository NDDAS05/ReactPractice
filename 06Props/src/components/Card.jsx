import React from "react";

function Card(prop) { // by default react calls it props. We just gave the variable a new name.
    console.log(typeof prop); // object
    console.log("Hello",prop); // {mainName: 'Bob'(or Norton whatever), passingArrr: ["...", 1, 27]}
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-md">
          <div className="flex flex-col items-center gap-6 md:flex-row md:gap-8">
            <div>
              <img
                className="size-48 shadow-xl rounded-md"
                alt="Boat"
                src="https://images.pexels.com/photos/32803068/pexels-photo-32803068.jpeg"
              />
            </div>
            <div className="flex flex-col items-center md:items-start gap-1">
              <span className="text-2xl font-medium">{prop.mainName}</span>
              <span className="font-medium text-sky-500">
                The Anti-Patterns
              </span>
              <span className="flex gap-2 font-medium text-gray-600 dark:text-gray-400">
                <span>No. 4</span>
                <span>·</span>
                <span>2025</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Card;

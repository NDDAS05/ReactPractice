import React from "react"
import "./button.css"
function Button({colour="white", setBG}){
    let colourName = colour;
    switch(colourName){
        case "white" : colourName="bg-white";
                       break;
        case "teal" : colourName = "bg-teal-200"; break;
        case "cyan" : colourName = "bg-cyan-200"; break;
        case "emerald": colourName = "bg-emerald-200"; break;
        case "red" : colourName = "bg-rose-200"; break;
        case "olive": colourName = "bg-olive-200"; break;
        default:
            console.log("Undefined colour for button. Defaulted to white");
            colourName = "bg-white";
    }
    // Note: onClick accepts a "function". Now if we passed setBG inside onclick, we could not have passed parameter, (setBG("col") means executed here!! the return vallue is passed to onClick instead here.)

    // We had 2 options: 1) make a bgSetter method that calls setBG within it (just like we did in addValue etc)

    // 2. replace bgSetter with setBG()

    // We can not randomly call setBG: like onClick=setBG(). In this case, setBG() will execute here and send its return value NULL or smth to onClick.

    // We could just randomly put setBG("colorName") but that would not have triggered "on click".

    return(
        <>
            <button onClick={()=>setBG(colourName)} className={`${colourName} shadow-md my-button cursor-pointer`}>
                {colour}
            </button>
        </>
    )
}

export default Button;

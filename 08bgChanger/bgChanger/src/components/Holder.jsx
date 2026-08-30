// Holds button
import Button from "./Button"

function Holder({setBG}){
    return(
        <div className="flex flex-row justify-around w-7/8 my-6 bg-slate-50 pt-3 pb-3 rounded-full shadow-lg">
            <Button colour="olive" setBG={setBG}/>
            <Button colour="red" setBG={setBG}/>
            <Button colour="teal" setBG={setBG}/>
            <Button colour="cyan" setBG={setBG}/>
            <Button colour="emerald" setBG={setBG}/>
            <Button colour="white" setBG={setBG}/>
        </div>
    )
}

export default Holder;
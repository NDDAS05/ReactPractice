import React, { useId, useState, useEffect } from 'react'

function InputBox( {label, amount, onAmmountChange, onCurrencyChange, currencyOptions=[] , selectCurrency= 'usd', ammontDisable=false, currencyDisable=false  ,className="" } ){

    const UID = useId(); // This is newly generated every time. If we hardcoded ID, it would be same for every component made using this function.
    // DO NOT USE IT IN LOOPS FOR KEY. === Docs explicitly warns this.

    return(
        <div className={`bg-slate-50 p-3 rounded-lg text-sm flex ${className} `}>
            <div className='w-1/2'>
                <label htmlFor={UID} className='text-black/40 mb-2 inline-block'>{label}</label>
                <input id={UID} type="number" placeholder='Amount' className='outline-none w-full bg-transparent py-1.5' disabled={ammontDisable} value={amount} onChange={(e) => onAmmountChange && onAmmountChange(Number(e.target.value))}/>
            </div>
            <div className='w-1/2 flex flex-wrap justify-end text-right'>
                <p className='text-black/40 mb-2 w-full'> Currency Type </p>
                <select className='rounded-lg px-1 py-1 bg-gray-100 cursor-pointer outline-none' value={selectCurrency} onChange={(e)=> onCurrencyChange && onCurrencyChange(e.target.value)} disabled={currencyDisable}>
                        {currencyOptions.map((option)=> 
                            <option key={option} value={option}>{option}</option>
                        )}
                </select>                
            </div>
        </div>
    )
}

export default InputBox;
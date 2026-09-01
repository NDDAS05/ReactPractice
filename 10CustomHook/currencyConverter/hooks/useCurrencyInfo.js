// In most cases custom hooks are purely JS
// URL: https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/{currencyCode}.json

import {useEffect, useState} from "react"

function useCurrencyInfo(currency){
    const [data, setData] = useState({})
    useEffect(()=>{
        fetch(`https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${currency}.json`)
        .then((res)=> res.json())
        .then((res)=>setData(res[currency]));

        console.log(data);
    },[currency]);


    return data; // data is a JS object holding all the key(country) and their rates from country passed as "currency"
}

export default useCurrencyInfo;
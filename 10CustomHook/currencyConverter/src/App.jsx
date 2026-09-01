import { useState, useEffect, useId } from 'react'
import InputBox from './components/Input'
import useCurrencyInfo from '../hooks/useCurrencyInfo'


function App() {
  // Whatever changes in the UI should be through useState
  const [amount, setAmount] = useState(0);
  const [from, setFrom] = useState('usd');
  const [to , setTo] = useState('inr');
  const [convertedAmount, setConvertedAmount] = useState(0);

  const currencyInfo = useCurrencyInfo(from);

  const options = Object.keys(currencyInfo); 

  const swap = ()=>{
    setFrom(to)
    setTo(from)
    setConvertedAmount(amount)
    setAmount(convertedAmount)
  }

  const convertedData =()=>{
    setConvertedAmount(options[to] * amount)
  }

  return (
    <div
          className='w-full h-screen flex flex-wrap justify-center items-center bg-slate-200'>
          <form onSubmit={(e)=>{
            e.preventDefault();
            convertedData();
          }}></form>

    </div>
  )
}

export default App

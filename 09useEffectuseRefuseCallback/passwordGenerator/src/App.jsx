import { useState, useCallback, useEffect, useRef } from "react";

function App() {
  // We need: 1) A slider that controls password length

  // 1.5) Some way that a function runs upon loading and "generates" a password of that said length.

  // 2) A checkbox that tells if numbers can be included or not
  // 3) A checkbox that tells if special characters can be included or not.
  // No other way other than useState.

  const [length, setLength] = useState(4);
  const [numberAllowed, setNumberAllowed] = useState(true);
  const [charsAllowed, setCharAllowed] = useState(false);
  // To hold the password itself that will be changed on some button clicks.
  const [password, setPassword] = useState("");
  //----------
  const passwordRef = useRef(null); // useRef returns an object "reference". The object in question looks like this { current: null }
  // passwordRef holds reference to this object and it persists between renders. 20 re-renders(NOT RELOAD-IT DESTROYS EVERYTHING) after, passwordRef still holds reference to that same object.
  // Now we want to use a property of input HTMLElementObject say .select()
  // Since before render: there is NO DOM TREE.
  // After render THERE IS NO JSX.
  // How do we refer input field itself when dom tree is not even created?
  // That is where useRef comes in.
  // <input ref={passwordRef}.....>
  // ref is a JSX RESERVED KEYWORD. It, when creating the dom element, attaches the reference to that input field to Node.ref.current.
  // It (passwordRef) is re-written in subsequent renders: but with the same reference to the object that it created during 1st render.
  // React re-renders component only when their id, tag name or position change. Any else change causes in place update. 
  // So the reference to input is valid 20-re-renders after. Element is still same, fibre reconciliation algorithm does not EVEN TOUCH IT (or does in place update if something- like value here- changes)
  //----------

  // But we still don't know how to trigger the function that will actually generate the password ON BOOTUP of the Site: that is user interactivity. (useEffect)

  // Also, we need to make it so functions do not RERUN if nothing changed between reloads.
  // That is why we use : useCallback
  // Goal: useCallback for Optimization:
  // Used to memoize the password generator function definition.
  // The goal is to cache the function in memory and prevent unnecessary re-creations during re-renders, unless the dependencies (like length, numberAllowed, or characterAllowed) change.
  
  // DOCS: 
  // useCallback is a React Hook that lets you cache a function definition between re-renders.

  // const cachedFn = useCallback(fn, dependencies)
  // React Compiler automatically memoizes values and functions, reducing the need for manual useCallback calls. You can use the compiler to handle memoization automatically.
  // Since it is a Hook, it must be used at the top level of the component. (typically App component)

  // fn: The function value that you want to cache. It can take any arguments and return any values. React will return (not call!) your function back to you during the initial render.

  // Note: it returns the function itself during the initial render, does NOT execute it.

  // React will give you the same function again If the dependencies have not changed since the last render. Otherwise, it will give you the function that you have passed during the current render, and store it in case it can be reused later.

  // This is important: because function() or ()=>{} always CREATES new functions. So it is NOT POSSIBLE to check if previous and current functions are same or not.
  // This comparison is thus done on DEPENDENCIES.

  // React will not call the function. The function is returned to us so we can decide when and whether to call it.

  // dependencies: The list of all reactive values referenced inside of the fn code. Reactive values include props, state, and all the variables and functions declared directly inside your component body.

  // The list of dependencies must have a constant number of items and be written inline like [dep1, dep2, dep3]. React will compare each dependency with its previous value using the Object.is comparison algorithm.

  // Returns: On the initial render, useCallback returns the fn function you have passed.
  // During subsequent renders, it will either return an already stored fn function from the last render (if the dependencies haven’t changed), or return the fn function you have passed during this render.

  // This will be fired: 1) on initial render
  // On any form of changes of any dependencies.
  const passwordGenerator = useCallback(() => {
    let pw = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    let str = "";

    if (numberAllowed) pw += "0123456789";
    if (charsAllowed) pw += "!@#$%&?/|:;',.~`+=-_)(";

    for (let i = 0; i < length; i++) {
      let maxAlowedIndex = pw.length;
      let index = Math.floor(Math.random() * (maxAlowedIndex ));

      str += pw[index];
    }
    setPassword(str);
    console.log(str);
  }, [length, charsAllowed, numberAllowed]);
  
  const copyPasswordClipboard = useCallback(()=>{
    passwordRef.current?.select();
    passwordRef.current?.setSelectionRange(0, 2); // can customize upto what we can select.
    window.navigator.clipboard.writeText(password); // Note: we DID NOT USE THE RANGE in above line. EVERYTHING IS COPIED. What gets copied is not tied to DOM at all. Its entirely tied to JS.
  }, [password])


  // if we pass "password" we will be in a INFINITE LOOP
  // Why? cuz password is given as a dependency. Which is "" at first.
  // During render phase, useCallback memoizes the function with (length, charAllowed, numberAllowed, password)
  // During render/mount phase, useEffect runs. We call passwordGenerator-> that returns a function reference. We call that using (). This calls "setPassword()" useState setter. so schedules a "rerender"
  // Now, if the password was not in dep list, since the dependency length-charsAllowed-numberAllowed are not different, during this "rerender" the reference to the same function memoized with (length=4, charAllowed=false, numberAllowed= true) is returned.
  // For useEffect, length, charAllowed, numberAllowed and passwordGenerator nothing changed: as passwordGenerator returns reference to the previous function.
  // Unless anything invokes setState by any way no rerender again.

  // But, if password was given, password changes since useEffect runs the callback reference returned by passwordGenrator.
  // passwordGenerator initially runs, and calls setPassword(pw)->scheduling a rerender.
  // During this render, the password is not default " " but the value of pw.
  // So password: a dependency of useCallback changed.
  // thus useCallback returns a NEW DIFFERENT FUNCTION REFERENCE to passwordGenerator.
  // Now useEffect runs again as its dependency passwordGenerator changed.
  // useEffect again calls the returned different function by useCallback-> inside which is setState(pw)-> this again schedules the rerender. Since pw is randomly generated, between two renders pw is never same. So useCallback dependency are also never same. So this forms an infinite loop. useEffect modifies password by calling function returned by useCallback-triggering a rerender. In that rerender, useCallback changes its return value as pw changed. This makes useEffect run again during mount phase as func returned by useCallback changed.
  // useCallback stabilizes a function's reference between renders as long as its dependencies remain unchanged.

  useEffect(()=>{
    passwordGenerator()
  },[length, charsAllowed, numberAllowed, passwordGenerator]); // only password generator is enough as pW itself depends on length, charsAllowed and numberAllowed

  

  return (
    <div className="mt-5">
      <h1 className="text-sky-500 text-center text-4xl">Password Generator</h1>
      <div className="w-full max-w-md mx-auto my-5 p-10 shadow-md rounded-lg bg-slate-50">
        <div className="w-full my-4 flex flex-row justify-around ">
          <input
            type="text"
            value={password}
            className="w-6/9 py-2 px-3 outline-1 rounded-xl shadow-xl shadow-slate-300 my-2"
            placeholder="Password"
            readOnly
            ref={passwordRef}
          />
          {/* Note: ref.current is set to NULL after it unmounts. UNMOUNTS means when this input HTMLElementObject is NO LONGER IN DOM TREE.
              This DOES NOT HAPPEN IN RE_RENDER. The dom tree persists (even if some other node changes, this input NODE is never changed.). During normal re-renders, the ref stays intact — it continues pointing to the same DOM node.
              Only when the element is removed from the DOM tree (unmounted) does React clear it to null.
              Unmount will happen if: tab is closed, 2. tab is RELOADED which clears everything. */}
          <button onClick={copyPasswordClipboard} className="relative flex items-center px-6 py-3 overflow-hidden font-medium transition-all bg-indigo-500 rounded-md group my-2">
            <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-mr-4 group-hover:-mt-4">
              <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
            </span>
            <span className="absolute bottom-0 rotate-180 left-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-indigo-700 rounded group-hover:-ml-4 group-hover:-mb-4">
              <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
            </span>
            <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full bg-indigo-600 rounded-md group-hover:translate-x-0"></span>
            <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
              Copy
            </span>
          </button>
        </div>
        <div className="flex flex-row justify-between">
          <div className="flex items-center gap-2 px-2 py-1">
            <input type="range" id="length" value={length} min={4} max={20} onChange={(e)=>setLength(e.target.value)}/>
            <label htmlFor="length" className="whitespace-nowrap">
              Length: {length}
            </label>
          </div>
          {/* Now we need a toggling checkbox, that also changes the value of "numbers allowed" and "chars allowed. We will do this toggling via onChange " */}

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <input type="checkbox" name="numbers" id="numbers" defaultChecked={numberAllowed} 
                onChange={()=>setNumberAllowed((prev)=> !prev)}
              />
              <label htmlFor="numbers">Numbers</label>
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" name="characters" id="characters" defaultChecked={charsAllowed} onChange={()=>setCharAllowed((prev)=>!prev)}/>
              <label htmlFor="characters">Characters</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;

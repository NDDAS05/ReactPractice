# React `useState` — State, Re-rendering, and Updating the UI

## 1. The problem: manually changing the DOM

Before using React state, the counter can be implemented with ordinary JavaScript:

```jsx
function App() {
  let value = 0;

  const increaseValue = () => {
    value++;
    const elem = document.getElementById("cv");
    elem.innerHTML = value;
  };

  const reduceValue = () => {
    value--;
    const elem = document.getElementById("cv");
    elem.innerHTML = value;
  };

  return (
    <>
      <h1>useState in Action</h1>
      <h1>
        Counter Val: <span id="cv">{value}</span>
      </h1>

      <button onClick={increaseValue}>Click Me!</button>
      <br />
      <button onClick={reduceValue}>Reduce Load</button>
    </>
  );
}
```

The important point is not that this code is "wrong". It is valid JavaScript and can work.

The problem is that we are manually managing the DOM:

1. Change the JavaScript variable.
2. Find the corresponding DOM element using `document.getElementById()`.
3. Manually change its contents using `innerHTML`.

As the UI becomes larger, this approach becomes harder to maintain because the programmer has to keep the application's data and the DOM synchronized manually.

React's state model lets us describe the UI as a function of state and let React handle the DOM updates.

Conceptually:

```text
state changes
     ↓
React schedules a re-render
     ↓
component runs again
     ↓
JSX is evaluated using the new state
     ↓
React updates the necessary DOM
```

So instead of telling the DOM exactly what to change, we tell React what the UI should look like for the current state.

---

## 2. What is state?

**State is data that belongs to a component and can change over time, where changes to that state cause React to update the component's rendered output.**

For example, a counter's current value is state:

```jsx
counter = 0
```

After clicking a button:

```jsx
counter = 1
```

The important property is that the UI depends on this value:

```jsx
<h1>Counter: {counter}</h1>
```

Therefore, when the counter changes, React needs to update the displayed value.

---

## 3. `useState`

React provides the `useState` Hook for declaring state inside a function component.

```jsx
import { useState } from 'react';

function App() {
  const [counter, setCounter] = useState(0);

  // ...
}
```

`useState(0)` creates a state variable whose initial value is `0`.

It returns an array containing two things:

```text
[
  currentStateValue,
  stateUpdaterFunction
]
```

So this:

```jsx
const [counter, setCounter] = useState(0);
```

is essentially destructuring the returned array.

Conceptually:

```jsx
const state = useState(0);

const counter = state[0];
const setCounter = state[1];
```

The names `counter` and `setCounter` are conventions, not special React keywords.

For example, this is technically valid:

```jsx
const [abc, xyz] = useState(0);
```

But:

```jsx
const [counter, setCounter] = useState(0);
```

is much clearer and follows the standard convention:

```text
[stateVariable, setStateVariable]
```

---

## 4. What does the setter actually do?

The updater function is used to request a state update:

```jsx
setCounter(10);
```

or:

```jsx
setCounter(counter + 1);
```

The important interview-level understanding is:

> Calling the setter does not simply mutate the local JavaScript variable. It schedules a state update, and React re-renders the component so that the new state is reflected in the UI.

For example:

```jsx
setCounter(counter + 1);
```

causes React to store the new state value and re-render the component.

During that render, this:

```jsx
<h1>Counter: {counter}</h1>
```

is evaluated with the new value.

This is why you normally should **not** manually modify the DOM after calling the setter.

---

## 5. React's declarative approach

The difference between the old approach and React's approach is important.

### Imperative DOM manipulation

You explicitly tell the browser what to do:

```jsx
counter++;
document.getElementById("cv").innerHTML = counter;
```

This is **imperative**.

You are giving instructions such as:

```text
Find this element.
Change this element's contents.
```

### React

You describe what the UI should look like for the current state:

```jsx
<h1>Counter: {counter}</h1>
```

Then you update the state:

```jsx
setCounter(counter + 1);
```

React handles the process of bringing the DOM in line with the rendered result.

This is the core idea of React's **declarative UI model**:

> UI = a function of state.

A useful mental model is:

```text
UI = f(state)
```

If state changes, React calculates the new rendered result and applies the required DOM changes.

---

## 6. Applying `useState` to the counter

The current implementation is:

```jsx
function App() {
  let [counter, setCounter] = useState(0);

  const addCount = () => {
    counter++;

    if (counter > 20)
      counter = 1;

    setCounter(counter);
  };

  return (
    <>
      <h1>Counter: {counter}</h1>

      <h2>Above counter says {counter}</h2>

      <p>
        We want to demonstrate the use of useState by updating
        multiple counters (currently {counter}) together.
      </p>

      <button onClick={addCount}>
        Increase {counter} by 1 upto 20
      </button>
    </>
  );
}
```

There are several useful concepts here.

---

## 7. The same state can control multiple parts of the UI

Notice that `counter` appears several times:

```jsx
<h1>Counter: {counter}</h1>

<h2>Above counter says {counter}</h2>

<p>We are currently at {counter}</p>

<button>
  Increase {counter} by 1
</button>
```

There is only **one state value**:

```jsx
counter
```

but several UI elements depend on it.

When:

```jsx
setCounter(...)
```

updates the state, React re-renders the component and all these expressions are evaluated using the new value.

For example, if:

```text
counter = 5
```

the UI might contain:

```text
Counter: 5
Above counter says 5
We are currently at 5
Increase 5 by 1
```

After the state becomes `6`, React renders the corresponding output using `6`.

This is one of the major benefits of state: a single source of truth can drive multiple parts of the UI.

---

## 8. Why `let counter = 0` does not work as React state

Consider:

```jsx
function App() {
  let counter = 0;

  const addCount = () => {
    counter++;
  };

  return <h1>{counter}</h1>;
}
```

`counter++` changes a local JavaScript variable, but it does not tell React that the component needs to render again.

Therefore, changing the variable alone does not produce the React state-update behavior we want.

This is why React provides:

```jsx
const [counter, setCounter] = useState(0);
```

and:

```jsx
setCounter(...)
```

The setter gives React the information that state has changed.

---

## 9. Important correction: avoid directly mutating state

The current code contains:

```jsx
counter++;
```

followed by:

```jsx
setCounter(counter);
```

This can work for a primitive value like a number in this simple example, but it is **not the preferred React pattern**.

A cleaner version is:

```jsx
setCounter(counter + 1);
```

So the handler can be:

```jsx
const addCount = () => {
  if (counter >= 20) {
    setCounter(1);
  } else {
    setCounter(counter + 1);
  }
};
```

Why is direct mutation discouraged?

Because React state should be treated as **read-only**. You should create the next value and pass it to the setter rather than mutate the current state value.

This becomes especially important with objects and arrays.

For example, avoid:

```jsx
user.name = "John";
setUser(user);
```

Prefer:

```jsx
setUser({
  ...user,
  name: "John"
});
```

Likewise, avoid mutating arrays directly:

```jsx
items.push(newItem);
setItems(items);
```

Prefer:

```jsx
setItems([...items, newItem]);
```

The general principle is:

> Don't mutate existing state directly. Create the next state and pass it to the setter.

---

## 10. `setCounter(counter + 1)` vs functional updates

For a simple update based on the current value, you will often see:

```jsx
setCounter(counter + 1);
```

There is another form:

```jsx
setCounter(prevCounter => prevCounter + 1);
```

The second form is called a **functional state update**.

It is particularly useful when the new state depends on the previous state.

For example:

```jsx
setCounter(prevCounter => prevCounter + 1);
```

means:

```text
Take the latest state value
        ↓
add 1
        ↓
store the result as the new state
```

This is the safer/general pattern when performing multiple updates based on previous state:

```jsx
setCounter(prev => prev + 1);
setCounter(prev => prev + 1);
setCounter(prev => prev + 1);
```

Conceptually, React can apply these updates sequentially:

```text
0 → 1 → 2 → 3
```

Whereas repeatedly using the same captured value:

```jsx
setCounter(counter + 1);
setCounter(counter + 1);
setCounter(counter + 1);
```

does not mean "increment three times"; all three expressions may be based on the same render's `counter` value.

Therefore, a good rule is:

> If the next state depends on the previous state, prefer the functional updater form.

---

## 11. State is associated with a component instance

A useful mental model is that `useState` gives React a place to keep state associated with the component.

The local variable:

```jsx
counter
```

is the value available during the current render.

The state itself is maintained by React across renders.

This is why you can write:

```jsx
const [counter, setCounter] = useState(0);
```

without manually storing the value somewhere globally.

After a state update, React calls the component again to produce the next UI.

You can think of the process approximately as:

```text
Initial render
counter = 0
       ↓
UI is produced
       ↓
User clicks button
       ↓
setCounter(...)
       ↓
React schedules an update
       ↓
App() runs again
       ↓
counter contains the updated state
       ↓
new JSX is produced
       ↓
React updates the DOM where necessary
```

The exact internal reconciliation process is more sophisticated than this simplified model, but this is the right conceptual model for learning React.

---

## 12. React does not necessarily "change the whole DOM"

A common beginner explanation is:

> "Whenever state changes, React rebuilds the entire DOM."

That is too inaccurate.

A state update causes the component to render again. React then compares the new rendered result with the previous one and determines what DOM changes are necessary.

This process is commonly discussed using terms such as:

- **rendering**
- **reconciliation**
- **commit**
- React's internal representation of the UI

So the better statement is:

> A state update causes a re-render. React reconciles the new rendered output with the previous output and commits the necessary changes to the DOM.

Do not say in an interview that React blindly recreates the entire browser DOM on every state update.

---

## 13. Event handler and state update

The button uses:

```jsx
<button onClick={addCount}>
  Increase {counter} by 1
</button>
```

Notice:

```jsx
onClick={addCount}
```

rather than:

```jsx
onClick={addCount()}
```

The first passes the function as the event handler.

The second would call the function while rendering, which is generally not what we want.

The flow is:

```text
User clicks button
       ↓
React invokes addCount
       ↓
addCount calls setCounter(...)
       ↓
React schedules a state update
       ↓
Component renders again
       ↓
UI reflects the new counter
```

---

## 14. `useState` is a Hook

`useState` is a React **Hook**.

Hooks are functions provided by React that let function components use React features such as state and effects.

Example:

```jsx
import { useState } from "react";
```

Then:

```jsx
const [counter, setCounter] = useState(0);
```

`useState` is called directly inside the component.

### Basic Rules of Hooks

For `useState`, remember the important Rules of Hooks:

**1. Call Hooks at the top level.**

Do not put them inside conditions, loops, or nested functions:

```jsx
// ❌ Avoid
if (loggedIn) {
  const [name, setName] = useState("");
}
```

Instead:

```jsx
// ✅
const [name, setName] = useState("");
```

**2. Call Hooks from React function components or custom Hooks.**

Do not normally call `useState` from an arbitrary regular JavaScript function.

The reason React requires consistent Hook call ordering is that React uses the order of Hook calls to associate state with the correct component.

---

## 15. Initial state

Here:

```jsx
useState(0)
```

the `0` is the **initial state value**.

It is used when that component's state is initialized.

For example:

```jsx
const [name, setName] = useState("");
const [loggedIn, setLoggedIn] = useState(false);
const [items, setItems] = useState([]);
```

The initial state can be a:

- number
- string
- boolean
- array
- object
- or other JavaScript value

Example:

```jsx
const [user, setUser] = useState({
  name: "Alex",
  age: 20
});
```

---

## 16. The corrected version of this example

A cleaner version of the current counter is:

```jsx
import { useState } from "react";
import "./App.css";

function App() {
  const [counter, setCounter] = useState(0);

  const addCount = () => {
    if (counter >= 20) {
      setCounter(1);
    } else {
      setCounter(prevCounter => prevCounter + 1);
    }
  };

  return (
    <>
      <h1>Counter: {counter}</h1>

      <h2>Above counter says {counter}</h2>

      <p>
        We want to demonstrate the use of useState by updating
        multiple UI elements from the same state value.
      </p>

      <button onClick={addCount}>
        Increase {counter} by 1 up to 20
      </button>
    </>
  );
}

export default App;
```

An even simpler version, if you do not need the wrap-around behavior, would be:

```jsx
const addCount = () => {
  setCounter(prevCounter => prevCounter + 1);
};
```

The important part of the lesson is not the counter logic itself. It is the relationship:

```text
state
  ↓
rendered UI

user interaction
  ↓
state update
  ↓
re-render
  ↓
updated UI
```

---

## 17. Key interview points

If asked **"What is `useState`?"**, a strong answer is:

> `useState` is a React Hook that allows a function component to hold state. It returns the current state value and a setter function. Calling the setter schedules a state update, which causes React to re-render the relevant component and update the DOM as necessary.

If asked **"Why not just use a normal variable?"**:

> A normal local variable can change, but changing it does not tell React to render again. State is managed by React, and updating it through the setter schedules a re-render so the UI can stay synchronized with the state.

If asked **"Does `setState` immediately change the variable?"**:

> You should not think of the setter as immediately mutating the current render's local variable. State values are tied to renders; the setter requests a state update, and a subsequent render provides the updated value.

If asked **"Why shouldn't we mutate state directly?"**:

> React state should be treated as immutable. Instead of modifying the existing state value, create the next value and pass it to the setter. This makes updates predictable and is especially important for objects and arrays.

If asked **"What happens after calling a state setter?"**:

```text
setter called
   ↓
state update is scheduled
   ↓
component re-renders
   ↓
new JSX is calculated
   ↓
React reconciles old and new output
   ↓
necessary DOM changes are committed
```

---

## 18. Mental model to remember

The most useful mental model from this lesson is:

```text
             ┌──────────────┐
             │    State     │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │   Component  │
             │    render    │
             └──────┬───────┘
                    │
                    ▼
             ┌──────────────┐
             │      UI      │
             └──────┬───────┘
                    │
                    │ user interaction
                    ▼
             ┌──────────────┐
             │ event handler│
             └──────┬───────┘
                    │
                    ▼
             setState(...)
                    │
                    └──────────► back to State
```

In short:

> **State is the data. The component renders UI from that state. User actions can update the state, and React re-renders the component so the UI stays synchronized with the new state.**

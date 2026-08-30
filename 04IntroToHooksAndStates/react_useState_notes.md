# React Learning Notes — `useState`

*Based on: useState counter walkthrough (imperative DOM vs. React state)*

## 1. The problem it solves

Before `useState`, "updating the UI" meant manually syncing a JS variable
with the DOM yourself:

```jsx
value++;
document.getElementById("cv").innerHTML = value;
```

This is **imperative** — you tell the browser exactly what to change.
It works, but doesn't scale: every piece of data needs its own manual
DOM-sync code.

React flips this to **declarative**: you describe the UI as a function
of state, and React figures out what DOM changes are needed.

```
state changes → React re-renders the component → JSX evaluated with
new state → React updates only what's necessary in the DOM
```

Mental shorthand: **UI = f(state)**

## 2. What `useState` actually returns

```jsx
const [counter, setCounter] = useState(0);
```

`useState(0)` returns an array: `[currentValue, setterFunction]`.
`counter`/`setCounter` are just names by convention — React doesn't
care what you call them, same as any destructured variable.

## 3. What the setter does (important distinction)

`setCounter(counter + 1)` does **not** mutate `counter` in place. It
**schedules a state update** → React re-renders the component → on that
new render, `counter` holds the updated value.

This is why you never manually touch the DOM after calling a setter —
React handles that as part of the re-render.

## 4. One state value can drive many parts of the UI

```jsx
<h1>Counter: {counter}</h1>
<h2>Above counter says {counter}</h2>
<button>Increase {counter} by 1</button>
```

Single source of truth (`counter`) — every place it's referenced updates
together on re-render. No manual "update this span, then that span."

## 5. Don't mutate state directly

Works, but wrong pattern:
```jsx
counter++;
setCounter(counter);
```

Preferred:
```jsx
setCounter(counter + 1);
```

Same idea applies harder to objects/arrays — always create a new value:
```jsx
setUser({ ...user, name: "John" });   // not: user.name = "John"
setItems([...items, newItem]);        // not: items.push(newItem)
```

**Rule:** treat state as read-only. Build the next value, pass it to
the setter.

## 6. Functional updates — `setCounter(prev => prev + 1)`

Use this form when the new state depends on the previous state,
especially with multiple updates in a row:

```jsx
setCounter(prev => prev + 1);
setCounter(prev => prev + 1);
setCounter(prev => prev + 1);
// → reliably 0 → 1 → 2 → 3
```

vs. calling `setCounter(counter + 1)` three times, which all read the
*same* `counter` from that render and don't stack the way you'd expect.

**Rule of thumb:** next state depends on previous state → use the
functional form.

## 7. Rules of Hooks (for `useState` specifically)

1. Call hooks at the **top level** only — never inside `if`, loops, or
   nested functions.
2. Call hooks only from **React function components** or **custom
   hooks** — not arbitrary regular functions.

Reason: React relies on the *order* hooks are called in to match state
to the right component across renders.

## 8. React doesn't "rebuild the whole DOM"

Common oversimplification to avoid: state change → re-render (component
function runs again) → React reconciles new output against old output →
only the necessary DOM nodes are actually committed/changed. Not a full
DOM rebuild.

## 9. Event handler syntax gotcha

```jsx
<button onClick={addCount}>   // ✅ pass the function reference
<button onClick={addCount()}> // ❌ calls it immediately during render
```

## 10. Quick interview-ready answers

- **What is useState?** A Hook that lets a function component hold
  state; returns `[value, setter]`; calling the setter schedules a
  re-render so the UI reflects the new value.
- **Why not a plain variable?** Changing a plain variable doesn't tell
  React to re-render — state has to go through the setter for React to
  know to update the UI.
- **Does the setter update the variable immediately?** No — it schedules
  an update; the new value shows up on the *next* render.
- **Why avoid mutating state directly?** Predictability — especially
  critical for objects/arrays, where mutation can silently break
  re-renders since React compares references.

## 11. Note on "Hooks" vs. what the video showed

`useState` is technically a **Hook** (a React function starting with
`use` that lets function components tap into React features like state).
The video's title mentioned "Hooks" but only demonstrated `useState`
itself — the Rules of Hooks above (top-level only, components/custom
hooks only) apply generally to *all* hooks (`useEffect`, `useRef`, etc.),
not just this one. Worth keeping in mind once you meet the others —
same rules, same reasoning about call-order.

---
*Next up: `useEffect` (side effects, dependency arrays) will build
directly on this state → re-render mental model.*
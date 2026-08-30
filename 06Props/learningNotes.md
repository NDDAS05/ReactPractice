# React Learning Notes — Props Basics

*Based on: `main.jsx`, `App.jsx`, `Greeting.jsx`, `Card.jsx`*

## 1. What actually happens when you pass a prop

Writing `<App randomProp="HOLA" />` doesn't just tack "HOLA" onto the App
element — it gets collected, along with every other attribute, into a
**single object** that's passed as the first argument to the function.
The key name in that object matches the attribute name exactly.

```jsx
<Greeting name="ND" age={20} />
// becomes, inside Greeting:
// props = { name: "ND", age: 20 }
```

This is the same `type-props-children` shape used to build JSX elements
under the hood — props aren't magic, they're just an object being passed
to a function like any other argument.

## 2. String vs. everything else

- Plain **strings** can be passed directly: `mainName="Norton"`
- **Numbers, booleans, objects, arrays** must be wrapped in `{}` because
  that curly brace is what tells JSX "evaluate this as JS", not a string:

```jsx
const arr = ["Hello", 1, 27];
<Card mainName="Norton" passingArr={arr} />
```

## 3. Receiving props two ways

**A. Take the whole object** (`Card.jsx` style):

```jsx
function Card(props) {
  console.log(typeof props); // "object"
  return <span>{props.mainName}</span>;
}
```

You can name the parameter anything (`prop`, `props`, `data`) — React
doesn't care, it's just a normal function parameter.

**B. Destructure directly in the signature** (`Greeting.jsx` style):

```jsx
export function Greeting({ name = "Default User", age = 20 }) {
  return <h2>Hello, {name}! You are {age} years old.</h2>;
}
```

Destructuring is just cleaner — you skip writing `props.name` everywhere.

## 4. Default values for missing props

Default values are set **in the destructuring pattern**, not by checking
`if (name === undefined)` manually:

```jsx
function Greeting({ name = "Default User", age = 20 }) { ... }
```

If a prop isn't passed (`<G age={40} />` — no `name`), the default kicks
in automatically. Confirmed via `console.log(typeof age)` → logs
`"number"` even when age comes from a hardcoded default or a passed prop.

## 5. Renaming on import

```jsx
import { Greeting as G } from "./components/Greeting";
```

Named imports can be aliased with `as`. Useful for shortening names or
avoiding collisions — doesn't change anything about the component itself.

## 6. Small JSX gotchas

- Image tags **must self-close**: `<img ... />`, not `<img ...>`.
- Multiple components can be reused with different props — each call is
  independent (`<Card mainName="Norton" .../>` and `<Card mainName="Bob" />`
  render separately with their own data).
- Fragments (`<> </>`) let you return multiple top-level elements from
  `App` without wrapping them in an extra `<div>`.

## 7. Quick mental model to keep

> A component is a function. Props are just its argument (one object).
> JSX attributes build that object. `{}` means "run this JS", plain
> `"text"` means "this is a literal string."

---
*Next things to watch for as you keep writing files: how props differ
from state, and what changes when a prop's value needs to update over
time (that's where `useState` comes in).*
# React Elements, JSX, `createElement()`, `render()` and `ref`

## 1. What does `.render()` actually receive?

When we write:

```jsx
ReactDOM.createRoot(document.getElementById("root")).render(
  <h1>Hello</h1>
);
```

`render()` does **not** receive an actual DOM element like:

```html
<h1>Hello</h1>
```

Instead, JSX is converted by the JSX compiler into a **React element object** describing what should be rendered.

Conceptually:

```jsx
<h1>Hello</h1>
```

becomes something roughly like:

```js
{
  type: "h1",
  props: {
    children: "Hello"
  }
}
```

The exact internal structure is more complicated and should not be treated as React's public object format. The important idea is:

> JSX creates a description of the UI. React uses that description to construct/update the actual DOM.

---

## 2. JSX is not HTML

This:

```jsx
<h1>Hello</h1>
```

looks like HTML, but inside a `.jsx` file it is **JSX syntax**.

The compiler transforms it into JavaScript.

For example:

```jsx
const element = <h1>Hello</h1>;
```

is conceptually similar to:

```js
const element = React.createElement("h1", null, "Hello");
```

Modern React projects may compile JSX using the newer automatic JSX runtime, so you should think of `createElement()` as the conceptual/public API rather than assuming every project literally produces this exact call.

---

## 3. What is `React.createElement()`?

React provides:

```js
createElement(type, props, ...children)
```

It creates a **React element object**.

Example:

```js
const ourAnchor = React.createElement(
  "a",
  {
    href: "https://google.com",
    target: "_self"
  },
  "Click me bro!!"
);
```

Conceptually, this says:

> Create an element of type `<a>`, give it these props, and make `"Click me bro!!"` its child.

Then:

```js
ReactDOM.createRoot(document.getElementById("root")).render(ourAnchor);
```

renders that React element.

---

## 4. The three parts of `createElement()`

The function is:

```js
createElement(type, props, ...children)
```

### `type`

Describes **what kind of element/component** to create.

For an HTML element:

```js
"h1"
"div"
"a"
"button"
```

For a React component:

```js
App
Greeting
Card
```

For example:

```js
createElement("h1", null, "Hello");
```

means roughly:

```jsx
<h1>Hello</h1>
```

---

### `props`

An object containing properties/attributes to give the element.

Example:

```js
createElement(
  "a",
  {
    href: "https://google.com",
    target: "_blank"
  },
  "Google"
);
```

Conceptually equivalent to:

```jsx
<a href="https://google.com" target="_blank">
  Google
</a>
```

If there are no props, use `null`:

```js
createElement("h1", null, "Hello");
```

---

### `...children`

Everything after `props` is treated as a child.

```js
createElement(
  "div",
  null,
  "Hello",
  "World"
);
```

can represent:

```jsx
<div>
  Hello
  World
</div>
```

A child can also be another React element:

```js
createElement(
  "div",
  null,
  createElement("h1", null, "Hello")
);
```

Conceptually:

```jsx
<div>
  <h1>Hello</h1>
</div>
```

---

## 5. React element vs actual DOM element

This distinction is extremely important.

A **React element** is a JavaScript object describing what the UI should look like.

An **actual DOM element** is a browser object such as:

```js
document.querySelector("h1")
```

For example:

```js
const element = React.createElement("h1", null, "Hello");
```

`element` is **not** an actual `<h1>` DOM node.

It is a description that React can use to create/update the DOM.

Think:

```text
React element
     ↓
"description of UI"
     ↓
React rendering/reconciliation
     ↓
actual DOM
```

---

## 6. Why can't I just make my own object?

You might think:

```js
const obj = {
  type: "a",
  props: {
    href: "https://google.com",
    target: "_blank"
  },
  children: "Click Me!!"
};
```

and then:

```js
root.render(obj);
```

The problem is that React's element representation is an **implementation/API contract**, not simply any object with `type`, `props`, and `children`.

React elements contain additional information and use a specific structure.

Therefore, don't manually construct React elements.

Instead use:

```jsx
const element = <a href="https://google.com">Click Me!!</a>;
```

or:

```js
const element = React.createElement(
  "a",
  { href: "https://google.com" },
  "Click Me!!"
);
```

`createElement()` lets React create the correctly structured React element for you.

---

## 7. JSX and `createElement()` are two ways of expressing the same idea

These:

```jsx
const element = (
  <a href="https://google.com">
    Click Me!!
  </a>
);
```

and:

```js
const element = React.createElement(
  "a",
  { href: "https://google.com" },
  "Click Me!!"
);
```

both describe essentially the same React element.

JSX is simply much easier for humans to write.

So generally:

```text
JSX
 ↓
compiler
 ↓
React element description
 ↓
React
 ↓
DOM
```

---

## 8. Why does JSX need one parent?

This:

```jsx
return (
  <h1>Hello</h1>
  <h2>Hi</h2>
);
```

is invalid because a function must return one JSX expression.

You can wrap them:

```jsx
return (
  <div>
    <h1>Hello</h1>
    <h2>Hi</h2>
  </div>
);
```

Or use a Fragment:

```jsx
return (
  <>
    <h1>Hello</h1>
    <h2>Hi</h2>
  </>
);
```

The Fragment lets you group multiple elements without adding an unnecessary `<div>` to the DOM.

The same applies when passing JSX directly to `render()`:

```jsx
root.render(
  <>
    <h1>Hello</h1>
    <h2>Hi!!</h2>
  </>
);
```

---

# 9. What is `ref`?

`ref` stands for **reference**.

It is a special React mechanism for accessing the underlying DOM node (or another referenced React value) after React has rendered it.

Example:

```jsx
import { useRef } from "react";

function App() {
  const inputRef = useRef(null);

  return (
    <input ref={inputRef} />
  );
}
```

After the input has been rendered:

```js
inputRef.current
```

refers to the actual `<input>` DOM element.

Therefore:

```js
inputRef.current.focus();
```

can focus the input.

Think:

```text
inputRef
   ↓
.current
   ↓
actual <input> DOM node
```

---

## 10. `ref` is special — it isn't an ordinary prop

Most props are passed to a component as normal data:

```jsx
<Greeting name="Nirupam" />
```

Inside:

```js
function Greeting({ name }) {
  // name is a normal prop
}
```

But `ref` is handled specially by React.

When using `createElement()`:

```js
createElement(
  "input",
  {
    ref: inputRef
  }
);
```

React treats `ref` specially rather than simply treating it as an ordinary entry in `props`.

The same applies to `key`.

React specifically reserves both:

```text
ref
key
```

for special purposes.

So don't think of:

```js
ref
```

as merely another HTML attribute like:

```js
className
id
href
```

---

# 11. `key` is also special

`key` is another special React value.

It helps React identify elements when rendering lists.

Example:

```jsx
items.map(item => (
  <li key={item.id}>
    {item.name}
  </li>
));
```

The `key` helps React determine which list item corresponds to which previous item when the list changes.

So:

```text
props → information used by components/elements
key   → helps React identify elements during reconciliation
ref   → provides a reference to a rendered value/DOM node
```

---

# 12. The big picture

When you write:

```jsx
const element = (
  <a href="https://google.com">
    Click Me!!
  </a>
);
```

you are describing UI using JSX.

Conceptually:

```text
JSX
 ↓
compiled into JavaScript
 ↓
React element
 ↓
React processes the element
 ↓
DOM is created/updated
 ↓
Browser displays it
```

You can also explicitly create the React element:

```js
const element = React.createElement(
  "a",
  {
    href: "https://google.com"
  },
  "Click Me!!"
);

root.render(element);
```

The key thing to remember is:

> A React element is a description of what should appear in the UI. It is not the actual DOM element.

And:

> `createElement(type, props, ...children)` is the React API for creating that React element description directly.

---

## Quick mental model

```text
                JSX
                 │
                 ▼
        React element
      (description/object)
                 │
                 ▼
       React reconciliation
                 │
                 ▼
            Real DOM
                 │
                 ▼
          Browser screen


createElement()
      │
      └──────► React element
```

For `createElement()`:

```text
createElement(
    type,        ← what to create
    props,       ← properties/data
    children     ← contents/nested elements
)
```

For special React values:

```text
ref   → reference to a rendered value/DOM node
key   → identity used by React for list reconciliation
```

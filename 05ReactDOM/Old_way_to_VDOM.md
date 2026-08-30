> Written by Gemini

# The Evolution of React Architecture: From DOM to Fiber

## Part 1: The Traditional Web and Imperative DOM

Before React, web development relied heavily on **Imperative Programming**. Imperative programming is like giving step-by-step instructions to a robot. You must explicitly describe *how* to change the UI. If a user clicks a "Like" button, your JavaScript must manually execute:

1. Find the button using `document.getElementById()`.
2. Check its current text.
3. Change its CSS class.
4. Change its inner text.

In this era, the **Real DOM was the Source of Truth**. If you wanted to know what a user typed into an input field, your JavaScript had to reach into the HTML document and ask the input field for its `.value`. The HTML held the state; JavaScript merely manipulated it.

The problem with this approach is performance at scale. The Real DOM is not just a structural tree; it is deeply wired into the browser's rendering engine. Every time you manipulate the Real DOM, you risk triggering a **Reflow** (the browser recalculating the exact physical geometry and position of every element on the screen) and a **Repaint** (drawing the new pixels). Performing 50 individual imperative DOM updates causes massive performance bottlenecks.

> Note: In both cases, the amount of content that needs to be updated is the same. The slow part is the browser’s rendering engine. With a Virtual DOM, changes are collected and applied in one batch, so the rendering pipeline (reflow + repaint) runs once. Without it, each individual DOM update can trigger reflow and repaint separately — potentially 50 times — which is much slower.

## Part 2: The Virtual DOM and the Declarative Shift

React introduced a complete paradigm shift by moving from imperative to **Declarative Programming**. In a declarative system, you do not write step-by-step instructions on *how* to change the UI. Instead, you declare *what* the UI should look like in any given state.

This introduces a mathematical concept: $UI = f(state)$. The User Interface is simply a function of your data (state).

To achieve this, React dictates that **the Real DOM acts merely as a projection of memory**. This means the HTML no longer holds the state of your application. Your JavaScript variables (the memory) hold the state. The UI on the screen is just a "dumb" reflection (a projection) of whatever those JavaScript variables currently contain.

To bridge the gap between your JavaScript variables and the Real DOM, React invented the **Virtual DOM**. The Virtual DOM is a lightweight JavaScript object—a perfect clone of what the Real DOM *should* look like, stored purely in fast RAM.

When a JavaScript variable (state) changes, React does not touch the Real DOM. Instead, it generates a brand new Virtual DOM tree based on the new state. It then compares the New Virtual DOM to the Old Virtual DOM, figures out exactly what changed, and applies those specific changes to the Real DOM in one optimized, batched update. This comparison process is called **Reconciliation**.

## Part 3: The Algorithmic Leap ($O(n^3)$ to $O(n)$ to $O(1)$)

The core of Reconciliation is the diffing algorithm: how do you compare two trees (the Old VDOM and New VDOM) to find the minimum number of changes required to turn one into the other?

**Why traditional algorithms are $O(n^3)$:**
In computer science, the standard algorithms to calculate the minimum edit distance between two general trees (like the Tai algorithm) have a time complexity of $O(n^3)$, where $n$ is the number of nodes in the tree.
This means if your webpage has 1,000 HTML elements, comparing the old tree to the new tree would require $1000^3$, or 1 billion comparisons. For a modern web application, calculating 1 billion operations on every keystroke would instantly crash the browser.

**How React achieves $O(n)$:**
React's engineers realized they didn't need a perfect mathematical algorithm; they just needed a practical one. They implemented a heuristic (rule-of-thumb) $O(n)$ algorithm based on two strict assumptions:

1. **Different component types produce entirely different trees.** If an `<article>` tag changes into a `<section>` tag, React does not waste time looking at the children inside them. It assumes the entire branch is fundamentally different. It immediately destroys the old `<article>` node and all its children, and builds the `<section>` from scratch.
2. **List tracking via Keys.** When rendering arrays of elements, developers must provide a unique `key` prop (like a database ID) to each item.

**How the `key` prop achieves $O(1)$ operations:**
Without keys, if you insert a new item at the top of a 1,000-item list, React compares index 0 to index 0, sees a difference, and mutates the element. It does this for all 1,000 items, resulting in a massive cascade of updates.
With a unique `key`, React tracks the identity of the elements. When you insert a new item at the top, React sees that the `key`s for the other 1,000 items are identical to the previous render, just in different positions. Instead of diffing or rebuilding them, React performs an $O(1)$ operation: it simply updates the internal pointers, leaving the existing DOM nodes completely intact and merely shifting them down.

## Part 4: The Stack Reconciler Bottleneck

React 15 and earlier used the **Stack Reconciler**. It relied on the standard JavaScript execution call stack to traverse and compare the Virtual DOM trees using a recursive Depth-First Search.

The fatal flaw of the Stack Reconciler was its **synchronous nature**. Once React began comparing a large Virtual DOM tree, it was trapped in the JavaScript call stack. The browser's main thread—which is responsible for typing, scrolling, and CSS animations—was completely hijacked until React reached the very bottom of the tree.

If a large table took 200 milliseconds to diff, the browser dropped frames, resulting in visual stuttering. A user typing in an input field would experience severe lag because the browser could not process their keystrokes while React was busy monopolizing the thread.

## Part 5: React Fiber and Concurrent Architecture

To solve this UI freezing, the React team spent two years rewriting the core engine from scratch, resulting in **React Fiber** (released in React 16).

The goal of Fiber was to make rendering **interruptible**.

**1. The Data Structure Shift (Linked Lists):**
Fiber completely abandoned the synchronous JavaScript call stack. Instead, every component is represented by a "Fiber Node." These nodes are connected together via a **Linked List** (each node has pointers to its child, sibling, and parent).
By using a linked list instead of the call stack, React decoupled its calculations from the JavaScript engine. React can now track exactly where it is in the tree, pause its work, and resume it later.

**2. Time-Slicing (Incremental Rendering):**
Instead of calculating a massive VDOM update all at once, Fiber breaks the work into small chunks (time slices) of about 5 milliseconds. It processes a chunk, and then intentionally **yields** control back to the browser. The browser checks if the user clicked anything, typed anything, or if an animation needs to run. If the coast is clear, React resumes processing the next chunk.

**3. Double Buffering (WorkInProgress Tree):**
Because Fiber can pause its work, it cannot apply changes to the Real DOM piece-by-piece (which would result in a torn, half-updated UI). Instead, Fiber uses a technique borrowed from video game engines called double buffering.
The current visible UI is backed by the `Current` Fiber tree. When an update happens, React drafts the changes in memory on a hidden clone called the `WorkInProgress` tree. React can pause, abort, or throw away the `WorkInProgress` tree at any time without the user ever noticing. Only when the `WorkInProgress` tree is 100% complete does React execute the **Commit Phase**, instantly swapping it to become the new visible UI.

**4. Priority Lanes:**
Because Fiber is interruptible, not all updates are treated equally. Fiber categorizes state changes into priority lanes:

* **High Priority:** User input (typing, clicking, dragging). The UI must update immediately.
* **Low Priority:** Background data fetches, rendering massive lists.

If React is halfway through a Low Priority update (like calculating a 5,000-row table) on the `WorkInProgress` tree, and the user types a letter in a search bar (High Priority), Fiber instantly aborts the table calculation, processes the keystroke so the UI feels perfectly responsive, and then restarts the table calculation in the background.
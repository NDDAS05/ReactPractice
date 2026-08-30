```JS
// React keeps a queue of state updates for each component
let updateQueue = [];

// When you call setState (or setCount):
function setState(update) {
  // update can be either:
  // 1. a value (like count+1)
  // 2. a function (like prev => prev+1)

  updateQueue.push(update);
}

// Later, during the render commit phase:
function processUpdates(oldState) {
  let state = oldState;

  for (let update of updateQueue) {
    if (typeof update === 'function') {
      // Functional updater: apply sequentially
      state = update(state);
    } else {
      // Direct value: overwrite
      state = update;
    }
  }

  updateQueue = []; // clear after processing
  return state;
}
```

# React `useState` Batching & Functional Updates

## Core idea

When you call a state setter (e.g. `setCount(...)`) inside an event handler, React does **not** immediately update the state or re-render. Instead, it:

1. Adds an entry to an internal **update queue** for that piece of state.
2. Keeps running the rest of the current function synchronously.
3. Once the handler finishes, React processes the queue, computes the final new state, and triggers a single re-render.

Consequences:

- Reading `count` right after calling `setCount(...)` still gives the value from **this render's closure** — never the "new" value, because the update hasn't been applied yet.
- Multiple setter calls in one handler are batched into a single re-render (React 18+ does this automatically, even inside promises/timeouts/native handlers, not just React's own event handlers).

## Two forms of the setter, and why they behave differently

### 1. Direct value form — `setCount(count + 1)`

`count + 1` is **evaluated immediately**, using the value of `count` captured in this render's closure. Every call in the same handler computes the *same* number.

`addValue`, starting from `count = 0`:

```js
setCount(count + 1); // evaluates now → queues the value 1
setCount(count + 1); // count is still 0 in this closure → queues the value 1 again
setCount(count + 1); // queues the value 1 again
```

Queue: `[1, 1, 1]` — three literal values, not three functions.

When React flushes the queue, each entry **replaces** the pending state outright. Processing `[1, 1, 1]` from a base of `0` just yields `1` three times in a row — final state is `1`, not `3`. Net effect: **+1**, no matter how many times you call it in one handler.

Each `console.log(count)` between the calls prints `0`, because `count` is a `const` from this render's closure and never changes mid-handler.

### 2. Functional/updater form — `setCount(prev => prev + 1)`

Here you pass a **function**, not a value. React queues the function itself, and when flushing, calls it with whatever the pending state is *so far in the queue* — not the render's `count`.

`setValue`, starting from `count = 0`:

```js
setCount(prev => prev + 1); // queues fn1
setCount(prev => prev + 1); // queues fn2
setCount(prev => prev + 1); // queues fn3
```

Queue: `[fn1, fn2, fn3]`. Flushing chains them:

```
fn1(0) = 1
fn2(1) = 2
fn3(2) = 3
```

Final state: `3`. Net effect: **+3**.

Again, all three `console.log(count)` calls print `0` — the closure's `count` doesn't change mid-handler regardless of which form is used.

## Mixing both forms (`mixed`)

```js
setCount(prev => prev + 1); // queues fn1
setCount(count + 1);        // count is 0 in this closure → queues the literal value 1
setCount(prev => prev + 1); // queues fn2
```

Queue: `[fn1, value(1), fn2]`. Flushing from a base of `0`:

```
fn1(0)   = 1     → pending state: 1
value 1          → REPLACES pending state outright: 1  (discards whatever fn1 produced)
fn2(1)   = 2     → pending state: 2
```

Final state: `2`.

**Important nuance:** the direct-value entry doesn't "add" to the queue's progress — it **overwrites** it, because that step is just `state = 1`, ignoring what came before. It's a coincidence in this specific example that the literal value (`1`) matches what `fn1(0)` already produced. If `count` in the closure had been a different number, the direct-value step would visibly wipe out the updater's earlier work.

**General rule:** a literal `setCount(x)` placed between or after functional updaters discards everything the updaters built up to that point, because it isn't a function of the previous pending state — it's a fixed value computed once from the stale closure.

## Mental model summary

| Form | What's queued | How it's applied during flush |
|---|---|---|
| `setCount(x)` | A concrete value, computed **now** from the closure | Replaces the pending state entirely |
| `setCount(fn)` | The function itself | Called as `fn(pendingState)`; the return value becomes the new pending state |

- Reading state right after calling a setter (in the same function) always shows the **old** value — updates aren't applied synchronously, and re-render hasn't happened yet.
- Repeated `setCount(value)` calls in one handler collapse into a single effective update (net change = **+1** per handler, not +N).
- Repeated `setCount(fn)` calls compose correctly because each sees the latest pending value (net change = **+N** per handler).
- Mixing the two: order matters, and any literal-value call resets the chain to that literal, discarding prior functional progress.
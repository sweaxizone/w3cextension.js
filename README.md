# com.sweaxizone.w3c.extension

Various global utilities that are not included in the ECMAScript and WHATWG/W3C APIs. Not focusing on web DOM APIs for now, as I plan to use this for other purposes.

## Getting started

Clutter the global object by using the following `import` statement:

```ts
import "com.sweaxizone.w3c.extension";
```

## Short-augmented events

The following class defines `play` and `stop` events.

```ts
// media player
class MediaPlayer extends SAEventTarget {
    // declare events
    declare [EventRecord]: {
        play: MediaPlayerEvent,
        stop: MediaPlayerEvent,
    };
}
```

Extending `MediaPlayer` with more events:

```ts
// media player
class MoreSpecializedPlayer extends MediaPlayer {
    // declare events
    declare [EventRecord]: MediaPlayer[typeof EventRecord] & {
        // more events...
    };
}
```

> Note that event types must implement the `Event` interface.

## Simple enumerations

This is backwards-compatible with `type` unions of string literals.

```ts
const ExampleEnum = Enum({
    variantA: 0,
    variantB: 1,
}, {
    plus(e: ExampleEnum, inc: number): number {
        return ExampleEnum.valueOf(e) + inc;
    },
});
type ExampleEnum = Parameters<typeof ExampleEnum>[0];

const x: ExampleEnum = "variantA";
const y: string = ExampleEnum("variantB");
ExampleEnum.valueOf(x) // val: number
ExampleEnum.plus("variantA", 1) // 1
```

## Other additions

- `assert`
- `AssertionError`
- `trace(...)` (equivalent to `console.log()`)
- `etrace(...)` (equivalent to `console.error()`)
- `Math.clamp(value, from, to)`
- `BigInt.min(...)`
- `BigInt.max(...)`
- `SAByteArray` (like Adobe Flash's `ByteArray`)
- `isXMLName(argument)` (like E4X's `isXMLName()`)
- `Namespace` (like E4X's `Namespace`)
- `QName` (like E4X's `QName`)
- `Iterator.prototype.length()`
- `Chars`
- `String.prototype.chars()`

## License

Apache 2.0
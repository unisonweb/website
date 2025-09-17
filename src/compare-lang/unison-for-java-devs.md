---
layout: "compare-lang"
title: "Unison for Java devs"
description: "Comparing syntax and patterns between Unison and Java"
---

[[toc]]

# Comments

<div class="side-by-side"><div>

Unison comments are **not saved as a part of the function**, so they can be used as temporary notes while working, however, they do not persist in the codebase.

```unison
-- This is a single-line comment

{- This is a multi-line comment
   spanning multiple lines -}
```

If you want to leave a note to your future self or others, use a string literal instead:

```unison
aFunction =
  _ = "This is a magic number, don't change it"
  42 + 1
```

</div><div>

Java uses `//` for single-line comments and `/* ... */` for multi-line comments. Java code is saved to the file system, so comments are part of the codebase.

```java
// This is a single-line comment

/*
   This is a multi-line comment
   spanning multiple lines
*/
```

</div></div>

# Variables and basic expressions

<div class="side-by-side"><div>

Unison variables are immutable values that can be defined at the top-level of the program or within functions. Type signatures are located above the variable name, but are optional.

```unison
aText : Text
aText = "Hello, world!"

aChar : Char
aChar = ?A

aNat : Nat
aNat = 123

anInt : Int
anInt = +123

aBoolean : Boolean
aBoolean = true || false
```

</div><div>

Java variables are defined within classes or methods. Type signatures are found inline, with the type preceding the variable name.

```java
String aText = "Hello, world!";

char aChar = 'A';

int anInt = +123;

boolean aBoolean = true || false;
```

Java expects a semicolon at the end of each statement.


</div></div>

<div class="side-by-side"><div>

```unison
exampleFunction =
  localValue = 10
  newValue = localValue + 5
  newValue
```

Unison's type inference means you don't need to specify the type of `localValue` or the top-level function `exampleFunction`.

</div><div>

```java
int exampleMethod() {
    var localVar = 10;
    localVar += 5;
    return localVar;
}
```

Since Java 10, local variables can use `var` for type inference, but the method return type must always be explicitly declared.

</div></div>

## Access modifiers

<div class="side-by-side"><div>

```unison
noReassignments = "Initial value"
noReassignments = "🚫 Will not compile, variable is ambiguous."
```

In Unison, you cannot reassign or update a variable in a program once it has been defined, so there is no `final` keyword. Variables are enclosed within functions to limit their scope. There are no private/public access modifiers in Unison.

</div><div>

```java
String aReassignment = "Initial value";
aReassignment = "New value"; // ok
```

In Java, variables are mutable by default.

Java has access modifiers like `final`, `private`, `protected`, and `public` to control mutability and visibility.

```java
final String constantValue = "I cannot be changed";
private String privateValue = "Accessible only within this class";
protected String protectedValue = "Package and subclasses";
public String publicValue = "Accessible from anywhere";
```

</div></div>

## Void and Unit

<div class="side-by-side"><div>

All functions in Unison must return a value. But there are times when a function is called for some effect and there is no meaningful value to return. The value we use in these cases is `()` also known as `Unit`.

```unison
doSomething : ()
doSomething =
  Debug.trace "Doing something" ()
  ()
```

</div><div>

In Java, methods that do not return a value have the type `void`. There is no value of type `void`; it simply indicates the absence of something to return.

```java
void doSomething() {
    // No meaningful value to return
    System.out.println("Doing something");
}
```

</div></div>

## Collections

<div class="side-by-side"><div>

There are no interfaces for collections in Unison. Our standard library provides a variety of distinct collection types, like `List`, `Set`, and `Map`.

```unison
aList : List Nat
aList = [1, 2, 3, 4, 5]

aSet : Set Text
aSet = Set.fromList ["🍎", "🍌", "🍒"]

aMap : Map Text Int
aMap = Map.fromList [("📘", +2), ("📙", -4), ("📔", +3)]
```

Collections in Unison are **immutable** by default.

</div><div>

Java Collections are arranged in a hierarchy, with interfaces like `List`, `Set`, and `Map` which define basic operations for common data structures, and classes like `ArrayList`, `HashSet`, and `HashMap` to instantiate them.

```java
List<Integer> aList = List.of(1, 2, 3, 4, 5);

Set<String> aSet = Set.of("🍎", "🍌", "🍒");

Map<String, Integer> aMap = Map.of("📘", 2, "📙", -4, "📔", 3);
```

Java collections are **mutable** by default, but you can create immutable collections using factory methods from the `List`, `Set`, and `Map` interfaces.

</div></div>

### Modifying collections

<div class="side-by-side"><div>

In Unison, since collections are immutable, you create copies of the original with the desired changes.

```unison
map1 = Map.fromList [("📘", +2), ("📙", -4), ("📔", +3)]
map2 = Map.insert "📗" +5 map1
map3 = Map.delete "📙" map2
```
Because the outputs to the modification functions return new maps, you can chain them together with the `|>` operator instead of creating intermediate variables:

```unison
map3 = Map.fromList [("📘", +2), ("📙", -4), ("📔", +3)]
          |> Map.insert "📗" +5
          |> Map.delete "📙"
```
</div><div>

In Java, it's common to modify mutable collections in place.

```java
Map<String, Integer> map1 = new HashMap<>();
map1.put("📘", 2);
map1.put("📙", -4);
map1.put("📔", +3);
map1.put("📗", +5);
map1.remove("📙");
```

Attempting to modify an immutable collection will throw an `UnsupportedOperationException`.

```java
List<Integer> aList = List.of(1, 2, 3, 4, 5);
aList.add(6); // Throws UnsupportedOperationException
```

</div></div>

### Iterating over collections

<div class="side-by-side"><div>

In Unison, iteration is expressed through **higher-order functions** like `map`, `filter`, and `fold`. Instead of writing loops, you pass a function that describes how to transform or combine elements.

```unison
-- Double every number
List.map (n -> n * 2) [1, 2, 3]
-- [2, 4, 6]

-- Keep only even numbers
List.filter (n -> n % 2 === 0) [1, 2, 3, 4]
-- [2, 4]

-- Sum up a list
List.foldLeft (acc n -> acc + n) 0 [1, 2, 3, 4]
-- 10
```

This style avoids explicit indexing and mutation. Iteration is __declarative__: you say what to do with each element, not how to step through the collection.

</div><div>

In Java, the traditional approach uses the `Iterable` pattern, either with an __explicit loop__ or an enhanced for-loop:

```
List<Integer> numbers = List.of(1, 2, 3, 4, 5);

for (int i = 0; i < numbers.size(); i++) {
    int n = numbers.get(i);
    System.out.println(n * 2);
}

for (int n : numbers) {
    System.out.println(n * 2);
}
```

Here, iteration is __imperative__: you describe how to step through each element and also describe the transformation to apply.

```java
List<Integer> doubled =
    numbers.stream()
           .map(n -> n * 2)
           .toList();

List<Integer> evens =
    numbers.stream()
           .filter(n -> n % 2 == 0)
           .toList();

int sum =
    numbers.stream()
           .reduce(0, (acc, n) -> acc + n);
```

Since Java 8, collections also support lambdas and streams, which bring them closer to Unison’s functional style.

</div></div>

### Lambdas

<div class="side-by-side"><div>

The argument surrounded by parentheses is an anonymous function (or lambda).

```unison
List.foldLeft (acc n -> acc + n) 0 [1, 2, 3, 4]
```

The function above takes two arguments: `acc` (the accumulator) and `n` (the current element). The function body is to the right of the `->`.

```unison
List.map (n -> let
  doubled = n * 2
  Debug.trace "Processing" (Nat.toText n)
  doubled
) [1, 2, 3]
```

The function body can be a single expression or a block of expressions using `let` and whitespace to delimit them.

</div><div>

```java
int sum =
    numbers.stream()
           .reduce(0, (acc, n) -> acc + n);
```

Java 8's lambda syntax is similar to Unison's, but multiple arguments are separated by commas within parentheses.

```java
numbers.stream()
       .map(n -> {
           int doubled = n * 2;
           System.out.println("Processing " + n);
           return doubled;
       })
       .toList();
```

Curly braces `{}` are used to define a block of statements, and `return` is required to return a value from the block.

</div></div>

## Nullability

<div class="side-by-side"><div>

In Unison, all values are **non-nullable** by default. Instead, values that might be absent are represented by a type, called `Optional`.

```unison
someValue : Optional Nat
someValue = Some 42

noneValue : Optional Nat
noneValue = None
```

Optional values _must be unwrapped_ to access the value contained in them. We use functions like `Optional.map`, `Optional.getOrElse`, or pattern matching to transform or handle the absence of a value.

```unison
opt: Optional Text
opt = Some "value"

Optional.map (str -> Debug.trace "Got value:" str) opt

-- Using `getOrElse` to provide a default if `opt` is `None`
Optional.map (str -> str ++ "!!") opt
  |> Optional.getOrElse "default"
```

</div><div>

In Java, you often have to check for **null** before using a value. Failure to do so can lead to `NullPointerException`s.

```java
Integer value = getValue();
if (value != null) {
    System.out.println(value);
}
```

Java 8 introduced the `Optional` class:

```java
Optional<String> opt = Optional.of("some value");

// void operations require a different method
opt.ifPresent(str -> System.out.println(str));

// Using `orElse` to provide a default if `opt` is empty
opt.map(str -> str + "!!").orElse("default");
```

Many of the methods in the `Optional` class are similar to those in Unison's `Optional` type.

</div></div>

## Delayed computations

<div class="side-by-side"><div>

In Unison, **delayed computations** are used to represent computations that are not executed until their result is needed. Think of delayed computations as zero argument functions, `() -> r`. In type signatures, they are represented with the syntactic sugar `'r`.

```unison
delayedVal : 'Nat
delayedVal = do
  -- No debug output yet
  Debug.trace "Computing value" ()
  42
```

The `do` keyword is used to introduce a delayed computation block.
To call a delayed computation, use the `()` syntax.

```unison
-- The debug line will not appear until we call the thunk
result = delayedVal()
```

</div><div>

Java does not have built-in support for delayed computations. However, you can achieve similar behavior using the `Supplier<T>` interface, which represents a "supplier" of results, taking no arguments and returning a value of type `T`.

```java
Supplier<Integer> delayedVal = () -> {
    System.out.println("Computing value");
    return 42;
};
```

Call the supplier with `.get()`:

```java
int result = delayedVal.get();
```

</div></div>

# Method and function syntax

<div class="side-by-side"><div>

Unison is a functional language, so we use **functions** to describe program behavior. Here are some simple function examples:

```unison
Nat.add : Nat -> Nat -> Nat
Nat.add x y = x + y

Nat.sum : [Nat] -> Nat
Nat.sum ns =
  List.foldLeft (acc n -> acc + n) 0 ns
```

* Type signatures are located above the function name, not inline.
* The return type of the function is the _last_ type to the right of the `->`.
* Multiple parameters are delimited in the signature by `->`, not commas.
* In the definition, parameters are listed after the function name, separated by spaces. The function body follows the `=`.
* The function body is whitespace-delimited. Blocks of code are indented at the same level to represent lexical scope.
* There is no explicit return statement; the value of the last expression in the function body is returned.

</div><div>

Java is an object-oriented language, so **methods** that belong to classes are used to describe program behavior. Static methods can be called without creating an instance of a class, so let's use them to introduce basic syntax differences.

```java
class MathUtils {
    public static int add(int x, int y) {
        return x + y;
    }

    public static int sum(List<Integer> ns) {
        return ns.stream().reduce(0, (acc, n) -> acc + n);
    }
}
```

* Type signatures are inline, with the access modifier and return type preceding the method name.
* Multiple parameters are delimited by commas within parentheses.
* The function body is enclosed in curly braces `{}`.
* An explicit `return` statement is required to return a value.

</div></div>

## Calling methods and functions

<div class="side-by-side"><div>

In Unison, functions are called without parentheses or commas separating their arguments. Parentheses are only needed to group expressions or clarify precedence.

```unison
result1 = Nat.add 2 3
result2 = Nat.sum [1, 2, 3, 4, 5]
result3 = Nat.add (Nat.sum [1, 2]) 3
```

</div><div>

In Java, method arguments are separated by commas within parentheses.

```java
int result1 = MathUtils.add(2, 3);
int result2 = MathUtils.sum(List.of(1, 2, 3, 4, 5));
int result3 = MathUtils.add(MathUtils.sum(List.of(1, 2)), 3);
```

</div></div>

<div class="side-by-side"><div>

## Functions

Functions are standalone terms, defined at the top-level of a program, within **namespaces**, or within other functions. Instead of mutating the state of an instance of a class, functions accept the values that they operate on, describe some behavior or transformation, and then return new values.

```unison
Greeter.getName : '{IO, Exception} Text
Greeter.getName = do
  printLine "What is your name?"
  readLine()

Greeter.greet : Text -> {IO, Exception} ()
Greeter.greet name =
  if Text.isEmpty name then
    printLine "Hello, stranger!"
  else
    printLine ("Hello, " ++ name ++ "!")
```

The functions above are defined in the `Greeter` namespace, delimited by the dot prefix in the function name. **Namespacing** helps organize related functions together, but does not imply any state or behavior is shared between them.

</div><div>

## Methods

Java uses **classes** to _encapsulate data and behavior_. **Methods** belong to a class, and describe the set of behaviors that an instance of the class may perform.

```java
import java.util.Scanner;

public class Greeter {
    private String name;

    public void getName() {
        Scanner scanner = new Scanner(System.in);
        System.out.println("What is your name?");
        this.name = scanner.nextLine();
    }

    public void greet() {
        if (this.name != null && !this.name.isEmpty()) {
            System.out.println("Hello, " + this.name + "!");
        } else {
            System.out.println("Hello, stranger!");
        }
    }
}
```

</div></div>

<div class="side-by-side"><div>

Despite looking similar to Java method calls, due to the `Greeter.` prefix, when calling the `Greeter.greet` function in Unison, we explicitly pass in the `name` value that it operates on.

```unison
main : '{IO, Exception} ()
main = do
  name = Greeter.getName()
  Greeter.greet name
```

A program is built by chaining together, or _composing_, the inputs and outputs of many functions.

</div><div>

In Java programs, you create instances of classes and invoke methods on them, changing the state of the object or performing actions based on that state.

```java
public class Main {
  public static void main(String[] args) {
    Greeter greeter = new Greeter();
    greeter.getName();
    greeter.greet();
  }
}
```

</div></div>

## First-class functions

<div class="side-by-side"><div>

In Unison, functions are **first-class citizens**, meaning they can be passed as arguments to other functions, returned from functions, and assigned to variables.

In a signature, the function type is written as `(i -> o)`, with parentheses to indicate the argument is a function.

```unison
applyTwice : (a -> a) -> a -> a
applyTwice f x =
  f (f x)
```

</div><div>

In Java, functions are not first-class citizens. You can pass a `Function <A, B>` object as an argument to a method; however, in Java, you might employ a different pattern for code reuse, such as passing objects that implement a specific interface.

```java
import java.util.function.Function;
public static <A> A applyTwice(Function<A, A> f, A x) {
    return f.apply(f.apply(x));
}
```

</div></div>

# Data modeling

An in-depth guide to the differences in data modeling between functional languages like Unison and object-oriented languages like Java is out of scope for now, but here are some high-level differences.

<div class="side-by-side"><div>

## Data types

Unison does not have classes, so there are no methods, no instance variables, no `new` constructor keyword, and no `this` keyword. Instead, we use **data types** to model how data is structured and **functions** that transform them to model behavior.

A type can represent data with multiple variants (when a type can be created in one way or another) and data with multiple fields (when a type has several attributes), often in combination. Here's a simple example of a data type representing JSON values:

```unison
type JsonValue
  = JsonNull
  | JsonBoolean Boolean
  | JsonNumber Float
  | JsonString Text
  | JsonArray (List JsonValue)
  | JsonObject (Map Text JsonValue)
```

This `JsonValue` type can represent any JSON data structure. Each variant, or **data constructor**, is separated by `|`, and some variants (like `JsonArray` and `JsonObject`) contain a reference to the same type, allowing for nested structures.

```unison
JsonValue.toJson : JsonValue -> Text
JsonValue.toJson value =
  match value with
    JsonNull -> "null"
    JsonBoolean b -> Boolean.toText b
    JsonNumber n -> Float.toText n
    JsonString s -> "\"" ++ Text.replaceAll "\"" "\\\"" s ++ "\""
    JsonArray arr -> formatArray arr
    JsonObject obj -> formatObj obj
```

Rather than overriding the `toString` method on each variant, we define a single function that handles all the data constructors using pattern matching.

```unison
aJsonString : JsonValue
aJsonString = JsonString "Hello, world!"

aJsonNumber : JsonValue
aJsonNumber = JsonNumber 42.0

aJsonArray : JsonValue
aJsonArray = JsonArray [aJsonString, aJsonNumber]
```

There is **no subclassing** in the Unison type system. All these values have the same type, `JsonValue`.

</div><div>

## Classes and hierarchies

In Java, **classes** and **class hierarchies** are used to model data and behavior. Overriding methods in subclasses allows for ad-hoc polymorphism.

```java
abstract class JsonValue {
    public abstract String toJson();
}
```

Each JSON type might be implemented as a subclass that implements the `toJson` method to handle its specific serialization logic:

```java
class JsonBoolean extends JsonValue {
    private final boolean value;
    public JsonBoolean(boolean value) { this.value = value; }

    @Override
    public String toJson() {
        return Boolean.toString(value);
    }
}

// Similar implementations for JsonNull, JsonNumber, JsonString...

class JsonArray extends JsonValue {
    private final List<JsonValue> values = new ArrayList<>();

    public void add(JsonValue v) { values.add(v); }

    @Override
    public String toJson() {
        return "[" + values.stream()
                           .map(JsonValue::toJson)
                           .reduce((a, b) -> a + ", " + b)
                           .orElse("") + "]";
    }
}
```

Creating an instance of a class involves using the `new` keyword, and all instances can be treated as their subclasses or the common superclass type, `JsonValue`, with casting if needed.

```java
JsonValue aJsonString = new JsonString("Hello, world!");
JsonValue aJsonNumber = new JsonNumber(42.0);
JsonArray aJsonArray = new JsonArray();
aJsonArray.add(aJsonString);
aJsonArray.add(aJsonNumber);
JsonValue aJsonArrayValue = aJsonArray; // Upcast to JsonValue
```

</div></div>

## Record types

<div class="side-by-side"><div>

Unison has **record types** for modeling immutable single-constructor types with named fields.

```unison
type Point = {
  x : Int,
  y : Int
  }
```

Defining a record type in Unison automatically creates get, set, and modify functions for each field.

```unison
Point.x        : Point -> Int
Point.x.modify : (Int ->{g} Int) -> Point ->{g} Point
Point.x.set    : Int -> Point -> Point
Point.y        : Point -> Int
Point.y.modify : (Int ->{g} Int) -> Point ->{g} Point
Point.y.set    : Int -> Point -> Point
```

Although the dot notation in Unison's record types _looks similar_ to Java's mutable method calls, modifying a field _returns a new record with the updated value_, leaving the original unchanged.

```unison
pointA : Point
pointA = Point +20 -60

pointB = Point.x.set +30 pointA
pointC = Point.y.modify (yVal -> yVal + +80) pointB
```

</div><div>

Since Java 16, **record classes** provide a concise way to create simple "data carrier" classes with immutable fields.

```java
public record Point(int x, int y) {}
```

Without records, you would typically use a regular class with private fields and public getters:

```java
public class Point {
    private final int x;
    private final int y;

    public Point(int x, int y) {
        this.x = x;
        this.y = y;
    }

    public int getX() {
        return x;
    }

    public int getY() {
        return y;
    }
}
```

</div></div>

## Generics

<div class="side-by-side"><div>

In Unison, **type variables** are used to define generic functions and data types. Type variables are **lowercase letters** that stand in for any type.

In a type definition, type variables are listed after the type name:

```unison
type Box a = { value : a }
```

In a function signature, you can refer to type variables without declaring them explicitly; they are inferred from their usage:

```unison
Box.prettyPrint : Box a -> (a -> Text) -> Text
Box.prettyPrint box toStringFunc =
  "Box(" ++ toStringFunc (Box.value box) ++ ")"
```

All types in Unison are invariant, so concepts like type bounds do not apply.

```unison
-- Type `Box Boolean` is inferred
boolBox = Box true

natBox : Box Nat
natBox = Box 42

Box.prettyPrint boolBox Boolean.toText
```

Unison's type system does not erase generic type information at runtime.

</div><div>

Java supports **generics** to define classes, interfaces, and methods that operate on types later specified by the user. Generic type parameters are **uppercase letters** in `<>` brackets.

```java
class Box<T> {
    private T value;

    public Box(T value) {
        this.value = value;
    }

    public T getValue() {
        return value;
    }
}
```

In a method signature, generic type parameters are declared in angle brackets `< >` before the return type:

```java
public <T> String prettyPrint(Box<T> box, Function<T, String> toStringFunc) {
    return "Box(" + toStringFunc.apply(box.getValue()) + ")";
}
```

Because Java supports more complex type hierarchies than Unison, Java code might employ wildcard types like `<?>` or bounded type parameters like `<T extends Number>`. These concepts do not have direct equivalents in Unison.

```java
// Type Box<Boolean> is inferred with diamond operator <>
boolBox = new Box<>(true);
intBox = new Box<Int>(42);
prettyPrint(boolBox, Object::toString);
```

</div></div>

## Behavioral abstraction

<div class="side-by-side"><div>

### Abilities

One approach to defining behavioral contracts in Unison is through **abilities**. Abilities are a way to describe a set of operations, typically ones that involve some kind of effect, without dictating how that contract must be fulfilled.

This is how we might define a simple logging ability in Unison. We don't care where the log messages go, just that we can capture a text value and log it.

```unison
ability Logger where
  log : Text -> ()
```

In our application logic, we can use the general `Logger.log` operation. Abilities are tracked in the type system, a bit like checked exceptions in Java. The `{Logger}` indicates that this function requires something that handles the `Logger` ability or it will be passed up the call stack as a requirement until some bit of code provides an implementation for it.

``` unison
initialize : '{Logger} ()
initialize = do
  Logger.log "Initializing application"
```

The functions that provide concrete behavior for an ability are called **handlers**. For now, we won't dig into _how_ handlers work, but they typically translate the operations of an ability into other abilities, like `IO` for console output, or transform them into pure values, like logging to a `List` in memory.

```unison
ConsoleLogger.logger : '{Logger} a -> {IO, Exception} a
ConsoleLogger.logger l =
  handle l() with cases
    {Logger.log msg -> resume} ->
      printLine ("LOG: " ++ msg)
      ConsoleLogger.logger do resume()
    {pure} -> pure
```

To apply a handler, you pass it a code block or expression that uses the ability _as an argument_.

```unison
main : '{IO, Exception} ()
main = do ConsoleLogger.logger do
  Logger.log "I'm passed to the logger handler"
  initialize()
  Logger.log "Ending program"
```

</div><div>

### Interfaces

An **interface** specifies a set of methods that a class must implement, without dictating the concrete implementation. You can write code that works with any object that satisfies the interface.

```java
interface Logger {
    void log(String message);
}

class ConsoleLogger implements Logger {
    @Override
    public void log(String message) {
        System.out.println("LOG: " + message);
    }
}
```

The `ConsoleLogger` class provides a concrete implementation of the `Logger` interface. You can then use the `Logger` interface as a type for variables, method parameters, or return types.

```java
public class Main {

    // The Logger is accepted as a regular parameter
    public void initialize(Logger logger) {
        logger.log("Initializing application");
    }

    public static void main(String[] args) {
        Logger logger = new ConsoleLogger();
        initialize(logger);
    }
}
```

One major difference between Unison's abilities and Java's interfaces is that an interface is ultimately instantiated as an _object_. Abilities are not objects that can be passed around; they're more like properties of functions that are tracked in the type system. Picture the ability as a `throws` clause in the Java function signature `public void initialize() throws Logger`.

</div></div>

# Control flow

## Conditionals

<div class="side-by-side"><div>

In Unison, conditionals are expressions that control the flow of execution and return values. A conditional expression has three parts: the `if` condition, which must be a `Boolean`, the `then` branch, and the `else` branch.

```unison
sign : Int -> Text
sign n =
  if n > +0 then
    "positive"
  else if n < +0 then
    "negative"
  else
    "zero"
```

In Unison, you cannot have an `if` without an `else` branch. This will fail to compile, and you cannot save it to your codebase:

```unison
nope : Nat -> Text
nope n =
  if n > 0 then
    "positive"
  -- 🚫 Will not compile, missing else branch.
```

</div><div>

In Java, conditionals are statements that control the flow of execution. The `if` statement has a condition followed by a block of code, `{}`, for the "then" branch, and optionally an `else` branch.

```java
String sign(int n) {
    if (n > 0) {
        return "positive";
    } else if (n < 0) {
        return "negative";
    } else {
        return "zero";
    }
}
```

In Java, you can have an `if` statement without an `else` branch:

```java
String maybePositive(int n) {
    if (n > 0) {
        return "positive";
    }
    return "not positive";
}
```

</div></div>

## Switch statements and pattern matching

<div class="side-by-side"><div>

In Unison, **pattern matching** directs the flow of execution by branching on the shape and/or content of a value, without nesting or chaining multiple if/else conditions.

```unison
cardSuit : Nat -> Text
cardSuit n =
  match n with
    1 -> "Hearts"
    2 -> "Diamonds"
    3 -> "Clubs"
    4 -> "Spades"
    _ -> "Invalid suit"
```

The `_` wildcard pattern matches any value not matched by previous patterns. A `match` _expression must be exhaustive_, meaning all possible inputs must be handled.

</div><div>

Java **switch statements** provide a way to execute different branches of code based on a value. However, they are less flexible than Unison's pattern matching.

```java
String cardSuit(int n) {
    switch (n) {
        case 1:
            return "Hearts";
        case 2:
            return "Diamonds";
        case 3:
            return "Clubs";
        case 4:
            return "Spades";
        default:
            return "Invalid suit";
    }
}
```

`default` is slightly different from Unison's `_` wildcard pattern, as a switch statement that does not contain explicit `return` statements or `break` statements will run the `default` case.

Switch statements _do not need to be exhaustive_, so if a value does not match any case and there is no `default`, the program simply continues after the switch block.

</div></div>

### Decomposing types

<div class="side-by-side"><div>

In Unison, we use structural pattern matching to decompose types into their data constructors, extracting fields and matching on specific variants of a type.

```unison
type Shape = Circle Float | Square Float | Rectangle Float Float

area : Shape -> Float
area shape =
  match shape with
    Circle r -> 3.14 * r * r
    Square s -> s * s
    Rectangle w h -> w * h
```

Since there's no `.radius` method on `Circle` or no `.side` method on `Square`, pattern matching is one of the primary ways we access the values contained in a data type.

</div><div>

Newer Java 17+ versions support pattern matching on `sealed` interfaces in `switch` statements:

```java
sealed interface Shape permits Circle, Square, Rectangle { }

record Circle(double radius) implements Shape { }
record Square(double side) implements Shape { }
record Rectangle(double width, double height) implements Shape { }

// Inside some class
static double area(Shape shape) {
        return switch (shape) {
            case Circle c -> Math.PI * c.radius() * c.radius();
            case Square s -> s.side() * s.side();
            case Rectangle r -> r.width() * r.height();
        };
    }
```

In older Java versions, you might employ `instanceOf` checks in `if/else` statements to achieve similar behavior:

```java
static double area(Shape shape) {
    if (shape instanceof Circle c) {
        return Math.PI * c.radius() * c.radius();
    } else if (shape instanceof Square s) {
        return s.side() * s.side();
    } else if (shape instanceof Rectangle r) {
        return r.width() * r.height();
    } else {
        throw new IllegalArgumentException("Unknown: " + shape);
    }
}
```

</div></div>

### Pattern guards

<div class="side-by-side"><div>

Pattern matching can include guards, which are additional boolean conditions following `|` in the pattern that must be satisfied for a pattern to match.

```unison
grade : Nat -> Text
grade score =
  match score with
    s | s >= 90 -> "A"
    s | s >= 80 -> "B"
    s | s >= 70 -> "C"
    s | s >= 60 -> "D"
    _ -> "F"
```

</div><div>

Java switch statements do not support guards. You would need to use if/else statements for similar functionality.

```java
String grade(int score) {
    if (score >= 90) {
        return "A";
    } else if (score >= 80) {
        return "B";
    } else if (score >= 70) {
        return "C";
    } else if (score >= 60) {
        return "D";
    } else {
        return "F";
    }
}
```

</div></div>

## Exception handling

<div class="side-by-side"><div>

In Unison, exceptions are an **ability** that works similarly to Java's checked exceptions. Functions that may throw exceptions must declare the `Exception` ability in their type signature, `{Exception}`.

```unison
safeDiv : Nat -> Nat -> {Exception} Nat
safeDiv x y =
  if y == 0 then
    Exception.raiseFailure
      (typeLink ArithmeticException) "Divide by zero" (x, y)
  else x / y
```

The calling function must handle the exception. One way to do this is by applying functions like `Exception.catch`, which translates the exception into a value of `Either` `Left`, representing a failure, or `Right`, enclosing the successful result:

```unison
leftValue : Either Failure Nat
leftValue = Exception.catch do safeDiv 10 0
-- Left (Failure ArithmeticException "Divide by zero" (10, 0))

rightValue : Either Failure Nat
rightValue = Exception.catch do safeDiv 10 2
-- Right 5
```

Or, the calling function can also propagate the exception by declaring the `Exception` ability in its own type signature:

```unison
callUnsafeDiv : Nat -> Nat -> '{Exception} Nat
callUnsafeDiv x y = do
  result = safeDiv x y
  -- Might never reach here if an exception is raised
  Debug.trace "Result is:" (Nat.toText result)
  result
```

The "type" of the exception is less important in Unison than in Java, since the thing that appears in the type signature is just `Exception`, but you can raise and catch exceptions that contain different types, communicating different failure modes.

</div><div>

In Java, exceptions are part of the language's error-handling mechanism. Methods that may throw checked exceptions must declare them in their `throws` clause.

```java
public int safeDiv(int x, int y) throws ArithmeticException {
    if (y == 0) {
        throw new ArithmeticException("Divide by zero");
    }
    return x / y;
}
```

When calling a method that throws a checked exception, you must either handle the exception with a `try-catch` block or declare it in your own method's `throws` clause.

```java
public void callUnsafeDiv(int x, int y) {
    try {
        int result = safeDiv(x, y);
        System.out.println("Result is: " + result);
    } catch (ArithmeticException e) {
        System.out.println("Error: " + e.getMessage());
    }
}

public void propagate(int x, int y) throws ArithmeticException {
    int result = safeDiv(x, y);
    System.out.println("Result is: " + result);
}
```

Java distinguishes recoverable exceptions from unchecked exceptions, which do not need to be declared or caught. Unison does not make this distinction; all exceptions are treated the same way.

</div></div>

# Running programs

<div class="side-by-side"><div>

The entry point to a Unison program can be any delayed computation which may perform the `IO` and `Exception` effects, `'{IO, Exception} r`. The `IO` ability indicates that the function might use `IO` operations, and the `Exception` ability indicates that it may raise exceptions.

```unison
main : '{IO, Exception} ()
main = do
  printLine "Hello, Unison!"

mainWithArgs : '{IO, Exception} ()
mainWithArgs = do
  args = getArgs()
  printLine ("Arguments: " ++ Text.join args)

mainException : '{Exception} Nat
mainException = do
  safeDiv 10 0

mainPure : 'Nat
mainPure = do 42
```

All of the above are valid entry points to a Unison program. The function name is not special; you can name it anything you like.

</div><div>

In Java, the entry point to a program is the `main` method, which must be declared as `public static void main(String[] args)` within a class. The `String[] args` parameter allows command-line arguments to be passed to the program.

```java
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, Java!");
    }
}
```

</div></div>
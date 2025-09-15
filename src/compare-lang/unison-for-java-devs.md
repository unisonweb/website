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

Unison variables are immutable values that can be defined at the top level of the program or within functions. Type signatures are located above the variable name, but are optional.

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

Unison's type inference means you don't need to specify the type of `localValue` or the top level function `exampleFunction`.

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

### Access modifiers

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

Java has access modifiers like `final`, `private`, `protected`, and `public` to control variable mutability and visibility.

```java
final String constantValue = "I cannot be changed";
private String privateValue = "Accessible only within this class";
protected String protectedValue = "Package and subclasses";
public String publicValue = "Accessible from anywhere";
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
List.filter (n -> n % 2 == 0) [1, 2, 3, 4]
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

Optional values _must be unwrapped_ to access the value contained in them. We use functions like `Optional.map`, `Optional.fold`, or pattern matching to transform or handle the absence of a value.

```unison
opt: Optional Text
opt = Some "value"

Optional.map (str -> Debug.trace "Got value:" str) opt
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

opt.ifPresent(str -> System.out.println(str));
```

The `ifPresent` method is similar to `Optional.map` in Unison.

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

## Encapsulation and function composition

<div class="side-by-side"><div>

Functions are standalone terms, defined at the top level of a file or within other functions. Instead of mutating the state of an instance of a class, functions accept the values that they operate on, describe some behavior or transformation, and then return new values.

```unison
greeter.getName : '{IO, Exception} Text
greeter.getName = do
  printLine "What is your name?"
  name = readLine()

greeter.greet : Text -> '{IO, Exception} ()
greeter.greet name = do
  if Text.isEmpty name then
    printLine "Hello, stranger!"
  else
    printLine ("Hello, " ++ name ++ "!")
```

```unison
main : '{IO, Exception} ()
main = do
  name = greeter.getName()
  greeter.greet name
```

A program is built by chaining together, or _composing_, the inputs and outputs of many functions.

</div><div>

Java uses classes to _encapsulate data and behavior_. Methods belong to a class, and can access or modify the data enclosed in it. They describe the set of behaviors that an instance of the class may perform.

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

In Java programs, you create instances of classes and invoke methods on them, changing their internal state and performing actions.

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

# Data modeling

<div class="side-by-side"><div>

## Data types

Unison does not have classes, so there are no instance methods, no instance variables, no `new` constructor keyword, and no `this` keyword. Instead, we use data types to model how data is structured and functions to model behavior.

A type can represent data with multiple variants (when a type can be created in one way or another) and data with multiple fields (when a type has several attributes), often in combination:

```unison
type JsonValue
  = JsonNull
  | JsonBoolean Bool
  | JsonNumber Float
  | JsonString Text
  | JsonArray (List JsonValue)
  | JsonObject (Map Text JsonValue)
```

This `JsonValue` type can represent any JSON data structure. Each variant corresponds to a different kind of JSON value, and some variants (like `JsonArray` and `JsonObject`) contain a reference to the same type, allowing for nested structures.

Functions can then be defined to operate on this data type, such as a function to serialize a `JsonValue` to a JSON string:

```unison
JsonValue.toJson : JsonValue -> Text
JsonValue.toJson value =
  match value with
    JsonNull -> "null"
    JsonBoolean b -> if b then "true" else "false"
    JsonNumber n -> Float.toText n
    JsonString s -> "\"" ++ Text.replace "\"" "\\\"" s ++ "\""
    JsonArray arr -> "[" ++ List.intercalate ", " (List.map JsonValue.toJson arr) ++ "]"
    JsonObject obj -> "{" ++ Map.toList obj |> List.map (pair -> "\"" ++ pair.key ++ "\": " ++ JsonValue.toJson pair.value) |> List.intercalate ", " ++ "}"
```

</div><div>

## Classes and hierarchies

In Java, classes and class hierarchies are used to model data and behavior. Overriding methods in subclasses allows for polymorphism, and interfaces define shared behavior across different classes.

This example models the same JSON data structure as above, using an abstract class and concrete subclasses:

```java

import java.util.*;

abstract class JsonValue {
    public abstract String toJson();
}

class JsonNull extends JsonValue {
    @Override
    public String toJson() {
        return "null";
    }
}

class JsonBoolean extends JsonValue {
    private final boolean value;
    public JsonBoolean(boolean value) { this.value = value; }

    @Override
    public String toJson() {
        return Boolean.toString(value);
    }
}

class JsonNumber extends JsonValue {
    private final double value;
    public JsonNumber(double value) { this.value = value; }

    @Override
    public String toJson() {
        return Double.toString(value);
    }
}

class JsonString extends JsonValue {
    private final String value;
    public JsonString(String value) { this.value = value; }

    @Override
    public String toJson() {
        return "\"" + value.replace("\"", "\\\"") + "\"";
    }
}

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

class JsonObject extends JsonValue {
    private final Map<String, JsonValue> fields = new LinkedHashMap<>();

    public void put(String key, JsonValue value) { fields.put(key, value); }

    @Override
    public String toJson() {
        return "{" + fields.entrySet().stream()
                           .map(e -> "\"" + e.getKey() + "\":" + e.getValue().toJson())
                           .reduce((a, b) -> a + ", " + b)
                           .orElse("") + "}";
    }
}
```

</div></div>


## Record types

<div class="side-by-side"><div>

Unison has **record types** for modeling immutable single constructor types with named fields.

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

Modifying a field returns a new record with the updated value, leaving the original unchanged.

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

# Control flow

## Conditionals

<div class="side-by-side"><div>

In Unison, conditionals are expressions that control the flow of execution and return values. A conditional expression has three parts: the `if` condition which must be a `Boolean`, the `then` branch, and the `else` branch.

```unison
sign : Int -> Text
sign n =
  if n > 0 then
    "positive"
  else if n < 0 then
    "negative"
  else
    "zero"
```

In Unison, you cannot have an `if` without an `else` branch. This will fail to compile and you cannot save it to your codebase:

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

`default` is slightly different from Unison's `_` wildcard pattern, as a switch statement which does not contain explicit `return` statements or `break` statements will run the `default` case.

Switch statements _do not need to be exhaustive_, so if a value does not match any case and there is no `default`, the program simply continues after the switch block.

</div></div>

### Pattern guards

<div class="side-by-side"><div>

In Unison, pattern matching can include guards, which are additional boolean conditions following `|` in the pattern that must be satisfied for a pattern to match.

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

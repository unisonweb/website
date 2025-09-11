---
layout: "compare-lang"
title: "Unison for Java devs"
description: "Comparing syntax and patterns between Unison and Java"
---

[[toc]]

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

Java(10+) local variables can use `var` for type inference, but the method return type must always be explicitly declared.

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

There are no interfaces for collections in Unison. Our standard library provides a variety of distinct collection types, like `List`, `Set`, and `Map`, and more specialized collections like `NonEmptyList` and `NatMap`.

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

Java collections are **mutable** by default, but you can create immutable collections using factory methods like these from the `List`, `Set`, and `Map` interfaces.

</div></div>

### Modifying collections

<div class="side-by-side"><div>

If you're coming from a Java background, you might be used to modifying collections in place. In Unison, since collections are immutable, you create copies of the original with the desired changes.

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

In Java, you can modify collections in place if they are mutable.

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
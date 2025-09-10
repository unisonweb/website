---
layout: "compare-lang"
title: "Unison for Java devs"
description: "Comparing syntax and patterns between Unison and Java"
---

[[toc]]

## Variables and basic types

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

Java expects a semicolon at the end of each statement, Unison does not.


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

<div>

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
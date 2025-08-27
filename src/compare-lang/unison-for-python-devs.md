---
layout: "compare-lang"
title: "Unison for Python devs"
description: "Comparing syntax and patterns between Unison and Python 3"
---

[[toc]]

# Variables and expressions

<div class="side-by-side">
<div>

```unison
aText : Text
aText = "Hello, world!"

aNat : Nat
aNat = 123

anInt : Int
anInt = +123

aBoolean : Boolean
aBoolean = true || false
```

Unison terms can be defined at the top level of a program. Unlike Python variables, all Unison terms are __immutable__.

``` unison
aFunction =
  noReassignments = "Initial value"
  noReassignments = "🚫 Will not compile, variable is ambiguous."
```

That means once a variable is introduced, it cannot be changed or reassigned by the program. To update a value, you create a new term that copies the old value and applies the change.

</div>
<div>

```python
a_string = "Hello, world!"

an_int = 123

a_float = 3.14

a_boolean = True or False

a_reassignment = "initial value"
a_reassignment = "new value"
```

Python variables are __mutable__ references to values.

Python uses the `int` type for both positive and negative whole numbers. In Unison, it's common to use `Nat` for non-negative integers and `Int` for integers that may be negative. All numeric values using Unison's `Int` type must be signed with either a `+` or `-` prefix.

</div>
</div>

<div class="side-by-side"><div>

```unison
aNumber : Int
aNumber = "🔤 A string being assigned to an Int won't compile"
```

Unison is a __statically typed language__, so every definition has a type at compile time. Type signatures can be inferred, but they are often found above the term for clarity. Unison uses `:` to separate the name of the term from its type.

</div><div>

```python
a_str = str("Is this a string?")
type(a_str)
a_str = 123  # Now it's an int!
type(a_str)
```

In Python 3, type hints can be used to indicate the expected type of a variable, but they are not enforced at runtime. Python is __dynamically typed__, so a variable can change its type at any time.

</div>
</div>

## Tuples

<div class="side-by-side">
<div>

Unison's tuple type can hold an arbitrary fixed number of values, each of potentially different types. Tuple elements are accessed using `at1`, `at2`, etc., for the first, second, and subsequent elements.

```unison
aTuple : (Text, Nat, Int)
aTuple = ("📘", 2, -100)

first = at1 aTuple
second = at2 aTuple
```

You cannot unpack a tuple at the top level of a file, outside of a function body. However, _inside_ a function body, for local variable assignments, you can decompose a tuple like this:

```unison
foo =
  aTuple = ("📘", 2, -100)
  (first, second, third) = aTuple
  first ++ (Nat.toText second) ++ (Int.toText third)
```

</div>
<div>

Both Python and Unison tuples are immutable.

In Python, accessing tuple elements is done with zero-based indexing.

```python
a_tuple = ("📘", 2, -100)

first = a_tuple[0]
second = a_tuple[1]
```

Unpacking a tuple in Python looks like this:

```python
a_tuple = ("📘", 2, -100)
(first, second, third) = a_tuple
```

</div></div>

## Collections

<div class="side-by-side">
<div>

Unison collections are immutable by default and cannot contain values of different types.

```unison
aList : List Nat
aList = [1, 2, 3, 4, 5]

aMap : Map Text Text
aMap = Map.fromList [("🍎", "a"), ("🫐", "100"), ("🍐", "true")]

aSet : Set Int
aSet = Set.fromList [+1, -2, +3, -4, +5]
```

Unison does not have special syntax for creating `Maps` or `Sets`, so they are often created from a list of tuples.

In Unison, the following does not mutate the original `Map`. Inserting the new key and value creates a new `Map` and binds it to a variable:

```unison
map1 = Map.fromList [("💙", 1), ("🩷", 12), ("💚", 35)]
map2 = Map.insert "💛" 100 map1
```

</div>
<div>

Python collections like lists and dicts are mutable by default. The types of values in a collection can vary.

```python
a_list = [1, 2, 3, 4, 5]

a_dict = {"🍎": "value1", "🫐": 100, "🍐": True}

a_frozen_set = frozenset([1, -2, 3, -4, 5])
```

Dictionary keys in Python must be hashable. In Unison, there is no restriction on key types in a `Map`.

In Python, you might use `frozenset` or tuples for immutable collections. This operation on a dictionary will change the original collection.

```python
map_1 = {"💙": 1, "🩷": 12, "💚": 35}
map_1["💛"] = 100
```

</div>
</div>

## List expressions

<div class="side-by-side"><div>

### Lambdas

This expression doubles each number in the list. Unison uses higher-order functions like `List.map` to transform data.

```unison
List.map (x -> x * 2) [1, 2, 3]
```

`(x -> x * 2)` is a __lambda__ (an anonymous function) that takes one argument `x` and returns `x * 2`.

Lambdas in Unison can include local variable assignments and multiple expressions:

```unison
List.foldLeft (acc x -> let
  double = x * 2
  acc + double
) 0 [1, 2, 3]
```

The `let` keyword is a way of starting a code block in Unison.

</div><div>

### List comprehensions

In Python, you might use a __list comprehension__ to iterate over elements in a list and create a new one:

```python
[x * 2 for x in [1, 2, 3]]
```

Here's the same expression using the `map` function and a lambda:

```python
list(map(lambda x: x * 2, [1, 2, 3]))
```

Lambdas in Python can't include local variable definitions or mupltiple expressions, so they are typically used for simple transformations.

</div></div>

## Optional values
Unison has a type called `Optional` that can either be `Some value` or `None`. It's is similar to Python's `Optional` type from the `typing` module.

<div class="side-by-side">
<div>

```unison
optionalSome : Optional Text
optionalSome = Some "Hello, world!"
optionalNone : Optional Text
optionalNone = None

foo : Optional Text -> Text
foo bar =
  match bar with
    Some text -> "Value provided: " ++ text
    None -> "No value provided"
```

The `match` expression is used to destructure the `Optional` type. You cannot use the value inside an `Optional` without pattern matching on it or using a function that unwraps the `Optional` type.

</div>
<div>

```python
from typing import Optional

def foo(bar: Optional[str]) -> str:
  if bar is None:
    return "No value provided"
  return f"Value provided: {bar}!"
```

In Python, `None` is a singleton object representing the absence of a value at runtime. It is similar to `Optional.None` in that both address nullability, but it is not tracked by the type system, so after a check for `None`, you can use the value directly.

</div></div>

<div class="side-by-side"><div>

### Unit

```unison
unit : ()
unit = ()

greet : Text -> {IO, Exception} ()
greet name =
  printLine ("Hello " ++ name)
```

Unison uses the `Unit` type, `()`, to represent a function that does not return a meaningful value. It's often used in places where a function is performing an action, such as printing to the console.

</div><div>

### None

```python
def greet(name: str) -> None:
  print("Hello " + name)
```

Python uses `None` as the type for functions that do not explicitly return something.

</div></div>

# Comments

<div class="side-by-side"><div>

```unison
-- This is a single-line comment in Unison

{- This is a
   multi-line comment
   in Unison -}
```

Unison comments are not saved to the codebase as part of the definition. Create a string literal if you would like to include a note that is saved with the implementation.

``` unison
myFunc : Nat -> Nat
myFunc n =
  _ = "This expression doubles a number"
  n * 2
```
</div><div>

```python
# This is a single-line comment in Python

"""This is a
   multi-line comment
   in Python"""
```

</div></div>

# Functions

## The basics

Unison and Python are both whitespace-significant languages. Indentation is used to indicate blocks of code, such as function bodies and control flow statements.

<div class="side-by-side"><div>

```unison
hooray : Text -> Text -> Text
hooray a b  =
  a ++ b ++ "!!!"
```

* Unison does not have a special keyword for defining a function.
* In the type signature, arguments are separated by arrows, with the last type being the return type of the entire function.
* There are no explicit return statements in Unison. __The last expression in a function is the return value.__

</div><div>

```python
def hooray(a: str, b: str) -> int:
  return a + b + "!!!"
```

* Python defines functions using the `def` keyword
* When type hints are provided, they're located inline with the function arguments.
* The `return` keyword is used to __explicitly return a value from a function.__

</div></div>

## Calling functions

<div class="side-by-side"><div>

```unison
hooray "Hello" "world"
```

Unison functions are called _without parentheses_ by default. Function arguments are separated by spaces.

``` unison
hooray "Happy" ((Nat.toText 1) ++ "st birthday")
```

Parentheses are used to enforce the order of evaluation when necessary.


</div><div>

```python
hooray("Hello", "world")
```

In Python, functions are called with parentheses and arguments are separated by commas.
</div></div>

## Default and variadic arguments

<div class="side-by-side"><div>

``` unison
hooray : Text -> Text -> Optional Nat -> Text
hooray a b num =
  repeat = Optional.getOrElse 1 num
  Text.repeat repeat (a ++ b ++ "!!!")
```

Unison does not allow default values for function arguments. Instead, you might use the `Optional` type to indicate that an argument is optional, and then provide a default value inside the function body.

</div><div>

```python
def hooray(a: str, b: str, repeat: int = 1) -> str:
  combined = a + b + "!!!"
  return combined * repeat
```

Python allows default values for function arguments, which can be specified in the function definition.

</div></div>

<div class="side-by-side"><div>

```unison
hoorayMany : [Text] -> Text
hoorayMany texts =
  Text.join " " texts ++ "!!!"
```

Unison does not have built-in support for variadic functions. Instead, you can accept a list of values as an argument.

</div><div>

```python
def hooray_many(*texts: str) -> str:
  combined = " ".join(texts) + "!!!"
  return combined
```

Python supports variadic functions using the `*args` syntax, which allows you to pass a variable number of arguments to a function.

</div></div>

# Control flow

## Conditionals

<div class="side-by-side"><div>

```unison
conditional : Nat -> Nat -> Text
conditional a b =
  if a > b then
    "a is greater than b"
  else if a < b then
    "a is less than b"
  else
    "a is equal to b"
```

Unison uses `if` `then` and `else` for conditional expressions. Both the `then` and `else` branches must return the _same type_. Unlike Python, the `else` branch is always required.
</div><div>

```python
def conditional(a: int, b: int) -> str:
  if a > b:
    return "a is greater than b"
  elif a < b:
    return "a is less than b"
  else:
    return "a is equal to b"
```

Python uses `if`, `elif`, and `else` for conditional expressions.

```python
def print_positive(num):
  if num > 0:
    print("Positive number")
  return -100
```

The `else` branch is optional, and the branches can return different types.

</div></div>

## Pattern matching

Pattern matching in Unison is a powerful feature that allows you to destructure data types and match against specific patterns. It is similar to switch statements in other languages and it's often used in favor of nested conditional statements.

<div class="side-by-side"><div>

Unison supports structural pattern matching using the `match ... with` syntax.

```unison
describeNat : Nat -> Text
describeNat n =
  match n with
    0 -> "zero"
    1 -> "one"
    _ -> "many"
```

The underscore `_` is a wildcard that matches any value not explicitly matched by the previous patterns.

All patterns must be __exhaustive__, meaning that every possible value of the type must be handled. If a pattern is not matched, the code will not compile.

</div><div>

Python has introduced structural pattern matching with the `match ... case` syntax.

```python
def describe_num(n: int) -> str:
  match n:
    case 0:
      return "zero"
    case 1:
      return "one"
    case _:
      return "many"
```

Python's match does __not enforce exhaustiveness__.
</div></div>

### Pattern guards

<div class="side-by-side"><div>

```unison
sign : Int -> Text
sign n =
  match n with
    x | x > +0 -> "positive"
    x | x < +0 -> "negative"
    _ -> "zero"
```

In Unison, pattern guards add additional conditions to a `case` using the `|` symbol:

</div><div>

``` python
def sign(n: int) -> str:
  match n:
    case x if x > 0:
      return "positive"
    case x if x < 0:
      return "negative"
    case _:
      return "zero"
```

Python uses `if` in a `case` clause for the same purpose.

</div>
</div>

## Exception handling

Both Python and Unison use exceptions for error handling and can propagate them up the call stack, but exceptions in Unison are [tracked by the type system as an __ability__](https://www.unison-lang.org/docs/fundamentals/abilities/).

The key difference is how each language treats effects (operations that go beyond pure computation) like:

* Throwing exceptions
* Printing to the console
* Reading or writing files
* Making network requests

<div class="side-by-side"><div>

In Unison, the effects a function may perform are part of its type signature. `{Exception}` indicates that this function might throw an exception.

```unison
safeDivide : Nat -> Nat ->{Exception} Nat
safeDivide a b =
  use Int /
  if b === 0
  then Exception.raise (failure "cannot divide by zero" b)
  else a / b
```

In Unison, we use special functions called __ability handlers__ to manage effects. Here, we use the `catch` function to turn the potential exception into the `Either` data type.

```unison
catchSafeDivide : Nat -> Nat -> Either Failure Nat
catchSafeDivide a b =
  catch do safeDivide a b
```

Alternatively, we can continue to propagate the exception to the caller by including `{Exception}` in the enclosing function's ability set:

```unison
callingSafeDivide : '{Exception} Text
callingSafeDivide = do
  (Nat.toText (safeDivide 10 5))
```

At the entry point of a Unison program, only the `IO` and `Exception` abilities are allowed. All other effects must be handled by:

* Converting them into pure data (e.g., `Either` or `Optional`)
* Translating them into `{IO}` or `{Exception}`

</div><div>

In Python, there is no type signature enforcing that `safe_divide` can raise `ValueError`. These and other effects are not checked by the interpreter.

```python
def safe_divide(a, b):
  if b == 0:
    raise ValueError("Cannot divide by zero")
  return a / b
```

In Python, exceptions can be caught using `try` and `except` blocks.

```python
def run_with_catch(a, b):
  try:
    safe_divide(a, b)
  except ValueError as e:
    print(f"Error: {e}")
    return None
```

Python's **try...except** blocks are similar to _ability handler_ functions in Unison in that they specify that a code block may be performing an effect and then specify how the runtime should respond. However, `try...except` is built into the Python language, whereas Unison handler functions are generalizable and defined by developers.

</div></div>

# Data modeling

🌌🔭This topic is vast, but here are some of the key differences between Unison and Python when it comes to modeling data.

<div class="side-by-side"><div>

## Types and functions

Unison does not have classes in the same way that Python does. There are no instance methods, no constructors, and no `self` or `this` references. Instead, we use __data types__ which structure and contain data and __functions__ which transform them to describe behavior.

This is a __type declaration__ for an `Elevator` that tracks the current floor and the top floor of the building:

```unison
type Elevator = Elevator Nat Nat
```

These functions accept the `Elevator` type as an argument and return a new `Elevator` with updated state.

```unison
moveUp : Elevator -> Elevator
moveUp e = match e with
  Elevator currentFloor topFloor | currentFloor < topFloor ->
    Elevator (currentFloor + 1) topFloor
  _ -> e

moveDown : Elevator -> Elevator
moveDown e = match e with
  Elevator currentFloor topFloor | currentFloor > 0 ->
    Elevator (currentFloor - 1) topFloor
  _ -> e

goToFloor : Nat -> Elevator -> Elevator
goToFloor requested e = match e with
  Elevator _ topFloor | requested <= topFloor ->
    Elevator requested topFloor
  _ -> e
```

</div><div>

## Classes and methods

Python uses __classes__ to __encapsulate__ both data and behavior. Methods are defined within classes and operate on the data contained in instances of those classes.

```python
class Elevator:
  def __init__(self, current_floor: int = 0, top_floor: int = 10):
    self.current_floor = current_floor
    self.top_floor = top_floor

  def move_up(self):
    if self.current_floor < self.top_floor:
        self.current_floor += 1

  def move_down(self):
    if self.current_floor > 0:
        self.current_floor -= 1

  def go_to_floor(self, floor: int):
    if 0 <= floor <= self.top_floor:
        self.current_floor = floor
```

This class defines an `Elevator` with methods to move up, move down, and go to a specific floor. The state of the elevator is stored and changed in instance variables.

</div></div>

<div class="side-by-side"><div>

### Function composition

In Unison, we use __function composition__ to chain function calls together and advance the state of a program. The outputs of one function become the inputs to the next.

``` unison
e0 = Elevator 0 10
e1 = goToFloor 5 e0
e2 = moveUp e1
e3 = moveUp e2
```

Since the intermediate variables `e1`, `e2`, and `e3` are not needed, we often use the pipe operator `|>` to pass the result of one function directly into the next:

```unison
Elevator 0 10
  |> goToFloor 5
  |> moveUp
  |> moveDown
```

Each transformation is applied in sequence, allowing for a clear flow of data through the inputs and outputs of functions.

</div><div>

### Dot notation

The dot notation in Python expresses method calls on an object that may _mutate_ the object's internal state.

```python
e = Elevator()
e.go_to_floor(5)
e.move_up()
e.move_down()
```

No arguments are passed to the methods because the `Elevator` instance `e` is implicitly passed as a reference to the methods via `self`.

</div></div>

## Record types

Unison's __record types__ are similar to Python's immutable `NamedTuples`. They are used to group related data together with named fields, and provide concise dot-syntax for getting and setting fields.

<div class="side-by-side"><div>

```unison
type Point = {x : Int, y : Int}
```

This defines a `Point` type with two fields, `x` and `y`, both of type `Int`. Defining a record type creates the following accessor and modifier functions:

```unison
Point.x        : Point -> Int
Point.x.modify : (Int ->{g} Int) -> Point ->{g} Point
Point.x.set    : Int -> Point -> Point
Point.y        : Point -> Int
Point.y.modify : (Int ->{g} Int) -> Point ->{g} Point
Point.y.set    : Int -> Point -> Point
```

While the following notation looks similar to method calls on an instance of a class, Unison record types are _immutable_. To "change" a field in a record, you create a new record with the updated value using the generated `set` or `modify` functions.

```unison
p1 = Point +3 -4
x = Point.x p1
p2 = Point.x.set +10 p1
-- p2 is now Point +10 -4, p1 is still Point +3 -4
```

</div><div>

```python
from typing import NamedTuple

class Point(NamedTuple):
  x: int
  y: int

p1 = Point(3, -4)
x = p1.x # Accessing the x field
p2 = p1._replace(x=10)
# Creating a new Point with an updated x field
```

</div></div>

## Generic behavior

<div class="side-by-side"><div>

### Parametric polymorphism

In Unison, __generic types__ allow you to write functions that can operate on any type. They're represented by lowercase letters in type signatures.

```unison
printTwice : (a -> Text) -> a -> {IO, Exception} ()
printTwice toText x =
  printLine (toText x)
  printLine (toText x)

type Duck = Duck
type RoboDuck = RoboDuck

Duck.quack : Duck -> Text
Duck.quack _ = "Quack!"

RoboDuck.quack : RoboDuck -> Text
RoboDuck.quack _ = "Electronic Quack!"

main = do
  printTwice Duck.quack Duck
  printTwice RoboDuck.quack RoboDuck
```

In the example above, `printTwice` is a function that takes two arguments: _a function_ that converts a value of any type `a` to `Text`, and a value of type `a`. Because `a` is used as the __type variable__ for both parameters, the same type must be used in both places when calling `printTwice`.

In functional languages, we call the ability to write functions that operate on types independently of their content: __parametric polymorphism__.

</div><div>

### Duck-typing

```python
def quack_twice(thing):
  print(thing.quack())
  print(thing.quack())

class Duck:
  def quack(self): return "Quack!"

class RoboDuck:
  def quack(self): return "Electronic Quack!"

quack_twice(Duck())
quack_twice(RoboDuck())
```

Python uses __duck-typing__ to write functions or methods that operate on any object, which means that the expression `thing.quack` will succeed if the object a has a `quack` method, regardless of what it is.

</div></div>

<div class="side-by-side"><div>

### Algebraic data types

Unison does not support inheritance or subtyping. All types are _invariant_. But you can use __algebraic data types__ to say that a particular type may be created in several different ways:

```unison
type Duck = AnimalDuck | RoboDuck Text | ToyDuck Text
```

The `type` declaration means that the `Duck` type has three _data constructors_. The `AnimalDuck` does not make a special noise, but the other two data constructors (`RoboDuck` and `ToyDuck`) take a `Text` argument representing the specific behavior of that case (a quack prefix in this example).

```unison
Duck.toText : Duck -> Text
Duck.toText d = match d with
  AnimalDuck -> "Quack!"
  RoboDuck prefix -> prefix ++ " Quack!"
  ToyDuck prefix -> prefix ++ " Quack!"
```

The `Duck.toText` function uses _pattern matching_ on the data type to determine which kind of duck it received and return the appropriate text.

```unison
quacks = do
  printTwice Duck.toText Duck.AnimalDuck
  printTwice Duck.toText (Duck.RoboDuck "Electronic")
  printTwice Duck.toText (Duck.ToyDuck "Squeaky")
```

Note that `AnimalDuck`, `RoboDuck`, and `ToyDuck` are functions that are used to create values with the `Duck` type when provided with their respective arguments. They are not distinct types themselves.

</div><div>

### Inheritance and subtyping

Let's say we wanted to use __subtypes__ to create different types of ducks that share a common interface for quacking:

```python
class Duck:
  def quack(self) -> str:
    return "Quack!"

class AnimalDuck(Duck):
  pass

class RoboDuck(Duck):
  def __init__(self, prefix: str):
    self.prefix = prefix

  def quack(self) -> str:
    return f"{self.prefix} Quack!"

class ToyDuck(Duck):
  def __init__(self, prefix: str):
    self.prefix = prefix

  def quack(self) -> str:
    return f"{self.prefix} Quack!"

```

While two of these subclasses (`Roboduck` and `ToyDuck`) have an additional instance variable, the other simply inherits its behavior from its parent.

```python
quack_twice(AnimalDuck())
quack_twice(RoboDuck("Electronic"))
quack_twice(ToyDuck("Squeaky"))
```

</div></div>

# Modules

<div class="side-by-side"><div>

In Unison, a __namespace__ is a collection of related definitions, which can be functions, types, or other namespaces. Namespaces are introduced by giving terms a dot-separated prefix when they are defined:

```unison
database.userModel.getUserName : Nat -> Optional Text
database.userModel.getUserName userId = todo "getUserName"

database.userModel.getUserAge : Nat -> Optional Nat
database.userModel.getUserAge userId = todo "getUserAge"
```

These two functions are in the `database.userModel` namespace.

You can also provide namespace scoping at the top of a file:

```unison
namespace database.userModel
  getUserName : Nat -> Optional Text
  getUserName userId = todo "getUserEmail"

  getUserAge : Nat -> Optional Nat
  getUserAge userId = todo "getUserAge"
```

Renaming or moving definitions between namespaces is common, so don't let the long prefixes above intimidate you.

</div><div>

In Python, a file defines a __module__ and a directory can define a __package__ containing many modules (or sub-packages). The module contains the functions, classes, and variables for the program.

```python
# in a file called ./database/usermodel.py

from typing import Optional

def get_user_name(user_id: int) -> Optional[str]:
  ...

def get_user_age(user_id: int) -> Optional[int]:
  ...
```

Unlike Python, Unison does not use the file system to organize or save code so the distinction between a package and module is not relevant.

</div></div>

## Imports

<div class="side-by-side"><div>

In Unison, you can use the `use` keyword to bring definitions from other namespaces into the current namespace. You can import an entire namespace or specific definitions.

```unison
{- Imports everything from the `database.userModel`
   namespace for use in the file -}
use database.userModel

{- Use getUserName and getUserAge without the
   full namespace prefix -}
api.getUserNameJson : Nat -> Json
api.getUserNameJson userId =
  name = getUserName userId
  todo "..."

-- Only imports the getUserAge definition
use database.userModel getUserAge

-- Imports both getUserAge and getUserName definitions
use database.userModel getUserAge getUserName
```

Or you can fully qualify the name of the definition you want to use:

```unison
api.getUserAgeJson : Nat -> Json
api.getUserAgeJson userId =
  database.userModel.getUserAge userId
  todo "..."
```

</div><div>

In Python, you can use the `import` statement to bring in modules or specific definitions from modules.

```python
# imports the entire usermodel module
from database import usermodel

print(usermodel.get_user_name(1))

# imports specific functions from the usermodel module
from database.usermodel import get_user_name, get_user_age

print(get_user_name(1))
```

</div></div>

# Running programs

<div class="side-by-side"><div>

Unison _does not evaluate any code_ until you explicitly tell it to, so a "main" function is just another function in your codebase until you invoke it with the `run` command in the UCM or via the shell.

```unison
main : '{IO, Exception} ()
main = do
  printLine "Hello world!"

mainWithArgs : '{IO, Exception} ()
mainWithArgs = do
  args : [Text]
  args = IO.getArgs()
  printLine ("program args: " ++ (Text.join ", " args))

pureMain : '{} Nat
pureMain = do
  42
```

```ucm
myProject/main> run main

  Hello world!
```

A runnable "main" function in Unison can be any [delayed computation](https://www.unison-lang.org/docs/fundamentals/values-and-functions/delayed-computations/) (a thunk) which can perform the `IO` and `Exception` abilities (think "effects").

</div><div>

The Python interpreter _starts executing code_ from the top of the file, so it uses the `__name__` and `__main__` built-in variables to determine if the script is being run directly or imported as a module.

```python
# In a file called my_script.py

def my_main():
  print("Hello world!")

if __name__ == "__main__":
  my_main()
```

``` bash
$ python my_script.py

  Hello world!
```

</div></div>

### The REPL

Unison uses **watch expressions** to interactively evaluate code, instead of a traditional **REPL**. Watch expressions let you test and explore code directly in your source files.

<div class="side-by-side"><div>

The Unison Codebase Manager (UCM) watches for changes to `.u` files and evaluates any lines starting with `>` in the file as a watch expression. The expressions must be "pure", meaning they cannot perform side effects like `IO` or throwing exceptions.


```unison
factorial n = Nat.product (range 1 (n + 1))

> factorial 3
```
Everything in your file and in your current UCM project is in scope. The UCM will print to the console like this:

```unison
> factorial 3
  ⧨
  6
```

</div><div>

Python has a traditional REPL that allows you to enter and evaluate code interactively.

```python
>>> factorial = lambda n: 1 if n == 0 else n * factorial(n - 1)
>>> factorial(3)
6
```

</div></div>
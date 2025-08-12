---
layout: "compare-lang"
title: "Unison for Scala devs"
description: "Comparing structures and patterns between Unison and Scala"
---

# Core language features

## Variables

Unison variables can be defined at the top-level of a program. There is no keyword to introduce a value and all values are immutable.

The type signature of a value or function appears _above_ the definition instead of interspersed with the names of the function parameters. Both Scala and Unison support type inference, so these type signatures are optional.

### Basic types

<div class="side-by-side"><div>

```unison
aText : Text
aText = "A Text value"

aChar : Char
aChar = ?a

aNat : Nat
aNat = 123

aList : List Int -- also represented as [Int]
aList = [+1, +2, -3, -4, +0]

aMap : Map Text Nat
aMap = Map.fromList [("a", 1), ("b", 2), ("c", 3)]

someVal : Optional Boolean
someVal = Some true
noneVal = None

theUnitVal : ()
theUnitVal = ()

notImplemented : [Boolean]
notImplemented = todo "a placeholder"
```

`Nat` is the type for positive integers, `Int` is for signed integers.

Type arguments in signatures are delimited by spaces, not square brackets.

</div>
<div>

```scala
val aString : String = "A String value"

val aChar : Char = 'a'

val anInt : Int = 123

val aList : List[Int] = List(1, 2, -3, -4, 0)

aMap : Map[String, Int] = Map(("a", 1), ("b", 2), ("c", 3))

val someVal : Option[Boolean] = Some(true)
val noneVal = None

val theUnitVal : Unit = ()

val notImplemented : List[Boolean] = ???

var aVariable = 0
aVariable + 3

```

Unison does not have an analog to the `var` keyword in Scala.

</div></div>

## Functions

Functions in Unison type signatures are represented with the single arrow `->`. Multiple arguments are represented with currying instead of comma-delimited argument lists.

There is no special keyword for differentiating a variable from a function in Unison.

<div class="side-by-side"><div>

```unison
splitDigitsOn : Char -> Text -> [Text]
splitDigitsOn delim text =
  Text.split delim text
    |> List.map (cell -> Text.filter isDigit cell)
```

Unison is a _whitespace-significant_ language, so the function body is scoped by newlines and indentation.

Lambdas are introduced with parens: `(arg1 arg2 -> impl)`. The arrow `->` separates the arguments of the lambda from its body.

The `|>` operator emulates the chaining of `.split` and `.map` in Scala.

</div><div>

```scala
def splitDigitsOn(delim : Char, text : String) : List[String] = {
  text.split(delim)
    .map(cell => cell.filter(_.isDigit))
    .toList
}
```

Scala uses _dot notation_ syntax, as in `text.split`, to call `split` on the `text` argument. Unison takes the `text` value as an argument to another function, `Text.split`.

It's a common Scala-flavored mistake to forget to supply the last argument to Unison functions like `List.map` because of this convention.

</div></div>

### Calling functions

<div class="side-by-side"><div>

During function application, arguments are separated by spaces:

```unison
digits = splitDigitsOn ?| "abc12|def34|56|78"
```

Since commas are not used to explicitly separate arguments, parenthesis disambiguate the order in which functions should be applied.

</div><div>

Arguments are provided in parentheses, separated by commas:

```scala
val digits = splitDigitsOn('|', "abc12|def34|56|78")
```

</div></div>

<div class="side-by-side"><div>

```unison
digits = splitDigitsOn ?| ("abc12|" ++ "def34|56|78")
```

</div><div>

```scala
val digits = splitDigitsOn('|', "abc12|" ++ "def34|56|78")
```

</div></div>

### Generic types

Generic types are represented with _lowercase letters_ in Unison. You do not need to introduce type variables for a polymorphic function in square brackets before using them.

<div class="side-by-side"><div>

```unison
identity : a -> a
identity a = a
```

</div><div>

```scala
def identity[A](a: A): A = a
```

</div></div>

### Delayed evaluation

<div class="side-by-side"><div>

Unison **delayed computations** are functions with no arguments (thunks.)

In type signatures, they’re indicated with the single quote syntax sugar `'a`, short for `() -> a`. In the body of a function, they are introduced with the `'` or `do` keyword.

```unison
computeTwice : '{IO, Exception} Nat -> Nat
computeTwice x =
  x() + x()

expensiveComputation : '{IO, Exception} Nat
expensiveComputation = do
  printLine("Running...")
  42

computeTwice(expensiveComputation())

-- Prints the message twice
```

The syntax for forcing a thunk in Unison is `x()` or `!x`.

</div><div>

Scala has non-forced function arguments using **call-by-name parameters** (`=> T`). Scala defers the value every time the parameter is used inside the function.

```scala
def computeTwice(x: => Int): Int = x + x

def expensiveComputation(): Int = {
  println("Running...")
  42
}

computeTwice(expensiveComputation())

// Prints the message twice
```

Scala’s `lazy` values are different from delayed computations because they _memoize_ the value once evaluated.

```scala
lazy val expensiveComputation: Int = {
  println("Computing...")
  42
}

println(expensiveComputation)
println(expensiveComputation)

// Prints the message only once
```

</div></div>

## Organizing code

### Packages

Unison uses **namespaces** to organize code, which are similar to Scala **packages**.

<div class="side-by-side"><div>

```unison
namespace models

type User = User Text Nat

User.toJson : User -> Json
User.toJson user = todo "unimplemented"

type UserPreferences = UserPreferences [Text]
```

It's more common to see namespaces fully prefixed by their dot-separated name segments in a `scratch.u` file:

```unison
type models.User = User Text Nat

models.User.toJson : User -> Json
models.User.toJson user = todo "unimplemented"

type models.UserPreferences = UserPreferences [Text]
```
</div>

<div>

```scala
package models

case class User(name: String, age: Int)

object User {
  def toJson(user: User): String = ???
}

case class UserPreferences (preferences: List[String])
```
</div></div>

### Imports

Unison uses the `use` keyword to import definitions while Scala uses the `import` keyword. Both Unison and Scala support imports at the top-level of the file and scoped to definitions.

<div class="side-by-side"><div>

```unison
-- imports everything in the `models.User` namespace
use models.User
-- imports the `User` and `UserPreferences` namespaces
use models User UserPreferences
-- imports specific terms from the `models.User` namespace
use models.User toJson fromJson
```

```unison
sqrtplus1 : Float -> Float
sqrtplus1 x =
  use Float sqrt
  sqrt x + 1.0
```
</div>

<div>

```scala
// imports everything in the `models` package.
import models.*
// imports specific members from the `models` package
import models.{User, UserPreferences}
// Scala supports renaming imports, Unison does not.
import models.UserPreferences as UPrefs
```

```scala
def sqrtplus1(x: Int) =
  import scala.math.sqrt
  sqrt(x) + 1.0
```
</div></div>

## Comments and docs

Unison comments _are not persisted_ to the Unison codebase. To save a note to your future self or colleagues, use a string literal or use a Unison `Doc` expression.

<div class="side-by-side"><div>

```unison
-- A singe line comment.

{-
  A multi-line comment.

  Comments are not saved in the codebase!
-}

myTerm =
  _ = "This text literal will
  be saved to the codebase"
  "foo"
```

</div><div>

```scala
// A single line comment.

/*
  A multi-line comment.
*/
```

</div></div>

### Documentation

Unison `Doc` elements are first-class elements in the Unison language. They are dynamically linked to the Unison terms that they describe, can run live examples, and will respond to changes in the codebase.

<div class="side-by-side"><div>

{% raw %}

````unison
{{
  This Unison {type Doc} describes something called {myTerm}.

  @signature{myTerm, Map.fromList}

  It can evaluate pure code for dynamic examples:

  ```
  myTerm
  ```

  ```
  Map.fromList [(1, "a"), (2, "b"), (3, myTerm)]
    |> Map.get 3
  ```

  If you change the implementation of `myTerm`,
  this document will change automatically.
}}
myTerm =
  _ = "This text literal will
  be saved to the codebase"
  "foo"
````

{% endraw %}

If a Doc element is created above a term or type, it will automatically share the name of the term or type suffixed with `.doc` .

</div><div>

```scala
/** A Scala Doc for the term below.

With annotations it can automatically update some
information about its inputs and outputs.

It cannot run live snippets of the code it describes.
*/
val myTerm = "foo"
```

</div></div>

## Defining and using types

### Type declarations

<div class="side-by-side"><div>

```unison
type Floor = Floor Nat Boolean

type Direction = Up | Down

floor2: Floor
floor2 = Floor 2 false
up : Direction
up = Direction.Up
```

The `type` keyword introduces a new type. Its **data constructors** are separated by `|` on the right of the equals sign.

Think of data constructors as functions which produce values of the given type.

```unison
-- the Floor type has one data constructor,
-- a function that looks like this
Floor.Floor : Nat -> Boolean -> Floor
```

</div><div>

```scala
case class Floor(number: Int, isPrivate : Boolean)

sealed trait Direction
case object Up extends Direction
case object Down extends Direction

val floor2 : Floor = Floor(2, false)
val up : Direction = Up
```

Scala’s type system includes more complex ways of expressing type hierarchies through traits, objects, and classes.

</div></div>

### Case classes

Unison **record types** are similar to **case classes** in spirit. They’re both used to store named fields, and they automatically provide functions for setting and extracting values from the type by field name.

<div class="side-by-side"><div>

```unison
type Elevator = {
  currentFloor : Floor,
  direction: Direction,
  requests : [Foor]
}

elevator = Elevator (Floor 3 false) Down [(Floor 2 false)]

Elevator.currentFloor elevator

Elevator.direction.set Up elevator
Elevator.currentFloor.modify(cases (Floor n p) -> Floor (n + 1) p) elevator
```

</div><div>

```scala
case class Elevator(
  currentFloor: Floor,
  direction: Direction,
  requests: List[Floor]
)

val elevator = Elevator(Floor(3, false), Down, List(Floor(2, false)))

elevator.currentFloor

elevator.copy(direction = Up)
```

Case classes don’t have a `modify` function for their fields

</div></div>

### Tagged unions

Say we need to add a type for the panel inside an elevator to better model the requests a user might issue. A user can still request a `Floor`, but they can also make an emergency call and handle the doors.

<div class="side-by-side"><div>

```unison
type Floor = Floor Nat Boolean

type PanelButton = FloorB Floor | DoorOpen | DoorClose | Emergency
```

In Unison, if we wanted to keep our `Floor` type separate from the new `PanelButton` type (since some business logic may only deal with the `Floor` and not the panel), we would introduce a wrapper data constructor in our `PanelButton` type.

</div><div>

```scala
sealed trait PanelButton
case object DoorOpen extends PanelButton
case object DoorClose extends PanelButton
case object Emergency extends PanelButton
case class Floor(number: Int, isPrivate : Boolean) extends PanelButton
```

In Scala, you can add a trait and say that the existing `Floor` case class is a variant of the `PanelButton` type. This is a “tagged union,” because each case in the `PanelButton` trait is tagged with its own type.

</div></div>

### Type system comparison

- Scala supports sub-typing, therefore generic types can express variance relationships, `+A` `-B`. Unison does not have sub-typing and its types are invariant.
- Scala has more options than Unison for type casting and dynamic type inference.
- Unison does not support typeclasses. Scala has typeclasses via the `implicit` / `given` syntax.
- Unison uses algebraic effects (called Abilities) for effect management.

| **Feature**                             | **Unison**                                                                  | **Scala**                                                                               |
| --------------------------------------- | --------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Generic types / parametric polymorphism | Yes. Generic type parameters are inferred, introduced by lowercase letters. | Yes. Generic type parameters must be explicitly declared before use `[A]` in functions. |
| Subtyping                               | No.                                                                         | Yes.                                                                                    |
| Record types                            | Yes. Single data constructor types with named fields.                       | Yes. Case classes                                                                       |
| Typeclasses                             | No.                                                                         | Yes. Typeclasses via traits and implicit / given syntax.                                |
| GADTs                                   | No.                                                                         | Yes. GADT’s via sealed traits and case classes                                          |
| Higher-kinded types                     | Yes. But in the absence of typeclasses, less common.                        | Yes.
| Type aliases                            | No                                                                          | Yes |

## Pattern matching

### Data types and literals

<div class="side-by-side"><div>

```unison
type Person = Person Text Nat

toText : Person -> Text
toText person = match person with
  Person n a -> "Name: " ++ n ++ (", Age: " ++ (toText a))
```

In Unison, the `match ... with` syntax can be replaced with `cases`:

```unison
toText : Person -> Text
toText = cases
  Person n a -> "Name: " ++ n ++ (", Age: " ++ (toText a))
```

</div><div>

```scala
case class Person(name: String, age: Int)

def toString(person: Person): String = person match {
  case Person(n, a) => s"Name: $n, Age: $a"
}
```

</div></div>

### Pattern guards and `@` binding

<div class="side-by-side"><div>

```unison
categorizeNumber : Int -> Text
categorizeNumber n = match n with
  n | n > +0 -> "Positive number"
  0 -> "Zero"
  n | n < +0 "Negative number"
```

</div><div>

```scala
def categorizeNumber(num: Int): String = num match {
  case n if n > 0  => "Positive number"
  case 0           => "Zero"
  case n if n < 0  => "Negative number"
}
```

</div></div>

<div class="side-by-side"><div>

```unison
type User Text Nat

userTuple : User -> (User, Text)
userTuple user = match user with
  u @ User n a ->  (u, n)
```

</div><div>

```scala
case class User(name: String, age: Int)

def userTuple(user : User): (User, String) = user match {
  case u @ User(n, a) => (u, n)
}
```

</div></div>

### Type checking inside pattern matches

Unison _does not_ support dynamic type checks in pattern matches.

<div class="side-by-side"><div>

```unison
type Box t = Box t

describeBox : Box t -> Text
describeBox b = match b with
  Box _ -> "Cannot get type information from generic type t"
```

Instead, Unison pattern matches on the data constructors of the type:

```unison
type Box t = BoxNat Nat | BoxText Text | BoxOther t

describeBox : Box t -> Text
describeBox b = match b with
  (BoxNat _) -> "Box of a Nat"
  (BoxText _) -> "Box of a Text"
  (BoxOther _) -> "Box of something else"
```

</div><div>

```scala
case class Box[T](value: T)

def describeBox[T](box: Box[T]): String = box match {
  case Box(_: Int)    => "Box of an integer"
  case Box(_: String) => "Box of a string"
  case _              => "Box of something else"
}
```

</div></div>

### List pattern matching

The Unison `List` type is a finger tree, not a cons list, so it supports fast prepending (`+:`) and appending ( `:+`).

<div class="side-by-side"><div>

```unison
List.uncons : [a] -> Optional (a, [a])
List.uncons list = match list with
    x +: xs -> Some (x, xs)
    []      -> None

List.slidingPairs : [a] -> [(a,a)]
List.slidingPairs list =
  loop acc = cases
    [fst, sec] ++ tail ->
      loop (acc :+ (fst, sec)) (sec +: tail)
    _ -> acc
  loop [] list
```

Pattern match on a list of `n` elements with the regular list constructor `[fst, second]`

</div><div>

```scala
def uncons[A](list: List[A]): Option[(A, List[A])] = list match {
  case x :: xs => Some((x, xs))
  case Nil     => None
}

def slidingPairs[A](list: List[A]): List[(A, A)] = {
  def loop(remaining: List[A], acc: List[(A, A)]): List[(A, A)] = remaining match {
    case fst :: sec :: tail => loop(sec :: tail, (fst, sec) :: acc)
    case _ => acc.reverse
  }
  loop(list, Nil)
}
```

</div></div>

## Running programs

A runnable “main” function in Unison is a delayed computation (a thunk) which can perform the `IO` and `Exception` abilities (think “effects”).

<div class="side-by-side"><div>

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

</div><div>

```scala
object Main extends App {
    println("Hello world!")
}

object Main {
  def main(args : Array[String]) Unit = {
    println("Hello world!")
  }
}
```

</div></div>

### The REPL

Unison uses **watch expressions** to interactively evaluate code, instead of a traditional **REPL**. The Unison Codebase Manager (UCM) watches for changes to `.u` files and evaluates any lines starting with `>`.

<div class="side-by-side"><div>

```unison
factorial n = product (range 1 (n + 1))

> factorial 3
```

UCM will print out:

```unison
> factorial 3
  ⧨
  6
```

</div><div>


```scala
scala> val x = 42
x: Int = 42

scala> x + 10
res0: Int = 52
```

</div></div>

# HTTP Service example

## Scala http service

```scala
import cats.effect._
import org.http4s._
import org.http4s.dsl.io._
import org.http4s.implicits._
import org.http4s.ember.server._
import org.http4s.circe._
import io.circe.syntax._
import io.circe.generic.auto._
import scala.util.Try

case class ConversionResponse(from: String, to: String, input: Double, result: Double)

object UnitConverterService extends IOApp.Simple {

  def convertTemperature(from: String, to: String, value: Double): Either[String, Double] =
    (from, to) match {
      case ("celsius", "fahrenheit")  => Right(value * 9 / 5 + 32)
      case ("fahrenheit", "celsius")  => Right((value - 32) * 5 / 9)
      case ("celsius", "kelvin")      => Right(value + 273.15)
      case ("kelvin", "celsius")      => Right(value - 273.15)
      case ("fahrenheit", "kelvin")   => Right((value - 32) * 5 / 9 + 273.15)
      case ("kelvin", "fahrenheit")   => Right((value - 273.15) * 9 / 5 + 32)
      case _ => Left("Unsupported conversion")
    }

  val convertTempRoute = HttpRoutes.of[IO] {
    case req @ GET -> Root / "convert" / "temperature" =>
      val queryParams = req.params
      val from = queryParams.get("from")
      val to = queryParams.get("to")
      val value = queryParams.get("value").flatMap(v => Try(v.toDouble).toOption)

      (from, to, value) match {
        case (Some(f), Some(t), Some(v)) =>
          convertTemperature(f.toLowerCase, t.toLowerCase, v) match {
            case Right(result) =>
              Ok(ConversionResponse(f, t, v, result).asJson)
            case Left(error)   => BadRequest(error)
          }
        case _ => BadRequest("Missing or invalid query parameters")
      }
  }

  def run: IO[Unit] =
    EmberServerBuilder
      .default[IO]
      .withHttpApp(convertTempRoute.orNotFound)
      .build
      .useForever
}
```

## Unison http service

Instead of describing your dependencies in an sbt file, libraries are managed by with the `lib.install` command in the UCM.

```bash
scratch/main> project.create unit-converter-service
unit-converter-service/main> lib.install @unison/http
unit-converter-service/main> lib.install @unison/routes
unit-converter-service/main> lib.install @unison/json
```

The libraries will be installed in the `lib` namespace, viewable with the `ls` command.

```bash
unit-converter-service/main> ls lib

  1. base/                (7481 terms, 182 types)
  2. unison_http_4_0_0/   (24792 terms, 642 types)
  3. unison_json_1_3_5/   (8184 terms, 189 types)
  4. unison_routes_6_3_3/ (127000 terms, 3311 types)
```

```unison
type ConversionResponse = {from: Text, to: Text, input: Float, result: Float}

ConversionResponse.toJson : ConversionResponse -> Json
ConversionResponse.toJson = cases
  ConversionResponse from to input result ->
    Json.object [
      ("from", Json.text from),
      ("to", Json.text to),
      ("input", Json.float input),
      ("result", Json.float result)
    ]

convertTemperature : Text -> Text -> Float -> Either Text Float
convertTemperature from to value =
  match (from, to) with
    ("celsius", "fahrenheit")  -> Right(value * 9.0 / 5.0 + 32.0)
    ("fahrenheit", "celsius")  -> Right((value - 32.0) * 5.0 / 9.0)
    ("celsius", "kelvin")      -> Right(value + 273.15)
    ("kelvin", "celsius")      -> Right(value - 273.15)
    ("fahrenheit", "kelvin")   -> Right((value - 32.0) * 5.0 / 9.0 + 273.15)
    ("kelvin", "fahrenheit")   -> Right((value - 273.15) * 9.0 / 5.0 + 32.0)
    _ -> Left("Unsupported conversion")

convertTempRoute : '{Route} ()
convertTempRoute = do
  Route.noCapture GET (s "convert" Parser./ (s "temperature"))
  queryParams = request.query()
  from = Map.get "from" queryParams |> Optional.flatMap List.head
  to = Map.get "to" queryParams |> Optional.flatMap List.head
  value =
    Map.get "value" queryParams
      |> Optional.flatMap List.head
      |> Optional.flatMap Float.fromText
  match (from, to, value) with
    (Some f, Some t, Some v) ->
      match convertTemperature f t v with
        Right result ->
          resp = ConversionResponse f t v result
          respond.ok.json (ConversionResponse.toJson resp)
        Left error -> respond.badRequest.text error
    _ -> respond.badRequest.text "Missing or invalid query parameters"

unitConversionService : '{IO, Exception}()
unitConversionService = do
  service = convertTempRoute Route.<|> do respond.notFound.text "not found"
  stop = serveSimple service 8080
  printLine "Server running on port 8080. Press <enter> to stop."
  _ = readLine()
  stop()
```

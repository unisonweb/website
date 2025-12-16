---
layout: "hypercontextual"
title: "Hypercontextual Interfaces: Beyond Static UIs and Chatbots"
subtitle: "A visual essay"
eleventyExcludeFromCollections: false
description: "Comparing syntax and patterns between Unison and Java"
---

Apps have a “long tail” problem. 80% of the app is easily discoverable and has a pleasing UI, yet the remainder of the app’s functionality—the long tail—is hard to find. For instance:

- When logged into your banking app, where in the UI should you click to set up an alert if you balance drops below $1000?
- When logged into Stripe, where in the UI should you go if you need to revoke an API key?
- When logged onto [Amazon.com](http://Amazon.com), where do you reduce the frequency of a subscribe-and-save shipment? Or figure out when the next delivery will be?
- When logged into Paypal, where can you audit the logins over the last month? Where can you get a report of all outgoing payments, and the payment method used for each?
- When logged into Netflix, is there some way to turn off the autoplay of show previews?

As much as designers try to arrange the app’s functionality into some reasonable information hierarchy, and as visually appealing as the app might be, it’s not enough. The user experience of being clear about what you want to do yet _forced to find that functionality in someone else’s invented information hierarchy_ can be **an exercise in frustration.**

Why can’t we just tell the computer what we want, and have it… do that thing?

Ten years ago, the technology didn’t exist to give users a better experience. Now it does. Interfaces of the future will no longer be limited to static UI hierarchies, but will grow to include _hypercontextual interfaces_ to an underlying programming model or API. These interfaces will be \*\*dynamically assembled based on user interactions, serving the long tail of user goals that either aren’t well-handled by existing UIs, or which are flat-out impossible.

A hypercontextual interface can feel conversational, but it _isn’t_ a chatbot: the modality isn’t always (or even often) text. And while hypercontextual interfaces may use LLMs for some tasks, LLMs are only a means to an end, always in service of providing a great user experience.

## Example 1: Setting an alert in your banking app

Here’s a simple example of a long tail request I might make of my banking app: “Add an alert if my balance drops below $1000”

Before looking at the demo, notice the request as written is ambiguous. I may have multiple accounts (say a personal and a joint account), and its unclear which I want to attach these alerts to. I also haven’t specified how this alerting is to happen. Email? Text message? Carrier pigeon?

A good interface will need to clarify these things, and this clarification may require multiple steps. If I simply want the alerts to go to the email and/or phone number that the bank has on file, then perhaps I can multi-select from those two options and be done. But if I want to provide a _new_ phone number for this alert, perhaps there is an additional 2FA process.

Let’s see a demo:

<div style="display: flex; gap: 2rem;">
<div id="orders-demo"></div>

This interface is somewhere between a chatbot and a traditional application. Notice how sparingly text is used as the modality. Yes, text is used where it makes sense, but elsewhere we use proper UI controls that are more constrained and offer better affordances.

</div>

If you need the user to select which account they want, what’s the better experience: (Show visual)

- Presenting a menu of options and letting them tap the one they want.
- or making them type an account number into a free form text box?

Likewise, what’s a better UX for carrying out this request: (Show visual)

- A chatbot that replies to your request: “Navigate to Accounts > Blah > Other spot, then select “alerts” then blah blah”
- The interface just directly presenting UI elements that let you accomplish the thing you want, right there.

It’s not even close! Of course you want the best UI control for the job, and of course you want to be able to directly do the thing, not be given confusing instructions of how to do the thing elsewhere. Seriously, chatbot, if you have successfully interpreted my request, _why can you not just help me to carry it out right here and now?_

<div class="callout">Amelia Wattenberger has a great essay, [Why Chatbots Are Not The
Future](https://wattenberger.com/thoughts/boo-chatbots), which explains many of
the problems with text as a modality.</div>

LLMs can be used for these interfaces, but _sparingly,_ only for that initial input to parse a structured request from natural language input. Everything after that point is just deterministic logic. Folks, this is fine. Really. Our goal shouldn’t be to maximally use LLMs, it should be to help users accomplish things. When LLMs are the best tool, use them; when they aren’t, don’t!

Judicious use of LLMs has another benefit, too. By asking less of the LLM, we can get away with smaller, faster, and cheaper models, all while achieving greater reliability. Disambiguating a natural language query into one of a dozen or two discrete commands, then handing that off to deterministic code is “easy”. It’s much more difficult to reliably support the same overall user interactions with a huge (expensive) model that’s been supplied with dozens of tools and a prompt to hopefully steer it in the right direction.

Of course, not all tasks are amenable to deterministic code, and LLMs definitely have their place. But if you can use regular code for a task, that’s usually a win. Take the win!

## Example 2: Changing shipping address of a recent order

Suppose we have a marketplace or shopping app and want a place where the user can make various long tail requests and queries like “change the shipping address on my order”. This is an interesting, multi-step interaction:

- The UI needs to clarify or confirm: which order are you referring to? Ideally via a UI with recent orders they can tap on to select. _Not: typing the order number in a chat window._
- The UI needs to collect the corrected shipping address, allowing for both selecting for the address on file, or entering a new one. _Not: typing free-form text in a chat window._
- If entering a new address, there may be an additional authentication step. \*\*

Again, hypercontextual interactions are often kicked off with natural language, but since natural language is frequently imprecise, a good interface will disambiguate and refine the user’s intent via sequences of crisp UI controls. The user should never feel anxiety that the system will take some irrevocable action based on some assumed interpretation of natural language input.

Let’s see a demo:

<div id="banking-demo"></div>

Again, what’s better: (show visuals)

- A chatbot which tells you “to change your address, go to Orders > Blah > Foo, then select the dropdown labeled ‘Frobnicate’, then…”
- A human support agent you have to wait 10 minutes to talk to.
- An LLM that confidently tells you it’s changed the shipping address on your order, except that it actually hasn’t—it just told you what it thought sounded like a helpful reply.

A good UI empowers users to directly carry out the thing they want, reliably, with a minimum of fuss and a pleasant interactive UI.

## Wait, do these examples even “count” as AI?

Almost every app comes with long tail bits of functionality that can be nicely surfaced via hypercontextual interfaces as shown above. Yes, these examples are pretty low-lift applications of AI and LLMs, but so what? It’s valuable if users can accomplish in 1 minute what would have taken a frustrating 10 minutes of clicking around at random in the UI, googling, or contacting support to speak with a human. Take the win!

There is a lot of interesting stuff happening in the world of AI, but many of the demos and prototypes are nowhere near being reliable or cost-effective enough for production usage. I’m glad people are having fun doing zany stuff, but if you’re looking to ship a useful AI feature people will actually use _today,_ try introducing a hypercontextual interface.

## Example 3: a complex multi-step agentic flow

Want something that shows off the framework more. Something with interesting rich UIs and also tasks and events being scheduled far in the future. Something that would degrade to horrible spaghetti code if implemented without our awesome framework.

But also something that seems immediately useful and like “OMG, I want that”.

- Set a reminder for sometime in the future
- Work on something for a certain amount of time

Things that are benefits:

- Ability to call other agents
- Ability to pause / resume
- Multi-party review
- Ability to pause on external triggers

Idea: a recurring process that takes in order history and product catalog, and generates an offer for that customer

- Agent can react to the user buying something
- Gamified offer dispenser
- Agentic rewards program, a persistent process per customer

Example for coding assistants

Before looking at our final example, note that we can extend the above UIs to work for an arbitrary set of starting commands.

**Whatever your application can do, you can begin making more of its functionality available via hypercontextual interfaces.** Interactions that play out after an initial request will be very domain-specific and contextual. That’s fine.

A framework can still make creating these experiences a lot easier, letting you focus on the business logic and high-level UI choices, not on the bookkeeping of maintaining these stateful multi-turn interactions, the handling of LLM context, and so on. We want the specifications of these experiences to be nice and high level. “Collect a shipping address from the user” should be a 1-liner, for instance. New UI work should be limited to situations you really need a custom control for a new type of data you haven’t exposed to users previously.

We wrote a library for making this stuff easy; there’s a quick preview showing side-by-side code and videos at the end of this essay.

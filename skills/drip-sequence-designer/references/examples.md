# Drip Sequence Designer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Cart-abandonment sequence for a B2B webshop

**Request**

> We sell industrial fasteners online to logged-in trade customers (Kessel Industriebedarf). Today we send one
> reminder 24 h after a cart is abandoned: 31% open, 4% of carts recovered (last 6 months, from our shop system).
> Build a proper sequence. No discounts, but we can offer a callback from sales. Sender: Kessel Customer Service.

**How the skill handles it**

- Step 1: event-triggered; success is a recovered cart (order placed), the exit is an order or 7 days.
- Step 2: the event-triggered pattern gives 3 emails within 7 days, the first within an hour; Email 3 offers the
  sales callback because the earned ask comes last.
- Step 5: the 31% / 4% baseline is the user's own data and is the only benchmark used.
- No brand guidelines were given, so the copy is neutral and labelled as a draft.

**Answer**

```
SEQUENCE GOAL
  Name:            Cart recovery, trade customers
  Type:            event-triggered
  Entry trigger:   logged-in customer leaves a cart with items for 60 minutes
  Current state:   items selected, no order
  Desired state:   order placed for the cart
  Primary metric:  share of abandoned carts that become orders within 7 days
  Exit conditions: order placed; cart emptied; unsubscribed; 7 days passed
```

```
SEQUENCE MAP
Email 1: Your cart is saved
  Timing:        1 hour after the trigger
  Goal:          return to the cart and order
  Content theme: the items are saved, stock and delivery date shown
  CTA:           Go to cart
  Branch after:  ordered → exit; no order → Email 2

Email 2: Questions about the parts?
  Timing:        Day 2
  Condition:     no order yet
  Goal:          remove doubt about fit or spec
  Content theme: links to datasheets of the cart items, delivery terms
  CTA:           Go to cart
  Branch after:  ordered → exit; no order → Email 3

Email 3: Talk to sales
  Timing:        Day 5
  Condition:     no order yet
  Goal:          book a callback or order
  Content theme: a sales engineer helps with quantities and alternatives
  CTA:           Request a callback
  Branch after:  callback or order → exit; no action → exit on day 7
```

```
EMAIL 1: Your cart is saved
  Subject line:   Your cart at Kessel is saved
  Subject line B: {{item_count}} items are waiting in your cart
  Preview text:   Stock and delivery date for your selection at a glance.
  ---
  Hello {{first_name}},
  you left {{item_count}} items in your cart. We've saved it for you.
  {{cart_summary}}: availability and expected delivery date per item.
  Button text: Go to cart · Link: {{cart_url}}
  If anything about the parts is unclear, our next email links the datasheets.
  Kessel Customer Service
  ---
  Implementation notes:
  - Personalization tokens: {{first_name}}, {{item_count}}, {{cart_summary}}, {{cart_url}}
  - Dynamic content: stock status per item from the shop system
  - Legal requirements: unsubscribe link, company address, sender identification

EMAIL 2: Questions about the parts?
  Subject line:   Datasheets for the parts in your cart
  Subject line B: Checking the spec? Here are the datasheets
  Preview text:   Dimensions, materials and standards for each item.
  ---
  Hello {{first_name}},
  before ordering fasteners, the spec has to fit. Here are the datasheets for your cart:
  {{datasheet_links}}
  Delivery terms for your account: {{delivery_terms}}.
  Button text: Go to cart · Link: {{cart_url}}
  Kessel Customer Service
  ---
  Implementation notes:
  - Personalization tokens: {{first_name}}, {{datasheet_links}}, {{delivery_terms}}, {{cart_url}}
  - Dynamic content: one datasheet link per cart item
  - Legal requirements: unsubscribe link, company address, sender identification

EMAIL 3: Talk to sales
  Subject line:   A sales engineer can help with your order
  Subject line B: {{first_name}}, shall we call you about your cart?
  Preview text:   Quantities, alternatives, delivery: one call.
  ---
  Hello {{first_name}},
  your cart is still saved. If quantities or alternatives are open, a sales engineer can go through them with you.
  Button text: Request a callback · Link: {{callback_url}}
  Your cart stays available until {{cart_expiry_date}}.
  Kessel Customer Service
  ---
  Implementation notes:
  - Personalization tokens: {{first_name}}, {{callback_url}}, {{cart_expiry_date}}
  - Dynamic content: none
  - Legal requirements: unsubscribe link, company address, sender identification
```

`[Draft — adapt to your brand voice]`

```
DECISION POINT: After each email
  IF order placed for the cart  THEN → exit
  ELSE IF unsubscribed          THEN → remove immediately
  ELSE                          THEN → next email per map
```

Monitoring: baseline is your current reminder, 31% open and 4% recovered `[From customer data]`. Track recovery,
opens, clicks and unsubscribes per email weekly for a month, then every two weeks; targets are gains over it. `[Framework methodology]`

## Example 2: "Best times" and a fixed benchmark requested

**Request**

> Welcome series for our new newsletter subscribers: 10 emails in the first week, sent at the best time of day.
> Aim for the industry open rate of 25%.

**How the skill handles it**

- "Before you start": no send time is called "best" and no outside open rate is used; the target comes from a
  baseline period.
- Pitfalls: 10 emails in 7 days is "too many, too close"; the onboarding pattern spaces emails 1–3 days apart.
- Step 1 comes before any copy, so it asks for the missing desired state and proposes the goal for confirmation.

**Answer**

Two changes I would make, and one question.

1. **Spacing.** Ten emails in seven days is more than one a day; that tends to drive unsubscribes and spam
   complaints. I'd start with 5 emails over 14 days (immediately, then day 2, 4, 8, 14) and test from there.
2. **Send time and target.** No time of day is best for every audience, and an industry figure says nothing about
   your list. I'd send at sign-up time for Email 1, test two send times for the rest, and run 2–4 weeks as a
   baseline; targets are then set as an improvement over your own numbers. `[Framework methodology]`

**Question:** what should a new subscriber have done by the end of the series? For example: read three articles,
set their topic preferences, or register for a webinar. That decides every email's CTA.

Draft goal, to confirm:

```
SEQUENCE GOAL
  Name:            Newsletter welcome
  Type:            onboarding
  Entry trigger:   confirmed newsletter subscription
  Current state:   subscribed, no engagement yet
  Desired state:   [to confirm — e.g., topic preferences set]
  Primary metric:  [to confirm]
  Exit conditions: goal reached; unsubscribed; day 14 passed
```

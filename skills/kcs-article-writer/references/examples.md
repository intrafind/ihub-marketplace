# KCS Article Writer: worked examples

Two complete examples of this skill's work. The names, companies and figures are invented: keep the structure and
the way of working, never reuse the facts.

## Example 1: Troubleshooting article from a resolved ticket

**Request**

> Make a KB article from ticket SD-20417, resolved. Users of our timesheet app Zeitwerk (version 4.2) get
> `Error 409: Period already submitted` when they try to change hours of a past week. Cause: a week locks
> automatically when it's submitted, Friday 18:00. Fix: the team lead opens **Approvals** > **Team periods**,
> selects the week and clicks **Reopen period**; the employee then sees the week as editable with a yellow
> "Reopened" badge. If the team lead is absent, an HR admin does the same under **Admin** > **Periods** >
> **Reopen period**. Owner: Service Desk. Audience: end users and team leads. Related articles: KB-1102 "How to
> submit your timesheet", KB-1140 "Approving team timesheets".

**How the skill handles it**

- Step 1: a user hits an error, so **Troubleshooting**, one topic.
- Step 3: answer first (the fix leads), single-action steps, exact error text in code and UI labels in bold,
  copied from the ticket; ends with the "Reopened" badge as verification.
- Step 4: the literal error string in the title; synonyms (timesheet, time sheet, hours, locked week) in the
  opening and tags; the two related articles as cross-links.
- Nothing is added that the ticket does not contain; the prevention tip is marked as AI-drafted.

**Answer**

```
Article ID: [assigned on publish]
Type: Troubleshooting
Product/Service: Zeitwerk 4.2
Audience: End User
Tags: zeitwerk, timesheet, time sheet, error 409, locked week, reopen period, hours
Created: 2026-11-17
Last Reviewed: 2026-11-17
Review Cycle: on-change
Owner: Service Desk
Status: Draft
```

# `Error 409: Period already submitted` when changing hours in Zeitwerk

You see this error when you try to change hours in a week you already submitted. Ask your team lead to reopen the
week; then you can edit it again. This applies to timesheets (time sheets) in Zeitwerk 4.2. `[From source material]`

## What the user sees
- You open a past week in Zeitwerk and change your hours.
- Zeitwerk shows `Error 409: Period already submitted` and does not save the change.

## Where it occurs
- Zeitwerk timesheet app
- Version 4.2
- Production

## Why it happens
Zeitwerk locks a week automatically when it is submitted, on Friday at 18:00. A locked week can't be edited until
someone reopens it. `[From source material]`

## Fix

### Option A: Your team lead reopens the week
1. Ask your team lead to reopen the week, and name the week you need to change.
2. Your team lead opens **Approvals** > **Team periods**.
3. Your team lead selects the week.
4. Your team lead clicks **Reopen period**.
5. Open the week in Zeitwerk. You should see a yellow **Reopened** badge, and the hours are editable.

### Option B: An HR admin reopens the week (team lead absent)
1. Ask an HR admin to reopen the week.
2. The HR admin opens **Admin** > **Periods**.
3. The HR admin selects the week.
4. The HR admin clicks **Reopen period**.
5. Open the week in Zeitwerk. You should see a yellow **Reopened** badge, and the hours are editable.

`[From source material]`

## Stopping it from recurring
Check your hours before Friday 18:00, when the week locks. `[AI-drafted — verify before publishing]`

## See also
- KB-1102 How to submit your timesheet
- KB-1140 Approving team timesheets

**Pre-publish check:** title matches search terms and error text ✓ · template followed ✓ · steps single-action
and verifiable ✓ · labels and error copied from the ticket ✓ · metadata complete ✓ · 2 related links ✓ · review
on change ✓. Open: no screenshots referenced.

## Example 2: Two topics in one request, and a missing step

**Request**

> Write one article "VPN setup and fixing the certificate error". Users must install the Fortreach client and then
> often get `The server certificate is not trusted (0x80092013)`. Fix from ticket SD-20633: in the client open
> **Settings** > **Certificates**, click **Refresh CA list**, reconnect. Install steps: download from the
> software portal, then... I don't remember the rest. Audience: all staff.

**How the skill handles it**

- Step 1: setup is a How-To and the error is Troubleshooting; "and" in the title means two articles, not a
  hybrid. The troubleshooting article links to the how-to.
- Ground rules: install steps are incomplete, so the how-to is not invented; the skill asks for the steps.
- The client version is not given, so it asks rather than guessing; the troubleshooting draft is delivered now
  because its fix is complete.

**Answer**

This works better as two articles: a How-To for installing the VPN client and a Troubleshooting article for the
certificate error. People searching for the error then land straight on the fix.

I can write the troubleshooting article now. For the how-to I need from you:
1. The install steps after the download from the software portal, with the exact button and menu names.
2. The Fortreach client version these steps apply to.

Here is the troubleshooting draft:

```
Article ID: [assigned on publish]
Type: Troubleshooting
Product/Service: Fortreach VPN client
Audience: All
Tags: vpn, fortreach, certificate, 0x80092013, not trusted, remote access, connection error
Created: 2026-11-17
Last Reviewed: 2026-11-17
Review Cycle: on-change
Owner: [team]
Status: Draft
```

# `The server certificate is not trusted (0x80092013)` in the Fortreach VPN client

Refresh the certificate list in the Fortreach client and connect again. This fixes the certificate error when
the VPN (remote access) does not connect. `[From source material]`

## What the user sees
- The VPN does not connect.
- Fortreach shows `The server certificate is not trusted (0x80092013)`.

## Where it occurs
- Fortreach VPN client
- Version: [please confirm]
- Usually right after installing the client `[From source material]`

## Why it happens
[Cause not given in SD-20633; please add, or remove this section.] `[Article template]`

## Fix

### Option A: Refresh the certificate list
1. Open the Fortreach client.
2. Open **Settings** > **Certificates**.
3. Click **Refresh CA list**.
4. Connect to the VPN again. You should see the connection established without the error.

`[From source material]`

## See also
- [How to install the Fortreach VPN client — to be written]

Open before publishing: client version, the cause, an owner, and 1–4 more related articles.

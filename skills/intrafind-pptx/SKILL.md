---
name: intrafind-pptx
description: "Creates IntraFind-branded PowerPoint decks (.pptx): pins down audience and message, plans the storyline, writes the slides to IntraFind's cover, action-title and layout rules, and builds the file with the pptx skill on the IntraFind corporate design (cover photo with logo panel, mosaic frame, logo, IntraFind colours and fonts). Also moves an existing deck into the IntraFind design by rebuilding its content. Use when the user asks for an IntraFind, branded or corporate deck, a vendor briefing, analyst, customer, partner, board or sales presentation in the IntraFind look, or wants an uploaded presentation in IntraFind design. Needs the pptx skill and the IntraFind document template."
---

# IntraFind presentations

You build presentations in the IntraFind design. You decide what goes on each slide; the **IntraFind document template** puts it into the IntraFind design (cover photo, mosaic frame, logo, colours, fonts); the **`pptx` skill** and its tools (`create_pptx`, `restyle_pptx`) write the file. You never draw the brand yourself.

| Who | Does what |
|---|---|
| **You, with this skill** | Brief, storyline, slide content, IntraFind wording and layout rules, the `create_pptx` call |
| **The `pptx` skill** | The slide grammar (JSON), `create_pptx` for new decks, `restyle_pptx` for uploaded decks, charts, tables, KPI cards, speaker notes. Read its rules; they all apply here |
| **The IntraFind template** | The PowerPoint master: cover photo with logo panel, mosaic strips top and left, logo bottom right, theme colours, fonts, footer and slide number |

Because the template holds the brand, the deck stays on-brand without you setting a single colour or font, and the user can still edit every slide in PowerPoint.

## Step 0: check the setup

1. **Activate the `pptx` skill** (`activate_skill`) if it is not active. It brings `create_pptx` and `restyle_pptx`. Without them you cannot create the file: say so, and offer the slide-by-slide outline (Step 3) as text instead.
2. **Find the IntraFind template.**
   - The tool description says documents use the corporate template "IntraFind …": nothing to do, the app pins it.
   - `create_pptx` offers a `template` parameter that lists an IntraFind template: pass that id on every call, unless the user asks for another one.
   - No IntraFind template anywhere: the deck would come out in a generic design. Tell the user once, in a sentence, that the IntraFind template is not set up in this app (an administrator adds it under **Admin → Customization → Document templates**, or pins it to the app), and ask whether to build the deck anyway. Never imitate the brand with colours or fonts.

## Step 1: pin down the brief

Settle these, asking only for what is missing:

| Point | Question |
|---|---|
| **Audience** | Who sits in the room (analyst, customer, partner, board, colleagues)? What do they know already? |
| **Message** | The one thing they should take away or decide, in one sentence |
| **Size** | Number of slides or minutes. Default: 5–15 slides |
| **Source** | An uploaded document, a previous deck, notes, or only a topic? |
| **Language** | German or English. Use the language of the user's request unless told otherwise |

Uploaded files are already in the conversation as text. Work from them; never invent figures, customer names, quotes or product claims. A fact you do not have gets `[to be confirmed]` on the slide and a line in your answer.

## Step 2: storyline

Choose by goal: **decision** (recommendation, reasons, options, risks, the ask), **briefing or update** (what changed, results, what is next), **explanation** (problem, approach, how it works, proof, next steps), **pitch** (situation, need, solution, evidence, offer). Then:

- One message per slide; the slide title states it.
- Open with the cover, structure decks of eight or more slides with `section` slides, and end with a summary or next-steps slide.
- Put detail that does not fit a slide into `notes`.

## Step 3: write the slides

Follow the `pptx` skill's slide grammar. The IntraFind rules on top:

**Cover** (`"layout": "title"`, always the first slide)
- `title`: the deck title, at most about 70 characters (two lines fit; a third line crowds the date).
- `subtitle`: one short line, such as the date or event and place, e.g. `Mai 2026` or `Analyst briefing · 12 November 2026`.
- Do not add the logo, the company name or a long tagline. The cover template has its own logo and footer.

**Content slides**
- **Action titles**: "Search quality up 18 % after the index change", not "Search quality". At most about 8 words.
- **3–6 short bullets** per slide, parallel in form. Headline numbers go into `metrics`, `chart` or `table`, with units in header, label or note.
- **Vary the rhythm**: do not repeat the same bullet slide. Mix KPI cards, a chart, a table, a two-column comparison.
- The template's layouts keep the area under the content, the logo and the frame free. Do not try to add your own footers, logos, page numbers, decorative bars or a confidentiality note on every slide.
- Do not set `primaryColor`, colour codes or font names: the template decides, and a hand-set colour breaks the brand.

**Charts**: colours follow the template's theme in a fixed order (grey, red, green, purple, blue, coral). Order the series so that the baseline or comparison comes first and the series to emphasise comes second (it is the IntraFind red). One chart, one point; use at most six series.

**Wording**
- Spell the brand and products as IntraFind, iFinder, iAssistant and iHub. Do not write the company name in capitals; the logo does that.
- Use one number format throughout: `1,200.5` in English, `1.200,5` in German; `12 %` with a space in German text.
- Set `language` to `de-DE` or `en-US` to match the slide text.

## Step 4: build the deck

Call `create_pptx` once with the whole deck:

- `filename`: descriptive, without extension (`forrester-briefing-2026`)
- `title`: the deck title; `language`: as above
- `slides`: the JSON array from Step 3
- `template`: the IntraFind template id, if the tool offers the choice (Step 0)
- `footer`: `<short deck title> · <date>` (shown on every slide but the cover)

If the result lists `warnings`, fix their cause (split a slide, shorten the text, cut a table) and build again. A deck is never edited in place: for a revision, create the whole deck again.

Then answer in two or three sentences: the file name, the number of slides and the storyline. Do not paste the slides and do not add a link; the download card is already in the chat.

## Moving an existing deck into the IntraFind design

When the user uploads a `.pptx` and asks for it "in IntraFind design" or "branded":

1. **Keep the deck's content: `restyle_pptx`.** Call it with the id of the uploaded file (the `id` of its `<content>` tag, shown when `can_use_as_template="true"`). The deck keeps its pictures, charts with their data, tables and speaker notes. Its slides go onto the IntraFind master: the first slide becomes the IntraFind cover (its title and subtitle are the cover title and date), every slide gets the layout of its kind, titles and footers take the IntraFind design, text alone on a slide uses the template's content area, and pictures, charts, tables and other shapes keep their arrangement, scaled into it. Colours the deck took from its old theme become the IntraFind colours.
2. **Say what it is:** the old content on the IntraFind master, not a new design of it. A colour or font a shape sets itself stays, and slides with several pictures or tight arrangements can need a look. Read the tool's `warnings`, name the slides they list, and tell the user to look through the deck. If the first slide shows no title and date, say that the cover needs them.
3. **Rewrite the deck: `create_pptx`.** Only when the user also wants better titles, fewer words or another structure: rebuild it from its text with Steps 3–4. Say that pictures, screenshots and drawings of the original are not carried over then, and that `restyle_pptx` would keep them. Never pass the uploaded file as `templateFileId` for this: that would keep its old design instead of the IntraFind one.

## What this skill does not do

The slide design is the template's: fixed layouts, no custom illustrations, gradients, hero images or diagonal accents. For a designer-made look, deliver the editable deck and say that the visual finish happens in PowerPoint. If the user needs a single image, chart or diagram in the deck, create it separately and have them insert it.

## Checklist before you answer

- The first slide is the cover with a short title and a one-line subtitle.
- Every other slide has a title that states its point; no slide is overloaded; no warnings are left.
- The IntraFind template was used (or the user knows it was not); for an uploaded deck, `restyle_pptx` was used unless a rewrite was asked for.
- Nothing in the deck is invented; open points are marked `[to be confirmed]` and named in the answer.
- The answer names the file, the slide count and the storyline, and nothing more.

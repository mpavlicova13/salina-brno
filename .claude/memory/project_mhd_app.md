---
name: MHD Brno learning app
description: Web app for learning Brno tram system (DPMB), created for user's 55-year-old mother starting work at DPMB
type: project
---

A web learning application for brněnské tramvaje (Brno trams).

**Location**: `/Users/mpavlicova/Desktop/Moje projekty/Mamka - MHD appka/`

**Files**:
- `index.html` - main HTML, all 8 screens
- `style.css` - DPMB yellow (#FFD100) + dark navy (#0d1b2a) design, 1392 lines
- `data.js` - all 11 tram lines data (Lines 1,2,3,4,5,6,7,8,9,10,12) with stops
- `engine.js` - question generators (5 types for section A, 12 types for section B)
- `app.js` - UI controller, TTS audio, navigation
- `DPMB - tramvaje.xlsx` - source data (do not modify, only reference)

**3 sections**:
- A) Odkud→Kam: flashcards + quiz (which line goes where)
- B) Zastávky: 12 question types about stop names/order
- C) Procvič linku: TTS audio playback of stops + line-specific quiz

**Data source**: Excel file with 1 sheet for line routes + 11 sheets for stops per line (lines 1-10, 12; no line 11)

**Tech**: Pure HTML/CSS/JS, no build system, no dependencies. Opens directly in browser.

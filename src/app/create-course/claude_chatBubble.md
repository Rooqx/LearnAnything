# UI Implementation Blueprint: "LearnAnything" - AI Tutor Chat View

## Objective
Build the "AI Tutor Chat" view of the dashboard application. This view maintains the exact same global layout, left navigation, and left "Courses" pane as the primary dashboard, but replaces the right pane with a scrollable chat interface.

## Global Variables & Design Tokens

### Standard Palette (From Specifications)
* **App Background:** Light Mode: `#F9FBFA` / Dark Mode: `#121212`
* **Text (Primary):** Light Mode: `#121212` / Dark Mode: `#F9FBFA`
* **Standard Buttons:** `#2ED573` (Hover state: `#2BB801`)
* **Call-to-Action (CTA) Button:** `#F97316`

### Specific Component Colors (Do NOT change these)
* **Course Card 1 Background:** `#E2F6F8` (Light cyan/blue)
* **Course Card 2 / User Chat Bubble:** `#EADBFF` (Light purple)
* **Course Card 3 / AI Chat Bubble:** `#DDFCE2` (Light green)

---

## Layout Structure

### 1. Global Shell & Left Sidebar (Unchanged)
* **Header:** Dark background, top-aligned. Logo text reads **"LearnAnything"** (override the image logo). Standard navigation icons (cap, users, clock, inbox, sliders) and user profile section on the far right.
* **Left Floating Nav:** The same vertical floating pill container with navigation icons, notification bell (with green badge '25'), and +/- buttons.
* **Layout Split:** The two-column split-pane design remains, preserving the organic "wavy" curve where the divider meets the dark header.

### 2. Left Pane: "Courses" (Unchanged)
* Maintains the exact same ~30% width.
* Retains the "Courses" header and the three identically styled course cards (Intro to Programming, Data Science Fundamentals, UX Design Principles) with their respective pastel backgrounds, pill badges, and action buttons.

### 3. Right Pane: "AI Tutor Chat" (~60% width) - **NEW**
* **Background:** Subtle light grey/off-white (same as previous state).
* **Header:** "AI Tutor Chat" (H2 size, `#121212`, top-aligned).
* **Chat History Container:**
    * This area must be vertically scrollable (`overflow-y: auto`) with a visible, styled scrollbar on the right edge.
    * Ample padding between the messages and the container edges.
* **Message Bubbles Layout:**
    * **User Messages:** * Alignment: Flex-end (Right-aligned).
        * Background: `#EADBFF` (Matches the purple course card).
        * Text Color: `#121212`.
        * Border Radius: Heavily rounded, except for a tighter radius on the bottom-right corner to indicate the speaker.
        * *Example Text:* "Can you explain the basics of UX Design?" and "What's enear can you explain the basics of UX Design?"
    * **AI Messages:**
        * Alignment: Flex-start (Left-aligned).
        * Background: `#DDFCE2` (Matches the green course card).
        * Text Color: `#121212`.
        * Border Radius: Heavily rounded, except for a tighter radius on the bottom-left corner.
        * *Example Text:* "Certainly! UX Design focuses on the overall experience..." (Use placeholder text if needed).
* **Input Area (Bottom Fixed within the right pane):**
    * Centered at the bottom of the right pane.
    * Large, heavily rounded pill-shape input field.
    * Left side: Search/Magnifying glass icon.
    * Placeholder text: "Type your message here".
    * Right side (CTA): Large inline button reading "SEND". **Override image color: Use the `#F97316` token.**

## Interaction & State Logic
1.  **Scroll Behavior:** When new messages are added to the Chat History Container, the view should automatically scroll to the bottom.
2.  **Responsive Layout:** On mobile (<768px), the right "AI Tutor Chat" pane should take up 100% of the viewport width, hiding or stacking the "Courses" list behind a menu toggle.

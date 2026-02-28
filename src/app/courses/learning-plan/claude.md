# UI Implementation Blueprint: "LearnAnything" - Teaching Plan & Events View

## Objective
Build a complex, three-column dashboard view for the "LearnAnything" application. This view includes a hierarchical tree layout linking "Modules" to "Chapters" via visual connecting lines, and a side panel for scheduling. **Do NOT include the bottom-center floating circular toolbar.**

## Global Variables & Design Tokens

### Color Palette (Strictly adhere to these hex codes)
* **App Background:** Light Mode: `#F9FBFA` / Dark Mode: `#121212`
* **Text (Primary):** Light Mode: `#121212` / Dark Mode: `#F9FBFA`
* **Standard Buttons & Connecting Lines:** `#2ED573` (Hover state: `#2BB801`)
* **Call-to-Action (CTA):** `#F97316`

---

## Layout Structure

### 1. Global Shell & Left Sidebar (Unchanged)
* **Header:** Dark background, top-aligned. Logo text reads **"LearnAnything"**. Standard navigation icons and user profile section on the far right.
* **Left Floating Nav:** The same vertical floating pill container with navigation icons, notification bell (with green badge '29'), and +/- buttons.
* **Layout Split:** The main content area is divided into three distinct columns. The organic "wavy" curve remains at the top left where the white background meets the dark header.

### 2. Left Column: "Teaching Plan for course" (~35% width)
* **Header:** "Teaching Plan for course" (H2 size, `#121212`).
* **Module Cards (White Background with soft shadow):**
    * **Icon & Title:** Book icon next to "Module 1" (and subsequent modules). Subtitle "TITLE L".
    * **Action Area (Bottom):** Pill-shaped button reading "CHAPTER LONK" (light grey background). Right side has `...`, `x` (light), and `x` (dark circle) buttons.
    * **Connection Node:** On the top-right corner of each Module card, there is a circular, light-green button containing a dark green `+` icon. **This is the origin point for the connecting lines.**

### 3. Middle Column: Chapters (~35% width)
* **Top Header Area:**
    * Search Input: Pill-shaped, light grey background, magnifying glass icon, placeholder "SEARCH".
    * Stat Cards (Row of 3): 
        * Card 1 (Light Blue): "26 Total"
        * Card 2 (Light Green): "2" (with a party popper icon) "Complo"
        * Card 3 (White): "23 uncomplito"
* **Chapter Cards (White Background with soft shadow):**
    * Title area: "Chapter title" followed by "Lecture 1: Basics" or "Quiz 1 Review".
    * Progress bar: A horizontal line indicating completion status.
    * Status Badge: "Completed 🥳" (Light green pill).
    * Action Area: `...`, `x`, and a dark circle checkmark.
    * **Right Edge Node:** A circular green icon (hexagon/cube design) floats on the right edge of the card.

### 4. The Visual Connecting Lines (Crucial Implementation Detail)
* **Logic:** The UI must display a dotted or dashed green line (`#2ED573`) connecting the `+` node on the top-right of a Module card to the left-center edge of its corresponding Chapter cards.
* **Implementation Recommendation:** Use an absolute-positioned `<svg>` overlay that sits between the left and middle columns to draw paths, or use pseudo-elements (`::before`/`::after`) with CSS borders to create the branching tree structure connecting the parent (Module) to the children (Chapters).

### 5. Right Column: "My Event" (~30% width)
* **Divider:** A subtle vertical dashed/dotted line separates the Middle and Right columns.
* **Header:** "My Event" (H2 size, `#121212`).
* **Event Cards (Pastel Backgrounds):**
    * **Card 1 (Light Blue):** Header has an avatar, "Webinar", and date "Tu, 25.03". Title: "Department Meeting". Description text. Pill badge: "Start at 12:30".
    * **Card 2 (Light Purple):** Header has soundbar icon, "Lesson", date "We, 26.03". Title: "Final Review". Description text.
    * **Card 3 (Light Yellow):** Header has pin icon, "Task", date "Th, 27.03". Title: "Submit Final Grades". Description text.
* **Floating Element (Bottom Right):**
    * A tilted, light green (`#DDFCE2`) sticky-note style card.
    * Pin icon, header "Teacher Tools", date "Fr, 28.07".
    * Text: "Importance of teamwork and communication..."
    * *Z-index must be high enough to float above the column content.*
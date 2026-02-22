# UI Implementation Blueprint: "LearnAnything" Dashboard

## Objective
Build a pixel-perfect, fully responsive web application UI based on the provided specifications. The layout features a unique split-pane design with a custom color palette. 

## Global Variables & Design Tokens

### Color Palette (Strictly adhere to these hex codes)
* **App Background:** Light Mode: `#F9FBFA` / Dark Mode: `#121212`
* **Text (Primary):** Light Mode: `#121212` / Dark Mode: `#F9FBFA`
* **Standard Buttons:** `#2ED573` (Hover state: `#2BB801`)
* **Call-to-Action (CTA) Button:** `#F97316`
* **Course Card Colors (Do NOT change these):**
    * Card 1 Background: `#E2F6F8` (Light cyan/blue)
    * Card 2 Background: `#EADBFF` (Light purple)
    * Card 3 Background: `#DDFCE2` (Light green)

### Typography
* Use a clean, modern sans-serif geometric font (use Poppins).
* Headings are bold and rounded; body text is highly legible.

---

## Layout Structure
The application has a dark outer "device" frame. Inside, the main content area is divided into a top header and a two-column layout. 
**Crucial Detail:** The dividing line between the left and right columns does not go straight up to the header. It merges into the header with a distinct, organic "wave" or "swoosh" curve.

### 1. Top Header
* **Left:** Logo text reads **"LearnAnything"** in bold, white text (placed in the dark header area).
* **Center-Right (Navigation Items):** * "Learning Plan" with an academic cap icon.
    * Four monochrome icon buttons (Users, Stopwatch/Clock, Inbox, Settings/Sliders).
* **Far Right (Profile):** * Circular user avatar.
    * Text: "Ellington Thom" (Name) and "annetteg.gmail.com" (Subtitle/Email).
    * Chevron down icon.

### 2. Left Floating Navigation Rail
Positioned on the far left of the main content area, containing vertical pill-shaped floating containers.
* **Top Pill:** Contains a dark circle icon (active state), a hamburger menu icon, and a grid icon.
* **Middle Icon:** A bell icon with a notification badge showing the number "25" in green.
* **Bottom Pill:** Contains a '+' button and a '-' button separated by a subtle divider.

### 3. Left Pane: "Courses" (~40% width)
* **Background:** `#F9FBFA`
* **Header:** "Courses" (H2 size, `#121212`).
* **Course Cards:** Render three distinct cards with heavy border-radius (rounded corners).
    * **Card 1:** Background `#E2F6F8`. Title: "Introduction to Programming". Description: "Learn basic medical language for effective communication." Status Badge: "Completed 🥳" (Light green pill). Action buttons: `...`, `x` (light), `x` (dark circle).
    * **Card 2:** Background `#EADBFF`. Title: "Data Science Fundamentals". Description: "Learn basic medical language for effective communication." Status Badge: "In Progress ⏱" (Light yellow pill). Action buttons: `...`, `x` (light), `x` (dark circle).
    * **Card 3:** Background `#DDFCE2`. Title: "UX Design Principles". Description: "Understand ethical principles and professionals and nouisomenns in healthcare." Status Badge: "Upcoming ⏱" (Light grey/white pill). Action buttons: `...`, `x` (light), `x` (dark circle).

### 4. Right Pane: "Create New Course" (~60% width)
* **Background:** A very subtle light grey/off-white to contrast slightly with the left pane, maintaining the wavy top edge where it meets the header.
* **Header:** "Create New Course" (H2 size, `#121212`).
* **Prompt Input:** Centered vertically and horizontally in its section.
    * Large, heavily rounded pill shape.
    * Left side: Search/Magnifying glass icon.
    * Placeholder text: "Enter what u would like to learn" (Use `#121212` with reduced opacity).
    * Right side (The CTA): A large inline button with the text "SEND". **Override the image color for this button and use the CTA token: `#F97316`**.

## Interaction & State Logic Requirements
1.  **Hover States:** Apply `#2BB801` to standard interactive elements (like the floating nav icons) as specified in the palette.
2.  **Responsiveness:** On screens smaller than 768px, stack the "Courses" and "Create New Course" panes vertically, flattening the wavy divider line.

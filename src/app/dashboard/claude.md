# UI Implementation Blueprint: E-Learning Dashboard ("EasyLearn" Layout)

## Objective
Build a comprehensive, masonry-style dashboard layout for an e-learning platform. The design is clean, card-based, and relies on a light grey background with white cards and a distinct primary brand color. 

*Note to AI:* There are several spelling errors in the source design ("cources", "Begginer", "proccess"). Please output the corrected spellings ("courses", "Beginner", "process") in the final code.

## Global Variables & Design Tokens
* **Background (App):** `#F3F4F6` (Light grey/blue tint)
* **Card Background:** `#FFFFFF`
* **Primary Brand/CTA Color:** Coral/Orange (e.g., `#F07154` or use provided custom brand hex).
* **Text (Primary):** Dark Grey/Black (`#121212`)
* **Text (Secondary/Muted):** `#6B7280`
* **Border Radius:** Use heavily rounded corners (e.g., `rounded-2xl` or `rounded-3xl` in Tailwind) for all cards and inner elements.

---

## Layout Structure

### 1. Top Navigation Bar
* **Container:** Full width, white background, flex container, vertically centered, sticky at the top with slight padding.
* **Left (Logo):** Coral/Orange abstract icon alongside the text "EasyLearn" (Bold).
* **Center (Nav Links):** A pill-shaped container holding navigation links:
    * "All courses"
    * "Dashboard" (Active state: Dark grey/black pill background, white text)
    * "Statistic"
    * "AI-assistant"
    * "Support"
* **Right (Actions):** * Headphone/Support icon.
    * Notification Bell icon (with a red notification dot).
    * User Avatar (circular image).

### 2. Main Content Grid
The main area is divided into a left sidebar column (~30% width) and a right main content area (~70% width) which is further divided into rows.

#### Left Column: "Statistic" Card
* **Header:** "Statistic" (H2) on the left, a small "View all" pill button on the right.
* **Profile Section:**
    * Large circular user avatar in the center.
    * An incomplete circular progress ring (coral color) wraps around the avatar.
    * A small overlapping pill badge at the bottom center of the avatar reads "Beginner" (coral text, light coral background).
    * Greeting: "Welcome, Tim 👋" (Centered, Bold).
* **Activity Section:**
    * Large text: "78%" next to smaller text "Total month activity".
    * A segmented horizontal progress bar underneath (Purple: 42%, Yellow: 15%, Coral: 56%).
* **Summary Stats (Bottom row of 3 items):**
    * Item 1: Purple clock icon, "9", "In progress".
    * Item 2: Yellow calendar icon, "4", "Upcoming".
    * Item 3: Coral checkmark icon, "15", "Completed".

#### Right Column: Top Row ("Your courses")
* **Container:** A large, prominent card with the Primary Coral/Orange background.
* **Header:** "Your courses" (White text, H2), flanked on the right by white `<` `>` arrow buttons and a white "View all" button.
* **Course Cards (Flex row, horizontal scroll):**
    * Three white cards inside the coral container.
    * **Card Anatomy:**
        * Title (e.g., "Design thinking", "Leadership", "IT English").
        * Badges (e.g., "Advanced", "4/12 classes").
        * Progress: Percentage (e.g., "46% completed") and a progress bar line.
        * Footer: Tiny avatar and "Mentor: [Name]".

#### Right Column: Bottom Row (Split 50/50)
* **Bottom Left: "Study process" Card**
    * White background.
    * Header: "Study process" with a "Week v" dropdown pill on the right.
    * Chart: A bar chart with 4 bars ("Engage", "Grow", "Skills", "Rate").
    * Bar styling: The "Skills" bar is active (tallest, colored coral, displaying "87%"). The other bars are greyed out with their respective percentages.
* **Bottom Right: "AI assistant" Card**
    * **Background:** Needs a glossy, 3D abstract pink/purple fluid gradient background image or CSS effect.
    * **Top Right Actions:** A small white "Refresh Model" pill and a `...` menu button.
    * **Bottom Area:** Title "AI assistant" in white text.
    * **Input Field:** A white, pill-shaped input spanning the width. Placeholder: "Ask something...". Right side has a circular Coral button with a white paper airplane/send icon.

## Interaction & State Logic
1.  **Flex/Grid Constraints:** The right column must perfectly contain the nested cards, ensuring the bottom two cards equal the exact width of the top "Your courses" card.
2.  **Responsiveness:** On mobile, the grid must collapse into a single column, stacking the Navigation, Statistic Card, Your Courses, Study Process, and AI Assistant vertically.
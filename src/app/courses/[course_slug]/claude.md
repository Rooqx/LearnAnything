# UI Design Specifications: "Learnanything" Mobile Interface
**Document Purpose:** This document provides strict architectural and design guidelines for generating the mobile learning interface for the "Learnanything" platform. Follow these specifications exactly to ensure UI/UX consistency.

## 1. Global Design Tokens (Color Palette)
The application supports a strict Light and Dark mode system. Variables must be mapped as follows:

### Backgrounds & Surfaces
* **Light Mode Background:** `#F9FBFA`
* **Dark Mode Background:** `#121212`

### Typography
* **Light Mode Text:** `#121212`
* **Dark Mode Text:** `#F9FBFA`

### Interactive Elements (Buttons & Accents)
* **Primary Accent/Button:** `#2ED573`
* **Button Hover/Active State:** `#26B861`
* **Call to Action (CTA):** `#F97316`

---

## 2. Layout Architecture
The interface is a mobile-first reading and learning environment. It consists of three primary layers:
1.  **Top Header:** Static/Sticky top navigation.
2.  **Scrollable Content View:** The main reading area containing text and code snippets.
3.  **Fixed Navigation Overlay:** Floating side arrows and a fixed bottom navigation bar.

---

## 3. Component Breakdown

### A. Top Header
* **Layout:** Flex container (`justify-content: space-between`, `align-items: center`).
* **Left Element:** The app brand name `"Learnanything"`. Font weight should be bold or semi-bold.
* **Right Element:** A vertically stacked indicator for the current location in the curriculum. 
    * Top line: `Module 1`
    * Bottom line: `Chapter 1` (Aligned to the right).

### B. Main Content Area (Reading View)
* **Title:** Prominent `H1` header at the top of the content flow.
* **Paragraphs:** Highly readable text blocks with appropriate line-height for long-form reading.
* **Snippet Sections (Code/Formulas):** * **Crucial Rule:** These are *not* rigid, heavily bordered boxes. 
    * They should be subtly formatted sections (e.g., a very slight background tint contrast or subtle left-indent border) to clearly distinguish formulas or code from regular text while maintaining a clean, open feel.

### C. Floating Side Navigation (Pagination)
* **Elements:** Left chevron `<` (Previous) and Right chevron `>` (Next).
* **Positioning:** `position: fixed`. Centered vertically on the left and right edges of the screen.
* **Z-Index:** Must sit above the scrolling content so they are always accessible.

### D. Bottom Navigation Bar
* **Positioning:** `position: fixed`, anchored to the bottom of the viewport.
* **Layout:** Grid or Flexbox with three distinct interactive zones.
* **Left Zone:** "Home" icon (House).
* **Center Zone (Page Indicator):**
    * A pill-shaped container (rounded borders).
    * Contains individual circular indicators representing pages (`pg 1`, `pg 2`, etc.).
    * **Active State:** The circle for the current page must use the Primary Accent (`#2ED573`) with the text color inverted for readability. 
* **Right Zone:** "AI" icon (represented by a Star).

---

## 4. Developer Instructions
* Ensure smooth transitions between Light and Dark themes.
* Ensure the fixed elements (side arrows, bottom bar) do not obscure the reading text at the absolute bottom or sides of the scrollable container (add appropriate padding/margins to the main content wrapper).

## 5. Architectural Container: The "Scooped" App Frame
**Document Purpose:** This section defines the structural wrapper (the black outer frame) that houses the main application interface. It features complex, non-standard geometry using inverted curves (scoops/cutouts).

### A. Global Frame Properties
* **Background Color:** `#000000` (or extremely dark gray, e.g., `#121212`).
* **Outer Shape:** A full-viewport or large-modal container with rounded outer corners (approx. `border-radius: 24px`).
* **Inner Content Area:** The central content area (white) sits inside this frame and must have its own rounded corners to match the frame's internal curvature.

### B. Top Header Bar (Complex Geometry)
* **Layout:** `display: flex`, `justify-content: space-between`, `align-items: center`. 
* **Padding:** Standard padding on left and right edges (approx. `24px` to `32px`).
* **The "Top Scoop" (Crucial Structural Element):** * Exactly in the top-center of the header, the black background extends downward into the white content area, creating a smooth, sweeping concave curve (a "scoop" or "bite"). 
    * *Implementation Note for AI:* This requires advanced CSS styling, likely utilizing `clip-path`, SVG masking, or pseudo-elements (`::before`/`::after`) with radial gradients to achieve the smooth inverted border-radius transition into the main white content body.
* **Header Elements (Left to Right):**
    * **Left:** App logo/name (`"Dei"`) in bold, large white sans-serif typography.
    * **Center:** A horizontal navigation menu consisting of white, minimalist stroke icons (Graduation Cap + "Learning Plan", Group, Gauge/Timer, Inbox, Sliders). These sit *above* the central scoop.
    * **Right:** User profile component (Circular Avatar image, Stacked text: Name on top, Email on bottom).

### C. Bottom Footer Bar (Complex Geometry)
* **Layout:** Spans the full width of the bottom edge.
* **The "Bottom Scoop":**
    * Exactly in the bottom-center, the black frame curves sharply upward into the white content area, creating a semi-circular dome/arch.
    * **Purpose:** This bottom scoop acts as a docking bay for a floating, pill-shaped toolbar containing circular quick-action buttons (Text, Pen, Notes, etc., in various pastel colors). The toolbar is nested perfectly within the negative space of this arch.
* **Implementation Note:** Similar to the top scoop, this requires complex CSS masking or pseudo-elements to ensure the inner white container wraps smoothly around the intruding black bottom arch.

### D. Side Borders
* The top header and bottom footer are connected by solid black side borders, effectively creating a 360-degree wrapper around the main content, though the top and bottom are much thicker to accommodate the navigation and complex curves.

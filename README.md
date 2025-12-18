## ♟ Chess Champions CRUD App

A clean and well-structured **Vanilla JavaScript CRUD application** for managing a list of chess champions.
The project focuses on **architecture, state management, UI consistency, and best practices**, rather than frameworks.

This repository represents the **current polished version** of the app after iterative refactoring and UI improvements.

## 🚀 Features

📥 Load champions from REST API

🔍 Client-side search with debounce

➕ Add a new champion

✏️ Inline edit with single active edit mode

🗑 Delete champion

📄 Client-side pagination

◀️▶️ Prev / Next navigation

🎯 Active page highlighting

⚡ Single Source of Truth (local cache)

🧠 Centralized API error handling

🎨 Clean and modern UI

## 🛠 Tech Stack

* **HTML5** – semantic markup

* **CSS3** – modern layout, flexbox & grid

* **Bootstrap** - used for Pagination only

* **JavaScript (ES6+)** – vanilla JS, no frameworks

* **MockAPI** – REST backend

## 📂 Project Structure

```text
project/
│
├── index.html      # Markup
├── style.css       # Styles & layout
├── script.js       # Application logic
└── README.md       # Documentation
```

## 🧠 Architecture Overview
### Single Source of Truth

The application uses explicit UI state to manage pagination and rendering:

```javascript
    let championsCache = [];
    const state = {
        page: 0,
        pageSize: 10,
    };
```

The UI is always rendered from this state.
No direct DOM mutations are performed after API calls.

### Render Flow
User Action
   ↓
Validation
   ↓
API Request
   ↓
Update State
   ↓
Render UI

This approach ensures:

* predictable UI behavior

* easy debugging

* no state/DOM desynchronization

### 🔍 Search Implementation

* Performed entirely on the client

* Uses a debounced input handler

* No additional API calls

```javascript
    searchChampionName.oninput = debounce(() =>
        state.page = 0;
        renderChampions(currentView(), state.page * state.pageSize);
    );
```

Filtering is derived from state:

```javascript
    function currentView() {
    const value = searchChampionName.value.trim().toLowerCase();
    return value
        ? championsCache.filter(ch => ch.name.toLowerCase().startsWith(value))
        : championsCache;
    }
```
### ✏️ Edit Mode Behavior

* Only one card can be edited at a time

* Opening a new edit automatically closes the previous one

* User confirmation is required to discard changes

* Edit mode is fully restored from state, not DOM patches

```javascript
    function closeActiveEdit() {
        const activeEditCard = document.querySelector(".champion-card.edit-mode");

        if (!activeEditCard) return true;

        if (activeEditCard) {
            const confirmClose = confirm("Discard changes?");
            if (!confirmClose) return false;
        }

        const id = activeEditCard.dataset.id;
        const champion = championsCache.find((ch) => ch.id === id);

        if (!champion) return true;

        activeEditCard.replaceWith(renderChampionCard(champion));

        return true;
    }
```

This avoids DOM inconsistencies and visual glitches.

### 📄 Pagination Logic

Pagination is implemented entirely on the client side and works together
with filtering and search.

* Pagination state is stored centrally
* No additional API requests are made
* Pagination automatically adapts to filtered results

### Render Flow
State
   ↓
Filtered View
   ↓
Paginated Slice
   ↓
Render UI

Changing search input resets the current page to avoid empty views.

### 🎨 UI & Styling Principles

* Consistent form layout using shared CSS patterns

* Grid-based form rows (label | field)

* Responsive design without fixed widths

* Clear visual hierarchy

* No inline styles

Search and Add forms share the same visual structure for consistency.

## 🎨 UX Decisions

* Search input uses debounce to avoid unnecessary re-renders

* Pagination resets on filtering to prevent empty pages

* Active pagination page is highlighted

* Forms share consistent layout and spacing

* Confirmation dialogs prevent accidental data loss

### ⚠️ Error Handling

All network requests are centralized:

```javascript
    async function request(url, options = {}) {
    const response = await fetch(url, options);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    return response.json();
    }
```

User-facing errors are handled in one place:

```javascript
    function showError(message) {
    alert(message);
    }
```
### 📱 Responsive Design

* Cards are displayed using CSS Grid

* Forms adapt automatically to screen width

* Mobile-friendly layouts via media queries

No JavaScript is used for layout handling.
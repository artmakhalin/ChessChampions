## ♟ Chess Champions CRUD App

A clean and well-structured **Vanilla JavaScript CRUD application** for managing a list of chess champions.
The project focuses on **architecture, state management, UI consistency, and best practices**, rather than frameworks.

This repository represents the **current polished version** of the app after iterative refactoring and UI improvements.

## 🚀 Features

📥 Load champions from REST API

🔍 Client-side search with debounce

➕ Add a new champion

✏️ Edit champion inline (single active edit mode)

🗑 Delete champion

⚡ Single Source of Truth (local cache)

🧠 Centralized API error handling

🎨 Clean and modern UI

## 🛠 Tech Stack

* **HTML5** – semantic markup

* **CSS3** – modern layout, flexbox & grid

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

All application data is stored in a single state variable:

```javascript
    let championsCache = [];
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
        renderChampions(currentView())
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

* Opening a new edit closes the previous one

* Edit state is fully controlled by re-rendering from state
```javascript
    function closeActiveEdit() {
    const activeEditCard = document.querySelector('.champion-card.edit-mode');
    if (!activeEditCard) return;


    const id = activeEditCard.dataset.id;
    const champion = championsCache.find(ch => ch.id === id);
    if (!champion) return;


    activeEditCard.replaceWith(renderChampionCard(champion));
    }
```

This avoids DOM inconsistencies and visual glitches.

### 🎨 UI & Styling Principles

* Consistent form layout using shared CSS patterns

* Grid-based form rows (label | field)

* Responsive design without fixed widths

* Clear visual hierarchy

* No inline styles

Search and Add forms share the same visual structure for consistency.

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
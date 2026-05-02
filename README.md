# PromptLib Vue.js Project

## Setup & Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint files
npm run lint
```

## Project Structure

```
src/
├── components/       # Reusable Vue components
│   ├── NavBar.vue
│   ├── Sidebar.vue
│   ├── PromptCard.vue
│   ├── PromptDetail.vue
│   ├── PromptForm.vue
│   ├── FilterBar.vue
│   ├── SearchInput.vue
│   ├── SortSelect.vue
│   ├── Tag.vue
│   ├── BulkToolbar.vue
│   ├── EmptyState.vue
│   ├── Overlay.vue
│   └── ThemeToggle.vue
├── data/             # Static JSON data files
│   └── prompts.json
├── types/            # TypeScript interfaces & types
│   └── index.ts
├── assets/           # Images, fonts, global styles
│   └── styles.css
├── App.vue           # Main application component
└── main.ts           # Application entry point
```

## Components Overview

| Component | Description |
|-----------|-------------|
| NavBar.vue | Top navigation bar with logo and theme toggle |
| Sidebar.vue | Side panel for filters and categories |
| PromptCard.vue | Card display for individual prompts |
| PromptDetail.vue | Detailed view of a single prompt |
| PromptForm.vue | Form for creating/editing prompts |
| FilterBar.vue | Filter controls for prompt types |
| SearchInput.vue | Search input with debounce |
| SortSelect.vue | Dropdown for sorting options |
| Tag.vue | Display component for tags |
| BulkToolbar.vue | Toolbar for bulk operations |
| EmptyState.vue | Empty state display when no results |
| Overlay.vue | Modal overlay component |
| ThemeToggle.vue | Dark/light theme switcher |

## Tech Stack

- Vue 3 with Composition API
- TypeScript (strict mode)
- Vite as build tool
- @vueuse/core for composables
- SCSS for styling

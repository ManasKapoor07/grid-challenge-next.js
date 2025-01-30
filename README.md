# Candidate Grid with URL-Based State Management

## Overview
This project implements a dynamic candidate grid using **AG Grid** in a **Next.js** environment with **ShadCN** for UI components and **Bun** as the package manager. The grid includes powerful filtering, sorting, pagination, and column management capabilities. Additionally, **nuqs** is used to manage state via URL parameters, ensuring that user selections persist across page reloads.

## Features
- **State Persistence with URL Parameters:**
  - Filters, sorting, pagination, and hidden columns are stored in the URL.
  - Uses `nuqs` to maintain query states across reloads.
- **Search Functionality:**
  - Instant search through candidate data.
  - Supports inline filtering using `floatingFilter`.
- **Pagination and Page Size Selection:**
  - Users can navigate between pages, and the page number is reflected in the URL.
  - Page size selection updates dynamically.
- **Sortable Columns:**
  - Columns are sortable and store the sorting order in the URL.
- **Column Customization:**
  - Users can toggle visibility for individual columns.
- **CSV Export:**
  - Exports the displayed grid data as a CSV file.

## Technologies Used
- **Next.js** (React Framework)
- **AG Grid** (Data Grid Library)
- **nuqs** (Query State Management via URL)
- **ShadCN** (UI Component Library)
- **Bun** (Package Manager)
- **Tailwind CSS** (Styling)
- **Lucide React** (Icons)

## Installation & Setup
1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo/candidate-grid.git
   cd candidate-grid
   ```
2. Install dependencies using Bun:
   ```sh
   bun install
   ```
3. Run the development server:
   ```sh
   bun dev
   ```
4. Open the application at `http://localhost:3000`

## Usage Instructions
- **Searching:** Type in the search bar to filter candidate names.
- **Sorting:** Click on column headers to sort data.
- **Pagination:** Use the pagination controls to navigate pages.
- **Toggle Columns:** Click "Hide Columns" to show/hide specific columns.
- **Export to CSV:** Click the "CSV file" button to download data.

## Future Enhancements
- Implement **server-side filtering and sorting** for large datasets.
- Add **multi-filter support** for more complex queries.
- Introduce **dark mode toggle** for better UX.

## Conclusion
This project effectively combines **AG Grid**, **ShadCN**, and **nuqs** for a robust, user-friendly candidate grid. With URL-based state persistence, users can seamlessly navigate and customize the grid while maintaining their preferences across sessions.

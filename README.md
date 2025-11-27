# Menu Catalog REST API
This project is a simple REST API for managing a menu.

It was built for a GDGoC assignment to show:

- Basic CRUD: Create, Read, Update, Delete 
- Extra features: search, filters, group-by
- A small integration with Google Gemini API to give “health risk” hints for each menu

The API is built with Node.js, Express, and SQLite.

## 1. What this API does
The API lets you:
- Add new menu items (name, category, calories, price, ingredients, description)
- Get a list of menu items
- Filter, search, and paginate menu items
- Update or delete existing menu items
- Group menu items by category
- (Optional) Ask Gemini to analyze a menu item and return which health conditions should be cautious (e.g. diabetes for very sweet drinks)

This API is designed to match the **Postman collection** given in the assignment.

## 2. Quick Start

### Prerequisites
- Node.js (v18+ recommended)
- npm

### Install dependencies
```bash
npm install

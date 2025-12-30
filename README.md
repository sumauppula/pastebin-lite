# Pastebin Lite

A simple Pastebin-like application built with Next.js that allows users to create text pastes and share them via a URL. Pastes can optionally expire based on time-to-live (TTL) or view-count limits.

---

## Features

- Create a text paste and receive a shareable URL
- View a paste via a public link
- Optional constraints:
  - Time-based expiration (TTL)
  - View-count limit
- Pastes become unavailable once a constraint is triggered
- Safe HTML rendering (no script execution)

---

## Tech Stack

- **Next.js (Pages Router)** – UI and API routes
- **Node.js**
- **Upstash Redis** – persistence layer with TTL support

---

## Running Locally

```bash
npm install
npm run dev

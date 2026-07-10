# Devstart Improvements Backlog & Roadmap

This document serves as the tracking space for all potential enhancements, visual polishes, and feature additions to the Devstart platform.

---

## 🚀 1. Feature Enhancements

### ✉️ Interactive Messaging Inbox
- **Current State**: The messaging widget displays a static preview of recruiter messages, and the "Inbox →" link points to an empty action.
- **Improvement**: Create a dedicated Inbox route (`/dashboard/inbox`) or a beautiful drawer overlay showing interactive chat threads. Allow users to:
  - Select quick-reply templates (e.g., "Accept Interview", "Reschedule Call").
  - Type and submit messages that update local storage threads in real-time.
  - Receive automated simulator messages (system triggers) when applying to new roles.

### 📝 Real-time Resume Review & Feedback
- **Current State**: Shows a static review from "Jordan Kim, Senior Engineer @ Stripe".
- **Improvement**: Make the resume card fully interactive:
  - Create a modal for uploading PDF/Text resumes.
  - Implement a simulated analyzer that scans the resume for common dev pitfalls (lack of impact metrics, listing too many skills, etc.).
  - Provide a score progress wheel and high-fidelity, line-by-line inline recommendations.

### 📋 Kanban Board for Application Pipeline
- **Current State**: The application tracker lists items in a list filtered by active stage tiles.
- **Improvement**: Build a drag-and-drop Kanban board view of the pipeline:
  - Columns: *Applied*, *In Review*, *Interview Scheduled*, *Offer Received*.
  - Users can drag cards across columns to update application stage, which dynamically refreshes backend/localStorage state and recalculates metrics.

### ⚙️ Interactive Profile & Skills Matcher
- **Current State**: "Update Profile" button in quick actions is static.
- **Improvement**: Build a Profile setup page:
  - Users select their primary tech stack (e.g., React, Go, Python, Rust), location preferences, and GitHub portfolio link.
  - Dynamically recalculate recommended internships and match scores on the dashboard (e.g., adding "Rust" boosts the Codeshift recommendation match from 82% to 98%).

---

## 🎨 2. Visual & Interaction Polish (Aesthetics)

### 📈 Micro-animations & Charts
- **Current State**: Stats cards show static delta values.
- **Improvement**: Add subtle micro-charts (e.g. framer-motion SVG sparklines) on hover to show progress trend lines for profile strength or views over time.
- **Sound/Haptic feedback**: Add extremely quiet, premium UI sound cues on successful applications or bookmarks.

### 🌓 True Dark/Light Mode Themes
- **Current State**: Dark mode colors are hardcoded as deep black/gray (`#090909`, `#1c1c1c`).
- **Improvement**: Refine variables inside `src/app/globals.css` to build an elegant glassmorphism dark theme matching standard Tailwind design guidelines, and hook up a fully operational theme toggler.

### 🔍 Search Page Filters
- **Current State**: Search is a single text-input string matching company, role, stack, or location.
- **Improvement**: Add filter pills/checkbox dropdowns on `/internships`:
  - Tag filter: *Remote*, *Hybrid*, *On-site*.
  - Tech stack multi-select: *React*, *Next.js*, *Node.js*, *Go*, *Python*, *gRPC*, *Terraform*.
  - Location radius/country selector.

---

## 🛠️ 3. Architecture & Infrastructure

### ⚡ Global State Provider
- **Current State**: State is synchronized between `/dashboard` and `/internships` using local state synchronized via `window.dispatchEvent(new Event('devstart:state-change'))`.
- **Improvement**: Refactor State Management using standard React Context or a lightweight state store (e.g., Zustand) to maintain a single source of truth for `applications`, `savedInternships`, and `userProfile` without manually raising DOM events.

### 🗄️ Database Integration
- **Current State**: Mock data is initialized in local storage.
- **Improvement**: Migrate listing queries to server-side fetching using PostgreSQL/Prisma or direct API route endpoints to handle real persistent server data.

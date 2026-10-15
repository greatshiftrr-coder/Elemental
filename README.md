# Elemental — Interactive Periodic Table of Elements

An interactive, responsive periodic table of chemical elements designed with a clean, publication-grade scientific aesthetic.

## Features

- **All 118 Elements**: Complete data for elements 1 (Hydrogen) to 118 (Oganesson) following IUPAC standards.
- **Interactive Bohr Atomic Model**: Concentric electron shell visualization with actual electron configurations (`2, 8, ...`), orbital rotation animations, speed control, and pause/play.
- **Thermodynamic Temperature Simulation**: Real-time temperature slider from 0 K to 6000 K with phase transition states (Solid, Liquid, Gas) dynamically calculated based on empirical melting and boiling points.
- **Mobile & Tablet Optimized**:
  - **18-Column Grid**: Smooth horizontal scroll with progress indicator and quick-jump block navigation (`s-block`, `d-block`, `p-block`, `f-block`).
  - **Pocket View**: Dedicated vertical mobile layout grouping elements by Period and Block for effortless phone browsing.
  - **Touch-Friendly Bottom Sheet**: Responsive inspector modal with swipe handle and clear metric cards.
- **Metric Overlays**: Standard Atomic Mass, Electronegativity ($\chi$), 1st Ionization Energy, Density, and Valence Electrons.
- **Side-by-Side Comparison**: Compare any two elements simultaneously.
- **Periodic Trends Visualizer**: Interactive scatter and line charts showing electronegativity, ionization energy, melting points, and density across atomic numbers.
- **Sortable Table View**: Searchable list view with sticky primary columns and mobile card switcher.

## GitHub Pages Deployment

This repository includes an automated GitHub Actions deployment workflow (`.github/workflows/deploy.yml`).

### How to enable GitHub Pages on your repository:
1. Open your repository on GitHub.
2. Go to **Settings** → **Pages** (in the left sidebar under "Code and automation").
3. Under **Build and deployment**:
   - Change **Source** to **GitHub Actions**.
4. Push your commits to `main` (or go to **Actions** tab → click **Deploy to GitHub Pages** → click **Run workflow**).
5. In ~1 minute, your live website will be live at:
   `https://<your-username>.github.io/<your-repo-name>/`

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```


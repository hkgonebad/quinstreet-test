# Nest Thermostat Landing Page

A responsive landing page for a thermostat giveaway, built for a frontend developer assessment.

## Live Demo

[https://hkgonebad.github.io/quinstreet-test/](https://hkgonebad.github.io/quinstreet-test/)

## Technical Challenges

During development, I encountered and solved several interesting challenges:

- Implementing a smooth background transition that works consistently across browsers
- Creating a phone input mask that handles both keyboard and paste events correctly (AI helped here)
- Optimizing form validation to provide helpful feedback without sacrificing performance 
- Handling form submission timeouts gracefully while providing visual feedback

## Bug Fixes

- Fixed issues with form validation error messages appearing in incorrect positions on mobile devices
- Fixed cross-browser compatibility issues with flexbox alignment in the form container
- Addressed focus state inconsistencies between browsers for form inputs

## Development

```bash
# Install dependencies with npm
npm install

# Or use Bun for faster installation (recommended)
bun install

# Run development server
npm run dev
# or
bun run dev

# Build for production
npm run build
# or
bun run build
```

## Deployment

The project uses GitHub Actions for automatic deployment to GitHub Pages. The workflow runs on pushes to the main branch.

## Browser Support

Tested and working on:
- Chrome (latest)
- Firefox (latest)
- Safari (Not tested)
- Edge (latest) 
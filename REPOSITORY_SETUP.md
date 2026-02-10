# Repository Setup Guide

This document explains how to configure the DexStitch GitHub repository to match the professional quality standards of the WestKitty organization.

## GitHub Repository Settings

### 1. Repository Description

Set the repository description to:
```
Local-first parametric sewing pattern design & embroidery digitization PWA. Privacy-first, offline-capable, with AI body scanning and real-time P2P collaboration.
```

### 2. Website URL

Add: `https://westkitty.github.io/DexStitch/` (or your deployment URL)

### 3. Topics/Tags

Add these topics in the repository settings (see [TOPICS.md](TOPICS.md) for full list):

**Primary:** `sewing`, `patterns`, `embroidery`, `parametric-design`, `pwa`, `local-first`

**Tech Stack:** `typescript`, `react`, `vite`, `tensorflow`, `yjs`, `crdt`

**Features:** `offline-first`, `privacy`, `peer-to-peer`, `machine-learning`, `public-domain`, `dexter`

### 4. Social Preview Image

Upload `assets/icon.png` (or create a banner.webp) as the social preview image:
- Settings → Social preview → Upload an image
- Recommended size: 1280×640px

### 5. Enable Discussions

- Settings → Features → Check "Discussions"
- Create welcome post about project philosophy

### 6. Configure Pages (Optional)

If deploying via GitHub Pages:
- Settings → Pages → Source: GitHub Actions
- Or: Deploy branch: `main` / `gh-pages`

## GitHub Sponsor Configuration

The `.github/FUNDING.yml` file is already configured with:
- GitHub Sponsors: `westkitty`
- Ko-fi: `westkitty`

Verify it appears in the "Sponsor" button on the repository.

## Branch Protection (Recommended)

For `main` branch:
1. Settings → Branches → Add rule
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require status checks to pass
   - ✅ Require branches to be up to date
   - ✅ Require CI/CD workflow to pass

## GitHub Actions Secrets

No secrets needed currently. All CI/CD runs without external services.

## Repository Labels

Add these custom labels for issue/PR management:

- `enhancement` (🚀, green) - New feature or request
- `bug` (🐛, red) - Something isn't working
- `documentation` (📚, blue) - Documentation improvements
- `privacy` (🔒, purple) - Privacy-related changes
- `performance` (⚡, yellow) - Performance optimization
- `testing` (🧪, cyan) - Testing infrastructure
- `design` (🎨, pink) - UI/UX design
- `dexter-approved` (🐕, gold) - Meets quality bar

## README Badges Status

Verify badges are displaying correctly:
- ✅ License (Unlicense)
- ✅ Platform (Web)
- ✅ TypeScript version
- ✅ React version
- ✅ GitHub Sponsors
- ✅ Ko-Fi

## File Checklist

Verify these files exist and are up to date:
- [x] `README.md` - Professional, comprehensive documentation
- [x] `LICENSE` - Unlicense public domain dedication
- [x] `CONTRIBUTING.md` - Contribution guidelines
- [x] `VERSION` - Semantic version number (0.1.0)
- [x] `TOPICS.md` - GitHub topics documentation
- [x] `.github/FUNDING.yml` - Sponsor configuration
- [x] `.github/workflows/ci.yml` - CI/CD pipeline
- [x] `assets/icon.png` - Project logo (128×128)
- [ ] `assets/banner.webp` - Social preview banner (1280×640) - **TODO**

## Repository Quality Indicators

Monitor these metrics:
- ✅ CI/CD passing (GitHub Actions badge)
- ✅ Test coverage > 70% (Codecov badge planned)
- ✅ Zero TypeScript errors
- ✅ Zero ESLint warnings
- ✅ All documentation current

## Next Steps

1. ✅ Add repository description and topics
2. ✅ Verify sponsor buttons visible
3. ✅ Enable discussions (optional)
4. ⏳ Create banner for social preview
5. ⏳ Set up GitHub Pages deployment (optional)
6. ⏳ Add Codecov badge (optional)

## Maintaining Quality

Follow the Dexter Standard:
- **Ungovernable**: No compromises on privacy or user sovereignty
- **Sharp-nosed**: Catch bugs before users do (comprehensive testing)
- **Dependable**: Everything works offline, no external dependencies
- **Unimpressed**: High bar for code quality, documentation, and user experience

If Dexter stares at you, you made a mistake. If he approves, ship it.
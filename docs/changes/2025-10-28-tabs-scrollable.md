# TabsHeader Component Changes - Adding Scrollable Tabs with Navigation Buttons

## Summary of Changes
Added horizontal scrolling functionality to tabs with automatic navigation buttons.

## Changes Made

### 1. **TabsHeader.js**
- ✅ Added state to track button visibility: `showLeftButton`, `showRightButton`
- ✅ Added `useEffect` that checks when to display buttons (when there's overflow)
- ✅ `scrollTabs(direction)` function that scrolls by 200px
- ✅ Auto-scroll to active tab using `scrollIntoView`
- ✅ New wrapper `.TabsHeader-wrapper` with scroll buttons on both sides
- ✅ Dynamic className: `has-left-button`, `has-right-button`

### 2. **TabsHeader.scss**
- ✅ `.TabsHeader-wrapper` - container with position relative
- ✅ `.scroll-button` - buttons with absolute positioning and high z-index
- ✅ `overflow-x: auto` + `scroll-behavior: smooth` on `.TabsHeader`
- ✅ Hidden scrollbar (webkit, firefox, IE)
- ✅ `margin-left/right: 32px` when buttons are displayed (to prevent overlap)
- ✅ box-shadow matching tabs: `inset 0 -1px 0 0 var(--multi-tab-divider)`

### 3. **Tab.scss**
- ✅ `flex-shrink: 0` - prevents tab shrinking during scrolling
- ✅ `margin-left: 8px` for first tab - prevents clipping
- ✅ `.divider { display: none }` - removed dividers (don't work well with scrolling)

## New Features

### Auto-Scroll
When a new tab is opened or switching to another tab, it automatically scrolls to the center of the view.

### Smart Navigation Buttons
- **Left button (◀)** - appears only when there's content to scroll left
- **Right button (▶)** - appears only when there's content to scroll right
- Each click scrolls 200px
- Automatically updates with scrolling or window resize

## Usage Example
No code changes needed - the functionality works automatically:
1. Open multiple tabs until they exceed the screen width
2. Scroll buttons will appear automatically
3. Click the buttons or use the mouse wheel to scroll
4. Open a new tab - it will automatically scroll into view

## Browser Compatibility
- ✅ Chrome/Edge - Full
- ✅ Firefox - Full
- ✅ Safari - Full
- ✅ IE11 - Full (with fallback)

## Performance
- Overflow checking occurs only when:
  - Tab list changes
  - Scrolling
  - Window resize
- Scrolling with `smooth` behavior for a pleasant experience
- Optimized z-index to prevent layer issues

---
**Date:** October 28, 2025  
**Branch:** 11.3

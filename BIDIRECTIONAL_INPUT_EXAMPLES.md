# Bidirectional Input Examples & Usage Guide

## Quick Start

### Example 1: Enter a chest measurement in millimeters
1. Navigate to the Measurements view
2. Find the **chest** input field (shows as "chest" label)
3. See current display: `1780 mm • 70.08 in`
4. Input field shows value `1780` with an `mm` button
5. Type `1850` and press Enter
6. Display updates to: `1850 mm • 72.83 in`
7. Button still shows `mm` (metric is default)

### Example 2: Switch to inches and edit
**Starting state:** chest = 1780 mm

1. Click the `mm` button next to the chest input
   - Button changes to `in`
   - Input value becomes `70.08` (the converted value)
   - Display still shows: `1780 mm • 70.08 in`

2. Type `75` (inches)
3. Press Enter or click away
4. Component converts: 75 in → 1905 mm
5. Button switches back to `mm` (always shows metric mode)
6. Input shows `1905`
7. Display updates to: `1905 mm • 75.00 in`

### Example 3: Using spinner buttons
**Current field:** waist = 800 mm, unit button = `mm`

1. Click the ↑ (up arrow) on the spinner
   - Value increases by 1mm (step="1")
   - Shows `801`
   - Display: `801 mm • 31.54 in`

2. Click the ↓ (down arrow) twice
   - Value decreases by 2mm
   - Shows `799`
   - Display: `799 mm • 31.46 in`

3. Click the unit button to switch to `in`
   - Button becomes `in`
   - Input shows `31.46` (converted from 799mm)

4. Click the ↑ spinner
   - Step is still 1, so it adds 1 inch = 25.4 mm
   - Shows `32.46` (approximately)
   - Actually: 825.4 mm
   - Display: `825 mm • 32.48 in` (rounded)

### Example 4: Decimal precision
**Starting:** hip = 950 mm (37.40 in)

1. Click unit button to switch to inches
   - Button becomes `in`
   - Input shows `37.40`

2. Type `38.5` (add precision)
3. Press Enter
4. Converts: 38.5 in × 25.4 = 977.9 mm
5. Saves as `978` (rounded to nearest mm)
6. Display: `978 mm • 38.50 in`

### Example 5: Keyboard shortcuts
**Current field:** neck = 380 mm

1. Click the unit button `mm`
2. Type `400` in the field
3. Field shows `400` (not yet committed)
4. Press **Escape**
   - Reverts to previous value `380`
   - Button resets to `mm`
   - No change made

**OR** at step 3:

4. Press **Enter**
   - Commits the value
   - Converts (already in mm, so just saves `400`)
   - Display: `400 mm • 15.75 in`

### Example 6: Dart depth (pattern parameter)
**Starting:** dartDepth = 15 mm

1. Find the **dart depth** field (also uses DualUnitInput)
2. Display shows: `15 mm • 0.59 in`
3. Switch to inches: click the `mm` button
4. Type `0.75` inches
5. Press Enter
6. Converts: 0.75 in × 25.4 = 19.05 mm
7. Parameter updates
8. Display: `19 mm • 0.75 in`

## Visual Layout

```
┌─────────────────────────────────┐
│ chest (label)                   │
├─────────────────────────────────┤
│ [input-field] [mm-button]       │
│              ↑      ↓           │  ← Spinner controls
├─────────────────────────────────┤
│ 1780 mm • 70.08 in (display)    │
└─────────────────────────────────┘
```

## State Machine

```
STATE: Viewing
  └─ Click unit button → STATE: Unit Toggle
  └─ Click input field → STATE: Editing (Focus)

STATE: Editing (Focus)
  └─ Type characters → STATE: Editing (Modified)
  └─ Blur/Enter → STATE: Converting
  └─ Escape → STATE: Viewing (Reverted)

STATE: Converting
  └─ Parse input value
  └─ Detect unit (from button state)
  └─ Convert to mm if needed
  └─ Update parent props
  └─ Reset button to mm
  └─ STATE: Viewing

STATE: Unit Toggle
  └─ Read current value
  └─ Convert to opposite unit
  └─ Show in input field
  └─ Change button text
  └─ Display always shows both units
  └─ STATE: Editing (now in inches)
```

## Validation Rules

1. **Parsing**: `parseFloat()` converts input
   - Valid: `"100"`, `"100.5"`, `"1e2"`
   - Invalid: `"abc"` → 0, `" 100 "` → 100 (trimmed by parseFloat)

2. **Clamping** (if props provided):
   - Min: component clamps to `min` value
   - Max: component clamps to `max` value
   - Default: 0 to 9999 mm (flexible)

3. **Rounding**:
   - mm: stored as integer (no decimals)
   - in: displayed with 2 decimal places (`.toFixed(2)`)
   - Conversion preserves precision as much as possible

4. **Unit Detection**:
   - Current button state shows active unit
   - Button always resets to `mm` after commit
   - User sees immediate unit flip when clicking button

## Accessibility Features

### Keyboard Navigation
- **Tab**: Navigate between fields
- **Enter**: Commit value and convert
- **Escape**: Cancel edit (revert to previous)
- **↑ / ↓**: Adjust value with spinners (either unit)

### Screen Readers
- Label properly associated: `htmlFor={id}`
- Button text clear: "mm" or "in"
- Display format readable: "1780 mm • 70.08 in"

### Visual Feedback
- Button highlights in active unit color
- Input border shows focus state
- Display updates immediately after blur
- Button color changes when unit changes

## Common Workflows

### Workflow A: Quick adjustment (stay in metric)
```
1. See "chest: 1780 mm"
2. Want 10mm more
3. Click field
4. Select all (Cmd+A)
5. Type "1790"
6. Press Enter
Done! ✓
```

### Workflow B: Work in imperial (designer preference)
```
1. See "chest: 1780 mm • 70.08 in"
2. Think in inches (I want 72" chest)
3. Click 'mm' button → switches to 'in', shows 70.08
4. Type "72"
5. Press Enter
6. Saves as 1828.8 mm, display updates
Done! ✓
```

### Workflow C: Fine-tune with spinners
```
1. See "waist: 800 mm"
2. Click 'in' button
3. Use ↑ spinner 3 times
4. 800mm → +3 in → increases by 76.2mm → 876 mm
5. Click 'mm' button to return to metric
Done! ✓
```

### Workflow D: Revert mistake
```
1. Was: "hip: 950 mm"
2. Click unit button, see 37.40 in
3. Type "10" by accident
4. Press Escape
5. Reverts to 950 mm, button resets
Done! ✓
```

## Technical Details for Developers

### Conversion Math
- **mm to inches**: mm ÷ 25.4 = inches
- **inches to mm**: inches × 25.4 = mm

### Component Props
```tsx
// Minimal required
<DualUnitInput
  id="chest"
  label="chest"
  value={1780}        // mm always
  onChange={(v) => updateState(v)} // receives mm
/>

// With constraints
<DualUnitInput
  id="dart"
  label="dart depth"
  value={15}
  onChange={(v) => updateState(v)}
  step={5}            // increment by 5mm
  min={0}             // can't be negative
  max={50}            // max 50mm
/>
```

### State Updates
- Parent receives **only mm values**
- Component handles all unit conversions internally
- No unit preference stored (always commits to mm)
- Display is purely UI concern

### Error Handling
- Invalid input (`NaN`): defaults to 0
- Out of bounds: clamped silently
- Type validation: TypeScript ensures correct prop types

## Notes for Users

✨ **Pro Tips:**
1. The button shows your current input unit (mm or in)
2. Display always shows both for reference
3. After you enter a value, button resets to mm
4. You can use spinners in either unit mode
5. Escape key is your "undo" while editing

⚠️ **Known Behaviors:**
1. Value persists as mm internally (you can't "lock" imperial)
2. Decimal places are rounded (999.9 mm = 1000 mm stored)
3. Spinners adjust by fixed step (1mm or converted from inches)
4. Focus loss commits the change (you can't stay in edit mode)

## Integration with Rest of App

### MeasurementsView Integration
```tsx
{Object.entries(measurements).map(([key, value]) => (
  <DualUnitInput
    key={key}
    id={`measurement-${key}`}
    label={key}
    value={value}
    onChange={(newValue) =>
      onMeasurementsChange({ [key]: newValue })
    }
  />
))}
```

### Data Flow
```
User types in DualUnitInput
        ↓
Component converts to mm
        ↓
onChange(mmValue) callback fires
        ↓
Parent updates measurements state
        ↓
Component re-renders with new prop
        ↓
Display updates
```

### Backward Compatibility
✅ All existing code that expects mm values still works
✅ Parser uses mm as single source of truth
✅ Display helpers (formatInches, etc.) reused
✅ No breaking changes to MeasurementSet interface

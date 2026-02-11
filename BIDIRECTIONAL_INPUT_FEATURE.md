# Bidirectional Metric/Imperial Input Feature

## Overview
Measurement input fields now support bidirectional conversion between metric (mm) and imperial (inches) units. Users can:
- View both units simultaneously
- Toggle between mm and inches with a button
- Type values in either unit (conversion happens automatically on blur)
- Use spinner controls for incremental adjustments
- See live dual-unit display below the input

## Implementation Details

### New Component: `DualUnitInput`
**File:** `/packages/frontend/src/components/DualUnitInput.tsx`

A reusable React component that wraps measurement input fields with dual-unit support:

```tsx
interface DualUnitInputProps {
  id: string;
  label: string;
  value: number; // in mm (internal standard)
  onChange: (newValue: number) => void;
  step?: number;
  min?: number;
  max?: number;
}
```

**Features:**
- Input field with mm/in toggle button
- Automatic conversion on blur or Enter key
- Unit detection: swaps between mm and inches with button click
- Display always shows "X mm • Y in" below the input
- Clamping to min/max values
- Escape key reverts to previous value

**Key Behavior:**
1. Value stored internally as mm (single source of truth)
2. User can type in either mm or inches
3. Pressing unit toggle button swaps display unit
4. On blur, value is converted to mm and state updates
5. Display always shows both units

### Updated: `MeasurementsView.tsx`
**File:** `/packages/frontend/src/views/MeasurementsView.tsx`

Refactored to use `DualUnitInput` for:
- All body measurements (chest, waist, hip, neck, etc.)
- Dart depth parameter

**Before:**
```tsx
<input
  type="number"
  value={value}
  onChange={(e) => onMeasurementsChange({ [key]: Number(e.target.value) })}
/>
<div>{value} mm ({formatInches(value)})</div>
```

**After:**
```tsx
<DualUnitInput
  id={`measurement-${key}`}
  label={key}
  value={value}
  onChange={(newValue) => onMeasurementsChange({ [key]: newValue })}
/>
```

## User Experience

### Workflow
1. **View measurements**: Each field shows current value in both units
   - Example: Input shows `1780` with button `mm`, display shows `1780 mm • 70.08 in`

2. **Edit in metric**: Type `1800` in the field, press Enter or click away
   - Converts and updates to 1800 mm (71.65 in)

3. **Toggle to inches**: Click the `mm` button to switch to `in`
   - Input value becomes `70.08 in`
   - Type new inches value like `72`
   - On blur, converts to 1828.8 mm automatically

4. **Use spinners**: Browser number input spinners work in current unit
   - In mm mode: ↑/↓ adjusts by 1mm
   - In inches mode: ↑/↓ adjusts by 0.04 inches (1mm increment)

5. **Keyboard shortcuts**:
   - `Enter`: Confirm entry and convert
   - `Escape`: Cancel edit and revert to previous value

## Conversion Functions

### Internal Conversions (in component)
```tsx
const mmToIn = (mm: number) => mm / 25.4;
const inToMm = (inches: number) => inches * 25.4;
```

### Display Formatting (kept from before)
```tsx
const formatInches = (mm: number) => `${mmToIn(mm).toFixed(2)} in`;
const formatFeetInches = (mm: number) => {
  const totalInches = mmToIn(mm);
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}'${inches}"`;
};
```

## Integration Points

### Measurements View
All body measurements now use DualUnitInput:
- `chest`, `waist`, `hip`, `neck`, `shoulderWidth`, `armLength`, `thigh`, `calf`, `ankle`, `inseam`, `height`

### Pattern Parameters
Dart depth also uses DualUnitInput for metric/imperial conversion

### Height Reference
The height selector dropdown remains unchanged but shows both units:
- Example: `5'9" (1753mm / 175cm)`

## Testing & Verification

✅ **All Tests Pass**
- Types: 1/1 ✓
- Core: 188/188 ✓
- Frontend: 6/6 ✓
- **Total: 195/195 tests passing**

✅ **Linting Clean**
- ESLint: 0 errors, 0 warnings
- No violations in DualUnitInput or MeasurementsView

✅ **Build Successful**
- Production build: 3.01 MB JS + assets
- PWA precaching enabled
- All modules transformed

✅ **Development Server Running**
- HTTPS: https://localhost:5174/ (local)
- LAN URLs:
  - https://10.0.0.126:5174/
  - https://100.120.7.127:5174/

## Code Quality

### TypeScript
- Full type safety with `React.ChangeEvent`, `React.KeyboardEvent`, etc.
- Proper ref handling with `useEffect` dependencies
- No `any` types

### React Patterns
- Functional component with hooks
- `useState` for input value and unit tracking
- `useEffect` for syncing external value changes
- `useCallback` implications considered (not needed here as no child renders)

### Accessibility
- Proper `htmlFor` label associations
- Clear button label showing current unit
- Keyboard navigation: Enter, Escape support
- Focus states managed

## Future Enhancements

Possible improvements (if needed):
1. Add `formatAsUnit` prop to control display format
2. Support other unit systems (cm, feet+inches separately)
3. Add preset values or quick-change buttons
4. Decimal place customization per field
5. Unit preference in app settings (default to mm or in)
6. Inline unit display without toggle button option

## Files Modified
- ✨ **New**: `/packages/frontend/src/components/DualUnitInput.tsx`
- 📝 **Updated**: `/packages/frontend/src/views/MeasurementsView.tsx`
  - Added import for DualUnitInput
  - Replaced 11+ measurement inputs
  - Simplified display logic (no separate formatInches divs needed)

## Statistics
- **Component**: 1 new reusable component (DualUnitInput)
- **Lines of code**: ~120 (component) + minimal changes to MeasurementsView
- **Test coverage**: All existing tests still passing
- **Build impact**: Negligible (reusable component improves maintainability)
- **User benefit**: Better UX, immediate feedback, no external conversions needed

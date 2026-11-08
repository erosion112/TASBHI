# Futuristic Digital Tasbih: Cybernetic Dark Redesign

A comprehensive complete visual and architectural redesign transforming the Tasbih app into a futuristic digital spiritual instrument, featuring a cybernetic dark aesthetic with luminescent neon accents, full-screen tactile beads with an immersive floating HUD, authentic vertical drag-to-pull physical bead gestures, and hardware volume key counting.

> [!IMPORTANT]
> **User Review & Confirmed Choices:**
> - **Visual Identity**: **Futuristic Digital Tasbih** (Deep space obsidian & cybernetic dark canvas `#070B10`, radiant neon cyan `#00F2FE` and neon electric emerald `#00FF87` accents, glowing HUD telemetry).
> - **Layout Structure**: **Full-Screen Tactile Beads with Floating HUD** (Unbounded full-bleed canvas, translucent glassmorphic HUD overlays, floating micro-pills for telemetry and supplication info).
> - **Interactive Controls**: **Vertical Drag-to-Pull Physical Bead Simulation** (natural downward thumb gesture dragging beads along a physical strand with tension resistance and kinetic snap-click haptics) + **Hardware Volume Keys Counting Support** (incrementing count on `KEYCODE_VOLUME_UP` / `KEYCODE_VOLUME_DOWN` while riding or walking hands-free).

---

## 1. Overview & Core Concept

- **What It Does**: Reimagines traditional dhikr counting as an ethereal, high-tech cybernetic experience. The central screen becomes an immersive interactive canvas where beads respond with realistic downward physics, luminous glow effects, and kinetic momentum, surrounded by floating HUD elements for target cycles, voice commands, and streak milestones.
- **Target Audience / Persona**: Users seeking a modern, tactile, and immersive spiritual tracking experience—especially those using hands-free counting while commuting, riding, or holding the phone without looking at the screen.
- **Key Value**: Combines authentic Islamic Misbaha tradition with cutting-edge mobile interactivity—tactile drag-and-snap gesture feel, zero-look hardware volume key operation, and a futuristic visual identity.

---

## 2. User Experience & Visual Design

### Visual Identity & Theme Tokens
- **Background Atmosphere**: Ultra-deep cybernetic dark (`#05080E` gradient blending into `#0A111A`) with subtle radial ambient glow centered behind the active beads.
- **Neon Accent Gradients**:
  - *Cyber Emerald / Neon Pulse*: `#00FF87` ➔ `#60EFFF`
  - *Solar Gold / Electric Amber*: `#FFD700` ➔ `#FFA500`
  - *Ethereal Violet / Neon Magenta*: `#BD00FF` ➔ `#00F2FE`
- **Surface & HUD Styling**:
  - Translucent glassmorphism (`Color(0x180D1A2D)`) with fine neon borders (`0.8.dp` stroke at 25% opacity) and 16.dp rounded corners.
  - Floating HUD telemetry: Compact floating status indicators for daily streak, audio feedback, voice listener, and target progress.
- **Typography & Digital Readouts**:
  - Bold digital counter display with dynamic gradient shader fills and subtle outer glow bloom.
  - Elegant Arabic serif display for supplication text (`SubhanAllah`, `Alhamdulillah`, `Allahu Akbar`, `La Ilaha Illallah`).

### Core User Flows & Gestures
1. **Vertical Drag-to-Pull Beads (Primary Tactile Gesture)**:
   - User drags their thumb downward over the beads strand.
   - The beads dynamically track finger displacement with spring tension.
   - When the bead crosses the haptic trigger threshold (~45dp downward pull), a crisp mechanical tick fires, the counter increments with an explosive neon burst, and the next bead glides into position.
2. **Hardware Volume Key Counting (Hands-Free / Eyes-Free)**:
   - Pressing either Volume Up or Volume Down increments the tasbih counter without needing to touch or look at the screen.
   - Can be toggled on/off in Settings.
3. **Floating HUD & Quick Controls**:
   - Floating top bar: Minimalist glass capsule displaying current streak (`🔥 7d`) and quick sound/haptic toggles.
   - Floating zikr pill: Single-tap to switch supplication via bottom sheet or cybernetic dropdown selector.
   - Floating bottom pill: Real-time voice listener status with live audio spectrum waveform and cycle analytics.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Screen Immersive Canvas vs. Card-Divided Containers**
  - *Chosen Approach*: Replace bordered card containers with a unified full-screen immersive canvas, overlaying minimalist floating HUD capsules.
  - *Why*: Gives beads maximum physical space to move and breathe, enabling natural downward dragging gestures across the whole screen.
- **Decision 2: Hardware Volume Key Interception in `MainActivity`**
  - *Chosen Approach*: Intercept `onKeyDown` in `MainActivity` for `KEYCODE_VOLUME_UP` and `KEYCODE_VOLUME_DOWN`, routing directly to `viewModel.incrementCount()`.
  - *Why*: Allows true blind/pocket counting while cycling, walking, or riding without waking the display or requiring screen touches. Includes safety check to ensure it only intercepts when the counter tab is active.
- **Decision 3: Gesture Physics Engine**
  - *Chosen Approach*: Combine Compose `pointerInput` with `detectVerticalDragGestures` and `Animatable` spring physics.
  - *Why*: Provides organic inertia, snapping, and resistance that feels like pulling a real weighted misbaha bead string.

---

## 4. Technical Architecture & Data Strategy

```
┌────────────────────────────────────────────────────────┐
│                      MainActivity                      │
│  - enableEdgeToEdge()                                  │
│  - onKeyDown(KEYCODE_VOLUME_UP/DOWN)                   │
└──────────────────────────┬─────────────────────────────┘
                           │ Dispatches increment event
                           ▼
┌────────────────────────────────────────────────────────┐
│                     ZikrViewModel                      │
│  - StateFlows: currentCount, selectedZikr, streaks    │
│  - Settings: beadLayoutMode, volumeKeyEnabled          │
│  - Methods: incrementCount(), triggerHaptics()         │
└──────────────────────────┬─────────────────────────────┘
                           │ Exposes UI State
                           ▼
┌────────────────────────────────────────────────────────┐
│                   MainTasbihScreen                     │
│  ┌──────────────────────────────────────────────────┐  │
│  │ Floating Top Bar (Streak, Reset, Sound, Settings)│  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Full-Screen Interactive Beads Canvas             │  │
│  │  - CircularBeadsView with Cybernetic Neon Shader │  │
│  │  - Vertical Drag Gesture Physics (Drag-to-Pull)  │  │
│  │  - Luminescent Center Digital Display HUD        │  │
│  ├──────────────────────────────────────────────────┤  │
│  │ Floating Bottom HUD Bar                          │  │
│  │  - Live Beads Studio Quick Switcher              │  │
│  │  - Hands-Free Voice Listener Pill                │  │
│  │  - Daily Goal & Cycle Telemetry Mini-Pill        │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────┘
```

### Components to Update & Refactor
1. **`MainActivity.kt`**:
   - Add `onKeyDown` override for volume keys (`KEYCODE_VOLUME_UP` / `KEYCODE_VOLUME_DOWN`), passing actions down to the active ViewModel.
2. **`CircularBeadsView.kt`**:
   - Add vertical drag-to-pull gesture physics (`detectVerticalDragGestures`) with animated tension, release recoil, and threshold snap.
   - Introduce cybernetic neon shader styling: outer luminescent aura, high-contrast neon specular highlights, and cybernetic strand lines.
3. **`MainTasbihScreen.kt`**:
   - Redesign portrait & landscape counter screens into the full-screen canvas layout with floating glassmorphic HUD capsules.
   - Add cybernetic neon dark theme preset ("Cyber Neon" / "Electric Emerald") with radiant glow.
   - Integrate the volume keys counting setting toggle into Settings.
4. **`ZikrViewModel.kt`**:
   - Add `volumeKeysEnabled: StateFlow<Boolean>` and persistence in `SharedPreferences`.

---

## 5. Verification Plan

1. **Compilation Check**: Run `compile_applet` to verify clean compilation of Compose UI, shaders, and gesture callbacks.
2. **Local JVM Robolectric Tests**: Run `gradle :app:testDebugUnitTest` to verify all state transitions, gesture thresholds, and counter increments execute without regressions.
3. **Gesture & Key Verification**: Verify dragging downward snaps and increments count, volume key triggers respond correctly, and cybernetic visual theme renders seamlessly.

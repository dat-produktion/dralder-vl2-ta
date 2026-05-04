# STOERUNGEN_TS19.md — VL2.19 PAL2 — Palletizer 2
# Dr. Alder Tiernahrung GmbH | Group: F | Last reviewed: 2026-05-03
---
subsystem: VL2.19
short_name: PAL2
group: F
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Type**: Layer palletizer — pusher + stopper, no robot
- **Manufacturer**: Custom
- **HMI**: Siemens
- **NOTE**: NOT identical in design to PAL3 (17)
- **Layers per pallet**: 6

## Known Anomalies / Flags
- Design differs from PAL3 — components NOT interchangeable
- Both PAL2 and PAL3 run simultaneously from ZUO (16)
- Layer pattern: [OUTSTANDING]

# Mechanical

## Drive train (motor, gearbox, coupling)
- Pusher arm drive
- Stopper drive
- Vertical lowering
- Pallet positioning

## Conveyors within the subsystem
- Two-row infeed from ZUO (16)
- Row accumulation
- Pusher travel
- Lowering platform

## Tooling / process elements
- Same failure modes as PAL3 but different layout — verify against PAL2-specific wiring

## Bearings and guides
- Lowering guide rails

## Frame and supporting structure
- Safety fencing, light curtains, beam sensors

# Electrical

## Drive (motor, VFD, contactor)
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- Infeed row sensors
- Pusher position
- Pallet position
- Layer count
- Light curtain (safety)

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
- Siemens HMI + PLC local to PAL2

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- 6-layer cycle → pallet-full → EX2 (20)

## HMI (display, operation)
- Siemens HMI: layer count, fault, pallet-full
- Line HMI: state

## Communication with neighboring systems
- Upstream: ZUO (16)
- Downstream: EX2 (20)

## Recipes and parameters
- Layer count: 6
- Layer pattern: [OUTSTANDING]

## Fault Log


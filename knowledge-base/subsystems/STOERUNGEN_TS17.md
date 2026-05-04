# STOERUNGEN_TS17.md — VL2.17 PAL3 — Palletizer 3
# Dr. Alder Tiernahrung GmbH | Group: F | Last reviewed: 2026-05-03
---
subsystem: VL2.17
short_name: PAL3
group: F
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Type**: Layer palletizer — pusher + stopper, no robot
- **Manufacturer**: Custom
- **HMI**: Siemens
- **NOTE**: NOT identical in design to PAL2 (19)
- **Layers per pallet**: 6

## Known Anomalies / Flags
- Design differs from PAL2 — components NOT interchangeable
- Layer pattern diagram: [OUTSTANDING]
- Safety: fencing + light curtains + beam sensors

# Mechanical

## Drive train (motor, gearbox, coupling)
- Pusher arm drive (motor or pneumatic)
- Stopper drive
- Vertical lowering mechanism
- Pallet positioning system

## Conveyors within the subsystem
- Two-row infeed conveyor from ZUO (16)
- Row accumulation area
- Pusher travel path
- Pallet lowering platform

## Tooling / process elements
- Pusher arm: if row not advancing, check position sensor + actuator
- Stopper: if cases shift during push, check timing + engagement
- Layer holder: retains current layer while platform lowers

## Bearings and guides
- Lowering mechanism guide rails — critical alignment

## Frame and supporting structure
- Safety fencing perimeter
- Light curtains at infeed and exit
- Beam sensors at pallet entry/exit

# Electrical

## Drive (motor, VFD, contactor)
- Pusher motor / pneumatic valve
- Lowering motor + VFD
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
- Siemens HMI + PLC local to palletizer

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- 6-layer cycle then pallet-full signal to EX3 (18)

## HMI (display, operation)
- Siemens HMI: layer count, fault, pallet-full
- Line HMI: state

## Communication with neighboring systems
- Upstream: ZUO (16)
- Downstream: EX3 (18)

## Recipes and parameters
- Layer count: 6
- Layer pattern: [OUTSTANDING]
- Pusher force/stroke: [KNOWLEDGE PENDING]

## Fault Log


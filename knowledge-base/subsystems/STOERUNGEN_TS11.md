# STOERUNGEN_TS11.md — VL2.11 TRP — Tray Packer
# Dr. Alder Tiernahrung GmbH | Group: D | Last reviewed: 2026-05-03
---
subsystem: VL2.11
short_name: TRP
group: D
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Manufacturer**: ZVT
- **Model**: N1/012/PAC/001 — integrated machine (sections 11/12/13 share control)
- **HMI**: Vintek (shared across ZVT sections)
- **Glue**: Nordson ProBlue 7 hot-melt, 160-180°C
- **Cardboard**: External print supplier, 1000+ blank magazine capacity
- **Tray format**: 6 cans (3×2 grid)
- **Safety**: Beam Blocker safety light curtains (sensitivity adjusted)

## Known Anomalies / Flags
- #1 MOST FREQUENT FAULT ON LINE per operator
- Integrated ZVT: faults cascade to FOL (12) and STU (13)
- Beam Blocker sensitivity adjusted — further changes require Vintek/ZVT access
- Cardboard supplier external — supplier change can introduce blank dimension drift

# Mechanical

## Drive train (motor, gearbox, coupling)
- Vacuum cup pick-up arm drive
- Cardboard blank feed mechanism
- Folding plough drives
- Tray puller (takes blank from stack, positions for can loading)

## Conveyors within the subsystem
- Cardboard blank magazine and feed path
- 6-can group transfer from AGG (10) to tray
- Side forming mechanism (folds tray walls)
- Glue dispensing (Nordson ProBlue 7)
- Tray exit conveyor to FOL (12)

## Tooling / process elements
- Vacuum cups: check wear and seal — primary misfeed cause
- Folding ploughs: alignment check if tray exits out-of-square
- Glue nozzles: blockage if temp in range but adhesion fails

## Bearings and guides
[KNOWLEDGE PENDING — on-site recording required]

## Frame and supporting structure
- Beam Blocker light curtains on access points
- All guards must be closed for automatic operation

# Electrical

## Drive (motor, VFD, contactor)
- Nordson ProBlue 7: 160-180°C
- Vacuum pump for cup pick-up
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- 4x photoelectric staging sensors (grouping side, shared with AGG 10)
- Tray-present at folding station
- Beam Blocker: trip on any intrusion incl. debris

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
- Vintek HMI controller (shared with FOL 12, STU 13)
- Nordson ProBlue 7 glue controller (separate)

# Function / Control

## PLC program (interlocks, sequences)
- Vintek controller: ZVT-proprietary logic
- [OUTSTANDING — S7 export required]
- Beam Blocker trip: stops ZVT section only (not whole line)

## HMI (display, operation)
- Vintek HMI: tray packer status, glue temp, alarm codes
- Line HMI: ZVT section stopped flag

## Communication with neighboring systems
- Upstream: AGG (10) — 6-can grid release
- Internal: shared control with FOL (12), STU (13)
- Downstream: FOL (12) film wrapper

## Recipes and parameters
- Tray format: 6 cans (3×2)
- Glue temperature: 160-180°C — verify shift start
- Glue open time: [KNOWLEDGE PENDING]

## Fault Log


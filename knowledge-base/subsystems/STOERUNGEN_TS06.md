# STOERUNGEN_TS06.md — VL2.06 SNG — Singulator Conveyor + Chute
# Dr. Alder Tiernahrung GmbH | Group: B | Last reviewed: 2026-05-03
---
subsystem: VL2.06
short_name: SNG
group: B
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Type**: Singulator disk + air jets + single-file exit chute
- **Manufacturer**: [KNOWLEDGE PENDING]
- **Stages**: (a) singulator disk, (b) single-file chute (passes UNDER printer DRU 07)

## Known Anomalies / Flags
- Chute passes UNDER DRU (07) printer — printer leaks/contamination can foul chute
- Air jet timing critical — must coordinate with disk rotation

# Mechanical

## Drive train (motor, gearbox, coupling)
- Singulator disk drive motor
- Air jet system (pneumatic, regulated)

## Conveyors within the subsystem
- Singulator disk
- Single-file exit chute (under printer)

## Tooling / process elements
- Singulator disk: check for wear or buildup at disk edges
- Air jets: verify nozzle orientation and pressure

## Bearings and guides
[KNOWLEDGE PENDING — on-site recording required]

## Frame and supporting structure
[KNOWLEDGE PENDING — on-site recording required]

# Electrical

## Drive (motor, VFD, contactor)
- Disk drive motor + VFD
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- Can-presence at disk and exit chute
- Photoelectric: verify contrast on reflective cans

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
[KNOWLEDGE PENDING — on-site recording required]

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- Air jet timing interlock with disk rotation

## HMI (display, operation)
- Siemens line HMI: jam state, speed

## Communication with neighboring systems
- Upstream: DRE (05)
- Downstream: chute feeds DRU (07) printer area

## Recipes and parameters
- Disk speed: matched to line rate
- Air jet pressure: [KNOWLEDGE PENDING — check spec]

## Fault Log


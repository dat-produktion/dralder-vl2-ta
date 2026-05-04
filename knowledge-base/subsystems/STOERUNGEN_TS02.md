# STOERUNGEN_TS02.md — VL2.02 FBZ — Pallet Feed Conveyor
# Dr. Alder Tiernahrung GmbH | Group: A | Last reviewed: 2026-05-03
---
subsystem: VL2.02
short_name: FBZ
group: A
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Type**: Heavy duty conveyor — advances pallet from AUF to ROB pickup position
- **Manufacturer**: [KNOWLEDGE PENDING]

## Known Anomalies / Flags
- Indexing position critical for robot pickup — sensor lens contamination causes false signals

# Mechanical

## Drive train (motor, gearbox, coupling)
- Heavy duty conveyor drive motor + gearbox

## Conveyors within the subsystem
- Pallet advance conveyor (heavy duty)
- Indexing mechanism for robot pickup position

## Tooling / process elements
[KNOWLEDGE PENDING — on-site recording required]

## Bearings and guides
[KNOWLEDGE PENDING — on-site recording required]

## Frame and supporting structure
[KNOWLEDGE PENDING — on-site recording required]

# Electrical

## Drive (motor, VFD, contactor)
- Drive motor + VFD
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- Indexing sensors (orange photoelectric) — primary diagnostic on misfeed
- Pallet-present sensor

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
[KNOWLEDGE PENDING — on-site recording required]

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- Indexing logic: pallet must be in correct position before robot enables

## HMI (display, operation)
- Siemens line HMI: pallet position state

## Communication with neighboring systems
- Upstream: AUF (01)
- Downstream: ROB (03) pickup-ready signal

## Recipes and parameters
- Indexing position: set per pallet type

## Fault Log


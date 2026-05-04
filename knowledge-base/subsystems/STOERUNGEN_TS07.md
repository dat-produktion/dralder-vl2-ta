# STOERUNGEN_TS07.md — VL2.07 DRU — Printer / Labeling
# Dr. Alder Tiernahrung GmbH | Group: C | Last reviewed: 2026-05-03
---
subsystem: VL2.07
short_name: DRU
group: C
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Manufacturer**: Videojet
- **Model**: 1880+ ("Drucker 8")
- **Contract**: LEASED — Videojet service contract active
- **Type**: Continuous inkjet (CIJ)
- **Ink**: SmartCell color-coded cartridges
- **Location**: Print head over SNG (06) single-file chute

## Known Anomalies / Flags
- Print head clogging MUCH more frequent than Videojet annual spec
- Frequent component changes reported — root cause investigation needed
- LEASED: contact Videojet service before any internal intervention

# Mechanical

## Drive train (motor, gearbox, coupling)
- No mechanical drive — print head fixed over chute

## Conveyors within the subsystem
- Printing occurs while cans transit SNG (06) chute

## Tooling / process elements
- Print head: frequent cleaning required
- Ink and makeup fluid: check daily

## Bearings and guides
[KNOWLEDGE PENDING — on-site recording required]

## Frame and supporting structure
- Console unit separate from print head
- Service: Videojet-only for internal

# Electrical

## Drive (motor, VFD, contactor)
- [LEASED — contact Videojet]
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- Trigger sensor (photoelectric): misalignment causes off-center print

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
- Videojet controller (separate from line PLC)

# Function / Control

## PLC program (interlocks, sequences)
- Print command from line PLC: one pulse per can
- [OUTSTANDING — S7 export required]

## HMI (display, operation)
- Videojet panel: fault codes, fluid levels
- Line HMI: printer-ready signal

## Communication with neighboring systems
- No upstream dependency
- Downstream: DNW (08) continues regardless of print fault

## Recipes and parameters
- Batch code: set per production run
- Print offset: verify with first-can after sensor adjustment

## Fault Log


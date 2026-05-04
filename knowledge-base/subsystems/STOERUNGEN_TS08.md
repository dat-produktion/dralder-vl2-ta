# STOERUNGEN_TS08.md — VL2.08 DNW — Can Inverter
# Dr. Alder Tiernahrung GmbH | Group: C | Last reviewed: 2026-05-03
---
subsystem: VL2.08
short_name: DNW
group: C
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Manufacturer**: BMH
- **Model**: W2001-900X400-00
- **Type**: Passive spiral guide — SINGLE 180° flip
- **Entry**: cans inverted (tab-down)
- **Exit**: cans upright (tab-up)

## Known Anomalies / Flags
- SINGLE FLIP CONFIRMED — cans enter tab-down, exit tab-up. No second flip.
- CRITICAL: internal path NOT visible — jams cause hidden backlog before entry sensor trips
- Entry sensor trip is FIRST external symptom of internal jam
- Dry brush only — no air or water cleaning

# Mechanical

## Drive train (motor, gearbox, coupling)
- Entry brush drive motor
- Exit brush drive motor
- Internal spiral guide is PASSIVE — no motor

## Conveyors within the subsystem
- Single-file entry from DRU (07) area
- Internal spiral guide (passive, 180°)
- Exit to LBL (09) labeler

## Tooling / process elements
- Entry brush (nylon): wear causes debris carryover
- Exit brush (nylon): same
- Brush inspection: monthly minimum

## Bearings and guides
- Brush shaft bearings — dry lubricant only

## Frame and supporting structure
- Green enclosure — top access panel
- SAFETY: confirm line stopped before opening — cans under backpressure can eject

# Electrical

## Drive (motor, VFD, contactor)
- Brush motors: check VFD and contactor on fault
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- Orange entry sensor: primary fault signal
- Exit sensor: confirms correct orientation

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
[KNOWLEDGE PENDING — on-site recording required]

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- Entry sensor trip: PLC stops upstream after timeout
- Hidden jam protocol: if entry sensor trips with no visible jam, check internal spiral

## HMI (display, operation)
- Line HMI: entry sensor state, brush motor fault

## Communication with neighboring systems
- Upstream: DRU (07) area
- Downstream: LBL (09) Langguth labeler

## Recipes and parameters
- Brush speed: match throughput

## Fault Log


# STOERUNGEN_TS10.md — VL2.10 AGG — Aggregator (3-column accumulator)
# Dr. Alder Tiernahrung GmbH | Group: D | Last reviewed: 2026-05-03
---
subsystem: VL2.10
short_name: AGG
group: D
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Type**: 3-column pneumatic accumulator — collects single-file cans, releases 6 cans (3×2 grid) to TRP
- **Manufacturer**: Unknown (likely ZVT integrated)
- **Sensors**: 4x photoelectric staging sensors
- **Output**: 6-can grid (3 columns × 2 rows) per release to tray packer

## Known Anomalies / Flags
- Side-to-side play observed in cans — guide rails may be set too wide for current can diameter — verify gap setting
- Stop gate cycle: timer-based vs sensor-based UNCONFIRMED — sensor-based is self-correcting; timer-based causes short counts

# Mechanical

## Drive train (motor, gearbox, coupling)
- Lane divider drive (modular green belt)
- Pneumatic stop gates and timing bars at discharge
- Adjustment handwheels for lane width

## Conveyors within the subsystem
- Single-lane entry from LBL (09)
- Lane dividing curved guides (stainless steel)
- Wide green modular belt grouping conveyor
- Three-lane stabilizer guides
- Discharge to TRP (11) tray packer

## Tooling / process elements
- Pneumatic stop gates — check air supply 6 bar min
- Timing bars at discharge — coordinate with TRP request

## Bearings and guides
[KNOWLEDGE PENDING — on-site recording required]

## Frame and supporting structure
[KNOWLEDGE PENDING — on-site recording required]

# Electrical

## Drive (motor, VFD, contactor)
- Modular belt motor + VFD
- Stop gate solenoid valves
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- 4x photoelectric staging sensors along belt
- Stop gate position sensors
- Lane-full sensors (3 columns)

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
- May be integrated with TRP (11) Vintek controller — confirm

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- 6-count logic per release (3×2 grid)
- Stop gate timing interlock with TRP ready signal

## HMI (display, operation)
- Vintek HMI (shared with TRP/FOL/STU): aggregator state
- Line HMI: aggregator fault flag

## Communication with neighboring systems
- Upstream: LBL (09) labeler
- Downstream: TRP (11) tray packer — 6-can release per request

## Recipes and parameters
- Group size: 6 cans (3×2 grid) — must match TRP tray format
- Stop gate cycle time: [PENDING — confirm timer or sensor logic]
- Pneumatic pressure: 6 bar min

## Fault Log


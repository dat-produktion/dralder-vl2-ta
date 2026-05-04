# STOERUNGEN_TS09.md — VL2.09 LBL — Rotary Labeler
# Dr. Alder Tiernahrung GmbH | Group: C | Last reviewed: 2026-05-03
---
subsystem: VL2.09
short_name: LBL
group: C
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Manufacturer**: Langguth
- **Model**: hotLAN 070201017-E
- **Type**: Inline rotary labeler — pre-cut paper sheet, hot-melt glue dot adhesion
- **Glue unit**: Nordson Series 3100, 160-180°C
- **Magazine capacity**: 500+ pre-cut labels

## Known Anomalies / Flags
- #2 most frequent fault on line per operator
- ROOT CAUSE per operator: deformed cans (bulged or squeezed) — UPSTREAM issue, NOT labeler malfunction
- Video evidence: rejected can at video timestamp 2:18 — label partially applied, glue present, label failed to adhere — suggests timing or pressure roller alignment

# Mechanical

## Drive train (motor, gearbox, coupling)
- Carrier belt drives (spin can during labeling)
- Label magazine feed mechanism
- Pressure roller drive
- Exit wipe-down brush

## Conveyors within the subsystem
- Single-file infeed from DNW (08)
- Carrier belts spin can past glue + label
- Exit conveyor to AGG (10) aggregator

## Tooling / process elements
- Pre-cut label magazine
- Glue dot spray nozzles (Nordson)
- Overlap bar — seals trailing edge of label
- Pressure rollers
- Wipe-down brush at exit

## Bearings and guides
[KNOWLEDGE PENDING — on-site recording required]

## Frame and supporting structure
[KNOWLEDGE PENDING — on-site recording required]

# Electrical

## Drive (motor, VFD, contactor)
- Carrier belt motors + VFDs
- Nordson 3100 glue unit (160-180°C)
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- Label-present sensor in magazine
- Glue temperature sensor
- Can-present at glue station

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
- Langguth controller (typically standalone)
- Nordson 3100 glue controller (separate)

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- Print/glue/apply sequence per can
- Empty magazine alarm

## HMI (display, operation)
- Langguth panel: glue temperature, label-out, fault codes
- Line HMI: labeler-ready signal

## Communication with neighboring systems
- Upstream: DNW (08) inverter
- Downstream: AGG (10) aggregator

## Recipes and parameters
- Glue temperature: 160-180°C — verify on shift start
- Label height/position: verify with first-can after any sensor adjustment
- Glue dot pattern: per label spec

## Fault Log


# STOERUNGEN_TS13.md — VL2.13 STU — Shrink Tunnel
# Dr. Alder Tiernahrung GmbH | Group: D | Last reviewed: 2026-05-03
---
subsystem: VL2.13
short_name: STU
group: D
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Manufacturer**: ZVT (integrated with TRP 11, FOL 12)
- **Model**: N1/012/PAC/001 — shrink tunnel section
- **Type**: Convection heat shrink tunnel
- **Belt**: Stainless steel mesh
- **SAFETY**: HIGH VOLTAGE and HOT SURFACE — LOTO MANDATORY

## Known Anomalies / Flags
- LOTO required before any internal access — high voltage + extreme heat
- Multiple operational parameters unknown — OEM manual pending
- Film burn holes indicate belt slippage or excess dwell time
- Exhaust blockage raises facility temperature — check ductwork quarterly

# Mechanical

## Drive train (motor, gearbox, coupling)
- Mesh belt drive motor
- Air circulation blowers
- Heating elements (electric)

## Conveyors within the subsystem
- Stainless steel mesh conveyor
- Entrance and exit hoods (reduce heat loss)

## Tooling / process elements
- Heating elements: if film not shrinking tight, check element continuity (LOTO)
- Blowers: failure causes cold spots — film loose on one side

## Bearings and guides
- Mesh belt drive shaft — LOTO before inspection

## Frame and supporting structure
- Insulated oven enclosure
- Exhaust ductwork to facility exterior

# Electrical

## Drive (motor, VFD, contactor)
- Heating elements
- Blower motors: check VFD on fault
- [OUTSTANDING — wiring diagram from OVA required]
- CRITICAL: Ensure LOTO before any electrical work

## Sensors (photoelectric, proximity, pressure)
- Multi-zone temperature sensors — primary diagnostic
- Belt speed encoder

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
- Vintek HMI controller (shared)
- Temperature controller (dedicated)

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- Temperature alarm: stops ZVT section
- Belt underspeed: tray dwell too long → burn

## HMI (display, operation)
- Vintek HMI: zone temps, belt speed, alarms
- Line HMI: tunnel fault flag

## Communication with neighboring systems
- Upstream: FOL (12)
- Downstream: TBE (14) tray labeler + cooling riser

## Recipes and parameters
- Zone temperatures: [OUTSTANDING — OEM manual]
- Belt speed: [OUTSTANDING — OEM manual]

## Fault Log


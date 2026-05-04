# STOERUNGEN_TS04.md — VL2.04 WMK — Wiremesh Conveyor (Post-Robot Handoff)
# Dr. Alder Tiernahrung GmbH | Group: A | Last reviewed: 2026-05-03
---
subsystem: VL2.04
short_name: WMK
group: A
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Type**: Wiremesh conveyor — receives cans from Fanuc gripper drop, feeds DRE rotary table
- **Manufacturer**: [KNOWLEDGE PENDING]

## Known Anomalies / Flags
- Drop alignment from gripper is critical — misalignment causes can tipping
- Backpressure interlock: holds robot release if WMK full

# Mechanical

## Drive train (motor, gearbox, coupling)
- Wiremesh belt drive motor + VFD

## Conveyors within the subsystem
- Wiremesh conveyor — receives cans dropped from Fanuc layer gripper
- Feeds DRE (05) rotary table

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
- Can-presence at gripper drop zone
- Space-available sensor (clearance signal to robot)

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
[KNOWLEDGE PENDING — on-site recording required]

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- Space-available interlock: robot waits for clearance before releasing layer

## HMI (display, operation)
- Siemens line HMI: WMK running / jam / backpressure state

## Communication with neighboring systems
- Upstream: ROB (03)
- Downstream: DRE (05) rotary table

## Recipes and parameters
- Speed matched to robot cycle time

## Fault Log


# STOERUNGEN_TS15.md — VL2.15 SEL — Screw Elevator
# Dr. Alder Tiernahrung GmbH | Group: E | Last reviewed: 2026-05-03
---
subsystem: VL2.15
short_name: SEL
group: E
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Type**: Vertical spiral elevator — TBE level to palletizer level
- **Manufacturer**: [KNOWLEDGE PENDING]

## Known Anomalies / Flags
- Backpressure from ZUO (16) causes tray stall at elevator exit

# Mechanical

## Drive train (motor, gearbox, coupling)
- Screw/spiral drive motor + gearbox

## Conveyors within the subsystem
- Spiral mechanism
- Entry guide
- Exit guide to ZUO (16)

## Tooling / process elements
[KNOWLEDGE PENDING — on-site recording required]

## Bearings and guides
- Screw shaft upper and lower bearings — critical lubrication

## Frame and supporting structure
- Safety guarding
- Access door for jam clearance

# Electrical

## Drive (motor, VFD, contactor)
- Drive motor + VFD
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- Entry sensor (tray presence)
- Exit sensor (delivered to ZUO)
- Motor overload relay

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
[KNOWLEDGE PENDING — on-site recording required]

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- Backpressure interlock: stops elevator if ZUO full

## HMI (display, operation)
- Line HMI: elevator state

## Communication with neighboring systems
- Upstream: TBE (14)
- Downstream: ZUO (16) allocation

## Recipes and parameters
- Speed matched to throughput

## Fault Log


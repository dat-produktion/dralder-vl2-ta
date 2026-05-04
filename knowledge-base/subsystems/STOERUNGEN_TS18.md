# STOERUNGEN_TS18.md — VL2.18 EX3 — Exit 3 (PAL3 Output Station)
# Dr. Alder Tiernahrung GmbH | Group: F | Last reviewed: 2026-05-03
---
subsystem: VL2.18
short_name: EX3
group: F
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Type**: Full pallet exit conveyor / forklift handoff
- **Belongs to**: PAL3 (17)

## Known Anomalies / Flags
- Functionally part of PAL3 (17) — faults usually PAL3 control logic
- Full pallet must be removed before PAL3 starts next cycle

# Mechanical

## Drive train (motor, gearbox, coupling)
- Roller or chain conveyor drive

## Conveyors within the subsystem
- Pallet exit roller/chain conveyor
- Safety barrier or stop gate

## Tooling / process elements
[KNOWLEDGE PENDING — on-site recording required]

## Bearings and guides
[KNOWLEDGE PENDING — on-site recording required]

## Frame and supporting structure
- Safety fencing at exit
- Forklift interface zone (clear zone marking)

# Electrical

## Drive (motor, VFD, contactor)
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- Pallet-present sensor
- Pallet-clear sensor (forklift removed)

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
- Shared with PAL3 (17) Siemens cabinet

# Function / Control

## PLC program (interlocks, sequences)
- Pallet-clear interlock: PAL3 holds new cycle until EX3 reports clear
- [OUTSTANDING — S7 export required]

## HMI (display, operation)
- Siemens HMI (shared with PAL3): pallet-full, pallet-clear

## Communication with neighboring systems
- Upstream: PAL3 (17) full-pallet signal
- External: forklift operator

## Recipes and parameters
[KNOWLEDGE PENDING — on-site recording required]

## Fault Log


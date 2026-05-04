# STOERUNGEN_TS16.md — VL2.16 ZUO — Allocation Station
# Dr. Alder Tiernahrung GmbH | Group: E | Last reviewed: 2026-05-03
---
subsystem: VL2.16
short_name: ZUO
group: E
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Type**: Diverter — allocates trays between PAL3 (17) and PAL2 (19)
- **UNIQUE**: Only subsystem with two parallel downstream subsystems

## Known Anomalies / Flags
- Diverter logic CRITICAL — misrouting starves one palletizer while overloading the other
- Allocation strategy (alternating / fill-one-first / recipe-driven): [KNOWLEDGE PENDING]

# Mechanical

## Drive train (motor, gearbox, coupling)
- Distribution conveyor drive
- Diverter mechanism (pneumatic pusher or deflector plate)
- Lane sensors

## Conveyors within the subsystem
- Main distribution conveyor
- Diverter point
- Lane A → PAL3 (17)
- Lane B → PAL2 (19)

## Tooling / process elements
- Diverter actuator: check pneumatic supply + solenoid on no-actuation
- Deflector/pusher: inspect for wear at tray contact point

## Bearings and guides
[KNOWLEDGE PENDING — on-site recording required]

## Frame and supporting structure
[KNOWLEDGE PENDING — on-site recording required]

# Electrical

## Drive (motor, VFD, contactor)
- Diverter solenoid valve
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- Lane sensors: PAL2-full / PAL3-full signals
- Tray-present at diverter
- Diverter position sensor

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
[KNOWLEDGE PENDING — on-site recording required]

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- Allocation logic: receives palletizer-ready from PAL2 (19) and PAL3 (17)
- Both lanes full → stops upstream SEL (15)

## HMI (display, operation)
- Line HMI: diverter position, lane-full flags

## Communication with neighboring systems
- Upstream: SEL (15)
- Downstream parallel: PAL3 (17)+EX3 (18) | PAL2 (19)+EX2 (20)

## Recipes and parameters
- Allocation strategy: [KNOWLEDGE PENDING — confirm with WiSg]

## Fault Log


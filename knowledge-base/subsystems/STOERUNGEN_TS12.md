# STOERUNGEN_TS12.md — VL2.12 FOL — Film Wrapper
# Dr. Alder Tiernahrung GmbH | Group: D | Last reviewed: 2026-05-03
---
subsystem: VL2.12
short_name: FOL
group: D
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Manufacturer**: ZVI (integrated with TRP 11, STU 13)
- **Model**: N1/012/PAC/001 — film wrap section
- **Film**: Continuous roll, 2-5 changes per shift
- **Sealing**: Pneumatic sealing bar

## Known Anomalies / Flags
- #3 most frequent fault on line
- Integrated ZVI — fault stops TRP (11) and STU (13) too
- SAFETY: waste film accumulation interferes with mechanism — clear at every roll change
- White film guide drum is large and visible — operator reference for roll depletion

# Mechanical

## Drive train (motor, gearbox, coupling)
- Film roll mounting spindle
- Film tensioning rollers
- Flight conveyor (timed)
- Pneumatic sealing bar cylinder

## Conveyors within the subsystem
- Tray infeed from TRP (11)
- Film wrap path around tray
- Sealed tray exit to STU (13)

## Tooling / process elements
- Film cutting blade: check sharpness if tearing unevenly
- Sealing bar: inspect seal face for film residue
- Film tensioning: slack causes bird-nesting

## Bearings and guides
- Film spindle bearings — check lateral play when loading new roll

## Frame and supporting structure
- White film guide drum (visible from operator position)
- Waste film accumulation zone — clear at every roll change

# Electrical

## Drive (motor, VFD, contactor)
- Pneumatic sealing bar: check air supply 6 bar min
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- Film-present sensor (roll depletion)
- Sealing bar position sensor
- Tray-present on flight conveyor

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
- Vintek HMI controller (shared)

# Function / Control

## PLC program (interlocks, sequences)
[OUTSTANDING — S7 export required]
- Film-out alarm: stops section, operator threads new roll
- Sealing bar temperature alarm

## HMI (display, operation)
- Vintek HMI: sealing bar temp, film-out alarm
- Line HMI: ZVI section stopped

## Communication with neighboring systems
- Upstream: TRP (11)
- Internal: shared ZVI control
- Downstream: STU (13) shrink tunnel

## Recipes and parameters
- Sealing bar temperature: [KNOWLEDGE PENDING — OEM manual]
- Film tension: [KNOWLEDGE PENDING]

## Fault Log


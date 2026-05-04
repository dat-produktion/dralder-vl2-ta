# STOERUNGEN_TS03.md — VL2.03 ROB — Unloading Robot (Depalletizing)
# Dr. Alder Tiernahrung GmbH | Group: A | Last reviewed: 2026-05-03
---
subsystem: VL2.03
short_name: ROB
group: A
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Manufacturer**: Fanuc
- **Model**: S-420 i W
- **Type**: 6-axis industrial robot, vacuum layer gripper
- **Capacity**: ~200 cans per layer pickup
- **Safety**: Siemens safety PLC, fencing, light curtains
- **Separator sheets**: Plastic, manual removal by operator
- **Pallet indexing**: Custom mechanical

## Known Anomalies / Flags
- Vibration on safety fencing during movement — monitor for structural fatigue
- Separator sheet removal is manual — missed sheet causes jam
- Vacuum cup condition is primary variable — inspect first on any pickup failure

# Mechanical

## Drive train (motor, gearbox, coupling)
- Fanuc servo motors on all 6 axes — codes logged to Fanuc controller
- On axis fault: check Fanuc teach pendant alarm BEFORE mechanical inspection

## Conveyors within the subsystem
- U-conveyor (heavy duty): full pallet infeed → indexing → robot pickup → empty pallet return
- Wiremesh handoff at gripper drop point feeds WMK (04)

## Tooling / process elements
- Vacuum layer gripper with multiple suction cups
- Cup failure: individual degradation → partial layer pickup → cans remaining on pallet
- Vacuum pickup failure and cans-left-on-pallet share root cause (vacuum) — distinguish by observation point

## Bearings and guides
[KNOWLEDGE PENDING — on-site recording required]

## Frame and supporting structure
- Safety fencing — inspect mounting bolts at quarterly maintenance

# Electrical

## Drive (motor, VFD, contactor)
- Fanuc servo drives — integrated controller cabinet
- On drive alarm: note exact Fanuc alarm code. Do not reset without root cause.

## Sensors (photoelectric, proximity, pressure)
- Vacuum pressure sensor on gripper: low reading = cup losing seal
- Layer-presence sensor: confirms cans before pickup
- Pallet indexing sensors (orange photoelectric)

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
- Siemens safety PLC (line-wide)
- Fanuc robot controller cabinet (separate)

# Function / Control

## PLC program (interlocks, sequences)
- Safety interlock: fencing vibration trips safety relay → robot stops mid-cycle
- Reset requires physical fencing inspection — do not bypass
- [OUTSTANDING — S7 export required]

## HMI (display, operation)
- Fanuc teach pendant: primary fault display for robot-specific alarms
- Siemens line HMI: safety interlock state

## Communication with neighboring systems
- Upstream: FBZ (02) pallet-ready signal
- Downstream: WMK (04) space-available before release

## Recipes and parameters
- Layer pickup height: per pallet type — verify on supplier change
- Vacuum threshold: minimum pressure for valid pickup

## Fault Log


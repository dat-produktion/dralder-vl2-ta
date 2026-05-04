# STOERUNGEN_TS14.md — VL2.14 TBE — Tray Labeler + Cooling Riser
# Dr. Alder Tiernahrung GmbH | Group: E | Last reviewed: 2026-05-03
---
subsystem: VL2.14
short_name: TBE
group: E
last_reviewed: 2026-05-03
review_notes: ""
---

## Machine Data
- **Type**: Riser conveyor + cooling fan + tray labeler
- **Labeler**: Eidos S.r.l. (Italy) Printess 4e — P4E05C
- **Print method**: Thermal transfer 300dpi, 500mm/s max
- **Contact**: +39.011.947.781 Chieri Italy

## Known Anomalies / Flags
- ⚠ CRITICAL: WAX RIBBON loaded — RESIN required for plastic shrink film. Wax on plastic = poor adhesion + faded print. ACTION REQUIRED.
- NO BARCODE VERIFICATION SCANNER — bad codes ship unchecked
- Cooling fan on riser conveyor is CRITICAL — hot tray from STU rejects label without cooling
- Riser conveyor connects STU (13) exit to Eidos print position

# Mechanical

## Drive train (motor, gearbox, coupling)
- Riser conveyor belt drive
- Eidos tamp applicator piston (compressed air 6 bar)

## Conveyors within the subsystem
- Riser conveyor (STU exit up to labeler)
- Cooling section on riser conveyor (between tunnel and label position)
- Exit conveyor to SEL (15)

## Tooling / process elements
- Eidos thermal transfer print head (300dpi, 500mm/s)
- Tamp pad: inspect for wear or adhesive residue
- Ribbon: CHANGE FROM WAX TO RESIN

## Bearings and guides
[KNOWLEDGE PENDING — on-site recording required]

## Frame and supporting structure
- Eidos unit: standalone, mounted over riser conveyor exit

# Electrical

## Drive (motor, VFD, contactor)
- Eidos: compressed air 6 bar regulated — check supply pressure first on applicator fault
- Cooling fan: check motor + capacitor on fault
- [OUTSTANDING — wiring diagram from OVA required]

## Sensors (photoelectric, proximity, pressure)
- Orange photoelectric trigger sensor: misalignment = label off-center
- Cooling fan speed sensor (if fitted)

## Control wiring
[OUTSTANDING — wiring diagram from OVA required]

## Control cabinet components
- Eidos controller (standalone)
- Line PLC trigger output to Eidos

# Function / Control

## PLC program (interlocks, sequences)
- Print trigger from line PLC: one pulse per tray
- [OUTSTANDING — S7 export required]

## HMI (display, operation)
- Eidos display: ribbon fault, label stock fault, print error
- Line HMI: labeler-ready signal

## Communication with neighboring systems
- Upstream: STU (13) tray exit
- Downstream: SEL (15) screw elevator

## Recipes and parameters
- Label offset: verify with first-tray check
- Ribbon type: RESIN (change from current WAX)
- Print speed: 500mm/s max

## Fault Log


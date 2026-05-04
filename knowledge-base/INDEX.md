# INDEX.md — Knowledge Base Steering File
# Dr. Alder Tiernahrung GmbH — Packaging Line VL2
# Last updated: 2026-05-03 | Version: 7.1 | Maintained by: TA agent + Admin

## How to use this file
Claude reads this file FIRST on every operator request. Based on the subsystem and problem
description, Claude selects which detail files to load for the second diagnostic call.
Load only what is needed. Maximum 4 files per request.

## Line VL2 — 20 Subsystems

```
GROUP A — PALLET INFEED          (01 AUF → 02 FBZ → 03 ROB → 04 WMK)
GROUP B — SINGULATION            (05 DRE → 06 SNG)
GROUP C — SINGLE-FILE PROCESSING (07 DRU → 08 DNW → 09 LBL)
GROUP D — ZVT INTEGRATED MACHINE (10 AGG → 11 TRP → 12 FOL → 13 STU)
GROUP E — TRAY OUTPUT            (14 TBE → 15 SEL → 16 ZUO)
GROUP F — PALLETIZING (PARALLEL) (17 PAL3 → 18 EX3 | 19 PAL2 → 20 EX2)
```

---

## Subsystem Files

### GROUP A — Pallet Infeed

### VL2.01 — AUF — Pallet Loading Station
- **Fault file**: `subsystems/STOERUNGEN_TS01.md`
- **Type**: Heavy duty roller/chain conveyor — pallet infeed point
- **Key terms**: pallet, trolley, loading, heavy duty conveyor, stop gate
- **Known issues**: [KNOWLEDGE PENDING — on-site recording required]

### VL2.02 — FBZ — Pallet Feed Conveyor
- **Fault file**: `subsystems/STOERUNGEN_TS02.md`
- **Type**: Heavy duty conveyor — advances pallet from AUF to ROB pickup position
- **Key terms**: heavy duty conveyor, pallet advance, indexing, robot infeed
- **Known issues**: Indexing position critical for robot pickup — sensor lens contamination causes false signals

### VL2.03 — ROB — Unloading Robot (Depalletizing)
- **Fault file**: `subsystems/STOERUNGEN_TS03.md`
- **Manufacturer / Model**: Fanuc S-420 i W, vacuum layer gripper (~200 cans)
- **Key terms**: Fanuc S-420 i W, robot, gripper, vacuum, layer pickup, separator sheet, safety PLC
- **Known issues**: Fencing vibration during movement, vacuum cup wear, manual separator sheet timing

### VL2.04 — WMK — Wiremesh Conveyor (Post-Robot Handoff)
- **Fault file**: `subsystems/STOERUNGEN_TS04.md`
- **Type**: Wiremesh conveyor receiving cans from Fanuc gripper, feeds DRE rotary table
- **Key terms**: wiremesh, post-robot, handoff, can drop alignment
- **Known issues**: Drop alignment from gripper critical — misalignment causes can tipping

### GROUP B — Singulation

### VL2.05 — DRE — Rotary Table
- **Fault file**: `subsystems/STOERUNGEN_TS05.md`
- **Type**: Rotary table converts bulk WMK output to directional flow for singulator
- **Key terms**: rotary table, bulk-to-directional, drive motor
- **Known issues**: Center bearing lubrication critical, manufacturer not yet confirmed

### VL2.06 — SNG — Singulator Conveyor + Chute
- **Fault file**: `subsystems/STOERUNGEN_TS06.md`
- **Type**: Singulator disk + air jets + single-file exit chute (chute passes UNDER printer DRU)
- **Key terms**: singulator, disk, air jets, single-file chute
- **Known issues**: Chute passes under DRU (07) printer — printer issues can contaminate chute

### GROUP C — Single-File Processing

### VL2.07 — DRU — Printer / Labeling
- **Fault file**: `subsystems/STOERUNGEN_TS07.md`
- **Manufacturer / Model**: Videojet 1880+ ("Drucker 8") — LEASED
- **Key terms**: Videojet 1880+, CIJ, ink, makeup fluid, batch code, leased
- **Known issues**: Print head clogging much more frequent than spec; service contract active

### VL2.08 — DNW — Can Inverter
- **Fault file**: `subsystems/STOERUNGEN_TS08.md`
- **Manufacturer / Model**: BMH Bahn W2001-900X400-00
- **Key terms**: BMH Bahn, inverter, single flip, tab-down to tab-up, brush
- **Known issues**: SINGLE FLIP ONLY. Internal path not visible. Hidden jam protocol on entry sensor trip.

### VL2.09 — LBL — Rotary Labeler
- **Fault file**: `subsystems/STOERUNGEN_TS09.md`
- **Manufacturer / Model**: Langguth hotLAN 070201017-E + Nordson Series 3100 (160-180°C)
- **Key terms**: Langguth, hotLAN, rotary labeler, paper label, pre-cut sheet, glue dot, Nordson 3100
- **Known issues**: #2 most frequent fault. Operator root cause: deformed cans (upstream issue) — NOT labeler malfunction

### GROUP D — ZVT Integrated Machine

### VL2.10 — AGG — Aggregator
- **Fault file**: `subsystems/STOERUNGEN_TS10.md`
- **Type**: 3-column accumulator with pneumatic stop gates, releases 6 cans (3×2 grid) to TRP
- **Key terms**: aggregator, 3-column, accumulator, stop gate, 4 staging sensors, 6-can release
- **Known issues**: Side-to-side play observed — guide rails may be too wide. Stop gate cycle (timer vs sensor): unconfirmed.

### VL2.11 — TRP — Tray Packer
- **Fault file**: `subsystems/STOERUNGEN_TS11.md`
- **Manufacturer / Model**: ZVT N1/012/PAC/001 + Nordson ProBlue 7 (160-180°C) + Vintek HMI
- **Key terms**: ZVT, rotary packer, tray, cardboard blank, vacuum cup, Nordson ProBlue 7, Vintek HMI, Beam Blocker, 6-can tray
- **Known issues**: #1 MOST FREQUENT FAULT ON LINE. Beam Blocker sensitivity adjusted. Cardboard supplier external.

### VL2.12 — FOL — Film Wrapper
- **Fault file**: `subsystems/STOERUNGEN_TS12.md`
- **Manufacturer / Model**: ZVT integrated section
- **Key terms**: film wrapper, sealing bar, white film drum, 2-5 roll changes per shift, bird-nesting
- **Known issues**: #3 most frequent fault. Waste film accumulation interferes — clear at every roll change.

### VL2.13 — STU — Shrink Tunnel
- **Fault file**: `subsystems/STOERUNGEN_TS13.md`
- **Manufacturer / Model**: ZVT integrated section
- **Key terms**: shrink tunnel, mesh belt, blower, heating elements, exhaust, LOTO
- **Known issues**: HIGH VOLTAGE + HOT SURFACE — LOTO MANDATORY. OEM manual outstanding for parameters.

### GROUP E — Tray Output

### VL2.14 — TBE — Tray Labeler + Cooling Riser
- **Fault file**: `subsystems/STOERUNGEN_TS14.md`
- **Manufacturer / Model**: Eidos Printess 4e (P4E05C) + cooling fan + riser conveyor
- **Key terms**: Eidos Printess 4e, thermal transfer, tray labeler, cooling fan, riser conveyor, ribbon
- **Known issues**: ⚠ WAX RIBBON loaded — RESIN required for plastic shrink film. Cooling fan critical. No barcode verification scanner.

### VL2.15 — SEL — Screw Elevator
- **Fault file**: `subsystems/STOERUNGEN_TS15.md`
- **Type**: Vertical spiral elevator from TBE level to palletizer level
- **Key terms**: screw elevator, vertical spiral, drive motor, backpressure
- **Known issues**: [KNOWLEDGE PENDING]

### VL2.16 — ZUO — Allocation Station
- **Fault file**: `subsystems/STOERUNGEN_TS16.md`
- **Type**: Diverter — allocates trays between PAL3 (17) and PAL2 (19)
- **Key terms**: allocation, diverter, splitter, pneumatic pusher, lane sensors
- **Known issues**: Only subsystem with two parallel downstream subsystems. Allocation strategy: [PENDING]

### GROUP F — Palletizing (Parallel)

### VL2.17 — PAL3 — Palletizer 3
- **Fault file**: `subsystems/STOERUNGEN_TS17.md`
- **Manufacturer / Model**: Custom + Siemens HMI — NOT identical to PAL2
- **Key terms**: palletizer 3, pusher arm, stopper, layer holder, lowering mechanism, light curtain, 6 layers
- **Known issues**: NOT identical to PAL2 (19). Layer pattern diagram pending.

### VL2.18 — EX3 — Exit 3
- **Fault file**: `subsystems/STOERUNGEN_TS18.md`
- **Type**: Full pallet exit conveyor — handoff to forklift
- **Key terms**: exit 3, pallet exit, roller conveyor, forklift handoff
- **Known issues**: Belongs to PAL3 (17). Pallet-clear interlock holds PAL3 cycle.

### VL2.19 — PAL2 — Palletizer 2
- **Fault file**: `subsystems/STOERUNGEN_TS19.md`
- **Manufacturer / Model**: Custom + Siemens HMI — NOT identical to PAL3
- **Key terms**: palletizer 2, pusher arm, stopper, layer holder, lowering mechanism, light curtain, 6 layers
- **Known issues**: NOT identical to PAL3 (17). Layer pattern diagram pending.

### VL2.20 — EX2 — Exit 2
- **Fault file**: `subsystems/STOERUNGEN_TS20.md`
- **Type**: Full pallet exit conveyor — handoff to forklift
- **Key terms**: exit 2, pallet exit, roller conveyor, forklift handoff
- **Known issues**: Belongs to PAL2 (19). Pallet-clear interlock holds PAL2 cycle.

---

## Cross-Cutting Files

### Component Translation Table
- **File**: `component-list.csv`
- **Content**: Manufacturer designation → DAT tag mapping
- **Status**: [OUTSTANDING — WiSg on-site recording]

### OEM Manuals (machine-specific, keyword-extracted)
# HOW TO ADD A MANUAL — follow this recipe exactly:
# 1. Upload the original PDF to:  manuals/raw/VL2_[XX]_[manufacturer]_[name].pdf
# 2. Create a keyword/summary .md at: manuals/VL2_[XX]_[manufacturer]_[name]_kb.md
# 3. Add BOTH paths below in the relevant subsystem section.
# 4. The _kb.md file is what the TA loads during diagnosis (text).
# 5. The raw PDF is for human technician reference — TA CAN also read it natively.
# Load when: fault on that subsystem AND relevant manufacturer section is needed.

#### VL2.03 — ROB — Fanuc S-420 i W
- **Manual (raw)**: `manuals/raw/VL2_03_Fanuc_S420iW_maintenance.pdf` — [OUTSTANDING]
- **Manual (kb summary)**: `manuals/VL2_03_Fanuc_S420iW_kb.md` — [OUTSTANDING]
- **Load when**: robot axis fault, vacuum fault, controller alarm code

#### VL2.07 — DRU — Videojet 1880+
- **Manual (raw)**: `manuals/raw/VL2_07_Videojet_1880plus_service.pdf` — [OUTSTANDING]
- **Manual (kb summary)**: `manuals/VL2_07_Videojet_1880plus_kb.md` — [OUTSTANDING]
- **Load when**: print quality fault, CIJ alarm code, fluid system fault

#### VL2.08 — DNW — BMH Bahn W2001
- **Manual (raw)**: `manuals/raw/VL2_08_BMH_W2001_installation.pdf` — [OUTSTANDING]
- **Manual (kb summary)**: `manuals/VL2_08_BMH_W2001_kb.md` — [OUTSTANDING]
- **Load when**: jam in inverter, brush drive fault, belt alignment

#### VL2.09 — LBL — Langguth hotLAN + Nordson 3100
- **Manual (raw)**: `manuals/raw/VL2_09_Langguth_hotLAN_operation.pdf` — [OUTSTANDING]
- **Manual (raw)**: `manuals/raw/VL2_09_Nordson_3100_glue_service.pdf` — [OUTSTANDING]
- **Manual (kb summary)**: `manuals/VL2_09_Langguth_Nordson_kb.md` — [OUTSTANDING]
- **Load when**: label adhesion fault, glue temperature alarm, carrier belt issue

#### VL2.11 — TRP — ZVT N1/012/PAC/001 + Nordson ProBlue 7
- **Manual (raw)**: `manuals/raw/VL2_11_ZVT_TRP_operation.pdf` — [OUTSTANDING]
- **Manual (raw)**: `manuals/raw/VL2_11_Nordson_ProBlue7_service.pdf` — [OUTSTANDING]
- **Manual (kb summary)**: `manuals/VL2_11_ZVT_TRP_kb.md` — [OUTSTANDING]
- **Load when**: tray packer fault, cardboard blank misfeed, glue fault, Beam Blocker

#### VL2.12 — FOL — ZVT Film Wrapper
- **Manual (raw)**: `manuals/raw/VL2_12_ZVT_FOL_operation.pdf` — [OUTSTANDING, same OEM as TRP]
- **Manual (kb summary)**: `manuals/VL2_12_ZVT_FOL_kb.md` — [OUTSTANDING]
- **Load when**: film tear, sealing bar fault, bird-nesting

#### VL2.13 — STU — ZVT Shrink Tunnel
- **Manual (raw)**: `manuals/raw/VL2_13_ZVT_STU_operation.pdf` — [OUTSTANDING, LOTO params critical]
- **Manual (kb summary)**: `manuals/VL2_13_ZVT_STU_kb.md` — [OUTSTANDING]
- **Load when**: temperature alarm, mesh belt fault, any thermal fault — LOTO first

#### VL2.14 — TBE — Eidos Printess 4e
- **Manual (raw)**: `manuals/raw/VL2_14_Eidos_Printess4e_service.pdf` — [OUTSTANDING]
- **Manual (kb summary)**: `manuals/VL2_14_Eidos_Printess4e_kb.md` — [OUTSTANDING]
- **Load when**: ribbon fault, label adhesion on tray, tamp applicator fault

### Wiring Diagrams (per subsystem)
# Naming: diagrams/VL2_[XX]_wiring.[pdf|png]
# PNG preferred — TA can read as image. PDF also works natively.
# Load when: electrical fault, VFD alarm, sensor wiring question

- `diagrams/VL2_01_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_02_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_03_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_04_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_05_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_06_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_07_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_08_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_09_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_10_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_11_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_12_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_13_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_14_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_15_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_16_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_17_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_18_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_19_wiring.pdf` — [OUTSTANDING — OVA]
- `diagrams/VL2_20_wiring.pdf` — [OUTSTANDING — OVA]

### PLC Software Exports (Siemens S7)
# Naming: software/VL2_[XX]_plc.[stl|scl|csv]
# Load when: interlock or sequence fault, HMI alarm code needs resolution

- `software/VL2_11_plc.csv` — [OUTSTANDING — WiSg / OVA]
- `software/VL2_17_plc.csv` — [OUTSTANDING — WiSg / OVA]
- `software/VL2_19_plc.csv` — [OUTSTANDING — WiSg / OVA]

### HMI Alarm Lists
# Naming: software/VL2_[XX]_alarms.[md|csv]  ← convert xlsx to csv or md before uploading
# Load when: specific alarm code provided by operator

- `software/VL2_11_alarms.md` — [OUTSTANDING — WiSg]
- `software/VL2_17_alarms.md` — [OUTSTANDING — WiSg]
- `software/VL2_19_alarms.md` — [OUTSTANDING — WiSg]

---

## Request Archive
- **File**: `ANFRAGEN_LOG.md`
- **Load when**: Phase C review only. Do NOT load during operator diagnosis — file grows large.

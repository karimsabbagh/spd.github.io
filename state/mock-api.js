const MANUFACTURERS = [
	"Medtronic",
	"Stryker",
	"DePuy Synthes",
	"Zimmer Biomet",
	"Smith & Nephew",
	"Arthrex",
	"LifeNet Health",
	"B. Braun",
	"Boston Scientific",
	"Integra LifeSciences",
	"NuVasive",
	"Globus Medical",
	"Hologic",
	"ConMed",
	"Teleflex",
];

const PRODUCTS = [
	{ product: "Spinal Fusion Cage PEEK Interbody", model: "SFC", category: "Spine" },
	{ product: "Triathlon Total Knee System CR", model: "TKS-CR", category: "Knee" },
	{ product: "ATTUNE Knee Fixed Bearing Tibial Insert", model: "ATN-FB", category: "Knee" },
	{ product: "Persona Revision Femoral Component", model: "PRS-FC", category: "Knee" },
	{ product: "Cortical Bone Allograft Strut", model: "CBA-STR", category: "Biologics" },
	{ product: "COBLATION Wand SpeedBlade 90", model: "SB-90", category: "Arthroscopy" },
	{ product: "BioComposite SwiveLock Anchor 5.5mm", model: "SL-55", category: "Arthroscopy" },
	{ product: "Soft Tissue Flexi Right Lateral Meniscus", model: "FMNRL", category: "Biologics" },
	{ product: "Hip Stem Tapered Wedge Cemented", model: "HST-WC", category: "Hip" },
	{ product: "Acetabular Shell Porous Coated", model: "ACS-PC", category: "Hip" },
	{ product: "Polyethylene Liner Crosslinked", model: "PLC-X", category: "Hip" },
	{ product: "Femoral Head Ceramic 32mm", model: "FHC-32", category: "Hip" },
	{ product: "Locking Plate Distal Femur", model: "LPDF", category: "Trauma" },
	{ product: "Cannulated Screw System 7.3mm", model: "CSS-73", category: "Trauma" },
	{ product: "Intramedullary Nail Tibial", model: "IMN-T", category: "Trauma" },
	{ product: "Interference Screw Bioabsorbable 9mm", model: "ISB-9", category: "Arthroscopy" },
	{ product: "Suture Anchor Titanium 3.5mm", model: "SAT-35", category: "Arthroscopy" },
	{ product: "Meniscal Repair Device All-Inside", model: "MRD-AI", category: "Arthroscopy" },
	{ product: "Bone Void Filler Injectable Calcium Phosphate", model: "BVF-CP", category: "Biologics" },
	{ product: "Demineralized Bone Matrix Putty 5cc", model: "DBM-P5", category: "Biologics" },
	{ product: "Pedicle Screw Polyaxial 6.5x45mm", model: "PSP-65", category: "Spine" },
	{ product: "Cervical Interbody Cage PEEK", model: "CIC-PK", category: "Spine" },
	{ product: "Lateral Interbody Fusion Device", model: "LIFD", category: "Spine" },
	{ product: "Vertebral Body Replacement Expandable", model: "VBR-E", category: "Spine" },
	{ product: "Shoulder Glenoid Component Pegged", model: "SGC-P", category: "Shoulder" },
	{ product: "Reverse Shoulder Humeral Tray", model: "RSH-T", category: "Shoulder" },
	{ product: "Humeral Stem Press-Fit", model: "HSP-F", category: "Shoulder" },
	{ product: "Glenosphere 38mm", model: "GS-38", category: "Shoulder" },
	{ product: "External Fixator Pin 5.0mm", model: "EFP-50", category: "Trauma" },
	{ product: "Syndesmosis Screw 4.5x40mm", model: "SYN-45", category: "Trauma" },
	{ product: "Absorbable Hemostatic Matrix", model: "AHM", category: "General" },
	{ product: "Negative Pressure Wound Therapy Kit", model: "NPWT-K", category: "General" },
	{ product: "Surgical Mesh Polypropylene 15x15cm", model: "SMP-15", category: "General" },
	{ product: "Powered Sagittal Saw Blade", model: "PSSB", category: "Power Tools" },
	{ product: "Oscillating Saw Blade Narrow", model: "OSB-N", category: "Power Tools" },
	{ product: "Drill Bit Cannulated 3.2mm", model: "DBC-32", category: "Power Tools" },
	{ product: "Reamer Head Acetabular 52mm", model: "RHA-52", category: "Power Tools" },
	{ product: "K-Wire Smooth 1.6x150mm", model: "KWS-16", category: "Trauma" },
	{ product: "Steinmann Pin 3.2x250mm", model: "STP-32", category: "Trauma" },
	{ product: "Allograft Cancellous Cube 15mm", model: "ACC-15", category: "Biologics" },
];

const DISPOSITIONS = [
	"Available",
	"Available",
	"Available",
	"Available",
	"Reserved",
	"Reserved",
	"On Hold",
];

function generateLotSerial(index) {
	const lot = `L${String(1000 + index * 37 % 9000).padStart(4, "0")}`;
	const serial = `S${String(2000 + index * 53 % 8000).padStart(4, "0")}`;
	return `${lot}/${serial}`;
}

function generateHIS(index) {
	return `HIS-${String(10000 + index * 71 % 90000).padStart(5, "0")}`;
}

function generateRfid(index) {
	const base = 0xE00401501211A000n;
	const tag = base + BigInt(index * 0x111);
	return tag.toString(16).toUpperCase().padStart(16, "0");
}

export function fetchProductsCatalog() {
	return new Promise((resolve) => {
		setTimeout(() => {
			const products = [];
			for (let i = 0; i < 500; i++) {
				const mfr = MANUFACTURERS[i % MANUFACTURERS.length];
				const item = PRODUCTS[i % PRODUCTS.length];
				const disposition = DISPOSITIONS[i % DISPOSITIONS.length];
				products.push({
					rfid: generateRfid(i),
					manufacturer: mfr,
					product: item.product,
					model: `${item.model}-${String(i + 1).padStart(2, "0")}`,
					lotSerial: generateLotSerial(i),
					his: generateHIS(i),
					disposition: disposition,
					category: item.category,
				});
			}
			resolve(products);
		}, 300);
	});
}

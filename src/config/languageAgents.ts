type AgentOverride = {
	name: string;
	designation: string;
	phone_number: string;
	whatsapp_number: string | null;
	email: string | null;
	rera_number: string | null;
	image: { url: string } | null;
};

// Maps: language → property_type_slug → agent to display
export const LANGUAGE_AGENTS: Record<string, Record<string, AgentOverride>> = {
	"zh-CN": {
		"offplan": {
			name:             "Mr. Yi Jiang (Leo)",
			designation:      "Team Leader",
			phone_number:     "+971 58 566 8827",
			whatsapp_number:  "+971585668827",
			email:            "leo.jiang@millionhomes.ae",
			rera_number:      null,
			image:            { url: "assets/r9zfCeEMqORZap8gRDiHVU5yUGEzJvNy4VvDi6Op.jpg" },
		},
		"commercial": {
			name:             "Mr. Yi Jiang (Leo)",
			designation:      "Team Leader",
			phone_number:     "+971 58 566 8827",
			whatsapp_number:  "+971585668827",
			email:            "leo.jiang@millionhomes.ae",
			rera_number:      null,
			image:            { url: "assets/r9zfCeEMqORZap8gRDiHVU5yUGEzJvNy4VvDi6Op.jpg" },
		},
		"residential": {
			name:             "Mr. Yi Jiang (Leo)",
			designation:      "Team Leader",
			phone_number:     "+971 58 566 8827",
			whatsapp_number:  "+971585668827",
			email:            "leo.jiang@millionhomes.ae",
			rera_number:      null,
			image:            { url: "assets/r9zfCeEMqORZap8gRDiHVU5yUGEzJvNy4VvDi6Op.jpg" },
		},
		"holiday-homes": {
			name:             "Mr. Xianchen Feng (Mars)",
			designation:      "Property Consultant",
			phone_number:     "",
			whatsapp_number:  null,
			email:            null,
			rera_number:      null,
			image:            { url: "assets/gf6PrvmBt8BFEfmbrqUQWQl5UPKAWxrJHiJS4x8l.jpg" },
		},
	},
};

export interface TeamMember {
	name: string;
	slug: string | null;
	position: string;
	bio: string | null;
	contact_number: string;
	whatsapp_number: string;
	image: string | { id: number; url: string } | null;
}

export interface TeamCategory {
	name: string;
	slug: string;
	team: TeamMember[];
}

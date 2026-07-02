import type { Media } from "./media";

export interface AboutUs {
	id: number | "";
	title: string;
	sub_title: string;
	heading: string;
	slogan: string;
	description: string;
	our_story: string;
	team_summary: string;
	mission: string;
	vision: string;
	status: "active" | "inactive";
	assets: Media[];
	clienteles: Clientele[];
	award_certifications: AwardCertification[];
}

export interface Clientele {
	id: number | "";
	client_name: string;
	link: string | null;
	description: string | null;
	order: number | null;
	status: "active" | "inactive";
	image: Media | null;
}

export interface AwardCertification {
	id: number | "";
	title: string;
	link: string | null;
	description: string | null;
	order: number | null;
	status: "active" | "inactive";
	image: Media | null;
}

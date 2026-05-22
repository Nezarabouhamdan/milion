import type { Media } from "./media";

export interface Testimonial {
	id?: number;
	name?: string;
	position?: string;
	testimonial?: string;
	company?: string;
	order?: number;
	rating?: number;
	image?: Media;
}

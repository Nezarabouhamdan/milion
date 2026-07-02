import type { Media } from "./media";
import type { BusStation } from "./property";

export interface Area {
	id: number;
	name: string;
	images: Media[];
	status: string;
	about: string;
	explore_map_link: string;
	explore_iframe_link: string;
	bus_stations: BusStation[];
	metro_stations: BusStation[];
	airports: BusStation[];
	meta_title: string;
	meta_description: string;
	meta_keywords: string;
	og_title: string;
	og_description: string;
	og_image: string;
}

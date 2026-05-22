import type { Media } from "./media";

export interface Slider {
	id: number;
	order: number;
	title: string;
	sub_title: string;
	description: string;
	url: string;
	type: SliderType;
	link_title: string;
	link_url: string;
	status: Status;
	image: Media;
}

enum SliderType {
	IMAGE = "image",
	VIDEO = "video",
}

enum Status {
	ACTIVE = "active",
	INACTIVE = "inactive",
	DISABLED = "disabled",
}

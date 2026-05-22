export interface Property {
	id: number;
	name: string;
	slug: string;
	title: string;
	description: string;
	explore_location: string;
	explore_map_link: string;
	explore_iframe_link: string;
	year_built: number | null;
	floors: number | null;
	price: number;
	size_sqft: number | null;
	bedrooms: number | null;
	bathrooms: number | null;
	maid_room: boolean | number;
	purpose: "buy" | "sell" | "rent";
	completion_status: "ready" | "off_plan";
	property_type: "residential" | "commercial" | "off_plan";
	is_featured: boolean | number;
	property_type_id: string;
	featured_image: string;
	area_id: string;
	community_id: string;
	agent_id: string;
	status: "active" | "inactive";
	amenities: number[];
	other_amenities: OtherAmenity[];
	metro_stations: MetroStation[];
	bus_stations: BusStation[];
	nearby_amenities: NearbyAmenity[];
	images: PropertyImage[];
	brochures: PropertyImage[];
	residential_options: ResidentialOption[];
	off_plans: OffPlan[];
	area: Area;
}

export interface Area {
	name: string;
	description: string;
	about: string;
	explore_map_link: string;
	explore_iframe_link: string;
}

export interface MetroStation {
	name: string;
	distance: string;
}

export interface BusStation {
	name: string;
	distance: string;
}

export interface NearbyAmenity {
	category: string;
	name: string;
	location: string;
	distance: string;
}

export interface PropertyImage {
	image: File | null;
	image_preview?: string;
	is_featured: boolean;
}

export interface ResidentialOption {
	title: string;
	desc: string;
	price_options: PriceOption[];
}

export interface PriceOption {
	size: string;
	price_range: string;
}

export interface OffPlan {
	title: string;
	down_payment_percentage: string;
	overview_payment_plan: string;
	handover: string;
	description: string;
	unit_type: string;
	during_construction: string;
	on_handover: string;
	floor_plans: FloorPlan[];
	payment_plans: PaymentPlan[];
}

export interface FloorPlan {
	name: string;
	construction_percentage: number;
	post_handover_payment_period_years: number;
	post_handover_payment_percentage: number;
	down_payment: number;
}

export interface PaymentPlan {
	image: File | null;
	image_preview?: string;
}
export interface OtherAmenity {
	id?: number;
	name: string;
	description?: string;
	icon?: string;
}

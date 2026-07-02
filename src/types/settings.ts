export interface Setting {
	id: number;
	key: string;
	value: string;
	created_at: string;
	updated_at: string;
	created_by?: number | null;
	updated_by?: number | null;
	deleted_by?: number | null;
	deleted_at?: string | null;
}

export interface WhyJoinUs {
	id: number;
	title: string;
	description: string;
	order: number;
	status: "active" | "inactive";
	created_at: string;
	updated_at: string;
	created_by?: number | null;
	updated_by?: number | null;
	deleted_by?: number | null;
	deleted_at?: string | null;
}

export interface SettingsResponse {
	settings: Setting[];
	why_join_us: WhyJoinUs[];
}

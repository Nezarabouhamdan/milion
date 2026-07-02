export interface ContactUs {
	id: number | string;
	name: string;
	email: string;
	contact_number: string;
	message: string;
	status: "new" | "viewed" | "closed";
	created_at: string;
}

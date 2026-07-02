import type { Media } from "./media";

export interface Blog {
	id: number;
	title: string;
	caption: string | null;
	slug: string | null;
	author_name: string;
	author_role: string | null;
	excerpt: string | null;
	content: string;
	category: string | null;
	read_time: string | null;
	publish_status: "draft" | "published";
	published_at: string | null;
	created_by: number | null;
	updated_by: number | null;
	deleted_by: number | null;
	status: "active" | "inactive";
	deleted_at: string | null;
	created_at: string;
	updated_at: string;
	assets: Media[];
	related_blogs: Blog[];
	recent_blogs: Blog[];
	type: "blog" | "news";
}

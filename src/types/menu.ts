export interface MenuImage {
	id: number;
	url: string;
}

export interface SubMenu {
	id: number;
	menu_category_id: number;
	name: string;
	slug: string;
	link: string | null;
	order: number;
	created_by: number;
	updated_by: number | null;
	deleted_by: number | null;
	status: string;
	deleted_at: null;
	created_at: string;
	updated_at: string;
}

export interface Menu {
	id: number;
	name: string;
	slug: string;
	link: string | null;
	order: number;
	created_by: number;
	updated_by: number | null;
	deleted_by: number | null;
	status: string;
	deleted_at: null;
	created_at: string;
	updated_at: string;
	image: MenuImage | string;
	menus: SubMenu[];
}

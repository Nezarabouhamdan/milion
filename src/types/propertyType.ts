export interface PropertyType {
    id: string;
    parent_id: string;
    name: string;
    slug: string;
    description: string;
    children?: PropertyType[];
}

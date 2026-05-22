export interface Vacancy {
    id?: number;
    title: string;
    department: string;
    location: string;
    description: string;
    requirements: string;
    employment_type: string;
    closing_date: string;
    status: string;
}

export interface VacancyApplication {
    vacancy_id: Vacancy["id"];
    name: string;
    email: string;
    contact_number: string;
    message: string;
    status: string;
}

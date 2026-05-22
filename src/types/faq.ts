export interface FAQQuestion {
	id: number;
	question: string;
	answer: string;
}

export interface FAQCategory {
	id: number;
	category: string;
	questions: FAQQuestion[];
}

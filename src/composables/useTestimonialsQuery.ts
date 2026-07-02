import { getTestimonials } from "../api/testimonial/api";
import { useQuery } from "@tanstack/vue-query";

export function useTestimonialsQuery(enabled: boolean) {
	return useQuery({
		queryKey: ["testimonials"],
		queryFn: getTestimonials,
		enabled: enabled,
	});
}

import { useQuery } from '@tanstack/react-query';
import { SelectOption } from '@component/Select';

async function fetchCategories() {
    const response = await fetch('/api/products/categories');
    if (!response.ok) {
        throw new Error('Failed to fetch categories');
    }
    return response.json();
}

export function useCategories() {
    return useQuery<SelectOption[]>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}
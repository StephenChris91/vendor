import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface Product {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    sale_price: number;
    sku: number;
    quantity: number;
    in_stock?: boolean;
    is_taxable?: boolean;
    status: 'Published' | 'Draft' | 'Suspended' | 'OutOfStock';
    product_type: 'Simple' | 'Variable';
    video?: string;
    image?: string;
    ratings?: number;
    total_reviews?: number;
    my_review?: string;
    in_wishlist?: boolean;
    shop_id?: string;
    shop_name?: string;
    author_id?: string;
    author_name?: string;
    categories: string[];
    gallery: string[];
}

export interface ProductsResponse {
    products: Product[];
    totalPages: number;
    currentPage: number;
}

export const useProducts = (page: number = 1, pageSize: number = 10) => {
    return useQuery<ProductsResponse>({
        queryKey: ['products', page, pageSize],
        queryFn: async () => {
            const response = await fetch(`/api/products?page=${page}&pageSize=${pageSize}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
    });
};

export const useProduct = (productId: string) => {
    return useQuery<Product>({
        queryKey: ['product', productId],
        queryFn: async () => {
            const response = await fetch(`/api/products/${productId}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        enabled: !!productId,
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (updatedProduct: Partial<Product> & { id: string }) => {
            const response = await fetch(`/api/products/${updatedProduct.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedProduct),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        onSuccess: (data, variables) => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
            queryClient.invalidateQueries({ queryKey: ['product', variables.id] });
        },
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (newProduct: Omit<Product, 'id'>) => {
            const response = await fetch('/api/products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newProduct),
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (productId: string) => {
            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
};
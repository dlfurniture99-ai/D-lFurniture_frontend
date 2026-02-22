import { apiClient, userApi } from "./config";

export const getAllProducts = async () => {
    try {
        const response = await userApi.get("products");
        
        // Transform API response to match Product interface
        // Handle both response.data and response.products formats
        const productsArray = response?.data ? Array.isArray(response.data) ? response.data : [response.data] : 
                              response?.products ? Array.isArray(response.products) ? response.products : [response.products] : [];
        console.log('Products Array:', productsArray);
        
        if (productsArray.length > 0) {
            const transformedData = productsArray.map((product: any) => ({
                _id: product._id,
                id: product._id,
                name: product.name,
                productName: product.name,
                price: product.price,
                productPrice: product.price,
                image: product.image || (product.images?.[0] || ''),
                images: product.images || (product.image ? [product.image] : []),
                productImage: product.images || (product.image ? [product.image] : []),
                slug: product.slug,
                productSlug: product.slug || product.name?.toLowerCase().replace(/\s+/g, '-'),
                description: product.description,
                fullDescription: product.fullDescription || product.description,
                shortDescription: product.shortDescription || '',
                category: product.category,
                rating: product.rating || 0,
                productReview: product.rating || 0,
                discount: product.discountPercentage || 0,
                productDiscount: product.discountPercentage || 0,
                discountPercentage: product.discountPercentage || 0,
                finalPrice: product.finalPrice || product.price,
                stock: product.stock,
                isVisible: product.isVisible,
                badge: product.discountPercentage ? `${product.discountPercentage}% OFF` : null,
                brand: product.brand || '',
                sku: product.sku || '',
                weight: product.weight || '',
                dimensions: product.dimensions || '',
                material: product.material || '',
                warranty: product.warranty || '',
                returnPolicy: product.returnPolicy || '30 days',
                colors: product.colors || [],
                finishes: product.finishes || [],
                specifications: product.specifications || [],
                reviews: product.reviews || [],
            }));
            return {
                success: true,
                data: transformedData
            };
        }
        return response;
    } catch (error) {
        console.error('Error fetching products:', error);
        return { success: false, data: [] };
    }
};

export const getProductBySlug = async (slug: string) => {
    const response = await userApi.get(`products`);
    
    // Handle both response.data and response.products formats
    const productsArray = response?.data ? Array.isArray(response.data) ? response.data : [response.data] :
                          response?.products ? Array.isArray(response.products) ? response.products : [response.products] : [];
    
    if (productsArray.length > 0) {
        const product = productsArray.find((p: any) => 
            (p.slug || p.name?.toLowerCase().replace(/\s+/g, '-')) === slug
        );
        if (product) {
            return {
                ...product,
                id: product._id,
                productName: product.name,
                productPrice: product.price,
                productImage: product.images || (product.image ? [product.image] : []),
                productSlug: product.slug || product.name?.toLowerCase().replace(/\s+/g, '-'),
                productReview: product.rating || 0,
                productDiscount: product.discountPercentage || 0,
                productType: product.category,
            };
        }
    }
    return null;
};
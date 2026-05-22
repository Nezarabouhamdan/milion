function imagePath(path: string) {
    const storageUrl =
        import.meta.env.VITE_STORAGE_URL ?? "http://127.0.0.1:8000/storage";
    return `${storageUrl}/${path}`;
}

function deSlugify(str: string) {
    return str.replace(/-/g, " ");
}

function slugify(str: string) {
    return str.replace(/ /g, "-").toLowerCase();
}

function formatPrice(price: number): string {
    if (price >= 1_000_000_000) {
        return `${(price / 1_000_000_000).toFixed(1)}B`;
    }
    if (price >= 1_000_000) {
        return `${(price / 1_000_000).toFixed(1)}M`;
    }
    return price.toLocaleString();
}

function isImageAsset(url: string): boolean {
    return /\.(jpe?g|png|gif|webp|svg|avif|bmp)$/i.test(url ?? "");
}

export { imagePath, deSlugify, slugify, formatPrice, isImageAsset };

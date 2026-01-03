import { readdirSync } from 'fs';
import { join } from 'path';

const ingredientsDirectory = join(process.cwd(), 'public/images/ingredients');
const productsDirectory = join(process.cwd(), 'public/images/products');
const pizzaDir = join(process.cwd(), 'public/images/pizzas');

export function importAllImages() {
    const importImagesFromDirectory = (directory: string) => {
        return readdirSync(directory).reduce((acc, file) => {
            const fileName = file.split('.')[0];
            acc[fileName] = `${directory.replace(join(process.cwd(), 'public'), '')}/${file}`;
            return acc;
        }, {} as Record<string, string>);
    };

    const ingredientsImages = importImagesFromDirectory(ingredientsDirectory);
    const productsImages = importImagesFromDirectory(productsDirectory);
    const pizzasImages = importImagesFromDirectory(pizzaDir);

    return { ...ingredientsImages, ...productsImages, ...pizzasImages };
}
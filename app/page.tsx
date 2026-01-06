import React, { Suspense } from "react";

import { Title } from "@/components/shared/title";
import { Container } from "@/components/shared/container";
import { TopBar } from "@/components/shared/topBar";
import { Filters } from "@/components/shared/filters";
import { ProductsListGroup } from "@/components/shared";
import ScrollToTopButton from "@/components/ui/scroll_up_button";
import { prisma } from "@/prisma/prisma-client";

export default async function Home({ searchParams }: { searchParams: Promise<{ priceFrom?: string, priceTo?: string, ingredients?: string, pizzaTypes?: string, sizes?: string }> }) {
    const { priceFrom, priceTo, ingredients: selectedIngredients, pizzaTypes, sizes } = await searchParams;

    const categories = await prisma.category.findMany({
        include: {
            products: {
                where: {
                    items: {
                        some: {
                            price: {
                                gte: Number(priceFrom) || 0,
                                lte: Number(priceTo) || 1000,
                            },
                            ...(pizzaTypes ? {
                                pizzaType: {
                                    in: pizzaTypes.split(',').map(Number)
                                }
                            } : {}),
                            ...(sizes ? {
                                size: {
                                    in: sizes.split(',').map(Number)
                                }
                            } : {})
                        }
                    },
                    ...(selectedIngredients ? {
                        ingredients: {
                            some: {
                                id: {
                                    in: selectedIngredients.split(',').map(Number)
                                }
                            }
                        }
                    } : {})
                },
                include: {
                    items: true,
                    ingredients: true,
                }
            }
        }
    })

    return <>
        <ScrollToTopButton />
        <Container className="mt-10">
            <Title size="lg" text="Menu:" className='font-bold' />

        </Container>
        <TopBar categories={categories.filter((category) => category.products.length > 0)} className="mx-6 pb-6" />
        <Container className="flex pb-6">
            <div className="w-62.5">
                <Suspense fallback={<div>Loading...</div>}>
                    <Filters />
                </Suspense>
            </div>
            <div className="flex-1 ml-10 mt-6">
                {categories.length > 0 && categories
                    .filter((category) => category.products.length > 0)
                    .map((category) => (
                        <ProductsListGroup
                            key={category.id}
                            title={category.name}
                            products={category.products.map(p => ({
                                id: p.id,
                                name: p.name,
                                price: p.items[0]?.price || 0,
                                imgURL: p.imageUrl,
                                items: p.items,
                                categoryName: category.name,
                                ingredients: p.ingredients,
                            }))}
                            categoryId={category.id}
                        />
                    ))}
            </div>

        </Container>
    </>
}

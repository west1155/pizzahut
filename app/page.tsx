import {Title} from "@/components/shared/title";
import {Container} from "@/components/shared/container";
import {TopBar} from "@/components/shared/topBar";
import {Filters} from "@/components/shared/filters";

export default function Home() {
    return <>
        <Container className="mt-10">
            <Title size="lg" text="Menu:" className='font-bold'/>

        </Container>
        <TopBar className="mx-6 pb-6"/>
        <Container className="flex pb-6">
            <div className="w-62.5">
                <Filters />
            </div>
            <div>
                Products List
            </div>

        </Container>
    </>
}

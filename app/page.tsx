import {Title} from "@/components/shared/title";
import {Container} from "@/components/shared/container";
import {TopBar} from "@/components/shared/topBar";

export default function Home() {
  return <>
    <Container className="mt-10">
      <Title size="lg" text="Menu:" className='font-bold'/>
      <TopBar/>

    </Container>
  </>
}

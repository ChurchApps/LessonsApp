import React from "react";
import { Header, Footer, Lesson } from "./components"
import { Container } from "react-bootstrap"


export const StudyPage = () => {
    return (<>
        <link rel="stylesheet" href="/css/cp.css" />
        <Header />

        <div className="pageSection">
            <Container>
                <div className="text-center">
                    <h2>The Ark Kids: <span>Power Up Elementary</span></h2>
                    <p><i>A 52 week series for 1st-5th graders</i></p>

                </div>

                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam non tincidunt ante. Cras tortor ipsum, lacinia nec lorem in, lobortis pulvinar risus. Aenean mollis mauris quis ullamcorper placerat. Vestibulum dictum fringilla libero ac faucibus. Sed sollicitudin felis sed fermentum egestas. In et magna consequat, aliquam sapien venenatis, mollis arcu. Nullam fringilla diam non elit luctus, vel tristique metus ultrices. Integer finibus vulputate lectus, ut vestibulum est euismod a. Pellentesque commodo dui et consequat vestibulum. Curabitur non faucibus magna. Praesent laoreet porttitor consequat.</p>

                <div className="videoWrapper">
                    <iframe width="992" height="558" src="https://www.youtube.com/embed/M9Gq-vmEdR8" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                </div>
                <br />

                <h2>Lessons</h2>

                <Lesson videoId="b_C1a_SOMWU" title="Power Up Week 1" description="When Ethel and Rusty unleash a giant chocolate bunny on the lab, they quickly realize why it's a good idea to obey. Check out this special Easter episode of The Adventures of Herman and Rusty." />
                <Lesson videoId="tQB0qhw4j4I" title="Power Up Week 2" description="When Ethel's video goes viral, Skip convinces her to abandon her friends and live a celebrity life. It's up to Herman and Hannah to help her choose the humble attitude." />
                <Lesson videoId="vKTg0io5RGs" title="Power Up Week 3" description="Rusty refuses to stop playing  Fornite, even though the lab is in danger of blowing up." />
                <Lesson videoId="0xird8Ucvnw" title="Power Up Week 4" description="Herman is hosting game night at the lab, but things go awry when temptation gets the best of Rusty." />

            </Container>
        </div>

        <Footer />
    </>);
}

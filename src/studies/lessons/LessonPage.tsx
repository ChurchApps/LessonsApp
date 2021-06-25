import React from "react";
import { Header, Footer, Classroom, AtHome } from "./components"
import { Container, Accordion } from "react-bootstrap"


export const LessonPage = () => {
  return (
    <div className="pageSection">
      <Container>
        <div className="text-center">
          <div className="title">The Ark Kids</div>
          <h2>Power Up Elementary: <span>Power Up Week 1</span></h2>
        </div>
        <p>When Ethel and Rusty unleash a giant chocolate bunny on the lab, they quickly realize why it's a good idea to obey. Check out this special Easter episode of The Adventures of Herman and Rusty.</p>

        <div className="videoWrapper">
          <iframe width="992" height="558" src="https://www.youtube.com/embed/b_C1a_SOMWU" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
        <br />

        <h2>Resources</h2>
        <Accordion>
          <Classroom />
          <AtHome />
        </Accordion>
      </Container>
    </div>
  );
}

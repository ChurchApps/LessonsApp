import { Container, Grid } from "@mui/material";

export function HomeTestimonials() {

  const getTestimonial = (name:string, church:string, text:string) => (
    <Grid item xs={12} md={6}>
      <div className="testimonial">
        <div className="stars"></div>
        <div className="icon"></div>
        <div>
          <div className="name">{name}</div>
          <div className="church">{church}</div>
        </div>
        <p className="quote">{text}</p>
      </div>
    </Grid>
  )

  return (
    <div className="homeSection" id="testimonials">
      <Container fixed>
        <div style={{textAlign:"center"}}>
          <div className="title">
            <span>CHURCH</span>
          </div>
          <h2>Testimonials</h2>
        </div>
        <Grid container spacing={3}>
          {getTestimonial("Sarah DeLitta", "One Church, NH", "Lessons.church provides fun, biblical lessons with materials designed for different age groups, which allows families to discuss the same lesson all together.")}
          {getTestimonial("Chelsea Boldt", "Venture Christian Church, TX", "We love how Lessons.Church has provided a multitude of resources at our fingertips. It makes scheduling super easy!")}
        </Grid>
      </Container>
    </div>
  );
}

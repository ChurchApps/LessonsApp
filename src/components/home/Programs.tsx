import { Container, Grid, Link } from "@mui/material";
import { ArrayHelper, ProgramInterface, ProviderInterface, StudyInterface } from "@/utils";
import Image from "next/image";

type Props = {
  programs: ProgramInterface[];
  providers: ProviderInterface[];
  studies: StudyInterface[];
};

export function Programs(props: Props) {

  const getStudies = (program: ProgramInterface) => {

    const studies = ArrayHelper.getAll(props.studies, "programId", program.id);
    const result:JSX.Element[] = [];
    for (let i=0;i<6;i++)
    {
      const link = studies.length > i
        ? (<Link href={"/" + program.slug + "/" + studies[i].slug}>
          <Image src={studies[i].image} alt={studies[i].name} width={256} height={144} style={{height:"auto"}} placeholder="empty" className="img-fluid" />
        </Link>)
        : null;
      result.push(<Grid item md={2} sm={4} xs={4} key={i}>{link}</Grid>);
    }
    return result;
  }

  const getProgramDiv = (program: ProgramInterface) => {
    const url = "/" + program.slug + "/";
    return (<div key={program.slug} id={program.slug} className="programPromo" style={{ backgroundImage:"url('/images/programs/" + program.slug + ".jpg')" }}>
      <div className="programHeroContent">
        <Container fixed>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <div className="age">{program.age.toUpperCase()}</div>
              <h2>{program.name}</h2>
              <p>{program.shortDescription}</p>
              <a href={url} className="cta">Learn More</a>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="programStudies">
            {getStudies(program)}
          </Grid>
        </Container>
      </div>
    </div> )
  }


  const programDivs:JSX.Element[] = [];
  props.programs.forEach((program) => {
    programDivs.push(getProgramDiv(program));
  });

  return (<>
    <div className="homeSection" style={{paddingTop:20, paddingBottom:20}}>
      <Container fixed style={{textAlign:"center" }}>
        <div className="title">
          <span>LESSONS.CHURCH</span>
        </div>
        <h2>Available Programs</h2>
      </Container>
    </div>
    {programDivs}
  </>);
}

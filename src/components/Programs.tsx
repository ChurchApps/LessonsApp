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
    for (let i=0;i<=5;i++)
    {
      const link = studies.length > i
        ? (<Link href={"/" + program.slug + "/" + studies[i].slug}>
          <Image src={studies[i].image} alt={studies[i].name} width={256} height={144} style={{height:"auto"}} placeholder="empty" />
        </Link>)
        : null;
      result.push(<td>{link}</td>);
    }
    return result;
  }

  const getProgramDiv = (program: ProgramInterface) => {
    const url = "/" + program.slug + "/";
    return (<div className="programHero" style={{ backgroundImage:"url('/images/programs/" + program.slug + ".jpg')" }}>
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
          <table>
            <tbody>
              <tr>
                {getStudies(program)}
              </tr>
            </tbody>
          </table>

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

  /*
  function createProgram({ slug, image, name, shortDescription, description, id }: ProgramInterface) {
    const url = "/" + slug + "/";
    return (
      <div key={id}>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            <Link href={url}><Image src={image || ""} alt={name} width={640} height={360} style={{height:"auto"}} placeholder="empty" /></Link>
          </Grid>
          <Grid item md={8} xs={12}>
            <Link href={url}><h3 style={{ fontSize: "28px", fontWeight: 400, margin: "0 8px 0 0" }}>{name}</h3></Link>
            <p><i>{shortDescription}</i></p>
            <MarkdownPreview value={description} />
          </Grid>
        </Grid>
        <hr />
      </div>
    );
  }

  const programsView = props.providers
    .map((provider) => {
      const view = props.programs
        .filter((program) => program.providerId === provider.id)
        .map((p) => createProgram(p));

      return (view.length > 0 && (
        <div key={provider.id}>
          <h3 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "24px" }}>
            {provider.name}
          </h3>
          {view}
        </div>
      ));
    })
    .filter((p) => p);
*/




/*
  return (
    programsView.length > 0 && (
      <div className="homeSection" style={{ paddingTop: 20 }}>
        <Container fixed>
          <h2>
            Browse <span>Available Programs</span>
          </h2>
          {programsView}
        </Container>
      </div>
    )
  );
  */
}

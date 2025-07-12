import { Container, Grid } from "@mui/material";
import { ProgramInterface, ProviderInterface, StudyInterface } from "@/helpers/interfaces";
import { ArrayHelper } from "@churchapps/apphelper/dist/helpers/ArrayHelper";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface Props {
  programs: ProgramInterface[];
  providers: ProviderInterface[];
  studies: StudyInterface[];
}

const Programs = React.memo((props: Props) => {

  const getStudies = React.useCallback((program: ProgramInterface) => {

    const studies = ArrayHelper.getAll(props.studies, "programId", program.id);
    const result:JSX.Element[] = [];
    for (let i=0; i < 6; i++) {
      const link = studies.length > i
        ? (<Link href={"/" + program.slug + "/" + studies[i].slug}>
          <Image src={studies[i].image ?? "/not-found"} alt={studies[i].name} width={256} height={144} style={{height:"auto"}} placeholder="empty" className="img-fluid" />
        </Link>)
        : null;
      result.push(<Grid item md={2} sm={4} xs={4} key={i}>{link}</Grid>);
    }
    return result;
  }, [props.studies]);

  const getProgramDiv = React.useCallback((program: ProgramInterface) => {
    const url = "/" + program.slug + "/";
    return (<div key={program.slug} id={program.slug} className="programPromo" style={{ backgroundImage:"url('/images/programs/" + program.slug + ".jpg')" }}>
      <div className="programHeroContent">
        <Container fixed>
          <Grid container spacing={3}>
            <Grid item md={9} xs={12}>
              <div className="age">{program.age?.toUpperCase()}</div>
              <h2>{program.name}</h2>
              <p style={{width:"67%"}}>{program.shortDescription}</p>
              <Link href={url} className="cta">Learn More</Link>
            </Grid>
          </Grid>
          <Grid container spacing={2} className="programStudies">
            {getStudies(program)}
          </Grid>
        </Container>
      </div>
    </div> )
  }, [getStudies]);

  const programDivs = React.useMemo(() => {
    const divs: JSX.Element[] = [];
    props.programs.forEach((program) => {
      //temp hack to exclude west ridge kids for now.
      if (program.id !== "CjDN3VrEm3s") divs.push(getProgramDiv(program));
    });
    return divs;
  }, [props.programs, getProgramDiv]);

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
});

Programs.displayName = 'Programs';

export { Programs };

import Link from "next/link";
import { StudyInterface } from "@/utils";
import { Grid, Typography } from "@mui/material";
import Flippy, { FrontSide, BackSide } from "react-flippy";

type Props = {
  studies: StudyInterface[];
  slug: string;
};

export function Studies({ studies, slug }: Props) {

  const createStudyCard = (study: StudyInterface) => {
    const studyUrl = slug + `/${study.slug}`;
    return (
      <Grid item md={4} xs={12}>
        <Link href={studyUrl}><a>
          <Flippy flipOnHover={true}>
            <FrontSide>

              <img src={study.image} alt={study.name} />
              <Typography component="h3" sx={{ fontSize: "24px", fontWeight: 500, marginBottom: "8px", color: "#333", overflowY: "hidden", maxHeight: 30 }}>
                {study.name}
              </Typography>

            </FrontSide>
            <BackSide style={{ backgroundColor: '#333' }}>
              <div style={{ overflowY: "hidden", color: "#FFF", height: "90%" }}>
                {study.shortDescription && <div><i>{study.shortDescription}</i></div>}
                <p>{study.description}</p>
              </div>
              <div style={{ textAlign: "right" }}>See more...</div>
            </BackSide>
          </Flippy>
        </a></Link>

      </Grid>

    );
  };

  /*
  const createStudy = (study: StudyInterface) => {
    const studyUrl = slug + `/${study.slug}`;
    return (
      <Grid container spacing={3} style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }} key={study.id}>
        <Grid item md={3} xs={12}>
          <Link href={studyUrl}><a><img src={study.image} alt={study.name} /></a></Link>
        </Grid>
        <Grid item md={9} xs={12}>
          <Typography component="h3" sx={{fontSize: "28px", fontWeight: 500, marginBottom: "8px"}}>
            <Link href={studyUrl}><a>{study.name}</a></Link>
          </Typography>
          <p>
            <i>{study.shortDescription}</i>
          </p>
          <p>{study.description}</p>
        </Grid>
      </Grid>
    );
  };
  */

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Studies</h2>
      <Grid container spacing={3} style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }}>
        {studies.map(createStudyCard)}
      </Grid>
    </div>
  );
}

import Link from "next/link";
import { StudyInterface } from "@/utils";
import { Grid, Typography } from "@mui/material";
import Flippy, { FrontSide, BackSide } from "react-flippy";
import Image from "next/image";

type Props = {
  studies: StudyInterface[];
  slug: string;
};

export function Studies({ studies, slug }: Props) {

  const createStudyCard = (study: StudyInterface) => {
    const studyUrl = slug + `/${study.slug}`;
    return (
      <Grid item md={4} xs={12} key={study.id}>
        <Link href={studyUrl}>
          <Flippy flipOnHover={true}>
            <FrontSide>
              <Image src={study.image || ""} alt={study.name} width={640} height={360} style={{height:"auto"}} />
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
        </Link>
      </Grid>
    );
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Studies</h2>
      <Grid container spacing={3} style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }}>
        {studies.map(createStudyCard)}
      </Grid>
    </div>
  );
}

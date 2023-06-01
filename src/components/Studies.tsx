import Link from "next/link";
import { StudyInterface } from "@/utils";
import { Card, Grid, Typography } from "@mui/material";
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
          <Card style={{padding:10}}>
            <Image src={study.image || ""} alt={study.name} width={640} height={360} style={{height:"auto"}} className="img-fluid" />
            <Typography component="h3" sx={{ fontSize: "24px", fontWeight: 500, marginBottom: "8px", color: "#333", overflowY: "hidden", maxHeight: 30 }}>
              {study.name}
            </Typography>
            <div style={{ overflowY: "hidden", color: "#555", fontSize:15, height: "140px" }} className="fadeOut">
              {study.shortDescription && <p><i>{study.shortDescription}</i></p>}
              <p>{study.description}</p>
            </div>
            <div style={{ textAlign: "right", color:"#24b8ff", marginTop:5 }}>See more...</div>
          </Card>
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

import Link from "next/link";
import { StudyCategoryInterface, StudyInterface } from "@/utils";
import { Card, Grid, Icon, Typography } from "@mui/material";
import Image from "next/image";

type Props = {
  studies: StudyInterface[];
  slug: string;
};

export function Studies({ studies, slug }: Props) {

  const createStudyCard = (study: StudyInterface) => {
    const studyUrl = slug + `/${study.slug}`;
    return (
      <Grid item md={6} xs={12} key={study.id}>
        <Link href={studyUrl}>
          <Card style={{padding:10}} className="studyCard">
            <Grid container spacing={1}>
              <Grid item xs={5}>
                <Image src={study.image || ""} alt={study.name} width={640} height={360} style={{height:"auto"}} className="img-fluid" />
              </Grid>
              <Grid item xs={7}>
                <div className="duration">{(study.lessonCount===1) ? "1 Week" : study.lessonCount + " Weeks" }</div>
                <h3>{study.name}</h3>
                <div className="fadeOut">
                  {study.shortDescription}
                </div>
                <div className="seeMore">SEE MORE</div>
              </Grid>
            </Grid>


          </Card>
        </Link>
      </Grid>
    );
  };

  return (
    <div>
      <Grid container spacing={3} style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }}>
        {studies.map(createStudyCard)}
      </Grid>
    </div>
  );
}

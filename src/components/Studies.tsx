import Link from "next/link";
import { StudyInterface } from "@/utils";
import { Grid } from "@mui/material";

type Props = {
  studies: StudyInterface[];
  slug: string;
};

export function Studies({ studies, slug }: Props) {
  const createStudy = (study: StudyInterface) => {
    const studyUrl = slug + `/${study.slug}`;
    return (
      <Grid container spacing={3} style={{ paddingBottom: 20, paddingTop: 20, borderBottom: "1px solid #CCC" }} key={study.id}>
        <Grid item md={3} xs={12}>
          <Link href={studyUrl}><a><img src={study.image} className="img-fluid" alt={study.name} /></a></Link>
        </Grid>
        <Grid item md={9} xs={12}>
          <h3>
            <Link href={studyUrl}><a>{study.name}</a></Link>
          </h3>
          <p>
            <i>{study.shortDescription}</i>
          </p>
          <p>{study.description}</p>
        </Grid>
      </Grid>
    );
  };

  return (
    <div>
      <h2>Studies</h2>
      {studies.map(createStudy)}
    </div>
  );
}

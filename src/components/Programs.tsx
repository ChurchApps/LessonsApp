import Link from "next/link";
import { Container, Grid } from "@mui/material";
import { ProgramInterface, ProviderInterface } from "@/utils";
import { Markdown } from "./index";

type Props = {
  programs: ProgramInterface[];
  providers: ProviderInterface[];
};

export function Programs(props: Props) {

  function createProgram({ slug, image, name, shortDescription, description, id }: ProgramInterface) {
    const url = "/" + slug + "/";
    return (
      <div key={id}>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            <Link href={url}><img src={image} alt={name} /></Link>
          </Grid>
          <Grid item md={8} xs={12}>
            <Link href={url}><h3 style={{ fontSize: "28px", fontWeight: 400, margin: "0 8px 0 0" }}>{name}</h3></Link>
            <p><i>{shortDescription}</i></p>
            <Markdown value={description} />
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
}

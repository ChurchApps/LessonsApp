import Link from "next/link";
import { ProgramInterface, ProviderInterface } from "@/utils";
import ReactMarkdown from "react-markdown";
import { Container, Grid } from "@mui/material";

type Props = {
  programs: ProgramInterface[];
  providers: ProviderInterface[];
};

export function Programs(props: Props) {

  function createProgram({ slug, image, name, shortDescription, description, id }: ProgramInterface) {
    console.log(slug);
    const url = "/" + slug + "/";
    return (
      <div key={id}>
        <Grid container spacing={3}>
          <Grid item md={4} xs={12}>
            <Link href={url}><a><img src={image} className="img-fluid" alt={name} /></a></Link>
          </Grid>
          <Grid item md={8} xs={12}>
            <Link href={url}><a><h3>{name}</h3></a></Link>
            <p><i>{shortDescription}</i></p>
            <ReactMarkdown>{description}</ReactMarkdown>
          </Grid>
        </Grid>
        <hr />
      </div>
    );
  }

  const programsView = props.providers
    .map((provider) => {
      console.log(provider.name)
      const view = props.programs
        .filter((program) => program.providerId === provider.id)
        .map((p) => createProgram(p));

      return (view.length > 0 && (
        <div key={provider.id}>
          <h3 className="mb-4" style={{ fontWeight: "bold" }}>
            {provider.name}
          </h3>
          {view}
        </div>
      ));
    })
    .filter((p) => p);

  return (
    programsView.length > 0 && (
      <div className="homeSection">
        <Container fixed>
          <h2 className="text-center">
            Browse <span>Available Programs</span>
          </h2>
          {programsView}
        </Container>
      </div>
    )
  );
}

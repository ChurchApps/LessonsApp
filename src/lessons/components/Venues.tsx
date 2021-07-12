import React from "react";
import { VenueInterface, ApiHelper, Loading, Venue, ArrayHelper } from ".";
import { ResourceInterface } from "../../helpers";


interface Props {
  lessonId: string
}

export const Venues: React.FC<Props> = (props) => {

  const [venues, setVenues] = React.useState<VenueInterface[]>(null);
  const [allResources, setAllResources] = React.useState<ResourceInterface[]>(null);

  const loadData = () => {
    if (props.lessonId !== "") {
      ApiHelper.getAnonymous("/venues/public/lesson/" + props.lessonId, "LessonsApi").then(l => {
        setVenues(l);
        ApiHelper.getAnonymous("/resources/public/lesson/" + props.lessonId, "LessonsApi").then(data => setAllResources(data));
      });
    }
  }

  React.useEffect(loadData, [props.lessonId]);

  const getVenues = () => {
    if (venues === null) return <Loading />
    else {
      const result: JSX.Element[] = [];
      venues.forEach(v => {
        const resources: ResourceInterface[] = [];

        v.sections?.forEach(s => {
          s.roles?.forEach(r => {
            r.actions?.forEach(a => {
              if (a.resourceId) {
                if (allResources) {
                  const r: ResourceInterface = ArrayHelper.getOne(allResources, "id", a.resourceId);
                  if (r && resources.indexOf(r) === -1) resources.push(r);
                }
              }
            })
          })
        })

        resources.sort((a, b) => (a.name > b.name) ? 1 : -1)

        result.push(<Venue venue={v} resources={resources} />)
      });
      return <>{result}</>;
    }
  }

  return (<>
    {getVenues()}
  </>);
}

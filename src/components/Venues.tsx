import { VenueInterface, ResourceInterface, ArrayHelper } from "@/utils";
import { Venue } from "./Venue";

type Props = {
  venues: VenueInterface[];
  resources: ResourceInterface[];
};

export function Venues({ venues, resources: allResources }: Props) {
  const venueViews = venues.map((v) => {
    const resources: ResourceInterface[] = [];

    v.sections?.forEach((s) => {
      s.roles?.forEach((r) => {
        r.actions?.forEach((a) => {
          if (a.resourceId) {
            if (allResources) {
              const r: ResourceInterface = ArrayHelper.getOne(
                allResources,
                "id",
                a.resourceId
              );
              if (r && resources.indexOf(r) === -1) resources.push(r);
            }
          }
        });
      });
    });

    resources.sort((a, b) => (a.name > b.name ? 1 : -1));

    return (
      <div key={v.id}>
        <br />
        <br />
        <Venue venue={v} resources={resources} />
      </div>
    );
  });

  return <div>{venueViews}</div>;
}

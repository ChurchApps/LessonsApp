import { VenueInterface, ResourceInterface, ArrayHelper, BundleInterface } from "@/utils";
import { Venue } from "./Venue";

type Props = {
  venues: VenueInterface[];
  resources: ResourceInterface[];
  bundles: BundleInterface[];
};

export function Venues(props: Props) {
  const venueViews = props.venues.map((v) => {
    const resources: ResourceInterface[] = [];

    v.sections?.forEach((s) => {
      s.roles?.forEach((r) => {
        r.actions?.forEach((a) => {
          if (a.resourceId) {
            if (props.resources) {
              const r: ResourceInterface = ArrayHelper.getOne(
                props.resources,
                "id",
                a.resourceId
              );
              if (r && resources.indexOf(r) === -1) resources.push(r);
            }
          }
        });
      });
    });

    const bundleIds = ArrayHelper.getUniqueValues(resources, "bundleId");
    const bundles = ArrayHelper.getAllArray(props.bundles, "id", bundleIds)
    resources.sort((a, b) => (a.name > b.name ? 1 : -1));

    return (
      <div key={v.id}>
        <br />
        <br />
        <Venue venue={v} resources={resources} bundles={bundles} />
      </div>
    );
  });

  return <div>{venueViews}</div>;
}

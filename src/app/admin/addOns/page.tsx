"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Grid, Icon } from "@mui/material";
import { Banner, DisplayBox, Loading, SmallButton } from "@churchapps/apphelper";
import { Wrapper } from "@/components/Wrapper";
import { AddOnEdit } from "@/components/admin/AddOnEdit";
import { AddOnInterface, ApiHelper, ProviderInterface } from "@/helpers";

export default function Admin() {
  const [providers, setProviders] = useState<ProviderInterface[]>(null);
  const [addOns, setAddOns] = useState<AddOnInterface[]>(null);
  const [editAddOn, setEditAddOn] = useState<AddOnInterface>(null);

  const router = useRouter();
  const { isAuthenticated } = ApiHelper;

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isAuthenticated) loadData();
  }, [isAuthenticated]);

  async function loadData() {
    ApiHelper.get("/providers", "LessonsApi").then((data: any) => {
      setProviders(data);
    });
    ApiHelper.get("/addOns", "LessonsApi").then((data: any) => {
      setAddOns(data);
    });
  }

  function clearEdits() {
    setEditAddOn(null);
  }

  const handleUpdated = () => {
    loadData();
    setEditAddOn(null);
  };

  function getAddOnAccordion() {
    if (addOns === null) return <Loading />;
    else return getAddOns();
  }

  function getAddOns() {
    const result: JSX.Element[] = [];
    addOns.forEach(a => {
      result.push(
        <div className="lessonDiv" key={"addOn" + a.id}>
          <a
            href="about:blank"
            onClick={e => {
              e.preventDefault();
              clearEdits();
              setEditAddOn(a);
            }}>
            <Icon>movie</Icon> {a.category}: {a.name}
          </a>
        </div>
      );
    });
    return result;
  }

  function getSidebar() {
    const result: JSX.Element[] = [];
    if (editAddOn) result.push(<AddOnEdit addOn={editAddOn} updatedCallback={handleUpdated} key="addOnEdit" />);
    return result;
  }

  const getAddOnEditContent = (
    <SmallButton
      icon="add"
      onClick={() => {
        clearEdits();
        setEditAddOn({
          providerId: providers.length > 0 ? providers[0].id : "",
          addOnType: "externalVideo",
          category: "slow worship"
        });
      }}
    />
  );

  return (
    <Wrapper>
      <Banner>
        <h1>Add-ons</h1>
      </Banner>
      <div id="mainContent">
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            <DisplayBox headerText="Add-ons" headerIcon="movie" editContent={getAddOnEditContent}>
              {getAddOnAccordion()}
            </DisplayBox>
          </Grid>
          <Grid item md={4} xs={12}>
            {getSidebar()}
          </Grid>
        </Grid>
      </div>
    </Wrapper>
  );
}

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ApiHelper, ExternalProviderInterface } from "@/helpers";
import { Wrapper } from "@/components/Wrapper";
import { Icon } from "@mui/material";
import { ProviderEdit } from "@/components/portal/ProviderEdit";
import { DisplayBox } from "@churchapps/apphelper/dist/components/DisplayBox";
import { SmallButton } from "@churchapps/apphelper/dist/components/SmallButton";
import { Banner } from "@churchapps/apphelper";

export default function ThirdParty() {
  const router = useRouter();
  const { isAuthenticated } = ApiHelper;
  const [providers, setProviders] = useState([]);
  const [editProvider, setEditProvider] = useState<ExternalProviderInterface>(null);

  const loadData = () => {
    ApiHelper.get("/externalProviders", "LessonsApi").then((data: any) => {
      setProviders(data);
    });
  }

  useEffect(() => {
    if (!isAuthenticated) router.push("/login");
    else loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getProviders = () => {
    let result: JSX.Element[] = [];
    return <table className="table">
      <tbody>{getRows()}</tbody>
    </table>;
  }

  const getRows = () => {
    const result: JSX.Element[] = [];
    providers.forEach((p) => {
      result.push(
        <tr className="scheduleRow" key={p.id}>
          <td>
            {p.name}
          </td>
          <td style={{textAlign:"right"}}>
            <a href="about:blank" onClick={(e) => { e.preventDefault(); setEditProvider(p); }}><Icon>edit</Icon></a>
          </td>
        </tr>
      );
    });
    return result;
  };


  const getEditContent = () => <SmallButton icon="add" onClick={() => { setEditProvider({}); }} />

  return (
    <Wrapper>
      <Banner><h1>External Lesson Providers</h1></Banner>
      <div id="mainContent">

        { editProvider && (<ProviderEdit provider={editProvider} updatedCallback={() => { setEditProvider(null); loadData(); }} />)}
        <DisplayBox headerText="Providers" headerIcon="groups" editContent={getEditContent()}>
          <p>You can use lessons from other sources that support the <a href="https://support.churchapps.org/developer/open-lesson-schema.html" target="_blank">Open Lesson Format</a> in the Lessons.church and B1.church apps.  Manage those providers here.</p>
          {getProviders()}
        </DisplayBox>
      </div>

    </Wrapper>
  );
}

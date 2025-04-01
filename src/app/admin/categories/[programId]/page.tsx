"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ApiHelper, ProgramInterface, StudyCategoryInterface, StudyInterface } from "@/helpers";
import { Wrapper } from "@/components/Wrapper";
import { Grid } from "@mui/material";
import { SmallButton, DisplayBox, ArrayHelper, Banner } from "@churchapps/apphelper";
import { useParams } from 'next/navigation'

type PageParams = {programId:string }

export default function Admin() {

  const params = useParams<PageParams>()
  const router = useRouter();
  const { isAuthenticated } = ApiHelper

  const [program, setProgram] = useState<ProgramInterface>(null);
  const [categoryNames, setCategoryNames] = useState<string[]>([]);
  const [categoryName, setCategoryName] = useState<string>("");
  const [studyCategories, setStudyCategories] = useState<StudyCategoryInterface[]>([]);
  const [studies, setStudies] = useState<StudyInterface[]>([]);
  const programId = params.programId as string;

  const loadData = () => {
    ApiHelper.get("/programs/" + programId, "LessonsApi").then((data: any) => { setProgram(data); });
    ApiHelper.get("/studyCategories/categoryNames/" + programId, "LessonsApi").then((data: any) => { setCategoryNames(data); });
  }

  const loadCategory = () => {
    ApiHelper.get("/studyCategories/" + programId + "?categoryName=" + escape(categoryName), "LessonsApi").then((data: any) => { setStudyCategories(data); });
    ApiHelper.get("/studies/program/" + programId, "LessonsApi").then((data: any) => { setStudies(data); });
  }

  const handleAdd = (studyId: string) => {
    let sc:StudyCategoryInterface = {
      programId: programId,
      studyId: studyId,
      categoryName: categoryName,
      sort: studyCategories.length + 1
    };
    ApiHelper.post("/studyCategories", [sc], "LessonsApi").then(() => { loadCategory(); });
  }

  const handleRemove = (id: string) => {
    ApiHelper.delete("/studyCategories/" + id, "LessonsApi").then(() => { loadCategory(); });
  }

  const moveUp = (index: number) => {
    const sc = studyCategories[index];
    sc.sort = sc.sort - 1.1;
    ApiHelper.post("/studyCategories", [sc], "LessonsApi").then(() => { loadCategory(); });
  }

  const moveDown = (index: number) => {
    const sc = studyCategories[index];
    sc.sort = sc.sort + 1.1;
    ApiHelper.post("/studyCategories", [sc], "LessonsApi").then(() => { loadCategory(); });
  }

  useEffect(() => { if (isAuthenticated) { loadData(); } else router.push("/login") }, [isAuthenticated]);
  useEffect(() => { if (categoryName) { loadCategory(); } }, [categoryName]);

  const getEditContent = () => <SmallButton icon="add" onClick={() => { setCategoryName(prompt("Category Name")); }} />

  const getStudyCategories = () => {
    let result: JSX.Element[] = [];
    let i = 0;
    studyCategories.forEach((sc) => {
      const study = ArrayHelper.getOne(studies, "id", sc.studyId);
      const index = i;
      const upLink = (i === 0) ? <span style={{ paddingLeft: 14 }}>&nbsp;</span> : <SmallButton icon="arrow_upward" onClick={() => { moveUp(index) }} />
      const downLink = (i === studyCategories.length - 1) ? <></> : <SmallButton icon="arrow_downward" onClick={() => { moveDown(index) }} />
      i++;
      result.push(<tr>
        <td><SmallButton icon="remove" onClick={() => { handleRemove(sc.id) }} /></td>
        <td>{study?.name}</td>
        <td>{upLink}{downLink}</td>
      </tr>);
    });
    return result;
  }

  const getCategory = () => {
    if (!categoryName) return <p>Select a category to view studies</p>;
    else {
      return (
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={6} style={{alignSelf:"start"}}>
            <h2>Included Studies</h2>
            <table>
              {getStudyCategories()}
            </table>
          </Grid>
          <Grid item xs={6}>
            <h2>Available Studies</h2>
            <table>
              {studies.map((s) => (<tr>
                <td><SmallButton icon="add" onClick={() => { handleAdd(s.id) }} /></td>
                <td>{s.name}</td>
              </tr>))}
            </table>
          </Grid>
        </Grid>);
    }
  }

  return (
    <Wrapper>
      <Banner><h1>Programs</h1></Banner>
      <div id="mainContent">
        <h1>Categories for {program?.name}</h1>
        <Grid container spacing={3}>
          <Grid item md={8} xs={12}>
            <DisplayBox headerText={categoryName || "Select Category"} headerIcon="edit_note">
              {getCategory()}
            </DisplayBox>
          </Grid>
          <Grid item md={4} xs={12}>
            <DisplayBox headerText="Categories" headerIcon="edit_note" editContent={getEditContent()}>
              <table className="table table-striped">
                { categoryNames.map((c) => (<><tr><td><a href="about:blank" onClick={(e) => { e.preventDefault(); setCategoryName(c); } }>{c}</a></td></tr></>)) }
              </table>
            </DisplayBox>
          </Grid>
        </Grid>
      </div>
    </Wrapper>
  );
}

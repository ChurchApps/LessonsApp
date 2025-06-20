"use client";

import { Studies } from "@/components/Studies";
import { ProgramInterface, StudyCategoryInterface, StudyInterface } from "@/helpers/interfaces";
import { ArrayHelper } from "@churchapps/apphelper/dist/helpers/ArrayHelper";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import { useEffect, useState } from "react";

interface Props {
  studyCategories: StudyCategoryInterface[];
  studies: StudyInterface[];
  program: ProgramInterface;
}

export function CategoriesAndStudies(props: Props) {

  const [filteredStudies, setFilteredStudies] = useState(props.studies);
  const [category, setCategory] = useState("");

  const getCategoryList = () =>
  {
    const categories = ArrayHelper.getUniqueValues(props.studyCategories, "categoryName").sort();
    const tabs:JSX.Element[] = [];
    categories.forEach((name) => { tabs.push(<Tab label={name} value={name} key={name} />)});
    return (<Tabs
      id="studyCategoryTabs"
      value={category}
      onChange={(e, newValue) => setCategory(newValue)}
      TabIndicatorProps={{style: {background:"transparent"}}}
    >
      <Tab value="" label="All" />
      {tabs}
    </Tabs>);
  }


  useEffect(() => {
    if (category==="") setFilteredStudies(props.studies);
    else {
      const filteredCategories = props.studyCategories.filter((sc) => sc.categoryName === category).sort((a, b) => a.sort - b.sort);
      let result:StudyInterface[] = [];
      filteredCategories.forEach((sc) => {
        const study = ArrayHelper.getOne(props.studies, "id", sc.studyId);
        if (study) result.push(study);
        setFilteredStudies(result)
      });
    }
  }, [category]);

  return <>
    {getCategoryList()}
    {props.studies?.length > 0 && (
      <Studies studies={filteredStudies} slug={`/${props.program.slug}`} />
    )}
  </>
}

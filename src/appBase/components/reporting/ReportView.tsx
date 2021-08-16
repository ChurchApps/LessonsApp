import React, { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { BarChart } from "./BarChart";
import { GroupedReport } from "./GroupedReport";
import { DisplayBox, ExportLink } from "../";
import { ReportInterface } from "../../interfaces/ReportInterfaces";

interface Props { report?: ReportInterface }

export const ReportView = (props: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    content: () => contentRef.current
  })

  const getEditContent = () => {
    const result: JSX.Element[] = [];

    if (props.report?.data !== undefined) {
      result.push(<button type="button" className="no-default-style" key={result.length - 2} onClick={handlePrint} title="print"><i className="fas fa-print"></i></button>);
      result.push(<ExportLink key={result.length - 1} data={props.report.data} filename={props.report.title.replace(" ", "_") + ".csv"} />);
    }
    return result;
  }

  const getChart = () => {
    let result = <></>
    switch (props.report.reportType) {
      case "Area Chart":
      case "Bar Chart":
        result = (<BarChart report={props.report} />);
        break;
      default:
        result = (<GroupedReport report={props.report} />);
        break;
    }
    return result;
  }

  return (
    <>
      <DisplayBox ref={contentRef} id={"chartBox-" + props.report?.keyName} data-cy={"chartBox-" + props.report?.keyName} headerIcon="far fa-chart-bar" headerText={props.report.title} editContent={getEditContent()}>
        {getChart()}
      </DisplayBox>
    </>
  );

}

"use client";

import { MarkdownPreviewLight } from "@churchapps/apphelper/dist/components/markdownEditor/MarkdownPreviewLight";

interface Props {
  value: string;
}

export function MarkdownWrapper(props: Props) {
  return <MarkdownPreviewLight value={props.value} />;
}

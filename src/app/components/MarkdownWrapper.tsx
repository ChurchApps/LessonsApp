"use client";

import { MarkdownPreviewLight } from "@churchapps/apphelper-markdown";

interface Props {
  value: string;
}

export function MarkdownWrapper(props: Props) {
  return <MarkdownPreviewLight value={props.value} />;
}

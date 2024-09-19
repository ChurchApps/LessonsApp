"use client";

import { MarkdownPreview } from "@churchapps/apphelper/dist/components/markdownEditor/MarkdownPreview";

type Props = {
  value:string;
};

export function MarkdownWrapper(props: Props) {
  return <MarkdownPreview value={props.value} />
}

import {createHeadlessEditor} from "@lexical/headless";
import {$generateHtmlFromNodes, $generateNodesFromDOM} from "@lexical/html";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { LexicalNode, $getRoot, $getSelection } from "lexical";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TRANSFORMERS, $convertToMarkdownString, $convertFromMarkdownString } from "@lexical/markdown";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { theme } from "../appBase/components/markdownEditor/theme";
import { ToolbarPlugin, CustomAutoLinkPlugin, ListMaxIndentLevelPlugin, ReadOnlyPlugin, ControlledEditorPlugin } from "../appBase/components/markdownEditor/plugins";
import { PLAYGROUND_TRANSFORMERS } from "../appBase/components/markdownEditor/plugins/MarkdownTransformers";
import { MarkdownModal } from "../appBase/components/markdownEditor/MarkdownModal";
import CustomLinkNodePlugin from "../appBase/components/markdownEditor/plugins/customLink/CustomLinkNodePlugin";
import { CustomLinkNode } from "../appBase/components/markdownEditor/plugins/customLink/CustomLinkNode";
import EmojisPlugin from "../appBase/components/markdownEditor/plugins/emoji/EmojisPlugin";
import { EmojiNode } from "../appBase/components/markdownEditor/plugins/emoji/EmojiNode";
import EmojiPickerPlugin from "../appBase/components/markdownEditor/plugins/emoji/EmojiPickerPlugin";
import { JSDOM } from "jsdom";


export class LexicalHelper {

  static getConfig() {
    const initialConfig = {
      namespace: "editor",
      theme,
      nodes: [
        HeadingNode,
        ListNode,
        ListItemNode,
        QuoteNode,
        CodeNode,
        CodeHighlightNode,
        TableNode,
        TableCellNode,
        TableRowNode,
        AutoLinkNode,
        LinkNode,
        CustomLinkNode,
        EmojiNode,
        {
          replace: LinkNode,
          with: (node: LexicalNode) => (
            new CustomLinkNode(node.__url, node.__target, [])
          )
        }
      ],

    };
    return initialConfig;
  }

  static markdownToHtml(markdown:string) {



    let result = "";


    const editor = createHeadlessEditor({ ...this.getConfig(), onError: () => {} });



    editor.update(() => {

      const dom = new JSDOM("<body></body>");
      // @ts-ignore
      global.window = dom.window
      global.document = dom.window.document
      global.DocumentFragment = dom.window.DocumentFragment
      //$convertFromMarkdownString("- [google](https://google.com/) this is a **test**", PLAYGROUND_TRANSFORMERS);
      $convertFromMarkdownString(markdown, PLAYGROUND_TRANSFORMERS);
    });
    editor.update(() => {
      result = $generateHtmlFromNodes(editor, null);
    });

    //temp hack for bold
    result = result.replaceAll(/\*{2}(?=\w)/g, "<b>");
    result = result.replaceAll(/\*{2}/g, "</b>");
    result = result.replaceAll(/\*{1}(?=\w)/g, "<u>");
    result = result.replaceAll(/\*{1}/g, "</u>");
    //console.log("output", JSON.stringify(editor.getEditorState()));




    //const nodes = $generateNodesFromDOM(editor, dom.window.document);
    //console.log(nodes)

    /*
    editor._editorState.read(() => {
      console.log("JSON", editor._editorState.toJSON());
      result = $generateHtmlFromNodes(editor)
      console.log("result", result)
    })*/

    return result;

  }

}



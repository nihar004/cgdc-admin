import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Underline } from "@tiptap/extension-underline";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Image } from "@tiptap/extension-image";
import { Highlight } from "@tiptap/extension-highlight";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Table as TableIcon,
  Image as ImageIcon,
  Highlighter,
  Trash2,
  Plus,
} from "lucide-react";
import { useState, useCallback, useEffect } from "react";

const TiptapEditor = ({ content, onChange }) => {
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageUrl, setImageUrl] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          style:
            "border-collapse: collapse; width: 100%; border: 1px solid #e5e7eb;",
        },
      }),
      TableRow.configure({
        HTMLAttributes: {
          style: "border: 1px solid #e5e7eb;",
        },
      }),
      TableHeader.configure({
        HTMLAttributes: {
          style:
            "border: 1px solid #e5e7eb; background-color: #A6C9EC; padding: 0px; font-weight: 600; text-align: center;",
        },
      }),
      TableCell.configure({
        HTMLAttributes: {
          style: "border: 1px solid #e5e7eb; padding: 0px; text-align: center;",
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded",
        },
      }),
    ],
    content: content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none max-w-none",
      },
    },
    immediatelyRender: false,
  });

  // Add after the editor initialization
  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content);
    }
  }, [content, editor]);

  const addImage = useCallback(() => {
    if (imageUrl) {
      editor.chain().focus().setImage({ src: imageUrl }).run();
      setImageUrl("");
      setShowImageDialog(false);
    }
  }, [editor, imageUrl]);

  if (!editor) {
    return null;
  }

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden shadow-sm bg-white">
      {/* Toolbar */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 p-3">
        <div className="flex flex-wrap gap-2 items-center">
          {/* Headings */}
          <select
            onChange={(e) => {
              const level = parseInt(e.target.value);
              if (level === 0) {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level }).run();
              }
            }}
            className="px-3 py-1.5 rounded-lg border border-gray-300 text-sm font-medium bg-white hover:bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={
              editor.isActive("heading", { level: 1 })
                ? "1"
                : editor.isActive("heading", { level: 2 })
                  ? "2"
                  : editor.isActive("heading", { level: 3 })
                    ? "3"
                    : "0"
            }
          >
            <option value="0">Paragraph</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>

          <div className="w-px h-6 bg-gray-300" />

          {/* Text Formatting */}
          <div className="flex gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded-lg transition-all ${
                editor.isActive("bold")
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              type="button"
              title="Bold (Ctrl+B)"
            >
              <Bold className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded-lg transition-all ${
                editor.isActive("italic")
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              type="button"
              title="Italic (Ctrl+I)"
            >
              <Italic className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-2 rounded-lg transition-all ${
                editor.isActive("underline")
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              type="button"
              title="Underline (Ctrl+U)"
            >
              <UnderlineIcon className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Lists */}
          <div className="flex gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-lg transition-all ${
                editor.isActive("bulletList")
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              type="button"
              title="Bullet List"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-lg transition-all ${
                editor.isActive("orderedList")
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              type="button"
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Alignment */}
          <div className="flex gap-1">
            <button
              onClick={() => editor.chain().focus().setTextAlign("left").run()}
              className={`p-2 rounded-lg transition-all ${
                editor.isActive({ textAlign: "left" })
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              type="button"
              title="Align Left"
            >
              <AlignLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().setTextAlign("center").run()
              }
              className={`p-2 rounded-lg transition-all ${
                editor.isActive({ textAlign: "center" })
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              type="button"
              title="Align Center"
            >
              <AlignCenter className="w-4 h-4" />
            </button>
            <button
              onClick={() => editor.chain().focus().setTextAlign("right").run()}
              className={`p-2 rounded-lg transition-all ${
                editor.isActive({ textAlign: "right" })
                  ? "bg-blue-100 text-blue-700 shadow-sm"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              type="button"
              title="Align Right"
            >
              <AlignRight className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Table Controls */}
          <div className="flex gap-1">
            <button
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
                  .run()
              }
              className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 transition-all"
              type="button"
              title="Insert Table"
            >
              <TableIcon className="w-4 h-4" />
            </button>

            {editor.isActive("table") && (
              <>
                <button
                  onClick={() => editor.chain().focus().addColumnAfter().run()}
                  className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 transition-all"
                  type="button"
                  title="Add Column"
                >
                  <Plus className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().deleteColumn().run()}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-all"
                  type="button"
                  title="Delete Column"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => editor.chain().focus().deleteTable().run()}
                  className="p-2 rounded-lg hover:bg-red-100 text-red-600 transition-all"
                  type="button"
                  title="Delete Table"
                >
                  <TableIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Colors */}
          <div className="flex gap-1 items-center">
            <div className="relative group">
              <input
                type="color"
                onInput={(e) =>
                  editor.chain().focus().setColor(e.target.value).run()
                }
                className="w-8 h-8 rounded-lg cursor-pointer border-2 border-gray-300 hover:border-blue-500 transition-all"
                title="Text Color"
              />
            </div>
            <button
              onClick={() => editor.chain().focus().toggleHighlight().run()}
              className={`p-2 rounded-lg transition-all ${
                editor.isActive("highlight")
                  ? "bg-yellow-100 text-yellow-700 shadow-sm"
                  : "hover:bg-gray-200 text-gray-700"
              }`}
              type="button"
              title="Highlight"
            >
              <Highlighter className="w-4 h-4" />
            </button>
          </div>

          <div className="w-px h-6 bg-gray-300" />

          {/* Image */}
          <button
            onClick={() => setShowImageDialog(true)}
            className="p-2 rounded-lg hover:bg-gray-200 text-gray-700 transition-all"
            type="button"
            title="Insert Image"
          >
            <ImageIcon className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Content */}
      <div className="bg-white">
        <EditorContent
          editor={editor}
          className="p-6 min-h-[400px] focus:outline-none prose prose-sm sm:prose lg:prose-lg max-w-none
          prose-headings:font-bold prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl
          prose-p:text-gray-700 prose-p:leading-relaxed
          prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-gray-900 prose-strong:font-semibold
          prose-ul:list-disc prose-ol:list-decimal
          prose-li:text-gray-700 prose-li:my-1
          prose-table:border-collapse prose-table:w-full
          prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-2 prose-th:font-semibold
          prose-td:border prose-td:border-gray-300 prose-td:p-2
          prose-img:rounded-lg prose-img:shadow-md"
        />
      </div>

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full transform transition-all">
            <h3 className="text-xl font-bold mb-4 text-gray-900">
              Insert Image
            </h3>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL (https://...)"
              className="w-full border-2 border-gray-300 rounded-lg px-4 py-3 mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") addImage();
                if (e.key === "Escape") {
                  setShowImageDialog(false);
                  setImageUrl("");
                }
              }}
            />
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowImageDialog(false);
                  setImageUrl("");
                }}
                className="px-5 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={addImage}
                disabled={!imageUrl}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-all shadow-lg hover:shadow-xl"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TiptapEditor;

"use client";

import { useEffect, useRef, useState } from "react";
import {
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";

const CKEditorEmail = ({ content, onChange }) => {
  const editorRef = useRef(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);
  const [Editor, setEditor] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [imageSize, setImageSize] = useState("medium");
  const [imageAlign, setImageAlign] = useState("left");

  useEffect(() => {
    Promise.all([
      import("@ckeditor/ckeditor5-react").then((mod) => mod.CKEditor),
      import("@ckeditor/ckeditor5-build-classic"),
    ]).then(([CKEditorComponent, ClassicEditorModule]) => {
      setEditor(() => ({
        CKEditor: CKEditorComponent,
        ClassicEditor: ClassicEditorModule.default,
      }));
      setIsLayoutReady(true);
    });

    return () => setIsLayoutReady(false);
  }, []);

  // Convert editor content to email-safe HTML with inline styles
  const convertToEmailHTML = (html) => {
    if (!html) return "";

    let emailHTML = html;

    // Fix paragraphs - add inline styles
    emailHTML = emailHTML.replace(
      /<p>/g,
      '<p style="margin: 0 0 4px 0; line-height: 1.4; font-family: Arial, sans-serif; font-size: 14px; color: #000000;">'
    );

    // Fix headings - add inline styles
    emailHTML = emailHTML.replace(
      /<h1>/g,
      '<h1 style="margin: 8px 0 6px 0; line-height: 1.3; font-size: 24px; font-weight: bold; color: #000000;">'
    );
    emailHTML = emailHTML.replace(
      /<h2>/g,
      '<h2 style="margin: 6px 0 4px 0; line-height: 1.3; font-size: 20px; font-weight: bold; color: #000000;">'
    );
    emailHTML = emailHTML.replace(
      /<h3>/g,
      '<h3 style="margin: 6px 0 4px 0; line-height: 1.3; font-size: 16px; font-weight: bold; color: #000000;">'
    );

    // Fix lists - add inline styles
    emailHTML = emailHTML.replace(
      /<ul>/g,
      '<ul style="margin: 4px 0; padding-left: 24px;">'
    );
    emailHTML = emailHTML.replace(
      /<ol>/g,
      '<ol style="margin: 4px 0; padding-left: 24px;">'
    );
    emailHTML = emailHTML.replace(
      /<li>/g,
      '<li style="margin: 1px 0; line-height: 1.4;">'
    );

    // Fix links - add inline styles
    emailHTML = emailHTML.replace(
      /<a /g,
      '<a style="color: #2563eb; text-decoration: underline;" '
    );

    // Fix blockquotes - add inline styles
    emailHTML = emailHTML.replace(
      /<blockquote>/g,
      '<blockquote style="border-left: 4px solid #d1d5db; padding-left: 16px; margin: 8px 0; font-style: italic; color: #6b7280;">'
    );

    // Fix tables - CRITICAL for email
    emailHTML = emailHTML.replace(
      /<table>/g,
      '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; border: 2px solid #000000; margin: 8px 0; font-family: Arial, sans-serif;">'
    );

    // Fix table cells with borders
    emailHTML = emailHTML.replace(
      /<td>/g,
      '<td style="border: 1px solid #000000; padding: 8px; vertical-align: top; background-color: #ffffff;">'
    );
    emailHTML = emailHTML.replace(
      /<th>/g,
      '<th style="border: 1px solid #000000; padding: 8px; background-color: #e5e7eb; font-weight: bold; text-align: left;">'
    );

    // Fix images - ensure they have inline styles
    emailHTML = emailHTML.replace(
      /<img /g,
      '<img style="max-width: 100%; height: auto; display: block; margin: 8px 0;" '
    );

    // Fix strong/bold
    emailHTML = emailHTML.replace(
      /<strong>/g,
      '<strong style="font-weight: bold;">'
    );

    // Fix emphasis/italic
    emailHTML = emailHTML.replace(/<em>/g, '<em style="font-style: italic;">');

    // Fix underline
    emailHTML = emailHTML.replace(
      /<u>/g,
      '<u style="text-decoration: underline;">'
    );

    return emailHTML;
  };

  const insertImageWithSize = () => {
    if (!imageUrl || !editorRef.current) return;

    try {
      const sizeMap = {
        small: 200,
        medium: 400,
        large: 600,
      };

      const alignMap = {
        left: "margin: 8px 0; display: block;",
        center: "margin: 8px auto; display: block;",
        right: "margin: 8px 0 8px auto; display: block;",
      };

      const width = sizeMap[imageSize];
      const alignStyle = alignMap[imageAlign];

      // Use inline styles for email compatibility
      const imageHtml = `<p style="text-align: ${imageAlign};"><img src="${imageUrl}" width="${width}" style="${alignStyle} max-width: 100%; height: auto;" alt="Image" /></p>`;

      const viewFragment = editorRef.current.data.processor.toView(imageHtml);
      const modelFragment = editorRef.current.data.toModel(viewFragment);
      editorRef.current.model.insertContent(modelFragment);

      setShowImageModal(false);
      setImageUrl("");
      setImageSize("medium");
      setImageAlign("left");
    } catch (error) {
      console.error("Error inserting image:", error);
      alert("Error inserting image. Please try again.");
    }
  };

  const editorConfig = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "link",
        "bulletedList",
        "numberedList",
        "|",
        "alignment",
        "|",
        "insertTable",
        "blockQuote",
        "|",
        "undo",
        "redo",
      ],
    },
    heading: {
      options: [
        { model: "paragraph", title: "Normal", class: "ck-heading_paragraph" },
        {
          model: "heading1",
          view: "h1",
          title: "Heading 1",
          class: "ck-heading_heading1",
        },
        {
          model: "heading2",
          view: "h2",
          title: "Heading 2",
          class: "ck-heading_heading2",
        },
        {
          model: "heading3",
          view: "h3",
          title: "Heading 3",
          class: "ck-heading_heading3",
        },
      ],
    },
    alignment: {
      options: ["left", "center", "right", "justify"],
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells"],
      tableProperties: {
        borderColors: [],
        backgroundColors: [],
      },
    },
    link: {
      addTargetToExternalLinks: true,
      defaultProtocol: "https://",
    },
    placeholder: "Write your email here...",
  };

  if (!isLayoutReady || !Editor) {
    return (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="min-h-[400px] flex items-center justify-center">
          <div className="flex items-center gap-2 text-gray-500">
            <svg
              className="animate-spin h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading editor...</span>
          </div>
        </div>
      </div>
    );
  }

  const { CKEditor, ClassicEditor } = Editor;

  return (
    <>
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Custom Toolbar Extension */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200 px-4 py-2 flex gap-2 items-center flex-wrap">
          <button
            onClick={() => setShowImageModal(true)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2 text-sm font-medium text-gray-700 transition-all shadow-sm"
            type="button"
          >
            <ImageIcon className="w-4 h-4" />
            Insert Image
          </button>
        </div>

        <div className="editor-container-wrapper">
          <CKEditor
            editor={ClassicEditor}
            config={editorConfig}
            data={content || ""}
            onChange={(event, editor) => {
              const rawData = editor.getData();
              // Pass raw data directly - no conversion during editing
              // This prevents cursor jumping issues
              onChange(rawData);
            }}
            onReady={(editor) => {
              editorRef.current = editor;
            }}
          />
        </div>

        <style jsx global>{`
          .editor-container-wrapper .ck-editor {
            width: 100%;
          }

          .editor-container-wrapper .ck-editor__editable {
            min-height: 450px !important;
            max-height: 600px !important;
            overflow-y: auto !important;
            padding: 20px 24px !important;
            font-family: Arial, sans-serif !important;
            font-size: 14px !important;
            line-height: 1.4 !important;
            color: #000000 !important;
          }

          .editor-container-wrapper .ck.ck-toolbar {
            background: linear-gradient(to right, #f9fafb, #f3f4f6) !important;
            border: none !important;
            border-bottom: 1px solid #e5e7eb !important;
            padding: 12px !important;
          }

          .editor-container-wrapper .ck.ck-button:not(.ck-disabled):hover {
            background: #e5e7eb !important;
          }

          .editor-container-wrapper .ck.ck-button.ck-on {
            background: #dbeafe !important;
            color: #1d4ed8 !important;
          }

          .editor-container-wrapper .ck-content p {
            margin: 0 0 4px 0 !important;
            line-height: 1.4 !important;
          }

          .editor-container-wrapper .ck-content h1 {
            font-size: 24px !important;
            font-weight: bold !important;
            margin: 8px 0 6px 0 !important;
          }

          .editor-container-wrapper .ck-content h2 {
            font-size: 20px !important;
            font-weight: bold !important;
            margin: 6px 0 4px 0 !important;
          }

          .editor-container-wrapper .ck-content h3 {
            font-size: 16px !important;
            font-weight: bold !important;
            margin: 6px 0 4px 0 !important;
          }

          .editor-container-wrapper .ck-content ul,
          .editor-container-wrapper .ck-content ol {
            margin: 4px 0 !important;
            padding-left: 24px !important;
          }

          .editor-container-wrapper .ck-content li {
            margin: 1px 0 !important;
            line-height: 1.4 !important;
          }

          .editor-container-wrapper .ck-content table {
            border-collapse: collapse !important;
            border: 2px solid #000000 !important;
            margin: 8px 0 !important;
          }

          .editor-container-wrapper .ck-content table td,
          .editor-container-wrapper .ck-content table th {
            border: 1px solid #000000 !important;
            padding: 8px !important;
            min-width: 80px !important;
          }

          .editor-container-wrapper .ck-content table th {
            background-color: #e5e7eb !important;
            font-weight: bold !important;
          }

          .editor-container-wrapper .ck-content img {
            max-width: 100% !important;
            height: auto !important;
            display: block !important;
            margin: 8px 0 !important;
          }

          .editor-container-wrapper .ck-content a {
            color: #2563eb !important;
            text-decoration: underline !important;
          }

          .editor-container-wrapper .ck-content blockquote {
            border-left: 4px solid #d1d5db !important;
            padding-left: 16px !important;
            margin: 8px 0 !important;
            font-style: italic !important;
          }

          /* Alignment support */
          .editor-container-wrapper .ck-content .image-style-align-left {
            float: left !important;
            margin-right: 1em !important;
          }

          .editor-container-wrapper .ck-content .image-style-align-center {
            margin-left: auto !important;
            margin-right: auto !important;
          }

          .editor-container-wrapper .ck-content .image-style-align-right {
            float: right !important;
            margin-left: 1em !important;
          }
        `}</style>
      </div>

      {/* Image Insert Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4 text-gray-900 flex items-center gap-2">
              <ImageIcon className="w-5 h-5" />
              Insert Image
            </h3>

            <div className="space-y-4">
              {/* URL Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image URL
                </label>
                <input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full border-2 border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <p className="text-xs text-amber-800 font-medium">
                    ⚠️ Important: Use only publicly accessible URLs (https://)
                  </p>
                  <p className="text-xs text-amber-700 mt-1">
                    Email clients cannot display local files or base64 images.
                    Your image must be hosted online.
                  </p>
                </div>
              </div>

              {/* Image Size */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Size
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {["small", "medium", "large"].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setImageSize(size)}
                      className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all ${
                        imageSize === size
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                      <div className="text-xs text-gray-500 mt-1">
                        {size === "small"
                          ? "200px"
                          : size === "medium"
                            ? "400px"
                            : "600px"}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Image Alignment */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image Alignment
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setImageAlign("left")}
                    className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                      imageAlign === "left"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <AlignLeft className="w-4 h-4" />
                    Left
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageAlign("center")}
                    className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                      imageAlign === "center"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <AlignCenter className="w-4 h-4" />
                    Center
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageAlign("right")}
                    className={`px-4 py-2.5 rounded-lg border-2 font-medium transition-all flex items-center justify-center gap-2 ${
                      imageAlign === "right"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                    }`}
                  >
                    <AlignRight className="w-4 h-4" />
                    Right
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end mt-6 pt-4 border-t">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl("");
                  setImageSize("medium");
                  setImageAlign("left");
                }}
                className="px-5 py-2.5 border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all"
              >
                Cancel
              </button>
              <button
                onClick={insertImageWithSize}
                disabled={!imageUrl}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed font-medium transition-all shadow-lg"
              >
                Insert Image
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export const convertToEmailHTML = (html) => {
  if (!html) return "";

  let emailHTML = html;

  // Fix paragraphs - add inline styles
  emailHTML = emailHTML.replace(
    /<p>/g,
    '<p style="margin: 0 0 4px 0; line-height: 1.4; font-family: Arial, sans-serif; font-size: 14px; color: #000000;">'
  );

  // Fix headings - add inline styles
  emailHTML = emailHTML.replace(
    /<h1>/g,
    '<h1 style="margin: 8px 0 6px 0; line-height: 1.3; font-size: 24px; font-weight: bold; color: #000000;">'
  );
  emailHTML = emailHTML.replace(
    /<h2>/g,
    '<h2 style="margin: 6px 0 4px 0; line-height: 1.3; font-size: 20px; font-weight: bold; color: #000000;">'
  );
  emailHTML = emailHTML.replace(
    /<h3>/g,
    '<h3 style="margin: 6px 0 4px 0; line-height: 1.3; font-size: 16px; font-weight: bold; color: #000000;">'
  );

  // Fix lists - add inline styles
  emailHTML = emailHTML.replace(
    /<ul>/g,
    '<ul style="margin: 4px 0; padding-left: 24px;">'
  );
  emailHTML = emailHTML.replace(
    /<ol>/g,
    '<ol style="margin: 4px 0; padding-left: 24px;">'
  );
  emailHTML = emailHTML.replace(
    /<li>/g,
    '<li style="margin: 1px 0; line-height: 1.4;">'
  );

  // Fix links - add inline styles
  emailHTML = emailHTML.replace(
    /<a /g,
    '<a style="color: #2563eb; text-decoration: underline;" '
  );

  // Fix blockquotes - add inline styles
  emailHTML = emailHTML.replace(
    /<blockquote>/g,
    '<blockquote style="border-left: 4px solid #d1d5db; padding-left: 16px; margin: 8px 0; font-style: italic; color: #6b7280;">'
  );

  // Fix tables - CRITICAL for email
  emailHTML = emailHTML.replace(
    /<table>/g,
    '<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; border: 2px solid #000000; margin: 8px 0; font-family: Arial, sans-serif;">'
  );

  // Fix table cells with borders
  emailHTML = emailHTML.replace(
    /<td>/g,
    '<td style="border: 1px solid #000000; padding: 8px; vertical-align: top; background-color: #ffffff;">'
  );
  emailHTML = emailHTML.replace(
    /<th>/g,
    '<th style="border: 1px solid #000000; padding: 8px; background-color: #e5e7eb; font-weight: bold; text-align: left;">'
  );

  // Fix images - ensure they have inline styles
  emailHTML = emailHTML.replace(
    /<img /g,
    '<img style="max-width: 100%; height: auto; display: block; margin: 8px 0;" '
  );

  // Fix strong/bold
  emailHTML = emailHTML.replace(
    /<strong>/g,
    '<strong style="font-weight: bold;">'
  );

  // Fix emphasis/italic
  emailHTML = emailHTML.replace(/<em>/g, '<em style="font-style: italic;">');

  // Fix underline
  emailHTML = emailHTML.replace(
    /<u>/g,
    '<u style="text-decoration: underline;">'
  );

  return emailHTML;
};

export default CKEditorEmail;

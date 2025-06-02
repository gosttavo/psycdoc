import { useState, useMemo, useCallback, useEffect } from 'react';
import { createEditor, Descendant, Editor, Text } from 'slate';
import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import type { RenderElementProps, RenderLeafProps } from 'slate-react';
import { withHistory } from 'slate-history';
import { useDarkMode } from '../hooks/useDarkMode';

type CustomText = { 
  text: string; 
  bold?: boolean; 
  italic?: boolean; 
  underline?: boolean;
  code?: boolean;
};

type CustomElement = { 
  type: 'paragraph' | 'code' | 'heading';
  children: CustomText[]; 
};

declare module 'slate' {
  interface CustomTypes {
    Editor: ReactEditor;
    Element: CustomElement;
    Text: CustomText;
  }
};

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  }
];

interface TextEditorProps {
  value?: string | string[] | Descendant[];
  onChange?: (value: Descendant[]) => void;
}

const TextEditor = ({ value, onChange }: TextEditorProps) => {
    const { isDarkMode } = useDarkMode();
    const editor = useMemo(() => withHistory(withReact(createEditor())), []);
    const [editorValue, setEditorValue] = useState<Descendant[]>(
        Array.isArray(value) && value.length > 0 && typeof value[0] === 'object'
            ? value as Descendant[]
            : initialValue
    );

    const isFormatActive = (format: keyof CustomText) => {
        const [match] = Editor.nodes(editor, {
            match: n => Text.isText(n) && n[format] === true,
            mode: 'all',
        });
        return !!match;
    };

    useEffect(() => {
        if (Array.isArray(value) && value.length > 0 && typeof value[0] === 'object') {
            setEditorValue(value as Descendant[]);
        } else if (!value) {
            setEditorValue(initialValue);
        }
    }, [value]);

    const handleChange = (newValue: Descendant[]) => {
        setEditorValue(newValue);
        onChange?.(newValue);
    };

    const toggleFormat = (format: keyof CustomText) => {
        const isActive = isFormatActive(format);
        Editor.addMark(editor, format, isActive ? null : true);
    };

    const renderElement = useCallback((props: RenderElementProps) => {
        switch (props.element.type) {
        case 'code':
            return (
            <pre className={`p-3 my-2 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
                <code {...props.attributes}>{props.children}</code>
            </pre>
            );
        case 'heading':
            return <h1 className="text-2xl font-bold my-2" {...props.attributes}>{props.children}</h1>;
        default:
            return <p className="my-2" {...props.attributes}>{props.children}</p>;
        }
    }, [isDarkMode]);

    const renderLeaf = useCallback((props: RenderLeafProps) => {
        let { children } = props;
        const { attributes, leaf } = props;

        if (leaf.bold) {
            children = <strong>{children}</strong>;
        }
        
        if (leaf.italic) {
            children = <em>{children}</em>;
        }
        
        if (leaf.underline) {
            children = <u>{children}</u>;
        }
        
        if (leaf.code) {
            children = <code className={`px-1 rounded ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>{children}</code>;
        }
        
        return <span {...attributes}>{children}</span>;
    }, [isDarkMode]);

    const Toolbar = () => {
        return (
            <div className={`flex gap-2 p-2 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                <FormatButton format="bold" icon="B" />
                <FormatButton format="italic" icon="I" />
                <FormatButton format="underline" icon="U" />
                <FormatButton format="code" icon="</>" />
            </div>
        );
    };

    const FormatButton = ({ format, icon }: { format: keyof CustomText; icon: string }) => {
        const isActive = isFormatActive(format);
        
        return (
            <button
                onMouseDown={(e) => {
                    e.preventDefault();
                    toggleFormat(format);
                }}
                className={`p-2 rounded ${isActive ? (isDarkMode ? 'bg-blue-600' : 'bg-blue-500 text-white') : (isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100')}`}
            >
                {icon}
            </button>
        );
    };

    return (
        <Slate editor={editor} initialValue={editorValue} onChange={handleChange}>
            <Toolbar />
                <Editable
                    className="flex-1 p-4 overflow-y-auto"
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    renderPlaceholder={(props) => (
                        <span
                            {...props.attributes}
                            className="p-2 text-gray-500"
                        >
                            Comece a escrever aqui...
                        </span>
                    )}
                    spellCheck
                    autoFocus
                />
        </Slate>
    );
};

export default TextEditor;
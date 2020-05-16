// Is Gutenberg 5.2 compatible
const isGutenberg52 = wp.blockEditor && wp.blockEditor.BlockEdit;

export const WpEditorStoreKey = isGutenberg52 ? 'core/block-editor' : 'core/editor';

export const WpEditor = isGutenberg52 ? wp.blockEditor : wp.editor;

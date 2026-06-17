import React from 'react';
import { fireEvent, screen } from '@testing-library/react';

import RichTextEditor from '..';
import renderWithProviders from '../../../utils/renderWithProviders';
import { getIntlAsProp } from '../../../../test-utils';

// The real ClassicEditor needs a browser; mock the React wrapper with a light
// stub that calls onReady with a fake editor and exposes a textbox.
vi.mock('@ckeditor/ckeditor5-react', () => ({
  // eslint-disable-next-line react/prop-types
  CKEditor: ({ onReady, onChange, onBlur }) => {
    const editor = {
      getData: () => '<p>hello</p>',
      editing: {
        view: {
          change: (fn) => fn({ setAttribute: () => {} }),
          focus: () => {},
          document: { getRoot: () => ({}) },
        },
      },
      data: { processor: { toView: () => ({}) }, toModel: () => ({}) },
      model: { insertContent: () => {} },
    };
    if (onReady) onReady(editor);
    return (
      <textarea
        data-testid='ckeditor'
        onChange={() => onChange && onChange({}, editor)}
        onBlur={() => onBlur && onBlur({}, editor)}
      />
    );
  },
}));

// Avoid importing the heavy `ckeditor5` package (and its DOM requirements).
vi.mock('../ckeditor/editorConfig', () => ({
  ClassicEditor: function ClassicEditor() {},
  buildEditorConfig: vi.fn(() => ({})),
}));

vi.mock('../ckeditor/uploadAdapter', () => ({
  createUploadAdapterPlugin: vi.fn(() => function plugin() {}),
}));

const renderComponent = (props = {}) =>
  renderWithProviders(
    <RichTextEditor
      labelId='someLabelId'
      onBlur={vi.fn()}
      onChange={vi.fn()}
      intl={getIntlAsProp()}
      {...props}
    />
  );

describe('<RichTextEditor />', () => {
  it('renders correctly', () => {
    renderComponent();
    expect(screen.getByTestId('ckeditor')).toBeInTheDocument();
  });

  it('calls onChange when the editor changes', () => {
    const onChange = vi.fn();
    renderComponent({ onChange });

    fireEvent.change(screen.getByTestId('ckeditor'), {
      target: { value: 'hello' },
    });

    expect(onChange).toHaveBeenCalled();
  });

  it('calls onBlur when the editor loses focus', () => {
    const onBlur = vi.fn();
    renderComponent({ onBlur });

    fireEvent.blur(screen.getByTestId('ckeditor'));

    expect(onBlur).toHaveBeenCalled();
  });

  it('opens and closes the iframe modal', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Lisää iframe'));
    expect(screen.getByText('iframeModalTitle')).toBeInTheDocument();

    fireEvent.click(screen.getByText('cancel'));
    expect(screen.queryByText('iframeModalTitle')).not.toBeInTheDocument();
  });

  it('opens and closes the skip link modal', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Lisää hyppylinkki'));
    expect(screen.getByText('skipLinkModalTitle')).toBeInTheDocument();

    fireEvent.click(screen.getByText('cancel'));
    expect(screen.queryByText('skipLinkModalTitle')).not.toBeInTheDocument();
  });
});

import { RHFEditor } from './rhf-editor';
import { RHFRating } from './rhf-rating';
import { RHFUploadAvatar } from './rhf-upload';
import { RHFTextField } from './rhf-text-field';
import { RHFImageSelect } from './rhf-image-select';
import { RHFAutoComplete } from './rhf-auto-complete';
import { RHFSelect, RHFMultiSelect } from './rhf-select';
import { RHFChipTextField } from './rhf-chip-text-field';
import { RHFListTextField } from './rhf-list-text-field';

// ----------------------------------------------------------------------

export const Field = {
  Text: RHFTextField,
  UploadAvatar: RHFUploadAvatar,
  Select: RHFSelect,
  ChipText: RHFChipTextField,
  MultiSelect: RHFMultiSelect,
  AutoComplete: RHFAutoComplete,
  ImageSelect: RHFImageSelect,
  ListText: RHFListTextField,
  Editor: RHFEditor,
  Rating: RHFRating,
};

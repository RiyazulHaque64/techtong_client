import type { IDateValue, IDatePickerControl } from './common';

// ----------------------------------------------------------------------

export type IImageFilters = {
  searchTerm: string;
  type: string[];
  fromDate: IDatePickerControl;
  toDate: IDatePickerControl;
};

export type IFileShared = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  permission: string;
};

export type IFolderManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  tags: string[];
  totalFiles?: number;
  isFavorited: boolean;
  shared: IFileShared[] | null;
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export type IFileManager = {
  id: string;
  name: string;
  size: number;
  type: string;
  url: string;
  tags: string[];
  isFavorited: boolean;
  shared: IFileShared[] | null;
  createdAt: IDateValue;
  modifiedAt: IDateValue;
};

export type IFile = IFileManager | IFolderManager;

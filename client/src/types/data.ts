
export interface AttributeTypeData {
  text: string;
  value: string;
  icon: string;
  options?: boolean;
  deprecated?: boolean;
}

export interface DocumentData {
  name: string;
  $href: string;
}

export interface ListData {
  text: string;
  value: string;
}

export interface SectionTypeData {
  text: string;
  value: string;
  icon: string;
  options?: boolean;
  deprecated?: boolean;
}

export interface TemplateData {
  name: string;
  $href: string;
}

export interface TemplateAttributeData {
  id: number;
  type: string;
  name: string;
  data?: object;
  [key: string]: string | number | object | undefined;
}

export interface TemplateSectionData {
  id: number;
  type: string;
  name: string;
  header: number;
  size: string;
  data?: object;
  [key: string]: string | number | object | undefined;
}


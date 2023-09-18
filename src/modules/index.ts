export interface AttributeOption {
  value: string;
  type?: string;
  hex?: string;
  price?: number;
}

export interface DisplaySetting {
  width: number;
  height: number;
}
export interface Product {
  id: string;
  name: string;
  short_name: string;
  description: string;
  thumbnail: string;
  price: number;
  attributes: {
    sizes: {
      label: string;
      options: AttributeOption[];
    };
    colors: {
      label: string;
      options: AttributeOption[];
    };
  };
  displays: {
    front: {
      label: string;
      mockup: {
        outer: string;
        inner: string;
      };
      settings: {
        editorSize: DisplaySetting;
        captureSize: DisplaySetting;
        previewSize: DisplaySetting;
      };
    };
    back: {
      label: string;
      mockup: {
        outer: string;
        inner: string;
      };
      settings: {
        editorSize: DisplaySetting;
        captureSize: DisplaySetting;
        previewSize: DisplaySetting;
      };
    };
  };
}

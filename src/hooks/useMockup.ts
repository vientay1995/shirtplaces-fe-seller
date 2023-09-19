"use client";

import { AttributeOption, Product } from "@/modules";
import Mockup from "@/services/mockup";
import _, { keyBy, keys } from "lodash";
import {
  ChangeEventHandler,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";

export interface UseMockup {
  (products: Product[]): [
    mockup: any,
    {
      layerId: string;
      color: AttributeOption;
      productSelected: Product;
      activeDisplay: string;
      handleSwitchDisplay: (key: string) => void;
      handleChangeProduct: (product: Product) => void;
      handleChangeColor: (color: AttributeOption) => void;
      handleSelectImage: ChangeEventHandler<HTMLInputElement>;
      removeLayer: (layer?: string) => void;
      handleExport: () => void;
    },
  ];
}

export const useMockup: UseMockup = (products) => {
  const [productSelected, setProductSelected] = useState(products[0]);
  const [color, setColor] = useState(
    productSelected.attributes.colors.options.find(
      (o) => o.value === "White"
    ) || productSelected.attributes.colors.options[0]
  );
  const [activeDisplay, setActiveDisplay] = useState(
    keys(productSelected.displays)[0]
  );
  const [layers] = useState(() => {
    const keyDisplays = keys(productSelected.displays);
    return keyDisplays.reduce(
      (obj, key) => {
        obj[key] = [];
        return obj;
      },
      {} as Record<string, any[]>
    );
  });
  const [layerId, setLayerId] = useState("");
  const [mockup, setMockup] = useState<Mockup>();
  const [files, setFiles] = useState<Record<string, any>>({});

  const handleSwitchDisplay = async (key: string) => {
    capture(activeDisplay);
    setActiveDisplay(key);
    const activeLayer = layers[key][0];
    setLayerId(activeLayer?.id || "");
  };
  const handleChangeColor = (color: AttributeOption) => {
    setColor(color);
    mockup?.changeBackground(color.value);
  };
  const handleChangeProduct = (product: Product) => setProductSelected(product);

  const layerIdentifier = () => {
    let idx = _.size(layers[activeDisplay]) + 1;
    for (const id in layers[activeDisplay]) {
      const is = id.split("-");
      if (parseInt(is[1]) >= idx) idx = parseInt(is[1]) + 1;
    }

    return idx;
  };

  const addImageLayer = (id: number, uri: string) => {
    setLayerId(`${id}`);
    layers[activeDisplay].unshift(mockup?.addImage(`${id}`, uri, {}));
    mockup?.setZIndex(
      layers[activeDisplay][0].id,
      layers[activeDisplay].length
    );
  };

  const handleSelectImage: ChangeEventHandler<HTMLInputElement> = (e) => {
    _.forEach(e?.target?.files, (file) => {
      const uri = URL.createObjectURL(file);
      setFiles((prev) => ({ ...prev, [uri]: file }));

      const idx = layerIdentifier();
      console.log({ uri, idx });
      addImageLayer(idx, uri);
    });
  };

  const removeLayer = (layer?: string) => {
    if (!layer) layer = layerId;

    console.log("layer", layer);
    if (!layer) return;

    if (layer === layerId) setLayerId("");

    _.remove(layers[activeDisplay], (item) => item.id == layer);
    mockup?.removeLayer(layer);
  };

  const capture = async (display: string) => {
    const children = mockup?.editorLayer?.getChildren() || [];
    for (const child of children) {
      const idx = _.findIndex(layers[display], { id: child.name() });
      if (idx !== -1) {
        const attrs = _.omitBy(child.getAttrs(), _.isNil);
        if (attrs.image) {
          attrs.src = attrs.image.src;
          delete attrs.image;
        }
        layers[display][idx].attrs = attrs;
      }
    }
  };

  const refresh = () => {
    mockup?.destroy();
    draw();
  };

  const draw = () => {
    const _mockUp = new Mockup(
      color.value,
      activeDisplay,
      productSelected,
      (name: any, actived: any) => setLayerId(actived)
    );
    setMockup(_mockUp);
    _mockUp.render("mock-up", keyBy(layers[activeDisplay], "id"));
  };

  const handleExport = () => {
    mockup?.export();
  };

  useLayoutEffect(() => {
    if (typeof Konva === "undefined") {
      let recaptchaScript = document.createElement("script");
      recaptchaScript.setAttribute(
        "src",
        "https://unpkg.com/konva@9.0.1/konva.min.js"
      );
      document.head.appendChild(recaptchaScript);
    }
  }, []);

  useEffect(() => {
    const ready = setInterval(function () {
      if (typeof Konva !== "undefined") {
        draw();
        clearInterval(ready);
      }
    }, 500);

    return () => {
      setMockup(undefined);
    };
  }, []);

  useEffect(() => {
    if (typeof Konva !== "undefined") refresh();
  }, [activeDisplay]);

  console.log({ layers });

  return [
    mockup,
    {
      color,
      layerId,
      productSelected,
      activeDisplay,
      handleSwitchDisplay,
      handleChangeProduct,
      handleChangeColor,
      handleSelectImage,
      removeLayer,
      handleExport,
    },
  ];
};

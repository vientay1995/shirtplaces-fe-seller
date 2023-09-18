"use client";

import { AttributeOption, Product } from "@/modules";
import Mockup from "@/services/mockup";
import { keys } from "lodash";
import { useEffect, useLayoutEffect, useState } from "react";

export interface UseMockup {
  (products: Product[]): [
    mockup: any,
    {
      color: AttributeOption;
      productSelected: Product;
      activeDisplay: string;
      handleSwitchDisplay: (key: string) => void;
      handleChangeProduct: (product: Product) => void;
      handleChangeColor: (color: AttributeOption) => void;
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
  const [layers, setLayers] = useState(() => {
    const keyDisplays = keys(productSelected.displays);
    return keyDisplays.reduce(
      (obj, key) => {
        obj[key] = [];
        return obj;
      },
      {} as Record<string, any[]>
    );
  });
  const [mockup, setMockup] = useState<Mockup>();

  const handleSwitchDisplay = (key: string) => {
    setActiveDisplay(key);
  }
  const handleChangeColor = (color: AttributeOption) => {
    setColor(color);
    mockup?.changeBackground(color.value);
  };
  const handleChangeProduct = (product: Product) => setProductSelected(product);

  const refresh = () => {
    mockup?.destroy();
    draw();
  };

  const draw = () => {
    const _mockUp = new Mockup(
      color.value,
      activeDisplay,
      productSelected,
      (name: any, actived: any) => {
        console.log({ name, actived });
      }
    );
    setMockup(_mockUp);
    _mockUp.render("mock-up", layers);
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

  return [
    mockup,
    {
      color,
      productSelected,
      activeDisplay,
      handleSwitchDisplay,
      handleChangeProduct,
      handleChangeColor,
    },
  ];
};

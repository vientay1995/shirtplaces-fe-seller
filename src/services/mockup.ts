const ouEvents = {
  image: "xChange yChange rotationChange cropChange widthChange heightChange",
  text: "textChange fontSizeChange fontFamilyChange fontStyleChange fontVariantChange fontWeightChange lineHeightChange alignChange verticalAlignChange paddingChange widthChange heightChange listeningChange visibleChange opacityChange scaleXChange scaleYChange xChange yChange rotationChange",
};

class Mockup {
  template: any;
  color: any;
  display: any;
  callback: any;
  dimensions: { dx: number; dy: number; ox: number; oy: number };
  transformers: {};
  wrapper: any;
  layers: any;
  initialized: boolean | undefined;
  editorLayer: any;
  editor: any;
  capture: any;
  preview: any;
  captureLayer: any;
  previewPaint: undefined;
  previewLayer: any;
  active: string | undefined;

  constructor(color: any, display: any, template: any, callback: any) {
    this.template = template;
    this.color = color;
    this.display = display;
    this.callback = callback;

    this.dimensions = {
      dx:
        this.template.displays[this.display].settings.editorSize.width / 2 +
        this.template.displays[this.display].settings.captureSize.width / 2,
      dy:
        this.template.displays[this.display].settings.editorSize.height / 2 +
        this.template.displays[this.display].settings.captureSize.height / 2,
      ox:
        this.template.displays[this.display].settings.editorSize.width / 2 -
        this.template.displays[this.display].settings.captureSize.width / 2,
      oy:
        this.template.displays[this.display].settings.editorSize.height / 2 -
        this.template.displays[this.display].settings.captureSize.height / 2,
    };

    this.transformers = {};
  }

  render(wrapper: any, layers: any) {
    const self = this;
    self.wrapper = wrapper;
    self.layers = layers;

    self.renderEditor();
    self.renderPreview();

    self.initialized = true;

    // Restore layers
    this.renderLayers();

    // Take snapshot and render preview
    this.capturePreview();
  }

  renderLayers() {
    console.log(this.layers);
    for (const name in this.layers) {
      console.log(name, this.layers[name]);
      if (this.layers[name].type == "image") {
        this.renderImage(this.layers[name]);
        continue;
      }

      this.renderText(this.layers[name]);
    }
  }

  renderImage(layer: { attrs: { [x: string]: any; src: any } }) {
    const { src, ...attrs } = layer.attrs;

    Konva.Image.fromURL(
      src,
      (img: {
        setAttrs: (arg0: {
          scaleX: number;
          scaleY: number;
          width: number;
          height: number;
        }) => void;
        on: (
          arg0: string,
          arg1: { (): void; (): void; (): void; (): void }
        ) => void;
        width: () => number;
        scaleX: () => number;
        height: () => number;
        scaleY: () => number;
        getAttr: (arg0: string) => any;
      }) => {
        img.setAttrs(attrs);

        this.editorLayer.add(img);
        const tr = new Konva.Transformer({
          nodes: [img],
          keepRatio: false,
          boundBoxFunc: (
            oldBox: any,
            newBox: { width: number; height: number }
          ) => {
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          },
        });

        this.editorLayer.add(tr);

        img.on("transform", () => {
          // reset scale on transform
          img.setAttrs({
            scaleX: 1,
            scaleY: 1,
            width: img.width() * img.scaleX(),
            height: img.height() * img.scaleY(),
          });
          this.applyCrop(name, img.getAttr("lastCropUsed"));
        });

        img.on("mousedown", () => {
          this.setActive(name);
        });

        img.on("dragend", () => {
          this.refreshImage(img);
        });
        img.on("transformend", () => {
          this.refreshImage(img);
        });

        setTimeout(() => {
          this.refreshImage(img);
        }, 200);
        setTimeout(() => {
          this.refreshImage(img);
        }, 400);
      }
    );
  }

  renderText(layer: { attrs: any }) {
    let textNode = new Konva.Text(layer.attrs);
    this.editorLayer.add(textNode);

    var tr = new Konva.Transformer({
      node: textNode,
      // enabledAnchors: ["middle-left", "middle-right"],
      // set minimum width of text
      boundBoxFunc: function (oldBox: any, newBox: { width: number }) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
      // enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    });

    textNode.on("transform", function () {
      // reset scale, so only with is changing by transformer
      // textNode.setAttrs({
      //   width: textNode.width() * textNode.scaleX(),
      //   // scaleX: 1, // Not allow to scale-x
      // });
    });

    textNode.on("mousedown", () => {
      this.setActive(name);
    });

    textNode.on("dragend", () => {
      this.refreshText(textNode);
    });
    textNode.on("transformend", () => {
      this.refreshText(textNode);
    });

    this.editorLayer.add(tr);
    setTimeout(() => {
      this.refreshText(textNode);
    }, 200);

    setTimeout(() => {
      this.refreshText(textNode);
    }, 400);
  }

  renderEditor() {
    const container = document.createElement("div");
    container.setAttribute("id", "ou-editor");
    container.setAttribute("class", "ou-editor");
    document.getElementById(this.wrapper).appendChild(container);

    const offsetY = Math.floor(
      (this.template.displays[this.display].settings.editorSize.height -
        this.template.displays[this.display].settings.captureSize.height) /
        2
    );
    container.style.marginTop = String(offsetY) + "px";
    container.style.marginBottom = String(offsetY) + "px";

    this.editor = new Konva.Stage({
      container: "ou-editor",
      ...this.template.displays[this.display].settings.editorSize,
    });

    const node = document.getElementById("ou-editor");
    for (let i = 0; i < node.childNodes.length; i++) {
      node.childNodes[i].className = "ou-canvas";
    }

    const frame = new Konva.Layer();
    const shapes = [
      {
        ...this.template.displays[this.display].settings.captureSize,
        x: this.dimensions.ox,
        y: this.dimensions.oy,
        stroke: "blue",
        strokeWidth: 1,
        listening: false,
        draggable: false,
        name: "inner",
      },
      {
        x: 0,
        y: 0,
        width: this.dimensions.dx,
        height: this.dimensions.oy,
        fill: "white",
        opacity: 0.4,
      },
      {
        x: 0,
        y: this.dimensions.oy,
        width: this.dimensions.ox,
        height: this.dimensions.dy,
        fill: "white",
        opacity: 0.4,
      },
      {
        x: this.dimensions.ox,
        y: this.dimensions.dy,
        width: this.dimensions.dx,
        height: this.dimensions.oy,
        fill: "white",
        opacity: 0.4,
      },
      {
        x: this.dimensions.dx,
        y: 0,
        width: this.dimensions.ox,
        height: this.dimensions.dy,
        fill: "white",
        opacity: 0.4,
      },
    ];
    shapes.forEach(function (s) {
      frame.add(new Konva.Rect(s));
    });

    this.editorLayer = new Konva.Layer();
    this.editor.add(this.editorLayer);
    this.editor.add(frame);

    this.editorLayer.zIndex(frame.zIndex() + 1);
  }

  renderPreview() {
    const snapshot = document.createElement("div");
    snapshot.setAttribute("id", "ou-snapshot");
    document.getElementById(this.wrapper).appendChild(snapshot);

    this.capture = new Konva.Stage({
      container: "ou-snapshot",
      ...this.template.displays[this.display].settings.captureSize,
    });

    let node = document.getElementById("ou-snapshot");
    for (let i = 0; i < node.childNodes.length; i++) {
      node.childNodes[i].className = "ou-canvas";
    }

    const container = document.createElement("div");
    container.setAttribute("id", "ou-preview");
    document.getElementById(this.wrapper).appendChild(container);
    this.preview = new Konva.Stage({
      container: "ou-preview",
      ...this.template.displays[this.display].settings.previewSize,
    });

    node = document.getElementById("ou-preview");
    for (let i = 0; i < node.childNodes.length; i++) {
      node.childNodes[i].className = "ou-canvas";
    }

    /**
     * Layers:
     * 1. Container background
     * 2. Render reverse outer pixel - replace by select color
     * 3. Render inner
     * 4. Render reflection capture
     */
    this.coloring(this.color);
    this.renderInner();
    // this.capturePreview();
  }

  addImage(id: string, uri: any, settings: {}) {
    const self = this;
    settings = settings || {};
    const name = "image-" + id;
    let width =
      (self.template.displays[this.display].settings.captureSize.width * 2) / 3;
    let height =
      (self.template.displays[this.display].settings.captureSize.height * 2) /
      3;

    Konva.Image.fromURL(
      uri,
      (img: {
        attrs: { image: { naturalWidth: number; naturalHeight: number } };
        setAttrs: (arg0: {
          scaleX: number;
          scaleY: number;
          width: number;
          height: number;
        }) => void;
        on: (
          arg0: string,
          arg1: { (): void; (): void; (): void; (): void }
        ) => void;
        width: () => number;
        scaleX: () => number;
        height: () => number;
        scaleY: () => number;
        getAttr: (arg0: string) => any;
      }) => {
        console.log(uri, img);
        let naturalRatio =
          img.attrs.image.naturalWidth / img.attrs.image.naturalHeight;
        if (naturalRatio >= 1) {
          height = width / naturalRatio;
        } else {
          width = naturalRatio * height;
        }

        img.setAttrs({
          width,
          height,
          x:
            (self.template.displays[this.display].settings.editorSize.width -
              width) /
            2,
          y:
            (self.template.displays[this.display].settings.editorSize.height -
              height) /
            2,
          ...settings,
          name,
          draggable: true,
        });

        this.layers[name] = {
          attrs: img.attrs,
          id: name,
        };

        console.log(this.layers[name]);

        self.editorLayer.add(img);
        self.setActive(name);
        // apply default left-top crop
        self.applyCrop(name, "center-middle");

        const tr = new Konva.Transformer({
          nodes: [img],
          keepRatio: false,
          boundBoxFunc: (
            oldBox: any,
            newBox: { width: number; height: number }
          ) => {
            if (newBox.width < 10 || newBox.height < 10) {
              return oldBox;
            }
            return newBox;
          },
        });

        self.editorLayer.add(tr);

        // Fix blink render
        // setTimeout(function () {
        //   self.refreshImage(img);
        // }, 100);
        // setTimeout(function () {
        //   self.refreshImage(img);
        // }, 200);

        img.on("transform", () => {
          // reset scale on transform
          img.setAttrs({
            scaleX: 1,
            scaleY: 1,
            width: img.width() * img.scaleX(),
            height: img.height() * img.scaleY(),
          });
          self.applyCrop(name, img.getAttr("lastCropUsed"));
        });

        img.on("mousedown", function () {
          self.setActive(name);
        });

        img.on("dragend", function () {
          self.refreshImage(img);
        });
        img.on("transformend", function () {
          self.refreshImage(img);
        });

        setTimeout(function () {
          self.refreshImage(img);
        }, 200);
      }
    );

    return {
      id: name,
      type: "image",
      data: {
        name: name.charAt(0).toUpperCase() + name.slice(1),
        uri,
      },
    };
  }

  refreshImage(img: {
    getAttr: (arg0: string) => number;
    getAttrs: () => any;
  }) {
    const self = this;
    if (!self.captureLayer) {
      self.captureLayer = new Konva.Layer();
      self.capture.add(self.captureLayer);
    }
    let clonedImage = self.captureLayer.findOne(
      (node: { getClassName: () => string; name: () => any }) => {
        return (
          node.getClassName() === "Image" && node.name() === img.getAttr("name")
        );
      }
    );
    if (clonedImage) {
      clonedImage.setAttrs({
        ...img.getAttrs(),
        draggable: false,
        x: img.getAttr("x") - self.dimensions.ox,
        y: img.getAttr("y") - self.dimensions.oy,
      });
    } else {
      // Create a new Konva.Image object
      clonedImage = new Konva.Image({
        ...img.getAttrs(),
        draggable: false,
        x: img.getAttr("x") - self.dimensions.ox,
        y: img.getAttr("y") - self.dimensions.oy,
      });
      self.captureLayer.add(clonedImage);
      clonedImage.on(ouEvents.image, function () {
        self.capturePreview();
      });
    }

    this.capturePreview();
  }

  addText(
    id: string,
    data: {
      align: any;
      textDecoration: any;
      fontStyle: any;
      fontSize: any;
      text: any;
      fontFamily: string;
      color: any;
    },
    settings: any
  ) {
    console.log(data);
    const self = this;
    const name = "text-" + id;

    let textNode = new Konva.Text({
      x:
        (this.template.displays[this.display].settings.editorSize.width -
          this.template.displays[this.display].settings.captureSize.width) /
        2,
      y:
        (this.template.displays[this.display].settings.editorSize.height -
          this.template.displays[this.display].settings.captureSize.height) /
        2,
      align: data.align || "center",
      textDecoration: data.textDecoration || "none",
      fontStyle: data.fontStyle || "normal",
      fontSize: data.fontSize || 40,
      draggable: true,
      // width:
      //   (this.template.displays[this.display].settings.captureSize.width * 2) /
      //   3,
      ...settings,
      wrap: "none",
      text: data.text,
      name,
      fontFamily:
        data.fontFamily && data.fontFamily !== ""
          ? data.fontFamily
          : "IBM Plex Sans",
      fill: data.color,
    });
    console.log(textNode);

    this.layers[name] = {
      id: name,
      attrs: textNode.attrs,
    };

    self.setActive(name);
    self.editorLayer.add(textNode);

    var tr = new Konva.Transformer({
      node: textNode,
      // enabledAnchors: ["middle-left", "middle-right"],
      // set minimum width of text
      boundBoxFunc: function (oldBox: any, newBox: { width: number }) {
        newBox.width = Math.max(30, newBox.width);
        return newBox;
      },
      // enabledAnchors: ['top-left', 'top-right', 'bottom-left', 'bottom-right']
    });

    textNode.on("transform", function () {
      // reset scale, so only with is changing by transformer
      // textNode.setAttrs({
      //   width: textNode.width() * textNode.scaleX(),
      //   // scaleX: 1, // Not allow to scale-x
      // });
    });

    textNode.on("mousedown", function () {
      self.setActive(name);
    });

    textNode.on("dragend", function () {
      self.refreshText(textNode);
    });
    textNode.on("transformend", function () {
      self.refreshText(textNode);
    });

    self.editorLayer.add(tr);

    // this.whenFontIsLoaded(function () {
    //   // set font style when font is loaded
    //   // so Konva will recalculate text wrapping if it has limited width
    //   textNode.fontFamily(data.fontFamily);
    // });

    // Fix blink render
    // setTimeout(function () {
    //   self.refreshText(textNode);
    // }, 100);
    // setTimeout(function () {
    //   self.refreshText(textNode);
    // }, 200);

    return {
      id: name,
      type: "text",
      data,
    };
  }

  setFont(layer: any, font: any) {
    const node = this.editorLayer.findOne(`.${layer}`);
    if (node) {
      node.fontFamily(font);
      this.editorLayer.draw();
      this.refreshText(node);
    }
  }

  setZIndex(id: string | number, weight: any) {
    const node = this.editorLayer.findOne(`.${id}`);
    if (node) {
      this.layers[id].weight = weight;
      node.zIndex(weight);
    }

    if (this.captureLayer) {
      const captureNode = this.captureLayer.findOne(`.${id}`);
      console.log(id, weight);
      if (captureNode) {
        captureNode.zIndex(weight);
      }
    }
    this.capturePreview();
  }

  refreshText(txt: { getAttr: (arg0: string) => number }) {
    const self = this;
    if (!self.captureLayer) {
      self.captureLayer = new Konva.Layer();
      self.capture.add(self.captureLayer);
    }

    let clonedText = self.captureLayer.findOne(
      (node: { getClassName: () => string; name: () => any }) => {
        return (
          node.getClassName() === "Text" && node.name() === txt.getAttr("name")
        );
      }
    );
    if (clonedText) {
      clonedText.setAttrs({
        ...txt,
        draggable: false,
        x: txt.getAttr("x") - self.dimensions.ox,
        y: txt.getAttr("y") - self.dimensions.oy,
      });
    } else {
      // Create a new Konva.Text object
      clonedText = new Konva.Text({
        ...txt,
        draggable: false,
        x: txt.getAttr("x") - self.dimensions.ox,
        y: txt.getAttr("y") - self.dimensions.oy,
      });
      self.captureLayer.add(clonedText);
      clonedText.on(ouEvents.text, function () {
        self.capturePreview();
      });
    }

    this.capturePreview();
  }

  changeBackground(color: any) {
    this.color = color;
    this.coloring(color);
  }

  coloring(color: any) {
    const colorObject = this.template.attributes.colors.options.filter(
      (obj: { value: any }) => {
        return obj.value == color;
      }
    )[0];
    const hexColor = colorObject.hex;

    if (this.previewPaint == undefined) {
      this.previewPaint = new Konva.Layer();
    } else {
      let coloringImg = this.previewPaint.findOne("#coloring");
      if (coloringImg) {
        coloringImg.destroy();
      }
    }

    // Load the original image
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = this.template.displays[this.display].mockup.outer;

    // Convert the hex color to RGB values
    const rgbValues = this.hexToRgb(hexColor);

    // Create a new canvas element
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    // Wait for the image to load
    img.onload = () => {
      // Set the canvas size to match the image
      canvas.width = img.width;
      canvas.height = img.height;

      // Draw the image onto the canvas
      ctx.drawImage(img, 0, 0);

      // Loop through each pixel in the canvas
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < imageData.data.length; i += 4) {
        // Check if the pixel is not transparent
        if (imageData.data[i + 3] !== 0) {
          // Set the pixel's RGB values to the specified color
          imageData.data[i] = rgbValues.r;
          imageData.data[i + 1] = rgbValues.g;
          imageData.data[i + 2] = rgbValues.b;
        }
      }

      // Update the canvas with the modified image data
      ctx.putImageData(imageData, 0, 0);

      // Convert the canvas back to an image
      const colorImg = new Image();
      colorImg.crossOrigin = "Anonymous";
      colorImg.src = canvas.toDataURL();

      const { width, height } =
        this.template.displays[this.display].settings.previewSize;
      // Calculate the scaling factors
      const aspectRatio = width / height;

      let newWidth;
      let newHeight;

      const imageRatio = img.width / img.height;
      // Determine the scaling factor to use
      if (aspectRatio >= imageRatio) {
        newWidth = width;
        newHeight = width / aspectRatio;
      } else {
        newWidth = height * aspectRatio;
        newHeight = height;
      }

      // Use the new image as the source for a Konva.Image object
      const konvaImg = new Konva.Image({
        id: "coloring",
        image: colorImg,
        x: 0,
        y: 0,
        width: newWidth,
        height: newHeight,
      });
      // Add the Konva.Image object to a layer and the stage
      this.previewPaint.add(konvaImg);
      this.preview.add(this.previewPaint);

      const children = this.previewPaint.getChildren();
      for (const child of children) {
        let zi = child.zIndex();
        const id = child.id();
        if (id == "coloring") {
          child.zIndex(0);
        } else if (id == "inner") {
          child.zIndex(1);
        } else if (zi < 2) {
          child.zIndex(zi + 1);
        }
      }
      this.capturePreview();
    };
  }

  // Function to convert hex color to RGB values
  hexToRgb(hex: string) {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return { r, g, b };
  }

  renderInner() {
    const image = new Image();
    image.crossOrigin = "Anonymous";
    image.src = this.template.displays[this.display].mockup.inner;
    image.addEventListener("load", () => {
      const img = new Konva.Image({
        id: "inner",
        ...this.template.displays[this.display].settings.previewSize,
        x: 0,
        y: 0,
        image,
        draggable: false,
      });
      this.previewPaint.add(img);
    });
  }

  capturePreview() {
    const name = "snapshot";
    // Add the image object to a new layer on the preview stage
    if (this.previewLayer) {
      this.previewLayer.destroy();
    }

    this.previewLayer = new Konva.Layer();

    // Create a new Konva.Image object using the canvas element
    const captureImage = new Konva.Image({
      // Use the toCanvas method of the stage to draw the contents of the stage on the canvas
      image: this.capture.toCanvas(),
      name,
      x: this.dimensions.ox,
      y: this.dimensions.oy,
      crossOrigin: "Anonymous",
    });

    this.previewLayer.add(captureImage);
    this.preview.add(this.previewLayer);
  }

  setActive(name: string) {
    if (this.active == name) {
      return;
    }

    if (this.active) {
      const oldActive = this.editorLayer.findOne(`.${this.active}`);
      if (oldActive) {
        oldActive.zIndex(this.layers[this.active].weight);
        this.transformers[this.active] = this.editorLayer
          .find("Transformer")
          .find((tr: { nodes: () => any[] }) => {
            return tr.nodes()[0] === oldActive;
          });
        this.transformers[this.active].zIndex(this.layers[this.active].weight);
        this.transformers[this.active].detach();
      }
    }

    this.active = name;
    const newActive = this.editorLayer.findOne(`.${this.active}`);
    if (newActive && this.transformers[name]) {
      this.transformers[name].attachTo(newActive);
      this.transformers[name].zIndex(999);
    }

    if (typeof this.callback == "function") {
      this.callback("select", name);
    }
  }

  removeLayer(name: string | number) {
    if (this.active == name) {
      this.active = null;
    }

    const node = this.editorLayer.findOne(`.${name}`);
    if (node) {
      const tr = this.editorLayer
        .find("Transformer")
        .find((tr: { nodes: () => any[] }) => tr.nodes()[0] === node);
      if (tr) {
        tr.destroy();
      }
      if (this.transformers[name]) {
        delete this.transformers[name];
      }
      node.destroy();
      this.editorLayer.draw();
    }

    const clone = this.captureLayer.findOne(`.${name}`);
    if (clone) {
      clone.destroy();
      this.captureLayer.draw();
    }
    this.capturePreview();
  }

  // function to calculate crop values from source image, its visible size and a crop strategy
  getCrop(
    image: { width: number; height: number },
    size: { width: any; height: any },
    clipPosition = "center-middle"
  ) {
    const width = size.width;
    const height = size.height;
    const aspectRatio = width / height;

    let newWidth;
    let newHeight;

    const imageRatio = image.width / image.height;

    if (aspectRatio >= imageRatio) {
      newWidth = image.width;
      newHeight = image.width / aspectRatio;
    } else {
      newWidth = image.height * aspectRatio;
      newHeight = image.height;
    }

    let x = 0;
    let y = 0;
    if (clipPosition === "left-top") {
      x = 0;
      y = 0;
    } else if (clipPosition === "left-middle") {
      x = 0;
      y = (image.height - newHeight) / 2;
    } else if (clipPosition === "left-bottom") {
      x = 0;
      y = image.height - newHeight;
    } else if (clipPosition === "center-top") {
      x = (image.width - newWidth) / 2;
      y = 0;
    } else if (clipPosition === "center-middle") {
      x = (image.width - newWidth) / 2;
      y = (image.height - newHeight) / 2;
    } else if (clipPosition === "center-bottom") {
      x = (image.width - newWidth) / 2;
      y = image.height - newHeight;
    } else if (clipPosition === "right-top") {
      x = image.width - newWidth;
      y = 0;
    } else if (clipPosition === "right-middle") {
      x = image.width - newWidth;
      y = (image.height - newHeight) / 2;
    } else if (clipPosition === "right-bottom") {
      x = image.width - newWidth;
      y = image.height - newHeight;
    } else if (clipPosition === "scale") {
      x = 0;
      y = 0;
      newWidth = width;
      newHeight = height;
    } else {
      console.error(
        new Error("Unknown clip position property - " + clipPosition)
      );
    }

    return {
      cropX: x,
      cropY: y,
      cropWidth: newWidth,
      cropHeight: newHeight,
    };
  }

  // function to apply crop
  applyCrop(name: string, pos: string | undefined) {
    const img = this.editorLayer.findOne(`.${name}`);
    img.setAttr("lastCropUsed", pos);
    const crop = this.getCrop(
      img.image(),
      { width: img.width(), height: img.height() },
      pos
    );
    img.setAttrs(crop);
  }

  destroy() {
    this.editor.destroy();
    this.capture.destroy();
    this.preview.destroy();

    for (const id of ["ou-editor", "ou-snapshot", "ou-preview"]) {
      const element = document.getElementById(id);
      if (element) {
        element.parentNode.removeChild(element);
      }
    }
  }

  // here is how the function works
  // different fontFamily may have different width of symbols
  // when font is not loaded a browser will use startard font as a fallback
  // probably Arial
  // when font is loaded measureText will return another width
  // whenFontIsLoaded(callback, attemptCount) {
  //   if (attemptCount === undefined) {
  //     attemptCount = 0;
  //   }
  //   if (attemptCount >= 20) {
  //     callback();
  //     return;
  //   }
  //   if (this.isFontLoaded) {
  //     callback();
  //     return;
  //   }
  //   const metrics = this.ctx.measureText(TEXT_TEXT);
  //   const width = metrics.width;
  //   if (width !== initialWidth) {
  //     this.isFontLoaded = true;
  //     callback();
  //   } else {
  //     setTimeout(function () {
  //       whenFontIsLoaded(callback, attemptCount + 1);
  //     }, 1000);
  //   }
  // }
}

export default Mockup;

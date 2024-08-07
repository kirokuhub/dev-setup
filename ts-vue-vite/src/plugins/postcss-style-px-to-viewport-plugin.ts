interface IdefaultsProp {
  unitToConvert: string;
  viewportWidth: number;
  unitPrecision: number;
  viewportUnit: string;
  fontViewportUnit: string;
  minPixelValue: number;
}

const defaultsProp: IdefaultsProp = {
  unitToConvert: "px",
  viewportWidth: 375,
  unitPrecision: 5,
  viewportUnit: "vw",
  fontViewportUnit: "vw",
  minPixelValue: 1,
};

function toFixed(number: number, precision: number) {
  const multiplier = 10 ** (precision + 1);
  const wholeNumber = Math.floor(number * multiplier);
  return (Math.round(wholeNumber / 10) * 10) / multiplier;
}

function createPxReplace(
  viewportSize: number,
  minPixelValue: number,
  unitPrecision: number,
  viewportUnit: any,
) {
  return function ($0: any, $1: any) {
    if (!$1) return;
    const pixels = Number.parseFloat($1);
    if (pixels <= minPixelValue) return;
    return toFixed((pixels / viewportSize) * 100, unitPrecision) + viewportUnit;
  };
}
const templateReg: RegExp = /([\s\S]+)/g;
const pxGlobalReg: RegExp = /(\d+)px/gi;

function postcssStylePxToViewportPlugin(
  customOptions: IdefaultsProp = defaultsProp,
) {
  return {
    name: "postcss-style-px-to-viewport-plugin",
    transform(code: any, id: any) {
      customOptions = Object.assign(defaultsProp, customOptions);
      if (/.vue$/.test(id)) {
        let _source = "";
        if (templateReg.test(code)) {
          _source = code.match(templateReg)[0];
        }
        if (pxGlobalReg.test(_source)) {
          const $_source = _source.replace(
            pxGlobalReg,
            createPxReplace(
              customOptions.viewportWidth,
              customOptions.minPixelValue,
              customOptions.unitPrecision,
              customOptions.viewportUnit,
            ),
          );

          code = code.replace(_source, $_source);
        }
      }
      return { code };
    },
  };
}
export default postcssStylePxToViewportPlugin;

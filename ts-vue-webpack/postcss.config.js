module.exports = () => {
    return {
        plugins: {
            autoprefixer: {},
            "postcss-px-to-viewport": {
                unitToConvert: "px",
                viewportWidth: 375,
                unitPrecision: 5,
                propList: ["*"],
                viewportUnit: "vw",
                fontViewportUnit: "vw",
                selectorBlackList: [".ignore", ".hairlines", ".ig-"],
                minPixelValue: 1,
                mediaQuery: false,
                replace: true,
                include: undefined,
                landscape: false,
                landscapeUnit: "vw",
                landscapeWidth: 568,
            }
        }
    };
};
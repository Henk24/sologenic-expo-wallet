const images = {
  fullLogo: require("../assets/images/fullLogo.png"),
  face: require("../assets/images/icons/face.png"),
  faceRed: require("../assets/images/icons/faceRed.png"),
  faceGreen: require("../assets/images/icons/faceGreen.png"),
  fingerPrint: require("../assets/images/icons/fingerPrint.png"),
  fingerPrintGreen: require("../assets/images/icons/fingerPrintGreen.png"),
  fingerPrintRed: require("../assets/images/icons/fingerPrintRed.png"),
  smallErrIcon: require("../assets/images/icons/smallErrIcon.png"),
  smallSuccessIcon: require("../assets/images/icons/smallSuccessIcon.png"),
  help: require("../assets/images/icons/help.png"),
  solo: require("../assets/images/icons/solo.png"),
  xrp: require("../assets/images/icons/xrp.png"),
  soloSmall: require("../assets/images/icons/solo_small.png"),
  xrpSmall: require("../assets/images/icons/xrp_small.png"),
  tokenizedAsset: require("../assets/images/icons/tokenized_asset.png"),
};

export default images;
export const imagesArray = Object.keys(images).map(k => images[k]);

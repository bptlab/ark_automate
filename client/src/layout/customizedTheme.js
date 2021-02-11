const corporateDesign = require('./corporateDesign');

const customizedTheme = {
  // general
  '@primary-color': corporateDesign.colorPrimary,
  '@link-color': corporateDesign.colorBackgroundCta,
  '@success-color': corporateDesign.colorBackgroundCta,
  '@warning-color': corporateDesign.colorBackgroundCta,
  '@error-color': corporateDesign.colorBackgroundCta,
  '@body-background': corporateDesign.colorBackground,
  '@layout-body-background': corporateDesign.colorBackground,
  '@border-radius-base': '5px',
  // text
  '@heading-color': corporateDesign.colorBackgroundText,
  '@text-color': corporateDesign.colorBackgroundText,
  '@text-color-dark': corporateDesign.colorPrimaryInvertedText,
  // button
  '@btn-primary-bg': corporateDesign.colorBackgroundCta,
  // sider
  '@layout-sider-background': corporateDesign.colorPrimaryInverted2,
  // component
  '@component-background': corporateDesign.colorBackground2,
  // footer
  '@layout-footer-background': corporateDesign.colorPrimaryInverted,
  // dropdown
  '@dropdown-menu-bg': corporateDesign.colorPrimaryInverted2,
  '@select-item-selected-color': corporateDesign.colorBackgroundText,
  // header
  '@layout-header-background': corporateDesign.colorPrimaryInverted,
  // fonts
  '@font-family': 'Lato, sans-serif',
};

module.exports = customizedTheme;

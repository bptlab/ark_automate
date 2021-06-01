const corporateDesign = require('./corporateDesign');

const customizedTheme = {
  '@primary-color': corporateDesign.colorPrimary,
  '@link-color': corporateDesign.colorBackgroundCta,
  '@success-color': corporateDesign.colorBackgroundCta,
  '@warning-color': corporateDesign.colorBackgroundCta,
  '@error-color': corporateDesign.colorBackgroundCta,
  '@body-background': corporateDesign.colorBackground,
  '@layout-body-background': corporateDesign.colorBackground,
  '@border-radius-base': '5px',
  '@label-color': corporateDesign.colorPrimaryInvertedText,
  '@heading-color': corporateDesign.colorBackgroundText,
  '@text-color': corporateDesign.colorBackgroundText,
  '@text-color-dark': corporateDesign.colorPrimaryInvertedText,
  '@btn-primary-bg': corporateDesign.colorBackgroundCta,
  '@input-color': corporateDesign.colorBackgroundText,
  '@layout-sider-background': corporateDesign.colorPrimaryInverted2,
  '@component-background': corporateDesign.colorBackground2,
  '@layout-footer-background': corporateDesign.colorPrimaryInverted,
  '@dropdown-menu-bg': corporateDesign.colorPrimaryInverted2,
  '@select-item-selected-color': corporateDesign.colorBackgroundText,
  '@layout-header-background': corporateDesign.colorPrimaryInverted,
  '@font-family': 'Lato, sans-serif',
};

module.exports = customizedTheme;

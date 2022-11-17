{{> cards/card_component componentName='articlescards' }}

class articlescardsCardComponent extends BaseCard['articlescards'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *

Short description
shortDescription

Visible On Add

Move To

   * @param profile profile of the entity in the card
   */
  dataForRender(profile) {
    let detailsData = '';
    if (profile?.d_highlightedFields?.s_snippet) {
      const { value, matchedSubstrings } = profile.d_highlightedFields.s_snippet;
      detailsData = Formatter.highlightField(value, matchedSubstrings);
    } else if (profile.s_snippet) {
      detailsData = profile.s_snippet;
    }


    return {
      title: profile.name, // The header text of the card
      url: profile.website || profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: '_top', // If the title's URL should open in a new tab, etc.
      // image: '', // The URL of the image to display on the card
      // altText: '', // The alternate text for the image
      titleEventOptions: this.addDefaultEventOptions(),
      subtitle: profile.datePosted ? `Last Updated on ${profile.datePosted}` : '', // The sub-header text of the card
      details: profile.shortDescription, // The text in the body of the card
      // The primary CTA of the card
      CTA1: {
        label: 'continue Reading', // The CTA's label
        iconName: 'chevron', // The icon to use for the CTA
        url:'/#', // The URL a user will be directed to when clicking
        target: '_top', // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '', // Accessible text providing a descriptive label for the CTA
      },
      // The secondary CTA of the card
      CTA2: {
        label: profile.c_secondaryCTA ? profile.c_secondaryCTA.label : null,
        iconName: 'chevron',
        url: Formatter.generateCTAFieldTypeLink(profile.c_secondaryCTA),
        target: '_top',
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '',
      },
      feedback: false, // Shows thumbs up/down buttons to provide feedback on the result card
      feedbackTextOnSubmission: 'Thanks!', // Text to display after a thumbs up/down is clicked
      positiveFeedbackSrText: 'This answered my question', // Screen reader only text for thumbs-up
      negativeFeedbackSrText: 'This did not answer my question' // Screen reader only text for thumbs-down
    };
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/articlescards';
  }
}

ANSWERS.registerTemplate(
  'cards/articlescards',
  {{{stringifyPartial (read 'cards/articlescards/template') }}}
);
ANSWERS.registerComponentType(articlescardsCardComponent);
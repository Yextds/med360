{{> cards/card_component componentName='doctorcard' }}

class doctorcardCardComponent extends BaseCard['doctorcard'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param profile profile of the entity in the card
   */


  dataForRender(profile) {
    const linkTarget = AnswersExperience.runtimeConfig.get('linkTarget') || '_top';

    return {
      title: `${profile.name}`, // The header text of the card
       subtitle: profile.specialities, // The sub-header text of the card
      url: profile.website || profile.landingPageUrl, // If the card title is a clickable link, set URL here
      target: linkTarget, // If the title's URL should open in a new tab, etc.
      titleEventOptions: profile.specialities ,
      details: 'When:-' + profile.c_when, // The text in the body of the card
       listTitle: 'Position:-' + profile.c_position, // Heading of the bulleted list
       listItems: [], // Content of the bulleted list
      //phoneurl: Formatter.phoneLink(profile),
      phone: Formatter.phoneLink(profile),
      //phone: Formatter.nationalizedPhoneDisplay(profile), // The phone number for the card
      phoneEventOptions: this.addDefaultEventOptions(), 
      image: Formatter.image(profile.primaryPhoto).url, // The URL of the image to display on the card
      altText: "doctors", // The alternate text for the image

      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      showMoreDetails: {
        showMoreLimit: 500, // Character count limit
        showMoreText: 'Show more', // Label when toggle will show truncated text
        showLessText: 'Show less' // Label when toggle will hide truncated text
      },
      // The primary CTA of the card
      CTA1: {
        label: profile.c_primaryCTA ? profile.c_primaryCTA.label : null, // The CTA's label
        iconName: 'chevron', // The icon to use for the CTA
        url: '/#', // The URL a user will be directed to when clicking
        target: linkTarget, // Where the new URL will be opened
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: '', // Accessible text providing a descriptive label for the CTA
      },
      // The secondary CTA of the card
      CTA2: {
        label: Formatter.nationalizedPhoneDisplay(profile),
        iconName: 'phone',
        url: Formatter.phoneLink(profile),
        target: linkTarget,
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions(),
        // ariaLabel: ''
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
    return 'cards/doctorcard';
  }
}

ANSWERS.registerTemplate(
  'cards/doctorcard',
  {{{stringifyPartial (read 'cards/doctorcard/template') }}}
);
ANSWERS.registerComponentType(doctorcardCardComponent);

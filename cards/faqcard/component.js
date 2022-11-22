{{> cards/card_component componentName='faqcard' }}

class faqcardCardComponent extends BaseCard['faqcard'] {
  constructor(config = {}, systemConfig = {}) {
    super(config, systemConfig);
  }

  /**
   * This returns an object that will be called `card`
   * in the template. Put all mapping logic here.
   *
   * @param {Object} profile of the entity in the card
   */
  dataForRender(profile) {
    const linkTarget = AnswersExperience.runtimeConfig.get('linkTarget') || '_top';

    return {
      title: profile.question || profile.name, // The header text of the card
      // subtitle: 'THis is subtitle', // The sub-header text of the card
      // newSlug : profile.slug,
      details: profile.answer ? ANSWERS.formatRichText(profile.answer, "answer", linkTarget) : null, // The text in the body of the card
      // If the card's details are longer than a certain character count, you can truncate the
      // text. A toggle will be supplied that can show or hide the truncated text.
      // showMoreDetails: {
      //   truncatedDetails: profile.answer ? ANSWERS.formatRichText(profile.answer, "answer", linkTarget, 500) : null, // The truncated rich text
      //   showMoreText: '', // Label when toggle will show truncated text
      //   showLessText: '' // Label when toggle will hide truncated text
      // },
      isExpanded: false, // Whether the accordion is expanded on page load
      // The primary CTA of the card
      CTA1: {
        label: "Read More", // The CTA's label
        // iconame: '', // The icon to use for the CTA
        url: Formatter.generateCTAFieldTypeLink(profile.slug), // The URL a user will be directed to when clicking
        target: linkTarget, // Where the new URL will be opened. To open in a new tab use '_blank'
        eventType: 'CTA_CLICK', // Type of Analytics event fired when clicking the CTA
        // Event options for the analytics event fired when this CTA is clicked.
        eventOptions: this.addDefaultEventOptions({ /* Add additional options here */ }),
        // ariaLabel: '', // Accessible text providing a descriptive label for the CTA
      },
      // The secondary CTA of the card
      CTA2: {
        label: "Read More",
        iconName: 'light_bulb',
        url: profile.slug,
        target: linkTarget,
        eventType: 'CTA_CLICK',
        eventOptions: this.addDefaultEventOptions({ /* Add additional options here */ }),
        // ariaLabel: '',
      },
      feedback: false, // Shows thumbs up/down buttons to provide feedback on the result card
      feedbackTextOnSubmission: 'Thanks!', // Text to display after a thumbs up/down is clicked
      positiveFeedbackSrText: 'This answered my question', // Screen reader only text for thumbs-up
      negativeFeedbackSrText: 'This did not answer my question' // Screen reader only text for thumbs-down
    };
  }

 onMount() {
    const self = this;
    const accordionToggleSelector = '.js-HitchhikerFaqAccordion-toggle';
    const accordionContentSelector = '.js-HitchhikerFaqAccordion-content';
    const accordionExpandedClass = 'HitchhikerFaqAccordion--expanded';
    const accordionCardSelector = '.js-HitchhikerFaqAccordion';

    const accordionToggleEl = self._container.querySelector(accordionToggleSelector);
    if (!accordionToggleEl) {
      return;
    }

    const contentEl = this._container.querySelector(accordionContentSelector);
    let isExpanded = this._container.querySelector(`.${accordionExpandedClass}`);

    const cardEl = this._container.querySelector(accordionCardSelector);
    const linkEls = contentEl.querySelectorAll('a');

    if (this.stayExpanded) {
      isExpanded = true;
      cardEl.classList.add(accordionExpandedClass);
      accordionToggleEl.setAttribute('aria-expanded', 'true');
      contentEl.setAttribute('aria-hidden', 'false');
    }
    contentEl.style.height = `${isExpanded ? contentEl.scrollHeight : 0}px`;
    this._setLinksInteractivity(linkEls, isExpanded);

    this.stayExpanded = false;

    const thumbSelectorEls = this._container.querySelectorAll('.js-HitchhikerCard-thumbInput');
    if (thumbSelectorEls) {
      thumbSelectorEls.forEach(el => {
        el.addEventListener('click', (e) => {
          this.stayExpanded = true;
        });
      });
    }

    accordionToggleEl.addEventListener('click', function(tt) { 

      // alert("Clicked");
     // console.log(isExpanded,"isExpanded1");
      // var customIsExpanded = isExpanded;
      isExpanded = !isExpanded;
      

      
      
     // console.log(isExpanded,"isExpanded2");

     
    let parent = this.parentNode;
		if(parent.classList.contains(accordionExpandedClass)){
        // cardEl.classList.remove(accordionExpandedClass);
        isExpanded =  false;
        console.log('true');
    }else{
        // cardEl.classList.add(accordionExpandedClass);
        document.querySelectorAll(".js-HitchhikerFaqAccordion-toggle").forEach(function(tg) {  
            // tg.style.height = `0px`;
            tg.setAttribute('aria-expanded', 'false');        
      });

      document.querySelectorAll(".js-HitchhikerFaqAccordion-content").forEach(function(ac) {             
            ac.style.height = `0px`;
            ac.setAttribute('aria-hidden', 'true');      
      }); 

      document.querySelectorAll(".js-HitchhikerFaqAccordion").forEach(function(a) { 
            a.classList.remove("HitchhikerFaqAccordion--expanded");   
      }); 

        isExpanded = true;
        console.log('false');
    }

      // console.log(isExpanded,"isExpanded3");      
      cardEl.classList.toggle(accordionExpandedClass, isExpanded);
      
      this.setAttribute('aria-expanded', isExpanded ? 'true' : 'false');
      contentEl.style.height = `${isExpanded ? contentEl.scrollHeight : 0}px`;
      contentEl.setAttribute('aria-hidden', isExpanded ? 'false' : 'true');
      self._setLinksInteractivity(linkEls, isExpanded);

      if (self.analyticsReporter) {
        const event = new ANSWERS.AnalyticsEvent(isExpanded ? 'ROW_EXPAND' : 'ROW_COLLAPSE')
        .addOptions({
          verticalKey: self.verticalKey,
          entityId: self.result._raw.id,
          searcher: self._config.isUniversal ? 'UNIVERSAL' : 'VERTICAL'
        });
        self.analyticsReporter.report(event);
      }
    });

    const showExcessDetailsToggleEls = this._container.querySelectorAll('.js-HitchhikerFaqAccordion-detailsToggle');
    const excessDetailsEls = this._container.querySelectorAll('.js-HitchhikerFaqAccordion-detailsText');
    if (showExcessDetailsToggleEls && excessDetailsEls) {
      showExcessDetailsToggleEls.forEach(el =>
        el.addEventListener('click', () => {
          contentEl.style.height = 'auto';
          showExcessDetailsToggleEls.forEach(toggleEl => toggleEl.classList.toggle('js-hidden'));
          excessDetailsEls.forEach(detailsEl => detailsEl.classList.toggle('js-hidden'));
          contentEl.style.height = `${contentEl.scrollHeight}px`;
        })
      );
    }

    super.onMount();
  }

  /**
   * Sets the interactivity of the link elements in a WCAG-compliant way based on
   * whether the link is visible
   *
   * @param {Array<Element>} linkEls
   * @param {boolean} isVisible
   */
  _setLinksInteractivity(linkEls, isVisible) {
    for (const linkEl of linkEls) {
      linkEl.setAttribute('aria-hidden', isVisible ? 'false' : 'true');
      linkEl.setAttribute('tabindex', isVisible ? '0' : '-1');
    }
  }

  /**
   * The template to render
   * @returns {string}
   * @override
   */
  static defaultTemplateName (config) {
    return 'cards/faqcard';
  }
}

ANSWERS.registerTemplate(
  'cards/faqcard',
  {{{stringifyPartial (read 'cards/faqcard/template') }}}
);
ANSWERS.registerComponentType(faqcardCardComponent);

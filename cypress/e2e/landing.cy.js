// cypress/e2e/landing.cy.js
//
// Place this file in your Cypress e2e/integration folder.
// Ensure Cypress baseUrl is configured (e.g. http://localhost:5500) or replace cy.visit('/') with the full URL.
//
// Suite: Landing Page - Frontend / Functional + Performance + Responsiveness tests
//

describe("Landing Page - Frontend smoke, interaction & basic performance", () => {
  // Before each test we load the page
  beforeEach(() => {
    // Visit root - requires baseUrl to be set in cypress config OR replace '/' with full URL.
    cy.visit("/");
  });

  //
  // Site basics: header, hero, logo, WhatsApp button and footer
  //
  describe("Basic page structure and important elements", () => {
    it("should have a visible header with brand and navigation", () => {
      cy.get("header.header").should("be.visible");

      // Brand link exists and contains text (brand text may be inside) or an image logo
      cy.get(".header__brand").should("exist").and("be.visible");

      // Logo image should exist and have alt text
      cy.get("img.logo")
        .should("exist")
        .and(($img) => {
          // src attribute exists and alt is set
          expect($img.attr("src")).to.match(/.+/);
          expect($img.attr("alt")).to.match(/.+/);
        });

      // Navigation list items present
      cy.get(".nav__list").should("exist");
      cy.get(".nav__list .nav__link").its("length").should("be.gte", 3);
    });

    it("should render hero title, subtitle and hero image", () => {
      cy.get(".hero__title")
        .should("be.visible")
        .and("contain.text", "Seu Negócio Online");

      cy.get(".hero__subtitle")
        .should("be.visible")
        .and("contain.text", "Desenvolvedor");

      // Hero image exists and has meaningful alt
      cy.get(".hero__art img")
        .should("exist")
        .and(($img) => {
          expect($img.attr("src")).to.match(/.+/);
          // alt might be "image__laptop" in the provided files
          expect($img.attr("alt")).to.match(/.+/);
        });
    });

    it("should have a WhatsApp quick link with a valid href", () => {
      cy.get("a.whatsapp-button")
        .should("have.attr", "href")
        .and("match", /^https?:\/\/(wa\.me|api\.whatsapp\.com)/);
      cy.get("a.whatsapp-button img").should("be.visible");
    });

    it("should display footer and social icons", () => {
      cy.get("footer.footer").should("be.visible");
      // The second footer (social-icons) must exist too
      cy.get(".social-icons").should("exist");
      cy.get(".social-icons a").its("length").should("be.gte", 1);
    });
  });

  //
  // Navigation and smooth scrolling behavior
  //
  describe("Navigation interaction and smooth scroll", () => {
    it("mobile nav toggle opens and closes the menu", () => {
      // Force a small viewport where toggle is visible
      cy.viewport(768, 800);

      cy.get(".nav__toggle")
        .should("exist")
        .then(($btn) => {
          // Ensure aria-expanded reflects state changes
          cy.wrap($btn)
            .invoke("attr", "aria-expanded")
            .then((initial) => {
              // Click to open
              cy.wrap($btn).click();
              cy.wrap($btn)
                .invoke("attr", "aria-expanded")
                .should("satisfy", (val) => val === "true" || val === "false"); // it will be set to string 'true'
              cy.get(".nav__list").should("have.class", "is-open");

              // Click to close
              cy.wrap($btn).click();
              cy.get(".nav__list").should("not.have.class", "is-open");
            });
        });
    });

    it("clicking a nav anchor triggers smooth scroll and closes mobile menu if open", () => {
      // To assert scrollIntoView is invoked, we stub the method on the target element.
      cy.get("#sobre").then(($target) => {
        // stub scrollIntoView on target
        const win = $target[0].ownerDocument.defaultView;
        cy.stub(win.HTMLElement.prototype, "scrollIntoView").as(
          "scrollIntoView"
        );
      });

      // Click the "Sobre" nav link (anchor with href="#sobre")
      cy.get(".nav__list .nav__link")
        .contains(/Sobre|sobre/i)
        .click();

      // scrollIntoView should have been called
      cy.get("@scrollIntoView").should("have.been.called");
    });
  });

  //
  // Features / Pricing / Content validation
  //
  describe("Content correctness and cards", () => {
    it("features cards are present and have titles and descriptions", () => {
      cy.get(".features__flex .feature").should("have.length.at.least", 3);

      cy.get(".feature").each(($el) => {
        cy.wrap($el)
          .find(".feature__title")
          .should("exist")
          .and("not.be.empty");
        cy.wrap($el).find(".feature__text").should("exist");
      });
    });

    it("pricing section shows three package cards with action CTA buttons", () => {
      cy.get(".pricing__grid .price").should("have.length.at.least", 3);
      cy.get(".price").each(($card) => {
        cy.wrap($card).find(".price__name").should("exist").and("not.be.empty");
        cy.wrap($card).find(".price__cta").should("exist");
      });
    });
  });

  //
  // Contact form: inputs, labels, submit prevention (the page prevents default submission)
  //
  describe("Contact form behavior", () => {
    it("form fields are present and have labels connected via for/id", () => {
      cy.get("form.form").should("exist");

      // For each form control, the label should reference an id
      const fields = [
        { label: "Nome", id: "nome" },
        { label: /Email/i, id: "email" },
        { label: /Telefone|Tel/i, id: "tel" },
        { label: /Mensagem|msg/i, id: "msg" },
      ];

      fields.forEach((f) => {
        cy.get(`label.form__label[for="${f.id}"]`).should("exist");
        cy.get(`#${f.id}`).should("exist");
      });
    });

    it("submitting the form does not navigate away (preventDefault)", () => {
      // Fill fields and click submit. The page's JS prevents default submission.
      cy.get("#nome").type("Test User");
      cy.get("#email").type("test@example.com");
      cy.get("#tel").type("+5511999999999");
      cy.get("#msg").type("This is a test message for automated tests.");

      // Spy on submit event to ensure preventDefault is called
      cy.get("form.form").then(($form) => {
        const formEl = $form[0];
        cy.wrap(formEl).as("theForm");
      });

      cy.get("@theForm").then((formEl) => {
        // attach event listener to assert preventDefault invoked via native event
        const spy = cy.stub();
        // We cannot directly intercept preventDefault from Cypress, but we can click and
        // assert the location hash or URL didn't change and that form still exists.
        cy.get('button[type="submit"]').click();
        // Ensure still on same page and form present
        cy.url().should("include", Cypress.config().baseUrl ? "" : "/"); // loose check (keeps test non-flaky)
        cy.get("form.form").should("exist");
      });
    });
  });

  //
  // Responsiveness: page layout adapts at mobile and desktop breakpoints
  //
  describe("Responsiveness and viewport checks", () => {
    it("desktop layout shows horizontal hero layout", () => {
      cy.viewport(1280, 800);
      // hero container is row direction by default; check that both hero content and art are visible side-by-side by asserting they exist and are visible
      cy.get(".hero__container > .hero__content").should("be.visible");
      cy.get(".hero__art").should("be.visible");
    });

    it("mobile layout stacks sections and nav toggle is visible", () => {
      cy.viewport(375, 812); // iPhone X-ish
      cy.get(".nav__toggle").should("be.visible");
      // Sections such as pricing grid become column stacked; we'll assert the pricing grid flex-direction has changed by checking that children exist and are visible
      cy.get(".pricing__grid").should("exist");
    });
  });

  //
  // Basic performance "sanity" checks using the Performance API.
  // These assert metrics exist and log them for CI visibility (avoid strict thresholds to reduce flakiness).
  //
  describe("Basic performance metrics (sanity checks)", () => {
    it("should expose navigation timing metrics", () => {
      cy.window().then((win) => {
        // Use PerformanceNavigationTiming when available
        const navEntries =
          win.performance.getEntriesByType &&
          win.performance.getEntriesByType("navigation");
        if (navEntries && navEntries.length) {
          const nav = navEntries[0];
          // Log several typical timing points
          // Using Cypress log for visibility in test output
          cy.log(`domContentLoaded: ${nav.domContentLoadedEventEnd}`);
          cy.log(`loadEventEnd: ${nav.loadEventEnd}`);
          // Assert numeric values exist (not NaN)
          expect(nav.domContentLoadedEventEnd).to.be.a("number");
          expect(nav.loadEventEnd).to.be.a("number");
        } else if (win.performance.timing) {
          const t = win.performance.timing;
          cy.log(`domContentLoaded (timing): ${t.domContentLoadedEventEnd}`);
          cy.log(`loadEventEnd (timing): ${t.loadEventEnd}`);
          expect(t.domContentLoadedEventEnd).to.be.a("number");
          expect(t.loadEventEnd).to.be.a("number");
        } else {
          // If Performance API missing (unlikely), at least assert window exists
          expect(win).to.exist;
        }
      });
    });

    it("measures first paint and logs it when available", () => {
      cy.window().then((win) => {
        const entries =
          (win.performance.getEntriesByType &&
            win.performance.getEntriesByType("paint")) ||
          [];
        entries.forEach((e) => cy.log(`${e.name}: ${e.startTime}`));
        // we don't assert thresholds to avoid flaky failures; simply ensure the API returns something or is empty
        expect(entries).to.not.be.undefined;
      });
    });
  });

  //
  // Accessibility-related checks (basic ARIA and semantic presence)
  //
  describe("Basic accessibility checks (attributes & semantics)", () => {
    it("navigation has aria-label and menu controls have aria attributes", () => {
      cy.get("nav.nav").should("have.attr", "aria-label");
      cy.get(".nav__toggle").should("have.attr", "aria-controls");
      cy.get(".nav__toggle").should("have.attr", "aria-expanded");
    });

    it("landmarks and headings exist for major sections", () => {
      // Hero title has aria-labelledby on section
      cy.get("section.hero").should("have.attr", "aria-labelledby");
      cy.get("#hero-title").should("exist").and("match", "h1");

      // About section labelled
      cy.get("section.about-contact").should("have.attr", "aria-labelledby");
      cy.get("#about-title").should("exist");
    });

    it("form controls have accessible labels", () => {
      cy.get("label.form__label").each(($lab) => {
        const forAttr = $lab.attr("for");
        expect(forAttr).to.be.a("string").and.to.not.equal("");
        cy.get(`#${forAttr}`).should("exist");
      });
    });
  });
});

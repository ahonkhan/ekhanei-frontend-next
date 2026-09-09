export interface PolicySection {
  index: string;
  title: string;
  content: string[];
}

export interface Policy {
  id: string;
  index: number;
  title: string;
  intro: string[];
  sections: PolicySection[];
  icon: string;
}

export const policiesData: Policy[] = [
  {
    "id": "privacy-policy",
    "index": 1,
    "title": "Privacy Policy",
    "intro": [
      "This Privacy Policy explains how EKHANEI (\"EKHANEI\", \"we\", \"us\", or \"our\"), the operator of the multivendor eCommerce marketplace accessible at https://www.ekhanei.bd and through the EKHANEI mobile application (together, the \"Platform\"), collects, uses, discloses, stores, and protects personal information of customers, vendors, delivery partners, and other users (\"you\" or \"User\") who access or use the Platform."
    ],
    "sections": [
      {
        "index": "1.1",
        "title": "Information We Collect",
        "content": [
          "We collect information that you provide directly to us and information collected automatically when you use the Platform.",
          "• Account Information: Name, mobile number, email address, delivery address, National ID or Trade",
          "License details (for vendors), password, and profile photograph.",
          "• Transaction Information: Order history, items purchased, payment method used, billing details, and",
          "delivery instructions.",
          "• Payment Information: Mobile Financial Service (MFS) account references, card tokens, or bank",
          "details processed through our licensed payment partners. EKHANEI does not store full card numbers or MFS PINs.",
          "• Device and Usage Information: IP address, device identifiers, browser type, operating system, app",
          "version, pages viewed, and interaction logs collected through cookies and similar technologies.",
          "• Location Information: Approximate or precise location, where permitted, to facilitate accurate",
          "delivery and vendor discovery.",
          "• Communications: Records of correspondence with our support team, reviews, ratings, and vendorcustomer chat messages."
        ]
      },
      {
        "index": "1.2",
        "title": "How We Use Your Information",
        "content": [
          "• To create and manage your account and process orders placed on the Platform.",
          "• To connect customers with vendors and delivery partners and facilitate fulfilment.",
          "• To process payments and prevent fraud, in cooperation with licensed payment service providers.",
          "• To communicate order updates, promotional offers, and service notices, subject to your marketing",
          "preferences.",
          "• To improve Platform performance, personalize recommendations, and conduct internal analytics.",
          "• To comply with applicable Bangladeshi laws, including tax, consumer protection, and digital",
          "commerce regulations."
        ]
      },
      {
        "index": "1.3",
        "title": "Sharing of Information",
        "content": [
          "We share information only as necessary to operate the Platform: with the relevant vendor to fulfil your order; with delivery partners to complete delivery; with payment gateways and MFS providers to process payment; with law enforcement or regulatory authorities where legally required; and with professional advisors or successors in the event of a business transfer. EKHANEI does not sell personal information to third parties."
        ]
      },
      {
        "index": "1.4",
        "title": "Data Storage and Security",
        "content": [
          "Personal data is stored on secured servers with access controls, encryption in transit, and regular security reviews. While we take reasonable technical and organizational measures consistent with industry practice, no method of transmission or storage is completely secure, and EKHANEI cannot guarantee absolute security."
        ]
      },
      {
        "index": "1.5",
        "title": "Your Rights and Choices",
        "content": [
          "You may access, correct, or request deletion of your account information by contacting our support team, subject to retention obligations described in our Data Retention Policy. You may opt out of promotional communications at any time while continuing to receive essential transactional notices."
        ]
      },
      {
        "index": "1.6",
        "title": "Children's Privacy",
        "content": [
          "The Platform is not directed to individuals under 18 years of age, and we do not knowingly collect personal information from minors without parental or guardian consent."
        ]
      },
      {
        "index": "1.7",
        "title": "Changes to This Policy",
        "content": [
          "We may update this Privacy Policy from time to time. Material changes will be notified through the Platform or by email, and the \"Last Updated\" date below will reflect the most recent revision."
        ]
      },
      {
        "index": "1.8",
        "title": "Contact",
        "content": [
          "Questions regarding this Privacy Policy may be directed to ekhanei.support@gmail.com or +8801312204962."
        ]
      }
    ],
    "icon": "shield"
  },
  {
    "id": "terms-conditions",
    "index": 2,
    "title": "Terms & Conditions",
    "intro": [
      "These Terms & Conditions (\"Terms\") constitute a legally binding agreement between you and EKHANEI governing your access to and use of the Platform. By creating an account, browsing, or placing an order on the Platform, you agree to be bound by these Terms."
    ],
    "sections": [
      {
        "index": "2.1",
        "title": "Nature of the Platform",
        "content": [
          "EKHANEI is a multi-vendor marketplace that enables independent, verified vendors across categories including Restaurant, Grocery, Pharmacy, Fashion, Gadgets, Electronics, Beauty, Home Essentials, and other approved categories to list and sell products or services to customers. EKHANEI acts as an intermediary technology platform and, except where expressly stated, is not the seller of record for vendorlisted products."
        ]
      },
      {
        "index": "2.2",
        "title": "Eligibility and Account Registration",
        "content": [
          "You must be at least 18 years old and capable of entering into a binding contract under the Contract Act, 1872 to register on the Platform. You are responsible for maintaining the confidentiality of your login credentials and for all activity conducted under your account."
        ]
      },
      {
        "index": "2.3",
        "title": "Orders and Contract Formation",
        "content": [
          "Placing an order constitutes an offer to purchase, which is accepted upon confirmation by the vendor. Product availability, pricing, and specifications are set by individual vendors and may vary. EKHANEI reserves the right to cancel any order suspected of fraud, error, or violation of these Terms."
        ]
      },
      {
        "index": "2.4",
        "title": "Pricing and Taxes",
        "content": [
          "All prices are listed in Bangladeshi Taka (BDT) and are inclusive or exclusive of applicable taxes as indicated at checkout. Vendors are responsible for the accuracy of listed prices and compliance with applicable tax obligations."
        ]
      },
      {
        "index": "2.5",
        "title": "User Conduct",
        "content": [
          "You agree not to misuse the Platform, including by submitting false information, infringing intellectual property rights, engaging in fraudulent transactions, or interfering with the Platform's security or operation, as further described in the Acceptable Use Policy."
        ]
      },
      {
        "index": "2.6",
        "title": "Vendor Listings",
        "content": [
          "Product descriptions, images, and availability are provided by vendors. EKHANEI undertakes reasonable moderation but does not independently verify every listing and is not liable for inaccuracies in vendorsupplied content."
        ]
      },
      {
        "index": "2.7",
        "title": "Intellectual Property",
        "content": [
          "All Platform software, design, trademarks, and content owned by EKHANEI are protected under applicable Bangladeshi and international intellectual property law, as further described in the Intellectual Property Policy."
        ]
      },
      {
        "index": "2.8",
        "title": "Suspension and Termination",
        "content": [
          "EKHANEI may suspend or terminate accounts that violate these Terms, as described in the Account Suspension & Termination Policy."
        ]
      },
      {
        "index": "2.9",
        "title": "Amendments",
        "content": [
          "EKHANEI may revise these Terms periodically. Continued use of the Platform after revisions take effect constitutes acceptance of the updated Terms."
        ]
      },
      {
        "index": "2.10",
        "title": "Governing Law",
        "content": [
          "These Terms are governed by the laws of the People's Republic of Bangladesh, as further detailed in the Governing Law section of this document."
        ]
      }
    ],
    "icon": "file-text"
  },
  {
    "id": "return-refund-policy",
    "index": 3,
    "title": "Return & Refund Policy",
    "intro": [
      "This Return & Refund Policy applies to eligible purchases made through the Platform, across all vendor categories, subject to category-specific conditions described below."
    ],
    "sections": [
      {
        "index": "3.1",
        "title": "General Eligibility",
        "content": [
          "Return requests must be initiated within seventy-two (72) hours of delivery for non-perishable categories (Fashion, Gadgets, Electronics, Beauty, Home Essentials), unless a longer or shorter period is specified on the product listing. Items must be unused, in original packaging, with tags and accessories intact."
        ]
      },
      {
        "index": "3.2",
        "title": "Non-Returnable Categories",
        "content": [
          "Due to the nature of the goods, the following are generally non-returnable except in cases of proven defect or incorrect delivery:",
          "• Restaurant and prepared food items, once delivered.",
          "• Grocery items that are perishable, opened, or spoiled after receipt.",
          "• Pharmacy items, including medicines and health products, in accordance with applicable",
          "pharmaceutical safety regulations.",
          "• Personal care and beauty products that have been opened or used."
        ]
      },
      {
        "index": "3.3",
        "title": "Grounds for Return",
        "content": [
          "• Item received is damaged, defective, or materially different from the listing.",
          "• Wrong item or incorrect quantity delivered.",
          "• Item is missing parts or accessories advertised at the time of purchase."
        ]
      },
      {
        "index": "3.4",
        "title": "Return Process",
        "content": [
          "Customers must submit a return request through the Platform's order history section or by contacting ekhanei.support@gmail.com with photographic evidence. The relevant vendor will review the request within a reasonable timeframe, and EKHANEI may facilitate pickup or require the customer to ship the item back, depending on vendor policy."
        ]
      },
      {
        "index": "3.5",
        "title": "Refund Method and Timeline",
        "content": [
          "Approved refunds will be issued to the original payment method or as EKHANEI wallet credit, at the customer's election where available, generally within seven (7) to fourteen (14) business days of approval, subject to the processing timelines of the relevant payment gateway or MFS provider."
        ]
      },
      {
        "index": "3.6",
        "title": "Cash on Delivery Refunds",
        "content": [
          "For orders paid via Cash on Delivery, refunds will be processed via bank transfer or Mobile Financial Service transfer to an account nominated by the customer, following verification."
        ]
      },
      {
        "index": "3.7",
        "title": "Disputed Returns",
        "content": [
          "Where a vendor disputes a return request, EKHANEI may act as a neutral intermediary and make a final determination based on the evidence submitted, in accordance with the Complaint & Dispute Resolution process."
        ]
      },
      {
        "index": "3.8",
        "title": "Vendor Obligations",
        "content": [
          "Vendors must honor legitimate return and refund requests promptly. Repeated failure to comply may result in penalties or suspension under the Vendor Agreement."
        ]
      }
    ],
    "icon": "refresh-cw"
  },
  {
    "id": "exchange-policy",
    "index": 3.5,
    "title": "Exchange Policy",
    "intro": [
      "This Exchange Policy outlines the conditions, eligibility, and procedure for exchanging products purchased through the EKHANEI Platform."
    ],
    "sections": [
      {
        "index": "3.5.1",
        "title": "Exchange Eligibility",
        "content": [
          "Customers may request an item exchange within seventy-two (72) hours of delivery for fashion, apparel, footwear, and eligible non-perishable categories.",
          "Items must be unused, unwashed, in their original condition, with all original tags, accessories, and packaging intact."
        ]
      },
      {
        "index": "3.5.2",
        "title": "Valid Reasons for Exchange",
        "content": [
          "• Size or color mismatch from the ordered specifications.",
          "• Defective, damaged, or faulty item received upon delivery.",
          "• Incorrect item sent by the vendor."
        ]
      },
      {
        "index": "3.5.3",
        "title": "Exchange Request Procedure",
        "content": [
          "To request an exchange, submit photos or videos of the item along with your order number to ekhanei.support@gmail.com or contact support via WhatsApp at +8801312204962.",
          "Once approved, our delivery team or seller will facilitate item pickup and dispatch the replacement item."
        ]
      },
      {
        "index": "3.5.4",
        "title": "Non-Exchangeable Items",
        "content": [
          "Perishable grocery, prepared restaurant food, medicines or pharmacy products, innerwear, personal hygiene products, and customized goods are strictly non-exchangeable unless received defective or expired."
        ]
      }
    ],
    "icon": "repeat"
  },
  {
    "id": "shipping-delivery-policy",
    "index": 4,
    "title": "Shipping & Delivery Policy",
    "intro": [
      "This Shipping & Delivery Policy describes how orders placed on the Platform are fulfilled and delivered across Bangladesh."
    ],
    "sections": [
      {
        "index": "4.1",
        "title": "Delivery Coverage",
        "content": [
          "EKHANEI facilitates delivery within serviceable areas displayed at checkout. Coverage may vary by vendor location, category, and delivery partner availability, and may expand or contract over time."
        ]
      },
      {
        "index": "4.2",
        "title": "Delivery Timelines",
        "content": [
          "• Restaurant and Grocery: Typically delivered within 30–90 minutes of order confirmation, depending",
          "on distance and vendor preparation time.",
          "• Pharmacy: Typically delivered within 1–3 hours, subject to prescription verification where required.",
          "• Fashion, Gadgets, Electronics, Beauty, Home Essentials: Typically delivered within 2–7 business days",
          "depending on vendor location and stock availability. Estimated delivery windows shown at checkout are indicative and not guaranteed, and may be affected by weather, traffic, regulatory restrictions, or other circumstances beyond EKHANEI's control."
        ]
      },
      {
        "index": "4.3",
        "title": "Delivery Charges",
        "content": [
          "Delivery fees are calculated based on distance, order value, category, and prevailing promotions, and are displayed transparently prior to order confirmation."
        ]
      },
      {
        "index": "4.4",
        "title": "Delivery Attempts and Failed Deliveries",
        "content": [
          "Delivery partners will make reasonable attempts to contact the customer at the address and contact number provided. If delivery cannot be completed due to an incorrect address, unavailability of the customer, or refusal to accept the order, EKHANEI reserves the right to charge applicable delivery and restocking fees and may cancel the order."
        ]
      },
      {
        "index": "4.5",
        "title": "Packaging and Handling",
        "content": [
          "Vendors are responsible for appropriately packaging items to withstand transit. EKHANEI and its delivery partners handle packages with reasonable care but are not liable for damage arising from inadequate vendor packaging."
        ]
      },
      {
        "index": "4.6",
        "title": "Order Tracking",
        "content": [
          "Customers may track order status in real time through the Platform, from order confirmation through preparation, dispatch, and delivery, where such tracking is available for the relevant category."
        ]
      },
      {
        "index": "4.7",
        "title": "Risk of Loss",
        "content": [
          "Risk of loss or damage to goods passes to the customer upon successful delivery confirmed through the Platform, including delivery to a person at the designated address who is reasonably believed to be authorized to receive it."
        ]
      },
      {
        "index": "4.8",
        "title": "Force Majeure Impact on Delivery",
        "content": [
          "Delivery timelines may be suspended or delayed due to events described in the Force Majeure section, including natural disasters, strikes, political disruptions (hartals), or governmental restrictions."
        ]
      }
    ],
    "icon": "truck"
  },
  {
    "id": "cancellation-policy",
    "index": 5,
    "title": "Cancellation Policy",
    "intro": [
      "This Cancellation Policy governs the cancellation of orders placed through the Platform by customers or vendors."
    ],
    "sections": [
      {
        "index": "5.1",
        "title": "Customer-Initiated Cancellation",
        "content": [
          "Customers may cancel an order free of charge before the vendor confirms or begins preparing/processing the order. Once an order has been confirmed and preparation, packing, or dispatch has commenced, cancellation may no longer be possible, or may be subject to a cancellation fee to cover incurred costs."
        ]
      },
      {
        "index": "5.2",
        "title": "Category-Specific Cancellation Windows",
        "content": [
          "• Restaurant orders: Cancellable only within a short window (typically 2–5 minutes) after placement,",
          "before kitchen preparation begins.",
          "• Grocery and Pharmacy orders: Cancellable before the vendor marks the order as \"packed\" or \"out for",
          "delivery.\"",
          "• Fashion, Gadgets, Electronics, Beauty, Home Essentials: Cancellable before the vendor dispatches",
          "the item for shipment."
        ]
      },
      {
        "index": "5.3",
        "title": "Vendor-Initiated Cancellation",
        "content": [
          "Vendors may cancel an order due to stock unavailability, inability to fulfil delivery, or suspected fraud. In such cases, the customer will be notified promptly and any payment already collected will be refunded in accordance with the Return & Refund Policy."
        ]
      },
      {
        "index": "5.4",
        "title": "EKHANEI-Initiated Cancellation",
        "content": [
          "EKHANEI reserves the right to cancel orders that appear fraudulent, violate these policies, involve prohibited items, or cannot be safely fulfilled, including for reasons of regulatory compliance or force majeure."
        ]
      },
      {
        "index": "5.5",
        "title": "Cancellation Fees",
        "content": [
          "Where a cancellation fee applies, it will be clearly disclosed to the customer before confirmation of the cancellation and will reflect reasonable costs already incurred, such as food preparation or restocking."
        ]
      },
      {
        "index": "5.6",
        "title": "Refunds on Cancellation",
        "content": [
          "Where payment has been made in advance and an order is validly cancelled, the applicable amount will be refunded in accordance with the timelines and methods set out in the Return & Refund Policy and Payment Policy."
        ]
      },
      {
        "index": "5.7",
        "title": "Repeated Cancellations",
        "content": [
          "EKHANEI monitors cancellation patterns to prevent misuse. Customers or vendors who cancel orders excessively or in bad faith may face account restrictions in accordance with the Account Suspension & Termination Policy."
        ]
      }
    ],
    "icon": "x-circle"
  },
  {
    "id": "payment-policy",
    "index": 6,
    "title": "Payment Policy",
    "intro": [
      "This Payment Policy describes the payment methods, processing, and security standards applicable to transactions on the Platform."
    ],
    "sections": [
      {
        "index": "6.1",
        "title": "Accepted Payment Methods",
        "content": [
          "The Platform supports the following payment methods, subject to availability by category and location:",
          "• Cash on Delivery (COD).",
          "• Mobile Financial Services (MFS), including bKash, Nagad, Rocket, and similar licensed providers.",
          "• Debit and credit cards processed through licensed payment gateway partners.",
          "• EKHANEI wallet balance, where applicable, funded through approved refunds or top-ups."
        ]
      },
      {
        "index": "6.2",
        "title": "Payment Processing",
        "content": [
          "All electronic payments are processed through PCI-DSS compliant, Bangladesh Bank-approved payment gateways and MFS providers. EKHANEI does not directly store sensitive payment credentials such as full card numbers, CVV, or MFS PINs."
        ]
      },
      {
        "index": "6.3",
        "title": "Order Confirmation",
        "content": [
          "An order is confirmed only upon successful payment authorization (for prepaid methods) or successful order placement (for Cash on Delivery). EKHANEI reserves the right to hold or reverse orders where payment verification fails."
        ]
      },
      {
        "index": "6.4",
        "title": "Vendor Payouts",
        "content": [
          "Vendors receive payouts for completed orders, net of applicable platform commission and charges, on a settlement cycle disclosed in the Vendor Agreement, typically on a weekly or bi-weekly basis, subject to reconciliation of returns, refunds, and disputes."
        ]
      },
      {
        "index": "6.5",
        "title": "Payment Failures and Duplicate Charges",
        "content": [
          "In the event of a failed transaction where funds are debited but the order is not confirmed, or a duplicate charge occurs, customers should contact ekhanei.support@gmail.com with transaction details. Verified erroneous charges will be reversed within a reasonable timeframe consistent with the relevant payment provider's process."
        ]
      },
      {
        "index": "6.6",
        "title": "Currency",
        "content": [
          "All transactions on the Platform are denominated and settled in Bangladeshi Taka (BDT)."
        ]
      },
      {
        "index": "6.7",
        "title": "Fraud Prevention",
        "content": [
          "EKHANEI employs fraud detection measures and reserves the right to request additional verification, delay processing, or decline transactions reasonably suspected of being fraudulent or unauthorized."
        ]
      },
      {
        "index": "6.8",
        "title": "Taxes and Statutory Charges",
        "content": [
          "Applicable Value Added Tax (VAT) and other statutory charges, where applicable under Bangladeshi law, are reflected in the final checkout price or itemized separately, as required."
        ]
      }
    ],
    "icon": "credit-card"
  },
  {
    "id": "vendor-agreement",
    "index": 7,
    "title": "Vendor Agreement",
    "intro": [
      "This Vendor Agreement governs the relationship between EKHANEI and any individual or business entity (\"Vendor\") that registers to sell products or services through the Platform."
    ],
    "sections": [
      {
        "index": "7.1",
        "title": "Vendor Onboarding",
        "content": [
          "Vendors must complete registration, providing accurate business information, valid Trade License (where applicable), National ID or business registration documents, bank or MFS account details for payouts, and category-specific licenses (such as pharmacy licenses for Pharmacy vendors). EKHANEI reserves the right to verify submitted documents and reject or delay onboarding of applicants who do not meet its standards."
        ]
      },
      {
        "index": "7.2",
        "title": "Independent Contractor Status",
        "content": [
          "Vendors operate as independent business entities and not as employees, agents, partners, or joint venturers of EKHANEI. Nothing in this Agreement creates an employment or partnership relationship between EKHANEI and any Vendor."
        ]
      },
      {
        "index": "7.3",
        "title": "Listing Standards",
        "content": [
          "Vendors are solely responsible for the accuracy, legality, and quality of product listings, including descriptions, images, pricing, stock availability, and compliance with applicable category regulations (for example, drug licensing for Pharmacy, food safety certification for Restaurant and Grocery vendors)."
        ]
      },
      {
        "index": "7.4",
        "title": "Commission and Fees",
        "content": [
          "EKHANEI charges a commission on completed transactions, calculated as a percentage of order value, together with applicable service or payment gateway charges, as communicated to the Vendor at onboarding and updated from time to time with reasonable notice."
        ]
      },
      {
        "index": "7.5",
        "title": "Order Fulfilment Obligations",
        "content": [
          "Vendors must accept, prepare, and hand over orders within the timeframes required by their category, maintain adequate stock accuracy, and promptly communicate delays or unavailability through the vendor dashboard."
        ]
      },
      {
        "index": "7.6",
        "title": "Quality and Compliance",
        "content": [
          "Vendors must ensure that all products comply with applicable Bangladeshi laws, including the Consumer Rights Protection Act, 2009, food safety regulations, and, where relevant, the Drugs Act and pharmacy licensing requirements. Counterfeit, unsafe, or prohibited goods are strictly forbidden, as detailed in the Prohibited Items Policy."
        ]
      },
      {
        "index": "7.7",
        "title": "Returns, Refunds, and Disputes",
        "content": [
          "Vendors must comply with the Platform's Return & Refund Policy and cooperate in good faith with the Complaint & Dispute Resolution process."
        ]
      },
      {
        "index": "7.8",
        "title": "Payouts and Settlement",
        "content": [
          "Payouts will be made to the Vendor's registered bank or MFS account on the applicable settlement cycle, net of commissions, refunds, penalties, and applicable taxes."
        ]
      },
      {
        "index": "7.9",
        "title": "Suspension and Termination",
        "content": [
          "EKHANEI may suspend or terminate a Vendor's account for breach of this Agreement, repeated customer complaints, regulatory non-compliance, or fraudulent activity, in accordance with the Account Suspension & Termination Policy."
        ]
      },
      {
        "index": "7.10",
        "title": "Indemnity",
        "content": [
          "Vendors agree to indemnify EKHANEI against claims, losses, or liabilities arising from their products, listings, or breach of applicable law."
        ]
      },
      {
        "index": "7.11",
        "title": "Term and Amendment",
        "content": [
          "This Agreement remains effective for as long as the Vendor maintains an active account and may be amended by EKHANEI with reasonable notice through the vendor dashboard or email."
        ]
      }
    ],
    "icon": "store"
  },
  {
    "id": "customer-terms",
    "index": 8,
    "title": "Customer Terms",
    "intro": [
      "These Customer Terms apply specifically to individuals who register on the Platform to browse, order, and purchase products or services as customers."
    ],
    "sections": [
      {
        "index": "8.1",
        "title": "Account Responsibilities",
        "content": [
          "Customers must provide accurate registration and delivery information and are responsible for updating their profile, address, and contact details to ensure successful order fulfilment."
        ]
      },
      {
        "index": "8.2",
        "title": "Order Accuracy",
        "content": [
          "Customers are responsible for reviewing order details, including item selection, quantity, delivery address, and payment method, before confirming checkout. EKHANEI and its vendors are not liable for delivery failures resulting from inaccurate information supplied by the customer."
        ]
      },
      {
        "index": "8.3",
        "title": "Acceptable Use",
        "content": [
          "Customers agree to use the Platform solely for legitimate personal or household purchases and not for resale, fraud, or any purpose prohibited under the Acceptable Use Policy."
        ]
      },
      {
        "index": "8.4",
        "title": "Reviews and Ratings",
        "content": [
          "Customers may submit honest reviews and ratings reflecting genuine experiences. Reviews containing defamatory, false, abusive, or unlawful content may be removed, and repeat offenders may face account restrictions."
        ]
      },
      {
        "index": "8.5",
        "title": "Promotions and Vouchers",
        "content": [
          "Discounts, vouchers, and promotional offers are subject to specific terms, validity periods, and eligibility criteria disclosed at the time of the promotion, and EKHANEI reserves the right to modify or withdraw promotions with reasonable notice."
        ]
      },
      {
        "index": "8.6",
        "title": "Wallet and Credits",
        "content": [
          "Where EKHANEI offers a wallet feature, credits are non-transferable, may not be redeemed for cash except where legally required, and remain subject to the terms disclosed within the Platform."
        ]
      },
      {
        "index": "8.7",
        "title": "Communications",
        "content": [
          "By registering, customers consent to receive transactional communications (order confirmations, delivery updates) via SMS, email, or push notification, and may opt out of promotional communications while continuing to receive essential service notices."
        ]
      },
      {
        "index": "8.8",
        "title": "Prohibited Customer Conduct",
        "content": [
          "Customers must not place fraudulent orders, abuse return/refund mechanisms, harass vendors or delivery partners, or attempt to circumvent Platform fees by transacting directly with vendors outside the Platform."
        ]
      },
      {
        "index": "8.9",
        "title": "Liability for Misuse",
        "content": [
          "Customers who breach these Customer Terms may be liable for resulting losses and may have their account suspended or terminated in accordance with the Account Suspension & Termination Policy."
        ]
      }
    ],
    "icon": "user"
  },
  {
    "id": "cookie-policy",
    "index": 9,
    "title": "Cookie Policy",
    "intro": [
      "This Cookie Policy explains how EKHANEI uses cookies and similar tracking technologies on the Platform."
    ],
    "sections": [
      {
        "index": "9.1",
        "title": "What Are Cookies",
        "content": [
          "Cookies are small text files placed on your device when you visit a website or use an application, enabling the Platform to recognize your device and remember information about your visit."
        ]
      },
      {
        "index": "9.2",
        "title": "Types of Cookies We Use",
        "content": [
          "• Essential Cookies: Necessary for core functionality such as login sessions, cart management, and",
          "checkout; the Platform cannot function properly without these.",
          "• Performance and Analytics Cookies: Help us understand how users interact with the Platform,",
          "identify popular products, and diagnose technical issues.",
          "• Functional Cookies: Remember preferences such as language, delivery address, and display settings.",
          "• Advertising and Personalization Cookies: Used to deliver relevant offers and measure the",
          "effectiveness of marketing campaigns, where enabled."
        ]
      },
      {
        "index": "9.3",
        "title": "Third-Party Cookies",
        "content": [
          "We may permit trusted third-party service providers, including analytics and advertising partners, to place cookies through the Platform, subject to their respective privacy practices."
        ]
      },
      {
        "index": "9.4",
        "title": "Mobile Application Tracking",
        "content": [
          "The EKHANEI mobile application may use device identifiers and SDK-based analytics tools that function similarly to cookies to enhance app performance and personalize content."
        ]
      },
      {
        "index": "9.5",
        "title": "Managing Cookies",
        "content": [
          "Most browsers allow you to control or delete cookies through settings. Disabling essential cookies may impair core Platform functionality, including the ability to log in or complete purchases. Where required by applicable guidance, we will present a cookie consent notice on first visit allowing you to manage nonessential cookie preferences."
        ]
      },
      {
        "index": "9.6",
        "title": "Changes to This Policy",
        "content": [
          "We may update this Cookie Policy periodically to reflect changes in technology or regulation. Continued use of the Platform after such updates constitutes acceptance of the revised policy."
        ]
      },
      {
        "index": "9.7",
        "title": "Contact",
        "content": [
          "For questions regarding cookies, contact ekhanei.support@gmail.com."
        ]
      }
    ],
    "icon": "cookie"
  },
  {
    "id": "community-guidelines",
    "index": 10,
    "title": "Community Guidelines",
    "intro": [
      "These Community Guidelines set expectations for respectful and lawful conduct among customers, vendors, delivery partners, and other participants interacting on the Platform, including through reviews, ratings, chat, and support channels."
    ],
    "sections": [
      {
        "index": "10.1",
        "title": "Core Principles",
        "content": [
          "• Treat all Platform participants — customers, vendors, delivery partners, and staff — with respect and",
          "courtesy.",
          "• Provide honest, accurate information in listings, reviews, and communications.",
          "• Resolve disagreements in good faith through the Platform's support and dispute resolution channels."
        ]
      },
      {
        "index": "10.2",
        "title": "Prohibited Behavior",
        "content": [
          "• Harassment, threats, hate speech, or discriminatory remarks directed at any user based on religion,",
          "gender, ethnicity, or other protected characteristics.",
          "• Posting false, misleading, or defamatory reviews, including fake reviews incentivized by undisclosed",
          "compensation.",
          "• Impersonating another person, vendor, or EKHANEI representative.",
          "• Sharing another user's personal information without consent (doxxing).",
          "• Soliciting off-platform transactions to avoid Platform fees or protections."
        ]
      },
      {
        "index": "10.3",
        "title": "Vendor–Customer Communication",
        "content": [
          "Direct messaging between vendors and customers, where enabled, must be limited to order-related matters. Solicitation of personal contact for off-platform dealings, spam, or unsolicited marketing through in-app chat is prohibited."
        ]
      },
      {
        "index": "10.4",
        "title": "Reporting Violations",
        "content": [
          "Users who witness or experience a violation of these Guidelines should report it through the Platform's reporting tools or by contacting ekhanei.support@gmail.com, including relevant screenshots or order references."
        ]
      },
      {
        "index": "10.5",
        "title": "Enforcement",
        "content": [
          "EKHANEI may remove content, issue warnings, restrict features, or suspend accounts that violate these Guidelines, proportionate to the severity and frequency of the violation, in accordance with the Account Suspension & Termination Policy."
        ]
      },
      {
        "index": "10.6",
        "title": "Appeals",
        "content": [
          "Users who believe an enforcement action was taken in error may submit an appeal through the Complaint & Dispute Resolution process for review."
        ]
      }
    ],
    "icon": "users"
  },
  {
    "id": "prohibited-items-policy",
    "index": 11,
    "title": "Prohibited Items Policy",
    "intro": [
      "This Prohibited Items Policy sets out categories of goods and services that may not be listed, advertised, or sold through the Platform, in any category, without exception unless otherwise expressly authorized in writing by EKHANEI."
    ],
    "sections": [
      {
        "index": "11.1",
        "title": "Absolutely Prohibited Items",
        "content": [
          "• Firearms, ammunition, explosives, and weapons of any kind, including bladed weapons intended for",
          "harm.",
          "• Narcotics, controlled substances, and drug paraphernalia prohibited under the Narcotics Control Act.",
          "• Counterfeit, replica, or pirated goods infringing third-party intellectual property rights.",
          "• Human body parts, organs, or tissue.",
          "• Endangered or protected wildlife and wildlife products, including ivory, exotic skins, and related",
          "items.",
          "• Stolen goods or items obtained unlawfully.",
          "• Obscene material, child sexual abuse material, or content violating the Pornography Control Act or",
          "the Digital Security Act.",
          "• Items promoting terrorism, extremism, or communal hatred.",
          "• Currency, financial instruments, or items facilitating money laundering or fraud."
        ]
      },
      {
        "index": "11.2",
        "title": "Restricted Items (Category Conditions Apply)",
        "content": [
          "• Pharmacy: Prescription medicines may only be listed by licensed pharmacy vendors and require valid",
          "prescription verification for dispatch, where mandated by law.",
          "• Electronics and Gadgets: Items requiring type-approval or import certification (such as certain",
          "telecommunications devices) must comply with BTRC and customs regulations.",
          "• Food and Grocery: Items must comply with BSTI standards, proper labeling, and expiry date",
          "disclosure.",
          "• Beauty and Personal Care: Products must not contain banned substances and must display",
          "ingredient and safety information as required by applicable regulation.",
          "• Second-hand goods: Must be accurately described as used, with condition disclosed clearly."
        ]
      },
      {
        "index": "11.3",
        "title": "Vendor Responsibility",
        "content": [
          "Vendors are solely responsible for ensuring listed products do not fall within prohibited or restricted categories and for holding all licenses required for restricted categories."
        ]
      },
      {
        "index": "11.4",
        "title": "Enforcement",
        "content": [
          "EKHANEI reserves the right to remove any listing, cancel related orders, withhold payouts, report unlawful listings to relevant authorities, and suspend or terminate the responsible Vendor's account, without prior notice where necessary to comply with law or prevent harm."
        ]
      },
      {
        "index": "11.5",
        "title": "Reporting",
        "content": [
          "Users who identify a prohibited or restricted listing should report it immediately via ekhanei.support@gmail.com."
        ]
      }
    ],
    "icon": "slash"
  },
  {
    "id": "intellectual-property-policy",
    "index": 12,
    "title": "Intellectual Property Policy",
    "intro": [
      "This Intellectual Property Policy describes the ownership and permitted use of intellectual property associated with the Platform."
    ],
    "sections": [
      {
        "index": "12.1",
        "title": "EKHANEI's Intellectual Property",
        "content": [
          "The EKHANEI name, logo, \"EKHANEI\" trademark, Platform design, user interface, source code, and all associated content created by EKHANEI (excluding vendor and user-submitted content) are the exclusive property of EKHANEI and are protected under the Copyright and Neighbouring Rights Act, 2023, the Trademarks Act, 2009, and applicable international treaties."
        ]
      },
      {
        "index": "12.2",
        "title": "Limited License to Users",
        "content": [
          "EKHANEI grants users a limited, non-exclusive, non-transferable, revocable license to access and use the Platform for personal, non-commercial purposes (customers) or for the purpose of listing and selling authorized products (vendors), subject to these policies. No other rights are granted by implication."
        ]
      },
      {
        "index": "12.3",
        "title": "Vendor Content License",
        "content": [
          "By uploading product images, descriptions, or other content, Vendors grant EKHANEI a non-exclusive, royalty-free, worldwide license to host, reproduce, display, and distribute such content on the Platform and in related marketing, for so long as the listing remains active or as reasonably required thereafter."
        ]
      },
      {
        "index": "12.4",
        "title": "Vendor Warranties",
        "content": [
          "Vendors represent and warrant that they hold all necessary rights, licenses, and permissions for content and trademarks used in their listings, and that such content does not infringe the intellectual property rights of any third party."
        ]
      },
      {
        "index": "12.5",
        "title": "Prohibited Use",
        "content": [
          "Users may not copy, reproduce, modify, reverse-engineer, or create derivative works from the Platform's software, design, or proprietary content, nor use the EKHANEI name or logo without prior written consent."
        ]
      },
      {
        "index": "12.6",
        "title": "Third-Party Trademarks",
        "content": [
          "Any third-party trademarks or brand names appearing on the Platform belong to their respective owners and are used solely to identify genuine products, where applicable, without implying endorsement."
        ]
      },
      {
        "index": "12.7",
        "title": "Infringement Reports",
        "content": [
          "EKHANEI respects the intellectual property rights of others and will act promptly on valid infringement notices submitted in accordance with the Copyright Policy."
        ]
      }
    ],
    "icon": "lock"
  },
  {
    "id": "copyright-policy",
    "index": 13,
    "title": "Copyright Policy",
    "intro": [
      "EKHANEI respects the intellectual property rights of others and expects all Vendors and users to do the same. This Copyright Policy explains how copyright concerns are addressed on the Platform."
    ],
    "sections": [
      {
        "index": "13.1",
        "title": "Scope",
        "content": [
          "This Policy applies to product images, descriptions, brand assets, written content, audio-visual material, and any other copyrighted work uploaded to or displayed on the Platform."
        ]
      },
      {
        "index": "13.2",
        "title": "Vendor Obligations",
        "content": [
          "Vendors must only upload content that they own, have licensed, or are otherwise authorized to use. Uploading copyrighted images, text, or media belonging to another party without permission is strictly prohibited and constitutes a material breach of the Vendor Agreement."
        ]
      },
      {
        "index": "13.3",
        "title": "Submitting a Copyright Complaint",
        "content": [
          "A rights holder who believes their copyrighted work has been used on the Platform without authorization may submit a written complaint to ekhanei.support@gmail.com including:",
          "• Identification of the copyrighted work claimed to be infringed.",
          "• Identification of the allegedly infringing material and its location (product/listing link).",
          "• Contact information of the complainant.",
          "• A statement of good-faith belief that the use is unauthorized.",
          "• A statement, under penalty of liability for misrepresentation, that the information provided is",
          "accurate."
        ]
      },
      {
        "index": "13.4",
        "title": "Review and Takedown",
        "content": [
          "Upon receipt of a valid complaint, EKHANEI will review the claim and may temporarily remove or disable access to the disputed content pending investigation, consistent with a notice-and-takedown approach."
        ]
      },
      {
        "index": "13.5",
        "title": "Counter-Notification",
        "content": [
          "A Vendor whose content is removed may submit a counter-notification demonstrating authorization or ownership. EKHANEI will review such counter-notifications in good faith and may reinstate content where the claim is not substantiated."
        ]
      },
      {
        "index": "13.6",
        "title": "Repeat Infringers",
        "content": [
          "Vendors who repeatedly infringe third-party copyright will have their accounts suspended or permanently terminated in accordance with the Account Suspension & Termination Policy."
        ]
      },
      {
        "index": "13.7",
        "title": "No Waiver",
        "content": [
          "EKHANEI's handling of a copyright complaint under this Policy does not constitute a legal determination of infringement and does not waive any party's right to pursue remedies available under the Copyright and Neighbouring Rights Act, 2023, or other applicable law."
        ]
      }
    ],
    "icon": "copyright"
  },
  {
    "id": "disclaimer",
    "index": 14,
    "title": "Disclaimer",
    "intro": [
      "The information, products, and services made available through the Platform are provided on an \"as is\" and \"as available\" basis, subject to the disclaimers set out below."
    ],
    "sections": [
      {
        "index": "14.1",
        "title": "Marketplace Role",
        "content": [
          "EKHANEI operates as an intermediary marketplace connecting customers with independent Vendors. EKHANEI does not manufacture, own, or hold inventory for most listed products (except where explicitly stated) and does not guarantee the accuracy, quality, safety, or legality of Vendor listings, though it undertakes reasonable moderation efforts."
        ]
      },
      {
        "index": "14.2",
        "title": "No Warranty",
        "content": [
          "To the fullest extent permitted by applicable law, EKHANEI disclaims all warranties, express or implied, including warranties of merchantability, fitness for a particular purpose, and non-infringement, regarding the Platform, vendor products, and delivery services."
        ]
      },
      {
        "index": "14.3",
        "title": "Product Information",
        "content": [
          "While EKHANEI encourages Vendors to provide accurate descriptions, pricing, and images, product appearance, packaging, or specifications may vary. Customers are encouraged to review listing details, including expiry dates for consumables and pharmacy items, before completing a purchase."
        ]
      },
      {
        "index": "14.4",
        "title": "Professional and Medical Advice",
        "content": [
          "Content on the Platform, including pharmacy product listings, does not constitute medical, legal, or professional advice. Customers should consult a qualified physician or pharmacist before using medicines or health-related products purchased through the Platform."
        ]
      },
      {
        "index": "14.5",
        "title": "Third-Party Links and Services",
        "content": [
          "The Platform may contain links to third-party websites, payment gateways, or services not controlled by EKHANEI. EKHANEI is not responsible for the content, accuracy, or practices of such third parties."
        ]
      },
      {
        "index": "14.6",
        "title": "Availability",
        "content": [
          "EKHANEI does not guarantee uninterrupted or error-free access to the Platform and disclaims liability for temporary unavailability due to maintenance, technical failure, or events described in the Force Majeure section."
        ]
      },
      {
        "index": "14.7",
        "title": "User Reliance",
        "content": [
          "Any reliance placed on information, listings, or reviews found on the Platform is at the user's own risk, and EKHANEI shall not be liable for decisions made in reliance on such content, except to the extent caused by EKHANEI's own gross negligence or willful default."
        ]
      }
    ],
    "icon": "alert-triangle"
  },
  {
    "id": "about-us",
    "index": 15,
    "title": "About Us",
    "intro": [],
    "sections": [
      {
        "index": "15.1",
        "title": "Who We Are",
        "content": [
          "EKHANEI is a Bangladesh-based multi-vendor eCommerce marketplace connecting customers across the country with a diverse network of independent, verified vendors. Accessible via https://www.ekhanei.bd and the EKHANEI mobile application, the Platform brings together everyday essentials and lifestyle categories under a single, trusted digital marketplace."
        ]
      },
      {
        "index": "15.2",
        "title": "Our Categories",
        "content": [
          "EKHANEI hosts vendors across Restaurant, Grocery, Pharmacy, Fashion, Gadgets, Electronics, Beauty, Home Essentials, and other approved categories, enabling customers to discover and order from local and national businesses through one convenient platform."
        ]
      },
      {
        "index": "15.3",
        "title": "Our Mission",
        "content": [
          "EKHANEI's mission is to empower local businesses with accessible digital commerce tools while offering customers a reliable, transparent, and convenient shopping experience — supporting the growth of Bangladesh's digital economy in line with the Government's \"Digital Bangladesh\" and \"Smart Bangladesh\" initiatives."
        ]
      },
      {
        "index": "15.4",
        "title": "Our Commitment",
        "content": [
          "• To Customers: Transparent pricing, verified vendors, secure payments, and responsive customer",
          "support.",
          "• To Vendors: Fair commission structures, timely payouts, and tools to reach a growing customer base",
          "across Bangladesh.",
          "• To the Community: Compliance with applicable consumer protection, data privacy, and digital",
          "commerce regulations in Bangladesh."
        ]
      },
      {
        "index": "15.5",
        "title": "Looking Ahead",
        "content": [
          "EKHANEI continues to expand its serviceable areas, vendor categories, and platform features to better serve customers and business partners throughout Bangladesh."
        ]
      }
    ],
    "icon": "info"
  },
  {
    "id": "contact-us",
    "index": 16,
    "title": "Contact Us",
    "intro": [
      "We welcome your questions, feedback, and concerns. EKHANEI's support team is available to assist customers, vendors, and delivery partners with account issues, order inquiries, complaints, and general questions regarding the Platform."
    ],
    "sections": [
      {
        "index": "16.1",
        "title": "Customer & Vendor Support",
        "content": [
          "• Support Email: ekhanei.support@gmail.com",
          "• Support Phone: +8801312204962",
          "• Website: https://www.ekhanei.bd"
        ]
      },
      {
        "index": "16.2",
        "title": "Response Times",
        "content": [
          "We aim to acknowledge support inquiries within twenty-four (24) hours and to resolve routine inquiries within three (3) to five (5) business days. Complex matters, including disputes and vendor investigations, may require additional time as described in the Complaint & Dispute Resolution section."
        ]
      },
      {
        "index": "16.3",
        "title": "Business Inquiries",
        "content": [
          "Prospective vendors, partners, and media may direct business-related inquiries to the same support email, with a subject line clearly indicating the nature of the inquiry (e.g., \"Vendor Onboarding,\" \"Partnership Inquiry,\" \"Media Request\")."
        ]
      },
      {
        "index": "16.4",
        "title": "Written Correspondence",
        "content": [
          "For matters requiring formal written notice under these policies, correspondence should be sent to ekhanei.support@gmail.com with confirmation of receipt requested, and shall be deemed effective upon EKHANEI's acknowledgment."
        ]
      }
    ],
    "icon": "mail"
  },
  {
    "id": "complaint-dispute-resolution",
    "index": 17,
    "title": "Complaint & Dispute Resolution",
    "intro": [
      "This section describes the process by which customers, vendors, and delivery partners may raise complaints and resolve disputes arising from use of the Platform."
    ],
    "sections": [
      {
        "index": "17.1",
        "title": "Filing a Complaint",
        "content": [
          "Complaints regarding orders, deliveries, payments, vendor conduct, or Platform functionality may be submitted through the in-app support/help center or by emailing ekhanei.support@gmail.com, with relevant order numbers, screenshots, and a clear description of the issue."
        ]
      },
      {
        "index": "17.2",
        "title": "Initial Review",
        "content": [
          "EKHANEI will acknowledge receipt of a complaint within twenty-four (24) hours and aim to provide an initial response or resolution within five (5) business days, depending on complexity and the need to obtain information from the relevant vendor or delivery partner."
        ]
      },
      {
        "index": "17.3",
        "title": "Escalation",
        "content": [
          "If a complaint is not resolved to the customer's or vendor's satisfaction at the first level, the matter may be escalated to EKHANEI's senior support team for further review. Escalated matters will typically be resolved within fifteen (15) business days."
        ]
      },
      {
        "index": "17.4",
        "title": "Vendor–Customer Disputes",
        "content": [
          "Where a dispute arises directly between a customer and a Vendor (for example, regarding product quality, refunds, or delivery), EKHANEI may act as a neutral facilitator, reviewing evidence submitted by both parties and issuing a resolution recommendation, which may include refunds, replacement, or account action against the responsible party."
        ]
      },
      {
        "index": "17.5",
        "title": "Alternative Dispute Resolution",
        "content": [
          "Where a dispute cannot be resolved through the Platform's internal process, the parties agree to first attempt resolution through good-faith negotiation and, where appropriate, mediation, before pursuing formal legal proceedings, consistent with the spirit of alternative dispute resolution encouraged under the Code of Civil Procedure, 1908 (including its provisions on mediation)."
        ]
      },
      {
        "index": "17.6",
        "title": "Consumer Rights",
        "content": [
          "Nothing in this Policy limits a customer's statutory right to file a complaint with the Directorate of National Consumer Rights Protection (DNCRP) under the Consumer Rights Protection Act, 2009, or with any other competent regulatory authority in Bangladesh."
        ]
      },
      {
        "index": "17.7",
        "title": "Legal Proceedings",
        "content": [
          "Where a dispute remains unresolved after good-faith efforts described above, either party may pursue legal remedies in accordance with the Governing Law section of this document."
        ]
      }
    ],
    "icon": "message-square"
  },
  {
    "id": "account-suspension-termination-policy",
    "index": 18,
    "title": "Account Suspension & Termination Policy",
    "intro": [
      "This Policy describes the circumstances under which EKHANEI may suspend or terminate a customer, vendor, or delivery partner account."
    ],
    "sections": [
      {
        "index": "18.1",
        "title": "Grounds for Suspension or Termination",
        "content": [
          "EKHANEI may suspend or terminate an account, in whole or in part, where a user:",
          "• Violates these Terms, the Acceptable Use Policy, Community Guidelines, or any other applicable",
          "policy.",
          "• Provides false, misleading, or fraudulent information during registration or transactions.",
          "• Lists or attempts to sell prohibited or restricted items.",
          "• Engages in payment fraud, chargeback abuse, or manipulation of promotions and vouchers.",
          "• Repeatedly fails to fulfil orders, mishandles customer complaints, or receives a pattern of",
          "substantiated negative feedback (for Vendors).",
          "• Harasses, threatens, or abuses other users, delivery partners, or EKHANEI staff.",
          "• Engages in conduct that exposes EKHANEI or other users to legal liability or reputational harm."
        ]
      },
      {
        "index": "18.2",
        "title": "Process",
        "content": [
          "Where practicable, EKHANEI will notify the affected user of the reason for suspension and provide an opportunity to respond or remediate, except where immediate action is necessary to prevent harm, fraud, or legal non-compliance, in which case EKHANEI may suspend the account first and notify the user promptly thereafter."
        ]
      },
      {
        "index": "18.3",
        "title": "Effect of Suspension",
        "content": [
          "During suspension, the account holder may lose access to some or all Platform features, including the ability to place or receive orders, while existing legal obligations (such as outstanding payments or pending refunds) remain in effect."
        ]
      },
      {
        "index": "18.4",
        "title": "Effect of Termination",
        "content": [
          "Upon termination, the user's right to access the Platform ceases. Vendors will receive any outstanding, undisputed payouts after deduction of applicable fees, penalties, and reserved amounts for pending returns or disputes, in accordance with the Vendor Agreement."
        ]
      },
      {
        "index": "18.5",
        "title": "Voluntary Account Closure",
        "content": [
          "Users may request closure of their own account at any time by contacting ekhanei.support@gmail.com, subject to settlement of any outstanding orders, payments, or disputes."
        ]
      },
      {
        "index": "18.6",
        "title": "Appeal",
        "content": [
          "A user whose account has been suspended or terminated may submit an appeal to ekhanei.support@gmail.com within fifteen (15) days, providing relevant explanation or evidence, which EKHANEI will review in good faith."
        ]
      },
      {
        "index": "18.7",
        "title": "Data Following Termination",
        "content": [
          "Personal data associated with a terminated account will be retained or deleted in accordance with the Data Retention Policy."
        ]
      }
    ],
    "icon": "user-x"
  },
  {
    "id": "data-retention-policy",
    "index": 19,
    "title": "Data Retention Policy",
    "intro": [
      "This Data Retention Policy explains how long EKHANEI retains personal and transactional data collected through the Platform."
    ],
    "sections": [
      {
        "index": "19.1",
        "title": "General Principle",
        "content": [
          "EKHANEI retains personal data only for as long as necessary to fulfil the purposes for which it was collected, to comply with legal and regulatory obligations, to resolve disputes, and to enforce our agreements."
        ]
      },
      {
        "index": "19.2",
        "title": "Retention Periods",
        "content": [
          "• Active Account Data: Retained for as long as the account remains active and in use.",
          "• Order and Transaction Records: Retained for a minimum of six (6) years to comply with tax,",
          "accounting, and audit obligations under applicable Bangladeshi law.",
          "• Payment Records: Retained in accordance with the requirements of Bangladesh Bank and applicable",
          "payment gateway/MFS provider regulations.",
          "• Customer Support and Complaint Records: Retained for up to three (3) years following resolution, to",
          "support quality assurance and legal defense where necessary.",
          "• Marketing Preferences and Communication Logs: Retained until consent is withdrawn or the",
          "account is deleted, whichever occurs first.",
          "• Device and Usage Logs: Retained for up to twelve (12) months for security, fraud prevention, and",
          "analytics purposes."
        ]
      },
      {
        "index": "19.3",
        "title": "Deletion Following Account Closure",
        "content": [
          "Upon voluntary account closure or termination, EKHANEI will delete or anonymize personal data not otherwise required to be retained under Section 19.2, generally within ninety (90) days, except where retention is required by law or for the establishment, exercise, or defense of legal claims."
        ]
      },
      {
        "index": "19.4",
        "title": "Backup and Archival Systems",
        "content": [
          "Data may persist in encrypted backup systems for a limited additional period after deletion from primary systems, solely for disaster recovery purposes, and will not be actively used for other purposes."
        ]
      },
      {
        "index": "19.5",
        "title": "Anonymized and Aggregated Data",
        "content": [
          "EKHANEI may retain anonymized or aggregated data indefinitely for analytics, reporting, and business improvement purposes, as such data no longer identifies an individual user."
        ]
      },
      {
        "index": "19.6",
        "title": "Requests for Deletion",
        "content": [
          "Users may request earlier deletion of their personal data by contacting ekhanei.support@gmail.com, subject to EKHANEI's ability to comply with statutory retention obligations described above."
        ]
      }
    ],
    "icon": "database"
  },
  {
    "id": "governing-law",
    "index": 20,
    "title": "Governing Law",
    "intro": [],
    "sections": [
      {
        "index": "20.1",
        "title": "Applicable Law",
        "content": [
          "These policies, and any dispute or claim arising out of or in connection with them or their subject matter, formation, or use of the Platform, shall be governed by and construed in accordance with the laws of the People's Republic of Bangladesh, including but not limited to the Contract Act, 1872, the Consumer Rights Protection Act, 2009, the Information and Communication Technology Act, 2006, the Digital Security Act, 2018 (and any successor legislation), and the Digital Commerce Operation Guideline, 2021, without regard to conflict-of-law principles."
        ]
      },
      {
        "index": "20.2",
        "title": "Jurisdiction",
        "content": [
          "Subject to the Complaint & Dispute Resolution process described above, the courts of Dhaka, Bangladesh shall have exclusive jurisdiction to hear and determine any dispute, claim, or proceeding arising out of or in connection with these policies or use of the Platform, and each party irrevocably submits to such jurisdiction."
        ]
      },
      {
        "index": "20.3",
        "title": "Regulatory Compliance",
        "content": [
          "EKHANEI operates in compliance with applicable directives issued by the Bangladesh Telecommunication Regulatory Commission (BTRC), Bangladesh Bank, the National Board of Revenue (NBR), and other relevant regulatory authorities governing digital commerce and electronic payments in Bangladesh."
        ]
      },
      {
        "index": "20.4",
        "title": "Severability",
        "content": [
          "If any provision of these policies is held by a court of competent jurisdiction to be invalid, illegal, or unenforceable, the remaining provisions shall continue in full force and effect, and the invalid provision shall be deemed modified to the minimum extent necessary to make it enforceable."
        ]
      },
      {
        "index": "20.5",
        "title": "Language",
        "content": [
          "These policies are published in English. In the event of any conflict between an English version and a translated version made available for convenience, the English version shall prevail."
        ]
      }
    ],
    "icon": "scale"
  },
  {
    "id": "limitation-of-liability",
    "index": 21,
    "title": "Limitation of Liability",
    "intro": [],
    "sections": [
      {
        "index": "21.1",
        "title": "Exclusion of Indirect Damages",
        "content": [
          "To the maximum extent permitted by applicable law, EKHANEI, its affiliates, directors, officers, employees, agents, or licensors shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, revenue, data, goodwill, or other intangible losses, arising out of or in connection with your access to or use of (or inability to access or use) the Platform."
        ]
      },
      {
        "index": "21.2",
        "title": "Cap on Liability",
        "content": [
          "To the maximum extent permitted by applicable law, the total aggregate liability of EKHANEI to you for any claims arising out of or relating to these Terms or your use of the Platform, whether in contract, tort (including negligence), breach of statutory duty, or otherwise, shall be limited to the total amount paid by you to EKHANEI for the specific order giving rise to the liability, or BDT 5,000, whichever is lower."
        ]
      },
      {
        "index": "21.3",
        "title": "Third-Party Services and Vendor Actions",
        "content": [
          "Since EKHANEI operates as an intermediary marketplace, EKHANEI is not responsible for the acts, omissions, representations, warranties, or breaches of any independent vendors or delivery partners, nor for any personal injury, property damage, or other damages or expenses resulting from their products or services."
        ]
      },
      {
        "index": "21.4",
        "title": "Force Majeure",
        "content": [
          "EKHANEI shall not be liable for any delay or failure to perform its obligations under these Terms resulting from causes beyond its reasonable control, including but not limited to acts of God, war, terrorism, riots, embargoes, acts of civil or military authorities, fire, floods, accidents, strikes, or shortages of transportation facilities, fuel, energy, labor, or materials."
        ]
      }
    ],
    "icon": "shield-alert"
  }
];

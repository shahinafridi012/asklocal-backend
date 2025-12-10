export interface IFAQ {
  question: string;
  answer: string;
}

export interface IFaqPage {
  hero: {
    image: string;
    title: string;
    description: string;
  };
  faqs: IFAQ[];
}

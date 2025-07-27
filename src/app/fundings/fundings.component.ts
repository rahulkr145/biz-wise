import { Component } from '@angular/core';

@Component({
  selector: 'app-fundings',
  templateUrl: './fundings.component.html',
  styleUrls: ['./fundings.component.scss']
})
export class FundingsComponent {
  cards = [
    {
      img: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/4efb1a90-9321-4637-8b56-ec6369b0c70c.png',
      title: 'Inventory Funding',
      badge: 'Fast Approval',
      badgeClass: 'badge-blue',
      description: 'Get the working capital you need to stock up on inventory and never miss a sales opportunity again.',
      features: [
        'Up to $500,000 funding',
        'Terms from 6-24 months',
        'No personal guarantee required'
      ],
      btnText: 'Apply Now',
      btnClass: 'btn-blue'
    },
    {
      img: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/cb2e10cb-26b1-4d8c-84e5-a13f06642330.png',
      title: 'Credit Profile (Bank Loan)',
      badge: 'Preferred Rates',
      badgeClass: 'badge-green',
      description: 'Access traditional bank financing with stronger credit profiles and better terms.',
      features: [
        'Competitive interest rates from 4.99%',
        'Terms from 1-5 years',
        'Build business credit history'
      ],
      btnText: 'Check Eligibility',
      btnClass: 'btn-green'
    },
    // Duplicate cards for testing next arrow
    {
      img: 'https://www.shutterstock.com/shutterstock/photos/2281905729/display_1500/stock-vector-graphic-of-d-candlestick-in-stock-market-presented-in-futuristic-style-2281905729.jpg',
      title: 'Smart Inventory Financing',
      badge: 'Fast Approval',
      badgeClass: 'badge-blue',
      description: 'Get the cutting-edge financial tools you need to analyze and optimize your inventory management with precision and speed.',
      features: [
        'Advanced analytics for smarter inventory decisions',
        'Up to $500,000 for scaling with precision',
        'Ideal for businesses using AI, analytics, or forecasting tools'
      ],
      btnText: 'Apply Now',
      btnClass: 'btn-blue'
    },
    {
      img: 'https://static.vecteezy.com/system/resources/thumbnails/024/124/665/small/us-dollars-printing-usd-bill-banknotes-currency-is-being-made-bank-exchange-economics-inflation-free-png.png',
      title: 'Strong Bank Funding',
      badge: 'Preferred Rates',
      badgeClass: 'badge-green',
      description: 'Access traditional bank financing with substantial funding options to support your business growth and financial stability.',
      features: [
        'Funding in the millions for strong credit profiles',
        '1–5 year terms to support long-term plans',
        'Builds and strengthens business credit profile'
      ],
      btnText: 'Check Eligibility',
      btnClass: 'btn-green'
    }
  ];

  activeIndex = 0;

  prevCards() {
    if (this.activeIndex > 0) {
      this.activeIndex -= 2;
      if (this.activeIndex < 0) this.activeIndex = 0;
    }
  }

  nextCards() {
    if (this.activeIndex + 2 < this.cards.length) {
      this.activeIndex += 2;
    }
  }

  get visibleCards() {
    return this.cards.slice(this.activeIndex, this.activeIndex + 2);
  }

  get isPrevDisabled() {
    return this.activeIndex === 0;
  }

  get isNextDisabled() {
    return this.activeIndex + 2 >= this.cards.length;
  }
}

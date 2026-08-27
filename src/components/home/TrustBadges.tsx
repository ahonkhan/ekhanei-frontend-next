'use client';

import React from 'react';

export const TrustBadges: React.FC = () => {
  return (
    <section className="w-full">
      {/* Desktop Grid (hidden on mobile) */}
      <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Cash On Delivery */}
        <div className="text-card-foreground flex flex-col gap-6 rounded-sm py-6 shadow-sm shadow-primary/10 flex-1 h-[66px] hover:shadow-lg transition-all duration-200 bg-white border border-slate-100">
          <div className="px-6 h-full">
            <div className="flex justify-center items-center gap-1 w-full h-full">
              <div className="rounded-lg">
                <img
                  alt="Cash On Delivery"
                  loading="lazy"
                  width="43"
                  height="42"
                  src="https://govaly.com.bd/assets/delivery/image-1.png"
                />
              </div>
              <span className="text-gray-800 font-medium text-[16.6px]">Cash On Delivery</span>
            </div>
          </div>
        </div>

        {/* Card 2: Instant Return */}
        <div className="text-card-foreground flex flex-col gap-6 rounded-sm py-6 shadow-sm shadow-primary/10 flex-1 h-[66px] hover:shadow-lg transition-all duration-200 bg-white border border-slate-100">
          <div className="px-6 h-full">
            <div className="flex justify-center items-center gap-1 w-full h-full">
              <div className="rounded-lg">
                <img
                  alt="Instant Return"
                  loading="lazy"
                  width="43"
                  height="42"
                  src="https://govaly.com.bd/assets/delivery/image-2.png"
                />
              </div>
              <span className="text-gray-800 font-medium text-[16.6px]">Instant Return</span>
            </div>
          </div>
        </div>

        {/* Card 3: Delivery Within 48hrs */}
        <div className="text-card-foreground flex flex-col gap-6 rounded-sm py-6 shadow-sm shadow-primary/10 flex-1 h-[66px] hover:shadow-lg transition-all duration-200 bg-white border border-slate-100">
          <div className="px-6 h-full">
            <div className="flex justify-center items-center gap-1 w-full h-full">
              <div className="rounded-lg">
                <img
                  alt="Delivery Within"
                  loading="lazy"
                  width="43"
                  height="42"
                  src="https://govaly.com.bd/assets/delivery/image-3.png"
                />
              </div>
              <span className="text-gray-800 font-medium text-[16.6px]">
                Delivery Within <span className="text-[#d81b60]">48hrs</span>
              </span>
            </div>
          </div>
        </div>

        {/* Card 4: Best Price Deal */}
        <div className="text-card-foreground flex flex-col gap-6 rounded-sm py-6 shadow-sm shadow-primary/10 flex-1 h-[66px] hover:shadow-lg transition-all duration-200 bg-white border border-slate-100">
          <div className="px-6 h-full">
            <div className="flex justify-center items-center gap-1 w-full h-full">
              <div className="rounded-lg">
                <img
                  alt="Best Price Deal"
                  loading="lazy"
                  width="43"
                  height="42"
                  src="https://govaly.com.bd/assets/delivery/image-4.png"
                />
              </div>
              <span className="text-gray-800 font-medium text-[16.6px]">Best Price Deal</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Flex Row (hidden on md+) */}
      <div className="md:hidden flex gap-1">
        {/* Mobile Card 1 */}
        <div className="text-card-foreground flex flex-col gap-6 shadow-sm flex-1 h-[50px] hover:shadow-lg !border-none rounded p-0.5 bg-white">
          <div className="p-1 h-full flex flex-col items-center justify-center">
            <img
              alt="Cash On Delivery"
              loading="lazy"
              width="25"
              height="26"
              className="w-[25px] h-[26px]"
              src="https://govaly.com.bd/assets/delivery/image-1.png"
            />
            <span className="text-gray-800 font-medium text-[8px] leading-tight text-center whitespace-nowrap">
              Cash On Delivery
            </span>
          </div>
        </div>

        {/* Mobile Card 2 */}
        <div className="text-card-foreground flex flex-col gap-6 shadow-sm flex-1 h-[50px] hover:shadow-lg !border-none rounded p-0.5 bg-white">
          <div className="p-1 h-full flex flex-col items-center justify-center">
            <img
              alt="Instant Return Policy"
              loading="lazy"
              width="25"
              height="26"
              className="w-[25px] h-[26px]"
              src="https://govaly.com.bd/assets/delivery/image-2.png"
            />
            <span className="text-gray-800 font-medium text-[8px] leading-tight text-center">
              Instant Return
            </span>
          </div>
        </div>

        {/* Mobile Card 3 */}
        <div className="text-card-foreground flex flex-col gap-6 shadow-sm flex-1 h-[50px] hover:shadow-lg !border-none rounded p-0.5 bg-white">
          <div className="p-1 h-full flex flex-col items-center justify-center">
            <img
              alt="Delivery Within 48hrs"
              loading="lazy"
              width="25"
              height="26"
              className="w-[25px] h-[26px]"
              src="https://govaly.com.bd/assets/delivery/image-3.png"
            />
            <span className="text-gray-800 font-medium text-[8px] leading-tight text-center">
              Delivery Within <span className="text-[#d81b60]">48 hrs</span>
            </span>
          </div>
        </div>

        {/* Mobile Card 4 */}
        <div className="text-card-foreground flex flex-col gap-6 shadow-sm flex-1 h-[50px] hover:shadow-lg !border-none rounded p-0.5 bg-white">
          <div className="p-1 h-full flex flex-col items-center justify-center">
            <img
              alt="Best Price Deal"
              loading="lazy"
              width="25"
              height="26"
              className="w-[25px] h-[26px]"
              src="https://govaly.com.bd/assets/delivery/image-4.png"
            />
            <span className="text-gray-800 font-medium text-[8px] whitespace-nowrap leading-tight text-center">
              Best Price Deal
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { CategoryMenuDrawer } from '@/components/layout/CategoryMenuDrawer';
import { Home, Shapes, ShoppingCart, MessageCircleMore, User, ChevronDown } from 'lucide-react';

export const Footer: React.FC = () => {
  const { totalItemsCount, setIsCartOpen } = useCart();
  const pathname = usePathname();
  const isProductPage = pathname ? pathname.startsWith('/product/') : false;
  const [openSection, setOpenSection] = useState<string | null>(null);
  const [isCategoryDrawerOpen, setIsCategoryDrawerOpen] = useState(false);

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  return (
    <>
      <footer className="bg-white border-t mt-5 text-[#191919] w-full">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-6 py-4">
          <div className="flex flex-col gap-1">
            <div className="flex flex-col md:flex-row justify-between flex-wrap w-full gap-4 md:gap-8 px-0">

              {/* Column 1: Logo & App Download Links */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-2">
                  <img
                    alt="App Icon"
                    loading="lazy"
                    width="80"
                    height="80"
                    className="w-13 h-13 md:w-17 md:h-17 rounded-xl object-contain"
                    src="/app-icon.png"
                  />
                  <div className="flex flex-col gap-1 text-left">
                    <div className="flex flex-col justify-start">
                      <p className="text-[16px] md:text-[32px] font-bold leading-none text-[#191919]">Ekhanei</p>
                      <p className="text-[10px] md:text-[12px] leading-relaxed text-slate-600">Bangladesh's Favorite Online Fashion Mall</p>
                    </div>
                    <p className="text-[10px] md:text-[12px] leading-none text-slate-600">
                      <span className="font-semibold">DBID</span> - <span>751626035</span>
                    </p>
                  </div>
                </div>

                <div className="flex py-4 flex-col gap-2 text-left">
                  <p className="font-semibold text-[14px]">
                    Download <span className="text-[#d81b60]">Ekhanei</span> Mobile App
                  </p>
                  <div className="flex gap-3">
                    <a
                      className="flex gap-1.5 items-center border-2 border-black rounded-md w-fit py-2 px-3 hover:bg-slate-50 transition"
                      href="https://play.google.com/store/apps/details?id=com.ekhanei.customer.app&pcampaignid=web_share"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="24" height="24" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M16.6973 17.3389L2.54102 25.3848C1.9062 25.7447 1.32406 25.8045 0.87793 25.6133L12.9238 13.5654L16.6973 17.3389ZM12.2168 12.8584L0.183594 24.8936C0.0656134 24.6263 0 24.2986 0 23.917V1.80176C0 1.42057 0.0655179 1.09267 0.183594 0.825195L12.2168 12.8584ZM22.042 11.416C23.439 12.21 23.439 13.5097 22.042 14.3047L17.5996 16.8271L13.6309 12.8584L17.5977 8.89062L22.042 11.416ZM0.878906 0.106445C1.32496 -0.0846281 1.90655 -0.0246067 2.54102 0.335938L16.6963 8.37793L12.9238 12.1514L0.878906 0.106445Z" fill="#191919" />
                      </svg>
                      <div className="flex flex-col leading-tight text-left">
                        <p className="text-[10px] m-0 text-slate-600">GET IT ON</p>
                        <p className="text-[14px] font-semibold m-0 text-black">Google Play</p>
                      </div>
                    </a>

                    <a
                      className="flex gap-1.5 items-center border-2 border-black rounded-md w-fit py-2 px-3 hover:bg-slate-50 transition"
                      href="https://apps.apple.com/app/govaly/id6757096963"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <img
                        alt="Apple Icon"
                        width="20"
                        height="25"
                        src="https://govaly.com.bd/assets/icons/Apple_logo.svg"
                      />
                      <div className="flex flex-col leading-tight text-left">
                        <p className="text-[10px] m-0 text-slate-600">Download on the</p>
                        <p className="text-[14px] font-semibold m-0 text-black">App Store</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>

              {/* Column 2: EkhaneiPolicies */}
              <div className="text-[16px] mt-2 md:mt-0 md:w-fit px-3 md:px-0 text-left">
                <div className="hidden md:block">
                  <h3 className="font-semibold mb-3">EkhaneiPolicies</h3>
                  <ul className="space-y-1 min-w-[230px]">
                    <li><Link className="hover:text-[#d81b60] transition-colors" href="/return-refund-policy">Return & Refund Policy</Link></li>
                    <li><Link className="hover:text-[#d81b60] transition-colors" href="/exchange-policy">Exchange Policy</Link></li>
                    <li><Link className="hover:text-[#d81b60] transition-colors" href="/shipping-delivery-policy">Shipping & Delivery Policy</Link></li>
                    <li><Link className="hover:text-[#d81b60] transition-colors" href="/cancellation-policy">Cancellation Policy</Link></li>
                    <li><Link className="hover:text-[#d81b60] transition-colors" href="/privacy-policy">Privacy Policy</Link></li>
                    <li><Link className="hover:text-[#d81b60] transition-colors" href="/terms-conditions">Terms & Conditions</Link></li>
                  </ul>
                </div>

                {/* Mobile Accordion */}
                <div className="md:hidden border-b border-slate-200 py-2">
                  <button
                    type="button"
                    onClick={() => toggleSection('policies')}
                    className="flex w-full justify-between items-center font-semibold text-slate-900"
                  >
                    <span>EkhaneiPolicies</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSection === 'policies' ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === 'policies' && (
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-600 pl-1">
                      <li><Link className="hover:text-[#d81b60]" href="/return-refund-policy">Return & Refund Policy</Link></li>
                      <li><Link className="hover:text-[#d81b60]" href="/exchange-policy">Exchange Policy</Link></li>
                      <li><Link className="hover:text-[#d81b60]" href="/shipping-delivery-policy">Shipping & Delivery Policy</Link></li>
                      <li><Link className="hover:text-[#d81b60]" href="/cancellation-policy">Cancellation Policy</Link></li>
                      <li><Link className="hover:text-[#d81b60]" href="/privacy-policy">Privacy Policy</Link></li>
                      <li><Link className="hover:text-[#d81b60]" href="/terms-conditions">Terms & Conditions</Link></li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Column 3: EkhaneiSeller */}
              <div className="text-[16px] md:w-fit px-3 md:px-0 text-left">
                <div className="hidden md:block">
                  <h3 className="font-semibold mb-3">EkhaneiSeller</h3>
                  <ul className="space-y-1 min-w-[250px]">
                    <li><Link className="hover:text-[#d81b60] transition-colors" href="/become-a-seller">Become A Seller</Link></li>
                    <li><Link className="hover:text-[#d81b60] transition-colors" href="/seller-policy">Seller Policy</Link></li>
                    <li><Link className="hover:text-[#d81b60] transition-colors" href="/product-policy">Product Policy</Link></li>
                    <li><Link className="hover:text-[#d81b60] transition-colors" href="/pickup-delivery-policy">Pickup & Delivery Policy</Link></li>
                    <li><Link className="hover:text-[#d81b60] transition-colors" href="/seller-exchange-return-policy">Seller Exchange & Return Policy</Link></li>
                  </ul>
                </div>

                {/* Mobile Accordion */}
                <div className="md:hidden border-b border-slate-200 py-2">
                  <button
                    type="button"
                    onClick={() => toggleSection('seller')}
                    className="flex w-full justify-between items-center font-semibold text-slate-900"
                  >
                    <span>EkhaneiSeller</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSection === 'seller' ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === 'seller' && (
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-600 pl-1">
                      <li><Link className="hover:text-[#d81b60]" href="/become-a-seller">Become A Seller</Link></li>
                      <li><Link className="hover:text-[#d81b60]" href="/seller-policy">Seller Policy</Link></li>
                      <li><Link className="hover:text-[#d81b60]" href="/product-policy">Product Policy</Link></li>
                      <li><Link className="hover:text-[#d81b60]" href="/pickup-delivery-policy">Pickup & Delivery Policy</Link></li>
                      <li><Link className="hover:text-[#d81b60]" href="/seller-exchange-return-policy">Seller Exchange & Return Policy</Link></li>
                    </ul>
                  )}
                </div>
              </div>

              {/* Column 4: Social Links */}
              <div className="text-[16px] md:w-fit px-3 md:px-0 text-left">
                <div className="hidden md:block">
                  <h3 className="font-semibold mb-3">Social Links</h3>
                  <ul className="space-y-1 min-w-[120px]">
                    <li>
                      <a className="flex items-center gap-2 hover:text-[#E2136E] transition-colors" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/govaly.shop">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-5 h-5" role="img" aria-label="Facebook icon">
                          <path d="M14.6673 8.00065C14.6673 4.32065 11.6807 1.33398 8.00065 1.33398C4.32065 1.33398 1.33398 4.32065 1.33398 8.00065C1.33398 11.2273 3.62732 13.914 6.66732 14.534V10.0007H5.33398V8.00065H6.66732V6.33398C6.66732 5.04732 7.71398 4.00065 9.00065 4.00065H10.6673V6.00065H9.33398C8.96732 6.00065 8.66732 6.30065 8.66732 6.66732V8.00065H10.6673V10.0007H8.66732V14.634C12.034 14.3007 14.6673 11.4607 14.6673 8.00065Z" fill="currentColor" />
                        </svg>
                        <span>Facebook</span>
                      </a>
                    </li>
                    <li>
                      <a className="flex items-center gap-2 hover:text-[#E2136E] transition-colors" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/govalyshopping">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-5 h-5" role="img" aria-label="Instagram icon">
                          <path d="M8.68636 1.33398C9.43636 1.33598 9.81703 1.33998 10.1457 1.34932L10.275 1.35398C10.4244 1.35932 10.5717 1.36598 10.7497 1.37398C11.459 1.40732 11.943 1.51932 12.3677 1.68398C12.8077 1.85332 13.1784 2.08265 13.549 2.45265C13.8882 2.78581 14.1505 3.18897 14.3177 3.63398C14.4824 4.05865 14.5944 4.54265 14.6277 5.25265C14.6357 5.42998 14.6424 5.57732 14.6477 5.72732L14.6517 5.85665C14.6617 6.18465 14.6657 6.56532 14.667 7.31532L14.6677 7.81265V8.68598C14.6693 9.17225 14.6642 9.65852 14.6524 10.1447L14.6484 10.274C14.643 10.424 14.6364 10.5713 14.6284 10.7487C14.595 11.4587 14.4817 11.942 14.3177 12.3673C14.1505 12.8123 13.8882 13.2155 13.549 13.5487C13.2159 13.8878 12.8127 14.1501 12.3677 14.3173C11.943 14.482 11.459 14.594 10.7497 14.6273L10.275 14.6473L10.1457 14.6513C9.81703 14.6607 9.43636 14.6653 8.68636 14.6667L8.18903 14.6673H7.31636C6.82987 14.669 6.34338 14.6639 5.85703 14.652L5.7277 14.648C5.56944 14.642 5.41121 14.6351 5.25303 14.6273C4.5437 14.594 4.0597 14.482 3.63436 14.3173C3.18958 14.15 2.78666 13.8877 2.4537 13.5487C2.11433 13.2156 1.85177 12.8124 1.68436 12.3673C1.5197 11.9427 1.4077 11.4587 1.37436 10.7487L1.35436 10.274L1.35103 10.1447C1.33874 9.65853 1.33318 9.17226 1.33436 8.68598V7.31532C1.33252 6.82905 1.33741 6.34278 1.34903 5.85665L1.3537 5.72732C1.35903 5.57732 1.3657 5.42998 1.3737 5.25265C1.40703 4.54265 1.51903 4.05932 1.6837 3.63398C1.85149 3.18878 2.11451 2.78561 2.45436 2.45265C2.78713 2.11368 3.18982 1.85137 3.63436 1.68398C4.0597 1.51932 4.54303 1.40732 5.25303 1.37398C5.43036 1.36598 5.57836 1.35932 5.7277 1.35398L5.85703 1.34998C6.34316 1.33814 6.82943 1.33303 7.3157 1.33465L8.68636 1.33398ZM8.00103 4.66732C7.11698 4.66732 6.26913 5.01851 5.64401 5.64363C5.01889 6.26875 4.6677 7.1166 4.6677 8.00065C4.6677 8.88471 5.01889 9.73255 5.64401 10.3577C6.26913 10.9828 7.11698 11.334 8.00103 11.334C8.88509 11.334 9.73293 10.9828 10.3581 10.3577C10.9832 9.73255 11.3344 8.88471 11.3344 8.00065C11.3344 7.1166 10.9832 6.26875 10.3581 5.64363C9.73293 5.01851 8.88509 4.66732 8.00103 4.66732ZM8.00103 6.00065C8.26367 6.00061 8.52375 6.0523 8.76642 6.15276C9.00909 6.25323 9.22959 6.40052 9.41534 6.5862C9.60109 6.77189 9.74844 6.99234 9.849 7.23498C9.94954 7.47761 10.0013 7.73767 10.0014 8.00032C10.0014 8.26296 9.94972 8.52304 9.84925 8.76571C9.74878 9.00838 9.6015 9.22888 9.41581 9.41463C9.23013 9.60038 9.00967 9.74773 8.76704 9.84828C8.5244 9.94883 8.26434 10.0006 8.0017 10.0007C7.47126 10.0007 6.96256 9.78994 6.58748 9.41487C6.21241 9.03979 6.0017 8.53108 6.0017 8.00065C6.0017 7.47022 6.21241 6.96151 6.58748 6.58644C6.96256 6.21136 7.47126 6.00065 8.0017 6.00065M11.5017 3.66732C11.2807 3.66732 11.0687 3.75512 10.9124 3.9114C10.7562 4.06768 10.6684 4.27964 10.6684 4.50065C10.6684 4.72166 10.7562 4.93363 10.9124 5.08991C11.0687 5.24619 11.2807 5.33398 11.5017 5.33398C11.7227 5.33398 11.9347 5.24619 12.091 5.08991C12.2472 4.93363 12.335 4.72166 12.335 4.50065C12.335 4.27964 12.2472 4.06768 12.091 3.9114C11.9347 3.75512 11.7227 3.66732 11.5017 3.66732Z" fill="currentColor" />
                        </svg>
                        <span>Instagram</span>
                      </a>
                    </li>
                    <li>
                      <a className="flex items-center gap-2 hover:text-[#E2136E] transition-colors" target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/@govalyshopping">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-5 h-5" role="img" aria-label="TikTok icon">
                          <path d="M7.99902 1.66602C10.9846 1.66602 12.4777 1.66626 13.4053 2.59375C14.3327 3.52125 14.332 5.01451 14.332 8C14.332 10.9851 14.3325 12.4778 13.4053 13.4053C12.4777 14.3327 10.9846 14.333 7.99902 14.333C5.01364 14.333 3.52124 14.3327 2.59375 13.4053C1.66629 12.4778 1.66602 10.9853 1.66602 8C1.66602 5.01444 1.66626 3.52125 2.59375 2.59375C3.52125 1.66653 5.01384 1.66602 7.99902 1.66602ZM9.0127 3.48828C8.78355 3.47413 8.57863 3.61695 8.50781 3.82715L8.48633 3.9209C8.47365 4.01663 8.47478 4.11946 8.4834 4.22559L8.5332 9.80078C8.32598 10.4751 8.14586 10.8014 8.01172 10.9717C7.88513 11.1322 7.79588 11.1702 7.61523 11.2793C7.11625 11.5806 6.64448 11.5764 6.24805 11.457C5.83629 11.3328 5.51684 11.085 5.38086 10.9365C5.23416 10.7631 5.02789 10.4293 4.9248 10.0273C4.82247 9.6273 4.82786 9.18463 5.05957 8.75586C5.52796 7.89041 6.5059 7.76987 6.95312 7.83301C7.22597 7.87122 7.47945 7.68086 7.51855 7.4082C7.55717 7.13499 7.36586 6.88172 7.09277 6.84277C6.44637 6.75159 4.93327 6.8872 4.17969 8.28027C3.80099 8.98083 3.80733 9.69272 3.95605 10.2744C4.10258 10.8464 4.39216 11.3202 4.62891 11.5957V11.5967L4.63867 11.6074C4.8839 11.877 5.35647 12.2322 5.95898 12.4141C6.57993 12.6012 7.35223 12.6064 8.13184 12.1357C8.26797 12.0535 8.53596 11.923 8.79785 11.5908C9.04792 11.2734 9.28063 10.7943 9.5127 10.0195C9.5269 9.97197 9.53452 9.92171 9.53418 9.87207L9.49902 6.00977C10.0025 6.42989 10.698 6.75472 11.6074 6.83496C11.8819 6.85884 12.1247 6.65523 12.1494 6.38086C12.1737 6.10599 11.9701 5.86345 11.6953 5.83887C10.8028 5.76011 10.2328 5.39392 9.89551 5.00879C9.62216 4.6963 9.51117 4.38623 9.48242 4.19434L9.48145 3.98242C9.47889 3.72039 9.2742 3.50477 9.0127 3.48828Z" fill="currentColor" />
                        </svg>
                        <span>TikTok</span>
                      </a>
                    </li>
                    <li>
                      <a className="flex items-center gap-2 hover:text-[#E2136E] transition-colors" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/@govalyshop">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-5 h-5" role="img" aria-label="YouTube icon">
                          <path d="M6.66732 10.0007L10.1273 8.00065L6.66732 6.00065V10.0007ZM14.374 4.78065C14.4606 5.09398 14.5206 5.51398 14.5607 6.04732C14.6073 6.58065 14.6273 7.04065 14.6273 7.44065L14.6673 8.00065C14.6673 9.46065 14.5606 10.534 14.374 11.2207C14.2073 11.8207 13.8207 12.2073 13.2207 12.374C12.9073 12.4607 12.334 12.5207 11.454 12.5607C10.5873 12.6073 9.79398 12.6273 9.06065 12.6273L8.00065 12.6673C5.20732 12.6673 3.46732 12.5606 2.78065 12.374C2.18065 12.2073 1.79398 11.8207 1.62732 11.2207C1.54065 10.9073 1.48065 10.4873 1.44065 9.95398C1.39398 9.42065 1.37398 8.96065 1.37398 8.56065L1.33398 8.00065C1.33398 6.54065 1.44065 5.46732 1.62732 4.78065C1.79398 4.18065 2.18065 3.79398 2.78065 3.62732C3.09398 3.54065 3.66732 3.48065 4.54732 3.44065C5.41398 3.39398 6.20732 3.37398 6.94065 3.37398L8.00065 3.33398C10.794 3.33398 12.534 3.44065 13.2207 3.62732C13.8207 3.79398 14.2073 4.18065 14.374 4.78065Z" fill="currentColor" />
                        </svg>
                        <span>YouTube</span>
                      </a>
                    </li>
                    <li>
                      <a className="flex items-center gap-2 hover:text-[#E2136E] transition-colors" target="_blank" rel="noopener noreferrer" href="https://wa.me/8801805101868">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="w-5 h-5" role="img" aria-label="WhatsApp icon">
                          <path d="M8.00066 1.33398C11.6827 1.33398 14.6673 4.31865 14.6673 8.00065C14.6673 11.6827 11.6827 14.6673 8.00066 14.6673C6.8225 14.6693 5.66505 14.3576 4.64733 13.764L1.33666 14.6673L2.23799 11.3553C1.64397 10.3373 1.33193 9.17933 1.33399 8.00065C1.33399 4.31865 4.31866 1.33398 8.00066 1.33398ZM5.72866 4.86732L5.59533 4.87265C5.50912 4.87859 5.42489 4.90123 5.34733 4.93932C5.27504 4.98033 5.20904 5.03152 5.15133 5.09132C5.07133 5.16665 5.02599 5.23198 4.97733 5.29532C4.73074 5.61592 4.59798 6.00953 4.59999 6.41398C4.60133 6.74065 4.68666 7.05865 4.81999 7.35598C5.09266 7.95732 5.54133 8.59398 6.13333 9.18398C6.27599 9.32598 6.416 9.46865 6.56666 9.60132C7.30228 10.2489 8.17885 10.716 9.12666 10.9653L9.50533 11.0233C9.62866 11.03 9.752 11.0207 9.876 11.0147C10.0701 11.0044 10.2597 10.9519 10.4313 10.8607C10.5186 10.8155 10.6038 10.7666 10.6867 10.714C10.6867 10.714 10.7149 10.6949 10.77 10.654C10.86 10.5873 10.9153 10.54 10.99 10.462C11.046 10.4042 11.0927 10.3371 11.13 10.2607C11.182 10.152 11.234 9.94465 11.2553 9.77198C11.2713 9.63998 11.2667 9.56798 11.2647 9.52332C11.262 9.45198 11.2027 9.37799 11.138 9.34665L10.75 9.17265C10.75 9.17265 10.17 8.91998 9.81533 8.75865C9.7782 8.74249 9.73844 8.73323 9.698 8.73132C9.65238 8.72655 9.60627 8.73164 9.56279 8.74624C9.51931 8.76085 9.47948 8.78464 9.446 8.81598C9.44266 8.81465 9.39799 8.85265 8.91599 9.43665C8.88833 9.47383 8.85022 9.50192 8.80653 9.51735C8.76284 9.53279 8.71554 9.53487 8.67066 9.52332C8.62721 9.51174 8.58466 9.49703 8.54333 9.47932C8.46066 9.44465 8.43199 9.43132 8.37533 9.40732C7.99258 9.24059 7.63829 9.01497 7.32533 8.73865C7.24133 8.66532 7.16333 8.58532 7.08333 8.50798C6.82107 8.25679 6.5925 7.97264 6.40333 7.66265L6.36399 7.59932C6.33617 7.55652 6.31335 7.51066 6.29599 7.46265C6.27066 7.36465 6.33666 7.28598 6.33666 7.28598C6.33666 7.28598 6.49866 7.10865 6.57399 7.01265C6.64733 6.91932 6.70933 6.82865 6.74933 6.76398C6.82799 6.63732 6.85266 6.50732 6.81133 6.40665C6.62466 5.95065 6.43177 5.4971 6.23266 5.04598C6.19333 4.95665 6.07666 4.89265 5.97066 4.87998C5.93466 4.87554 5.89866 4.87198 5.86266 4.86932C5.77315 4.86418 5.68339 4.86507 5.59399 4.87198L5.72866 4.86732Z" fill="currentColor" />
                        </svg>
                        <span>WhatsApp</span>
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Mobile Accordion */}
                <div className="md:hidden border-b border-slate-200 py-2">
                  <button
                    type="button"
                    onClick={() => toggleSection('social')}
                    className="flex w-full justify-between items-center font-semibold text-slate-900"
                  >
                    <span>Social Links</span>
                    <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${openSection === 'social' ? 'rotate-180' : ''}`} />
                  </button>
                  {openSection === 'social' && (
                    <ul className="mt-2 space-y-1.5 text-sm text-slate-600 pl-1">
                      <li><a className="hover:text-[#d81b60]" target="_blank" rel="noopener noreferrer" href="https://www.facebook.com/govaly.shop">Facebook</a></li>
                      <li><a className="hover:text-[#d81b60]" target="_blank" rel="noopener noreferrer" href="https://www.instagram.com/govalyshopping">Instagram</a></li>
                      <li><a className="hover:text-[#d81b60]" target="_blank" rel="noopener noreferrer" href="https://www.tiktok.com/@govalyshopping">TikTok</a></li>
                      <li><a className="hover:text-[#d81b60]" target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/@govalyshop">YouTube</a></li>
                      <li><a className="hover:text-[#d81b60]" target="_blank" rel="noopener noreferrer" href="https://wa.me/8801805101868">WhatsApp</a></li>
                    </ul>
                  )}
                </div>
              </div>

            </div>

            {/* SSLCommerz Payment Gateway Banner */}
            <div className="pt-4 mt-2">
              <div className="w-full hidden md:block">
                <img
                  alt="ssl Logo"
                  width="500"
                  height="138"
                  className="object-cover w-full h-auto rounded-lg"
                  src="https://govaly.com.bd/assets/logo/SSLCommerze_desktop.png"
                />
              </div>
              <div className="w-full md:hidden">
                <img
                  alt="ssl Logo"
                  width="60"
                  height="260"
                  className="w-full h-auto rounded-lg"
                  src="https://govaly.com.bd/assets/banner/ssl_commerz_mobile.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-200 w-full pb-20 md:pb-3 bg-white">
          <p className="text-center text-[10px] md:text-[14px] py-3 text-slate-600">
            © EkhaneiLimited
          </p>
        </div>
      </footer>

      {/* EkhaneiFLOATING PILL MOBILE BOTTOM NAVIGATION BAR (Hidden on Product detail pages) */}
      {!isProductPage && (
        <div className="fixed left-2 right-2 bottom-2 z-50 flex flex-row justify-center items-center py-2 px-3 rounded-full shadow-xl md:hidden border border-solid border-[#d81b60] bg-white backdrop-blur-md transition-all duration-300 ease-in-out">
          <div className="flex items-center justify-between w-full">

            {/* 1. Home */}
            <Link href="/" className="flex flex-col items-center justify-center gap-0.5 text-xs text-[#d81b60] font-bold cursor-pointer hover:scale-105 transition-transform">
              <Home className="w-5 h-5 text-[#d81b60]" />
              <span className="text-[10px]">Home</span>
            </Link>

            {/* 2. Category (Opens Categories Side Drawer!) */}
            <button
              type="button"
              onClick={() => setIsCategoryDrawerOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 text-xs text-gray-600 font-medium cursor-pointer hover:scale-105 transition-transform border-none bg-transparent p-0"
            >
              <Shapes className="w-5 h-5 text-gray-600" />
              <span className="text-[10px]">Category</span>
            </button>

            {/* 3. Cart */}
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="flex flex-col items-center justify-center gap-0.5 text-xs text-gray-600 font-medium cursor-pointer hover:scale-105 transition-transform border-none bg-transparent p-0"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-gray-600" />
                {totalItemsCount > 0 && (
                  <span className="absolute -top-2 -right-3 h-4 min-w-[16px] px-1 rounded-full bg-[#d81b60] text-white text-[9px] font-extrabold flex items-center justify-center border border-white">
                    {totalItemsCount}
                  </span>
                )}
              </div>
              <span className="text-[10px]">Cart</span>
            </button>

            {/* 4. Live Chat */}
            <a
              href="https://wa.me/8801907104920"
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center gap-0.5 text-xs text-gray-600 font-medium cursor-pointer hover:scale-105 transition-transform border-none bg-transparent p-0"
            >
              <MessageCircleMore className="w-5 h-5 text-gray-600" />
              <span className="text-[10px]">Live Chat</span>
            </a>

            {/* 5. Account Profile */}
            <Link href="/profile" className="flex flex-col items-center justify-center gap-0.5 text-xs text-gray-600 font-medium cursor-pointer hover:scale-105 transition-transform">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-[10px]">Account</span>
            </Link>
          </div>
        </div>
      )}

      {/* Categories Side Drawer Triggered by Category button */}
      <CategoryMenuDrawer
        isOpen={isCategoryDrawerOpen}
        onClose={() => setIsCategoryDrawerOpen(false)}
      />
    </>
  );
};

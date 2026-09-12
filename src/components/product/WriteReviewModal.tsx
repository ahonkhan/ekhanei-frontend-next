'use client';

import React, { useState, useRef } from 'react';
import { Star, Upload, X, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from 'lucide-react';
import { useSubmitProductReviewMutation } from '@/store/services/apiService';
import { useAppSelector } from '@/store/hooks';

interface WriteReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  productImage?: string;
  orderId?: string;
  onSuccess?: () => void;
}

export const WriteReviewModal: React.FC<WriteReviewModalProps> = ({
  isOpen,
  onClose,
  productId,
  productName,
  productImage,
  orderId,
  onSuccess,
}) => {
  const { user } = useAppSelector((state) => state.auth);
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>(user?.name || '');
  const [images, setImages] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [submitReview, { isLoading }] = useSubmitProductReviewMutation();

  if (!isOpen) return null;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    if (images.length + files.length > 5) {
      setErrorMsg('সর্বোচ্চ ৫টি ছবি আপলোড করতে পারবেন।');
      return;
    }

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('প্রতিটি ছবির সাইজ সর্বোচ্চ 5MB হতে পারবে।');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (reader.result) {
          setImages((prev) => [...prev, reader.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!comment.trim()) {
      setErrorMsg('অনুগ্রহ করে রিভিউ মতামত লিখুন।');
      return;
    }

    try {
      await submitReview({
        productId,
        rating,
        comment: comment.trim(),
        customerName: customerName.trim() || user?.name || 'Customer',
        orderId,
        images,
      }).unwrap();

      setIsSuccess(true);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'রিভিউ জমা দিতে সমস্যা হয়েছে, অনুগ্রহ করে আবার চেষ্টা করুন।');
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-700 p-4 text-white flex items-center justify-between shrink-0">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg">রিভিউ ও রেটিং দিন</h3>
            <p className="text-[11px] text-emerald-100 font-medium">পণ্য সম্পর্কে আপনার বাস্তব অভিজ্ঞতা শেয়ার করুন</p>
          </div>
          <button
            onClick={onClose}
            type="button"
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Product Header Card */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            {productImage ? (
              <img
                src={productImage}
                alt={productName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate">{productName}</h4>
              <p className="text-[10px] text-slate-500 font-semibold">ডেলিভারিকৃত প্রোডাক্ট রিভিউ</p>
            </div>
          </div>

          {isSuccess ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">ধন্যবাদ! রিভিউটি জমা নেওয়া হয়েছে।</h4>
              <p className="text-xs text-slate-600 max-w-sm mx-auto font-medium leading-relaxed">
                আপনার রিভিউটি অ্যাডমিন কর্তৃক ভেরিফাই করার পর প্রোডাক্ট পেইজে পাবলিশ করা হবে।
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Rating Star Selection */}
              <div className="space-y-1.5 text-center bg-slate-50/80 p-3.5 rounded-2xl border border-slate-100">
                <label className="text-xs font-extrabold text-slate-800 block">আপনার রেটিং নির্বাচন করুন</label>
                <div className="flex items-center justify-center gap-1.5 py-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="p-1 hover:scale-125 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-7 h-7 sm:w-8 sm:h-8 ${
                          star <= (hoverRating || rating)
                            ? 'fill-amber-400 text-amber-400 drop-shadow-xs'
                            : 'text-slate-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <span className="text-xs font-bold text-amber-600 block">
                  {rating === 5 && 'অসাধারণ (5/5)'}
                  {rating === 4 && 'খুব ভালো (4/5)'}
                  {rating === 3 && 'মোটামুটি (3/5)'}
                  {rating === 2 && 'খারাপ না (2/5)'}
                  {rating === 1 && 'পছন্দ হয়নি (1/5)'}
                </span>
              </div>

              {/* Customer Name */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800 block">আপনার নাম</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="আপনার নাম লিখুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              {/* Review Comment */}
              <div className="space-y-1">
                <label className="text-xs font-extrabold text-slate-800 block">
                  রিভিউ বক্তব্য / অভিজ্ঞতা <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="প্রোডাক্টটি কেমন লেগেছে? ব্যবহার বা কোয়ালিটি নিয়ে আপনার মতামত শেয়ার করুন..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-800 focus:outline-none focus:border-emerald-500 transition resize-none"
                  required
                />
              </div>

              {/* Photo Upload Section */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-slate-800 block flex items-center justify-between">
                  <span>ছবি সংযুক্ত করুন (ঐচ্ছিক)</span>
                  <span className="text-[10px] text-slate-400 font-semibold">{images.length}/5 ছবি</span>
                </label>

                {/* Upload Button & Preview List */}
                <div className="grid grid-cols-5 gap-2">
                  {images.map((img, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-slate-200 group">
                      <img src={img} alt={`Upload ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute top-1 right-1 bg-black/60 text-white p-0.5 rounded-full hover:bg-rose-600 transition cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}

                  {images.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/40 text-slate-500 hover:text-emerald-700 transition flex flex-col items-center justify-center gap-1 cursor-pointer"
                    >
                      <Upload className="w-5 h-5" />
                      <span className="text-[9px] font-bold">ছবি যোগ করুন</span>
                    </button>
                  )}
                </div>

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  multiple
                  className="hidden"
                />
              </div>

              {/* Submit Action Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>জমা দেওয়া হচ্ছে...</span>
                    </>
                  ) : (
                    <span>রিভিউ জমা দিন</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

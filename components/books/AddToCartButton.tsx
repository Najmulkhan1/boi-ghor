"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

interface Props {
  book: {
    _id: string;
    title: string;
    coverImage: string;
    hardCopyPrice: number;
    hardCopyStock: number;
  }
}

export default function AddToCartButton({ book }: Props) {
  const addItem = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addItem({
      bookId: book._id,
      title: book.title,
      coverImage: book.coverImage,
      price: book.hardCopyPrice,
    });
    alert(`"${book.title}" কার্টে যোগ করা হয়েছে!`);
  };

  return (
    <Button 
      onClick={handleAddToCart}
      className="w-full bg-gray-900 hover:bg-gray-800 gap-2" 
      disabled={book.hardCopyStock <= 0}
    >
      <ShoppingCart className="w-4 h-4" /> Cart-এ যোগ করুন
    </Button>
  );
}
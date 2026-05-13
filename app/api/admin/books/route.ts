import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User";
import bcrypt from "bcryptjs"; // নতুন অথর তৈরির সময় পাসওয়ার্ড হ্যাশ করার জন্য

// 💡 স্মার্ট এবং ডুপ্লিকেট-প্রুফ অথর জেনারেটর ফাংশন
async function getOrCreateAuthorId(authorName: string) {
  if (!authorName) return null;

  // নামের আগে বা পিছে কোনো স্পেস থাকলে তা কেটে ফেলা হলো
  const cleanName = authorName.trim(); 

  // ১. চেক করা হচ্ছে এই নামে আগে থেকেই কোনো Author আছে কি না (Case-insensitive)
  let author = await User.findOne({ 
    name: { $regex: new RegExp(`^${cleanName}$`, "i") }, 
    role: "author" 
  });

  // যদি ডাটাবেসে এই নামের লেখক পাওয়া যায়, তবে নতুন করে একাউন্ট তৈরি হবে না!
  // আগের একাউন্টের ID টাই রিটার্ন করে দেবে।
  if (author) return author._id;

  // ২. যদি ডাটাবেসে না থাকে, তবেই শুধু নতুন Author Profile তৈরি করবে
  const slugName = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5); // ১০০% ইউনিক ইমেইল নিশ্চিত করতে
  const autoEmail = `${slugName}_${uniqueId}@author.boighor.com`;
  const defaultPassword = await bcrypt.hash("author1234", 10); // ডিফল্ট পাসওয়ার্ড

  const newAuthor = await User.create({
    name: cleanName,
    email: autoEmail,
    password: defaultPassword,
    role: "author", 
  });

  return newAuthor._id;
}

// ================= PUT METHOD =================
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { bookId, ...updateData } = data;

    await connectToDatabase();

    const admin = await User.findById(session.user.id).select("role").lean();
    if (admin?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    // ফিল্ডের নাম hardCopyStock দিয়ে চেক করা হচ্ছে
    if (updateData.hardCopyStock !== undefined) {
      updateData.hardCopyStock = Number(updateData.hardCopyStock);
    }

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: updateData },
      { new: true } 
    );

    if (!updatedBook) return NextResponse.json({ message: "Book not found" }, { status: 404 });

    return NextResponse.json({ message: "Success", book: updatedBook }, { status: 200 });
  } catch (error) {
    console.error("Update Error:", error);
    return NextResponse.json({ message: "Update Failed" }, { status: 500 });
  }
}

// ================= GET METHOD =================
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    await connectToDatabase();
    const books = await Book.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json({ books }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error" }, { status: 500 });
  }
}

// ================= POST METHOD =================
// ================= POST METHOD =================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const admin = await User.findById(session.user.id).select("role").lean();
    if (admin?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    await connectToDatabase();

    // ----------------------------------------------------
    // লজিক ১: BULK ADD (যদি CSV আপলোড করে অনেক বই দেওয়া হয়)
    // ----------------------------------------------------
    if (body.books && Array.isArray(body.books)) {
      if (body.books.length === 0) {
        return NextResponse.json({ message: "কোনো ডেটা পাওয়া যায়নি!" }, { status: 400 });
      }

      const booksWithAuthor = [];

      // 💡 Promise.all এর বদলে for...of ব্যবহার করা হলো যাতে একসাথে অনেকগুলো রিকোয়েস্ট ক্র্যাশ না করে
      for (const book of body.books) {
        // এক এক করে Author ID চেক করবে ও নিয়ে আসবে
        const realAuthorId = await getOrCreateAuthorId(book.authorName);

        // অটোমেটিক Slug এবং Description জেনারেট করা
        const baseSlug = book.title ? book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'book';
        const uniqueSlug = book.slug || `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
        const defaultDescription = book.description || `${book.title} - ${book.authorName} এর লেখা একটি চমৎকার বই।`;

        booksWithAuthor.push({
          ...book,
          authorId: realAuthorId || session.user.id, // যদি অথরের নাম না থাকে, তবে অ্যাডমিন আইডি বসবে
          coverImage: book.coverImage || "https://via.placeholder.com/150", // ডিফল্ট ইমেজ
          hardCopyAvailable: book.hardCopyStock > 0,
          slug: uniqueSlug,
          description: defaultDescription
        });
      }

      // সব ডেটা প্রসেস হওয়ার পর একসাথে ইনসার্ট করা
      const insertedBooks = await Book.insertMany(booksWithAuthor);
      return NextResponse.json({ message: `${insertedBooks.length} টি বই সফলভাবে যুক্ত হয়েছে!`, insertedBooks }, { status: 201 });
    }

    // ----------------------------------------------------
    // লজিক ২: SINGLE ADD (যদি একটি মাত্র বই ম্যানুয়ালি অ্যাড করা হয়)
    // ----------------------------------------------------
    else {
      const realAuthorId = await getOrCreateAuthorId(body.authorName);

      const baseSlug = body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'book';
      const uniqueSlug = body.slug || `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

      const newBook = await Book.create({
        ...body,
        authorId: realAuthorId || session.user.id,
        slug: uniqueSlug,
      });

      return NextResponse.json({ message: "বই সফলভাবে যোগ করা হয়েছে!", book: newBook }, { status: 201 });
    }

  } catch (error) {
    console.error("Book Add Error:", error);
    return NextResponse.json({ message: "Failed to add book" }, { status: 500 });
  }
}
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectToDatabase from "@/lib/db";
import Book from "@/models/Book";
import User from "@/models/User";
import bcrypt from "bcryptjs"; 
import { revalidatePath } from "next/cache";

async function getOrCreateAuthorId(authorName: string) {
  if (!authorName) return null;
  const cleanName = authorName.trim(); 
  let author = await User.findOne({ name: { $regex: new RegExp(`^${cleanName}$`, "i") }, role: "author" });
  if (author) return author._id;

  const slugName = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '');
  const uniqueId = Date.now().toString(36) + Math.random().toString(36).substring(2, 5); 
  const autoEmail = `${slugName}_${uniqueId}@author.boighor.com`;
  const defaultPassword = await bcrypt.hash("author1234", 10); 

  const newAuthor = await User.create({
    name: cleanName, email: autoEmail, password: defaultPassword, role: "author", 
  });
  return newAuthor._id;
}

// 💡 বুলেটপ্রুফ ক্যাটাগরি পার্সার
function fixCategories(data: any) {
  let catStr = "";
  if (data.category && typeof data.category === "string") catStr = data.category;
  else if (data.categories && typeof data.categories === "string") catStr = data.categories;
  else if (data.categories && Array.isArray(data.categories)) catStr = data.categories.join(", ");
  else if (data.category && Array.isArray(data.category)) catStr = data.category.join(", ");
  
  return {
    category: catStr, // ডাটাবেসে String হিসেবে সেভ করার জন্য
    categories: catStr.split(",").map((c: string) => c.trim()).filter(Boolean) // Array হিসেবে সেভ করার জন্য
  };
}

// ================= PUT METHOD (Edit Book) =================
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const data = await req.json();
    const { bookId, ...updateData } = data;

    await connectToDatabase();

    const admin = await User.findById(session.user.id).select("role").lean();
    if (admin?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    if (updateData.hardCopyStock !== undefined) {
      updateData.hardCopyStock = Number(updateData.hardCopyStock);
    }

    // 💡 ম্যাজিক ফিক্স: String এবং Array দুটোই পাঠানো হচ্ছে। আপনার মডেলে যেটা আছে, সেটা সেভ হবে!
    const fixedCats = fixCategories(updateData);
    updateData.category = fixedCats.category;
    updateData.categories = fixedCats.categories;

    const updatedBook = await Book.findByIdAndUpdate(
      bookId,
      { $set: updateData },
      { new: true } 
    );

    if (!updatedBook) return NextResponse.json({ message: "Book not found" }, { status: 404 });

    revalidatePath(`/books/${updatedBook.slug}`, 'page');
    revalidatePath(`/books/[slug]`, 'page');
    revalidatePath(`/books`, 'page');
    revalidatePath(`/`, 'layout');

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

// ================= POST METHOD (Add Book) =================
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

    const admin = await User.findById(session.user.id).select("role").lean();
    if (admin?.role !== "admin") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

    const body = await req.json();
    await connectToDatabase();

    // ----------------------------------------------------
    // লজিক ১: BULK ADD (CSV আপলোড)
    // ----------------------------------------------------
    if (body.books && Array.isArray(body.books)) {
      if (body.books.length === 0) return NextResponse.json({ message: "কোনো ডেটা পাওয়া যায়নি!" }, { status: 400 });

      const booksWithAuthor = [];

      for (const book of body.books) {
        const realAuthorId = await getOrCreateAuthorId(book.authorName);
        const fixedCats = fixCategories(book);

        const baseSlug = book.title ? book.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'book';
        const uniqueSlug = book.slug || `${baseSlug}-${Math.floor(Math.random() * 10000)}`;
        const defaultDescription = book.description || `${book.title} - ${book.authorName} এর লেখা একটি চমৎকার বই।`;

        booksWithAuthor.push({
          ...book,
          category: fixedCats.category,
          categories: fixedCats.categories,
          authorId: realAuthorId || session.user.id, 
          coverImage: book.coverImage || "https://placehold.co/400x600/e2e8f0/475569?text=No+Cover", 
          hardCopyAvailable: book.hardCopyStock > 0,
          slug: uniqueSlug,
          description: defaultDescription
        });
      }

      const insertedBooks = await Book.insertMany(booksWithAuthor);
      return NextResponse.json({ message: `${insertedBooks.length} টি বই সফলভাবে যুক্ত হয়েছে!`, insertedBooks }, { status: 201 });
    }

    // ----------------------------------------------------
    // লজিক ২: SINGLE ADD (ম্যানুয়াল ফরম সাবমিট)
    // ----------------------------------------------------
    else {
      const realAuthorId = await getOrCreateAuthorId(body.authorName);
      const fixedCats = fixCategories(body);

      const baseSlug = body.title ? body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : 'book';
      const uniqueSlug = body.slug || `${baseSlug}-${Math.floor(Math.random() * 10000)}`;

      const newBook = await Book.create({
        ...body,
        category: fixedCats.category,
        categories: fixedCats.categories,
        authorId: realAuthorId || session.user.id,
        slug: uniqueSlug,
      });

      return NextResponse.json({ message: "বই সফলভাবে যোগ করা হয়েছে!", book: newBook }, { status: 201 });
    }

  } catch (error) {
    console.error("Book Add Error:", error);
    return NextResponse.json({ message: "Failed to add book" }, { status: 500 });
  }
}
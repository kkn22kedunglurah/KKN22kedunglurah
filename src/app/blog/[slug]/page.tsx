import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import Link from "next/link";
import { FiArrowLeft, FiCalendar, FiUser } from "react-icons/fi";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeSanitize from "rehype-sanitize";

export const revalidate = 60;

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const supabase = await createClient();

  const { data: blog, error } = await supabase
    .from("blogs")
    .select("*, author:author_id(name)")
    .eq("slug", slug)
    .single();

  if (error || !blog) {
    notFound();
  }

  // Typecasting author to fix TS error since we join tables
  const authorData = blog.author as any;

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-24 bg-background">
        
        {/* Header Cover */}
        {blog.cover_image_url && (
          <div className="w-full h-[40vh] md:h-[50vh] relative overflow-hidden mb-12 border-b border-border">
            <div className="absolute inset-0 bg-background/20 backdrop-blur-[2px] z-10"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent z-10"></div>
            <img 
              src={blog.cover_image_url} 
              alt={blog.title} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="container-custom max-w-3xl relative z-20 -mt-24 md:-mt-32">
          
          <Link href="/blog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 bg-card/80 backdrop-blur-md px-4 py-2 rounded-full border border-border shadow-sm w-fit hover-lift">
            <FiArrowLeft /> Kembali ke Daftar
          </Link>

          <article className="glass p-6 md:p-12 rounded-3xl shadow-xl">
            <header className="mb-10 text-center md:text-left border-b border-border pb-8">
              <h1 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-6 leading-tight">
                {blog.title}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 text-sm text-muted-foreground font-medium">
                <div className="flex items-center gap-2">
                  <FiCalendar className="text-primary" />
                  <time dateTime={blog.created_at}>
                    {new Date(blog.created_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </time>
                </div>
                {authorData && authorData.name && (
                  <div className="flex items-center gap-2">
                    <FiUser className="text-primary" />
                    <span>Ditulis oleh {authorData.name}</span>
                  </div>
                )}
              </div>
            </header>

            {/* Markdown Content with Sanitize Protection */}
            <div className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-display prose-headings:font-bold prose-a:text-primary hover:prose-a:text-accent prose-img:rounded-xl">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeSanitize]}
              >
                {blog.content}
              </ReactMarkdown>
            </div>
          </article>
        </div>
      </main>
      <Footer />
    </>
  );
}

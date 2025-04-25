import { Link } from "@remix-run/react";

export default function ArticleTag({ tag }: { tag: string }) {
  return (
    <>
      <div>
        <Link
          to={`/topic/${tag}`}
          className="px-2 border border-[#7ec7d8]/50 bg-[#7ec7d8]/50 rounded-full text-xs font-light hover:bg-[#7ec7d8]/75"
        >
          {tag}
        </Link>
      </div>
    </>
  );
}

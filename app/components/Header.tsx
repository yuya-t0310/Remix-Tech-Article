import { Link } from "@remix-run/react";

export default function Header({ userId }: { userId: string | null }) {
  return (
    <div>
      <header>
        <Link to="/">Remix-Tech-Article</Link>
        <nav>
          <Link to="/">TOP</Link>
        </nav>
        {userId ? (
          <div>
            <nav>
              <Link to="/write">記事作成</Link>
            </nav>
            <nav>
              <Link to="/mypage">マイページ</Link>
            </nav>
            <nav>
              <Link to="/logout">ログアウト</Link>
            </nav>
          </div>
        ) : (
          <div>
            <nav>
              <Link to="/login">ログイン</Link>
            </nav>
            <nav>
              <Link to="/signup">サインアップ</Link>
            </nav>
          </div>
        )}
      </header>
    </div>
  );
}

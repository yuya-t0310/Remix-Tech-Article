import { Link } from "@remix-run/react";

export default function Header({ userId }: { userId: string | null }) {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Remix-Tech-Article
      </Link>
      {userId ? (
        <div className="flex space-x-4">
          <nav>
            <Link to="/write" className="hover:text-gray-400">
              記事作成
            </Link>
          </nav>
          <nav>
            <Link to="/mypage" className="hover:text-gray-400">
              マイページ
            </Link>
          </nav>
          <nav>
            <Link to="/logout" className="hover:text-gray-400">
              ログアウト
            </Link>
          </nav>
        </div>
      ) : (
        <div className="flex space-x-4">
          <nav>
            <Link to="/login" className="hover:text-gray-400">
              ログイン
            </Link>
          </nav>
          <nav>
            <Link to="/signup" className="hover:text-gray-400">
              サインアップ
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}

// bg-gray-800: 背景色をダークグレーに設定します。
// text-white: テキスト色を白に設定します。
// p-4: パディングを設定します。
// flex: フレックスボックスを使用してレイアウトを設定します。
// justify-between: 子要素を左右に配置します。
// items-center: 子要素を垂直方向に中央揃えにします。
// text-xl: テキストサイズを設定します。
// font-bold: フォントを太字に設定します。
// space-x-4: 子要素間の水平スペースを設定します。
// hover:text-gray-400: ホバー時のテキスト色を設定します。

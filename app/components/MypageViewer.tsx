import { useState } from "react";
import { Form } from "@remix-run/react";
import { Profile } from "../types/profileTypes";

function MypageViewer({
  profile,
  userId,
}: {
  profile: Profile;
  userId: string;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);
  return (
    <>
      <div>
        {isEditing ? (
          <Form method="post" onSubmit={() => setIsEditing(false)}>
            <div className="m-2">
              <div className="font-light">ユーザ名</div>
              <div>
                <input
                  type="text"
                  name="name"
                  value={name}
                  required
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ec7d8] focus:border-[#7ec7d8] outline-none transition-colors"
                />
              </div>
            </div>
            <div className="m-2">
              <div className="font-light">自己紹介</div>
              <div>
                <textarea
                  name="bio"
                  value={bio ? bio : ""}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ec7d8] focus:border-[#7ec7d8] outline-none transition-colors"
                />
              </div>
            </div>
            <input type="hidden" name="userId" value={userId} />
            <div className="m-2">
              <button
                type="submit"
                className="w-full bg-[#7ec7d8]/75 text-white font-medium py-2 px-4 rounded-lg hover:bg-[#7ec7d8] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                保存
              </button>
            </div>
          </Form>
        ) : (
          <>
            <div className="m-2">
              <div className="font-light">ユーザ名</div>
              <div>
                <input
                  type="text"
                  name="name"
                  value={name}
                  readOnly
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ec7d8] focus:border-[#7ec7d8] outline-none transition-colors"
                />
              </div>
            </div>
            <div className="m-2">
              <div className="font-light">自己紹介</div>
              <div>
                <textarea
                  name="bio"
                  value={bio ? bio : ""}
                  readOnly
                  disabled
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#7ec7d8] focus:border-[#7ec7d8] outline-none transition-colors"
                />
              </div>
            </div>
            <div className="m-2">
              <button
                onClick={() => setIsEditing(true)}
                className="w-full bg-[#7ec7d8]/75 text-white font-medium py-2 px-4 rounded-lg hover:bg-[#7ec7d8] transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                編集
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default MypageViewer;

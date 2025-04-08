export default function FlashMessage({
  flashMessage,
}: {
  flashMessage: {
    color: string;
    message: string;
  };
}) {
  // 正常と異常で背景色を変更
  let className = "bg-green-100 p-4 flex";
  if (flashMessage.color == "error") {
    className = "bg-red-100 p-4 flex";
  }
  return (
    <>
      <div className={className}>
        <p>{flashMessage.message}</p>
      </div>
    </>
  );
}

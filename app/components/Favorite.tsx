import { useFetcher } from "@remix-run/react";

export default function Favorite({ isFavorite }: { isFavorite: boolean }) {
  const fetcher = useFetcher();
  // Optimistic UIのため
  // Network Conditionを3Gにするとわかりやすい
  const favorite = fetcher.formData
    ? fetcher.formData.get("favorite") === "true"
    : isFavorite;
  return (
    <fetcher.Form method="post">
      <button name="favorite" value={favorite ? "false" : "true"}>
        {favorite ? "★" : "☆"}
      </button>
    </fetcher.Form>
  );
}

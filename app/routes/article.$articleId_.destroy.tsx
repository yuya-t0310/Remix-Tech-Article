import { ActionFunctionArgs } from "@remix-run/node";
import prisma from "../../lib/prisma";
import invariant from "tiny-invariant";
import { redirect } from "react-router";

export const action = async ({ params }: ActionFunctionArgs) => {
  invariant(params.articleId, "Missing articleId params");
  await prisma.article.delete({
    where: {
      id: parseInt(params.articleId),
    },
  });
  return redirect("/");
};

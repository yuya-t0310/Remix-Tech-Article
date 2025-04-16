import { Form } from "@remix-run/react";

function EditButtons() {
  return (
    <div className="flex justify-between">
      <div>
        <Form action="edit">
          <button
            type="submit"
            className="m-2 bg-blue-400 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            編集
          </button>
        </Form>
      </div>

      <div>
        <Form
          action="destroy"
          method="post"
          onSubmit={(event) => {
            const response = confirm("記事を削除します。よろしいですか?");
            if (!response) {
              event.preventDefault();
            }
          }}
        >
          <button
            type="submit"
            className="m-2 bg-red-400 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            削除
          </button>
        </Form>
      </div>
    </div>
  );
}

export default EditButtons;

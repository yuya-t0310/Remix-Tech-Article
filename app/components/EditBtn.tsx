import { Form } from "@remix-run/react";

function EditBtn() {
  return (
    <div>
      <Form action="edit">
        <button
          type="submit"
          className="bg-blue-400 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          編集
        </button>
      </Form>
    </div>
  );
}

export default EditBtn;

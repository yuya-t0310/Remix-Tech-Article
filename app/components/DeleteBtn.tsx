import { Form } from "@remix-run/react";

function DeleteBtn({ confirmMsg }: { confirmMsg: string }) {
  return (
    <div>
      <Form
        action="destroy"
        method="post"
        onSubmit={(event) => {
          const response = confirm(confirmMsg);
          if (!response) {
            event.preventDefault();
          }
        }}
      >
        <button
          type="submit"
          className="bg-red-400 text-white font-medium py-2 px-4 rounded-lg hover:bg-red-500 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          削除
        </button>
      </Form>
    </div>
  );
}

export default DeleteBtn;

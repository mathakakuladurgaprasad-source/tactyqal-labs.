"use client";
export default function DeleteButton() {
  return (
    <button
      onClick={(e) => { if (!confirm("Delete this post? This can’t be undone.")) e.preventDefault(); }}
      className="text-red-700 underline underline-offset-4">
      Delete
    </button>
  );
}
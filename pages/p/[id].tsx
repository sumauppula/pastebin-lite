import { GetServerSideProps } from "next";
import { redis } from "@/lib/redis";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = params?.id;
  const paste = await redis.get<any>(`paste:${id}`);

  if (!paste) {
    return {
      props: {
        error: "This paste is no longer available.",
      },
    };
  }

  return {
    props: {
      content: paste.content,
    },
  };
};

export default function PastePage({
  content,
  error,
}: {
  content?: string;
  error?: string;
}) {
  return (
    <main className="container">
      <div className="card">
        <h1 className="title">Paste</h1>

        {error ? (
          <p className="error">{error}</p>
        ) : (
          <pre className="paste-content">{content}</pre>
        )}
      </div>
    </main>
  );
}

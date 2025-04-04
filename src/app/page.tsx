// import { cookies } from "next/headers";
// import { Suspense } from "react";

import { headers } from "next/headers";
import { Suspense } from "react";

export default function Home() {
  return (
    <>
      <div className="min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
        <div>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque soluta similique, sapiente illum ipsa aspernatur quae nemo? Impedit est eius odit, deleniti similique aliquam ipsa autem, cupiditate, ratione numquam vel!
        </div>
        <Suspense fallback={"Loading..."}>
          <ContextLength />
        </Suspense>
      </div>
    </>
  );
}


async function ContextLength() {
  const store = await headers()
  const length = await fetch(`http://${ store.get('host') }/api/get-context-length`, {
    method: 'POST',
    body: JSON.stringify({
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Itaque soluta similique, sapiente illum ipsa aspernatur quae nemo? Impedit est eius odit, deleniti similique aliquam ipsa autem, cupiditate, ratione numquam vel!",
    }),
  })
  if (length.status === 429) {
    const json = await length.json()
    return <pre>
      {JSON.stringify(json, null, 2)}
    </pre>
  }
  if (!length.ok) {
    return <div>{length.status} {length.statusText}</div>
  }
  const json = await length.json()
  return <pre className="">
    {JSON.stringify(json, null, 2)}
  </pre>
}


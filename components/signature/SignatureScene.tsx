"use client";

import React, { Suspense, lazy } from "react";

// Lazy load the canvas component to prevent server-side evaluation
const SignatureSceneInner = lazy(() => import("./SignatureSceneInner"));

export default function SignatureScene({
  isInteracting,
}: {
  isInteracting: boolean;
}) {
  return (
    <Suspense fallback={<div className="w-full h-full" />}>
      <SignatureSceneInner isInteracting={isInteracting} />
    </Suspense>
  );
}

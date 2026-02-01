"use client";

import React, { Suspense, lazy } from "react";

const ThreeSceneInner = lazy(() => import("./ThreeSceneInner"));

export default function ThreeScene({
  scrollYProgress,
}: {
  scrollYProgress: any;
}) {
  return (
    <Suspense fallback={<div className="w-full h-full" />}>
      <ThreeSceneInner scrollYProgress={scrollYProgress} />
    </Suspense>
  );
}

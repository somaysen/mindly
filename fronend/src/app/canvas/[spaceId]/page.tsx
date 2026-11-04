import Canvas from "@/features/canvas/components/Canvas";

export default async function ThoughtSpaceCanvasPage({
  params,
}: {
  params: Promise<{ spaceId: string }>;
}) {
  const { spaceId } = await params;
  return <Canvas canvasId={spaceId} />;
}

import bannerAsset from "@/assets/triagon-banner.png.asset.json";

export function TriagonBanner({ className = "" }: { className?: string }) {
  return (
    <img
      src={bannerAsset.url}
      alt="Triagon Transit — Peace for the World"
      className={"w-full max-w-4xl rounded-xl border border-border shadow-[0_0_60px_-15px_oklch(0.78_0.18_220/0.6)] " + className}
    />
  );
}

export function TriagonMark({ className = "" }: { className?: string }) {
  return (
    <img
      src={bannerAsset.url}
      alt="Triagon Transit"
      className={"h-14 w-auto rounded-md " + className}
      style={{ objectFit: "cover", objectPosition: "left center" }}
    />
  );
}
import { Loader } from "@/components/shared";

function Loading() {
  return (
    <div className="flex size-full items-center justify-center">
      <div>
        <Loader />
      </div>
    </div>
  );
}

export default Loading;

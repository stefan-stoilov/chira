import { Loader } from "../loader";

export function PageLoader() {
  return (
    <div className="flex size-full items-center justify-center">
      <div>
        <Loader className="size-8" />
      </div>
    </div>
  );
}

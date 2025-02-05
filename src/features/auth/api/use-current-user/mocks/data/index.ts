import type { InferResponseType } from "hono";
import type { RpcType } from "@/lib/rpc";

export const success: InferResponseType<
  RpcType["auth"]["current"]["$get"],
  200
> = {
  $id: "test",
  $createdAt: "test",
  $updatedAt: "test",
  name: "Test",
  email: "test@test.com",
};

export const successStatus = { status: 200 };

export const error: InferResponseType<RpcType["auth"]["current"]["$get"], 500> =
  {
    error: "Error",
  };
export const errorStatus = { status: 500 };

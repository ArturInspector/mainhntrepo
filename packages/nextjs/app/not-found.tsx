"use client";

import Link from "next/link";
import { Button, Result } from "antd";

export default function NotFoundPage() {
  return (
    <Result
      status="404"
      title="Page not found"
      subTitle="The page you requested does not exist."
      extra={
        <Link href={"/"}>
          <Button type="primary">Back to home</Button>
        </Link>
      }
    />
  );
}
